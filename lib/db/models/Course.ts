import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICourse extends Document {
    subject_id: Types.ObjectId;
    grade_id: Types.ObjectId;
    title: string;
    description?: string;
    thumbnail?: string;
    created_by: Types.ObjectId;
    is_vocational: boolean;
}

const CourseSchema = new Schema<ICourse>(
    {
        subject_id: {
            type: Schema.Types.ObjectId,
            ref: "Subjects",
            required: true,
        },
        grade_id: {
            type: Schema.Types.ObjectId,
            ref: "GradeLevel",
            required: true,
        },
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        thumbnail: { type: String, default: "" },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        is_vocational: { type: Boolean, default: false },
    },
    { timestamps: true }
);

CourseSchema.index({ subject_id: 1 });
CourseSchema.index({ grade_id: 1 });
CourseSchema.index({ created_by: 1 });
CourseSchema.index({ is_vocational: 1 });

const Course: Model<ICourse> =
    mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
