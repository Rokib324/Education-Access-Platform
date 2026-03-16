import Link from "next/link";
import {
  BiDownload,
  BiWifi,
  BiRefresh,
  BiDesktop,
  BiMessageDetail,
  BiCheckCircle,
} from "react-icons/bi";

const OFFLINE_STEPS = [
  {
    icon: <BiDownload className="h-5 w-5" />,
    step: "01",
    title: "Download Lessons",
    desc: "Save video lessons, notes, and quizzes to your device with one tap — no ongoing connection needed.",
    badge: "Offline",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    icon: <BiWifi className="h-5 w-5" />,
    step: "02",
    title: "Learn Anywhere",
    desc: "Open downloaded content in the field, village, or low-signal zones. Everything works locally.",
    badge: "Offline",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    icon: <BiRefresh className="h-5 w-5" />,
    step: "03",
    title: "Auto-Sync Progress",
    desc: "When your device reconnects, all progress and quiz scores sync automatically — nothing is lost.",
    badge: "Sync",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
];

const LIVE_STEPS = [
  {
    icon: <BiDesktop className="h-5 w-5" />,
    step: "04",
    title: "Schedule Live Sessions",
    desc: "Teachers create virtual classrooms, set a time, and share a secure meeting link instantly.",
    badge: "Live",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  {
    icon: <BiMessageDetail className="h-5 w-5" />,
    step: "05",
    title: "Interact & Collaborate",
    desc: "Students join via video, ask questions through live chat, and engage in real-time discussions.",
    badge: "Live",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  {
    icon: <BiCheckCircle className="h-5 w-5" />,
    step: "06",
    title: "Attendance Tracked",
    desc: "Attendance is automatically recorded when students join, giving teachers clear participation data.",
    badge: "Tracking",
    badgeColor: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-zinc-900 py-20 md:py-28">
      {/* Glows */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-emerald-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-red-600/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-400">
              How it works
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Offline-first learning +{" "}
              <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                real-time classrooms
              </span>
            </h2>
            <p className="mt-4 text-base text-zinc-400">
              Designed for remote communities — learn offline when you need to,
              then connect for live teaching when possible.
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <Link
              href="/auth/register"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard/courses"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-white/10 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>

        {/* Two track layout */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Track 1: Offline */}
          <div className="rounded-2xl border border-white/8 bg-zinc-950/60 p-6 backdrop-blur">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Offline Flow
              </span>
              <div className="h-1 flex-1 rounded-full bg-gradient-to-l from-emerald-500 to-teal-500" />
            </div>
            <div className="space-y-4">
              {OFFLINE_STEPS.map((s) => (
                <div
                  key={s.step}
                  className="flex items-start gap-4 rounded-xl border border-white/6 bg-white/3 p-4 transition-colors hover:bg-white/6"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-widest text-zinc-600">
                        STEP {s.step}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${s.badgeColor}`}
                      >
                        {s.badge}
                      </span>
                    </div>
                    <h3 className="mt-0.5 text-sm font-bold text-white">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Track 2: Live Classes */}
          <div className="rounded-2xl border border-white/8 bg-zinc-950/60 p-6 backdrop-blur">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-red-500 to-rose-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                Live Classroom Flow
              </span>
              <div className="h-1 flex-1 rounded-full bg-gradient-to-l from-red-500 to-rose-500" />
            </div>
            <div className="space-y-4">
              {LIVE_STEPS.map((s) => (
                <div
                  key={s.step}
                  className="flex items-start gap-4 rounded-xl border border-white/6 bg-white/3 p-4 transition-colors hover:bg-white/6"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/20">
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-widest text-zinc-600">
                        STEP {s.step}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${s.badgeColor}`}
                      >
                        {s.badge}
                      </span>
                    </div>
                    <h3 className="mt-0.5 text-sm font-bold text-white">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 px-8 py-6 text-center md:flex-row md:text-left">
          <div>
            <p className="text-base font-bold text-white">
              Ready to bridge the education gap?
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Join thousands of learners and teachers already on the platform.
            </p>
          </div>
          <Link
            href="/auth/register"
            className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 hover:opacity-90 transition-opacity"
          >
            Start for Free →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;