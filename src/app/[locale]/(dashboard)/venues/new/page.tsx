import { getTranslations } from "next-intl/server";
import { CreateVenueForm } from "@/components/sections/venues/create-venue-form";

export default async function NewVenuePage() {
  const t = await getTranslations("venues");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t("createVenue")}</h1>
      <CreateVenueForm />
    </div>
  );
}
