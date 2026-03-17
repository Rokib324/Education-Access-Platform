"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BiLogoFacebook,
  BiLogoTwitter,
  BiLogoLinkedin,
  BiLogoYoutube,
} from "react-icons/bi";

const PLATFORM_LINKS = [
  { href: "/dashboard/courses", label: "Courses" },
  { href: "/dashboard/virtual-classes", label: "Virtual Classes" },
  { href: "/dashboard/resources", label: "Resources" },
  { href: "/dashboard/study-groups", label: "Study Groups" },
  { href: "/dashboard/forum", label: "Forums" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/", label: "Careers" },
  { href: "/", label: "Blog" },
  { href: "/", label: "Partnerships" },
];

const LEGAL_LINKS = [
  { href: "/", label: "Privacy Policy" },
  { href: "/", label: "Terms of Service" },
  { href: "/", label: "Cookie Policy" },
  { href: "/", label: "Accessibility" },
];

const SOCIAL = [
  { icon: <BiLogoFacebook className="h-4 w-4" />, href: "#", label: "Facebook" },
  { icon: <BiLogoTwitter className="h-4 w-4" />, href: "#", label: "Twitter" },
  { icon: <BiLogoLinkedin className="h-4 w-4" />, href: "#", label: "LinkedIn" },
  { icon: <BiLogoYoutube className="h-4 w-4" />, href: "#", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-zinc-950">
      {/* Background glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/8 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid gap-10 md:grid-cols-5"
        >
          {/* Brand col — spans 2 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
                <span className="text-sm font-extrabold text-white">EA</span>
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-white">EduAccess</p>
                <p className="text-[10px] text-zinc-500">
                  For every learner
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
              Empowering underprivileged communities through accessible,
              offline-ready education. Learn anywhere, grow everywhere.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Mission pill */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span className="text-xs text-indigo-300 font-medium">
                Free for underprivileged learners
              </span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Platform
            </p>
            <ul className="mt-4 space-y-2.5">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Company
            </p>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Legal
            </p>
            <ul className="mt-4 space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter mini */}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Newsletter
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-3 py-2 text-xs font-bold text-white hover:opacity-90 transition-all hover:scale-105">
                  →
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/8" />

        {/* Bottom row */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-6 flex flex-col items-center justify-between gap-4 text-xs text-zinc-600 md:flex-row"
        >
          <p>
            © {new Date().getFullYear()} EduAccess. All rights reserved. Built
            to bridge the education gap.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-400 transition-colors">
              Privacy
            </Link>
            <Link href="/" className="hover:text-zinc-400 transition-colors">
              Terms
            </Link>
            <Link href="/" className="hover:text-zinc-400 transition-colors">
              Accessibility
            </Link>
            <span className="flex items-center gap-1 text-indigo-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
              All systems operational
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;