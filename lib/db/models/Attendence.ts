import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAttendance extends Document {
    class_id: Types.ObjectId;
    student_id: Types.ObjectId;
    status: "present" | "absent" | "late";
    marked_at: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
    {
        class_id: {
            type: Schema.Types.ObjectId,
            ref: "VirtualClass",
            required: true,
        },
        student_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["present", "absent", "late"],
            default: "present",
        },
        marked_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// One attendance record per student per class
AttendanceSchema.index({ class_id: 1, student_id: 1 }, { unique: true });
AttendanceSchema.index({ student_id: 1 });
AttendanceSchema.index({ class_id: 1 });

const Attendence: Model<IAttendance> =
    mongoose.models.Attendence ||
    mongoose.model<IAttendance>("Attendence", AttendanceSchema);

export default Attendence;
