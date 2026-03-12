"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { cn } from "@/lib/utils";
import { deleteUser } from "@/lib/actions/users";
import { UserFormDialog } from "./user-form-dialog";
import type { PaginatedResult } from "@/lib/types/pagination";

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
  orderCount: number;
  passCount: number;
}

const roleStyles: Record<string, string> = {
  ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
  ORGANIZER: "bg-indigo-50 text-indigo-700 border-indigo-200",
  CUSTOMER: "bg-slate-100 text-slate-600 border-slate-200",
};

export function UsersTable({
  result,
}: {
  result: PaginatedResult<UserItem>;
}) {
  const t = useTranslations("users");
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const [editTarget, setEditTarget] = useState<UserItem | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deleteUser(deleteTarget.id);
    setDeleting(false);
    if (res.success) {
      setDeleteTarget(null);
      router.refresh();
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-charcoal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal/90"
        >
          <Icon name="person_add" size={18} />
          {t("createUser")}
        </button>
      </div>

      {result.data.length === 0 ? (
        <EmptyState
          icon="group"
          title={t("noUsers")}
          description={t("noUsersDescription")}
        />
      ) : (
        <div className="organic-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("user")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("email")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("role")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("orders")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("joined")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((user) => (
                  <tr
                    key={user.id}
                    className="group border-b border-border last:border-0 transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt=""
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                            <Icon
                              name="person"
                              size={16}
                              className="text-muted-foreground"
                            />
                          </div>
                        )}
                        <p className="text-sm font-medium text-foreground">
                          {user.name ?? "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                          roleStyles[user.role] ?? roleStyles.CUSTOMER
                        )}
                      >
                        {t(`roleLabels.${user.role}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">
                        {user.orderCount}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => setEditTarget(user)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground"
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
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
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t("deleteUser")}
        description={t("deleteConfirm")}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        variant="danger"
        loading={deleting}
      />

      <UserFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
      />

      {editTarget && (
        <UserFormDialog
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          mode="edit"
          user={editTarget}
        />
      )}
    </>
  );
}
