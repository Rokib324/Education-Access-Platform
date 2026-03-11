import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import Role from "@/lib/db/models/Role";

export async function GET(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");

        await connectDB();

        let query = {};
        if (role) {
            const roleDoc = await Role.findOne({ role_name: role });
            if (!roleDoc) {
                return NextResponse.json({ users: [] }); // Role doesn't exist yet
            }
            query = { role_id: roleDoc._id };
        }

        const users = await User.find(query)
            .select("-password_hash")
            .sort({ full_name: 1 })
            .lean();

        return NextResponse.json({ users });
    } catch (err) {
        console.error("[GET USERS]", err);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
