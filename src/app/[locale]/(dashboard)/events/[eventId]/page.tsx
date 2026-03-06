import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getEventById, getOrganizerByUserId } from "@/lib/queries/events";
import { db } from "@/lib/db";
import { EventDetailView } from "@/components/sections/events/event-detail-view";

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const organizer = session
    ? await getOrganizerByUserId(session.user.id)
    : null;

  const event = await getEventById(eventId);

  if (!event || !organizer || event.organizerId !== organizer.id) {
    notFound();
  }

  const venues = await db.venue.findMany({
    where: { organizerId: organizer.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return <EventDetailView event={event} venues={venues} />;
}
