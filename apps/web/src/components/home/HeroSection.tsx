"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";

export function HeroSection() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            {t.hero.claim}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
            {t.hero.subclaim}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/listings/new"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-emerald-600 rounded-full shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transition-all duration-200"
            >
              {t.hero.ctaPrimary}
            </Link>
            <Link
              href="/listings"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-emerald-700 bg-white border-2 border-emerald-200 rounded-full hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="/home.png"
            alt="Donasaurios - De ayudar, a evolucionar"
            width={560}
            height={400}
            className="rounded-2xl drop-shadow-xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
