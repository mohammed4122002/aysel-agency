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
      <section className="agency-shell relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_32%,rgba(44,108,214,0.22),transparent_45%),radial-gradient(circle_at_26%_74%,rgba(14,50,96,0.22),transparent_48%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_900px_560px_at_65%_40%,rgba(40,80,166,0.2),transparent_65%)] blur-2xl" />
          <div className="absolute inset-0 bg-[linear-gradient(130deg,transparent_12%,rgba(255,255,255,0.08)_13%,transparent_14%,transparent_56%,rgba(255,255,255,0.05)_57%,transparent_58%)] opacity-25" />
        </div>

        <Navbar />

        <section className="relative z-10 mx-auto flex w-full max-w-[1220px] flex-col gap-12 px-4 pb-14 pt-[7.6rem] sm:px-8 sm:pt-[8.4rem] lg:flex-row lg:items-center lg:gap-10 lg:px-10 lg:pt-[10.4rem]">
          <div className="w-full lg:w-[56%]">
            <Hero />
          </div>

          <div className="w-full lg:w-[44%]">
            <ServiceCards />
          </div>
        </section>

        <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-center text-xs text-white/35">
          <p className="mb-2">اكتشف المزيد</p>
          <div className="mx-auto flex h-10 w-6 items-start justify-center rounded-full border border-white/25 p-1">
            <span className="mt-1 h-2.5 w-1.5 animate-[pulse_1.8s_ease-in-out_infinite] rounded-full bg-[#d4a843]" />
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

