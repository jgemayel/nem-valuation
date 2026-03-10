import { useState } from "react";

const WACC = 0.077;
const TERM_GROWTH = 0.025;
const SHARES = 1097; // millions
const NET_CASH = 0.8; // billions (net cash position)
const CURRENT_PRICE = 116.29;

// Base case from the DCF model
const BASE_GOLD = [3800, 5000, 5200, 5300, 5400];
const BASE_FCF = [6.03, 8.20, 8.63, 8.75, 8.99];
const BASE_REV = [24.5, 30.0, 31.5, 32.5, 33.5];
const BASE_EBITDA = [11.76, 15.0, 15.75, 15.93, 16.42];

// FCF sensitivity: ~$3.9M per $1/oz gold change = $0.39B per $100
const FCF_PER_100 = 0.39;
const REV_PER_100 = 0.56;
const EBITDA_PER_100 = 0.42;

const scenarios = [
  {
    id: "drop4k",
    name: "Bear Case",
    subtitle: "Gold drops to $4,000",
    goldPath: [4800, 4500, 4200, 4000, 4000],
    termGold: 4000,
    color: "#DC2626",
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
    emoji: "📉",
    narrative: "Gold corrects as geopolitical tensions ease, real rates rise, and central bank buying slows. The Fed maintains a hawkish stance, dollar strengthens."
  },
  {
    id: "flat",
    name: "Flat Case",
    subtitle: "Gold stays ~$5,100",
    goldPath: [5100, 5100, 5100, 5100, 5100],
    termGold: 5100,
    color: "#D97706",
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A",
    emoji: "➡️",
    narrative: "Gold consolidates around current levels. Central bank buying persists but is offset by improving risk appetite. Rate cuts are gradual. No major new catalysts."
  },
  {
    id: "base",
    name: "Base Case (DCF)",
    subtitle: "Gold to $5,400",
    goldPath: [3800, 5000, 5200, 5300, 5400],
    termGold: 5400,
    color: "#2563EB",
    bgColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    emoji: "📊",
    narrative: "Our DCF base case. Gold grinds higher on continued central bank accumulation, persistent geopolitical hedging, and fiscal deficit concerns. Consensus Wall Street view."
  },
  {
    id: "bull6k",
    name: "Bull Case",
    subtitle: "Gold to $6,000",
    goldPath: [5200, 5400, 5600, 5800, 6000],
    termGold: 6000,
    color: "#059669",
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    emoji: "📈",
    narrative: "Structural gold bull market accelerates. De-dollarization intensifies, fiscal deficits worsen globally, rate cuts deepen. J.P. Morgan's upside scenario."
  },
  {
    id: "bull8k",
    name: "Super Bull",
    subtitle: "Gold to $8,000",
    goldPath: [5500, 6000, 6800, 7500, 8000],
    termGold: 8000,
    color: "#7C3AED",
    bgColor: "#F5F3FF",
    borderColor: "#DDD6FE",
    emoji: "🚀",
    narrative: "Gold enters a parabolic phase. Major geopolitical escalation, sovereign debt crises in multiple economies, or a fundamental shift away from dollar-denominated reserves."
  },
  {
    id: "bull10k",
    name: "Extreme Bull",
    subtitle: "Gold to $10,000",
    goldPath: [5800, 6500, 7500, 8800, 10000],
    termGold: 10000,
    color: "#BE185D",
    bgColor: "#FDF2F8",
    borderColor: "#FBCFE8",
    emoji: "💎",
    narrative: "Tail-risk scenario. Global monetary system restructuring, hyperinflationary spirals in major economies, or a complete breakdown of dollar hegemony. Peter Schiff / Ed Yardeni extreme case."
  },
];

function computeScenario(s) {
  const fcfs = s.goldPath.map((gp, i) => {
    const delta = (gp - BASE_GOLD[i]) / 100;
    return Math.max(0.5, BASE_FCF[i] + delta * FCF_PER_100);
  });

  const revs = s.goldPath.map((gp, i) => {
    const delta = (gp - BASE_GOLD[i]) / 100;
    return BASE_REV[i] + delta * REV_PER_100;
  });

  const ebitdas = s.goldPath.map((gp, i) => {
    const delta = (gp - BASE_GOLD[i]) / 100;
    return Math.max(2, BASE_EBITDA[i] + delta * EBITDA_PER_100);
  });

  // PV of FCFs
  const pvFCFs = fcfs.map((f, i) => f / Math.pow(1 + WACC, i + 1));
  const sumPV = pvFCFs.reduce((a, b) => a + b, 0);

  // Terminal value (perpetuity growth)
  const termFCF = fcfs[4] * (1 + TERM_GROWTH);
  const tv = termFCF / (WACC - TERM_GROWTH);
  const pvTV = tv / Math.pow(1 + WACC, 5);

  // Also exit multiple (10x terminal EBITDA)
  const tvExit = 10 * ebitdas[4];
  const pvTVExit = tvExit / Math.pow(1 + WACC, 5);

  const evPerp = sumPV + pvTV;
  const evExit = sumPV + pvTVExit;

  const eqPerp = evPerp + NET_CASH;
  const eqExit = evExit + NET_CASH;

  const pricePerp = (eqPerp / SHARES) * 1000;
  const priceExit = (eqExit / SHARES) * 1000;
  const priceBlend = (pricePerp + priceExit) / 2;

  const upside = ((priceBlend / CURRENT_PRICE) - 1) * 100;

  const termEBITDA = ebitdas[4];
  const termFCFRaw = fcfs[4];
  const termRev = revs[4];
  const fcfMargin = (termFCFRaw / termRev) * 100;
  const ebitdaMargin = (termEBITDA / termRev) * 100;
  const cumFCF = fcfs.reduce((a, b) => a + b, 0);

  return {
    fcfs, revs, ebitdas, pvFCFs, sumPV,
    tv, pvTV, tvExit, pvTVExit,
    evPerp, evExit, eqPerp, eqExit,
    pricePerp, priceExit, priceBlend, upside,
    termEBITDA, termFCFRaw, termRev,
    fcfMargin, ebitdaMargin, cumFCF,
  };
}

const fmt = (n, d = 1) => n.toFixed(d);
const fmtB = (n) => `$${n.toFixed(1)}B`;
const fmtP = (n) => `$${Math.round(n)}`;

export default function ScenarioAnalysis() {
  const [selected, setSelected] = useState("base");

  const computed = {};
  scenarios.forEach(s => { computed[s.id] = computeScenario(s); });

  const active = scenarios.find(s => s.id === selected);
  const activeData = computed[selected];

  const years = ["2025E", "2026E", "2027E", "2028E", "2029E"];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#0F172A", minHeight: "100vh", color: "#E2E8F0", padding: "24px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#64748B", textTransform: "uppercase", marginBottom: 8 }}>Newmont Corporation (NYSE: NEM)</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#F1F5F9", margin: "0 0 6px 0" }}>Gold Price Scenario Analysis</h1>
        <div style={{ fontSize: 13, color: "#94A3B8" }}>Current Price: $116.29 | Base DCF Fair Value: ~$137 | As of March 10, 2026</div>
      </div>

      {/* Scenario Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 28 }}>
        {scenarios.map(s => {
          const d = computed[s.id];
          const isActive = s.id === selected;
          return (
            <div
              key={s.id}
              onClick={() => setSelected(s.id)}
              style={{
                background: isActive ? "#1E293B" : "#1E293B80",
                border: `2px solid ${isActive ? s.color : "#334155"}`,
                borderRadius: 10,
                padding: "14px 10px",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
                transform: isActive ? "scale(1.02)" : "scale(1)",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 2 }}>{s.name}</div>
              <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 8 }}>{s.subtitle}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: d.upside >= 0 ? "#10B981" : "#EF4444" }}>
                {fmtP(d.priceBlend)}
              </div>
              <div style={{
                fontSize: 12, fontWeight: 600, marginTop: 2,
                color: d.upside >= 0 ? "#10B981" : "#EF4444"
              }}>
                {d.upside >= 0 ? "+" : ""}{fmt(d.upside, 0)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Panel */}
      <div style={{ background: "#1E293B", borderRadius: 12, border: `1px solid ${active.color}40`, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>{active.emoji}</span>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: active.color, margin: 0 }}>{active.name}: {active.subtitle}</h2>
            <p style={{ fontSize: 13, color: "#94A3B8", margin: "4px 0 0 0", maxWidth: 700 }}>{active.narrative}</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Implied Fair Value", value: fmtP(activeData.priceBlend), sub: `vs $116 current` },
            { label: "Upside / Downside", value: `${activeData.upside >= 0 ? "+" : ""}${fmt(activeData.upside, 1)}%`, sub: activeData.upside > 20 ? "Strong buy signal" : activeData.upside > 0 ? "Moderate upside" : "Downside risk" },
            { label: "Terminal Year FCF", value: fmtB(activeData.termFCFRaw), sub: `${fmt(activeData.fcfMargin)}% margin` },
            { label: "5-Year Cumulative FCF", value: fmtB(activeData.cumFCF), sub: `${fmt(activeData.cumFCF / (CURRENT_PRICE * SHARES / 1000) * 100)}% of mkt cap` },
            { label: "Terminal EBITDA", value: fmtB(activeData.termEBITDA), sub: `${fmt(activeData.ebitdaMargin)}% margin` },
          ].map((item, i) => (
            <div key={i} style={{ background: "#0F172A", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#F1F5F9" }}>{item.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Detailed Year-by-Year Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #334155" }}>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#64748B", fontWeight: 600 }}>Metric</th>
                {years.map(y => (
                  <th key={y} style={{ textAlign: "right", padding: "8px 12px", color: "#64748B", fontWeight: 600 }}>{y}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Gold Price ($/oz)", values: active.goldPath.map(g => `$${g.toLocaleString()}`), bold: true },
                { label: "Revenue ($B)", values: activeData.revs.map(r => fmtB(r)) },
                { label: "EBITDA ($B)", values: activeData.ebitdas.map(e => fmtB(e)) },
                { label: "Free Cash Flow ($B)", values: activeData.fcfs.map(f => fmtB(f)), highlight: true },
                { label: "PV of FCF ($B)", values: activeData.pvFCFs.map(p => fmtB(p)) },
              ].map((row, ri) => (
                <tr key={ri} style={{
                  borderBottom: "1px solid #1E293B",
                  background: row.highlight ? `${active.color}15` : (ri % 2 === 0 ? "#0F172A40" : "transparent")
                }}>
                  <td style={{ padding: "8px 12px", fontWeight: row.bold || row.highlight ? 700 : 400, color: row.highlight ? active.color : "#CBD5E1" }}>{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} style={{ textAlign: "right", padding: "8px 12px", fontWeight: row.bold || row.highlight ? 700 : 400, color: row.highlight ? active.color : "#E2E8F0" }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Valuation Bridge */}
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "#0F172A", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Perpetuity Growth Method</div>
            {[
              ["PV of FCFs (Yr 1-5)", fmtB(activeData.sumPV)],
              ["Terminal Value (PV)", fmtB(activeData.pvTV)],
              ["Enterprise Value", fmtB(activeData.evPerp)],
              ["+ Net Cash", fmtB(NET_CASH)],
              ["Equity Value", fmtB(activeData.eqPerp)],
              ["Per Share", fmtP(activeData.pricePerp)],
            ].map(([label, val], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: i === 4 ? `1px solid ${active.color}40` : "1px solid #1E293B" }}>
                <span style={{ fontSize: 12, color: i === 5 ? active.color : "#94A3B8", fontWeight: i === 5 ? 700 : 400 }}>{label}</span>
                <span style={{ fontSize: 12, color: i === 5 ? active.color : "#E2E8F0", fontWeight: i >= 4 ? 700 : 400 }}>{val}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#0F172A", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Exit Multiple Method (10x EBITDA)</div>
            {[
              ["PV of FCFs (Yr 1-5)", fmtB(activeData.sumPV)],
              ["Terminal Value (PV)", fmtB(activeData.pvTVExit)],
              ["Enterprise Value", fmtB(activeData.evExit)],
              ["+ Net Cash", fmtB(NET_CASH)],
              ["Equity Value", fmtB(activeData.eqExit)],
              ["Per Share", fmtP(activeData.priceExit)],
            ].map(([label, val], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: i === 4 ? `1px solid ${active.color}40` : "1px solid #1E293B" }}>
                <span style={{ fontSize: 12, color: i === 5 ? active.color : "#94A3B8", fontWeight: i === 5 ? 700 : 400 }}>{label}</span>
                <span style={{ fontSize: 12, color: i === 5 ? active.color : "#E2E8F0", fontWeight: i >= 4 ? 700 : 400 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Bar Chart */}
      <div style={{ background: "#1E293B", borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", margin: "0 0 20px 0" }}>Implied Share Price Across All Scenarios</h3>
        <div style={{ position: "relative", height: 280, paddingLeft: 0 }}>
          {/* Current price line */}
          {(() => {
            const maxPrice = Math.max(...scenarios.map(s => computed[s.id].priceBlend), 150);
            const linePos = (CURRENT_PRICE / maxPrice) * 240;
            return (
              <div style={{ position: "absolute", bottom: 40 + linePos, left: 0, right: 0, borderTop: "2px dashed #EF4444", zIndex: 5 }}>
                <span style={{ position: "absolute", right: 0, top: -18, fontSize: 11, color: "#EF4444", fontWeight: 600 }}>Current: $116</span>
              </div>
            );
          })()}
          <div style={{ display: "flex", alignItems: "flex-end", height: 240, gap: 8, paddingBottom: 40, justifyContent: "space-around" }}>
            {scenarios.map(s => {
              const d = computed[s.id];
              const maxPrice = Math.max(...scenarios.map(sc => computed[sc.id].priceBlend), 150);
              const barH = Math.max(20, (d.priceBlend / maxPrice) * 220);
              const isActive = s.id === selected;
              return (
                <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, cursor: "pointer" }} onClick={() => setSelected(s.id)}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: s.color, marginBottom: 4 }}>{fmtP(d.priceBlend)}</div>
                  <div style={{ fontSize: 11, color: d.upside >= 0 ? "#10B981" : "#EF4444", marginBottom: 4, fontWeight: 600 }}>
                    {d.upside >= 0 ? "+" : ""}{fmt(d.upside, 0)}%
                  </div>
                  <div style={{
                    width: "100%", maxWidth: 60,
                    height: barH,
                    background: `linear-gradient(to top, ${s.color}CC, ${s.color}60)`,
                    borderRadius: "6px 6px 0 0",
                    border: isActive ? `2px solid ${s.color}` : "none",
                    transition: "all 0.3s",
                  }} />
                  <div style={{ fontSize: 10, color: "#64748B", marginTop: 6, textAlign: "center", lineHeight: 1.3 }}>
                    {s.subtitle.replace("Gold ", "").replace("to ", "").replace("stays ", "").replace("drops ", "")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Takeaway */}
      <div style={{ background: "#1E293B", borderRadius: 12, padding: 20, borderLeft: `4px solid #F59E0B` }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#F59E0B", margin: "0 0 8px 0" }}>Key Takeaway for Your Investment Decision</h3>
        <p style={{ fontSize: 13, color: "#CBD5E1", margin: 0, lineHeight: 1.7 }}>
          At today's price of $116, you are getting Newmont at a discount even to the "gold stays flat" scenario ($131). The stock only looks overvalued if gold falls meaningfully below $4,000. In the bull cases, the upside is asymmetric and substantial. The risk/reward profile favors a long position if you believe gold stays above $4,500 for the next 3-5 years. Every $1,000/oz move in gold translates to roughly $40-50 in share price. This is a leveraged gold bet wrapped in an operating company.
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#475569" }}>
        For informational and educational purposes only. Not investment advice. All projections involve inherent uncertainty.
      </div>
    </div>
  );
}
