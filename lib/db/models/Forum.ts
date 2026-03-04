import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IForum extends Document {
    title: string;
    description?: string;
    created_by: Types.ObjectId;
}

const ForumSchema = new Schema<IForum>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

ForumSchema.index({ created_by: 1 });
ForumSchema.index({ title: "text" });

const Forum: Model<IForum> =
    mongoose.models.Forum || mongoose.model<IForum>("Forum", ForumSchema);

export default Forum;
