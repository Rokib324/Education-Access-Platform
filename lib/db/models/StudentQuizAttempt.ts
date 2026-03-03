import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IStudentQuizAttempt extends Document {
    quiz_id: Types.ObjectId;
    student_id: Types.ObjectId;
    score: number;
    attempted_at: Date;
    answers: {
        question_id: Types.ObjectId;
        selected_option_id?: Types.ObjectId;
        short_answer?: string;
        is_correct: boolean;
    }[];
}

const StudentQuizAttemptSchema = new Schema<IStudentQuizAttempt>(
    {
        quiz_id: {
            type: Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
        },
        student_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        score: { type: Number, required: true, default: 0 },
        attempted_at: { type: Date, default: Date.now },
        answers: [
            {
                question_id: { type: Schema.Types.ObjectId, ref: "QuestionBank" },
                selected_option_id: { type: Schema.Types.ObjectId, ref: "QuizOption", default: null },
                short_answer: { type: String, default: "" },
                is_correct: { type: Boolean, default: false },
            },
        ],
    },
    { timestamps: true }
);

StudentQuizAttemptSchema.index({ quiz_id: 1, student_id: 1 });
StudentQuizAttemptSchema.index({ student_id: 1 });

const StudentQuizAttempt: Model<IStudentQuizAttempt> =
    mongoose.models.StudentQuizAttempt ||
    mongoose.model<IStudentQuizAttempt>("StudentQuizAttempt", StudentQuizAttemptSchema);

export default StudentQuizAttempt;
