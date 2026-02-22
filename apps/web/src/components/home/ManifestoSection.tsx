"use client";

import { useLocale } from "@/lib/i18n/locale-context";

export function ManifestoSection() {
  const { t } = useLocale();

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-emerald-600 to-emerald-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-100 leading-relaxed">
          {t.manifesto.line1}
        </p>
        <p className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-relaxed">
          {t.manifesto.line2}
        </p>
      </div>
    </section>
  );
}
