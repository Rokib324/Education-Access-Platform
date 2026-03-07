import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getRecommendationsForStudent, createRecommendation } from "@/lib/services/recommendation.service";
import { z } from "zod";

const createRecommendationSchema = z.object({
    student_id: z.string().min(1),
    lesson_id: z.string().min(1),
    recommended_level: z.enum(["beginner", "intermediate", "advanced"]),
    reason: z.string().optional().default(""),
});

export async function GET(req: NextRequest) {
    try {
        const payload = getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        // Students get their own recommendations; admins/teachers can query any student via ?studentId=
        const { searchParams } = new URL(req.url);
        const studentId =
            payload.roleName === "student"
                ? payload.userId
                : searchParams.get("studentId") || payload.userId;

        const recommendations = await getRecommendationsForStudent(studentId);
        return NextResponse.json({ recommendations });
    } catch (err) {
        console.error("[RECOMMENDATIONS GET]", err);
        return NextResponse.json({ error: "Failed to fetch recommendations." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Only teachers and admins can create recommendations." }, { status: 403 });
        }

        const body = await req.json();
        const parsed = createRecommendationSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const recommendation = await createRecommendation(parsed.data);
        return NextResponse.json({ message: "Recommendation saved.", recommendation }, { status: 201 });
    } catch (err) {
        console.error("[RECOMMENDATIONS POST]", err);
        return NextResponse.json({ error: "Failed to create recommendation." }, { status: 500 });
    }
}
