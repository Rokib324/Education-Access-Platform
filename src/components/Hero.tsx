import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Left */}
          <div>
            <p className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
              Offline learning • Virtual classroom • Community support
            </p>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
              Education access for learners in remote & underprivileged communities.
            </h1>

            <p className="mt-4 text-base text-zinc-600 md:text-lg">
              Learn with interactive lessons, quizzes, and skill-based courses. Download
              content for offline use, join live classes, and grow with peer support.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="rounded-md bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Get Started
              </Link>

              <Link
                href="/courses"
                className="rounded-md border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                Browse Courses
              </Link>
            </div>

            {/* Quick stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 rounded-xl border border-zinc-200 bg-white p-4">
              <div>
                <p className="text-lg font-bold text-zinc-900">100+</p>
                <p className="text-xs text-zinc-500">Lessons</p>
              </div>
              <div>
                <p className="text-lg font-bold text-zinc-900">Offline</p>
                <p className="text-xs text-zinc-500">Access</p>
              </div>
              <div>
                <p className="text-lg font-bold text-zinc-900">Live</p>
                <p className="text-xs text-zinc-500">Classes</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-zinc-100 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-900">Today’s Learning</p>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                  Grade 2 • Math
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-zinc-200 p-4">
                  <p className="text-sm font-semibold text-zinc-900">
                    Measurement Basics
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Videos • Exercises • Quiz
                  </p>
                  <div className="mt-3 h-2 w-full rounded-full bg-zinc-100">
                    <div className="h-2 w-2/3 rounded-full bg-zinc-900" />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">Progress: 67%</p>
                </div>

                <div className="rounded-xl border border-zinc-200 p-4">
                  <p className="text-sm font-semibold text-zinc-900">
                    Live Class (Starts 5:00 PM)
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Join teacher + chat + attendance
                  </p>
                  <button className="mt-3 w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800">
                    Join Class
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-zinc-50 p-3">
                  <p className="text-xs font-semibold text-zinc-900">Offline</p>
                  <p className="mt-1 text-[11px] text-zinc-600">Download lessons</p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3">
                  <p className="text-xs font-semibold text-zinc-900">Community</p>
                  <p className="mt-1 text-[11px] text-zinc-600">Study groups</p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3">
                  <p className="text-xs font-semibold text-zinc-900">Skills</p>
                  <p className="mt-1 text-[11px] text-zinc-600">Vocational</p>
                </div>
              </div>
            </div>
          </div>
          {/* end right */}
        </div>
      </div>
    </section>
  );
};

export default Hero;