import AgencyAdvantageSection from "@/components/AgencyAdvantageSection";
import BusinessNeedsSection from "@/components/BusinessNeedsSection";
import ClientStoriesFooterSection from "@/components/ClientStoriesFooterSection";
import Hero from "@/components/Hero";
import HowWeWorkSection from "@/components/HowWeWorkSection";
import Navbar from "@/components/Navbar";
import PillarsSection from "@/components/PillarsSection";
import PortfolioShowcaseSection from "@/components/PortfolioShowcaseSection";
import ServiceCards from "@/components/ServiceCards";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <main className="bg-[#eceef2]">
      <section className="relative overflow-hidden bg-[#050a16]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[url('/figma-assets/section5/bg.png')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.84)_0%,rgba(0,0,0,0.68)_46%,rgba(0,0,0,0.9)_100%)]" />
          <div className="absolute inset-0 bg-[url('/figma-assets/section5/texture.png')] bg-cover bg-center opacity-35 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_76%_30%,rgba(212,175,55,0.22),transparent_60%)]" />
        </div>

        <Navbar />

        <section className="relative z-10 mx-auto w-full px-4 pb-12 pt-[7.2rem] sm:px-8 sm:pb-14 sm:pt-[8rem] lg:px-10 lg:pb-80 lg:pt-[9.2rem]">
          <div className="mx-auto flex max-w-[1304px] flex-col-reverse gap-8 lg:[direction:ltr] lg:grid lg:grid-cols-[506px_734px] lg:items-start lg:justify-between lg:gap-16 mt-7">
        
            <div className="w-full lg:pt-10">
              <ServiceCards />
            </div>

            <div className="w-full [direction:rtl]">
              <Hero />
            </div>
          </div>
        </section>
    <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center text-xs text-white/40">
          <p className="mb-2">اكتشف المزيد</p>
          <div className="mx-auto flex h-9 w-5 items-start justify-center rounded-full border border-white/30 p-[6px]">
            <span className="mt-0.5 h-2.5 w-1 animate-[pulse_1.8s_ease-in-out_infinite] rounded-full bg-[#d4a843]" />
          </div>
        </div>
      </section>

      <PillarsSection />
      <BusinessNeedsSection />
      <AgencyAdvantageSection />
      <HowWeWorkSection />
      <PortfolioShowcaseSection />
      <ClientStoriesFooterSection />
      <SiteFooter brandSubtitle="AGENCY" />
    </main>
  );
}
