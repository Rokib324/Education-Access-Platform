import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Forum from "@/lib/db/models/Forum";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { Types } from "mongoose";
import { z } from "zod";

const createForumSchema = z.object({
    title: z.string().min(3).trim(),
    description: z.string().optional().default(""),
});

export async function GET() {
    try {
        await connectDB();

        const forums = await Forum.aggregate([
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "forum_id",
                    as: "posts"
                }
            },
            {
               $lookup: {
                   from: "users",
                   localField: "created_by",
                   foreignField: "_id",
                   as: "creator"
               }
            },
            { $unwind: "$creator" },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    "created_by": "$creator.full_name",
                    post_count: { $size: "$posts" },
                    createdAt: 1
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        return NextResponse.json({ forums });
    } catch (err) {
        console.error("[FORUMS GET]", err);
        return NextResponse.json({ error: "Failed to fetch forums." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const body = await req.json();
        const parsed = createForumSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        await connectDB();
        const forum = await Forum.create({
            ...parsed.data,
            created_by: new Types.ObjectId(payload.userId),
        });
        return NextResponse.json({ message: "Forum created.", forum }, { status: 201 });
    } catch (err) {
        console.error("[FORUMS POST]", err);
        return NextResponse.json({ error: "Failed to create forum." }, { status: 500 });
    }
}
