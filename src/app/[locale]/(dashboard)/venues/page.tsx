import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getOrganizerByUserId } from "@/lib/queries/events";
import { getVenuesByOrganizer } from "@/lib/queries/venues";
import { parsePaginationParams } from "@/lib/utils/search-params";
import { VenuesList } from "@/components/sections/venues/venues-list";

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations("venues");
  const session = await auth.api.getSession({ headers: await headers() });
  const organizer = session
    ? await getOrganizerByUserId(session.user.id)
    : null;

  const params = parsePaginationParams(await searchParams);
  const result = organizer
    ? await getVenuesByOrganizer(organizer.id, params)
    : { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      </div>
      <VenuesList result={result} />
    </div>
  );
}
