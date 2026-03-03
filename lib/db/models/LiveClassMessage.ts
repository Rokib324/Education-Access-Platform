import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ILiveClassMessage extends Document {
    class_id: Types.ObjectId;
    sender_id: Types.ObjectId;
    message_text: string;
    sent_at: Date;
}

const LiveClassMessageSchema = new Schema<ILiveClassMessage>(
    {
        class_id: {
            type: Schema.Types.ObjectId,
            ref: "VirtualClass",
            required: true,
        },
        sender_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message_text: { type: String, required: true, trim: true },
        sent_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

LiveClassMessageSchema.index({ class_id: 1, sent_at: 1 });
LiveClassMessageSchema.index({ sender_id: 1 });

const LiveClassMessage: Model<ILiveClassMessage> =
    mongoose.models.LiveClassMessage ||
    mongoose.model<ILiveClassMessage>("LiveClassMessage", LiveClassMessageSchema);

export default LiveClassMessage;
