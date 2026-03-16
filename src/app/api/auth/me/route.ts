import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { getTokenFromRequest } from "@/lib/auth/sessions";

export async function GET(req: NextRequest) {
  try {
    const payload = await getTokenFromRequest(req);

    if (!payload) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(payload.userId)
      .populate("role_id")
      .select("-password_hash");

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = user.role_id as any;

    return NextResponse.json({
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: role.role_name,
        profile_photo: user.profile_photo,
        bio: user.bio,
        location: user.location,
        created_at: user.created_at,
      },
    });
  } catch (err: unknown) {
    console.error("[ME]", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
