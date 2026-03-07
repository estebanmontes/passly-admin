"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/shared/icon";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { checkInPass, cancelPass } from "@/lib/actions/attendees";
import { cn } from "@/lib/utils";
import type { PaginatedResult } from "@/lib/types/pagination";

interface PassItem {
  id: string;
  qrCode: string;
  status: string;
  scannedAt: Date | null;
  user: { name: string | null; email: string; image: string | null };
  order: {
    event: { id: string; title: string };
    items: { ticketTier: { id: string; name: string } }[];
  };
}

const statusStyles: Record<string, string> = {
  VALID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  USED: "bg-blue-50 text-blue-700 border-blue-200",
  EXPIRED: "bg-slate-100 text-slate-600 border-slate-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  TRANSFERRED: "bg-purple-50 text-purple-700 border-purple-200",
};

export function AttendeesTable({
  result,
}: {
  result: PaginatedResult<PassItem>;
}) {
  const t = useTranslations("attendees");
  const router = useRouter();
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleCheckIn(passId: string) {
    setLoading(true);
    const res = await checkInPass(passId);
    setLoading(false);
    if (res.error) {
      setMessage(res.error);
    } else {
      setMessage(t("checkedIn"));
      router.refresh();
    }
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleCancel() {
    if (!cancelTarget) return;
    setLoading(true);
    const res = await cancelPass(cancelTarget);
    setLoading(false);
    if (res.error) {
      setMessage(res.error);
    } else {
      setMessage(t("passCancelled"));
      router.refresh();
    }
    setCancelTarget(null);
    setTimeout(() => setMessage(""), 3000);
  }

  if (result.data.length === 0) {
    return (
      <EmptyState
        icon="groups"
        title={t("noAttendees")}
        description={t("noAttendeesDescription")}
      />
    );
  }

  return (
    <>
      {message && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <div className="organic-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("attendee")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("event")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("ticketTier")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("passCode")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("scannedAt")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((pass) => (
                <tr
                  key={pass.id}
                  className="group border-b border-border last:border-0 transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                        {pass.user.image ? (
                          <img
                            src={pass.user.image}
                            alt=""
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <Icon
                            name="person"
                            size={16}
                            className="text-muted-foreground"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {pass.user.name ?? "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pass.user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">
                      {pass.order.event.title}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">
                      {pass.order.items[0]?.ticketTier.name ?? "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-foreground">
                      {pass.qrCode.slice(0, 12)}...
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                        statusStyles[pass.status] ?? statusStyles.VALID
                      )}
                    >
                      {t(`statusLabels.${pass.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      {pass.scannedAt
                        ? new Date(pass.scannedAt).toLocaleString()
                        : "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {pass.status === "VALID" && (
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => handleCheckIn(pass.id)}
                          disabled={loading}
                          className="flex h-8 items-center gap-1 rounded-lg bg-emerald-50 px-2 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                        >
                          <Icon name="check_circle" size={14} />
                          {t("checkIn")}
                        </button>
                        <button
                          onClick={() => setCancelTarget(pass.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Icon name="cancel" size={16} />
                        </button>
                      </div>
                    )}
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

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title={t("cancelPass")}
        description={t("cancelPassConfirm")}
        confirmLabel={t("confirm")}
        cancelLabel={t("cancel")}
        variant="danger"
        loading={loading}
      />
    </>
  );
}
