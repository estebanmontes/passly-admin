import { db } from "@/lib/db";

export async function getEventsByOrganizer(organizerId: string) {
  return db.event.findMany({
    where: { organizerId },
    include: {
      venue: { select: { name: true } },
      ticketTiers: {
        select: { soldCount: true, totalQuantity: true },
      },
    },
    orderBy: { startDate: "desc" },
  });
}

export async function getEventById(eventId: string) {
  return db.event.findUnique({
    where: { id: eventId },
    include: {
      venue: { select: { id: true, name: true } },
      ticketTiers: true,
      badges: true,
      organizer: { select: { id: true, name: true, userId: true } },
    },
  });
}

export async function getOrganizerByUserId(userId: string) {
  return db.organizer.findUnique({
    where: { userId },
  });
}
