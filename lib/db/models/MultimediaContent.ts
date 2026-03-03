import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMultimediaContent extends Document {
    lesson_id: Types.ObjectId;
    media_type: "video" | "audio" | "image" | "pdf" | "document";
    file_url: string;
    duration?: number; // in seconds, for video/audio
}

const MultimediaContentSchema = new Schema<IMultimediaContent>(
    {
        lesson_id: {
            type: Schema.Types.ObjectId,
            ref: "Lesson",
            required: true,
        },
        media_type: {
            type: String,
            required: true,
            enum: ["video", "audio", "image", "pdf", "document"],
        },
        file_url: { type: String, required: true, trim: true },
        duration: { type: Number, default: 0 }, // seconds
    },
    { timestamps: true }
);

MultimediaContentSchema.index({ lesson_id: 1 });

const MultimediaContent: Model<IMultimediaContent> =
    mongoose.models.MultimediaContent ||
    mongoose.model<IMultimediaContent>("MultimediaContent", MultimediaContentSchema);

export default MultimediaContent;
