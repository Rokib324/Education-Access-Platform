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

    // 2. Expand interests to related keywords for broader matching
    const interestMap: Record<string, string[]> = {
        "Medicine & Healthcare": ["Medical", "Doctor", "Healthcare", "Clinic", "Pharmacy", "Medicine", "Nurse", "Nursing", "Anatomy"],
        "Engineering & Tech": ["Engineer", "Engineering", "Build", "Construct", "Mechanical", "Electrical", "Civil", "Tech", "Software", "Computer", "Coding", "Digital", "IT", "Data"],
        "Mathematics": ["Math", "Mathematics", "Algebra", "Geometry", "Calculus", "Statistics"],
        "English Language": ["English", "Grammar", "Literature", "Writing", "Reading", "Poetry"],
        "Science & Physics": ["Science", "Physics", "Chemistry", "Biology", "Lab", "Scientific", "Experiment"],
        "History & Arts": ["History", "Historical", "Arts", "Creative", "Design", "Music", "Art", "Painting", "Social Studies"],
        "Business & Entrepreneurship": ["Entrepreneur", "Startup", "Management", "Finance", "Marketing", "Business", "Economics", "Accounting"],
        "Agriculture": ["Farm", "Agri", "Crop", "Plant", "Agriculture", "Rural", "Sustainability"],
        "Law": ["Legal", "Lawyer", "Justice", "Law", "Court", "Rights"],
        "Teaching": ["Education", "Teacher", "Teaching", "Learning", "Pedagogy", "School"]
    };

    const expandedInterests = profile.interests.flatMap(i => interestMap[i] || [i]);
    const uniqueKeywords = Array.from(new Set(expandedInterests));
    
    // Build regex pattern that matches any of the keywords
    const interestPattern = uniqueKeywords.join("|");
    const regex = new RegExp(interestPattern, "i");

    // 3. Find courses matching expanded interests
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
