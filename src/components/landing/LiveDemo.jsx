import "./landing.css";
import { Section, SectionHeading } from "../layout/Layout";
import ChatWidget from "../chat/ChatWidget";

export default function LiveDemo({ business }) {
  return (
    <Section id="demo" className="demo-section">
      <SectionHeading
        title="Try the AI assistant"
        subtitle={`This is talking to ${business.name}'s real support agent — the same one described below, not a scripted mockup.`}
      />
      <div className="demo-grid">
        <div className="demo-copy">
          <p>
            {business.name} is our demonstration business. Ask it about an order, a return, or
            whether something is in stock, and it will answer the way it would for a real
            customer — using {business.name}'s own policies and systems.
          </p>
          <ul>
            {business.conversationStarters.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="demo-widget-frame">
          <ChatWidget business={business} embedded defaultOpen />
        </div>
      </div>
    </Section>
  );
}
