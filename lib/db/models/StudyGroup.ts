import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IStudyGroup extends Document {
    course_id: Types.ObjectId;
    group_name: string;
    created_by: Types.ObjectId;
}

const StudyGroupSchema = new Schema<IStudyGroup>(
    {
        course_id: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        group_name: { type: String, required: true, trim: true },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

StudyGroupSchema.index({ course_id: 1 });
StudyGroupSchema.index({ created_by: 1 });

const StudyGroup: Model<IStudyGroup> =
    mongoose.models.StudyGroup ||
    mongoose.model<IStudyGroup>("StudyGroup", StudyGroupSchema);

export default StudyGroup;
