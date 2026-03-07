import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Post from "@/lib/db/models/Post";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { Types } from "mongoose";
import { z } from "zod";

const createPostSchema = z.object({
    forum_id: z.string().min(1, "forum_id is required"),
    title: z.string().min(3).trim(),
    content: z.string().min(1, "Content is required"),
});

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const forumId = searchParams.get("forumId");
        await connectDB();
        const query = forumId ? { forum_id: new Types.ObjectId(forumId) } : {};
        const posts = await Post.find(query)
            .populate("author_id", "full_name email profile_photo")
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json({ posts });
    } catch (err) {
        console.error("[POSTS GET]", err);
        return NextResponse.json({ error: "Failed to fetch posts." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const body = await req.json();
        const parsed = createPostSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        await connectDB();
        const post = await Post.create({
            forum_id: new Types.ObjectId(parsed.data.forum_id),
            author_id: new Types.ObjectId(payload.userId),
            title: parsed.data.title,
            content: parsed.data.content,
        });
        return NextResponse.json({ message: "Post created.", post }, { status: 201 });
    } catch (err) {
        console.error("[POSTS POST]", err);
        return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
    }
}
