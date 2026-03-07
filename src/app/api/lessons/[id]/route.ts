import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getLessonById, updateLesson, deleteLesson } from "@/lib/services/lesson.service";
import { updateLessonSchema } from "@/lib/validators/lesson.schema";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const lesson = await getLessonById(id);
        if (!lesson) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
        return NextResponse.json({ lesson });
    } catch (err) {
        console.error("[LESSON GET]", err);
        return NextResponse.json({ error: "Failed to fetch lesson." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const parsed = updateLessonSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const lesson = await updateLesson(id, parsed.data);
        if (!lesson) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
        return NextResponse.json({ message: "Lesson updated.", lesson });
    } catch (err) {
        console.error("[LESSON PUT]", err);
        return NextResponse.json({ error: "Failed to update lesson." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const { id } = await params;
        const result = await deleteLesson(id);
        if (!result) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
        return NextResponse.json({ message: "Lesson deleted." });
    } catch (err) {
        console.error("[LESSON DELETE]", err);
        return NextResponse.json({ error: "Failed to delete lesson." }, { status: 500 });
    }
}
