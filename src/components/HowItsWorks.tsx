import Link from "next/link";
import { FaDownload, FaWifi, FaSyncAlt, FaVideo, FaCommentDots, FaCheckCircle } from "react-icons/fa";

const HowItsWorks = () => {
  const steps = [
    {
      title: "Download lessons",
      description:
        "Save videos, notes, and quizzes to your device so students can learn anytime—no continuous internet needed.",
      Icon: FaDownload,
      badge: "Offline",
    },
    {
      title: "Learn without internet",
      description:
        "Open downloaded content in low-connectivity areas. Progress is stored locally until the device reconnects.",
      Icon: FaWifi,
      badge: "Offline",
    },
    {
      title: "Sync when online",
      description:
        "When the internet is available again, your lesson progress and quiz attempts sync back to your account.",
      Icon: FaSyncAlt,
      badge: "Sync",
    },
    {
      title: "Join live classes",
      description:
        "Teachers schedule sessions and share meeting links. Students join on time to attend live lessons.",
      Icon: FaVideo,
      badge: "Live",
    },
    {
      title: "Interact & collaborate",
      description:
        "Ask questions through chat and participate in discussions. Keep classes engaging even from remote areas.",
      Icon: FaCommentDots,
      badge: "Live",
    },
    {
      title: "Attendance recorded",
      description:
        "Attendance is marked automatically when students join, or by the teacher during the session.",
      Icon: FaCheckCircle,
      badge: "Tracking",
    },
  ];

  return (
    <section className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-zinc-700">How it works</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
              Offline-first learning + real-time classrooms.
            </h2>
            <p className="mt-3 text-base text-zinc-600">
              Designed for remote communities: learn offline, then connect for live teaching when possible.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/register"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Get started
            </Link>
            <Link
              href="/courses"
              className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              Browse courses
            </Link>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ title, description, Icon, badge }, idx) => (
            <div
              key={title}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-zinc-900 shadow-sm shrink-0">
                  <Icon size={24} />
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">
                  {badge}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-zinc-500">Step {idx + 1}</p>
                <h3 className="mt-1 text-base font-semibold text-zinc-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Two-column explanation */}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h3 className="text-base font-semibold text-zinc-900">Offline learning flow</h3>
            <ol className="mt-4 space-y-3 text-sm text-zinc-600">
              <li className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-zinc-900" />
                Download lessons once and keep them on the device.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-zinc-900" />
                Learn offline and save progress locally.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-zinc-900" />
                Sync when internet returns—no data loss.
              </li>
            </ol>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h3 className="text-base font-semibold text-zinc-900">Virtual classroom flow</h3>
            <ol className="mt-4 space-y-3 text-sm text-zinc-600">
              <li className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-zinc-900" />
                Teacher schedules a session and shares the meeting link.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-zinc-900" />
                Students join, interact via chat, and participate.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-zinc-900" />
                Attendance is recorded for tracking and reporting.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItsWorks;