import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { updateNotificationsSchema } from "@/lib/validators/user.schema";

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
    const parsed = updateNotificationsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    // Build update object for nested field
    const updateObj: Record<string, boolean> = {};
    if (parsed.data.course_updates !== undefined) {
      updateObj["notification_preferences.course_updates"] = parsed.data.course_updates;
    }
    if (parsed.data.forum_mentions !== undefined) {
      updateObj["notification_preferences.forum_mentions"] = parsed.data.forum_mentions;
    }
    if (parsed.data.live_classes !== undefined) {
      updateObj["notification_preferences.live_classes"] = parsed.data.live_classes;
    }

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { $set: updateObj },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Notification preferences updated.",
      preferences: updatedUser.notification_preferences,
    });
  } catch (err: unknown) {
    console.error("[NOTIFICATIONS_PATCH]", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
