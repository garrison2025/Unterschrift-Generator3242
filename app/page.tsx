import { SignatureGenerator } from "@/components/signature-generator"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { WhyChooseUs } from "@/components/why-choose-us"
import { FAQ } from "@/components/faq"
import { UseCases } from "@/components/use-cases"
import { SignatureExamples } from "@/components/signature-examples"
import { SEOOptimizedContent } from "@/components/seo-optimized-content"
import { AdvancedFeatures } from "@/components/advanced-features"
import { FAQStructuredData } from "@/components/structured-data"

export default function HomePage() {
  return (
    <>
      <FAQStructuredData />
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <SignatureGenerator />
        <HowItWorks />
        <SignatureExamples />
        <WhyChooseUs />
        <UseCases />
        <AdvancedFeatures />
        <FAQ />
        <SEOOptimizedContent />
      </main>
    </>
  )
}
