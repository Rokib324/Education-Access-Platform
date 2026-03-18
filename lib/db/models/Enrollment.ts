import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IEnrollment extends Document {
    student_id: Types.ObjectId;
    course_id: Types.ObjectId;
    enrolled_at: Date;
    completed_at?: Date;
    status: "active" | "completed" | "dropped";
}

const EnrollmentSchema = new Schema<IEnrollment>(
    {
        student_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course_id: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        enrolled_at: { type: Date, default: Date.now },
        completed_at: { type: Date },
        status: {
            type: String,
            enum: ["active", "completed", "dropped"],
            default: "active",
        },
    },
    { timestamps: true }
);

// One enrollment per student per course
EnrollmentSchema.index({ student_id: 1, course_id: 1 }, { unique: true });
EnrollmentSchema.index({ student_id: 1 });
EnrollmentSchema.index({ course_id: 1 });
EnrollmentSchema.index({ status: 1 });

const Enrollment: Model<IEnrollment> =
    mongoose.models.Enrollment ||
    mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);

export default Enrollment;
