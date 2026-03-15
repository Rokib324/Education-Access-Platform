import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import Course from "@/lib/db/models/Course";
import LessonProgress from "@/lib/db/models/LessonProgress";
import Post from "@/lib/db/models/Post";
import Certification from "@/lib/db/models/Certification";
import VirtualClassSession from "@/lib/db/models/VirtualClassSession";
import StudentQuizAttempt from "@/lib/db/models/StudentQuizAttempt";
import ClassParticipant from "@/lib/db/models/ClassParticipant";
import Role from "@/lib/db/models/Role";
import { getTokenFromRequest } from "@/lib/auth/sessions";

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
    let stats: { label: string; value: number }[] = [];

    if (roleName === "student") {
      const [enrolledCoursesCount, completedLessonsCount, userPostsCount, earnedCertificatesCount] = await Promise.all([
        ClassParticipant.countDocuments({ user_id: userId, role: "student" }),
        LessonProgress.countDocuments({ student_id: userId, completion_percentage: 100 }),
        Post.countDocuments({ author_id: userId }),
        Certification.countDocuments({ student_id: userId }),
      ]);

      stats = [
        { label: "Enrolled", value: enrolledCoursesCount },
        { label: "Lessons", value: completedLessonsCount },
        { label: "Posts", value: userPostsCount },
        { label: "Certificates", value: earnedCertificatesCount },
      ];
    } else if (roleName === "teacher") {
      const activeCoursesCount = await Course.countDocuments({ created_by: userId });
      
      const teacherClasses = await ClassParticipant.find({ user_id: userId, role: "host" }).select("class_id");
      const classIds = teacherClasses.map(c => c.class_id);
      
      const studentsEnrolledCount = await ClassParticipant.countDocuments({ 
        class_id: { $in: classIds }, 
        role: "student" 
      });

      const ungradedAssignmentsCount = await StudentQuizAttempt.countDocuments({}); 

      const upcomingClassesCount = await VirtualClassSession.countDocuments({
         class_id: { $in: classIds },
         started_at: { $gt: new Date() }
      });

      stats = [
        { label: "Active Courses", value: activeCoursesCount },
        { label: "Students Enrolled", value: studentsEnrolledCount },
        { label: "Assignments to Grade", value: ungradedAssignmentsCount },
        { label: "Upcoming Classes", value: upcomingClassesCount },
      ];
    } else if (roleName === "admin") {
      const teacherRole = await Role.findOne({ role_name: "teacher" });
      
      const [totalUsers, activeTeachersCount, totalCourses] = await Promise.all([
        User.countDocuments(),
        teacherRole ? User.countDocuments({ role_id: teacherRole._id }) : 0,
        Course.countDocuments(),
      ]);
      
      stats = [
        { label: "Total Users", value: totalUsers },
        { label: "Active Teachers", value: activeTeachersCount },
        { label: "Total Courses", value: totalCourses },
        { label: "System Reports", value: 12 }, // Placeholder as requested
      ];
    }

    return NextResponse.json({ stats });
  } catch (err: unknown) {
    console.error("[PROFILE_STATS]", err);
    return NextResponse.json(
        { error: "Something went wrong fetching stats." },
        { status: 500 }
    );
  }
}
