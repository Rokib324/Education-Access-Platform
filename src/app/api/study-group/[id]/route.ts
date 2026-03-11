import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import StudyGroup from "@/lib/db/models/StudyGroup";
import StudyGroupMember from "@/lib/db/models/StudyGroupMember";
import { Types } from "mongoose";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();

        const group = await StudyGroup.findById(id)
            .populate("course_id", "title")
            .populate("created_by", "full_name email")
            .lean();

        if (!group) {
            return NextResponse.json({ error: "Study group not found." }, { status: 404 });
        }

        const members = await StudyGroupMember.find({ group_id: new Types.ObjectId(id) })
            .populate("user_id", "full_name email role_id")
            .lean();

        return NextResponse.json({ group, members });
    } catch (err) {
        console.error("[STUDY-GROUP DETAILS GET]", err);
        return NextResponse.json({ error: "Failed to fetch study group details." }, { status: 500 });
    }
}
