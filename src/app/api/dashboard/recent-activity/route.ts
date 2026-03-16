import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { getTokenFromRequest } from "@/lib/auth/sessions";

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

        // Dynamically import models to avoid caching/compile issues
        const { default: User } = await import("@/lib/db/models/User");
        const { default: Course } = await import("@/lib/db/models/Course");
        const { default: VirtualClass } = await import("@/lib/db/models/VirtualClass");
        const { default: Resource } = await import("@/lib/db/models/Resource");
        const { default: StudentQuizAttempt } = await import("@/lib/db/models/StudentQuizAttempt");
        const { default: LessonProgress } = await import("@/lib/db/models/LessonProgress");
        const { default: ClassParticipant } = await import("@/lib/db/models/ClassParticipant");
        const { default: Quiz } = await import("@/lib/db/models/Quiz");
        const { default: Lesson } = await import("@/lib/db/models/Lesson");

        const roleName = payload.roleName.toLowerCase().trim();
        const userId = payload.userId;

        interface Activity {
            type: string;
            text: string;
            time: Date;
            timeFormatted: string;
        }

        let recentActivities: Activity[] = [];

        // Always fetch the user's own record so we can use createdAt as a baseline activity
        const currentUser = await User.findById(userId).lean() as any;

        if (roleName === "student") {
            // 1. Recent quiz attempts
            try {
                const quizAttempts = await StudentQuizAttempt.find({ student_id: userId })
                    .sort({ attempted_at: -1 })
                    .limit(5)
                    .populate({ path: "quiz_id", model: Quiz, select: "title" })
                    .lean() as any[];

                quizAttempts.forEach((attempt) => {
                    if (!attempt.quiz_id) return;
                    const t = attempt.attempted_at ? new Date(attempt.attempted_at) : new Date(attempt.createdAt);
                    recentActivities.push({
                        type: "quiz",
                        text: `Attempted quiz '${attempt.quiz_id.title}'`,
                        time: t,
                        timeFormatted: formatTimeAgo(t),
                    });
                });
            } catch (e) { console.error("[recent-activity] quiz attempts:", e); }

            // 2. Recent lesson progress
            try {
                const lessonProgress = await LessonProgress.find({ student_id: userId })
                    .sort({ last_accessed: -1 })
                    .limit(5)
                    .populate({ path: "lesson_id", model: Lesson, select: "title" })
                    .lean() as any[];

                lessonProgress.forEach((progress) => {
                    if (!progress.lesson_id) return;
                    const t = progress.last_accessed ? new Date(progress.last_accessed) : new Date(progress.updatedAt);
                    recentActivities.push({
                        type: "lesson",
                        text: `Studied lesson '${progress.lesson_id.title}'`,
                        time: t,
                        timeFormatted: formatTimeAgo(t),
                    });
                });
            } catch (e) { console.error("[recent-activity] lesson progress:", e); }

            // 3. Recent class enrollments
            try {
                const participations = await ClassParticipant.find({ user_id: userId, role: "student" })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .populate({ path: "class_id", model: VirtualClass, select: "class_title" })
                    .lean() as any[];

                participations.forEach((p) => {
                    if (!p.class_id) return;
                    const t = new Date(p.createdAt);
                    recentActivities.push({
                        type: "class",
                        text: `Enrolled in virtual class '${p.class_id.class_title}'`,
                        time: t,
                        timeFormatted: formatTimeAgo(t),
                    });
                });
            } catch (e) { console.error("[recent-activity] participations:", e); }

            // 4. Account registration as fallback
            if (currentUser) {
                const t = new Date(currentUser.createdAt);
                recentActivities.push({
                    type: "user",
                    text: "You joined the platform",
                    time: t,
                    timeFormatted: formatTimeAgo(t),
                });
            }

        } else if (roleName === "teacher") {
            // 1. Courses created
            try {
                const courses = await Course.find({ created_by: userId })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .lean() as any[];

                courses.forEach((course) => {
                    const t = new Date(course.createdAt);
                    recentActivities.push({
                        type: "course",
                        text: `Created new course '${course.title}'`,
                        time: t,
                        timeFormatted: formatTimeAgo(t),
                    });
                });
            } catch (e) { console.error("[recent-activity] teacher courses:", e); }

            // 2. Virtual classes scheduled
            try {
                const classes = await VirtualClass.find({ teacher_id: userId })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .lean() as any[];

                classes.forEach((cls) => {
                    const t = new Date(cls.createdAt);
                    recentActivities.push({
                        type: "class",
                        text: `Scheduled virtual class '${cls.class_title}'`,
                        time: t,
                        timeFormatted: formatTimeAgo(t),
                    });
                });
            } catch (e) { console.error("[recent-activity] teacher classes:", e); }

            // 3. Resources uploaded
            try {
                const resources = await Resource.find({ created_by: userId })
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .lean() as any[];

                resources.forEach((res) => {
                    const t = new Date(res.createdAt);
                    recentActivities.push({
                        type: "resource",
                        text: `Uploaded resource '${res.title}'`,
                        time: t,
                        timeFormatted: formatTimeAgo(t),
                    });
                });
            } catch (e) { console.error("[recent-activity] teacher resources:", e); }

            // 4. Account registration as fallback
            if (currentUser) {
                const t = new Date(currentUser.createdAt);
                recentActivities.push({
                    type: "user",
                    text: "You joined as a teacher",
                    time: t,
                    timeFormatted: formatTimeAgo(t),
                });
            }

        } else if (roleName === "admin") {
            // Recent user registrations
            try {
                const recentUsers = await User.find()
                    .sort({ createdAt: -1 })
                    .limit(6)
                    .lean() as any[];

                recentUsers.forEach((u) => {
                    if (u._id.toString() === userId) return;
                    const t = new Date(u.createdAt);
                    recentActivities.push({
                        type: "user",
                        text: `New ${u.role === "teacher" ? "teacher" : "student"} registered: '${u.full_name}'`,
                        time: t,
                        timeFormatted: formatTimeAgo(t),
                    });
                });
            } catch (e) { console.error("[recent-activity] admin users:", e); }

            // Recent courses created on the platform
            try {
                const recentCourses = await Course.find()
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .lean() as any[];

                recentCourses.forEach((course) => {
                    const t = new Date(course.createdAt);
                    recentActivities.push({
                        type: "course_admin",
                        text: `New course created: '${course.title}'`,
                        time: t,
                        timeFormatted: formatTimeAgo(t),
                    });
                });
            } catch (e) { console.error("[recent-activity] admin courses:", e); }
        }

        // Sort all combined activities newest-first and cap at 5
        recentActivities.sort((a, b) => b.time.getTime() - a.time.getTime());
        recentActivities = recentActivities.slice(0, 5);

        return NextResponse.json({
            recentActivities: recentActivities.map((a) => ({
                type: a.type,
                text: a.text,
                time: a.timeFormatted,
            })),
        });
    } catch (err: unknown) {
        console.error("[RECENT_ACTIVITY]", err);
        return NextResponse.json(
            { error: "Something went wrong fetching recent activity." },
            { status: 500 }
        );
    }
}
