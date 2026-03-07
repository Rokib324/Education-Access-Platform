import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { z } from "zod";

const updateProfileSchema = z.object({
    full_name: z.string().min(2).trim().optional(),
    location: z.string().trim().optional(),
    profile_photo: z.string().url().optional().or(z.literal("")),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();
        const user = await User.findById(id)
            .populate("role_id", "role_name")
            .select("-password_hash")
            .lean();
        if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
        return NextResponse.json({ user });
    } catch (err) {
        console.error("[USER GET]", err);
        return NextResponse.json({ error: "Failed to fetch user." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        // Users can only update their own profile; admins can update any
        if (payload.userId !== id && payload.roleName !== "admin") {
            return NextResponse.json({ error: "Permission denied." }, { status: 403 });
        }

        const body = await req.json();
        const parsed = updateProfileSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        await connectDB();
        const user = await User.findByIdAndUpdate(
            id,
            { $set: parsed.data },
            { new: true, runValidators: true }
        )
            .select("-password_hash")
            .lean();

        if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
        return NextResponse.json({ message: "Profile updated.", user });
    } catch (err) {
        console.error("[USER PUT]", err);
        return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
    }
}
