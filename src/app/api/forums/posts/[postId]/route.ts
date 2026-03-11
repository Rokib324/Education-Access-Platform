import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Post from "@/lib/db/models/Post";
import Comment from "@/lib/db/models/Comment";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { Types } from "mongoose";
import { z } from "zod";

const createCommentSchema = z.object({
    comment_text: z.string().min(1, "Comment cannot be empty").trim(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const { postId } = await params;
        await connectDB();

        // 1. Fetch Post Details using Aggregation to format the date and author name
        const postData = await Post.aggregate([
            { $match: { _id: new Types.ObjectId(postId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "author_id",
                    foreignField: "_id",
                    as: "author"
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
                    createdAt: 1,
                    created_at: {
                        $dateToString: { format: "%b %d, %Y", date: "$createdAt" }
                    }
                }
            }
        ]);

        if (!postData.length) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        
        const post = postData[0];

        // 2. Fetch Comments
        const comments = await Comment.aggregate([
            { $match: { post_id: new Types.ObjectId(postId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    post_id: 1,
                    comment_text: 1,
                    user: "$user.full_name",
                    createdAt: 1,
                    created_at: {
                        $dateToString: { format: "%b %d, %Y", date: "$createdAt" }
                    }
                }
            },
            { $sort: { createdAt: 1 } } // Oldest comments first
        ]);
        
        return NextResponse.json({ post, comments });
    } catch (err) {
        console.error("[POST COMMENTS GET]", err);
        return NextResponse.json({ error: "Failed to fetch post details." }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { postId } = await params;
        const body = await req.json();
        
        const parsed = createCommentSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        await connectDB();
        
        const postExists = await Post.exists({ _id: new Types.ObjectId(postId) });
        if (!postExists) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const comment = await Comment.create({
            post_id: new Types.ObjectId(postId),
            user_id: new Types.ObjectId(payload.userId),
            comment_text: parsed.data.comment_text,
        });

        // Fetch user data for the response so React can render the comment optimistically
        const populatedComment = await Comment.findById(comment._id)
            .populate("user_id", "full_name")
            .lean();

        const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        return NextResponse.json({ 
            message: "Comment added successfully.", 
            comment: {
                _id: populatedComment?._id,
                post_id: populatedComment?.post_id,
                comment_text: populatedComment?.comment_text,
                user: (populatedComment?.user_id as any)?.full_name,
                created_at: formattedDate
            }
        }, { status: 201 });
    } catch (err) {
        console.error("[POST COMMENTS POST]", err);
        return NextResponse.json({ error: "Failed to add comment." }, { status: 500 });
    }
}
