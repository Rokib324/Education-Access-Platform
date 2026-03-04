import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="student" userName="Rakib Islam">
      {children}
    </DashboardLayout>
  );
}