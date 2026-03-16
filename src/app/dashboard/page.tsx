import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth/sessions";

export default async function DashboardIndexPage() {
  const session = await getSessionFromCookies();

  if (!session) {
    redirect("/auth/login");
  }

  const role = session.roleName;

  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "teacher") {
    redirect("/dashboard/teacher");
  } else if (role === "student") {
    redirect("/dashboard/student");
  } else {
    // Fallback if role is unknown or not set
    redirect("/");
  }
}
