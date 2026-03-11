import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { startClassSession, endClassSession, getClassById } from "@/lib/services/class.service";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        const virtualClass = await getClassById(id);
        
        if (!virtualClass) {
            return NextResponse.json({ error: "Virtual class not found." }, { status: 404 });
        }

        if (virtualClass.teacher_id._id.toString() !== payload.userId && payload.roleName !== "admin") {
            return NextResponse.json({ error: "Only the teacher can start the session." }, { status: 403 });
        }

        const session = await startClassSession(id);
        return NextResponse.json({ message: "Session started.", session }, { status: 201 });
    } catch (err) {
        console.error("[CLASS-SESSION POST]", err);
        return NextResponse.json({ error: "Failed to start session." }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        const virtualClass = await getClassById(id);
        
        if (!virtualClass) {
            return NextResponse.json({ error: "Virtual class not found." }, { status: 404 });
        }

        if (virtualClass.teacher_id._id.toString() !== payload.userId && payload.roleName !== "admin") {
            return NextResponse.json({ error: "Only the teacher can end the session." }, { status: 403 });
        }

        const session = await endClassSession(id);
        if (!session) {
            return NextResponse.json({ error: "No active session found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Session ended.", session }, { status: 200 });
    } catch (err) {
        console.error("[CLASS-SESSION PATCH]", err);
        return NextResponse.json({ error: "Failed to end session." }, { status: 500 });
    }
}
