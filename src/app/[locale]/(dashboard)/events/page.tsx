import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getOrganizerByUserId } from "@/lib/queries/events";
import { getEventsByOrganizerPaginated } from "@/lib/queries/events";
import { parsePaginationParams } from "@/lib/utils/search-params";
import { EventsList } from "@/components/sections/events/events-list";
import { Icon } from "@/components/shared/icon";
import { Link } from "@/i18n/navigation";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations("events");
  const session = await auth.api.getSession({ headers: await headers() });
  const organizer = session
    ? await getOrganizerByUserId(session.user.id)
    : null;

  const sp = await searchParams;
  const params = parsePaginationParams(sp);
  const statusFilter = typeof sp.status === "string" ? sp.status : undefined;

  const result = organizer
    ? await getEventsByOrganizerPaginated(organizer.id, params, statusFilter)
    : { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <Link
          href="/events/create"
          className="flex items-center gap-2 rounded-2xl bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal/90"
        >
          <Icon name="add" size={20} />
          {t("createEvent")}
        </Link>
      </div>

      {/* Events List */}
      <EventsList result={result} />
    </div>
  );
}
