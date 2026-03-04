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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NexForge Labz",
  url: "https://nexforgelabz.com",
  description: "Web, Mobile and AI development agency. We build apps for founders and early and scalable startups.",
  foundingDate: "2024",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "nexforge.labz@gmail.com",
  },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "8000",
    highPrice: "50000",
    priceCurrency: "USD",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "MVP Development",
  provider: { "@type": "Organization", name: "NexForge Labz" },
  description: "Full product development from idea to launch in 6-8 weeks.",
  offers: {
    "@type": "Offer",
    price: "2000",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How much does an MVP cost?", acceptedAnswer: { "@type": "Answer", text: "Our MVP development starts at $3,000 for a focused web or mobile app. Most first projects land between $3k–$5k depending on scope. Funded startups with larger feature sets typically invest $15k–$25k. We give you a fix quote during the free consultation." } },
    { "@type": "Question", name: "Are there any hidden fees?", acceptedAnswer: { "@type": "Answer", text: "None. We quote a fixed price that includes development, deployment, and 2 weeks of post-launch support. The only extras would be third-party service costs which you pay directly to the providers, not us." } },
    { "@type": "Question", name: "How is 6 weeks actually possible?", acceptedAnswer: { "@type": "Answer", text: "Focused scope. We don't try to build everything at once — we build your core value proposition first. We take 2–3 projects max. Your project gets real hours, every day." } },
    { "@type": "Question", name: "Do I own the code?", acceptedAnswer: { "@type": "Answer", text: "100%, from day one. You get full source code, all assets, database access, and deployment credentials upon final payment." } },
    { "@type": "Question", name: "What happens in the free consultation?", acceptedAnswer: { "@type": "Answer", text: "In 30 minutes, you'll get: an honest feasibility assessment, a recommended tech stack, a rough timeline estimate, and a rough budget range. We don't pitch you — we help you." } },
    { "@type": "Question", name: "What are your payment terms?", acceptedAnswer: { "@type": "Answer", text: "50% upfront to begin, 50% upon launch. For larger projects ($10k+), we can do three milestones: 30% / 40% / 30%." } },
    { "@type": "Question", name: "What if my project is more complex?", acceptedAnswer: { "@type": "Answer", text: "Complex projects (mobile + web + backend + admin panel) typically take 10–16 weeks. We scope this clearly upfront. No surprises mid-build." } },
    { "@type": "Question", name: "Do I need technical knowledge to work with you?", acceptedAnswer: { "@type": "Answer", text: "Zero. We translate everything into plain language. The weekly demo calls are designed for non-technical founders." } },
    { "@type": "Question", name: "What if I need changes after launch?", acceptedAnswer: { "@type": "Answer", text: "Minor bug fixes are covered in the 2-week post-launch window. For new features, we offer retainer packages starting at $1500/month." } },
    { "@type": "Question", name: "What do I need to prepare before the consultation?", acceptedAnswer: { "@type": "Answer", text: "Just your vision. A rough idea of what you want to build, who it's for, and your rough budget range. No wireframes or specs needed." } },
  ],
};

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
