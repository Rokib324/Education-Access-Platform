import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import GradeLevel from "@/lib/db/models/GradeLevel";
import { getTokenFromRequest } from "@/lib/auth/sessions";

export async function GET() {
    try {
        await connectDB();
        const gradeLevels = await GradeLevel.find().sort({ grade_name: 1 }).lean();
        return NextResponse.json({ gradeLevels });
    } catch (err) {
        console.error("[GRADE-LEVELS GET]", err);
        return NextResponse.json({ error: "Failed to fetch grade levels." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (payload.roleName !== "admin") {
            return NextResponse.json({ error: "Only admins can create grade levels." }, { status: 403 });
        }

        const body = await req.json();
        const { grade_name } = body;
        if (!grade_name?.trim()) {
            return NextResponse.json({ error: "grade_name is required." }, { status: 400 });
        }

        await connectDB();
        const existing = await GradeLevel.findOne({ grade_name: grade_name.trim() });
        if (existing) {
            return NextResponse.json({ error: "Grade level already exists." }, { status: 409 });
        }

        const grade = await GradeLevel.create({ grade_name: grade_name.trim() });
        return NextResponse.json({ message: "Grade level created.", grade }, { status: 201 });
    } catch (err) {
        console.error("[GRADE-LEVELS POST]", err);
        return NextResponse.json({ error: "Failed to create grade level." }, { status: 500 });
    }
}
