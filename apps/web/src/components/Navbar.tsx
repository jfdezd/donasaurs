"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const { user, signOut, loading } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-primary-700">
              Donasaurs
            </Link>
            <div className="hidden sm:flex gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Listings
              </Link>
              {user && (
                <>
                  <Link
                    href="/listings/new"
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    Sell
                  </Link>
                  <Link
                    href="/orders"
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    My Orders
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {loading ? (
              <span className="text-sm text-gray-400">Loading...</span>
            ) : user ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
