import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResourceTag extends Document {
    tag_name: string;
}

const ResourceTagSchema = new Schema<IResourceTag>(
    {
        tag_name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const ResourceTag: Model<IResourceTag> =
    mongoose.models.ResourceTag ||
    mongoose.model<IResourceTag>("ResourceTag", ResourceTagSchema);

export default ResourceTag;
