import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getOrganizerByUserId } from "@/lib/queries/events";
import { db } from "@/lib/db";
import { CreateEventWizard } from "@/components/sections/events/create-event-wizard";

export default async function CreateEventPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const organizer = session
    ? await getOrganizerByUserId(session.user.id)
    : null;

  const venues = organizer
    ? await db.venue.findMany({
        where: { organizerId: organizer.id },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      })
    : [];

  return <CreateEventWizard venues={venues} />;
}
