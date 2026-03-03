import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IQuiz extends Document {
    course_id: Types.ObjectId;
    lesson_id?: Types.ObjectId;
    title: string;
    total_marks: number;
    pass_mark: number;
    time_limit_minutes?: number;
}

const QuizSchema = new Schema<IQuiz>(
    {
        course_id: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        lesson_id: {
            type: Schema.Types.ObjectId,
            ref: "Lesson",
            default: null,
        },
        title: { type: String, required: true, trim: true },
        total_marks: { type: Number, required: true, default: 100 },
        pass_mark: { type: Number, required: true, default: 50 },
        time_limit_minutes: { type: Number, default: 30 },
    },
    { timestamps: true }
);

QuizSchema.index({ course_id: 1 });
QuizSchema.index({ lesson_id: 1 });

const Quiz: Model<IQuiz> =
    mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
