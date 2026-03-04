import React from "react";
import type { UserRole } from "@/types/auth";

type RoleGateProps = {
  allowedRoles: UserRole[];
  currentRole: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * Renders `children` only when `currentRole` is in `allowedRoles`.
 * Optionally renders `fallback` otherwise.
 */
const RoleGate: React.FC<RoleGateProps> = ({
  allowedRoles,
  currentRole,
  children,
  fallback = null,
}) => {
  if (!allowedRoles.includes(currentRole)) return <>{fallback}</>;
  return <>{children}</>;
};

export default RoleGate;