import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getOrganizerByUserId } from "@/lib/queries/events";
import { getEventsByOrganizer } from "@/lib/queries/events";
import { EventsList } from "@/components/sections/events/events-list";
import { Icon } from "@/components/shared/icon";
import { Link } from "@/i18n/navigation";

export default async function EventsPage() {
  const t = await getTranslations("events");
  const session = await auth.api.getSession({ headers: await headers() });
  const organizer = session
    ? await getOrganizerByUserId(session.user.id)
    : null;
  const events = organizer ? await getEventsByOrganizer(organizer.id) : [];

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
      <EventsList events={events} />
    </div>
  );
}
