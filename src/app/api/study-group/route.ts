import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import StudyGroup from "@/lib/db/models/StudyGroup";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { Types } from "mongoose";
import { z } from "zod";

const createGroupSchema = z.object({
    course_id: z.string().min(1, "course_id is required"),
    group_name: z.string().min(2, "Group name must be at least 2 characters").trim(),
});

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        await connectDB();
        const query = courseId ? { course_id: new Types.ObjectId(courseId) } : {};
        const groups = await StudyGroup.find(query)
            .populate("course_id", "title")
            .populate("created_by", "full_name email")
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json({ groups });
    } catch (err) {
        console.error("[STUDY-GROUPS GET]", err);
        return NextResponse.json({ error: "Failed to fetch study groups." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const body = await req.json();
        const parsed = createGroupSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        await connectDB();
        const group = await StudyGroup.create({
            course_id: new Types.ObjectId(parsed.data.course_id),
            group_name: parsed.data.group_name,
            created_by: new Types.ObjectId(payload.userId),
        });
        return NextResponse.json({ message: "Study group created.", group }, { status: 201 });
    } catch (err) {
        console.error("[STUDY-GROUPS POST]", err);
        return NextResponse.json({ error: "Failed to create study group." }, { status: 500 });
    }
}
