import React from 'react';
import { UserRole } from './DashboardLayout'; // or '../types'

type SidebarProps = {
  role: UserRole;
};

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  // ...render sidebar based on role...
  return (
    <nav>
      {/* … */}
      <p>current role: {role}</p>
    </nav>
  );
};

export default Sidebar;