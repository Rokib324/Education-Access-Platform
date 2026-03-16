import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
    full_name: string;
    email: string;
    password_hash: string;
    role_id: Types.ObjectId;
    profile_photo?: string;
    bio?: string;
    location?: string;
    created_at: Date;
}

const UserSchema = new Schema<IUser>(
    {
        full_name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password_hash: { type: String, required: true },
        role_id: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
        profile_photo: { type: String, default: "" },
        bio: { type: String, default: "" },
        location: { type: String, default: "" },
        created_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Index for fast email lookup
UserSchema.index({ email: 1 });
UserSchema.index({ role_id: 1 });

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
