import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import {
    enrollStudent,
    getEnrollmentsByStudent,
    getEnrollmentStatus,
} from "@/lib/services/enrollment.service";

// GET /api/enrollments?mine=true  – student's enrolled courses
export async function GET(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload)
            return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");

        if (courseId) {
            // Check if the student is enrolled in a specific course
            const enrollment = await getEnrollmentStatus(payload.userId, courseId);
            return NextResponse.json({ enrollment });
        }

        // Return all enrolled courses for the student
        const enrollments = await getEnrollmentsByStudent(payload.userId);
        return NextResponse.json({ enrollments });
    } catch (err) {
        console.error("[ENROLLMENTS GET]", err);
        return NextResponse.json({ error: "Failed to fetch enrollments." }, { status: 500 });
    }
}

// POST /api/enrollments  – enroll authenticated student
export async function POST(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload)
            return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        if (payload.roleName !== "student") {
            return NextResponse.json(
                { error: "Only students can enroll in courses." },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { courseId } = body;

        if (!courseId) {
            return NextResponse.json({ error: "courseId is required." }, { status: 400 });
        }

        try {
            const enrollment = await enrollStudent(payload.userId, courseId);
            return NextResponse.json({ message: "Enrolled successfully.", enrollment }, { status: 201 });
        } catch (e: unknown) {
            // Handle duplicate enrollment (MongoDB unique index violation)
            if ((e as { code?: number }).code === 11000) {
                return NextResponse.json(
                    { error: "Already enrolled in this course." },
                    { status: 409 }
                );
            }
            throw e;
        }
    } catch (err) {
        console.error("[ENROLLMENTS POST]", err);
        return NextResponse.json({ error: "Failed to enroll." }, { status: 500 });
    }
}
