import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getQuizzesByCourse, createQuiz } from "@/lib/services/quiz.service";
import { createQuizSchema } from "@/lib/validators/quiz.schema";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        if (!courseId) {
            return NextResponse.json({ error: "courseId query parameter is required." }, { status: 400 });
        }
        const quizzes = await getQuizzesByCourse(courseId);
        return NextResponse.json({ quizzes });
    } catch (err) {
        console.error("[QUIZZES GET]", err);
        return NextResponse.json({ error: "Failed to fetch quizzes." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Only teachers and admins can create quizzes." }, { status: 403 });
        }

        const body = await req.json();
        const parsed = createQuizSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const quiz = await createQuiz(parsed.data);
        return NextResponse.json({ message: "Quiz created.", quiz }, { status: 201 });
    } catch (err) {
        console.error("[QUIZZES POST]", err);
        return NextResponse.json({ error: "Failed to create quiz." }, { status: 500 });
    }
}
