import connectDB from "@/lib/db/mongodb";
import Recommendation from "@/lib/db/models/Recommendation";
import { Types } from "mongoose";

import LearningProfile from "@/lib/db/models/LearningProfile";
import Course from "@/lib/db/models/Course";

export async function getRecommendationsForStudent(studentId: string) {
    await connectDB();
    return Recommendation.find({ student_id: new Types.ObjectId(studentId) })
        .populate("lesson_id", "title content_type difficulty_level course_id")
        .sort({ createdAt: -1 })
        .lean();
}

export async function getInterestBasedRecommendations(studentId: string) {
    await connectDB();
    
    // 1. Get student interests
    const profile = await LearningProfile.findOne({ user_id: new Types.ObjectId(studentId) }).lean();
    if (!profile || !profile.interests || profile.interests.length === 0) {
        return [];
    }

    // 2. Build regex pattern for interests
    const interestPattern = profile.interests.map(i => i.trim()).join("|");
    const regex = new RegExp(interestPattern, "i");

    // 3. Find courses matching interests in title or description
    return Course.find({
        $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } }
        ]
    })
    .populate("subject_id", "subject_name")
    .limit(6)
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
