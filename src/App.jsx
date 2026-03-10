import { useState } from "react";
import TotalReturn from "./TotalReturn.jsx";
import DCFMemo from "./DCFMemo.jsx";

export default function App() {
  const [view, setView] = useState("landing");

  if (view === "landing") return <Landing onSelect={setView} />;

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#FAFAF8", minHeight: "100vh" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "#FAFAF8EE", backdropFilter: "blur(8px)",
        borderBottom: "1px solid #E5E5E0",
        padding: "12px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={() => setView("landing")} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#888", fontSize: 13, fontFamily: "'Inter', sans-serif",
          letterSpacing: 0.5, padding: 0,
        }}>
          &#8592; Back
        </button>
        <div style={{ display: "flex", gap: 0, borderBottom: "none" }}>
          {[
            { id: "memo", label: "Valuation Memo" },
            { id: "dashboard", label: "Scenario Analysis" },
          ].map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{
              background: "none",
              color: view === t.id ? "#111" : "#999",
              border: "none",
              borderBottom: view === t.id ? "2px solid #111" : "2px solid transparent",
              padding: "8px 20px",
              fontSize: 13, fontFamily: "'Inter', sans-serif",
              fontWeight: view === t.id ? 600 : 400,
              cursor: "pointer", letterSpacing: 0.3,
            }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ width: 40 }} />
      </div>
      {view === "memo" && <DCFMemo />}
      {view === "dashboard" && <TotalReturn />}
    </div>
  );
}

function Landing({ onSelect }) {
  const [h, setH] = useState(null);
  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif", background: "#FAFAF8",
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 32,
    }}>
      <div style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: 4, color: "#999", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 24 }}>
          Valuation Memorandum
        </p>
        <h1 style={{ fontSize: 44, fontWeight: 400, color: "#111", margin: "0 0 8px 0", lineHeight: 1.15, letterSpacing: -0.5 }}>
          Newmont Corporation
        </h1>
        <p style={{ fontSize: 16, color: "#888", margin: "0 0 4px 0", fontStyle: "italic" }}>
          NYSE: NEM
        </p>
        <div style={{ width: 40, height: 1, background: "#CCC", margin: "24px auto" }} />
        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, margin: "0 0 8px 0" }}>
          Discounted Cash Flow Analysis & Gold Price Scenario Modeling
        </p>
        <p style={{ fontSize: 13, color: "#AAA", fontFamily: "'Inter', sans-serif", margin: "0 0 48px 0" }}>
          March 10, 2026 &nbsp;|&nbsp; Current Price: $116.29 &nbsp;|&nbsp; Fair Value: ~$137
        </p>

        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            {
              id: "memo", title: "Valuation Memo",
              desc: "Full DCF analysis with revenue projections, margin estimates, free cash flow model, WACC, terminal value, sensitivity table, and investment verdict.",
            },
            {
              id: "dashboard", title: "Scenario Analysis",
              desc: "Interactive 5-year total return model across six gold price scenarios, from $4,000 to $10,000 per ounce. Dividends, buybacks, and return decomposition.",
            },
          ].map(card => (
            <div key={card.id}
              onMouseEnter={() => setH(card.id)}
              onMouseLeave={() => setH(null)}
              onClick={() => onSelect(card.id)}
              style={{
                flex: "1 1 300px", maxWidth: 340,
                background: "#FFF",
                border: `1px solid ${h === card.id ? "#111" : "#E5E5E0"}`,
                padding: "32px 28px", cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 400, color: "#111", margin: "0 0 12px 0" }}>{card.title}</h2>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.65, margin: "0 0 20px 0", fontFamily: "'Inter', sans-serif" }}>{card.desc}</p>
              <span style={{ fontSize: 12, color: h === card.id ? "#111" : "#AAA", fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: 0.5, transition: "color 0.2s" }}>
                Open &#8594;
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: "14px 24px", background: "#F5F5F0", display: "inline-block" }}>
          <span style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: "#555", fontWeight: 500 }}>
            Verdict: Moderately Undervalued
          </span>
          <span style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: "#999", marginLeft: 12 }}>
            ~18% implied upside
          </span>
        </div>

        <p style={{ fontSize: 11, color: "#CCC", marginTop: 48, fontFamily: "'Inter', sans-serif" }}>
          For informational and educational purposes only. Not investment advice.
        </p>
      </div>
    </div>
  );
}
