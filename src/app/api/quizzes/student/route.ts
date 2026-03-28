import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getQuizzesForStudent } from "@/lib/services/quiz.service";
import { getEnrollmentsByStudent } from "@/lib/services/enrollment.service";

// GET /api/quizzes/student
// Returns all quizzes for the enrolled courses of the current student,
// enriched with `course_id` (populated), `lesson_id` (populated),
// `questionCount`, and `lastAttempt`.
export async function GET(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        }

        // Fetch the student's active enrollments
        const enrollments = await getEnrollmentsByStudent(payload.userId);

        if (enrollments.length === 0) {
            return NextResponse.json({ quizzes: [] });
        }

        // Collect distinct course IDs
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const courseIds: string[] = enrollments
            .map((e) => {
                const cid = e.course_id as any;
                if (cid && typeof cid === "object" && "_id" in cid) {
                    return String(cid._id);
                }
                return cid ? String(cid) : "";
            })
            .filter(Boolean);

        const quizzes = await getQuizzesForStudent(payload.userId, courseIds);
        return NextResponse.json({ quizzes });
    } catch (err) {
        console.error("[QUIZZES STUDENT GET]", err);
        return NextResponse.json({ error: "Failed to fetch quizzes." }, { status: 500 });
    }
}
