import connectDB from "@/lib/db/mongodb";
import Attendence from "@/lib/db/models/Attendence";
import { Types } from "mongoose";

export async function markAttendance(classId: string, studentId: string) {
    await connectDB();
    // Upsert so a student can only have one attendance record per class
    return Attendence.findOneAndUpdate(
        {
            class_id: new Types.ObjectId(classId),
            student_id: new Types.ObjectId(studentId),
        },
        {
            $set: { marked_at: new Date(), status: "present" },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
}

export async function getAttendanceForClass(classId: string) {
    await connectDB();
    return Attendence.find({ class_id: new Types.ObjectId(classId) })
        .populate("student_id", "full_name email profile_photo")
        .sort({ attended_at: 1 })
        .lean();
}

export async function getAttendanceForStudent(studentId: string) {
    await connectDB();
    return Attendence.find({ student_id: new Types.ObjectId(studentId) })
        .populate("class_id", "class_title scheduled_start scheduled_end status")
        .sort({ attended_at: -1 })
        .lean();
}
