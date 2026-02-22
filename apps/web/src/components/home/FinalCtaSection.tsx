"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";

export function FinalCtaSection() {
  const { t } = useLocale();

  return (
    <section className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
          {t.finalCta.headline}
        </h2>
        <div className="mt-10">
          <Link
            href="/listings/new"
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-emerald-600 rounded-full shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transition-all duration-200"
          >
            {t.finalCta.button}
          </Link>
        </div>
      </div>
    </section>
  );
}
