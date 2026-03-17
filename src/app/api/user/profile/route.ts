import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import LearningProfile from "@/lib/db/models/LearningProfile";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { updateProfileSchema } from "@/lib/validators/user.schema";

export async function GET(req: NextRequest) {
  try {
    const payload = await getTokenFromRequest(req);
    if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

    await connectDB();
    const [user, profile] = await Promise.all([
      User.findById(payload.userId).select("-password_hash").lean(),
      LearningProfile.findOne({ user_id: payload.userId }).lean()
    ]);

    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

    return NextResponse.json({
      user: {
        ...user,
        interests: profile?.interests || []
      }
    });
  } catch (err: unknown) {
    console.error("[PROFILE_GET]", err);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getTokenFromRequest(req);

    if (!payload) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { interests, ...userData } = parsed.data;

    await connectDB();

    // 1. Update User Record
    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $set: userData },
      { new: true, runValidators: true }
    ).select("-password_hash");

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // 2. Update Learning Profile if interests provided
    if (interests !== undefined) {
      await LearningProfile.findOneAndUpdate(
        { user_id: payload.userId },
        { $set: { interests } },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        profile_photo: updatedUser.profile_photo,
        bio: updatedUser.bio,
        location: updatedUser.location,
        interests: interests || []
      },
    });
  } catch (err: unknown) {
    console.error("[PROFILE_PATCH]", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
