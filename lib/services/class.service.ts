import connectDB from "@/lib/db/mongodb";
import VirtualClass from "@/lib/db/models/VirtualClass";
import VirtualClassSession from "@/lib/db/models/VirtualClassSession";
import LiveClassMessage from "@/lib/db/models/LiveClassMessage";
import Attendence from "@/lib/db/models/Attendence";
import "@/lib/db/models/User";
import "@/lib/db/models/Course";
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

export async function startClassSession(classId: string) {
    await connectDB();
    await updateClassStatus(classId, "live");
    return VirtualClassSession.create({
        class_id: new Types.ObjectId(classId),
        started_at: new Date(),
    });
}

export async function endClassSession(classId: string) {
    await connectDB();
    const session = await VirtualClassSession.findOne({ class_id: new Types.ObjectId(classId), ended_at: null }).sort({ started_at: -1 });
    if (!session) return null;
    
    session.ended_at = new Date();
    const durationMs = session.ended_at.getTime() - session.started_at.getTime();
    session.duration_minutes = Math.floor(durationMs / 60000);
    await session.save();

    await updateClassStatus(classId, "completed");
    return session;
}

export async function getClassMessages(classId: string) {
    await connectDB();
    return LiveClassMessage.find({ class_id: new Types.ObjectId(classId) })
        .populate("sender_id", "full_name profile_photo")
        .sort({ sent_at: 1 })
        .lean();
}

export async function sendClassMessage(classId: string, senderId: string, messageText: string) {
    await connectDB();
    const msg = await LiveClassMessage.create({
        class_id: new Types.ObjectId(classId),
        sender_id: new Types.ObjectId(senderId),
        message_text: messageText,
    });
    return LiveClassMessage.findById(msg._id).populate("sender_id", "full_name profile_photo").lean();
}

export async function getAttendanceByClass(classId: string) {
    await connectDB();
    return Attendence.find({ class_id: new Types.ObjectId(classId) })
        .populate("student_id", "full_name email profile_photo")
        .sort({ marked_at: -1 })
        .lean();
}

export async function markAttendance(
    classId: string,
    studentId: string,
    status: "present" | "absent" | "late"
) {
    await connectDB();
    return Attendence.findOneAndUpdate(
        {
            class_id: new Types.ObjectId(classId),
            student_id: new Types.ObjectId(studentId),
        },
        {
            $set: { status, marked_at: new Date() },
        },
        { new: true, upsert: true, runValidators: true }
    )
        .populate("student_id", "full_name email profile_photo")
        .lean();
}

