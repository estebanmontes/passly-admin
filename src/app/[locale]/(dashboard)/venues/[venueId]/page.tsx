import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getOrganizerByUserId } from "@/lib/queries/events";
import { getVenueById } from "@/lib/queries/venues";
import { VenueDetailView } from "@/components/sections/venues/venue-detail-view";
import { EmptyState } from "@/components/shared/empty-state";

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ venueId: string }>;
}) {
  const { venueId } = await params;
  const t = await getTranslations("venues");
  const session = await auth.api.getSession({ headers: await headers() });
  const organizer = session
    ? await getOrganizerByUserId(session.user.id)
    : null;

  const venue = await getVenueById(venueId);

  if (!venue || !organizer || venue.organizer.id !== organizer.id) {
    return <EmptyState icon="location_on" title={t("notFound")} />;
  }

  return <VenueDetailView venue={venue} />;
}
