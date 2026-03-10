import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { isLessonDownloaded } from "@/lib/services/offline-download.service";

// GET /api/offline-downloads/check?lesson_id=xxx
export async function GET(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const lessonId = searchParams.get("lesson_id");
        if (!lessonId) {
            return NextResponse.json({ error: "lesson_id query param required." }, { status: 400 });
        }

        const downloaded = await isLessonDownloaded(payload.userId, lessonId);
        return NextResponse.json({ downloaded });
    } catch (err) {
        console.error("[OFFLINE_DOWNLOADS CHECK]", err);
        return NextResponse.json({ error: "Check failed." }, { status: 500 });
    }
}
