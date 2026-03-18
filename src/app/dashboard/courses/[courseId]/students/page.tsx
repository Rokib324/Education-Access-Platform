"use client";

import { use } from "react";
import EnrolledStudentsList from "@/components/courses/EnrolledStudentsList";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CourseStudentsPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = use(params);
    const { user, loading } = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && user.role === "student") {
            router.replace(`/dashboard/courses/${courseId}`);
        }
    }, [user, loading, courseId, router]);

    if (loading) return (
        <div className="flex items-center justify-center py-24 text-zinc-400 text-sm">
            Loading…
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Link href={`/dashboard/courses/${courseId}`} className="flex items-center gap-1 hover:text-zinc-800 transition-colors">
                    <BiArrowBack className="h-4 w-4" />
                    Back to Course
                </Link>
                <span>/</span>
                <span className="text-zinc-800 font-medium">Enrolled Students</span>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h1 className="text-xl font-bold text-zinc-900 mb-1">Enrolled Students</h1>
                <p className="text-sm text-zinc-500">View student enrollment and track their lesson progress.</p>
            </div>

            <EnrolledStudentsList courseId={courseId} />
        </div>
    );
}
