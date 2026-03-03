import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IResource extends Document {
    title: string;
    description?: string;
    resource_type: "pdf" | "video" | "audio" | "link" | "document" | "image";
    file_url: string;
    visibility: "public" | "private" | "course-only";
    created_by: Types.ObjectId;
    subject_id?: Types.ObjectId;
}

const ResourceSchema = new Schema<IResource>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        resource_type: {
            type: String,
            required: true,
            enum: ["pdf", "video", "audio", "link", "document", "image"],
        },
        file_url: { type: String, required: true, trim: true },
        visibility: {
            type: String,
            enum: ["public", "private", "course-only"],
            default: "public",
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subject_id: {
            type: Schema.Types.ObjectId,
            ref: "Subjects",
            default: null,
        },
    },
    { timestamps: true }
);

ResourceSchema.index({ created_by: 1 });
ResourceSchema.index({ subject_id: 1 });
ResourceSchema.index({ resource_type: 1 });
ResourceSchema.index({ visibility: 1 });

const Resource: Model<IResource> =
    mongoose.models.Resource ||
    mongoose.model<IResource>("Resource", ResourceSchema);

export default Resource;
