import { useState } from "react";

const CURRENT_PRICE = 116.29;
const SHARES_NOW = 1097; // millions
const WACC = 0.077;
const NET_CASH = 0.8;

// We model: FCF generated each year, portion to dividends, portion to buybacks, remainder to balance sheet
// Newmont currently pays ~$1.00/share annually and has $3B buyback authorization
// We assume dividend grows with FCF and buyback continues aggressively

const scenarios = [
  {
    id: "bear",
    name: "Bear Case",
    subtitle: "Gold drops to $4,000/oz",
    emoji: "📉",
    color: "#DC2626",
    goldPath: [4800, 4500, 4200, 4000, 4000],
    avgGold: 4280,
    fcfs: [4.5, 3.8, 3.2, 2.8, 2.8], // $B
    dividendPerShare: [1.00, 1.00, 0.80, 0.80, 0.80],
    buybackPct: 0.15, // % of FCF to buybacks
    terminalEVMultiple: 7.0, // market compresses multiples in bear case
    narrative: "Gold corrects on easing geopolitical tensions, stronger dollar, rising real rates. Newmont still profitable but margins compress. Market re-rates the stock lower on sentiment.",
  },
  {
    id: "flat",
    name: "Flat Case",
    subtitle: "Gold stays ~$5,100/oz",
    emoji: "➡️",
    color: "#D97706",
    goldPath: [5100, 5100, 5100, 5100, 5100],
    avgGold: 5100,
    fcfs: [6.5, 7.0, 7.0, 7.0, 7.0], // stabilizes
    dividendPerShare: [1.10, 1.20, 1.30, 1.40, 1.50],
    buybackPct: 0.25,
    terminalEVMultiple: 9.0,
    narrative: "Gold consolidates. Newmont generates strong, steady cash flows. Market gradually re-rates the stock to fair value as consistent execution builds confidence.",
  },
  {
    id: "base",
    name: "Base Case",
    subtitle: "Gold to $5,400/oz",
    emoji: "📊",
    color: "#2563EB",
    goldPath: [3800, 5000, 5200, 5300, 5400],
    avgGold: 4940,
    fcfs: [6.03, 8.20, 8.63, 8.75, 8.99],
    dividendPerShare: [1.10, 1.30, 1.50, 1.60, 1.80],
    buybackPct: 0.25,
    terminalEVMultiple: 10.0,
    narrative: "Gold grinds higher per institutional consensus (JPM, UBS, Goldman). Newmont executes on Tier 1 portfolio, completes divestitures, and returns significant capital to shareholders.",
  },
  {
    id: "bull6k",
    name: "Bull Case",
    subtitle: "Gold to $6,000/oz",
    emoji: "📈",
    color: "#059669",
    goldPath: [5200, 5400, 5600, 5800, 6000],
    avgGold: 5600,
    fcfs: [7.0, 9.5, 10.5, 11.2, 12.0],
    dividendPerShare: [1.20, 1.50, 1.80, 2.00, 2.40],
    buybackPct: 0.25,
    terminalEVMultiple: 11.0, // market pays premium for gold exposure
    narrative: "Structural gold bull market accelerates. De-dollarization intensifies, fiscal deficits worsen globally. Newmont becomes a must-own for institutional portfolios seeking gold exposure.",
  },
  {
    id: "bull8k",
    name: "Super Bull",
    subtitle: "Gold to $8,000/oz",
    emoji: "🚀",
    color: "#7C3AED",
    goldPath: [5500, 6000, 6800, 7500, 8000],
    avgGold: 6760,
    fcfs: [7.5, 11.0, 14.5, 17.0, 19.5],
    dividendPerShare: [1.30, 1.80, 2.50, 3.20, 4.00],
    buybackPct: 0.20,
    terminalEVMultiple: 11.0,
    narrative: "Major geopolitical escalation and sovereign debt crises drive gold parabolic. Newmont becomes one of the most profitable companies in the S&P 500. Massive capital returns.",
  },
  {
    id: "bull10k",
    name: "Extreme Bull",
    subtitle: "Gold to $10,000/oz",
    emoji: "💎",
    color: "#BE185D",
    goldPath: [5800, 6500, 7500, 8800, 10000],
    avgGold: 7720,
    fcfs: [8.0, 12.5, 17.0, 22.0, 27.0],
    dividendPerShare: [1.40, 2.00, 3.00, 4.50, 6.00],
    buybackPct: 0.15,
    terminalEVMultiple: 10.0, // even conservative multiple = huge value
    narrative: "Tail-risk scenario. Global monetary restructuring, hyperinflationary spirals, or complete breakdown of dollar hegemony. Gold reprices as the ultimate reserve asset.",
  },
];

function computeFullReturn(s) {
  let shares = SHARES_NOW;
  let totalDividends = 0;
  const yearlyData = [];

  for (let i = 0; i < 5; i++) {
    const fcf = s.fcfs[i];
    const divPS = s.dividendPerShare[i];
    const totalDiv = divPS * shares / 1000; // in $B
    const buybackBudget = fcf * s.buybackPct;

    // Estimate avg price during year for buyback calculation
    // Rough approximation: price trends linearly
    const progressRatio = (i + 1) / 5;
    const estPrice = CURRENT_PRICE * (1 + progressRatio * 1.5); // rough mid-path
    const sharesRepurchased = (buybackBudget * 1000) / estPrice; // millions
    shares = shares - sharesRepurchased;

    totalDividends += divPS;

    yearlyData.push({
      year: 2025 + i,
      gold: s.goldPath[i],
      fcf,
      fcfPerShare: (fcf * 1000 / shares).toFixed(2),
      divPerShare: divPS,
      buybackB: buybackBudget,
      sharesEnd: Math.round(shares),
    });
  }

  // Terminal valuation: what the stock trades at in 2029
  const termFCF = s.fcfs[4];
  const termEBITDA = termFCF / 0.55; // rough EBITDA from FCF
  const termEV = termEBITDA * s.terminalEVMultiple;
  const termEquity = termEV + NET_CASH; // simplified
  const termSharePrice = (termEquity * 1000) / shares;

  const totalDivReturn = totalDividends;
  const priceReturn = termSharePrice - CURRENT_PRICE;
  const totalReturn = priceReturn + totalDivReturn;
  const totalReturnPct = (totalReturn / CURRENT_PRICE) * 100;
  const annualizedReturn = (Math.pow((CURRENT_PRICE + totalReturn) / CURRENT_PRICE, 1/5) - 1) * 100;

  const cumFCF = s.fcfs.reduce((a, b) => a + b, 0);
  const cumFCFPerShare = (cumFCF * 1000 / SHARES_NOW);

  return {
    yearlyData,
    termSharePrice,
    totalDivReturn,
    priceReturn,
    totalReturn,
    totalReturnPct,
    annualizedReturn,
    sharesEnd: Math.round(shares),
    cumFCF,
    cumFCFPerShare,
  };
}

const fmt = (n, d = 1) => n.toFixed(d);

export default function TotalReturnAnalysis() {
  const [selected, setSelected] = useState("base");

  const allData = {};
  scenarios.forEach(s => { allData[s.id] = computeFullReturn(s); });

  const active = scenarios.find(s => s.id === selected);
  const ad = allData[selected];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#0F172A", minHeight: "100vh", color: "#E2E8F0", padding: "24px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#64748B", textTransform: "uppercase", marginBottom: 6 }}>Newmont Corporation (NYSE: NEM)</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#F1F5F9", margin: "0 0 4px 0" }}>5-Year Total Return Analysis</h1>
        <div style={{ fontSize: 13, color: "#94A3B8" }}>Entry Price: $116.29 | Includes price appreciation + cumulative dividends + buyback accretion</div>
      </div>

      {/* Summary comparison table - ALL scenarios */}
      <div style={{ background: "#1E293B", borderRadius: 12, padding: 20, marginBottom: 24, overflowX: "auto" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", margin: "0 0 16px 0" }}>All Scenarios at a Glance (Buy at $116.29 today, hold 5 years)</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #334155" }}>
              {["Scenario", "Gold in 2029", "Stock in 2029", "5Y Dividends", "Total Return", "Total Return %", "Annualized"].map(h => (
                <th key={h} style={{ padding: "8px 10px", color: "#64748B", fontWeight: 600, textAlign: h === "Scenario" ? "left" : "right", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s, si) => {
              const d = allData[s.id];
              const isActive = s.id === selected;
              return (
                <tr
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  style={{
                    cursor: "pointer",
                    background: isActive ? `${s.color}20` : (si % 2 === 0 ? "#0F172A40" : "transparent"),
                    borderBottom: "1px solid #1E293B",
                    borderLeft: isActive ? `3px solid ${s.color}` : "3px solid transparent",
                  }}
                >
                  <td style={{ padding: "10px 10px", fontWeight: 600 }}>
                    <span style={{ marginRight: 6 }}>{s.emoji}</span>
                    <span style={{ color: s.color }}>{s.name}</span>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{s.subtitle}</div>
                  </td>
                  <td style={{ textAlign: "right", padding: "10px", color: "#E2E8F0", fontWeight: 600 }}>${s.goldPath[4].toLocaleString()}</td>
                  <td style={{ textAlign: "right", padding: "10px", fontWeight: 700, fontSize: 15, color: d.termSharePrice > CURRENT_PRICE ? "#10B981" : "#EF4444" }}>
                    ${Math.round(d.termSharePrice)}
                  </td>
                  <td style={{ textAlign: "right", padding: "10px", color: "#94A3B8" }}>
                    ${fmt(d.totalDivReturn, 2)}
                  </td>
                  <td style={{ textAlign: "right", padding: "10px", fontWeight: 700, color: d.totalReturnPct > 0 ? "#10B981" : "#EF4444" }}>
                    ${Math.round(d.totalReturn)}/share
                  </td>
                  <td style={{
                    textAlign: "right", padding: "10px", fontWeight: 800, fontSize: 15,
                    color: d.totalReturnPct > 100 ? "#10B981" : d.totalReturnPct > 0 ? "#34D399" : "#EF4444"
                  }}>
                    {d.totalReturnPct > 0 ? "+" : ""}{fmt(d.totalReturnPct, 0)}%
                  </td>
                  <td style={{
                    textAlign: "right", padding: "10px", fontWeight: 700,
                    color: d.annualizedReturn > 20 ? "#10B981" : d.annualizedReturn > 0 ? "#34D399" : "#EF4444"
                  }}>
                    {d.annualizedReturn > 0 ? "+" : ""}{fmt(d.annualizedReturn, 1)}%/yr
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Scenario selector pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {scenarios.map(s => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            style={{
              background: s.id === selected ? s.color : "#1E293B",
              color: s.id === selected ? "white" : "#94A3B8",
              border: `1px solid ${s.id === selected ? s.color : "#334155"}`,
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      {/* Detailed breakdown for selected */}
      <div style={{ background: "#1E293B", borderRadius: 12, border: `1px solid ${active.color}40`, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>{active.emoji}</span>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: active.color, margin: 0 }}>{active.name}: {active.subtitle}</h2>
            <p style={{ fontSize: 12, color: "#94A3B8", margin: "4px 0 0 0", maxWidth: 700 }}>{active.narrative}</p>
          </div>
        </div>

        {/* Big number cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, margin: "20px 0" }}>
          {[
            {
              label: "Entry Price (Today)",
              value: `$${CURRENT_PRICE}`,
              sub: "March 2026",
              accent: "#94A3B8"
            },
            {
              label: "Exit Price (2029E)",
              value: `$${Math.round(ad.termSharePrice)}`,
              sub: `${ad.termSharePrice > CURRENT_PRICE ? "+" : ""}${fmt((ad.termSharePrice / CURRENT_PRICE - 1) * 100, 0)}% price appreciation`,
              accent: ad.termSharePrice > CURRENT_PRICE ? "#10B981" : "#EF4444"
            },
            {
              label: "Cumulative Dividends",
              value: `$${fmt(ad.totalDivReturn, 2)}/share`,
              sub: `${fmt(ad.totalDivReturn / CURRENT_PRICE * 100, 1)}% cumulative yield`,
              accent: "#F59E0B"
            },
            {
              label: "5-Year Total Return",
              value: `${ad.totalReturnPct > 0 ? "+" : ""}${fmt(ad.totalReturnPct, 0)}%`,
              sub: `${fmt(ad.annualizedReturn, 1)}% annualized`,
              accent: ad.totalReturnPct > 0 ? "#10B981" : "#EF4444"
            },
          ].map((card, i) => (
            <div key={i} style={{ background: "#0F172A", borderRadius: 10, padding: 16, textAlign: "center", borderTop: `3px solid ${card.accent}` }}>
              <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{card.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: card.accent }}>{card.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Year by year table */}
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", margin: "20px 0 12px 0" }}>Year-by-Year Breakdown</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #334155" }}>
              {["Year", "Gold ($/oz)", "FCF ($B)", "FCF/Share", "Dividend/Share", "Shares (M)", "Cumul. Div Collected"].map(h => (
                <th key={h} style={{ padding: "8px 10px", color: "#64748B", fontWeight: 600, textAlign: h === "Year" ? "left" : "right" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ad.yearlyData.map((yr, i) => {
              const cumDiv = ad.yearlyData.slice(0, i + 1).reduce((a, y) => a + y.divPerShare, 0);
              return (
                <tr key={yr.year} style={{
                  borderBottom: "1px solid #1E293B",
                  background: i % 2 === 0 ? "#0F172A40" : "transparent"
                }}>
                  <td style={{ padding: "8px 10px", fontWeight: 600, color: active.color }}>{yr.year}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", color: "#E2E8F0" }}>${yr.gold.toLocaleString()}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", color: "#E2E8F0" }}>${fmt(yr.fcf)}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", color: "#10B981", fontWeight: 600 }}>${yr.fcfPerShare}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", color: "#F59E0B" }}>${fmt(yr.divPerShare, 2)}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", color: "#94A3B8" }}>{yr.sharesEnd.toLocaleString()}</td>
                  <td style={{ textAlign: "right", padding: "8px 10px", color: "#F59E0B", fontWeight: 600 }}>${fmt(cumDiv, 2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Return decomposition */}
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", margin: "24px 0 12px 0" }}>Return Decomposition (per $10,000 invested)</h3>
        {(() => {
          const invested = 10000;
          const sharesOwned = invested / CURRENT_PRICE;
          const divIncome = sharesOwned * ad.totalDivReturn;
          const exitValue = sharesOwned * ad.termSharePrice;
          const totalValue = exitValue + divIncome;
          const profit = totalValue - invested;

          const barMax = Math.max(totalValue, invested * 1.1);
          const divWidth = (divIncome / barMax) * 100;
          const priceWidth = (exitValue / barMax) * 100;

          return (
            <div style={{ background: "#0F172A", borderRadius: 10, padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>You Invest</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#94A3B8" }}>$10,000</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{fmt(sharesOwned, 1)} shares</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Stock Value in 2029</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: exitValue > invested ? "#10B981" : "#EF4444" }}>${Math.round(exitValue).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>@ ${Math.round(ad.termSharePrice)}/share</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Dividends Collected</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#F59E0B" }}>${Math.round(divIncome).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>cash in pocket over 5 years</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Total Value</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: totalValue > invested ? "#10B981" : "#EF4444" }}>${Math.round(totalValue).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: profit > 0 ? "#10B981" : "#EF4444", fontWeight: 700 }}>
                    {profit > 0 ? "+" : ""}${Math.round(profit).toLocaleString()} profit
                  </div>
                </div>
              </div>

              {/* Visual bar */}
              <div style={{ height: 32, borderRadius: 8, overflow: "hidden", display: "flex", background: "#1E293B" }}>
                <div style={{ width: `${priceWidth}%`, background: `linear-gradient(90deg, ${active.color}CC, ${active.color}88)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "white" }}>Stock: ${Math.round(exitValue).toLocaleString()}</span>
                </div>
                <div style={{ width: `${divWidth}%`, background: "#F59E0B88", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "white" }}>Div: ${Math.round(divIncome).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 10, color: "#64748B" }}>$0</span>
                <span style={{ fontSize: 10, color: "#64748B" }}>$10k invested</span>
                <span style={{ fontSize: 10, color: profit > 0 ? "#10B981" : "#EF4444", fontWeight: 600 }}>
                  Total: ${Math.round(totalValue).toLocaleString()} ({profit > 0 ? "+" : ""}{fmt(profit / invested * 100, 0)}%)
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Visual comparison: bars for all scenarios */}
      <div style={{ background: "#1E293B", borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", margin: "0 0 8px 0" }}>$10,000 Invested Today Becomes...</h3>
        <div style={{ fontSize: 12, color: "#64748B", marginBottom: 20 }}>Total value in 2029 (stock appreciation + dividends collected)</div>

        {scenarios.map(s => {
          const d = allData[s.id];
          const sharesOwned = 10000 / CURRENT_PRICE;
          const totalVal = sharesOwned * d.termSharePrice + sharesOwned * d.totalDivReturn;
          const maxVal = (() => {
            const extreme = allData["bull10k"];
            const so = 10000 / CURRENT_PRICE;
            return so * extreme.termSharePrice + so * extreme.totalDivReturn;
          })();
          const barW = Math.max(5, (totalVal / maxVal) * 100);
          const isActive = s.id === selected;

          return (
            <div key={s.id} style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => setSelected(s.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14 }}>{s.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: s.color, width: 110 }}>{s.name}</span>
                <span style={{ fontSize: 11, color: "#64748B", width: 120 }}>Gold @ ${s.goldPath[4].toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  height: 28,
                  width: `${barW}%`,
                  background: `linear-gradient(90deg, ${s.color}CC, ${s.color}60)`,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 10,
                  border: isActive ? `2px solid ${s.color}` : "none",
                  minWidth: 80,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "white" }}>
                    ${Math.round(totalVal).toLocaleString()}
                  </span>
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: d.totalReturnPct > 0 ? "#10B981" : "#EF4444"
                }}>
                  {d.totalReturnPct > 0 ? "+" : ""}{fmt(d.totalReturnPct, 0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom line */}
      <div style={{ background: "#1E293B", borderRadius: 12, padding: 20, borderLeft: "4px solid #F59E0B" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#F59E0B", margin: "0 0 8px 0" }}>The Specific Numbers</h3>
        <p style={{ fontSize: 13, color: "#CBD5E1", margin: 0, lineHeight: 1.8 }}>
          If you buy $10,000 of NEM at $116 today and hold for 5 years:
        </p>
        <div style={{ marginTop: 12, fontSize: 13, lineHeight: 2.0 }}>
          {scenarios.map(s => {
            const d = allData[s.id];
            const sharesOwned = 10000 / CURRENT_PRICE;
            const totalVal = sharesOwned * d.termSharePrice + sharesOwned * d.totalDivReturn;
            return (
              <div key={s.id} style={{ color: "#CBD5E1" }}>
                <span style={{ color: s.color, fontWeight: 700 }}>{s.emoji} {s.name}</span>
                <span style={{ color: "#64748B" }}> (gold {s.subtitle.replace("Gold ", "").replace("stays ", "").replace("drops to ", "@ ").replace("to ", "@ ")}) </span>
                <span style={{ fontWeight: 700, color: d.totalReturnPct > 0 ? "#10B981" : "#EF4444" }}>
                  → ${Math.round(totalVal).toLocaleString()}
                </span>
                <span style={{ color: "#64748B" }}> ({d.totalReturnPct > 0 ? "+" : ""}{fmt(d.totalReturnPct, 0)}% total, {fmt(d.annualizedReturn, 1)}%/yr)</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#475569" }}>
        For informational and educational purposes only. Not investment advice. All projections involve inherent uncertainty.
      </div>
    </div>
  );
}
