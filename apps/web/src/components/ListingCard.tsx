"use client";

import Link from "next/link";
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

export function ListingCard({ listing }: { listing: ListingResponse }) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {listing.title}
          </h3>
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ml-2 ${statusColors[listing.status] ?? "bg-gray-100 text-gray-800"}`}
          >
            {listing.status}
          </span>
        </div>
        {listing.description && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {listing.description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-emerald-700">
            ${listing.price_min.toFixed(2)}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(listing.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
