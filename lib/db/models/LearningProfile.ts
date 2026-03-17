import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ILearningProfile extends Document {
    user_id: Types.ObjectId;
    learning_style: "visual" | "auditory" | "reading" | "kinesthetic";
    current_level: "beginner" | "intermediate" | "advanced";
    strengths: string[];
    weaknesses: string[];
    interests: string[];
}

const LearningProfileSchema = new Schema<ILearningProfile>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        learning_style: {
            type: String,
            enum: ["visual", "auditory", "reading", "kinesthetic"],
            default: "visual",
        },
        current_level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner",
        },
        strengths: [{ type: String }],
        weaknesses: [{ type: String }],
        interests: [{ type: String, trim: true }],
    },
    { timestamps: true }
);

LearningProfileSchema.index({ user_id: 1 });

const LearningProfile: Model<ILearningProfile> =
    mongoose.models.LearningProfile ||
    mongoose.model<ILearningProfile>("LearningProfile", LearningProfileSchema);

export default LearningProfile;
