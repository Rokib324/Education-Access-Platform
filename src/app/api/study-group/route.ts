import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import StudyGroup from "@/lib/db/models/StudyGroup";
import StudyGroupMember from "@/lib/db/models/StudyGroupMember";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { Types } from "mongoose";
import { z } from "zod";

const createGroupSchema = z.object({
    course_id: z.string().min(1, "course_id is required"),
    group_name: z.string().min(2, "Group name must be at least 2 characters").trim(),
});

export async function GET(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        // We might allow unauthenticated users to see public group lists in the future,
        // but for now, we use the payload to determine `is_member`.
        const currentUserId = payload?.userId ? new Types.ObjectId(payload.userId) : null;

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        await connectDB();
        
        const matchStage = courseId ? { course_id: new Types.ObjectId(courseId) } : {};

        // Use aggregation to fetch groups, populate created_by/course, count members, and determine is_member
        const groups = await StudyGroup.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "studygroupmembers", // Verified proper mongoose pluralization
                    localField: "_id",
                    foreignField: "group_id",
                    as: "members"
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
            {
               $lookup: {
                   from: "courses",
                   localField: "course_id",
                   foreignField: "_id",
                   as: "course"
               }
            },
            { $unwind: "$creator" },
            { $unwind: "$course" },
            {
                $project: {
                    _id: 1,
                    group_name: 1,
                    "created_by": { full_name: "$creator.full_name", _id: "$creator._id" },
                    "course_id": { title: "$course.title", _id: "$course._id" },
                    member_count: { $size: "$members" },
                    is_member: currentUserId 
                        ? { $in: [currentUserId, "$members.user_id"] } 
                        : { $literal: false },
                    createdAt: 1
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        return NextResponse.json({ groups });
    } catch (err) {
        console.error("[STUDY-GROUPS GET]", err);
        return NextResponse.json({ error: "Failed to fetch study groups." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const body = await req.json();
        const parsed = createGroupSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        await connectDB();
        const group = await StudyGroup.create({
            course_id: new Types.ObjectId(parsed.data.course_id),
            group_name: parsed.data.group_name,
            created_by: new Types.ObjectId(payload.userId),
        });

        // Auto-enroll the creator
        await StudyGroupMember.create({
            group_id: group._id,
            user_id: new Types.ObjectId(payload.userId)
        });

        return NextResponse.json({ message: "Study group created.", group }, { status: 201 });
    } catch (err) {
        console.error("[STUDY-GROUPS POST]", err);
        return NextResponse.json({ error: "Failed to create study group." }, { status: 500 });
    }
}
