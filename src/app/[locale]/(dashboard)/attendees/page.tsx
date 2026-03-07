import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getOrganizerByUserId } from "@/lib/queries/events";
import { getAttendeesByOrganizer } from "@/lib/queries/attendees";
import { getOrganizerEventOptions } from "@/lib/queries/orders";
import { parsePaginationParams } from "@/lib/utils/search-params";
import { AttendeesTable } from "@/components/sections/attendees/attendees-table";
import { AttendeeFilters } from "@/components/sections/attendees/attendee-filters";

export default async function AttendeesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations("attendees");
  const session = await auth.api.getSession({ headers: await headers() });
  const organizer = session
    ? await getOrganizerByUserId(session.user.id)
    : null;

  const sp = await searchParams;
  const params = parsePaginationParams(sp);
  const filters = {
    eventId: typeof sp.eventId === "string" ? sp.eventId : undefined,
    status: typeof sp.status === "string" ? sp.status : undefined,
    tierId: typeof sp.tierId === "string" ? sp.tierId : undefined,
  };

  const [result, eventOptions] = organizer
    ? await Promise.all([
        getAttendeesByOrganizer(organizer.id, params, filters),
        getOrganizerEventOptions(organizer.id),
      ])
    : [
        { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 },
        [],
      ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <AttendeeFilters eventOptions={eventOptions} />
      <AttendeesTable result={result} />
    </div>
  );
}
