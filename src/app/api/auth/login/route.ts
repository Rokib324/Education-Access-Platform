import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import "@/lib/db/models/Role";
import { verifyPassword } from "@/lib/auth/passwords";
import { signToken, setSessionCookie } from "@/lib/auth/sessions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user and populate their role
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).populate("role_id");

    console.log("Login user found:", user ? user.email : "none");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password
    console.log("Checking password for:", user.email);
    console.log("Stored hash:", user.password_hash ? "exists" : "missing");
    const isValid = await verifyPassword(password, user.password_hash);
    console.log("Password valid:", isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = user.role_id as any;

    // Sign JWT and set cookie
    const token = await signToken({
      userId: (user._id as unknown as string).toString(),
      roleId: role._id.toString(),
      roleName: role.role_name,
      email: user.email,
      fullName: user.full_name,
    });

    const response = NextResponse.json({
      message: "Logged in successfully.",
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: role.role_name,
        profile_photo: user.profile_photo,
      },
    });

    setSessionCookie(response, token);
    return response;
  } catch (err: unknown) {
    console.error("[LOGIN]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
