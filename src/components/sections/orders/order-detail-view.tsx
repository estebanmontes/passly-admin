"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/shared/icon";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { refundOrder, cancelOrder } from "@/lib/actions/orders";
import { cn } from "@/lib/utils";

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  fees: number;
  total: number;
  currency: string;
  paymentMethod: string | null;
  createdAt: Date;
  user: { name: string | null; email: string; image: string | null };
  event: { id: string; title: string };
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    ticketTier: { name: string };
  }[];
  passes: {
    id: string;
    qrCode: string;
    status: string;
    scannedAt: Date | null;
    user: { name: string | null; email: string };
  }[];
}

const orderStatusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

const passStatusStyles: Record<string, string> = {
  VALID: "bg-emerald-50 text-emerald-700",
  USED: "bg-blue-50 text-blue-700",
  EXPIRED: "bg-slate-100 text-slate-600",
  CANCELLED: "bg-red-50 text-red-700",
  TRANSFERRED: "bg-purple-50 text-purple-700",
};

export function OrderDetailView({ order }: { order: OrderData }) {
  const t = useTranslations("orders");
  const attendeeT = useTranslations("attendees.statusLabels");
  const router = useRouter();

  const [showRefund, setShowRefund] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: order.currency,
    }).format(amount);
  }

  async function handleRefund() {
    setLoading(true);
    const res = await refundOrder(order.id);
    setLoading(false);
    if (res.error) {
      setMessage(res.error);
    } else {
      setMessage(t("refunded"));
      setShowRefund(false);
      router.refresh();
    }
  }

  async function handleCancel() {
    setLoading(true);
    const res = await cancelOrder(order.id);
    setLoading(false);
    if (res.error) {
      setMessage(res.error);
    } else {
      setMessage(t("cancelled"));
      setShowCancel(false);
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/orders"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border transition-colors hover:bg-slate-50"
        >
          <Icon name="arrow_back" size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {order.orderNumber}
          </h1>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
            orderStatusStyles[order.status] ?? orderStatusStyles.PENDING
          )}
        >
          {t(`statusLabels.${order.status}`)}
        </span>
      </div>

      {message && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {/* Summary + Customer */}
      <div className="grid grid-cols-2 gap-6">
        <div className="organic-card p-6">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            {t("detail.orderSummary")}
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">{t("event")}</dt>
              <dd>
                <Link
                  href={`/events/${order.event.id}`}
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {order.event.title}
                </Link>
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">{t("paymentMethod")}</dt>
              <dd className="font-medium">
                {order.paymentMethod
                  ? t(`paymentLabels.${order.paymentMethod}`)
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">{t("detail.subtotal")}</dt>
              <dd className="font-medium">{formatCurrency(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">{t("detail.fees")}</dt>
              <dd className="font-medium">{formatCurrency(order.fees)}</dd>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-sm">
              <dt className="font-semibold">{t("detail.totalAmount")}</dt>
              <dd className="font-bold text-lg">{formatCurrency(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="organic-card p-6">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            {t("detail.customerInfo")}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              {order.user.image ? (
                <img
                  src={order.user.image}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <Icon name="person" size={24} className="text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {order.user.name ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">{order.user.email}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              {t("date")}:{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="organic-card overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">
            {t("detail.orderItems")}
          </h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-t border-border">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("detail.tier")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("detail.quantity")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("detail.unitPrice")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("detail.subtotal")}
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-border"
              >
                <td className="px-6 py-3 text-sm font-medium text-foreground">
                  {item.ticketTier.name}
                </td>
                <td className="px-6 py-3 text-sm text-foreground">
                  {item.quantity}
                </td>
                <td className="px-6 py-3 text-sm text-foreground">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="px-6 py-3 text-right text-sm font-medium text-foreground">
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Passes */}
      {order.passes.length > 0 && (
        <div className="organic-card overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-base font-semibold text-foreground">
              {t("detail.passes")}
            </h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-t border-border">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("detail.passCode")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("detail.passStatus")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("detail.scannedAt")}
                </th>
              </tr>
            </thead>
            <tbody>
              {order.passes.map((pass) => (
                <tr key={pass.id} className="border-t border-border">
                  <td className="px-6 py-3">
                    <code className="text-xs font-mono text-foreground">
                      {pass.qrCode}
                    </code>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        passStatusStyles[pass.status] ?? passStatusStyles.VALID
                      )}
                    >
                      {attendeeT(pass.status)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">
                    {pass.scannedAt
                      ? new Date(pass.scannedAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Actions */}
      {(order.status === "CONFIRMED" || order.status === "PENDING") && (
        <div className="flex gap-3">
          {order.status === "CONFIRMED" && (
            <button
              onClick={() => setShowRefund(true)}
              className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
            >
              {t("refund")}
            </button>
          )}
          <button
            onClick={() => setShowCancel(true)}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            {t("cancelOrder")}
          </button>
        </div>
      )}

      <ConfirmDialog
        open={showRefund}
        onClose={() => setShowRefund(false)}
        onConfirm={handleRefund}
        title={t("refund")}
        description={t("refundConfirm")}
        confirmLabel={t("refund")}
        variant="danger"
        loading={loading}
      />

      <ConfirmDialog
        open={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={handleCancel}
        title={t("cancelOrder")}
        description={t("cancelConfirm")}
        confirmLabel={t("cancelOrder")}
        variant="danger"
        loading={loading}
      />
    </div>
  );
}
