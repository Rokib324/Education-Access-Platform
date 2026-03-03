import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ILessonProgress extends Document {
    lesson_id: Types.ObjectId;
    student_id: Types.ObjectId;
    completion_percentage: number;
    last_accessed: Date;
}

const LessonProgressSchema = new Schema<ILessonProgress>(
    {
        lesson_id: {
            type: Schema.Types.ObjectId,
            ref: "Lesson",
            required: true,
        },
        student_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        completion_percentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        last_accessed: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Each student has one progress record per lesson
LessonProgressSchema.index({ lesson_id: 1, student_id: 1 }, { unique: true });
LessonProgressSchema.index({ student_id: 1 });

const LessonProgress: Model<ILessonProgress> =
    mongoose.models.LessonProgress ||
    mongoose.model<ILessonProgress>("LessonProgress", LessonProgressSchema);

export default LessonProgress;
