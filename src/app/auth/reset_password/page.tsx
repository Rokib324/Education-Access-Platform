"use client";

import { useState } from "react";
import Link from "next/link";
import { BiLock, BiShow, BiHide, BiLoader, BiCheck } from "react-icons/bi";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    // Token-based reset to be implemented with email service
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[80px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <span className="text-sm font-extrabold text-white">EA</span>
            </div>
            <span className="text-lg font-bold text-white">EduAccess</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white">Set new password</h1>
          <p className="text-sm text-zinc-400">Choose a strong new password</p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur">
          {done ? (
            <div className="text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 border border-emerald-500/20">
                <BiCheck className="h-7 w-7 text-emerald-400" />
              </div>
              <h2 className="text-base font-bold text-white">
                Password updated!
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Your password has been reset successfully.
              </p>
              <Link
                href="/auth/login"
                className="mt-6 inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
              >
                Sign in now →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                  New password
                </label>
                <div className="relative">
                  <BiLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-11 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <BiHide className="h-4 w-4" />
                    ) : (
                      <BiShow className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Confirm new password
                </label>
                <div className="relative">
                  <BiLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Repeat your password"
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
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}