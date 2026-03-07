import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getQuizById, submitQuizAttempt } from "@/lib/services/quiz.service";
import { submitAttemptSchema } from "@/lib/validators/quiz.schema";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await getQuizById(id);
        if (!data) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
        return NextResponse.json(data);
    } catch (err) {
        console.error("[QUIZ GET]", err);
        return NextResponse.json({ error: "Failed to fetch quiz." }, { status: 500 });
    }
}
