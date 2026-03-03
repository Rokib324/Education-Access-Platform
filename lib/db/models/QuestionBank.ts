import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IQuestionBank extends Document {
    quiz_id: Types.ObjectId;
    question_text: string;
    question_type: "mcq" | "true_false" | "short_answer";
    marks: number;
}

const QuestionBankSchema = new Schema<IQuestionBank>(
    {
        quiz_id: {
            type: Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
        },
        question_text: { type: String, required: true, trim: true },
        question_type: {
            type: String,
            required: true,
            enum: ["mcq", "true_false", "short_answer"],
            default: "mcq",
        },
        marks: { type: Number, required: true, default: 1 },
    },
    { timestamps: true }
);

QuestionBankSchema.index({ quiz_id: 1 });

const QuestionBank: Model<IQuestionBank> =
    mongoose.models.QuestionBank ||
    mongoose.model<IQuestionBank>("QuestionBank", QuestionBankSchema);

export default QuestionBank;
