import connectDB from "@/lib/db/mongodb";
import Lesson from "@/lib/db/models/Lesson";
import LessonProgress from "@/lib/db/models/LessonProgress";
import { CreateLessonInput, UpdateLessonInput } from "@/lib/validators/lesson.schema";
import { Types } from "mongoose";

export async function getLessonsByCourse(courseId: string) {
    await connectDB();
    return Lesson.find({ course_id: new Types.ObjectId(courseId) })
        .sort({ sequence_no: 1 })
        .lean();
}

export async function getLessonById(id: string) {
    await connectDB();
    return Lesson.findById(id).lean();
}

export async function createLesson(data: CreateLessonInput) {
    await connectDB();
    return Lesson.create({
        ...data,
        course_id: new Types.ObjectId(data.course_id),
    });
}

export async function updateLesson(id: string, data: UpdateLessonInput) {
    await connectDB();
    return Lesson.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
}

export async function deleteLesson(id: string) {
    await connectDB();
    const lesson = await Lesson.findByIdAndDelete(id);
    return lesson ? true : null;
}

export async function upsertLessonProgress(
    lessonId: string,
    studentId: string,
    completion_percentage: number
) {
    await connectDB();
    return LessonProgress.findOneAndUpdate(
        {
            lesson_id: new Types.ObjectId(lessonId),
            student_id: new Types.ObjectId(studentId),
        },
        {
            $set: { completion_percentage, last_accessed: new Date() },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
}

export async function getProgressForStudent(studentId: string) {
    await connectDB();
    return LessonProgress.find({ student_id: new Types.ObjectId(studentId) })
        .populate("lesson_id", "title course_id")
        .lean();
}
