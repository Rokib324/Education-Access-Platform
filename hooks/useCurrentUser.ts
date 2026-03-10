"use client";

import { useState, useEffect } from "react";

export type CurrentUser = {
    id: string;
    full_name: string;
    email: string;
    role: "student" | "teacher" | "admin";
    profile_photo?: string;
};

/**
 * Hook that fetches the authenticated user's profile (role, name, etc.)
 * from the /api/auth/me endpoint.
 */
export function useCurrentUser() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/me")
            .then((r) => r.json())
            .then((d) => setUser(d.user ?? null))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin";
    const isAdmin = user?.role === "admin";

    return { user, loading, isTeacherOrAdmin, isAdmin };
}
