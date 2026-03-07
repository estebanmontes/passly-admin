import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getOrganizerByUserId } from "@/lib/queries/events";
import { getOrderById } from "@/lib/queries/orders";
import { OrderDetailView } from "@/components/sections/orders/order-detail-view";
import { EmptyState } from "@/components/shared/empty-state";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const t = await getTranslations("orders");
  const session = await auth.api.getSession({ headers: await headers() });
  const organizer = session
    ? await getOrganizerByUserId(session.user.id)
    : null;

  const order = await getOrderById(orderId);

  if (!order || !organizer) {
    return <EmptyState icon="receipt_long" title={t("notFound")} />;
  }

  return <OrderDetailView order={order} />;
}
