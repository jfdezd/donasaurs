"use client";

import { useEffect, useState } from "react";
import { fetchListings } from "@/lib/api";
import { ListingCard } from "@/components/ListingCard";
import type { ListingResponse } from "@donasaurs/domain";

export default function HomePage() {
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchListings()
      .then(setListings)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load listings"),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-500">
          Loading listings...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && listings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No listings yet.</p>
          <p className="text-gray-400 mt-2">
            Be the first to sell something!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
