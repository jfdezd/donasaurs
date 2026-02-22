"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchMyOrders } from "@/lib/api";
import { OrderCard } from "@/components/OrderCard";
import type { OrderResponse } from "@donasaurs/domain";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMyOrders();
      setOrders(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, loadOrders]);

  if (authLoading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Please sign in to view your orders.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {loading && (
        <div className="text-center py-12 text-gray-500">
          Loading orders...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders yet.</p>
          <p className="text-gray-400 mt-2">
            Browse listings to make your first purchase!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onUpdated={loadOrders} />
        ))}
      </div>
    </div>
  );
}
