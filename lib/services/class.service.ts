import connectDB from "@/lib/db/mongodb";
import VirtualClass from "@/lib/db/models/VirtualClass";
import { Types } from "mongoose";

export interface ClassFilters {
    course_id?: string;
    teacher_id?: string;
    status?: string;
}

export async function getVirtualClasses(filters: ClassFilters = {}) {
    await connectDB();
    const query: Record<string, unknown> = {};
    if (filters.course_id) query.course_id = new Types.ObjectId(filters.course_id);
    if (filters.teacher_id) query.teacher_id = new Types.ObjectId(filters.teacher_id);
    if (filters.status) query.status = filters.status;

    return VirtualClass.find(query)
        .populate("course_id", "title")
        .populate("teacher_id", "full_name email profile_photo")
        .sort({ scheduled_start: 1 })
        .lean();
}

export async function getClassById(id: string) {
    await connectDB();
    return VirtualClass.findById(id)
        .populate("course_id", "title")
        .populate("teacher_id", "full_name email profile_photo")
        .lean();
}

export async function createVirtualClass(data: {
    course_id: string;
    teacher_id: string;
    class_title: string;
    scheduled_start: string | Date;
    scheduled_end: string | Date;
    meeting_link: string;
}) {
    await connectDB();
    return VirtualClass.create({
        course_id: new Types.ObjectId(data.course_id),
        teacher_id: new Types.ObjectId(data.teacher_id),
        class_title: data.class_title,
        scheduled_start: new Date(data.scheduled_start),
        scheduled_end: new Date(data.scheduled_end),
        meeting_link: data.meeting_link,
        status: "scheduled",
    });
}

export async function updateClassStatus(
    id: string,
    status: "scheduled" | "live" | "completed" | "cancelled"
) {
    await connectDB();
    return VirtualClass.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, runValidators: true }
    ).lean();
}

export async function updateVirtualClass(
    id: string,
    data: Partial<{
        class_title: string;
        scheduled_start: string | Date;
        scheduled_end: string | Date;
        meeting_link: string;
        status: string;
    }>,
    userId: string,
    isAdmin: boolean
) {
    await connectDB();
    const vc = await VirtualClass.findById(id);
    if (!vc) return null;
    if (!isAdmin && vc.teacher_id.toString() !== userId) throw new Error("FORBIDDEN");
    Object.assign(vc, data);
    if (data.scheduled_start) vc.scheduled_start = new Date(data.scheduled_start);
    if (data.scheduled_end) vc.scheduled_end = new Date(data.scheduled_end);
    return vc.save();
}
