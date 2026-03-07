import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getOrganizerByUserId } from "@/lib/queries/events";
import { getOrdersByOrganizer, getOrganizerEventOptions } from "@/lib/queries/orders";
import { parsePaginationParams } from "@/lib/utils/search-params";
import { OrdersTable } from "@/components/sections/orders/orders-table";
import { OrderFilters } from "@/components/sections/orders/order-filters";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations("orders");
  const session = await auth.api.getSession({ headers: await headers() });
  const organizer = session
    ? await getOrganizerByUserId(session.user.id)
    : null;

  const sp = await searchParams;
  const params = parsePaginationParams(sp);
  const filters = {
    status: typeof sp.status === "string" ? sp.status : undefined,
    eventId: typeof sp.eventId === "string" ? sp.eventId : undefined,
    dateFrom: typeof sp.dateFrom === "string" ? sp.dateFrom : undefined,
    dateTo: typeof sp.dateTo === "string" ? sp.dateTo : undefined,
  };

  const [result, eventOptions] = organizer
    ? await Promise.all([
        getOrdersByOrganizer(organizer.id, params, filters),
        getOrganizerEventOptions(organizer.id),
      ])
    : [
        { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 },
        [],
      ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <OrderFilters eventOptions={eventOptions} />
      <OrdersTable result={result} />
    </div>
  );
}
