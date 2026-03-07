import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { markAttendance, getAttendanceForClass } from "@/lib/services/attendence.service";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        const attendance = await markAttendance(id, payload.userId);
        return NextResponse.json({ message: "Attendance marked.", attendance }, { status: 201 });
    } catch (err) {
        console.error("[ATTEND]", err);
        return NextResponse.json({ error: "Failed to mark attendance." }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Only teachers and admins can view attendance." }, { status: 403 });
        }

        const { id } = await params;
        const attendance = await getAttendanceForClass(id);
        return NextResponse.json({ attendance });
    } catch (err) {
        console.error("[ATTEND GET]", err);
        return NextResponse.json({ error: "Failed to fetch attendance." }, { status: 500 });
    }
}
