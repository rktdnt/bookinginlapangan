"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  bookingId: string;
  status: string;
};

export default function AdminBookingActions({ bookingId, status }: Props) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const runAction = async (action: "confirm" | "cancel") => {
    setLoadingAction(action);

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal memperbarui booking");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Gagal memperbarui booking");
    } finally {
      setLoadingAction(null);
    }
  };

  const normalizedStatus = String(status || "").toLowerCase();
  const canConfirm = normalizedStatus === "pending";
  const canCancel = normalizedStatus !== "cancelled";

  return (
    <div className="flex flex-wrap gap-2">
      {canConfirm && (
        <button
          type="button"
          onClick={() => runAction("confirm")}
          disabled={loadingAction !== null}
          className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loadingAction === "confirm" ? "Memproses..." : "Konfirmasi"}
        </button>
      )}
      {canCancel && (
        <button
          type="button"
          onClick={() => runAction("cancel")}
          disabled={loadingAction !== null}
          className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loadingAction === "cancel" ? "Memproses..." : "Cancel"}
        </button>
      )}
    </div>
  );
}