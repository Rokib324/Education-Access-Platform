import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getUserDownloads, addDownload } from "@/lib/services/offline-download.service";

// GET /api/offline-downloads — list all downloads for the authenticated user
export async function GET(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const downloads = await getUserDownloads(payload.userId);
        return NextResponse.json({ downloads });
    } catch (err) {
        console.error("[OFFLINE_DOWNLOADS GET]", err);
        return NextResponse.json({ error: "Failed to fetch downloads." }, { status: 500 });
    }
}

// POST /api/offline-downloads — mark a lesson as downloaded
export async function POST(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const body = await req.json();
        const { lesson_id } = body;
        if (!lesson_id) {
            return NextResponse.json({ error: "lesson_id is required." }, { status: 400 });
        }

        const download = await addDownload(payload.userId, lesson_id);
        return NextResponse.json({ message: "Download recorded.", download }, { status: 201 });
    } catch (err) {
        console.error("[OFFLINE_DOWNLOADS POST]", err);
        return NextResponse.json({ error: "Failed to record download." }, { status: 500 });
    }
}
