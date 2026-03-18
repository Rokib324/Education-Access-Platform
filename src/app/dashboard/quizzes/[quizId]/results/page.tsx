"use client";

import { use } from "react";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import QuizResultsTable from "@/components/quizes/QuizResultsTable";

export default function QuizResultsPage({ params }: { params: Promise<{ quizId: string }> }) {
    const { quizId } = use(params);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Link href="/dashboard/quizzes/manage" className="flex items-center gap-1 hover:text-zinc-800 transition-colors">
                    <BiArrowBack className="h-4 w-4" />
                    Manage Quizzes
                </Link>
                <span>/</span>
                <span className="text-zinc-800 font-medium">Quiz Results</span>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h1 className="text-xl font-bold text-zinc-900 mb-1">Quiz Results</h1>
                <p className="text-sm text-zinc-500">View all student submissions and scores for this quiz.</p>
            </div>

            <QuizResultsTable quizId={quizId} />
        </div>
    );
}
