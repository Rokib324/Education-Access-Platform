import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Post from "@/lib/db/models/Post";
import Forum from "@/lib/db/models/Forum";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { Types } from "mongoose";
import { z } from "zod";

const createPostSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").trim(),
    content: z.string().min(5, "Content must be at least 5 characters").trim(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ forumId: string }> }) {
    try {
        const { forumId } = await params;
        await connectDB();

        // Check if forum exists
        const forum = await Forum.findById(forumId).lean();
        if (!forum) {
            return NextResponse.json({ error: "Forum not found" }, { status: 404 });
        }

        // Fetch posts for this forum, lookup author and comments count
        const posts = await Post.aggregate([
            { $match: { forum_id: new Types.ObjectId(forumId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "author_id",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post_id",
                    as: "comments"
                }
            },
            { $unwind: "$author" },
            {
                $project: {
                    _id: 1,
                    forum_id: 1,
                    title: 1,
                    content: 1,
                    "author": "$author.full_name",
                    comment_count: { $size: "$comments" },
                    likes: { $literal: 0 }, // Stub for likes if implemented later
                    createdAt: 1,
                    created_at: {
                        $dateToString: { format: "%b %d, %Y", date: "$createdAt" }
                    }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        return NextResponse.json({ forum, posts });
    } catch (err) {
        console.error("[FORUM POSTS GET]", err);
        return NextResponse.json({ error: "Failed to fetch forum posts." }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ forumId: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { forumId } = await params;
        const body = await req.json();
        
        const parsed = createPostSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        await connectDB();
        
        const forum = await Forum.findById(forumId).lean();
        if (!forum) {
            return NextResponse.json({ error: "Forum not found" }, { status: 404 });
        }

        const post = await Post.create({
            forum_id: new Types.ObjectId(forumId),
            author_id: new Types.ObjectId(payload.userId),
            title: parsed.data.title,
            content: parsed.data.content,
        });

        return NextResponse.json({ message: "Post created successfully.", post }, { status: 201 });
    } catch (err) {
        console.error("[FORUM POSTS POST]", err);
        return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
    }
}
