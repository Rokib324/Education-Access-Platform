import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IComment extends Document {
    post_id: Types.ObjectId;
    user_id: Types.ObjectId;
    comment_text: string;
}

const CommentSchema = new Schema<IComment>(
    {
        post_id: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        comment_text: { type: String, required: true },
    },
    { timestamps: true }
);

CommentSchema.index({ post_id: 1 });
CommentSchema.index({ user_id: 1 });

const Comment: Model<IComment> =
    mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
