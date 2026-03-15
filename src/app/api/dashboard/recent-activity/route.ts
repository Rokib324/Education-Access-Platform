import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import StudentQuizAttempt from "@/lib/db/models/StudentQuizAttempt";
import LessonProgress from "@/lib/db/models/LessonProgress";
import Course from "@/lib/db/models/Course";
import VirtualClass from "@/lib/db/models/VirtualClass";
import Resource from "@/lib/db/models/Resource";
import User from "@/lib/db/models/User";
import Quiz from "@/lib/db/models/Quiz";
import Lesson from "@/lib/db/models/Lesson";

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    
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

        const roleName = payload.roleName.toLowerCase();
        const userId = payload.userId;

        let recentActivities: any[] = [];

        if (roleName === "student") {
            // Fetch recent quiz attempts
            const quizAttempts = await StudentQuizAttempt.find({ student_id: userId })
                .sort({ attempted_at: -1 })
                .limit(5)
                .populate({ path: "quiz_id", model: Quiz, select: "title" })
                .lean();

            quizAttempts.forEach((attempt: any) => {
                if (!attempt.quiz_id) return;
                recentActivities.push({
                    type: "quiz",
                    text: `Attempted quiz '${attempt.quiz_id.title}'`,
                    time: attempt.attempted_at,
                    timeFormatted: formatTimeAgo(attempt.attempted_at),
                });
            });

            // Fetch recent lesson progress
            const lessonProgress = await LessonProgress.find({ student_id: userId })
                .sort({ last_accessed: -1 })
                .limit(5)
                .populate({ path: "lesson_id", model: Lesson, select: "title" })
                .lean();

            lessonProgress.forEach((progress: any) => {
                if (!progress.lesson_id) return;
                recentActivities.push({
                    type: "lesson",
                    text: `Accessed lesson '${progress.lesson_id.title}'`,
                    time: progress.last_accessed,
                    timeFormatted: formatTimeAgo(progress.last_accessed),
                });
            });

        } else if (roleName === "teacher") {
            // Fetch courses created
            const courses = await Course.find({ created_by: userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            courses.forEach((course: any) => {
                recentActivities.push({
                    type: "course",
                    text: `Created new course '${course.title}'`,
                    time: course.createdAt,
                    timeFormatted: formatTimeAgo(course.createdAt),
                });
            });

            // Fetch virtual classes scheduled
            const classes = await VirtualClass.find({ teacher_id: userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            classes.forEach((cls: any) => {
                recentActivities.push({
                    type: "class",
                    text: `Scheduled virtual class '${cls.class_title}'`,
                    time: cls.createdAt,
                    timeFormatted: formatTimeAgo(cls.createdAt),
                });
            });

            // Fetch resources uploaded
            const resources = await Resource.find({ created_by: userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            resources.forEach((res: any) => {
                recentActivities.push({
                    type: "resource",
                    text: `Uploaded resource '${res.title}'`,
                    time: res.createdAt,
                    timeFormatted: formatTimeAgo(res.createdAt),
                });
            });
        } else if (roleName === "admin") {
            // Admin sees recent generic platform activities (like new users or courses)
            const recentUsers = await User.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();
                
            recentUsers.forEach((u: any) => {
                if (u._id.toString() === userId) return; 
                recentActivities.push({
                    type: "user",
                    text: `New ${u.role === 'teacher' ? 'teacher' : 'student'} registered: '${u.full_name}'`,
                    time: u.createdAt,
                    timeFormatted: formatTimeAgo(u.createdAt),
                });
            });

            const recentCourses = await Course.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();
                
            recentCourses.forEach((course: any) => {
                recentActivities.push({
                    type: "course_admin",
                    text: `New course created: '${course.title}'`,
                    time: course.createdAt,
                    timeFormatted: formatTimeAgo(course.createdAt),
                });
            });
        }

        // Sort combined activities and limit to 5
        recentActivities.sort((a, b) => b.time.getTime() - a.time.getTime());
        recentActivities = recentActivities.slice(0, 5);

        // Map icons on frontend or here? Usually frontend maps icons based on type, but we can just return standard stuff
        return NextResponse.json({ recentActivities: recentActivities.map(a => ({
            type: a.type,
            text: a.text,
            time: a.timeFormatted,
        }))});

    } catch (err: unknown) {
        console.error("[RECENT_ACTIVITY]", err);
        return NextResponse.json(
            { error: "Something went wrong fetching recent activity." },
            { status: 500 }
        );
    }
}
