import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import WhyNexForge from "@/components/sections/WhyNexForge";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Portfolio from "@/components/sections/Portfolio";
import TechStack from "@/components/sections/TechStack";
import FAQ from "@/components/sections/FAQ";
import ProjectBriefForm from "@/components/lead/ProjectBriefForm";
import ExitIntentPopup from "@/components/lead/ExitIntentPopup";
import WhatsAppFloat from "@/components/lead/WhatsAppFloat";

/* ═══════════════════════════════════════════════════
   JSON-LD STRUCTURED DATA
   ═══════════════════════════════════════════════════ */

/* ── JSON-LD: Website ─────────────────────────────── */
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NexForge Labz",
  url: "https://nexforgelabz.com",
  description: "MVP development agency building mobile, web, and AI apps for founders",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://nexforgelabz.com/?s={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

/* ── JSON-LD: Organization + LocalBusiness ────────────── */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": "https://nexforgelabz.com/#organization",
  name: "NexForge Labz",
  alternateName: "NexForge",
  url: "https://nexforgelabz.com",
  logo: "https://nexforgelabz.com/icon.svg",
  image: "https://nexforgelabz.com/opengraph-image",
  description: "NexForge Labz is an MVP development agency that builds production-grade mobile, web, and AI applications for startups and founders.",
  foundingDate: "2024",
  priceRange: "$$",
  email: "nexforge.labz@gmail.com",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "nexforge.labz@gmail.com",
      availableLanguage: "English",
    },
  ],
  sameAs: [
    "https://www.linkedin.com/company/nexforgelabz",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "App Development Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "MVP Development",
          description: "Full-stack MVP from idea to launch in 6 weeks. Mobile, web, or AI.",
        },
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "USD",
          minPrice: 2000,
          maxPrice: 20000,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web App Development",
          description: "Production-grade Next.js and React web applications.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI Feature Integration",
          description: "LLM integrations, AI chatbots, and intelligent automation for your product.",
        },
      },
    ],
  },
};

/* ── JSON-LD: FAQ ──────────────────────────────────── */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How much does an MVP cost?", acceptedAnswer: { "@type": "Answer", text: "Our MVP development starts at $2,000 for a focused web or mobile app. Most first projects land between $2k–$10k depending on scope. Funded startups with larger feature sets typically invest $10k–$20k. We give you a fixed quote after reviewing your project brief." } },
    { "@type": "Question", name: "Are there any hidden fees?", acceptedAnswer: { "@type": "Answer", text: "None. We quote a fixed price that includes development, deployment, and 2 weeks of post-launch support. The only extras would be third-party service costs which you pay directly to the providers, not us." } },
    { "@type": "Question", name: "How is 6 weeks actually possible?", acceptedAnswer: { "@type": "Answer", text: "Focused scope. We don't try to build everything at once — we build your core value proposition first. We take 2–3 projects max. Your project gets real hours, every day." } },
    { "@type": "Question", name: "Do I own the code?", acceptedAnswer: { "@type": "Answer", text: "100%, from day one. You get full source code, all assets, database access, and deployment credentials upon final payment." } },
    { "@type": "Question", name: "What happens when I submit a project brief?", acceptedAnswer: { "@type": "Answer", text: "You'll get a personalized response within 24 hours with: an honest feasibility assessment, a recommended tech stack, a rough timeline estimate, and a fixed price quote. No sales pitch — just honest advice." } },
    { "@type": "Question", name: "What are your payment terms?", acceptedAnswer: { "@type": "Answer", text: "50% upfront to begin, 50% upon launch. For larger projects ($10k+), we can do three milestones: 30% / 40% / 30%." } },
    { "@type": "Question", name: "What if my project is more complex?", acceptedAnswer: { "@type": "Answer", text: "Complex projects (mobile + web + backend + admin panel) typically take 10–16 weeks. We scope this clearly upfront. No surprises mid-build." } },
    { "@type": "Question", name: "Do I need technical knowledge to work with you?", acceptedAnswer: { "@type": "Answer", text: "Zero. We translate everything into plain language. Weekly updates are designed for non-technical founders." } },
    { "@type": "Question", name: "What if I need changes after launch?", acceptedAnswer: { "@type": "Answer", text: "Minor bug fixes are covered in the 2-week post-launch window. For new features, we offer retainer packages starting at $1,500/month." } },
    { "@type": "Question", name: "What do I need to prepare before submitting a brief?", acceptedAnswer: { "@type": "Answer", text: "Just your vision. A rough idea of what you want to build, who it's for, and your rough budget range. No wireframes or specs needed." } },
  ],
};

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />
      <main id="main-content">
        <Hero />
        <TrustBar />
        <WhyNexForge />
        <Services />
        <Process />
        <Portfolio />
        <TechStack />
        <FAQ />
        <ProjectBriefForm />
      </main>
      <Footer />
      <ExitIntentPopup />
      <WhatsAppFloat />
    </>
  );
}
