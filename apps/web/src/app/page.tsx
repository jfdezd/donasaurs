"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { WhyDifferentSection } from "@/components/home/WhyDifferentSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { ManifestoSection } from "@/components/home/ManifestoSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <WhyDifferentSection />
      <CommunitySection />
      <ManifestoSection />
      <FinalCtaSection />
    </>
  );
}
