import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { removeDownload } from "@/lib/services/offline-download.service";

// DELETE /api/offline-downloads/[id] — remove a specific download record
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        if (!id) return NextResponse.json({ error: "Download id is required." }, { status: 400 });

        const result = await removeDownload(payload.userId, id);
        if (!result) {
            return NextResponse.json({ error: "Download not found or not yours." }, { status: 404 });
        }
        return NextResponse.json({ message: "Download removed." });
    } catch (err) {
        console.error("[OFFLINE_DOWNLOADS DELETE]", err);
        return NextResponse.json({ error: "Failed to remove download." }, { status: 500 });
    }
}
