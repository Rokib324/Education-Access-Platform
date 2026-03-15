import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import VirtualClass from "@/lib/db/models/VirtualClass";
import ClassParticipant from "@/lib/db/models/ClassParticipant";
import { getTokenFromRequest } from "@/lib/auth/sessions";

function formatClassTime(date: Date): string {
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
    
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  let dayStr = "";
  if (isToday) {
    dayStr = "Today";
  } else if (isTomorrow) {
    dayStr = "Tomorrow";
  } else {
    dayStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${dayStr} · ${timeStr}`;
}

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

    const roleName = payload.roleName.toLowerCase();
    const userId = payload.userId;

    let classesData: any[] = [];

    if (roleName === "student") {
      // Find classes the student is participating in
      const participations = await ClassParticipant.find({ user_id: userId, role: "student" }).select("class_id");
      const classIds = participations.map((p) => p.class_id);

      // Get upcoming or live virtual classes
      const upcomingClasses = await VirtualClass.find({
        _id: { $in: classIds },
        status: { $in: ["scheduled", "live"] },
      })
        .populate("teacher_id", "full_name")
        .sort({ scheduled_start: 1 })
        .limit(4);

      classesData = upcomingClasses.map((cls) => ({
        title: cls.class_title,
        teacher: (cls.teacher_id as any)?.full_name || "Unknown Teacher",
        time: formatClassTime(cls.scheduled_start),
        status: cls.status === "scheduled" ? "upcoming" : "live",
      }));
    } else if (roleName === "teacher") {
      // Get upcoming or live virtual classes for this teacher
      const upcomingClasses = await VirtualClass.find({
        teacher_id: userId,
        status: { $in: ["scheduled", "live"] },
      })
        .sort({ scheduled_start: 1 })
        .limit(4);

      classesData = upcomingClasses.map((cls) => ({
        title: cls.class_title,
        teacher: "You",
        time: formatClassTime(cls.scheduled_start),
        status: cls.status === "scheduled" ? "upcoming" : "live",
      }));
    } else if (roleName === "admin") {
       // Optional: admin might see all upcoming platform wide
       const upcomingClasses = await VirtualClass.find({
           status: { $in: ["scheduled", "live"] },
       })
       .populate("teacher_id", "full_name")
       .sort({ scheduled_start: 1 })
       .limit(4);

       classesData = upcomingClasses.map((cls) => ({
        title: cls.class_title,
        teacher: (cls.teacher_id as any)?.full_name || "Unknown Teacher",
        time: formatClassTime(cls.scheduled_start),
        status: cls.status === "scheduled" ? "upcoming" : "live",
      }));
    }

    return NextResponse.json({ upcomingClasses: classesData });
  } catch (err: unknown) {
    console.error("[UPCOMING_CLASSES]", err);
    return NextResponse.json(
      { error: "Something went wrong fetching upcoming classes." },
      { status: 500 }
    );
  }
}
