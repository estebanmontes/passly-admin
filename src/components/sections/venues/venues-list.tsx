"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/shared/icon";
import { SearchInput } from "@/components/shared/search-input";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteVenue } from "@/lib/actions/venues";
import type { PaginatedResult } from "@/lib/types/pagination";

interface VenueItem {
  id: string;
  name: string;
  city: string;
  state: string | null;
  country: string;
  capacity: number | null;
  _count: { events: number };
}

interface VenuesListProps {
  result: PaginatedResult<VenueItem>;
}

export function VenuesList({ result }: VenuesListProps) {
  const t = useTranslations("venues");
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<VenueItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    const res = await deleteVenue(deleteTarget.id);
    setDeleting(false);
    if (res.error) {
      setError(res.error);
    } else {
      setDeleteTarget(null);
      router.refresh();
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-80">
          <SearchInput placeholder={t("search")} />
        </div>
        <div className="hidden flex-1 sm:block" />
        <Link
          href="/venues/new"
          className="flex items-center gap-2 rounded-2xl bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal/90"
        >
          <Icon name="add" size={20} />
          {t("createVenue")}
        </Link>
      </div>

      {result.data.length === 0 ? (
        <EmptyState
          icon="location_on"
          title={t("noVenues")}
          description={t("noVenuesDescription")}
        />
      ) : (
        <div className="organic-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("name")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("location")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("capacity")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("events")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((venue) => (
                  <tr
                    key={venue.id}
                    className="group border-b border-border last:border-0 transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/venues/${venue.id}`}
                        className="text-sm font-medium text-foreground hover:text-indigo-600"
                      >
                        {venue.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">
                        {[venue.city, venue.state, venue.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">
                        {venue.capacity?.toLocaleString() ?? "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">
                        {venue._count.events}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Link
                          href={`/venues/${venue.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground"
                        >
                          <Icon name="edit" size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(venue)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Icon name="delete" size={16} />
                        </button>
                      </div>
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
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => {
          setDeleteTarget(null);
          setError("");
        }}
        onConfirm={handleDelete}
        title={t("deleteVenue")}
        description={error || t("deleteConfirm")}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
