import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Subjects from "@/lib/db/models/Subjects";

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
