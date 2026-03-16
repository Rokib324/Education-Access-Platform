"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BiBook,
  BiBookOpen,
  BiChat,
  BiChevronLeft,
  BiChevronRight,
  BiDesktop,
  BiDownload,
  BiFile,
  BiGroup,
  BiHome,
  BiLayer,
  BiPencil,
  BiShield,
  BiTag,
  BiUser,
  BiVideo,
  BiListUl,
} from "react-icons/bi";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import type { UserRole } from "@/types/auth";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
};

type NavSection = {
  title: string;
  items: NavItem[];
};

// ─── Navigation Structure ─────────────────────────────────────────────────────
// Role guide:
//   student  → browse, learn, download, community
//   teacher  → all student views + manage their own courses, subjects, lessons
//   admin    → everything + admin panel, grade management
const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: <BiHome className="h-5 w-5" />,
        roles: ["student", "teacher", "admin"],
      },
    ],
  },
  {
    title: "Learning",
    items: [
      {
        href: "/dashboard/courses",
        label: "Courses",
        icon: <BiBook className="h-5 w-5" />,
        roles: ["student", "teacher", "admin"],
      },
      {
        href: "/dashboard/lessons",
        label: "My Lessons",
        icon: <BiBookOpen className="h-5 w-5" />,
        roles: ["student"],
      },
      {
        href: "/dashboard/virtual-classes",
        label: "Virtual Classes",
        icon: <BiDesktop className="h-5 w-5" />,
        roles: ["student", "teacher", "admin"],
      },
      {
        href: "/dashboard/offline-downloads",
        label: "Offline Downloads",
        icon: <BiDownload className="h-5 w-5" />,
        roles: ["student"],
      },
    ],
  },
  {
    title: "Community",
    items: [
      {
        href: "/dashboard/study-groups",
        label: "Study Groups",
        icon: <BiGroup className="h-5 w-5" />,
        roles: ["student", "teacher", "admin"],
      },
      {
        href: "/dashboard/forum",
        label: "Forum",
        icon: <BiChat className="h-5 w-5" />,
        roles: ["student", "teacher", "admin"],
      },
    ],
  },
  {
    title: "Library",
    items: [
      {
        href: "/dashboard/resources",
        label: "Resources",
        icon: <BiFile className="h-5 w-5" />,
        roles: ["student", "teacher", "admin"],
      },
    ],
  },
  {
    title: "Manage",
    items: [
      {
        href: "/dashboard/courses/manage",
        label: "Manage Courses",
        icon: <BiPencil className="h-5 w-5" />,
        roles: ["teacher", "admin"],
      },
      {
        href: "/dashboard/manage/subjects",
        label: "Manage Subjects",
        icon: <BiTag className="h-5 w-5" />,
        roles: ["teacher", "admin"],
      },
      {
        href: "/dashboard/manage/grades",
        label: "Manage Grades",
        icon: <BiLayer className="h-5 w-5" />,
        roles: ["admin"],
      },
      {
        href: "/dashboard/manage/resources",
        label: "Manage Resources",
        icon: <BiListUl className="h-5 w-5" />,
        roles: ["teacher", "admin"],
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        href: "/dashboard/admin",
        label: "Admin Panel",
        icon: <BiShield className="h-5 w-5" />,
        roles: ["admin"],
      },
      {
        href: "/dashboard/admin/users",
        label: "Manage Users",
        icon: <HiOutlineAcademicCap className="h-5 w-5" />,
        roles: ["admin"],
      },
      {
        href: "/dashboard/admin/courses",
        label: "Course Approvals",
        icon: <BiBook className="h-5 w-5" />,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        href: "/dashboard/profile",
        label: "Profile",
        icon: <BiUser className="h-5 w-5" />,
        roles: ["student", "teacher", "admin"],
      },
    ],
  },
];

// Role badge colours
const ROLE_STYLES: Record<UserRole, string> = {
  admin: "bg-red-100 text-red-700",
  teacher: "bg-blue-100 text-blue-700",
  student: "bg-emerald-100 text-emerald-700",
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
type SidebarProps = { role: UserRole };

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-col border-r border-zinc-200 bg-white transition-all duration-300 ${
        collapsed ? "w-[60px]" : "w-60"
      }`}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-3 shrink-0">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-900 text-xs font-bold text-white">
              EA
            </span>
            <span className="text-sm font-semibold text-zinc-900 leading-tight">
              EduAccess
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto block hover:opacity-80 transition-opacity">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-900 text-xs font-bold text-white">
              EA
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 shrink-0 ${
            collapsed ? "mx-auto mt-0" : ""
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <BiChevronRight className="h-4 w-4" />
          ) : (
            <BiChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-none">
        {NAV_SECTIONS.map((section) => {
          // Filter items by role
          const visibleItems = section.items.filter((item) =>
            item.roles.includes(role)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="mb-1">
              {/* Section label */}
              {!collapsed && (
                <p className="mb-1 px-4 pt-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {section.title}
                </p>
              )}
              {collapsed && (
                <div className="mx-auto mb-1 mt-3 h-px w-8 bg-zinc-200" />
              )}

              <ul className="space-y-0.5 px-2">
                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={item.label}
                        className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-zinc-900 text-white"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                        } ${collapsed ? "justify-center" : ""}`}
                      >
                        {item.icon}
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* ── Role badge ───────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-zinc-100 px-3 py-3">
        {collapsed ? (
          <div
            className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold uppercase ${ROLE_STYLES[role]}`}
            title={role}
          >
            {role[0]}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${ROLE_STYLES[role]}`}
            >
              {role}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;