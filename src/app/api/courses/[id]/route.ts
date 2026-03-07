import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getCourseById, updateCourse, deleteCourse } from "@/lib/services/course.service";
import { updateCourseSchema } from "@/lib/validators/course.schema";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const course = await getCourseById(id);
        if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });
        return NextResponse.json({ course });
    } catch (err) {
        console.error("[COURSE GET]", err);
        return NextResponse.json({ error: "Failed to fetch course." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        const body = await req.json();
        const parsed = updateCourseSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const isAdmin = payload.roleName === "admin";
        const course = await updateCourse(id, parsed.data, payload.userId, isAdmin);
        if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });
        return NextResponse.json({ message: "Course updated.", course });
    } catch (err: unknown) {
        if (err instanceof Error && err.message === "FORBIDDEN") {
            return NextResponse.json({ error: "You do not have permission to edit this course." }, { status: 403 });
        }
        console.error("[COURSE PUT]", err);
        return NextResponse.json({ error: "Failed to update course." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        const isAdmin = payload.roleName === "admin";
        const result = await deleteCourse(id, payload.userId, isAdmin);
        if (!result) return NextResponse.json({ error: "Course not found." }, { status: 404 });
        return NextResponse.json({ message: "Course deleted." });
    } catch (err: unknown) {
        if (err instanceof Error && err.message === "FORBIDDEN") {
            return NextResponse.json({ error: "You do not have permission to delete this course." }, { status: 403 });
        }
        console.error("[COURSE DELETE]", err);
        return NextResponse.json({ error: "Failed to delete course." }, { status: 500 });
    }
}
