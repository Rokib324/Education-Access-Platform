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
  BiFile,
  BiGroup,
  BiHome,
  BiPencil,
  BiShield,
  BiUser,
} from "react-icons/bi";
import { UserRole } from "./DashboardLayout";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
};

const navItems: NavItem[] = [
  {
    href: "/dashboard/dashboard",
    label: "Dashboard",
    icon: <BiHome className="h-5 w-5" />,
    roles: ["student", "teacher", "admin"],
  },
  {
    href: "/dashboard/courses",
    label: "Courses",
    icon: <BiBook className="h-5 w-5" />,
    roles: ["student", "teacher", "admin"],
  },
  {
    href: "/dashboard/lessons",
    label: "Lessons",
    icon: <BiBookOpen className="h-5 w-5" />,
    roles: ["student", "teacher", "admin"],
  },
  {
    href: "/dashboard/courses/manage",
    label: "Manage Courses",
    icon: <BiPencil className="h-5 w-5" />,
    roles: ["teacher", "admin"],
  },
  {
    href: "/dashboard/virtual-classes",
    label: "Virtual Classes",
    icon: <BiDesktop className="h-5 w-5" />,
    roles: ["student", "teacher", "admin"],
  },
  {
    href: "/dashboard/study-groups",
    label: "Study Groups",
    icon: <BiGroup className="h-5 w-5" />,
    roles: ["student", "teacher", "admin"],
  },
  {
    href: "/dashboard/resources",
    label: "Resources",
    icon: <BiFile className="h-5 w-5" />,
    roles: ["student", "teacher", "admin"],
  },
  {
    href: "/dashboard/forum",
    label: "Forum",
    icon: <BiChat className="h-5 w-5" />,
    roles: ["student", "teacher", "admin"],
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: <BiUser className="h-5 w-5" />,
    roles: ["student", "teacher", "admin"],
  },
  {
    href: "/dashboard/admin",
    label: "Admin Panel",
    icon: <BiShield className="h-5 w-5" />,
    roles: ["admin"],
  },
];

type SidebarProps = {
  role: UserRole;
};

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const filtered = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-col border-r border-zinc-200 bg-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo area */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-3">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-900 text-xs font-bold text-white">
              EA
            </span>
            <span className="text-sm font-semibold text-zinc-900">
              EduAccess
            </span>
          </div>
        )}
        {collapsed && (
          <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-zinc-900 text-xs font-bold text-white">
            EA
          </span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 ${
            collapsed ? "mx-auto" : ""
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

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filtered.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard/dashboard" &&
                pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={item.label}
                  className={`flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Role badge at bottom */}
      {!collapsed && (
        <div className="border-t border-zinc-100 px-4 py-3">
          <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600">
            {role}
          </span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;