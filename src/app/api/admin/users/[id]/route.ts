import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import Role from "@/lib/db/models/Role";
import { getTokenFromRequest } from "@/lib/auth/sessions";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getTokenFromRequest(req);
    if (!payload || payload.roleName !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { full_name, email, role, is_banned, status, gender } = body;

    await connectDB();

    const updateData: any = {};
    if (full_name) updateData.full_name = full_name;
    if (email) updateData.email = email;
    if (is_banned !== undefined) updateData.is_banned = is_banned;
    if (status) updateData.status = status;
    if (gender) updateData.gender = gender;

    if (role) {
      const roleDoc = await Role.findOne({ role_name: role });
      if (roleDoc) {
        updateData.role_id = roleDoc._id;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", user: updatedUser });
  } catch (err: any) {
    console.error("[ADMIN_USER_PATCH]", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getTokenFromRequest(req);
    if (!payload || payload.roleName !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    await connectDB();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err: any) {
    console.error("[ADMIN_USER_DELETE]", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
