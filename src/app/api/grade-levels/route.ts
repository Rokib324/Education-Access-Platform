import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import GradeLevel from "@/lib/db/models/GradeLevel";

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
