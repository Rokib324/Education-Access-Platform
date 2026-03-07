import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { submitQuizAttempt } from "@/lib/services/quiz.service";
import { submitAttemptSchema } from "@/lib/validators/quiz.schema";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        const body = await req.json();
        const parsed = submitAttemptSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const attempt = await submitQuizAttempt(id, payload.userId, parsed.data);
        return NextResponse.json({ message: "Quiz submitted.", attempt }, { status: 201 });
    } catch (err: unknown) {
        if (err instanceof Error && err.message === "Quiz not found") {
            return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
        }
        console.error("[QUIZ SUBMIT]", err);
        return NextResponse.json({ error: "Failed to submit quiz." }, { status: 500 });
    }
}
