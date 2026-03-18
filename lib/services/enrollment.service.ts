import connectDB from "@/lib/db/mongodb";
import Enrollment from "@/lib/db/models/Enrollment";
import Lesson from "@/lib/db/models/Lesson";
import LessonProgress from "@/lib/db/models/LessonProgress";
import { Types } from "mongoose";

// ─── Enroll a student in a course ─────────────────────────────────────────────
export async function enrollStudent(studentId: string, courseId: string) {
    await connectDB();
    // Will throw if uniqueness violated (already enrolled)
    return Enrollment.create({
        student_id: new Types.ObjectId(studentId),
        course_id: new Types.ObjectId(courseId),
        status: "active",
    });
}

// ─── Unenroll (drop) a student from a course ──────────────────────────────────
export async function unenrollStudent(enrollmentId: string, studentId: string) {
    await connectDB();
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return null;
    if (enrollment.student_id.toString() !== studentId) {
        throw new Error("FORBIDDEN");
    }
    await enrollment.deleteOne();
    return true;
}

// ─── Get enrollment status for one student + course ───────────────────────────
export async function getEnrollmentStatus(studentId: string, courseId: string) {
    await connectDB();
    return Enrollment.findOne({
        student_id: new Types.ObjectId(studentId),
        course_id: new Types.ObjectId(courseId),
    }).lean();
}

// ─── Get all enrollments for a student (with course + progress) ───────────────
export async function getEnrollmentsByStudent(studentId: string) {
    await connectDB();

    const enrollments = await Enrollment.find({
        student_id: new Types.ObjectId(studentId),
        status: { $ne: "dropped" },
    })
        .populate({
            path: "course_id",
            populate: [
                { path: "subject_id", select: "subject_name" },
                { path: "grade_id", select: "grade_name" },
                { path: "created_by", select: "full_name profile_photo" },
            ],
        })
        .sort({ enrolled_at: -1 })
        .lean();

    // Attach progress summary to each enrollment
    const enriched = await Promise.all(
        enrollments.map(async (enroll) => {
            const courseId = (enroll.course_id as { _id: Types.ObjectId })._id;
            const lessons = await Lesson.find({ course_id: courseId }).lean();
            const lessonIds = lessons.map((l) => l._id);

            const progress = await LessonProgress.find({
                student_id: new Types.ObjectId(studentId),
                lesson_id: { $in: lessonIds },
            }).lean();

            const completedLessons = progress.filter(
                (p) => p.completion_percentage >= 100
            ).length;
            const totalLessons = lessons.length;
            const overallPercent =
                totalLessons === 0
                    ? 0
                    : Math.round(
                          progress.reduce(
                              (sum, p) => sum + p.completion_percentage,
                              0
                          ) / totalLessons
                      );

            return {
                ...enroll,
                progress: {
                    totalLessons,
                    completedLessons,
                    overallPercent,
                },
            };
        })
    );

    return enriched;
}

// ─── Get all enrolled students for a course (teacher/admin) ───────────────────
export async function getEnrollmentsByCourse(courseId: string) {
    await connectDB();

    const enrollments = await Enrollment.find({
        course_id: new Types.ObjectId(courseId),
        status: { $ne: "dropped" },
    })
        .populate("student_id", "full_name email profile_photo")
        .sort({ enrolled_at: -1 })
        .lean();

    const lessons = await Lesson.find({
        course_id: new Types.ObjectId(courseId),
    }).lean();

    const enriched = await Promise.all(
        enrollments.map(async (enroll) => {
            const studentId = (enroll.student_id as { _id: Types.ObjectId })._id;

            const progress = await LessonProgress.find({
                student_id: studentId,
                lesson_id: { $in: lessons.map((l) => l._id) },
            }).lean();

            const completedLessons = progress.filter(
                (p) => p.completion_percentage >= 100
            ).length;
            const overallPercent =
                lessons.length === 0
                    ? 0
                    : Math.round(
                          progress.reduce(
                              (sum, p) => sum + p.completion_percentage,
                              0
                          ) / lessons.length
                      );

            return {
                ...enroll,
                progress: {
                    totalLessons: lessons.length,
                    completedLessons,
                    overallPercent,
                },
            };
        })
    );

    return enriched;
}
