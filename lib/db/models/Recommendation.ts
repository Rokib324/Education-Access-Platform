import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type RecommendedLevel = "beginner" | "intermediate" | "advanced";

export interface IRecommendation extends Document {
    student_id: Types.ObjectId;
    lesson_id: Types.ObjectId;
    recommended_level: RecommendedLevel;
    reason?: string;
}

const RecommendationSchema = new Schema<IRecommendation>(
    {
        student_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lesson_id: {
            type: Schema.Types.ObjectId,
            ref: "Lesson",
            required: true,
        },
        recommended_level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            required: true,
        },
        reason: { type: String, default: "" },
    },
    { timestamps: true }
);

RecommendationSchema.index({ student_id: 1 });
RecommendationSchema.index({ lesson_id: 1 });
RecommendationSchema.index({ student_id: 1, lesson_id: 1 }, { unique: true });

const Recommendation: Model<IRecommendation> =
    mongoose.models.Recommendation ||
    mongoose.model<IRecommendation>("Recommendation", RecommendationSchema);

export default Recommendation;
