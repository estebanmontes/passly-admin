"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrganizerByUserId } from "@/lib/queries/events";

export async function checkInPass(passId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const organizer = await getOrganizerByUserId(session.user.id);
  if (!organizer) return { error: "No organizer profile found" };

  const pass = await db.pass.findUnique({
    where: { id: passId },
    include: { order: { include: { event: { select: { organizerId: true } } } } },
  });

  if (!pass || pass.order.event.organizerId !== organizer.id) {
    return { error: "Pass not found" };
  }

  if (pass.status !== "VALID") {
    return { error: "Only valid passes can be checked in" };
  }

  await db.pass.update({
    where: { id: passId },
    data: { status: "USED", scannedAt: new Date() },
  });

  return { success: true };
}

export async function cancelPass(passId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const organizer = await getOrganizerByUserId(session.user.id);
  if (!organizer) return { error: "No organizer profile found" };

  const pass = await db.pass.findUnique({
    where: { id: passId },
    include: { order: { include: { event: { select: { organizerId: true } } } } },
  });

  if (!pass || pass.order.event.organizerId !== organizer.id) {
    return { error: "Pass not found" };
  }

  if (pass.status !== "VALID") {
    return { error: "Only valid passes can be cancelled" };
  }

  await db.pass.update({
    where: { id: passId },
    data: { status: "CANCELLED" },
  });

  return { success: true };
}
