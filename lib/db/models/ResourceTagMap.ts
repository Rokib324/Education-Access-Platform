import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IResourceTagMap extends Document {
    resource_id: Types.ObjectId;
    tag_id: Types.ObjectId;
}

const ResourceTagMapSchema = new Schema<IResourceTagMap>(
    {
        resource_id: {
            type: Schema.Types.ObjectId,
            ref: "Resource",
            required: true,
        },
        tag_id: {
            type: Schema.Types.ObjectId,
            ref: "ResourceTag",
            required: true,
        },
    },
    { timestamps: true }
);

// No duplicate tag per resource
ResourceTagMapSchema.index({ resource_id: 1, tag_id: 1 }, { unique: true });
ResourceTagMapSchema.index({ resource_id: 1 });
ResourceTagMapSchema.index({ tag_id: 1 });

const ResourceTagMap: Model<IResourceTagMap> =
    mongoose.models.ResourceTagMap ||
    mongoose.model<IResourceTagMap>("ResourceTagMap", ResourceTagMapSchema);

export default ResourceTagMap;
