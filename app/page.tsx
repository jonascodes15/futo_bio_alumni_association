import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { StatsBar } from "@/components/site/stats-bar";
import { CensusForm } from "@/components/site/census-form";
import { Roadmap } from "@/components/site/roadmap";
import { Council } from "@/components/site/council";
import { FeedbackForm } from "@/components/site/feedback-form";
import { Footer } from "@/components/site/footer";
import { getPublicStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function Home() {
  // The page must still render if the database isn't reachable yet.
  const stats = await getPublicStats().catch(() => ({ total: 0, countries: 0, topIndustries: [] }));

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar initial={stats} />

        <section id="census" className="scroll-mt-8 py-24">
          <div className="mx-auto max-w-3xl px-5">
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-600">Pillar 1</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-forest-900 sm:text-4xl">Global Alumni Census</h2>
              <p className="mt-3 text-slate-600">
                Help us map where FUTO bioscientists are and what they do. It takes about two minutes.
              </p>
            </div>
            <CensusForm />
          </div>
        </section>

        <Roadmap />
        <Council />

        <section id="feedback" className="scroll-mt-8 bg-forest-50 py-24">
          <div className="mx-auto max-w-3xl px-5">
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-600">Have your say</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-forest-900 sm:text-4xl">Feedback &amp; Suggestions</h2>
              <p className="mt-3 text-slate-600">Share an idea, ask a question or subscribe to our newsletter.</p>
            </div>
            <FeedbackForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
