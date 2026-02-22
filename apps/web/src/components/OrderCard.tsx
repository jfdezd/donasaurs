"use client";

import type { OrderResponse } from "@donasaurs/domain";
import { useAuth } from "@/lib/auth-context";
import { confirmEscrow, shipOrder, completeOrder } from "@/lib/api";
import { useState } from "react";

const statusColors: Record<string, string> = {
  CREATED: "bg-gray-100 text-gray-800",
  AWAITING_ESCROW: "bg-yellow-100 text-yellow-800",
  ESCROW_CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-indigo-100 text-indigo-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  DISPUTED: "bg-red-100 text-red-800",
  FAILED: "bg-red-100 text-red-800",
};

interface OrderCardProps {
  order: OrderResponse;
  onUpdated: () => void;
}

export function OrderCard({ order, onUpdated }: OrderCardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [escrowRef, setEscrowRef] = useState("");

  const isBuyer = user?.id === order.buyer_id;
  const isSeller = user?.id === order.seller_id;

  const handleAction = async (action: () => Promise<unknown>) => {
    setLoading(true);
    setError(null);
    try {
      await action();
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-500">Order</p>
          <p className="font-mono text-xs text-gray-400">
            {order.id.slice(0, 8)}...
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[order.status] ?? "bg-gray-100 text-gray-800"}`}
        >
          {order.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-500">Price</p>
          <p className="font-semibold">${Number(order.agreed_price).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">Role</p>
          <p className="font-semibold">{isBuyer ? "Buyer" : "Seller"}</p>
        </div>
        <div>
          <p className="text-gray-500">Created</p>
          <p>{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        {order.escrow_reference && (
          <div>
            <p className="text-gray-500">Escrow Ref</p>
            <p className="font-mono text-xs">{order.escrow_reference}</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-3">{error}</p>
      )}

      {/* Buyer actions */}
      {isBuyer && order.status === "AWAITING_ESCROW" && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escrow reference..."
            value={escrowRef}
            onChange={(e) => setEscrowRef(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            disabled={loading || !escrowRef}
            onClick={() =>
              handleAction(() =>
                confirmEscrow(order.id, { escrow_reference: escrowRef }),
              )
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "..." : "Confirm Escrow"}
          </button>
        </div>
      )}

      {/* Seller actions */}
      {isSeller && order.status === "ESCROW_CONFIRMED" && (
        <button
          disabled={loading}
          onClick={() => handleAction(() => shipOrder(order.id))}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "..." : "Mark as Shipped"}
        </button>
      )}

      {/* Buyer confirms delivery */}
      {isBuyer && order.status === "SHIPPED" && (
        <button
          disabled={loading}
          onClick={() => handleAction(() => completeOrder(order.id))}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "..." : "Confirm Delivery & Complete"}
        </button>
      )}
    </div>
  );
}
