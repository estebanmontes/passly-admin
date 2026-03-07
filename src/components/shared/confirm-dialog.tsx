"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-50 m-auto w-full max-w-md rounded-2xl border border-border bg-white p-0 shadow-xl backdrop:bg-black/40"
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-slate-100"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60",
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-charcoal hover:bg-charcoal/90"
            )}
          >
            {loading ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
