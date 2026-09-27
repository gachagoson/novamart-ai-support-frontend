/**
 * A "business" is everything the ChatWidget and demo section need to present
 * a tenant. NovaMart is the first and only real one — everything else here is
 * shaped so a second tenant is a new object, not a new component tree.
 */

export const novamart = {
  id: "novamart",
  name: "NovaMart",
  assistantName: "NovaMart AI Support",
  logoInitial: "N",
  welcomeMessage:
    "Hi! I'm NovaMart's AI support assistant. I can help with orders, returns, shipping, warranties, and store policies.",
  theme: {
    primary: "#1d2b4f",
    accent: "#1f7a6c",
  },
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  conversationStarters: [
    "Where is my order ORD-27176?",
    "Can I return my headphones from ORD-27176?",
    "What is the warranty period for electronics?",
    "How long does standard delivery take?",
  ],
  isDemo: true,
};

export const defaultBusiness = novamart;
