import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Subjects from "@/lib/db/models/Subjects";
import { getTokenFromRequest } from "@/lib/auth/sessions";

export async function GET() {
    try {
        await connectDB();
        const subjects = await Subjects.find().sort({ subject_name: 1 }).lean();
        return NextResponse.json({ subjects });
    } catch (err) {
        console.error("[SUBJECTS GET]", err);
        return NextResponse.json({ error: "Failed to fetch subjects." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (!["teacher", "admin"].includes(payload.roleName)) {
            return NextResponse.json({ error: "Only teachers and admins can create subjects." }, { status: 403 });
        }

        const body = await req.json();
        const { subject_name } = body;
        if (!subject_name?.trim()) {
            return NextResponse.json({ error: "subject_name is required." }, { status: 400 });
        }

        await connectDB();
        const existing = await Subjects.findOne({ subject_name: subject_name.trim() });
        if (existing) {
            return NextResponse.json({ error: "Subject already exists." }, { status: 409 });
        }

        const subject = await Subjects.create({ subject_name: subject_name.trim() });
        return NextResponse.json({ message: "Subject created.", subject }, { status: 201 });
    } catch (err) {
        console.error("[SUBJECTS POST]", err);
        return NextResponse.json({ error: "Failed to create subject." }, { status: 500 });
    }
}
