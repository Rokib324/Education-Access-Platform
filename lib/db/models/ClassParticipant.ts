import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IClassParticipant extends Document {
    class_id: Types.ObjectId;
    user_id: Types.ObjectId;
    role: "host" | "co-host" | "student";
}

const ClassParticipantSchema = new Schema<IClassParticipant>(
    {
        class_id: {
            type: Schema.Types.ObjectId,
            ref: "VirtualClass",
            required: true,
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["host", "co-host", "student"],
            default: "student",
        },
    },
    { timestamps: true }
);

ClassParticipantSchema.index({ class_id: 1, user_id: 1 }, { unique: true });
ClassParticipantSchema.index({ class_id: 1 });

const ClassParticipant: Model<IClassParticipant> =
    mongoose.models.ClassParticipant ||
    mongoose.model<IClassParticipant>("ClassParticipant", ClassParticipantSchema);

export default ClassParticipant;
