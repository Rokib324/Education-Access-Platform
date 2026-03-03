import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGradeLevel extends Document {
    grade_name: string;
}

const GradeLevelSchema = new Schema<IGradeLevel>(
    {
        grade_name: { type: String, required: true, unique: true, trim: true },
    },
    { timestamps: true }
);

const GradeLevel: Model<IGradeLevel> =
    mongoose.models.GradeLevel ||
    mongoose.model<IGradeLevel>("GradeLevel", GradeLevelSchema);

export default GradeLevel;
