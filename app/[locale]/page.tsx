import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Comparison from "@/components/Comparison";
import AIDemo from "@/components/AIDemo";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

type HomePageProps = {
  searchParams?: Promise<{
    alternative?: string;
    alternativeId?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const comparisonAlternative =
    resolvedSearchParams.alternative ?? resolvedSearchParams.alternativeId;

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />
      <Hero />
      <Ticker />
      <HowItWorks />
      <Pricing />
      <Comparison alternativeId={comparisonAlternative} />
      <AIDemo />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
