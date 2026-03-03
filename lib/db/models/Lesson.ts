import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ILesson extends Document {
    course_id: Types.ObjectId;
    title: string;
    content_type: "video" | "pdf" | "text" | "audio" | "interactive";
    difficulty_level: "easy" | "medium" | "hard";
    sequence_no: number;
}

const LessonSchema = new Schema<ILesson>(
    {
        course_id: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        title: { type: String, required: true, trim: true },
        content_type: {
            type: String,
            required: true,
            enum: ["video", "pdf", "text", "audio", "interactive"],
            default: "text",
        },
        difficulty_level: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "easy",
        },
        sequence_no: { type: Number, required: true, default: 1 },
    },
    { timestamps: true }
);

LessonSchema.index({ course_id: 1 });
LessonSchema.index({ course_id: 1, sequence_no: 1 });

const Lesson: Model<ILesson> =
    mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema);

export default Lesson;
