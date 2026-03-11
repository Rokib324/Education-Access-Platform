import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getAttendanceByClass, markAttendance } from "@/lib/services/class.service";
import { z } from "zod";

const markAttendanceSchema = z.object({
    student_id: z.string().min(1, "student_id is required"),
    status: z.enum(["present", "absent", "late"]).optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const resolvedParams = await params;
        const attendance = await getAttendanceByClass(resolvedParams.id);
        
        return NextResponse.json({ attendance });
    } catch (err) {
        console.error("[ATTENDANCE GET]", err);
        return NextResponse.json({ error: "Failed to fetch attendance." }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const body = await req.json();
        
        // If no body is provided, it means a student is auto-joining the room
        const studentId = body?.student_id || payload.userId;
        const status = body?.status || "present";
        
        // If a student is trying to mark someone else, reject
        if (payload.roleName === "student" && studentId !== payload.userId) {
             return NextResponse.json({ error: "Students cannot mark attendance for others." }, { status: 403 });
        }

        const parsed = markAttendanceSchema.safeParse({ student_id: studentId, status });
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const resolvedParams = await params;
        const attendance = await markAttendance(resolvedParams.id, parsed.data.student_id, parsed.data.status as any);
        return NextResponse.json({ message: "Attendance recorded", attendance }, { status: 200 });

    } catch (err) {
        console.error("[ATTENDANCE POST]", err);
        return NextResponse.json({ error: "Failed to mark attendance." }, { status: 500 });
    }
}
