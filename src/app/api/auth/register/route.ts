import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { hashPassword } from "@/lib/auth/passwords";
import { signToken, setSessionCookie } from "@/lib/auth/sessions";
import { ensureRoleExists, ROLES, RoleName } from "@/lib/auth/roles";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, password, role = "student", location } = body;

    // --- Validation ---
    if (!full_name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Full name, email and password are required." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }
    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(role as RoleName)) {
      return NextResponse.json(
        { error: "Invalid role. Must be student, teacher, or admin." },
        { status: 400 }
      );
    }

    await connectDB();

    // --- Check duplicate email ---
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // --- Ensure role exists in DB (auto-seed) ---
    const roleDoc = await ensureRoleExists(role as RoleName);

    // --- Create user ---
    const password_hash = await hashPassword(password);
    const user = await User.create({
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      password_hash,
      role_id: roleDoc._id,
      location: location?.trim() || "",
    });

    // --- Sign JWT and set cookie ---
    const token = await signToken({
      userId: (user._id as unknown as string).toString(),
      roleId: (roleDoc._id as unknown as string).toString(),
      roleName: roleDoc.role_name,
      email: user.email,
      fullName: user.full_name,
    });

    const response = NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user._id,
          full_name: user.full_name,
          email: user.email,
          role: roleDoc.role_name,
        },
      },
      { status: 201 }
    );

    setSessionCookie(response, token);
    return response;
  } catch (err: unknown) {
    console.error("[REGISTER]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
