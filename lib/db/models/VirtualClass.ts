import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IVirtualClass extends Document {
    course_id: Types.ObjectId;
    teacher_id: Types.ObjectId;
    class_title: string;
    scheduled_start: Date;
    scheduled_end: Date;
    meeting_link: string;
    status: "scheduled" | "live" | "completed" | "cancelled";
}

const VirtualClassSchema = new Schema<IVirtualClass>(
    {
        course_id: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        teacher_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        class_title: { type: String, required: true, trim: true },
        scheduled_start: { type: Date, required: true },
        scheduled_end: { type: Date, required: true },
        meeting_link: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ["scheduled", "live", "completed", "cancelled"],
            default: "scheduled",
        },
    },
    { timestamps: true }
);

VirtualClassSchema.index({ course_id: 1 });
VirtualClassSchema.index({ teacher_id: 1 });
VirtualClassSchema.index({ status: 1 });
VirtualClassSchema.index({ scheduled_start: 1 });

const VirtualClass: Model<IVirtualClass> =
    mongoose.models.VirtualClass ||
    mongoose.model<IVirtualClass>("VirtualClass", VirtualClassSchema);

export default VirtualClass;
