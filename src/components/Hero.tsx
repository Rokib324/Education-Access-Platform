"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BiDownload,
  BiDesktop,
  BiGroup,
  BiCheck,
  BiStar,
  BiBook,
} from "react-icons/bi";

const STATS = [
  { value: "10K+", label: "Learners" },
  { value: "500+", label: "Lessons" },
  { value: "150+", label: "Courses" },
  { value: "98%", label: "Satisfaction" },
];

const BADGES = [
  { icon: <BiDownload className="h-3.5 w-3.5" />, text: "Offline Access" },
  { icon: <BiDesktop className="h-3.5 w-3.5" />, text: "Virtual Classes" },
  { icon: <BiGroup className="h-3.5 w-3.5" />, text: "Community Support" },
];

const Hero = () => {
  const [user, setUser] = useState<{ full_name: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch((err) => console.error("[Hero Auth check error]:", err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-zinc-950">
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[100px]" 
        />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 md:pb-28 md:pt-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Feature badge row */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
            {BADGES.map((b) => (
              <span
                key={b.text}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur"
              >
                <span className="text-indigo-400">{b.icon}</span>
                {b.text}
              </span>
            ))}
          </motion.div>

          <div className="mt-8 grid items-center gap-12 lg:grid-cols-2">
            {/* Left — copy */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                {user ? (
                  <>
                    Welcome back, <br />
                    <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                      {user.full_name.split(" ")[0]}!
                    </span>
                  </>
                ) : (
                  <>
                    Quality education{" "}
                    <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                      for every community
                    </span>
                  </>
                )}
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-400 md:text-lg">
                A platform built for learners in remote and underprivileged areas.
                Download lessons, attend live classes, and grow with peer
                communities — with or without internet.
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={user ? "/dashboard" : "/auth/register"}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 hover:opacity-90"
                >
                  {user ? "Go to Dashboard →" : "Start Learning Free →"}
                </Link>
                <Link
                  href="/dashboard/courses"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 backdrop-blur transition-all hover:bg-white/10"
                >
                  <BiBook className="h-4 w-4" />
                  Browse Courses
                </Link>
              </div>

              {/* Trust note */}
              <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
                <div className="flex -space-x-2">
                  {["F", "K", "A", "R"].map((l) => (
                    <div
                      key={l}
                      className="grid h-7 w-7 place-items-center rounded-full border border-zinc-800 bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white"
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <span>
                  Joined by{" "}
                  <span className="font-semibold text-zinc-300">10,000+</span>{" "}
                  learners worldwide
                </span>
              </div>
            </motion.div>

            {/* Right — interactive card */}
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 blur-xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      {user ? "Your Progress" : "Today's Learning"}
                    </p>
                    <h3 className="mt-0.5 text-base font-bold text-white">
                      Mathematics — Grade 5
                    </h3>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
                    <BiStar className="h-3.5 w-3.5" />
                    In Progress
                  </span>
                </div>

                {/* Lesson cards */}
                <div className="mt-5 space-y-3">
                  {[
                    { lesson: "Measurement Basics", pct: 100, done: true },
                    { lesson: "Fractions & Division", pct: 67, done: false },
                    { lesson: "Geometry Introduction", pct: 0, done: false },
                  ].map((item) => (
                    <div
                      key={item.lesson}
                      className="rounded-xl border border-white/8 bg-white/5 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-zinc-100">
                          {item.lesson}
                        </p>
                        {item.done && (
                          <BiCheck className="h-4 w-4 text-emerald-400" />
                        )}
                      </div>
                      <div className="mt-2.5 h-1.5 w-full rounded-full bg-zinc-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-zinc-500">
                        {item.pct}% complete
                      </p>
                    </div>
                  ))}
                </div>

                {/* Live class banner */}
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/20 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                    <div>
                      <p className="text-xs font-semibold text-red-300">
                        LIVE NOW
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Math Session with Ms. Fatima
                      </p>
                    </div>
                  </div>
                  <button className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600 transition-colors">
                    Join
                  </button>
                </motion.div>

                {/* Quick features row */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: "Offline", sub: "Download" },
                    { label: "Live", sub: "Classes" },
                    { label: "Skills", sub: "Vocational" },
                  ].map((f) => (
                    <div
                      key={f.label}
                      className="rounded-xl bg-white/5 p-3 text-center transition-colors hover:bg-white/10"
                    >
                      <p className="text-xs font-bold text-white">{f.label}</p>
                      <p className="mt-0.5 text-[10px] text-zinc-500">{f.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center group">
                <p className="text-2xl font-extrabold text-white transition-transform group-hover:scale-110">{s.value}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;