import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IStudyGroupMember extends Document {
    group_id: Types.ObjectId;
    user_id: Types.ObjectId;
}

const StudyGroupMemberSchema = new Schema<IStudyGroupMember>(
    {
        group_id: {
            type: Schema.Types.ObjectId,
            ref: "StudyGroup",
            required: true,
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// Prevent duplicate membership
StudyGroupMemberSchema.index({ group_id: 1, user_id: 1 }, { unique: true });
StudyGroupMemberSchema.index({ group_id: 1 });
StudyGroupMemberSchema.index({ user_id: 1 });

const StudyGroupMember: Model<IStudyGroupMember> =
    mongoose.models.StudyGroupMember ||
    mongoose.model<IStudyGroupMember>("StudyGroupMember", StudyGroupMemberSchema);

export default StudyGroupMember;
