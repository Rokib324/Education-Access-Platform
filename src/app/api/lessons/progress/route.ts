import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import connectDB from "@/lib/db/mongodb";
import Lesson from "@/lib/db/models/Lesson";
import LessonProgress from "@/lib/db/models/LessonProgress";
import { Types } from "mongoose";

// GET /api/lessons/progress?courseId=xxx  – student's lesson progress for a course
export async function GET(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload)
            return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");

        if (!courseId) {
            return NextResponse.json({ error: "courseId is required." }, { status: 400 });
        }

        await connectDB();

        // Get all lesson IDs for this course
        const lessons = await Lesson.find({
            course_id: new Types.ObjectId(courseId),
        }).lean();

        const lessonIdSet = new Set(lessons.map((l) => String(l._id)));

        // Get all progress records for the student, filtered to this course's lessons
        const progress = await LessonProgress.find({
            student_id: new Types.ObjectId(payload.userId),
            lesson_id: { $in: lessons.map((l) => l._id) },
        }).lean();

        const courseProgress = progress
            .filter((p) => lessonIdSet.has(String(p.lesson_id)))
            .map((p) => ({
                lesson_id: String(p.lesson_id),
                completion_percentage: p.completion_percentage,
                last_accessed: p.last_accessed,
            }));

        return NextResponse.json({ progress: courseProgress });
    } catch (err) {
        console.error("[LESSON PROGRESS GET]", err);
        return NextResponse.json({ error: "Failed to fetch progress." }, { status: 500 });
    }
}
