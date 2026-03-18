import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { addQuestion } from "@/lib/services/quiz.service";

// POST /api/quizzes/[id]/questions – teacher adds a question with options
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Only teachers and admins can add questions." }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        const { question_text, question_type, marks, options } = body;

        if (!question_text?.trim()) {
            return NextResponse.json({ error: "question_text is required." }, { status: 400 });
        }
        if (!["mcq", "true_false", "short_answer"].includes(question_type)) {
            return NextResponse.json({ error: "Invalid question_type." }, { status: 400 });
        }

        const result = await addQuestion(id, {
            question_text,
            question_type,
            marks: marks ?? 1,
            options: options ?? [],
        });

        return NextResponse.json({ message: "Question added.", ...result }, { status: 201 });
    } catch (err) {
        console.error("[QUESTION POST]", err);
        return NextResponse.json({ error: "Failed to add question." }, { status: 500 });
    }
}
