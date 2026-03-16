import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
    full_name: string;
    email: string;
    password_hash: string;
    role_id: Types.ObjectId;
    profile_photo?: string;
    bio?: string;
    location?: string;
    notification_preferences: {
        course_updates: boolean;
        forum_mentions: boolean;
        live_classes: boolean;
    };
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
        notification_preferences: {
            course_updates: { type: Boolean, default: true },
            forum_mentions: { type: Boolean, default: true },
            live_classes: { type: Boolean, default: true },
        },
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
