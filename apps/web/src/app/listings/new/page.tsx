"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createListing } from "@/lib/api";

export default function NewListingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (authLoading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Please sign in to create a listing.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const listing = await createListing({
        title,
        description: description || undefined,
        price_min: parseFloat(priceMin),
      });
      router.push(`/listings/${listing.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-8">Create New Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="What are you selling?"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            maxLength={2000}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe your item..."
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Price ($)
          </label>
          <input
            id="price"
            type="number"
            required
            min="0.01"
            step="0.01"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
