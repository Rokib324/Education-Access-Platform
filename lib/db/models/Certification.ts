import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICertification extends Document {
    course_id: Types.ObjectId;
    student_id: Types.ObjectId;
    issued_at: Date;
}

const CertificationSchema = new Schema<ICertification>(
    {
        course_id: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        student_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        issued_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// One certificate per student per course
CertificationSchema.index({ course_id: 1, student_id: 1 }, { unique: true });
CertificationSchema.index({ student_id: 1 });

const Certification: Model<ICertification> =
    mongoose.models.Certification ||
    mongoose.model<ICertification>("Certification", CertificationSchema);

export default Certification;
