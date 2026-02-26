import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export type UserRole = "student" | "teacher" | "admin";

type DashboardLayoutProps = {
  children: React.ReactNode;
  role?: UserRole;
  userName?: string;
};

const DashboardLayout = ({
  children,
  role = "student",
  userName = "Rakib",
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex max-w-7xl">
        <Sidebar role={role} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar role={role} userName={userName} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
