import {
  HeroBackground,
  FloatingIcons,
  HeroContent,
  HeroButtons,
  HeroFooter,
  HeroStats,
} from "./hero";

export default function HeroSection() {
  return (
    <div className="relative h-full xl:min-h-[900px] py-10 md:py-16 w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-background/95">
      <HeroBackground />
      <div className="hidden md:block">
        <FloatingIcons />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <HeroContent />
          <HeroButtons />
          <HeroFooter />
          <HeroStats />
        </div>
      </div>
    </div>
  );
}
