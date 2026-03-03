import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISkill extends Document {
    skill_name: string;
    category: string;
}

const SkillSchema = new Schema<ISkill>(
    {
        skill_name: { type: String, required: true, unique: true, trim: true },
        category: {
            type: String,
            required: true,
            trim: true,
            // e.g. "vocational", "technical", "soft-skills", "entrepreneurship"
        },
    },
    { timestamps: true }
);

const Skill: Model<ISkill> =
    mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);

export default Skill;
