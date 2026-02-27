"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";
import { LanguageToggle } from "./LanguageToggle";

export function Navbar() {
  const { user, signOut, loading } = useAuth();
  const { t } = useLocale();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Donasaurio"
                width={40}
                height={40}
                className="rounded-full"
                priority
              />
              <span className="text-xl font-extrabold text-emerald-700 tracking-tight hidden sm:inline">
                {t.nav.brand}
              </span>
            </Link>
            <div className="hidden sm:flex gap-5">
              <Link
                href="/listings"
                className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                {t.nav.explore}
              </Link>
              {user && (
                <>
                  <Link
                    href="/listings/new"
                    className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
                  >
                    {t.nav.listItem}
                  </Link>
                  <Link
                    href="/orders"
                    className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
                  >
                    {t.nav.myOrders}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            {loading ? (
              <span className="text-sm text-gray-400">{t.nav.loading}</span>
            ) : user ? (
              <>
                <span className="text-sm text-gray-500 hidden sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                  {t.nav.signOut}
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 font-medium transition-colors"
              >
                {t.nav.signIn}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
