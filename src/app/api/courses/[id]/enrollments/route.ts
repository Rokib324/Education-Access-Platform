import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getEnrollmentsByCourse } from "@/lib/services/enrollment.service";

// GET /api/courses/[id]/enrollments  – teacher/admin: enrolled students + progress
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload)
            return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json(
                { error: "Only teachers and admins can view enrolled students." },
                { status: 403 }
            );
        }

        const { id } = await params;
        const enrollments = await getEnrollmentsByCourse(id);
        return NextResponse.json({ enrollments });
    } catch (err) {
        console.error("[COURSE ENROLLMENTS GET]", err);
        return NextResponse.json({ error: "Failed to fetch enrolled students." }, { status: 500 });
    }
}
