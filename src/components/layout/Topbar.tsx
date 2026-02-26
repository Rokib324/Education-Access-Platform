import React from "react";
import type { UserRole } from "./DashboardLayout";

type TopbarProps = {
  role: UserRole;
  userName: string;
};

const Topbar: React.FC<TopbarProps> = ({ role, userName }) => {
  return (
    <header className="h-16 bg-white border-b flex items-center px-4">
      <span className="font-medium">{userName}</span>
      <span className="ml-auto text-sm text-gray-500">{role}</span>
    </header>
  );
};

export default Topbar;