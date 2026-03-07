import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getVirtualClasses, createVirtualClass } from "@/lib/services/class.service";
import { z } from "zod";

const createClassSchema = z.object({
    course_id: z.string().min(1, "course_id is required"),
    class_title: z.string().min(2).trim(),
    scheduled_start: z.string().min(1, "scheduled_start is required"),
    scheduled_end: z.string().min(1, "scheduled_end is required"),
    meeting_link: z.string().url("Invalid meeting link"),
});

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filters = {
            course_id: searchParams.get("courseId") || undefined,
            teacher_id: searchParams.get("teacherId") || undefined,
            status: searchParams.get("status") || undefined,
        };
        const classes = await getVirtualClasses(filters);
        return NextResponse.json({ classes });
    } catch (err) {
        console.error("[VIRTUAL-CLASSES GET]", err);
        return NextResponse.json({ error: "Failed to fetch virtual classes." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Only teachers and admins can schedule classes." }, { status: 403 });
        }

        const body = await req.json();
        const parsed = createClassSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const virtualClass = await createVirtualClass({ ...parsed.data, teacher_id: payload.userId });
        return NextResponse.json({ message: "Virtual class scheduled.", virtualClass }, { status: 201 });
    } catch (err) {
        console.error("[VIRTUAL-CLASSES POST]", err);
        return NextResponse.json({ error: "Failed to schedule virtual class." }, { status: 500 });
    }
}
