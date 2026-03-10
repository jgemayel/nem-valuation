import { useState } from "react";

const CP = 116.29;
const SH = 1097;

const scenarios = [
  { id:"bear", name:"Bear", sub:"Gold to $4,000", gp:[4800,4500,4200,4000,4000],
    fcfs:[4.5,3.8,3.2,2.8,2.8], divs:[1.00,1.00,0.80,0.80,0.80], bbPct:0.15, tM:7.0,
    note:"Gold corrects on easing tensions, stronger dollar, rising real rates. Still profitable but margins compress." },
  { id:"flat", name:"Flat", sub:"Gold at $5,100", gp:[5100,5100,5100,5100,5100],
    fcfs:[6.5,7.0,7.0,7.0,7.0], divs:[1.10,1.20,1.30,1.40,1.50], bbPct:0.25, tM:9.0,
    note:"Gold consolidates. Strong steady cash flows. Market gradually re-rates to fair value." },
  { id:"base", name:"Base", sub:"Gold to $5,400", gp:[3800,5000,5200,5300,5400],
    fcfs:[6.03,8.20,8.63,8.75,8.99], divs:[1.10,1.30,1.50,1.60,1.80], bbPct:0.25, tM:10.0,
    note:"Institutional consensus (JPM, UBS, Goldman). Newmont executes on Tier 1 portfolio, returns capital." },
  { id:"bull6", name:"Bull", sub:"Gold to $6,000", gp:[5200,5400,5600,5800,6000],
    fcfs:[7.0,9.5,10.5,11.2,12.0], divs:[1.20,1.50,1.80,2.00,2.40], bbPct:0.25, tM:11.0,
    note:"Structural bull market accelerates. De-dollarization, worsening fiscal deficits globally." },
  { id:"bull8", name:"Super Bull", sub:"Gold to $8,000", gp:[5500,6000,6800,7500,8000],
    fcfs:[7.5,11.0,14.5,17.0,19.5], divs:[1.30,1.80,2.50,3.20,4.00], bbPct:0.20, tM:11.0,
    note:"Major geopolitical escalation, sovereign debt crises. Newmont becomes one of the most profitable S&P 500 companies." },
  { id:"bull10", name:"Extreme", sub:"Gold to $10,000", gp:[5800,6500,7500,8800,10000],
    fcfs:[8.0,12.5,17.0,22.0,27.0], divs:[1.40,2.00,3.00,4.50,6.00], bbPct:0.15, tM:10.0,
    note:"Tail risk. Monetary system restructuring, hyperinflation, or complete breakdown of dollar hegemony." },
];

function compute(s) {
  let sh = SH;
  const yd = [];
  let cumDiv = 0;
  for (let i=0; i<5; i++) {
    const bb = s.fcfs[i] * s.bbPct;
    const ep = CP * (1 + (i+1)/5 * 1.5);
    sh -= (bb * 1000) / ep;
    cumDiv += s.divs[i];
    yd.push({ yr: 2025+i, gold: s.gp[i], fcf: s.fcfs[i], fcfPS: (s.fcfs[i]*1000/sh).toFixed(2), div: s.divs[i], sh: Math.round(sh), cumDiv: cumDiv.toFixed(2) });
  }
  const tEBITDA = s.fcfs[4] / 0.55;
  const tEV = tEBITDA * s.tM;
  const tPrice = (tEV + 0.8) * 1000 / sh;
  const totDiv = s.divs.reduce((a,b)=>a+b,0);
  const totRet = ((tPrice + totDiv) / CP - 1) * 100;
  const ann = (Math.pow((tPrice + totDiv) / CP, 0.2) - 1) * 100;
  const cumFCF = s.fcfs.reduce((a,b)=>a+b,0);
  return { yd, tPrice, totDiv, totRet, ann, cumFCF, sh: Math.round(sh) };
}

const font = "'Inter', -apple-system, sans-serif";

export default function TotalReturn() {
  const [sel, setSel] = useState("base");
  const all = {};
  scenarios.forEach(s => { all[s.id] = compute(s); });
  const act = scenarios.find(s=>s.id===sel);
  const ad = all[sel];

  return (
    <div style={{ background:"#FAFAF8", minHeight:"100vh", fontFamily:font }}>
      <div style={{ maxWidth:860, margin:"0 auto", padding:"48px 24px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <p style={{ fontSize:11, letterSpacing:4, color:"#AAA", textTransform:"uppercase", marginBottom:8 }}>Five-Year Total Return Analysis</p>
          <h1 style={{ fontSize:32, fontWeight:400, color:"#111", margin:"0 0 6px 0", fontFamily:"'Georgia', serif" }}>Newmont Corporation</h1>
          <p style={{ fontSize:13, color:"#999" }}>Entry at $116.29 &nbsp;&middot;&nbsp; Price appreciation + dividends + buyback accretion</p>
        </div>

        {/* Master table */}
        <div style={{ overflowX:"auto", marginBottom:40 }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #333" }}>
                {["Scenario","Gold 2029","Stock 2029","Dividends","Total Return","Annualized"].map(h=>(
                  <th key={h} style={{ padding:"8px 10px", textAlign:h==="Scenario"?"left":"right", fontSize:11, letterSpacing:0.5, color:"#999", fontWeight:600, textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s,si)=>{
                const d = all[s.id];
                const active = s.id === sel;
                return (
                  <tr key={s.id} onClick={()=>setSel(s.id)} style={{
                    cursor:"pointer", borderBottom:"1px solid #E5E5E0",
                    background: active ? "#F5F5F0" : undefined,
                    borderLeft: active ? "3px solid #111" : "3px solid transparent",
                  }}>
                    <td style={{ padding:"10px 10px" }}>
                      <span style={{ fontWeight:600, color:"#111" }}>{s.name}</span>
                      <span style={{ color:"#999", marginLeft:8, fontSize:12 }}>{s.sub}</span>
                    </td>
                    <td style={{ textAlign:"right", padding:"10px", color:"#555" }}>${s.gp[4].toLocaleString()}</td>
                    <td style={{ textAlign:"right", padding:"10px", fontWeight:600, color: d.tPrice > CP ? "#111" : "#C00" }}>${Math.round(d.tPrice)}</td>
                    <td style={{ textAlign:"right", padding:"10px", color:"#888" }}>${d.totDiv.toFixed(2)}</td>
                    <td style={{ textAlign:"right", padding:"10px", fontWeight:700, color: d.totRet > 0 ? "#111" : "#C00" }}>
                      {d.totRet > 0 ? "+" : ""}{d.totRet.toFixed(0)}%
                    </td>
                    <td style={{ textAlign:"right", padding:"10px", fontWeight:600, color: d.ann > 0 ? "#555" : "#C00" }}>
                      {d.ann > 0 ? "+" : ""}{d.ann.toFixed(1)}%/yr
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected detail */}
        <div style={{ borderTop:"1px solid #DDD", paddingTop:32, marginBottom:32 }}>
          <div style={{ marginBottom:20 }}>
            <h2 style={{ fontSize:22, fontWeight:400, color:"#111", margin:"0 0 6px 0", fontFamily:"'Georgia', serif" }}>{act.name}: {act.sub}</h2>
            <p style={{ fontSize:13, color:"#999", margin:0 }}>{act.note}</p>
          </div>

          {/* Key numbers */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16, marginBottom:28 }}>
            {[
              { label:"Entry Price", val:`$${CP}`, sub:"March 2026" },
              { label:"Exit Price (2029)", val:`$${Math.round(ad.tPrice)}`, sub:`${ad.tPrice>CP?"+":""}${((ad.tPrice/CP-1)*100).toFixed(0)}% appreciation` },
              { label:"Dividends Collected", val:`$${ad.totDiv.toFixed(2)}/sh`, sub:`${(ad.totDiv/CP*100).toFixed(1)}% cumulative yield` },
              { label:"5-Year Total Return", val:`${ad.totRet>0?"+":""}${ad.totRet.toFixed(0)}%`, sub:`${ad.ann.toFixed(1)}% annualized` },
            ].map((c,i)=>(
              <div key={i} style={{ background:"#FFF", border:"1px solid #E5E5E0", padding:"16px 14px" }}>
                <p style={{ fontSize:10, letterSpacing:1, color:"#AAA", textTransform:"uppercase", margin:"0 0 8px 0" }}>{c.label}</p>
                <p style={{ fontSize:24, fontWeight:600, color:"#111", margin:"0 0 4px 0" }}>{c.val}</p>
                <p style={{ fontSize:11, color:"#999", margin:0 }}>{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Year by year */}
          <p style={{ fontSize:11, letterSpacing:1, color:"#AAA", textTransform:"uppercase", fontWeight:600, margin:"0 0 8px 0" }}>Year-by-Year Detail</p>
          <div style={{ overflowX:"auto", marginBottom:28 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:"2px solid #333" }}>
                  {["Year","Gold ($/oz)","FCF ($B)","FCF/Share","Div/Share","Shares (M)","Cumul. Div"].map(h=>(
                    <th key={h} style={{ padding:"8px 10px", textAlign:h==="Year"?"left":"right", fontSize:11, letterSpacing:0.5, color:"#999", fontWeight:600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ad.yd.map((yr,i)=>(
                  <tr key={yr.yr} style={{ borderBottom:"1px solid #E5E5E0" }}>
                    <td style={{ padding:"7px 10px", fontWeight:600, color:"#333" }}>{yr.yr}</td>
                    <td style={{ textAlign:"right", padding:"7px 10px", color:"#555" }}>${yr.gold.toLocaleString()}</td>
                    <td style={{ textAlign:"right", padding:"7px 10px", color:"#555" }}>${yr.fcf.toFixed(1)}</td>
                    <td style={{ textAlign:"right", padding:"7px 10px", fontWeight:600, color:"#111" }}>${yr.fcfPS}</td>
                    <td style={{ textAlign:"right", padding:"7px 10px", color:"#888" }}>${yr.div.toFixed(2)}</td>
                    <td style={{ textAlign:"right", padding:"7px 10px", color:"#AAA" }}>{yr.sh.toLocaleString()}</td>
                    <td style={{ textAlign:"right", padding:"7px 10px", fontWeight:600, color:"#555" }}>${yr.cumDiv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* $10k model */}
          <p style={{ fontSize:11, letterSpacing:1, color:"#AAA", textTransform:"uppercase", fontWeight:600, margin:"0 0 12px 0" }}>$10,000 Invested Today</p>
          {(()=>{
            const shares = 10000/CP;
            const divIncome = shares * ad.totDiv;
            const exitVal = shares * ad.tPrice;
            const total = exitVal + divIncome;
            const profit = total - 10000;
            return (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16, marginBottom:28 }}>
                {[
                  { label:"Invested", val:"$10,000", sub:`${shares.toFixed(1)} shares` },
                  { label:"Stock Value (2029)", val:`$${Math.round(exitVal).toLocaleString()}`, sub:`@ $${Math.round(ad.tPrice)}/share` },
                  { label:"Dividends Collected", val:`$${Math.round(divIncome).toLocaleString()}`, sub:"Cash received over 5 years" },
                  { label:"Total Value", val:`$${Math.round(total).toLocaleString()}`, sub:`${profit>0?"+":""}$${Math.round(profit).toLocaleString()} profit` },
                ].map((c,i)=>(
                  <div key={i} style={{ background: i===3 ? "#F5F5F0" : "#FFF", border:"1px solid #E5E5E0", padding:"16px 14px" }}>
                    <p style={{ fontSize:10, letterSpacing:1, color:"#AAA", textTransform:"uppercase", margin:"0 0 8px 0" }}>{c.label}</p>
                    <p style={{ fontSize:22, fontWeight:600, color: i===3 ? (profit>0?"#111":"#C00") : "#111", margin:"0 0 4px 0" }}>{c.val}</p>
                    <p style={{ fontSize:11, color:"#999", margin:0 }}>{c.sub}</p>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Visual bars */}
          <p style={{ fontSize:11, letterSpacing:1, color:"#AAA", textTransform:"uppercase", fontWeight:600, margin:"0 0 12px 0" }}>All Scenarios Compared ($10k invested)</p>
          {scenarios.map(s=>{
            const d = all[s.id];
            const shares = 10000/CP;
            const total = shares * d.tPrice + shares * d.totDiv;
            const maxT = (()=>{ const e=all["bull10"]; return 10000/CP*e.tPrice+10000/CP*e.totDiv; })();
            const w = Math.max(8, total/maxT*100);
            return (
              <div key={s.id} style={{ marginBottom:10, cursor:"pointer" }} onClick={()=>setSel(s.id)}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:12, fontWeight:600, color:s.id===sel?"#111":"#888", width:80 }}>{s.name}</span>
                  <span style={{ fontSize:11, color:"#BBB", width:110 }}>{s.sub}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{
                    height:24, width:`${w}%`,
                    background: s.id===sel ? "#111" : "#CCC",
                    borderRadius:2,
                    display:"flex", alignItems:"center", paddingLeft:8,
                    transition:"all 0.2s",
                    minWidth:70,
                  }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#FFF" }}>${Math.round(total).toLocaleString()}</span>
                  </div>
                  <span style={{ fontSize:12, fontWeight:600, color: d.totRet>0?"#555":"#C00" }}>
                    {d.totRet>0?"+":""}{d.totRet.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom line */}
        <div style={{ borderTop:"2px solid #111", borderBottom:"2px solid #111", padding:"16px 0", marginTop:32, marginBottom:24 }}>
          <p style={{ fontSize:13, color:"#555", lineHeight:1.8, margin:0 }}>
            At $116, the downside in a meaningful gold correction is roughly -18%. The upside in a continued bull ranges from +47% to +630%. Every $1,000/oz gold move translates to approximately $40-50 per share. Risk/reward favors a long position if you believe gold stays above $4,500.
          </p>
        </div>

        <p style={{ fontSize:11, color:"#CCC", fontStyle:"italic" }}>
          For informational and educational purposes only. Not investment advice.
        </p>
      </div>
    </div>
  );
}
