"use client";

import { useState } from "react";
import Link from "next/link";
import { BiEnvelope, BiLoader, BiArrowBack } from "react-icons/bi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call (email service not yet implemented)
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4">
      <div className="pointer-events-none absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[80px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <span className="text-sm font-extrabold text-white">EA</span>
            </div>
            <span className="text-lg font-bold text-white">EduAccess</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white">
            Reset your password
          </h1>
          <p className="text-sm text-zinc-400">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur">
          {submitted ? (
            <div className="text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 border border-emerald-500/20">
                <BiEnvelope className="h-6 w-6 text-emerald-400" />
              </div>
              <h2 className="text-base font-bold text-white">Check your inbox</h2>
              <p className="mt-2 text-sm text-zinc-400">
                If an account with{" "}
                <span className="text-zinc-200">{email}</span> exists, a
                password reset link has been sent.
              </p>
              <Link
                href="/auth/login"
                className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                <BiArrowBack className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Email address
                </label>
                <div className="relative">
                  <BiEnvelope className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading && <BiLoader className="h-4 w-4 animate-spin" />}
                {loading ? "Sending…" : "Send reset link"}
              </button>

              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300"
              >
                <BiArrowBack className="h-4 w-4" />
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}