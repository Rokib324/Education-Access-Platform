import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-900 text-sm font-bold text-white">
                EA
              </span>
              <span className="text-sm font-semibold text-zinc-900">
                Education Access
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-600">
              Empowering underprivileged communities through accessible, offline-ready education.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="text-sm font-semibold text-zinc-900">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>
                <Link href="/courses" className="hover:text-zinc-900">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-zinc-900">
                  Virtual Classes
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-zinc-900">
                  Offline Learning
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-zinc-900">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold text-zinc-900">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>
                <Link href="/about" className="hover:text-zinc-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-zinc-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-zinc-900">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-zinc-900">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-sm font-semibold text-zinc-900">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>
                <Link href="/" className="hover:text-zinc-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-zinc-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-6 text-sm text-zinc-500 md:flex-row">
          <p>© {new Date().getFullYear()} Education Access. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-zinc-900">Facebook</Link>
            <Link href="#" className="hover:text-zinc-900">Twitter</Link>
            <Link href="#" className="hover:text-zinc-900">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;