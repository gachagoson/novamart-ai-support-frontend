import { useState } from "react";
import { Navbar, Footer } from "./components/layout/Layout";
import Hero from "./components/landing/Hero";
import { Features, HowItWorks, TrustSection, PricingCta } from "./components/landing/Sections";
import LiveDemo from "./components/landing/LiveDemo";
import ChatWidget from "./components/chat/ChatWidget";
import { Modal, Input, Toast } from "./components/ui/primitives";
import Button from "./components/ui/Button";
import { defaultBusiness } from "./config/businesses";

export default function App() {
  const [deployOpen, setDeployOpen] = useState(false);
  const [toast, setToast] = useState(null);

  function scrollToDemo() {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  }

  // No lead-capture backend exists yet — this just confirms receipt locally.
  // Wire this to a real endpoint (or an email/CRM connector) before launch.
  function handleDeploySubmit(e) {
    e.preventDefault();
    setDeployOpen(false);
    setToast("Thanks — we'll be in touch about setting up your assistant.");
    setTimeout(() => setToast(null), 4000);
  }

  return (
    <>
      <Navbar onTryDemo={scrollToDemo} onDeploy={() => setDeployOpen(true)} />
      <Hero business={defaultBusiness} onTryDemo={scrollToDemo} onDeploy={() => setDeployOpen(true)} />
      <Features />
      <HowItWorks />
      <LiveDemo business={defaultBusiness} />
      <TrustSection />
      <PricingCta onDeploy={() => setDeployOpen(true)} />
      <Footer />

      {/* Floating widget for the rest of the site, outside the hero preview */}
      <ChatWidget business={defaultBusiness} />

      <Modal open={deployOpen} title="Get an AI assistant for your business" onClose={() => setDeployOpen(false)}>
        <form onSubmit={handleDeploySubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input placeholder="Business name" required />
          <Input type="email" placeholder="Work email" required />
          <Button type="submit" variant="primary">
            Request a demo
          </Button>
        </form>
      </Modal>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
