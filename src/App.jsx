import { useState } from "react";
import TotalReturn from "./TotalReturn.jsx";
import DCFMemo from "./DCFMemo.jsx";

export default function App() {
  const [view, setView] = useState("landing");

  if (view === "landing") {
    return <LandingPage onSelect={setView} />;
  }

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#0F172A", minHeight: "100vh" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "#0F172AEE", backdropFilter: "blur(8px)",
        borderBottom: "1px solid #1E293B",
        padding: "10px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 8,
      }}>
        <button onClick={() => setView("landing")} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#64748B", fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 6, padding: 0,
        }}>
          <span style={{ fontSize: 18 }}>&#8592;</span> Back
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "memo", label: "DCF Analysis" },
            { id: "dashboard", label: "Scenario Dashboard" },
          ].map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{
              background: view === t.id ? "#2563EB" : "#1E293B",
              color: view === t.id ? "white" : "#94A3B8",
              border: `1px solid ${view === t.id ? "#2563EB" : "#334155"}`,
              borderRadius: 20, padding: "6px 18px",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ width: 60 }} />
      </div>
      {view === "memo" && <DCFMemo />}
      {view === "dashboard" && <TotalReturn />}
    </div>
  );
}

function LandingPage({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, sans-serif", background: "#0F172A",
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "#1E293B", border: "1px solid #334155", borderRadius: 24,
        padding: "6px 20px", marginBottom: 24,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600, letterSpacing: 1 }}>NYSE: NEM</span>
        <span style={{ fontSize: 12, color: "#64748B" }}>|</span>
        <span style={{ fontSize: 12, color: "#E2E8F0", fontWeight: 700 }}>$116.29</span>
        <span style={{ fontSize: 11, color: "#64748B" }}>Mar 10, 2026</span>
      </div>
      <h1 style={{ fontSize: 42, fontWeight: 800, color: "#F1F5F9", margin: "0 0 8px 0", textAlign: "center", lineHeight: 1.2, letterSpacing: -1 }}>
        Newmont Corporation
      </h1>
      <p style={{ fontSize: 18, color: "#64748B", margin: "0 0 6px 0", textAlign: "center", fontWeight: 500 }}>
        Discounted Cash Flow Valuation & Investment Analysis
      </p>
      <p style={{ fontSize: 13, color: "#475569", margin: "0 0 48px 0", textAlign: "center" }}>
        World's largest gold producer | 134M oz reserves | Tier 1 portfolio across 5 continents
      </p>
      <div style={{ display: "flex", gap: 24, maxWidth: 840, width: "100%", flexWrap: "wrap", justifyContent: "center" }}>
        {[
          {
            id: "memo", emoji: "\uD83D\uDCC4", gradient: "linear-gradient(135deg, #1E3A5F, #2563EB)",
            color: "#2563EB", title: "Full DCF Analysis",
            desc: "Investment banking-style valuation memo. Revenue projections, operating margins, free cash flow waterfall, WACC derivation, terminal value, sensitivity analysis, and verdict.",
            tags: ["Revenue Build", "EBITDA Bridge", "FCF Model", "WACC", "Terminal Value", "Sensitivity", "Verdict"],
            cta: "Read the analysis", time: "~15 min read",
          },
          {
            id: "dashboard", emoji: "\uD83D\uDCCA", gradient: "linear-gradient(135deg, #064E3B, #10B981)",
            color: "#10B981", title: "Scenario Dashboard",
            desc: "Interactive 5-year total return analysis. See exactly what $10,000 invested today becomes under six gold price scenarios, from $4,000 to $10,000 per ounce.",
            tags: ["6 Scenarios", "Year-by-Year", "Dividends", "Buybacks", "Return Decomp", "$10k Model"],
            cta: "Explore scenarios", time: "Interactive",
          },
        ].map(card => (
          <div key={card.id}
            onMouseEnter={() => setHovered(card.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(card.id)}
            style={{
              flex: "1 1 360px", maxWidth: 400,
              background: hovered === card.id ? "#1E293B" : "#1E293B99",
              border: `2px solid ${hovered === card.id ? card.color : "#334155"}`,
              borderRadius: 16, padding: 32, cursor: "pointer",
              transition: "all 0.25s ease",
              transform: hovered === card.id ? "translateY(-4px)" : "translateY(0)",
              boxShadow: hovered === card.id ? `0 12px 40px ${card.color}25` : "none",
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: card.gradient,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20, fontSize: 26,
            }}>{card.emoji}</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#F1F5F9", margin: "0 0 8px 0" }}>{card.title}</h2>
            <p style={{ fontSize: 14, color: "#94A3B8", margin: "0 0 20px 0", lineHeight: 1.6 }}>{card.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {card.tags.map(tag => (
                <span key={tag} style={{ background: "#0F172A", borderRadius: 12, padding: "3px 10px", fontSize: 11, color: "#64748B", fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: "10px 0", borderTop: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: card.color, fontWeight: 600 }}>{card.cta} &#8594;</span>
              <span style={{ fontSize: 11, color: "#475569" }}>{card.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 40, background: "#10B98115", border: "1px solid #10B98130", borderRadius: 12, padding: "16px 28px", textAlign: "center", maxWidth: 600 }}>
        <span style={{ fontSize: 13, color: "#10B981", fontWeight: 700 }}>VERDICT: MODERATELY UNDERVALUED</span>
        <span style={{ fontSize: 13, color: "#64748B", marginLeft: 12 }}>DCF Fair Value ~$137 vs Current $116 | ~18% upside</span>
      </div>
      <p style={{ fontSize: 11, color: "#334155", marginTop: 40, textAlign: "center", maxWidth: 500 }}>
        For informational and educational purposes only. Not investment advice. All projections involve inherent uncertainty.
      </p>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
