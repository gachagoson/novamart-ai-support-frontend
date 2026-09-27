import "./landing.css";
import Button from "../ui/Button";
import { Badge } from "../ui/primitives";
import ChatWidget from "../chat/ChatWidget";

export default function Hero({ business, onTryDemo, onDeploy }) {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div>
          <Badge dot>Built on NovaMart's live agent system</Badge>
          <h1 style={{ marginTop: 16 }}>AI customer support that knows your business</h1>
          <p className="lead">
            Give your customers instant answers using your own business knowledge, policies and
            systems — 24/7, with human handoff when needed.
          </p>
          <div className="hero__actions">
            <Button variant="primary" onClick={onTryDemo}>
              Try the demo
            </Button>
            <Button variant="secondary" onClick={onDeploy}>
              Deploy for my business
            </Button>
          </div>
        </div>
        <div className="hero__widget-frame">
          <ChatWidget business={business} embedded defaultOpen />
        </div>
      </div>
    </section>
  );
}
