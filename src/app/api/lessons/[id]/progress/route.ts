import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { upsertLessonProgress } from "@/lib/services/lesson.service";
import { progressSchema } from "@/lib/validators/lesson.schema";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        const body = await req.json();
        const parsed = progressSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const progress = await upsertLessonProgress(id, payload.userId, parsed.data.completion_percentage);
        return NextResponse.json({ message: "Progress updated.", progress });
    } catch (err) {
        console.error("[LESSON PROGRESS]", err);
        return NextResponse.json({ error: "Failed to update progress." }, { status: 500 });
    }
}
