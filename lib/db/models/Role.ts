import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRole extends Document {
    role_name: string;
}

const RoleSchema = new Schema<IRole>(
    {
        role_name: {
            type: String,
            required: true,
            unique: true,
            enum: ["admin", "teacher", "student"],
            trim: true,
        },
    },
    { timestamps: true }
);

const Role: Model<IRole> =
    mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema);

export default Role;
