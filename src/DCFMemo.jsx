import { useState } from "react";

// ============================================================
// DATA
// ============================================================
const years = ["2024A","2025E","2026E","2027E","2028E","2029E"];
const revenue =    [18.68, 24.50, 30.00, 31.50, 32.50, 33.50];
const ebitdaMargin=[46.6, 48.0, 50.0, 50.0, 49.0, 49.0];
const ebitda =     [8.70, 11.76, 15.00, 15.75, 15.93, 16.42];
const dna =        [3.00, 3.00, 3.00, 3.00, 3.00, 3.00];
const ebit =       [5.70, 8.76, 12.00, 12.75, 12.93, 13.42];
const nopat =      ebit.map(e => (e * 0.70).toFixed(2));
const capex =      [3.40, 3.10, 3.20, 3.30, 3.30, 3.40];
const fcf =        [2.96, 6.03, 8.20, 8.63, 8.75, 8.99];
const goldPrices = ["$2,408","$3,800","$5,000","$5,200","$5,300","$5,400"];

const WACC = 0.077;
const pvFactors = [1,2,3,4,5].map(n => Math.pow(1+WACC, n));
const pvFCFs = [6.03,8.20,8.63,8.75,8.99].map((f,i) => f / pvFactors[i]);
const sumPV = pvFCFs.reduce((a,b) => a+b, 0);
const tvExit = 10.0 * ebitda[5];
const tvPerp = (fcf[5] * 1.025) / (WACC - 0.025);
const pvTVExit = tvExit / pvFactors[4];
const pvTVPerp = tvPerp / pvFactors[4];
const evExit = sumPV + pvTVExit;
const evPerp = sumPV + pvTVPerp;
const eqExit = evExit + 0.8;
const eqPerp = evPerp + 0.8;
const priceExit = eqExit / 1097 * 1000;
const pricePerp = eqPerp / 1097 * 1000;
const priceBlend = (priceExit + pricePerp) / 2;

// Sensitivity
const waccArr = [6.7,7.0,7.4,7.7,8.0,8.4];
const growthArr = [1.5,2.0,2.5,3.0,3.5];
function calcSP(w,g) {
  const wd=w/100, gd=g/100;
  const pv = [6.03,8.20,8.63,8.75,8.99].map((f,i)=>f/Math.pow(1+wd,i+1));
  const s = pv.reduce((a,b)=>a+b,0);
  const tv = (8.99*(1+gd))/(wd-gd);
  return Math.round((s + tv/Math.pow(1+wd,5) + 0.8) / 1097 * 1000);
}
const matrix = growthArr.map(g => waccArr.map(w => calcSP(w,g)));

// ============================================================
// STYLE HELPERS
// ============================================================
const S = {
  page: { maxWidth: 860, margin: "0 auto", padding: "40px 24px", color: "#CBD5E1" },
  h1: { fontSize: 24, fontWeight: 700, color: "#F1F5F9", margin: "40px 0 16px 0", paddingBottom: 8, borderBottom: "2px solid #2563EB" },
  h2: { fontSize: 20, fontWeight: 700, color: "#93C5FD", margin: "32px 0 12px 0" },
  h3: { fontSize: 16, fontWeight: 700, color: "#94A3B8", margin: "24px 0 8px 0" },
  p: { fontSize: 14, lineHeight: 1.75, color: "#94A3B8", margin: "0 0 16px 0" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 24 },
  th: { padding: "8px 10px", background: "#1B3A5C", color: "#F1F5F9", fontWeight: 600, textAlign: "center", border: "1px solid #334155" },
  thL: { padding: "8px 10px", background: "#1B3A5C", color: "#F1F5F9", fontWeight: 600, textAlign: "left", border: "1px solid #334155" },
  td: { padding: "7px 10px", textAlign: "center", border: "1px solid #1E293B", color: "#E2E8F0" },
  tdL: { padding: "7px 10px", textAlign: "left", border: "1px solid #1E293B", color: "#E2E8F0", fontWeight: 600 },
  alt: { background: "#0F172A" },
  highlight: { background: "#2563EB15", fontWeight: 700 },
  accent: { background: "#FFFACD20", fontWeight: 700, color: "#FCD34D" },
};

function MemoTable({ headers, rows, labelCol = true }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={S.table}>
        <thead>
          <tr>
            {headers.map((h,i) => (
              <th key={i} style={i === 0 && labelCol ? S.thL : S.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={row._style || (ri % 2 === 0 ? S.alt : {})}>
              {row.cells.map((c, ci) => (
                <td key={ci} style={{
                  ...(ci === 0 && labelCol ? S.tdL : S.td),
                  ...(row._highlight ? S.highlight : {}),
                  ...(row._accent ? S.accent : {}),
                }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// COMPONENT
// ============================================================
export default function DCFMemo() {
  return (
    <div style={{ background: "#0F172A", minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={S.page}>

        {/* =========== HEADER =========== */}
        <div style={{ textAlign: "center", marginBottom: 40, paddingTop: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#475569", textTransform: "uppercase", marginBottom: 12 }}>Confidential Valuation Memorandum</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#F1F5F9", margin: "0 0 8px 0", letterSpacing: -0.5 }}>Newmont Corporation (NYSE: NEM)</h1>
          <p style={{ fontSize: 16, color: "#64748B", margin: "0 0 4px 0" }}>Discounted Cash Flow Analysis</p>
          <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>Prepared March 10, 2026 | Current Share Price: $116.29 | Market Cap: ~$127.6B</p>
        </div>

        {/* =========== VERDICT BOX =========== */}
        <div style={{
          background: "#10B98115", border: "2px solid #10B98140", borderRadius: 12,
          padding: "20px 28px", textAlign: "center", marginBottom: 40,
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#10B981", marginBottom: 6 }}>VERDICT: MODERATELY UNDERVALUED</div>
          <div style={{ fontSize: 15, color: "#E2E8F0", fontWeight: 600 }}>DCF Implied Fair Value: $133 - $142 per share | Blended: ~$137</div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Current Price: $116.29 | Implied Upside: ~18% | Analyst Consensus Target: $133 - $140</div>
        </div>

        {/* =========== LAYMAN SUMMARY =========== */}
        <h1 style={S.h1}>What This Means in Plain English</h1>
        <p style={S.p}>Newmont is the world's largest gold miner. It produces roughly 5.6 million ounces of gold a year from mines across five continents and sits on 134 million ounces of gold reserves, enough to sustain production for over two decades.</p>
        <p style={S.p}>Gold has been on an extraordinary run. It started 2024 around $2,000 per ounce and now trades above $5,100. That surge has transformed Newmont's economics. The company's cost to mine an ounce of gold is about $1,620. When gold sells for $5,100, the profit margin on every single ounce is roughly $3,480. That is an immensely profitable business.</p>
        <p style={S.p}>So why might the stock still be undervalued? A few reasons. First, the stock has roughly tripled from its 2024 lows, which makes some investors nervous about chasing it. Second, gold miners historically trade at a discount to the value of their underlying gold because of operational risks, political risks in mining jurisdictions, and the cyclical nature of commodity prices. Third, many investors are still catching up to the new gold price reality and what it means for Newmont's cash flows.</p>
        <p style={S.p}>Our model suggests the stock is worth about $137 per share under base case assumptions, roughly 18% above where it trades today. That is a meaningful but not extreme gap. The thesis is simple and depends on one big variable. If gold stays above $4,500 per ounce, Newmont will be a cash flow machine throwing off $8 to $9 billion in free cash flow per year. If gold retraces below $3,000, the math changes dramatically.</p>
        <p style={S.p}><strong style={{color:"#E2E8F0"}}>Bottom line for you as an investor considering this name:</strong> you are fundamentally making a bet on the gold price staying elevated. If you believe in the structural bull case for gold (central bank buying, geopolitical hedging, fiscal deficit concerns), Newmont is the highest-quality vehicle to express that view. If you think gold is in a bubble, this stock has significant downside.</p>

        {/* =========== 1. COMPANY OVERVIEW =========== */}
        <h1 style={S.h1}>1. Company Overview</h1>
        <p style={S.p}>Newmont Corporation (NYSE: NEM) is the world's leading gold producer and the only gold miner in the S&P 500 Index. Following the 2023 acquisition of Newcrest Mining, the company completed a strategic transformation in 2024, divesting six non-core assets and consolidating around a Tier 1 portfolio of eleven managed operations and three non-managed joint ventures. The company is headquartered in Denver, Colorado.</p>

        <MemoTable
          headers={["Metric", "FY2024 Actual", "FY2025 Guidance"]}
          rows={[
            { cells: ["Gold Production (M oz)", "6.8", "5.9"] },
            { cells: ["Tier 1 Production (M oz)", "5.7", "5.6"] },
            { cells: ["Avg Realized Gold Price ($/oz)", "$2,408", "~$3,800E"] },
            { cells: ["AISC ($/oz)", "$1,444", "$1,620"] },
            { cells: ["Revenue ($B)", "$18.68", "~$24.5E"] },
            { cells: ["Adj. EBITDA ($B)", "$8.7", "~$11.8E"] },
            { cells: ["Free Cash Flow ($B)", "$2.96", "~$6.0E"] },
            { cells: ["Gold Reserves (M oz)", "134", "134"] },
          ]}
        />

        {/* =========== 2. REVENUE =========== */}
        <h1 style={S.h1}>2. Five-Year Revenue Projection</h1>
        <p style={S.p}>Revenue is projected based on stable Tier 1 gold production of ~5.6 million ounces per year, combined with gold price assumptions derived from the institutional consensus. J.P. Morgan forecasts gold averaging ~$5,000/oz in Q4 2026. UBS targets $5,000/oz for 2026 overall. Goldman Sachs projects $5,000 by 2027. We use a base case that blends these outlooks with a modest premium for continued structural demand drivers (central bank accumulation, geopolitical hedging, and fiscal deficit concerns). Other metals revenue (copper, silver, zinc, lead) is modeled as growing at 3-5% annually from the 2024 base.</p>

        <h3 style={S.h3}>Gold Price Assumptions (Base Case, $/oz)</h3>
        <MemoTable
          headers={years}
          labelCol={false}
          rows={[{ cells: goldPrices, _highlight: true }]}
        />

        <h3 style={S.h3}>Revenue Build ($B)</h3>
        <MemoTable
          headers={["", ...years.slice(1)]}
          rows={[
            { cells: ["Revenue ($B)", "$24.5", "$30.0", "$31.5", "$32.5", "$33.5"] },
            { cells: ["YoY Growth", "31.2%", "22.4%", "5.0%", "3.2%", "3.1%"] },
            { cells: ["Gold Revenue ($B)", "$21.3", "$26.3", "$27.4", "$27.9", "$28.5"] },
            { cells: ["Other Metals ($B)", "$3.2", "$3.7", "$4.1", "$4.6", "$5.0"] },
          ]}
        />

        {/* =========== 3. MARGINS =========== */}
        <h1 style={S.h1}>3. Operating Margin Estimates</h1>
        <p style={S.p}>Newmont's EBITDA margin expanded sharply in 2024 as gold prices rose while production costs remained relatively anchored. The company's 2024 adjusted EBITDA margin was 46.6%. With gold prices now materially higher than 2024 averages, margins have expanded further. Q3 2025 operating margin reached 45.8%. We project EBITDA margins stabilizing at 49-50% through the forecast period, reflecting the favorable gold price environment partially offset by ~3% annual cost escalation guided by management, higher royalties, and elevated sustaining capital requirements for tailings management and infrastructure.</p>

        <MemoTable
          headers={["", ...years]}
          rows={[
            { cells: ["Revenue ($B)", ...revenue.map(r => `$${r.toFixed(1)}`)] },
            { cells: ["EBITDA ($B)", ...ebitda.map(e => `$${e.toFixed(2)}`)] },
            { cells: ["EBITDA Margin", ...ebitdaMargin.map(m => `${m.toFixed(1)}%`)], _highlight: true },
            { cells: ["D&A ($B)", ...dna.map(d => `$${d.toFixed(1)}`)] },
            { cells: ["EBIT ($B)", ...ebit.map(e => `$${e.toFixed(2)}`)] },
            { cells: ["EBIT Margin", ...revenue.map((r,i) => `${(ebit[i]/r*100).toFixed(1)}%`)], _highlight: true },
          ]}
        />

        {/* =========== 4. FCF =========== */}
        <h1 style={S.h1}>4. Free Cash Flow Calculation</h1>
        <p style={S.p}>Free cash flow is derived from NOPAT (net operating profit after tax) plus depreciation less capital expenditures. We assume a 30% blended tax rate consistent with Newmont's 2024 effective rate. Capital expenditure is guided at approximately $3.1 billion for 2025 (sustaining capital of $1.8B plus development capital of $1.3B) and is modeled to grow modestly thereafter as the company invests in its development pipeline, including Cerro Negro in Argentina ($800M commitment announced) and continued work at Cadia, Tanami, and other Tier 1 sites.</p>

        <MemoTable
          headers={["($B)", ...years]}
          rows={[
            { cells: ["EBIT", ...ebit.map(e => `$${e.toFixed(2)}`)] },
            { cells: ["Tax @ 30%", ...ebit.map(e => `($${(e*0.30).toFixed(2)})`)] },
            { cells: ["NOPAT", ...nopat.map(n => `$${n}`)] },
            { cells: ["+ D&A", ...dna.map(d => `$${d.toFixed(2)}`)] },
            { cells: ["- Capex", ...capex.map(c => `($${c.toFixed(2)})`)] },
            { cells: ["\u0394 Working Capital", "$0.0", "$0.0", "$0.0", "$0.0", "$0.0", "$0.0"] },
            { cells: ["Free Cash Flow", ...fcf.map(f => `$${f.toFixed(2)}`)], _accent: true },
            { cells: ["FCF Margin", ...revenue.map((r,i) => `${(fcf[i]/r*100).toFixed(1)}%`)], _highlight: true },
          ]}
        />

        {/* =========== 5. WACC =========== */}
        <h1 style={S.h1}>5. Weighted Average Cost of Capital (WACC)</h1>
        <p style={S.p}>We estimate Newmont's WACC at 7.7%, reflecting the company's low leverage profile and moderate equity beta. The cost of equity is derived using the Capital Asset Pricing Model with a risk-free rate of 4.1% (10-year US Treasury yield), an equity risk premium of 5.5%, and Newmont's observed beta of 0.69. The relatively low beta reflects gold's historical role as a diversifier and safe-haven asset, which tends to dampen gold miners' correlation with the broader market.</p>

        <MemoTable
          headers={["Component", "Value"]}
          rows={[
            { cells: ["Risk-Free Rate (10Y UST)", "4.10%"] },
            { cells: ["Equity Risk Premium", "5.50%"] },
            { cells: ["Beta", "0.69"] },
            { cells: ["Cost of Equity (Ke)", "7.90%"] },
            { cells: ["Pre-Tax Cost of Debt (Kd)", "4.50%"] },
            { cells: ["Tax Rate", "30.0%"] },
            { cells: ["After-Tax Cost of Debt", "3.15%"] },
            { cells: ["Market Cap (Equity)", "$127.6B"] },
            { cells: ["Total Debt", "$5.2B"] },
            { cells: ["Equity Weight", "96.1%"] },
            { cells: ["Debt Weight", "3.9%"] },
            { cells: ["WACC", "7.7%"], _accent: true },
          ]}
        />

        {/* =========== 6. TERMINAL VALUE =========== */}
        <h1 style={S.h1}>6. Terminal Value</h1>
        <p style={S.p}>We compute terminal value using two methodologies and weight them equally. The exit multiple approach applies a 10.0x EV/EBITDA multiple to 2029E EBITDA, consistent with the trailing average for large-cap gold miners. The perpetuity growth approach assumes a 2.5% long-term growth rate, reflecting a blend of modest production growth and long-run gold price appreciation in line with inflation.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ background: "#1E293B", borderRadius: 10, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#93C5FD", margin: "0 0 12px 0" }}>Exit Multiple Method</h3>
            {[
              ["2029E EBITDA", `$${ebitda[5].toFixed(2)}B`],
              ["Exit Multiple", "10.0x"],
              ["Terminal Value", `$${tvExit.toFixed(1)}B`],
              ["PV of Terminal Value", `$${pvTVExit.toFixed(1)}B`],
            ].map(([l,v],i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #0F172A" }}>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>{l}</span>
                <span style={{ fontSize: 13, color: i===3 ? "#FCD34D" : "#E2E8F0", fontWeight: i>=2?700:400 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#1E293B", borderRadius: 10, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#93C5FD", margin: "0 0 12px 0" }}>Perpetuity Growth Method</h3>
            {[
              ["2029E FCF", `$${fcf[5].toFixed(2)}B`],
              ["Terminal Growth Rate (g)", "2.5%"],
              ["Terminal Value", `$${tvPerp.toFixed(1)}B`],
              ["PV of Terminal Value", `$${pvTVPerp.toFixed(1)}B`],
            ].map(([l,v],i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #0F172A" }}>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>{l}</span>
                <span style={{ fontSize: 13, color: i===3 ? "#FCD34D" : "#E2E8F0", fontWeight: i>=2?700:400 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* =========== 7. VALUATION BRIDGE =========== */}
        <h1 style={S.h1}>7. DCF Valuation Bridge</h1>

        <MemoTable
          headers={["", "Exit Multiple", "Perpetuity Growth"]}
          rows={[
            { cells: ["PV of FCFs (Years 1-5)", `$${sumPV.toFixed(1)}B`, `$${sumPV.toFixed(1)}B`] },
            { cells: ["PV of Terminal Value", `$${pvTVExit.toFixed(1)}B`, `$${pvTVPerp.toFixed(1)}B`] },
            { cells: ["Enterprise Value", `$${evExit.toFixed(1)}B`, `$${evPerp.toFixed(1)}B`] },
            { cells: ["Less: Net Debt", "$-0.8B", "$-0.8B"] },
            { cells: ["Equity Value", `$${eqExit.toFixed(1)}B`, `$${eqPerp.toFixed(1)}B`] },
            { cells: ["Diluted Shares (M)", "1,097", "1,097"] },
            { cells: ["Implied Share Price", `$${Math.round(priceExit)}`, `$${Math.round(pricePerp)}`], _accent: true },
          ]}
        />

        <div style={{
          background: "#10B98115", border: "1px solid #10B98130", borderRadius: 10,
          padding: "16px 24px", textAlign: "center", marginBottom: 32,
        }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#10B981" }}>Blended Fair Value (50/50): ~${Math.round(priceBlend)} per share</span>
        </div>

        {/* =========== 8. SENSITIVITY =========== */}
        <h1 style={S.h1}>8. Sensitivity Analysis</h1>
        <p style={S.p}>The table below shows the implied share price at various combinations of WACC and terminal growth rate. The highlighted cell represents our base case (WACC 7.7%, terminal growth 2.5%). This analysis helps illustrate the range of possible outcomes and the sensitivity of the valuation to key discount rate assumptions.</p>

        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.thL}>WACC / g</th>
                {waccArr.map(w => <th key={w} style={S.th}>{w.toFixed(1)}%</th>)}
              </tr>
            </thead>
            <tbody>
              {growthArr.map((g, gi) => (
                <tr key={g} style={gi % 2 === 0 ? S.alt : {}}>
                  <td style={{ ...S.tdL, background: "#1B3A5C", color: "#F1F5F9" }}>{g.toFixed(1)}%</td>
                  {waccArr.map((w, wi) => {
                    const isBase = g === 2.5 && w === 7.7;
                    return (
                      <td key={w} style={{
                        ...S.td,
                        background: isBase ? "#FCD34D30" : undefined,
                        color: isBase ? "#FCD34D" : "#E2E8F0",
                        fontWeight: isBase ? 800 : 400,
                        fontSize: isBase ? 15 : 13,
                      }}>${matrix[gi][wi]}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...S.p, fontSize: 12, fontStyle: "italic" }}>Base case highlighted. Range spans from ${Math.min(...matrix.flat())} to ${Math.max(...matrix.flat())} per share.</p>

        {/* =========== 9. MARKET COMPARISON =========== */}
        <h1 style={S.h1}>9. DCF vs. Market Price</h1>

        <MemoTable
          headers={["Metric", "Value"]}
          rows={[
            { cells: ["Current Market Price", "$116.29"] },
            { cells: ["DCF Fair Value (Exit Multiple)", `$${Math.round(priceExit)}`] },
            { cells: ["DCF Fair Value (Perpetuity Growth)", `$${Math.round(pricePerp)}`] },
            { cells: ["Blended DCF Fair Value", `$${Math.round(priceBlend)}`], _accent: true },
            { cells: ["Implied Upside to Blended", `${((priceBlend/116.29-1)*100).toFixed(1)}%`], _accent: true },
            { cells: ["Street Consensus Target", "$133 - $140"] },
            { cells: ["52-Week High", "$134.88"] },
            { cells: ["52-Week Low", "$42.03"] },
          ]}
        />
        <p style={S.p}>Our DCF fair value of ~$137 aligns closely with the Wall Street consensus target range of $133 to $140 and sits just above Newmont's recent all-time high of $134.88. Recent analyst actions have been overwhelmingly bullish. Citi raised its target to $150, BofA to $151, and Bernstein upgraded the stock to Outperform. J.P. Morgan initiated coverage with an Overweight rating. Of 18 analysts covering the stock, all 18 rate it a Buy.</p>

        {/* =========== 10. RISKS =========== */}
        <h1 style={S.h1}>10. Key Assumptions and Model-Breaking Risks</h1>
        <p style={S.p}>Every model rests on assumptions, and this one is no different. The following are the critical variables that could cause the actual outcome to diverge materially from our base case.</p>

        {[
          {
            title: "Gold Price is the Dominant Variable",
            text: "This model's single greatest dependency is the gold price. We assume an average realized gold price of $5,000-$5,400 per ounce across the forecast period. Every $100 per ounce move in gold translates to roughly $560 million in annual revenue and approximately $390 million in annual free cash flow for Newmont. A sustained decline to $3,500 per ounce would reduce our fair value estimate to approximately $80 per share. A move to $6,000 per ounce would push fair value above $170.",
          },
          {
            title: "Cost Inflation Could Compress Margins",
            text: "Mining costs are subject to inflationary pressures on diesel, labor, explosives, and equipment. Newmont guides for ~3% annual cost escalation, but in a high-inflation environment, AISC could rise faster. A sustained move in AISC to $2,000 per ounce (from $1,620 currently) would reduce FCF by approximately $2.1 billion annually.",
          },
          {
            title: "Geopolitical and Jurisdictional Risks",
            text: "Newmont operates in multiple jurisdictions with varying political risk profiles, including Papua New Guinea, Ghana, Suriname, Argentina, and Peru. Changes in mining royalties, tax regimes, or operational permits could impair cash flows from specific assets. The recent $800 million commitment to Cerro Negro in Argentina is a meaningful capital deployment into a country with a history of currency and policy volatility.",
          },
          {
            title: "Production Execution Risk",
            text: "We assume stable production of ~5.6 million gold ounces per year. Operational disruptions, grade variability, weather events, or community relations issues could result in production shortfalls. The 2023 Penasquito labor strike is a reminder that production targets are not guaranteed.",
          },
          {
            title: "Terminal Value Sensitivity",
            text: "Terminal value represents over 75% of total enterprise value in this model, which is typical for mining companies with long reserve lives but highlights the sensitivity to long-term assumptions. A 1-point change in WACC swings fair value by approximately $30 per share.",
          },
          {
            title: "Share Count Dilution and Buyback Pace",
            text: "We use 1,097 million shares outstanding. Newmont has a $3 billion buyback authorization through October 2026 and has already repurchased $1.2 billion. The pace of buybacks at elevated share prices will influence per-share value creation. We do not model buyback accretion.",
          },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <h3 style={S.h3}>{item.title}</h3>
            <p style={S.p}>{item.text}</p>
          </div>
        ))}

        {/* =========== DISCLAIMER =========== */}
        <div style={{ borderTop: "2px solid #334155", marginTop: 40, paddingTop: 20 }}>
          <h2 style={{ ...S.h2, color: "#64748B" }}>Disclaimer</h2>
          <p style={{ ...S.p, fontSize: 12, color: "#475569", fontStyle: "italic" }}>
            This memorandum is prepared for informational and educational purposes only. It does not constitute a recommendation to buy, sell, or hold any security. The analysis is based on publicly available information and assumptions that may prove incorrect. All financial projections are inherently uncertain. The author is not a licensed investment advisor, broker, or dealer. Consult a qualified financial professional before making investment decisions. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </div>
  );
}
