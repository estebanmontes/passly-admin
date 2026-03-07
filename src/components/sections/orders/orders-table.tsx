"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/shared/icon";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import type { PaginatedResult } from "@/lib/types/pagination";

interface OrderItem {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  paymentMethod: string | null;
  createdAt: Date;
  user: { name: string | null; email: string; image: string | null };
  event: { title: string };
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

export function OrdersTable({
  result,
}: {
  result: PaginatedResult<OrderItem>;
}) {
  const t = useTranslations("orders");

  if (result.data.length === 0) {
    return (
      <EmptyState
        icon="receipt_long"
        title={t("noOrders")}
        description={t("noOrdersDescription")}
      />
    );
  }

  function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  }

  return (
    <div className="organic-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("orderNumber")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("customer")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("event")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("total")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("status")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("date")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {result.data.map((order) => (
              <tr
                key={order.id}
                className="group border-b border-border last:border-0 transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-sm font-medium text-foreground hover:text-indigo-600"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.user.name ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.user.email}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground">{order.event.title}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-foreground">
                    {formatCurrency(order.total, order.currency)}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                      statusStyles[order.status] ?? statusStyles.PENDING
                    )}
                  >
                    {t(`statusLabels.${order.status}`)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground opacity-0 group-hover:opacity-100"
                  >
                    <Icon name="visibility" size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DataTablePagination
        page={result.page}
        totalPages={result.totalPages}
        total={result.total}
        pageSize={result.pageSize}
      />
    </div>
  );
}
