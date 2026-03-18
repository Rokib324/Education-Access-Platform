import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { upsertLessonProgress } from "@/lib/services/lesson.service";
import connectDB from "@/lib/db/mongodb";
import Enrollment from "@/lib/db/models/Enrollment";
import { Types } from "mongoose";

// PATCH /api/enrollments/[id]/progress  – update lesson progress for a student
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload)
            return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        const body = await req.json();
        const { lessonId, completion_percentage } = body;

        if (!lessonId || completion_percentage === undefined) {
            return NextResponse.json(
                { error: "lessonId and completion_percentage are required." },
                { status: 400 }
            );
        }

        if (completion_percentage < 0 || completion_percentage > 100) {
            return NextResponse.json(
                { error: "completion_percentage must be between 0 and 100." },
                { status: 400 }
            );
        }

        // Verify the enrollment belongs to this student
        await connectDB();
        const enrollment = await Enrollment.findById(id);
        if (!enrollment) {
            return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });
        }
        if (enrollment.student_id.toString() !== payload.userId) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const progress = await upsertLessonProgress(
            lessonId,
            payload.userId,
            completion_percentage
        );

        // If all lessons are 100%, auto-mark enrollment as completed
        if (completion_percentage >= 100) {
            const { Lesson, LessonProgress } = await import("@/lib/db/models/Lesson").then(async (m) => ({
                Lesson: m.default,
                LessonProgress: (await import("@/lib/db/models/LessonProgress")).default,
            }));

            const allLessons = await Lesson.find({ course_id: enrollment.course_id }).lean();
            const allProgress = await LessonProgress.find({
                student_id: new Types.ObjectId(payload.userId),
                lesson_id: { $in: allLessons.map((l) => l._id) },
            }).lean();

            const allDone =
                allProgress.length === allLessons.length &&
                allProgress.every((p) => p.completion_percentage >= 100);

            if (allDone && enrollment.status !== "completed") {
                enrollment.status = "completed";
                enrollment.completed_at = new Date();
                await enrollment.save();
            }
        }

        return NextResponse.json({ message: "Progress updated.", progress });
    } catch (err) {
        console.error("[ENROLLMENT PROGRESS PATCH]", err);
        return NextResponse.json({ error: "Failed to update progress." }, { status: 500 });
    }
}
