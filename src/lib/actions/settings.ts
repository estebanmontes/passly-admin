"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrganizerByUserId } from "@/lib/queries/events";

export interface UpdateOrganizerProfileInput {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  website: string;
}

export async function updateOrganizerProfile(input: UpdateOrganizerProfileInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const organizer = await getOrganizerByUserId(session.user.id);
  if (!organizer) return { error: "No organizer profile found" };

  // Check slug uniqueness (exclude current organizer)
  if (input.slug !== organizer.slug) {
    const existing = await db.organizer.findUnique({
      where: { slug: input.slug },
    });
    if (existing) return { error: "This slug is already taken" };
  }

  await db.organizer.update({
    where: { id: organizer.id },
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      logoUrl: input.logoUrl || null,
      website: input.website || null,
    },
  });

  return { success: true };
}
