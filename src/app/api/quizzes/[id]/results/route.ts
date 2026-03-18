import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getResultsByQuiz } from "@/lib/services/quiz.service";

// GET /api/quizzes/[id]/results – teacher/admin: all student attempts for a quiz
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Only teachers and admins can view quiz results." }, { status: 403 });
        }

        const { id } = await params;
        const data = await getResultsByQuiz(id);
        if (!data) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
        return NextResponse.json(data);
    } catch (err) {
        console.error("[QUIZ RESULTS GET]", err);
        return NextResponse.json({ error: "Failed to fetch quiz results." }, { status: 500 });
    }
}
