"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrganizerByUserId } from "@/lib/queries/events";

export interface TicketTierInput {
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
  maxPerOrder: number;
}

export interface CreateEventInput {
  title: string;
  slug: string;
  category: string;
  description: string;
  coverUrl: string;
  startDate: string;
  endDate: string;
  doorsOpen: string;
  venueId: string;
  currency: string;
  ticketTiers: TicketTierInput[];
  status: "DRAFT" | "ON_SALE";
}

export async function createEvent(input: CreateEventInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const organizer = await getOrganizerByUserId(session.user.id);
  if (!organizer) return { error: "No organizer profile found" };

  // Check slug uniqueness
  const existing = await db.event.findUnique({ where: { slug: input.slug } });
  if (existing) return { error: "An event with this slug already exists" };

  const event = await db.event.create({
    data: {
      organizerId: organizer.id,
      title: input.title,
      slug: input.slug,
      category: input.category as "MUSIC" | "CONFERENCE" | "SPORTS" | "THEATER" | "FESTIVAL" | "COMEDY" | "WORKSHOP" | "NETWORKING" | "OTHER",
      description: input.description || null,
      coverUrl: input.coverUrl || null,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      doorsOpen: input.doorsOpen ? new Date(input.doorsOpen) : null,
      venueId: input.venueId || null,
      currency: (input.currency as "USD" | "EUR" | "GBP" | "MXN" | "COP") || "USD",
      status: input.status,
      availability: "AVAILABLE",
      ticketTiers: {
        create: input.ticketTiers.map((tier) => ({
          name: tier.name,
          description: tier.description || null,
          price: tier.price,
          totalQuantity: tier.totalQuantity,
          maxPerOrder: tier.maxPerOrder || 10,
          currency: (input.currency as "USD" | "EUR" | "GBP" | "MXN" | "COP") || "USD",
        })),
      },
    },
  });

  return { success: true, eventId: event.id };
}

export interface UpdateEventInput {
  eventId: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  coverUrl: string;
  startDate: string;
  endDate: string;
  doorsOpen: string;
  venueId: string;
  currency: string;
  status: string;
  ticketTiers: (TicketTierInput & { id?: string })[];
}

export async function updateEvent(input: UpdateEventInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const organizer = await getOrganizerByUserId(session.user.id);
  if (!organizer) return { error: "No organizer profile found" };

  // Verify ownership
  const event = await db.event.findUnique({ where: { id: input.eventId } });
  if (!event || event.organizerId !== organizer.id) {
    return { error: "Event not found" };
  }

  // Check slug uniqueness (exclude current event)
  if (input.slug !== event.slug) {
    const existing = await db.event.findUnique({ where: { slug: input.slug } });
    if (existing) return { error: "An event with this slug already exists" };
  }

  type CategoryEnum = "MUSIC" | "CONFERENCE" | "SPORTS" | "THEATER" | "FESTIVAL" | "COMEDY" | "WORKSHOP" | "NETWORKING" | "OTHER";
  type CurrencyEnum = "USD" | "EUR" | "GBP" | "MXN" | "COP";
  type StatusEnum = "DRAFT" | "SCHEDULED" | "ON_SALE" | "SOLD_OUT" | "CANCELLED" | "COMPLETED";

  // Delete existing tiers and recreate
  await db.ticketTier.deleteMany({ where: { eventId: input.eventId } });

  const updated = await db.event.update({
    where: { id: input.eventId },
    data: {
      title: input.title,
      slug: input.slug,
      category: input.category as CategoryEnum,
      description: input.description || null,
      coverUrl: input.coverUrl || null,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      doorsOpen: input.doorsOpen ? new Date(input.doorsOpen) : null,
      venueId: input.venueId || null,
      currency: (input.currency as CurrencyEnum) || "USD",
      status: input.status as StatusEnum,
      ticketTiers: {
        create: input.ticketTiers.map((tier) => ({
          name: tier.name,
          description: tier.description || null,
          price: tier.price,
          totalQuantity: tier.totalQuantity,
          maxPerOrder: tier.maxPerOrder || 10,
          currency: (input.currency as CurrencyEnum) || "USD",
        })),
      },
    },
  });

  return { success: true, eventId: updated.id };
}

export async function deleteEvent(eventId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const organizer = await getOrganizerByUserId(session.user.id);
  if (!organizer) return { error: "No organizer profile found" };

  const event = await db.event.findUnique({ where: { id: eventId } });
  if (!event || event.organizerId !== organizer.id) {
    return { error: "Event not found" };
  }

  await db.event.delete({ where: { id: eventId } });
  return { success: true };
}
