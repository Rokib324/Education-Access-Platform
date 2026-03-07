import connectDB from "@/lib/db/mongodb";
import Course, { ICourse } from "@/lib/db/models/Course";
import { CreateCourseInput, UpdateCourseInput } from "@/lib/validators/course.schema";
import { Types } from "mongoose";

export interface CourseFilters {
    subject_id?: string;
    grade_id?: string;
    is_vocational?: boolean;
    created_by?: string;
}

export async function getCourses(filters: CourseFilters = {}) {
    await connectDB();
    const query: Record<string, unknown> = {};
    if (filters.subject_id) query.subject_id = new Types.ObjectId(filters.subject_id);
    if (filters.grade_id) query.grade_id = new Types.ObjectId(filters.grade_id);
    if (filters.is_vocational !== undefined) query.is_vocational = filters.is_vocational;
    if (filters.created_by) query.created_by = new Types.ObjectId(filters.created_by);

    return Course.find(query)
        .populate("subject_id", "subject_name")
        .populate("grade_id", "grade_name")
        .populate("created_by", "full_name email profile_photo")
        .sort({ createdAt: -1 })
        .lean();
}

export async function getCourseById(id: string) {
    await connectDB();
    return Course.findById(id)
        .populate("subject_id", "subject_name")
        .populate("grade_id", "grade_name")
        .populate("created_by", "full_name email profile_photo")
        .lean();
}

export async function createCourse(data: CreateCourseInput, userId: string): Promise<ICourse> {
    await connectDB();
    return Course.create({
        ...data,
        subject_id: new Types.ObjectId(data.subject_id),
        grade_id: new Types.ObjectId(data.grade_id),
        created_by: new Types.ObjectId(userId),
    });
}

export async function updateCourse(
    id: string,
    data: UpdateCourseInput,
    userId: string,
    isAdmin: boolean
) {
    await connectDB();
    const course = await Course.findById(id);
    if (!course) return null;
    if (!isAdmin && course.created_by.toString() !== userId) {
        throw new Error("FORBIDDEN");
    }
    Object.assign(course, data);
    if (data.subject_id) course.subject_id = new Types.ObjectId(data.subject_id);
    if (data.grade_id) course.grade_id = new Types.ObjectId(data.grade_id);
    return course.save();
}

export async function deleteCourse(id: string, userId: string, isAdmin: boolean) {
    await connectDB();
    const course = await Course.findById(id);
    if (!course) return null;
    if (!isAdmin && course.created_by.toString() !== userId) {
        throw new Error("FORBIDDEN");
    }
    await course.deleteOne();
    return true;
}
