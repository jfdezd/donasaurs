"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { fetchListing, reserveListing } from "@/lib/api";
import type { ListingResponse } from "@donasaurs/domain";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  RESERVED: "bg-yellow-100 text-yellow-800",
  IN_ESCROW: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
  DISPUTED: "bg-red-100 text-red-800",
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<ListingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reserving, setReserving] = useState(false);
  const [agreedPrice, setAgreedPrice] = useState("");

  const listingId = params.id as string;

  useEffect(() => {
    fetchListing(listingId)
      .then((data) => {
        setListing(data);
        setAgreedPrice(String(data.price_min));
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load listing"),
      )
      .finally(() => setLoading(false));
  }, [listingId]);

  const handleReserve = async () => {
    if (!listing) return;
    setReserving(true);
    setError(null);

    try {
      const order = await reserveListing({
        listing_id: listing.id,
        agreed_price: parseFloat(agreedPrice),
      });
      router.push(`/orders?highlight=${order.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reserve listing");
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (error && !listing) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!listing) return null;

  const isOwner = user?.id === listing.seller_id;
  const canReserve = user && !isOwner && listing.status === "ACTIVE";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${statusColors[listing.status] ?? "bg-gray-100 text-gray-800"}`}
          >
            {listing.status}
          </span>
        </div>

        {listing.description && (
          <p className="text-gray-600 mb-6 whitespace-pre-wrap">
            {listing.description}
          </p>
        )}

        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Minimum Price</p>
              <p className="text-2xl font-bold text-primary-700">
                ${Number(listing.price_min).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Listed</p>
              <p className="font-medium">
                {new Date(listing.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">
            {error}
          </div>
        )}

        {isOwner && (
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            This is your listing.
          </div>
        )}

        {canReserve && (
          <div className="space-y-3">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Your Offer ($)
              </label>
              <input
                id="price"
                type="number"
                min={listing.price_min}
                step="0.01"
                value={agreedPrice}
                onChange={(e) => setAgreedPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleReserve}
              disabled={reserving}
              className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 text-lg"
            >
              {reserving ? "Reserving..." : "Reserve This Item"}
            </button>
          </div>
        )}

        {!user && listing.status === "ACTIVE" && (
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 text-center">
            <a href="/auth" className="text-primary-600 hover:underline font-medium">
              Sign in
            </a>{" "}
            to reserve this listing.
          </div>
        )}
      </div>
    </div>
  );
}
