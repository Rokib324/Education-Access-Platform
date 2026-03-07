import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import StudyGroupMember from "@/lib/db/models/StudyGroupMember";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { Types } from "mongoose";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        await connectDB();

        // Upsert prevents duplicate membership (model has unique index on group_id + user_id)
        const member = await StudyGroupMember.findOneAndUpdate(
            { group_id: new Types.ObjectId(id), user_id: new Types.ObjectId(payload.userId) },
            { $setOnInsert: { group_id: new Types.ObjectId(id), user_id: new Types.ObjectId(payload.userId) } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).lean();

        return NextResponse.json({ message: "Joined study group.", member }, { status: 201 });
    } catch (err) {
        console.error("[STUDY-GROUP JOIN]", err);
        return NextResponse.json({ error: "Failed to join study group." }, { status: 500 });
    }
}
