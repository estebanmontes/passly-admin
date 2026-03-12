"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createUser, updateUser } from "@/lib/actions/users";

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

export function UserFormDialog({
  open,
  onClose,
  mode,
  user,
}: UserFormDialogProps) {
  const t = useTranslations("users");
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState(user?.role ?? "CUSTOMER");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setRole(user.role);
    } else {
      setName("");
      setEmail("");
      setRole("CUSTOMER");
    }
    setError(null);
  }, [user, open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    let res;
    if (mode === "create") {
      res = await createUser({ name, email, role });
    } else if (user) {
      res = await updateUser(user.id, { name, email, role });
    }

    setSaving(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-50 m-auto w-full max-w-md rounded-2xl border border-border bg-white p-0 shadow-xl backdrop:bg-black/40"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <h3 className="text-lg font-semibold text-foreground">
          {mode === "create" ? t("createUser") : t("editUser")}
        </h3>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">
              {t("form.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder={t("form.namePlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              {t("form.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder={t("form.emailPlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              {t("form.role")}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="CUSTOMER">{t("roleLabels.CUSTOMER")}</option>
              <option value="ORGANIZER">{t("roleLabels.ORGANIZER")}</option>
              <option value="ADMIN">{t("roleLabels.ADMIN")}</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-slate-100"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-charcoal px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-charcoal/90 disabled:opacity-60"
          >
            {saving
              ? t("form.saving")
              : mode === "create"
                ? t("form.create")
                : t("form.save")}
          </button>
        </div>
      </form>
    </dialog>
  );
}
