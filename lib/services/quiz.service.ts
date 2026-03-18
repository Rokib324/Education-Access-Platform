import connectDB from "@/lib/db/mongodb";
import Quiz from "@/lib/db/models/Quiz";
import QuestionBank from "@/lib/db/models/QuestionBank";
import QuizOption from "@/lib/db/models/QuizOption";
import StudentQuizAttempt from "@/lib/db/models/StudentQuizAttempt";
import { CreateQuizInput, SubmitAttemptInput } from "@/lib/validators/quiz.schema";
import { Types } from "mongoose";

// ─── Quiz CRUD ────────────────────────────────────────────────────────────────

export async function getQuizzesByCourse(courseId: string) {
    await connectDB();
    const quizzes = await Quiz.find({ course_id: new Types.ObjectId(courseId) })
        .populate("lesson_id", "title")
        .sort({ createdAt: -1 })
        .lean();

    // Attach question count to each quiz
    const enriched = await Promise.all(
        quizzes.map(async (quiz) => {
            const questionCount = await QuestionBank.countDocuments({ quiz_id: quiz._id });
            return { ...quiz, questionCount };
        })
    );
    return enriched;
}

export async function getQuizzesForStudent(studentId: string, courseIds: string[]) {
    await connectDB();
    const quizzes = await Quiz.find({
        course_id: { $in: courseIds.map((id) => new Types.ObjectId(id)) },
    })
        .populate("course_id", "title")
        .populate("lesson_id", "title")
        .sort({ createdAt: -1 })
        .lean();

    // Attach question count and student's last attempt
    const enriched = await Promise.all(
        quizzes.map(async (quiz) => {
            const questionCount = await QuestionBank.countDocuments({ quiz_id: quiz._id });
            const lastAttempt = await StudentQuizAttempt.findOne({
                quiz_id: quiz._id,
                student_id: new Types.ObjectId(studentId),
            })
                .sort({ attempted_at: -1 })
                .lean();

            return {
                ...quiz,
                questionCount,
                lastAttempt: lastAttempt
                    ? {
                          score: lastAttempt.score,
                          attempted_at: lastAttempt.attempted_at,
                      }
                    : null,
            };
        })
    );
    return enriched;
}

export async function getQuizById(id: string) {
    await connectDB();
    const quiz = await Quiz.findById(id).lean();
    if (!quiz) return null;
    const questions = await QuestionBank.find({ quiz_id: new Types.ObjectId(id) }).lean();
    const questionIds = questions.map((q) => q._id);
    const options = await QuizOption.find({ question_id: { $in: questionIds } }).lean();
    return { quiz, questions, options };
}

export async function createQuiz(data: CreateQuizInput) {
    await connectDB();
    return Quiz.create({
        ...data,
        course_id: new Types.ObjectId(data.course_id),
        lesson_id: data.lesson_id ? new Types.ObjectId(data.lesson_id) : undefined,
    });
}

export async function updateQuiz(
    id: string,
    data: Partial<CreateQuizInput>,
    userId: string,
    isAdmin: boolean
) {
    await connectDB();
    const quiz = await Quiz.findById(id).populate("course_id");
    if (!quiz) return null;

    // Only the teacher who created the course can edit, or an admin
    // (We don't store created_by on Quiz, so we trust the caller to check from Course)
    if (!isAdmin) {
        const Course = (await import("@/lib/db/models/Course")).default;
        const course = await Course.findById(quiz.course_id);
        if (!course || course.created_by.toString() !== userId) {
            throw new Error("FORBIDDEN");
        }
    }

    Object.assign(quiz, {
        ...(data.title && { title: data.title }),
        ...(data.total_marks !== undefined && { total_marks: data.total_marks }),
        ...(data.pass_mark !== undefined && { pass_mark: data.pass_mark }),
        ...(data.time_limit_minutes !== undefined && { time_limit_minutes: data.time_limit_minutes }),
    });
    return quiz.save();
}

export async function deleteQuiz(id: string, userId: string, isAdmin: boolean) {
    await connectDB();
    const quiz = await Quiz.findById(id);
    if (!quiz) return null;

    if (!isAdmin) {
        const Course = (await import("@/lib/db/models/Course")).default;
        const course = await Course.findById(quiz.course_id);
        if (!course || course.created_by.toString() !== userId) {
            throw new Error("FORBIDDEN");
        }
    }

    // Cascade delete questions and options
    const questions = await QuestionBank.find({ quiz_id: new Types.ObjectId(id) }).lean();
    const questionIds = questions.map((q) => q._id);
    await QuizOption.deleteMany({ question_id: { $in: questionIds } });
    await QuestionBank.deleteMany({ quiz_id: new Types.ObjectId(id) });
    await StudentQuizAttempt.deleteMany({ quiz_id: new Types.ObjectId(id) });
    await quiz.deleteOne();
    return true;
}

// ─── Question Management ─────────────────────────────────────────────────────

export interface QuestionInput {
    question_text: string;
    question_type: "mcq" | "true_false" | "short_answer";
    marks: number;
    options?: { option_text: string; is_correct: boolean }[];
}

export async function addQuestion(quizId: string, data: QuestionInput) {
    await connectDB();
    const question = await QuestionBank.create({
        quiz_id: new Types.ObjectId(quizId),
        question_text: data.question_text,
        question_type: data.question_type,
        marks: data.marks,
    });

    if (data.options && data.options.length > 0) {
        await QuizOption.insertMany(
            data.options.map((opt) => ({
                question_id: question._id,
                option_text: opt.option_text,
                is_correct: opt.is_correct,
            }))
        );
    }

    const options = await QuizOption.find({ question_id: question._id }).lean();
    return { question, options };
}

export async function deleteQuestion(questionId: string) {
    await connectDB();
    await QuizOption.deleteMany({ question_id: new Types.ObjectId(questionId) });
    const question = await QuestionBank.findByIdAndDelete(questionId);
    return question ? true : null;
}

// ─── Quiz Submission & Scoring ────────────────────────────────────────────────

export async function submitQuizAttempt(
    quizId: string,
    studentId: string,
    body: SubmitAttemptInput
) {
    await connectDB();
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");

    // Get all questions to know marks per question
    const questions = await QuestionBank.find({ quiz_id: new Types.ObjectId(quizId) }).lean();
    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    let totalEarned = 0;
    let totalPossible = 0;
    const scoredAnswers = [];

    for (const ans of body.answers) {
        const question = questionMap.get(ans.question_id);
        const qMarks = question?.marks ?? 1;
        totalPossible += qMarks;

        let is_correct = false;
        if (ans.selected_option_id) {
            const option = await QuizOption.findById(ans.selected_option_id).lean();
            is_correct = !!(option && (option as { is_correct?: boolean }).is_correct);
        }
        if (is_correct) totalEarned += qMarks;

        scoredAnswers.push({
            question_id: new Types.ObjectId(ans.question_id),
            selected_option_id: ans.selected_option_id
                ? new Types.ObjectId(ans.selected_option_id)
                : undefined,
            short_answer: ans.short_answer || "",
            is_correct,
        });
    }

    // Normalize score to quiz total_marks
    const normalizedScore =
        totalPossible > 0
            ? Math.round((totalEarned / totalPossible) * quiz.total_marks)
            : 0;
    const passed = normalizedScore >= quiz.pass_mark;

    const attempt = await StudentQuizAttempt.create({
        quiz_id: new Types.ObjectId(quizId),
        student_id: new Types.ObjectId(studentId),
        score: normalizedScore,
        attempted_at: new Date(),
        answers: scoredAnswers,
    });

    return { attempt, normalizedScore, passed, totalMarks: quiz.total_marks, passMark: quiz.pass_mark };
}

export async function getAttemptsByStudent(studentId: string) {
    await connectDB();
    return StudentQuizAttempt.find({ student_id: new Types.ObjectId(studentId) })
        .populate("quiz_id", "title total_marks pass_mark course_id")
        .sort({ attempted_at: -1 })
        .lean();
}

// ─── Teacher: Results per quiz ────────────────────────────────────────────────

export async function getResultsByQuiz(quizId: string) {
    await connectDB();
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) return null;

    const attempts = await StudentQuizAttempt.find({ quiz_id: new Types.ObjectId(quizId) })
        .populate("student_id", "full_name email profile_photo")
        .sort({ attempted_at: -1 })
        .lean();

    const passCount = attempts.filter((a) => a.score >= quiz.pass_mark).length;
    const avgScore =
        attempts.length > 0
            ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)
            : 0;

    return { quiz, attempts, stats: { total: attempts.length, passCount, avgScore, passRate: attempts.length > 0 ? Math.round((passCount / attempts.length) * 100) : 0 } };
}

// ─── Teacher: Quiz stats across courses ──────────────────────────────────────

export async function getQuizStatsByCourses(courseIds: string[]) {
    await connectDB();
    const quizzes = await Quiz.find({
        course_id: { $in: courseIds.map((id) => new Types.ObjectId(id)) },
    }).lean();

    const quizIds = quizzes.map((q) => q._id);
    const attempts = await StudentQuizAttempt.find({ quiz_id: { $in: quizIds } }).lean();

    const avgScore =
        attempts.length > 0
            ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)
            : 0;

    return {
        totalQuizzes: quizzes.length,
        totalAttempts: attempts.length,
        avgScore,
    };
}
