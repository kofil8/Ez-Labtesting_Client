import { extractRoleFromToken, getDashboardRouteForRole } from "@/lib/auth/shared";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardIndexPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const role = extractRoleFromToken(accessToken);
  redirect(getDashboardRouteForRole(role));
}
