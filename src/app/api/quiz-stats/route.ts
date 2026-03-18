import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getQuizStatsByCourses } from "@/lib/services/quiz.service";

// GET /api/quiz-stats?courseId=abc&courseId=def – teacher/admin: stats across courses
export async function GET(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const courseIds = searchParams.getAll("courseId");

        if (courseIds.length === 0) {
            return NextResponse.json({ totalQuizzes: 0, totalAttempts: 0, avgScore: 0 });
        }

        const stats = await getQuizStatsByCourses(courseIds);
        return NextResponse.json(stats);
    } catch (err) {
        console.error("[QUIZ STATS GET]", err);
        return NextResponse.json({ error: "Failed to fetch quiz stats." }, { status: 500 });
    }
}
