import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IOfflineDownload extends Document {
    user_id: Types.ObjectId;
    lesson_id: Types.ObjectId;
    downloaded_at: Date;
    last_accessed_at: Date;
    sync_status: "synced" | "pending" | "failed";
}

const OfflineDownloadSchema = new Schema<IOfflineDownload>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lesson_id: {
            type: Schema.Types.ObjectId,
            ref: "Lesson",
            required: true,
        },
        downloaded_at: { type: Date, default: Date.now },
        last_accessed_at: { type: Date, default: Date.now },
        sync_status: {
            type: String,
            enum: ["synced", "pending", "failed"],
            default: "synced",
        },
    },
    { timestamps: true }
);

// One download record per user per lesson
OfflineDownloadSchema.index({ user_id: 1, lesson_id: 1 }, { unique: true });
OfflineDownloadSchema.index({ user_id: 1 });

const OfflineDownload: Model<IOfflineDownload> =
    mongoose.models.OfflineDownload ||
    mongoose.model<IOfflineDownload>("OfflineDownload", OfflineDownloadSchema);

export default OfflineDownload;
