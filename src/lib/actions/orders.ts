"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrganizerByUserId } from "@/lib/queries/events";

export async function refundOrder(orderId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const organizer = await getOrganizerByUserId(session.user.id);
  if (!organizer) return { error: "No organizer profile found" };

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { event: { select: { organizerId: true } } },
  });

  if (!order || order.event.organizerId !== organizer.id) {
    return { error: "Order not found" };
  }

  if (order.status !== "CONFIRMED") {
    return { error: "Only confirmed orders can be refunded" };
  }

  await db.order.update({
    where: { id: orderId },
    data: { status: "REFUNDED" },
  });

  // Cancel all passes for this order
  await db.pass.updateMany({
    where: { orderId },
    data: { status: "CANCELLED" },
  });

  return { success: true };
}

export async function cancelOrder(orderId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const organizer = await getOrganizerByUserId(session.user.id);
  if (!organizer) return { error: "No organizer profile found" };

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { event: { select: { organizerId: true } } },
  });

  if (!order || order.event.organizerId !== organizer.id) {
    return { error: "Order not found" };
  }

  if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
    return { error: "This order cannot be cancelled" };
  }

  await db.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });

  // Cancel all passes for this order
  await db.pass.updateMany({
    where: { orderId },
    data: { status: "CANCELLED" },
  });

  return { success: true };
}
