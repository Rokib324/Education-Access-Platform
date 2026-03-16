import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { updateProfileSchema } from "@/lib/validators/user.schema";

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

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).select("-password_hash");

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
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
