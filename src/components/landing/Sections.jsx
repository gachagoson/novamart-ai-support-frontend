import "./landing.css";
import { Card } from "../ui/primitives";
import Button from "../ui/Button";
import { Section, SectionHeading } from "../layout/Layout";

const FEATURES = [
  { icon: "📚", title: "Business knowledge", body: "Answers using your own documents, FAQs, policies and information." },
  { icon: "💬", title: "Customer support", body: "Handles repetitive questions about products, orders, delivery and returns." },
  { icon: "⚙️", title: "Business actions", body: "Interacts with your supported systems and APIs, not just generated text." },
  { icon: "🤝", title: "Human handoff", body: "When the AI can't confidently help, the conversation moves to your team." },
  { icon: "🧠", title: "Conversation memory", body: "Keeps track of relevant context for the length of a conversation." },
  { icon: "📊", title: "Analytics", body: "See conversations, common questions, resolutions and escalations over time." },
];

export function Features() {
  return (
    <Section id="features">
      <SectionHeading
        title="What it handles for you"
        subtitle="One assistant, grounded in your business, that gets more capable as you connect more of it."
      />
      <div className="feature-grid">
        {FEATURES.map((f) => (
          <Card key={f.title} className="feature-card">
            <div className="feature-card__icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

const STEPS = [
  { title: "Connect your business", body: "Provide business information, documents, policies and supported systems." },
  { title: "Deploy your AI assistant", body: "Add a small chat widget to your company's website." },
  { title: "Let AI handle repetitive support", body: "The assistant answers customers, performs supported actions and hands complex cases to your team." },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeading title="How it works" subtitle="Three steps from your business knowledge to a working assistant." />
      <div className="steps">
        {STEPS.map((s, i) => (
          <div className="step" key={s.title}>
            <div className="step__index">{String(i + 1).padStart(2, "0")}</div>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const TRUST_POINTS = [
  { title: "Grounded in what you give it", body: "The assistant answers using business-provided information — it isn't guessing about your policies." },
  { title: "Honest about its limits", body: "It's designed to avoid confidently answering questions it isn't equipped to handle." },
  { title: "A human is always reachable", body: "Complex or sensitive conversations can be handed to your team." },
  { title: "You stay in control", body: "Your information and workflows remain yours — the assistant works within what you configure." },
];

export function TrustSection() {
  return (
    <Section id="trust">
      <SectionHeading title="Trust and safety" subtitle="An assistant that knows what it doesn't know." />
      <div className="trust-grid">
        {TRUST_POINTS.map((t) => (
          <div className="trust-item" key={t.title}>
            <h3>{t.title}</h3>
            <p>{t.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function PricingCta({ onDeploy }) {
  return (
    <Section>
      <div className="cta-section" style={{ maxWidth: 720 }}>
        <h2>Get an AI assistant for your business</h2>
        <p>Start with a short conversation about your business, your policies and what you'd like handled.</p>
        <div className="cta-section__actions">
          <Button variant="primary" onClick={onDeploy}>
            Request a demo
          </Button>
        </div>
      </div>
    </Section>
  );
}
