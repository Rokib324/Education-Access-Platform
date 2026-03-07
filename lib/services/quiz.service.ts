import connectDB from "@/lib/db/mongodb";
import Quiz from "@/lib/db/models/Quiz";
import QuestionBank from "@/lib/db/models/QuestionBank";
import QuizOption from "@/lib/db/models/QuizOption";
import StudentQuizAttempt from "@/lib/db/models/StudentQuizAttempt";
import { CreateQuizInput, SubmitAttemptInput } from "@/lib/validators/quiz.schema";
import { Types } from "mongoose";

export async function getQuizzesByCourse(courseId: string) {
    await connectDB();
    return Quiz.find({ course_id: new Types.ObjectId(courseId) })
        .populate("lesson_id", "title")
        .sort({ createdAt: -1 })
        .lean();
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

export async function submitQuizAttempt(
    quizId: string,
    studentId: string,
    body: SubmitAttemptInput
) {
    await connectDB();
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");

    // Auto-score: fetch correct option for each answer
    let score = 0;
    const scoredAnswers = [];

    for (const ans of body.answers) {
        let is_correct = false;
        if (ans.selected_option_id) {
            const option = await QuizOption.findById(ans.selected_option_id).lean();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            is_correct = !!(option && (option as any).is_correct);
        }
        if (is_correct) score++;
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
    const total = body.answers.length;
    const normalizedScore = total > 0 ? Math.round((score / total) * quiz.total_marks) : 0;

    return StudentQuizAttempt.create({
        quiz_id: new Types.ObjectId(quizId),
        student_id: new Types.ObjectId(studentId),
        score: normalizedScore,
        attempted_at: new Date(),
        answers: scoredAnswers,
    });
}

export async function getAttemptsByStudent(studentId: string) {
    await connectDB();
    return StudentQuizAttempt.find({ student_id: new Types.ObjectId(studentId) })
        .populate("quiz_id", "title total_marks pass_mark")
        .sort({ attempted_at: -1 })
        .lean();
}
