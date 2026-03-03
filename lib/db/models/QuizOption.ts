import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IQuizOption extends Document {
    question_id: Types.ObjectId;
    option_text: string;
    is_correct: boolean;
}

const QuizOptionSchema = new Schema<IQuizOption>(
    {
        question_id: {
            type: Schema.Types.ObjectId,
            ref: "QuestionBank",
            required: true,
        },
        option_text: { type: String, required: true, trim: true },
        is_correct: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
);

QuizOptionSchema.index({ question_id: 1 });

const QuizOption: Model<IQuizOption> =
    mongoose.models.QuizOption ||
    mongoose.model<IQuizOption>("QuizOption", QuizOptionSchema);

export default QuizOption;
