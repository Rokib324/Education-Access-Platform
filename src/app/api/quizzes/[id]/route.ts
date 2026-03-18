import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import {
    getQuizById,
    updateQuiz,
    deleteQuiz,
} from "@/lib/services/quiz.service";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        try {
            const quiz = await updateQuiz(id, body, payload.userId, payload.roleName === "admin");
            if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
            return NextResponse.json({ message: "Quiz updated.", quiz });
        } catch (e: unknown) {
            if ((e as Error).message === "FORBIDDEN")
                return NextResponse.json({ error: "You can only edit your own quizzes." }, { status: 403 });
            throw e;
        }
    } catch (err) {
        console.error("[QUIZ PATCH]", err);
        return NextResponse.json({ error: "Failed to update quiz." }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const { id } = await params;

        try {
            const result = await deleteQuiz(id, payload.userId, payload.roleName === "admin");
            if (!result) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
            return NextResponse.json({ message: "Quiz deleted successfully." });
        } catch (e: unknown) {
            if ((e as Error).message === "FORBIDDEN")
                return NextResponse.json({ error: "You can only delete your own quizzes." }, { status: 403 });
            throw e;
        }
    } catch (err) {
        console.error("[QUIZ DELETE]", err);
        return NextResponse.json({ error: "Failed to delete quiz." }, { status: 500 });
    }
}
