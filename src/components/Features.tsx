import { FaDownload, FaVideo, FaBrain, FaUsers, FaBook, FaAward } from "react-icons/fa";

const Features = () => {
  const items = [
    {
      title: "Interactive learning content",
      description:
        "Lessons with videos, quizzes, and exercises across subjects and grade levels—built to keep learners engaged.",
      Icon: FaBook,
    },
    {
      title: "Offline access",
      description:
        "Download lessons and continue learning without internet. Sync progress automatically when you’re back online.",
      Icon: FaDownload,
    },
    {
      title: "Virtual classroom",
      description:
        "Join live sessions with teachers, chat in real-time, and collaborate using simple classroom tools.",
      Icon: FaVideo,
    },
    {
      title: "Adaptive learning",
      description:
        "Personalized recommendations based on progress and quiz performance—supporting every learner’s pace.",
      Icon: FaBrain,
    },
    {
      title: "Community & peer learning",
      description:
        "Forums and study groups that encourage discussion, teamwork, and support within the community.",
      Icon: FaUsers,
    },
    {
      title: "Skills & certification",
      description:
        "Vocational modules for practical skills and certificates to recognize learning outcomes and progress.",
      Icon: FaAward,
    },
  ];

  return (
    <section className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-zinc-700">Why this platform</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
            Built for accessibility, built for impact.
          </h2>
          <p className="mt-3 text-base text-zinc-600">
            Everything learners and educators need—designed for limited connectivity and real-world constraints.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, description, Icon }) => (
            <div
              key={title}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-zinc-900 text-white shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {description}
                  </p>
                </div>
              </div>

              <div className="mt-5 h-px w-full bg-zinc-100" />

              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                  Offline-ready
                </span>
                <span className="rounded-full bg-zinc-50 px-3 py-1 font-medium text-zinc-700">
                  Learn more →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight row */}
        <div className="mt-10 grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-zinc-900">Low-bandwidth first</p>
            <p className="mt-1 text-sm text-zinc-600">
              Optimized pages and downloadable lessons for remote and low-connectivity areas.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Teacher-friendly tools</p>
            <p className="mt-1 text-sm text-zinc-600">
              Create lessons, schedule classes, and track attendance in one place.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Community-powered</p>
            <p className="mt-1 text-sm text-zinc-600">
              Resource sharing, forums, and study groups that strengthen learning together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;