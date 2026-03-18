import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { submitQuizAttempt } from "@/lib/services/quiz.service";
import { submitAttemptSchema } from "@/lib/validators/quiz.schema";

// POST /api/quizzes/[id]/submit – student submits answers
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (payload.roleName !== "student") {
            return NextResponse.json({ error: "Only students can submit quizzes." }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        const parsed = submitAttemptSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const result = await submitQuizAttempt(id, payload.userId, parsed.data);
        return NextResponse.json({
            message: "Quiz submitted successfully.",
            score: result.normalizedScore,
            totalMarks: result.totalMarks,
            passMark: result.passMark,
            passed: result.passed,
            attempt: result.attempt,
        }, { status: 201 });
    } catch (err) {
        console.error("[QUIZ SUBMIT]", err);
        return NextResponse.json({ error: "Failed to submit quiz." }, { status: 500 });
    }
}
