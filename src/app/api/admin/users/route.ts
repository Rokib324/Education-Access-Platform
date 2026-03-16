import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import Role from "@/lib/db/models/Role";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { hashPassword } from "@/lib/auth/passwords";

// GET /api/admin/users - List all users (except other admins?)
export async function GET(req: NextRequest) {
  try {
    const payload = await getTokenFromRequest(req);
    if (!payload || payload.roleName !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const roleFilter = searchParams.get("role"); // "student" or "teacher"

    let query: any = {};
    if (roleFilter) {
      const role = await Role.findOne({ role_name: roleFilter });
      if (role) {
        query.role_id = role._id;
      }
    }

    const users = await User.find(query)
      .populate("role_id", "role_name")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error("[ADMIN_USERS_GET]", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST /api/admin/users - Create a new user
export async function POST(req: NextRequest) {
  try {
    const payload = await getTokenFromRequest(req);
    if (!payload || payload.roleName !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { full_name, email, password, role, gender } = body;

    if (!full_name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const roleDoc = await Role.findOne({ role_name: role });
    if (!roleDoc) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const password_hash = await hashPassword(password);

    const newUser = await User.create({
      full_name,
      email,
      password_hash,
      role_id: roleDoc._id,
      gender: gender || "male",
      notification_preferences: {
        course_updates: true,
        forum_mentions: true,
        live_classes: true,
      }
    });

    return NextResponse.json({ 
      message: "User created successfully", 
      user: { id: newUser._id, email: newUser.email } 
    }, { status: 201 });

  } catch (err: any) {
    console.error("[ADMIN_USERS_POST]", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
