import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getOrganizerByUserId } from "@/lib/queries/events";
import { SettingsView } from "@/components/sections/settings/settings-view";

export default async function SettingsPage() {
  const t = await getTranslations("settings");
  const session = await auth.api.getSession({ headers: await headers() });
  const organizer = session
    ? await getOrganizerByUserId(session.user.id)
    : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <SettingsView
        organizer={
          organizer
            ? {
                name: organizer.name,
                slug: organizer.slug,
                description: organizer.description ?? "",
                logoUrl: organizer.logoUrl ?? "",
                website: organizer.website ?? "",
              }
            : null
        }
        user={
          session
            ? {
                name: session.user.name ?? "",
                email: session.user.email,
                role: (session.user as { role?: string }).role ?? "CUSTOMER",
                createdAt: session.user.createdAt?.toString() ?? "",
              }
            : null
        }
      />
    </div>
  );
}
