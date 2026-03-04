import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPost extends Document {
    forum_id: Types.ObjectId;
    author_id: Types.ObjectId;
    title: string;
    content: string;
}

const PostSchema = new Schema<IPost>(
    {
        forum_id: {
            type: Schema.Types.ObjectId,
            ref: "Forum",
            required: true,
        },
        author_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

PostSchema.index({ forum_id: 1 });
PostSchema.index({ author_id: 1 });
PostSchema.index({ title: "text", content: "text" });

const Post: Model<IPost> =
    mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
