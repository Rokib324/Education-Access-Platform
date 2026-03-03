import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubject extends Document {
    subject_name: string;
    description?: string;
}

const SubjectSchema = new Schema<ISubject>(
    {
        subject_name: { type: String, required: true, unique: true, trim: true },
        description: { type: String, default: "" },
    },
    { timestamps: true }
);

const Subjects: Model<ISubject> =
    mongoose.models.Subjects || mongoose.model<ISubject>("Subjects", SubjectSchema);

export default Subjects;
