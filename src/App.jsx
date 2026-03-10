import { useState } from "react";
import ScenarioAnalysis from "./ScenarioAnalysis.jsx";
import TotalReturn from "./TotalReturn.jsx";

export default function App() {
  const [tab, setTab] = useState("total");

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#0F172A", minHeight: "100vh" }}>
      {/* Nav */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "#0F172AEE", backdropFilter: "blur(8px)",
        borderBottom: "1px solid #1E293B",
        padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 13, color: "#64748B", marginRight: 8, fontWeight: 600 }}>NEM VALUATION</span>
        {[
          { id: "total", label: "5-Year Total Return" },
          { id: "scenario", label: "DCF Scenario Analysis" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: tab === t.id ? "#2563EB" : "#1E293B",
              color: tab === t.id ? "white" : "#94A3B8",
              border: `1px solid ${tab === t.id ? "#2563EB" : "#334155"}`,
              borderRadius: 20,
              padding: "6px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "scenario" && <ScenarioAnalysis />}
      {tab === "total" && <TotalReturn />}
    </div>
  );
}
