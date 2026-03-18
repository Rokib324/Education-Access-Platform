import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { unenrollStudent } from "@/lib/services/enrollment.service";

// DELETE /api/enrollments/[id]  – student drops the course
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload)
            return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;

        try {
            const result = await unenrollStudent(id, payload.userId);
            if (!result)
                return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });
            return NextResponse.json({ message: "Successfully unenrolled." });
        } catch (e: unknown) {
            if ((e as Error).message === "FORBIDDEN") {
                return NextResponse.json({ error: "You can only drop your own enrollment." }, { status: 403 });
            }
            throw e;
        }
    } catch (err) {
        console.error("[ENROLLMENT DELETE]", err);
        return NextResponse.json({ error: "Failed to unenroll." }, { status: 500 });
    }
}
