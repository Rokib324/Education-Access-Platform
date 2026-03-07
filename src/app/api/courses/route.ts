import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getCourses, createCourse } from "@/lib/services/course.service";
import { createCourseSchema } from "@/lib/validators/course.schema";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filters = {
            subject_id: searchParams.get("subject_id") || undefined,
            grade_id: searchParams.get("grade_id") || undefined,
            is_vocational: searchParams.get("is_vocational") === "true" ? true
                : searchParams.get("is_vocational") === "false" ? false
                    : undefined,
            created_by: searchParams.get("created_by") || undefined,
        };
        const courses = await getCourses(filters);
        return NextResponse.json({ courses });
    } catch (err) {
        console.error("[COURSES GET]", err);
        return NextResponse.json({ error: "Failed to fetch courses." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Only teachers and admins can create courses." }, { status: 403 });
        }

        const body = await req.json();
        const parsed = createCourseSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const course = await createCourse(parsed.data, payload.userId);
        return NextResponse.json({ message: "Course created.", course }, { status: 201 });
    } catch (err) {
        console.error("[COURSES POST]", err);
        return NextResponse.json({ error: "Failed to create course." }, { status: 500 });
    }
}
