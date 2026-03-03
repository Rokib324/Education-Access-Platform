import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICourseSkill extends Document {
    course_id: Types.ObjectId;
    skill_id: Types.ObjectId;
}

const CourseSkillSchema = new Schema<ICourseSkill>(
    {
        course_id: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        skill_id: {
            type: Schema.Types.ObjectId,
            ref: "Skill",
            required: true,
        },
    },
    { timestamps: true }
);

// Prevent duplicate course-skill pairs
CourseSkillSchema.index({ course_id: 1, skill_id: 1 }, { unique: true });

const CourseSkill: Model<ICourseSkill> =
    mongoose.models.CourseSkill ||
    mongoose.model<ICourseSkill>("CourseSkill", CourseSkillSchema);

export default CourseSkill;
