import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { deleteQuestion } from "@/lib/services/quiz.service";

// DELETE /api/quizzes/[id]/questions/[qid]
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; qid: string }> }
) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const { qid } = await params;
        const result = await deleteQuestion(qid);
        if (!result) return NextResponse.json({ error: "Question not found." }, { status: 404 });
        return NextResponse.json({ message: "Question deleted." });
    } catch (err) {
        console.error("[QUESTION DELETE]", err);
        return NextResponse.json({ error: "Failed to delete question." }, { status: 500 });
    }
}
