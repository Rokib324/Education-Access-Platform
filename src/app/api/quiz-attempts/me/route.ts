import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getAttemptsByStudent } from "@/lib/services/quiz.service";

// GET /api/quiz-attempts/me – Returns the current student's quiz attempt history
export async function GET(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const attempts = await getAttemptsByStudent(payload.userId);
        return NextResponse.json({ attempts });
    } catch (err) {
        console.error("[QUIZ ATTEMPTS ME GET]", err);
        return NextResponse.json({ error: "Failed to fetch quiz attempts." }, { status: 500 });
    }
}
