"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" } as const;

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") return { error: "Forbidden: Admin only" } as const;

  return { session } as const;
}

export async function createUser(input: {
  name: string;
  email: string;
  role: string;
}) {
  const result = await requireAdmin();
  if ("error" in result) return { error: result.error };

  const existing = await db.user.findUnique({ where: { email: input.email } });
  if (existing) return { error: "A user with this email already exists" };

  const user = await db.user.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
    },
  });

  return { success: true, userId: user.id };
}

export async function updateUser(
  userId: string,
  input: {
    name?: string;
    email?: string;
    role?: string;
  }
) {
  const result = await requireAdmin();
  if ("error" in result) return { error: result.error };

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "User not found" };

  if (input.email && input.email !== user.email) {
    const existing = await db.user.findUnique({
      where: { email: input.email },
    });
    if (existing) return { error: "A user with this email already exists" };
  }

  await db.user.update({
    where: { id: userId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.role !== undefined && { role: input.role }),
    },
  });

  return { success: true };
}

export async function deleteUser(userId: string) {
  const result = await requireAdmin();
  if ("error" in result) return { error: result.error };

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "User not found" };

  if (user.id === result.session.user.id) {
    return { error: "You cannot delete your own account" };
  }

  await db.user.delete({ where: { id: userId } });

  return { success: true };
}
