import "./layout.css";
import Button from "../ui/Button";

export function Navbar({ onTryDemo, onDeploy }) {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <span className="navbar__logo">Aidesk</span>
        <nav className="navbar__links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#demo">Live demo</a>
          <a href="#trust">Trust &amp; safety</a>
        </nav>
        <div className="navbar__actions">
          <Button variant="ghost" size="sm" onClick={onTryDemo}>
            Try the demo
          </Button>
          <Button variant="primary" size="sm" onClick={onDeploy}>
            Deploy for my business
          </Button>
        </div>
      </div>
    </header>
  );
}

export function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`section ${className}`.trim()}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionHeading({ title, subtitle }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>Aidesk — AI customer support for real businesses.</span>
        <span className="footer__muted">NovaMart is a demonstration tenant, not a live store.</span>
      </div>
    </footer>
  );
}
