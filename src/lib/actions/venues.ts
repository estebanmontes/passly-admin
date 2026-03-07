"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrganizerByUserId } from "@/lib/queries/events";

export interface VenueInput {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  capacity: number | null;
  latitude: number | null;
  longitude: number | null;
}

export async function createVenue(input: VenueInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const organizer = await getOrganizerByUserId(session.user.id);
  if (!organizer) return { error: "No organizer profile found" };

  const venue = await db.venue.create({
    data: {
      organizerId: organizer.id,
      name: input.name,
      address: input.address,
      city: input.city,
      state: input.state || null,
      country: input.country,
      capacity: input.capacity || null,
      latitude: input.latitude || null,
      longitude: input.longitude || null,
    },
  });

  return { success: true, venueId: venue.id };
}

export async function updateVenue(venueId: string, input: VenueInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const organizer = await getOrganizerByUserId(session.user.id);
  if (!organizer) return { error: "No organizer profile found" };

  const venue = await db.venue.findUnique({ where: { id: venueId } });
  if (!venue || venue.organizerId !== organizer.id) {
    return { error: "Venue not found" };
  }

  await db.venue.update({
    where: { id: venueId },
    data: {
      name: input.name,
      address: input.address,
      city: input.city,
      state: input.state || null,
      country: input.country,
      capacity: input.capacity || null,
      latitude: input.latitude || null,
      longitude: input.longitude || null,
    },
  });

  return { success: true };
}

export async function deleteVenue(venueId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const organizer = await getOrganizerByUserId(session.user.id);
  if (!organizer) return { error: "No organizer profile found" };

  const venue = await db.venue.findUnique({
    where: { id: venueId },
    include: { _count: { select: { events: true } } },
  });

  if (!venue || venue.organizerId !== organizer.id) {
    return { error: "Venue not found" };
  }

  if (venue._count.events > 0) {
    return { error: "Cannot delete venue with linked events" };
  }

  await db.venue.delete({ where: { id: venueId } });
  return { success: true };
}
