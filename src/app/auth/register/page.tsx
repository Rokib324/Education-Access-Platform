"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BiUser,
  BiEnvelope,
  BiLock,
  BiShow,
  BiHide,
  BiLoader,
  BiMap,
  BiChevronDown,
} from "react-icons/bi";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
    location: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }

      router.push("/dashboard/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-10">
      {/* Background glows */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <span className="text-sm font-extrabold text-white">EA</span>
            </div>
            <span className="text-lg font-bold text-white">EduAccess</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white">
            Create your account
          </h1>
          <p className="text-sm text-zinc-400">
            Free access to quality education for everyone
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/8 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Role selector */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                I am a
              </label>
              <div className="relative">
                <BiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-10 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="student" className="bg-zinc-900">
                    📚 Student
                  </option>
                  <option value="teacher" className="bg-zinc-900">
                    🎓 Teacher
                  </option>
                </select>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Full name
              </label>
              <div className="relative">
                <BiUser className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Email address
              </label>
              <div className="relative">
                <BiEnvelope className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Location (optional) */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Location{" "}
                <span className="text-zinc-600">(optional)</span>
              </label>
              <div className="relative">
                <BiMap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  autoComplete="address-level2"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Password{" "}
                <span className="text-zinc-600">(min. 6 characters)</span>
              </label>
              <div className="relative">
                <BiLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
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
              {/* Password strength indicator */}
              {form.password && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        form.password.length >= i * 3
                          ? form.password.length >= 10
                            ? "bg-emerald-500"
                            : form.password.length >= 6
                            ? "bg-amber-500"
                            : "bg-red-500"
                          : "bg-zinc-800"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading && <BiLoader className="h-4 w-4 animate-spin" />}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-600">
            By signing up, you agree to our{" "}
            <Link href="/" className="text-zinc-400 hover:text-white">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/" className="text-zinc-400 hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="mt-4 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}