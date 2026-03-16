import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { verifyPassword, hashPassword } from "@/lib/auth/passwords";
import { updatePasswordSchema } from "@/lib/validators/user.schema";

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
    const parsed = updatePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const { current_password, new_password } = parsed.data;

    // Verify current password
    const isMatch = await verifyPassword(current_password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: { current_password: ["Incorrect current password."] } },
        { status: 400 }
      );
    }

    // Hash new password
    const newHash = await hashPassword(new_password);

    // Update user
    user.password_hash = newHash;
    await user.save();

    return NextResponse.json({
      message: "Password updated successfully.",
    });
  } catch (err: unknown) {
    console.error("[PASSWORD_PATCH]", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
