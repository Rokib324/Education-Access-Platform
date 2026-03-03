import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IVirtualClassSession extends Document {
    class_id: Types.ObjectId;
    started_at: Date;
    ended_at?: Date;
    duration_minutes?: number;
}

const VirtualClassSessionSchema = new Schema<IVirtualClassSession>(
    {
        class_id: {
            type: Schema.Types.ObjectId,
            ref: "VirtualClass",
            required: true,
        },
        started_at: { type: Date, default: Date.now },
        ended_at: { type: Date, default: null },
        duration_minutes: { type: Number, default: 0 },
    },
    { timestamps: true }
);

VirtualClassSessionSchema.index({ class_id: 1 });

const VirtualClassSession: Model<IVirtualClassSession> =
    mongoose.models.VirtualClassSession ||
    mongoose.model<IVirtualClassSession>("VirtualClassSession", VirtualClassSessionSchema);

export default VirtualClassSession;
