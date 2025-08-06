import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { UserManagement } from "@/features/admin/dashboard/components/user-management.component";

export default async function UsersPage({
  params,
}: {
  params: { locale: string };
}) {
  const session = await auth();

  // Check if user is authenticated and has proper role
  if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
    redirect({ href: "/dashboard", locale: params.locale });
  }

  return <UserManagement />;
}
