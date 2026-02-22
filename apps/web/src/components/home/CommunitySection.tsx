"use client";

import { useLocale } from "@/lib/i18n/locale-context";

export function CommunitySection() {
  const { t } = useLocale();

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {t.community.title}
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-14 leading-relaxed">
          {t.community.subtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {t.community.traits.map((trait, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 text-left bg-emerald-50 rounded-xl p-5"
            >
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-emerald-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>
              <p className="text-gray-700 font-medium text-sm leading-relaxed">
                {trait}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
