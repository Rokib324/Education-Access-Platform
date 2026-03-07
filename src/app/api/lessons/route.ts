import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getLessonsByCourse, createLesson } from "@/lib/services/lesson.service";
import { createLessonSchema } from "@/lib/validators/lesson.schema";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        if (!courseId) {
            return NextResponse.json({ error: "courseId query parameter is required." }, { status: 400 });
        }
        const lessons = await getLessonsByCourse(courseId);
        return NextResponse.json({ lessons });
    } catch (err) {
        console.error("[LESSONS GET]", err);
        return NextResponse.json({ error: "Failed to fetch lessons." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Only teachers and admins can create lessons." }, { status: 403 });
        }

        const body = await req.json();
        const parsed = createLessonSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const lesson = await createLesson(parsed.data);
        return NextResponse.json({ message: "Lesson created.", lesson }, { status: 201 });
    } catch (err) {
        console.error("[LESSONS POST]", err);
        return NextResponse.json({ error: "Failed to create lesson." }, { status: 500 });
    }
}
