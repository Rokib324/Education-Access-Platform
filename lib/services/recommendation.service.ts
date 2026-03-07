import connectDB from "@/lib/db/mongodb";
import Recommendation from "@/lib/db/models/Recommendation";
import { Types } from "mongoose";

export async function getRecommendationsForStudent(studentId: string) {
    await connectDB();
    return Recommendation.find({ student_id: new Types.ObjectId(studentId) })
        .populate("lesson_id", "title content_type difficulty_level course_id")
        .sort({ createdAt: -1 })
        .lean();
}

export async function createRecommendation(data: {
    student_id: string;
    lesson_id: string;
    recommended_level: "beginner" | "intermediate" | "advanced";
    reason?: string;
}) {
    await connectDB();
    return Recommendation.findOneAndUpdate(
        {
            student_id: new Types.ObjectId(data.student_id),
            lesson_id: new Types.ObjectId(data.lesson_id),
        },
        {
            $set: {
                recommended_level: data.recommended_level,
                reason: data.reason || "",
            },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
}
