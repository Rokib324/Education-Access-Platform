import {
  BiBook,
  BiDownload,
  BiBrain,
  BiGroup,
  BiDesktop,
  BiAward,
} from "react-icons/bi";

const features = [
  {
    icon: <BiBook className="h-6 w-6" />,
    title: "Interactive Content",
    description:
      "Multimedia lessons with videos, quizzes, and exercises across all subjects and grade levels.",
    color: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/20",
    detail: "Videos · Quizzes · Exercises",
  },
  {
    icon: <BiDownload className="h-6 w-6" />,
    title: "Offline Access",
    description:
      "Download lessons and study without internet. Progress syncs automatically when you reconnect.",
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
    detail: "Download · Sync · Resume",
  },
  {
    icon: <BiDesktop className="h-6 w-6" />,
    title: "Virtual Classroom",
    description:
      "Real-time live sessions with teachers — video, chat, whiteboard, and attendance tracking.",
    color: "from-red-500 to-rose-500",
    glow: "shadow-red-500/20",
    detail: "Video · Chat · Attendance",
  },
  {
    icon: <BiBrain className="h-6 w-6" />,
    title: "Adaptive Learning",
    description:
      "AI-driven content recommendations tailored to individual strengths, weaknesses and learning pace.",
    color: "from-violet-500 to-purple-500",
    glow: "shadow-violet-500/20",
    detail: "Personalized · Intelligent · Dynamic",
  },
  {
    icon: <BiGroup className="h-6 w-6" />,
    title: "Community & Peer Learning",
    description:
      "Forums, study groups, and collaborative projects that foster discussion and mutual support.",
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
    detail: "Forums · Groups · Projects",
  },
  {
    icon: <BiAward className="h-6 w-6" />,
    title: "Skills & Certification",
    description:
      "Vocational training modules with practical skills and certificates to validate learning achievements.",
    color: "from-indigo-500 to-blue-500",
    glow: "shadow-indigo-500/20",
    detail: "Vocational · Certificates · Skills",
  },
];

const HIGHLIGHTS = [
  {
    label: "Low-Bandwidth First",
    desc: "Optimized pages and downloadable content for remote, low-connectivity areas.",
  },
  {
    label: "Teacher-Friendly Tools",
    desc: "Create lessons, schedule live classes, and track student attendance in one place.",
  },
  {
    label: "Community-Powered",
    desc: "Resource sharing, forums, and study groups that strengthen learning together.",
  },
];

const Features = () => {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-20 md:py-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-indigo-600/10 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
            Why EduAccess
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Built for{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              accessibility
            </span>
            , built for impact
          </h2>
          <p className="mt-4 text-base text-zinc-400">
            Everything learners and educators need — designed for limited
            connectivity and real-world constraints.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/60 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-2xl"
            >
              {/* Hover glow */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${f.color} blur-2xl`}
                style={{ opacity: 0 }}
              />

              <div className="relative">
                {/* Icon */}
                <div
                  className={`inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg ${f.color} ${f.glow}`}
                >
                  {f.icon}
                </div>

                <h3 className="mt-4 text-base font-bold text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {f.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
                  <span className="text-[11px] text-zinc-600">{f.detail}</span>
                  <span
                    className={`rounded-full bg-gradient-to-r px-2.5 py-0.5 text-[11px] font-semibold text-white ${f.color}`}
                  >
                    Explore →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight bar */}
        <div className="mt-10 grid gap-4 rounded-2xl border border-white/8 bg-zinc-900/50 p-6 backdrop-blur md:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label} className="flex gap-3">
              <div className="mt-0.5 h-4 w-1 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
              <div>
                <p className="text-sm font-bold text-white">{h.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {h.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;