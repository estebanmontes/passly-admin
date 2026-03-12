import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getUsers } from "@/lib/queries/users";
import { parsePaginationParams } from "@/lib/utils/search-params";
import { UsersTable } from "@/components/sections/users/users-table";
import { UserFilters } from "@/components/sections/users/user-filters";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations("users");
  const session = await auth.api.getSession({ headers: await headers() });

  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN";

  const sp = await searchParams;
  const params = parsePaginationParams(sp);
  const filters = {
    role: typeof sp.role === "string" ? sp.role : undefined,
  };

  const result = isAdmin
    ? await getUsers(params, filters)
    : { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <UserFilters />
      <UsersTable result={result} />
    </div>
  );
}
