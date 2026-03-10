const years = ["2024A","2025E","2026E","2027E","2028E","2029E"];
const revenue =    [18.68,24.50,30.00,31.50,32.50,33.50];
const ebitdaM =    [46.6,48.0,50.0,50.0,49.0,49.0];
const ebitda =     [8.70,11.76,15.00,15.75,15.93,16.42];
const dna =        [3.00,3.00,3.00,3.00,3.00,3.00];
const ebit =       [5.70,8.76,12.00,12.75,12.93,13.42];
const nopat =      ebit.map(e=>(e*0.70).toFixed(2));
const capex =      [3.40,3.10,3.20,3.30,3.30,3.40];
const fcf =        [2.96,6.03,8.20,8.63,8.75,8.99];
const goldP =      ["$2,408","$3,800","$5,000","$5,200","$5,300","$5,400"];
const W=0.077;
const pf=[1,2,3,4,5].map(n=>Math.pow(1+W,n));
const pvF=[6.03,8.20,8.63,8.75,8.99].map((f,i)=>f/pf[i]);
const sP=pvF.reduce((a,b)=>a+b,0);
const tvE=10*ebitda[5], tvP=(fcf[5]*1.025)/(W-0.025);
const pvE=tvE/pf[4], pvP=tvP/pf[4];
const evE=sP+pvE, evP=sP+pvP;
const eqE=evE+0.8, eqP=evP+0.8;
const pE=eqE/1097*1000, pP=eqP/1097*1000, pB=(pE+pP)/2;
const wA=[6.7,7.0,7.4,7.7,8.0,8.4], gA=[1.5,2.0,2.5,3.0,3.5];
function cSP(w,g){const wd=w/100,gd=g/100;const p=[6.03,8.20,8.63,8.75,8.99].map((f,i)=>f/Math.pow(1+wd,i+1));const s=p.reduce((a,b)=>a+b,0);const t=(8.99*(1+gd))/(wd-gd);return Math.round((s+t/Math.pow(1+wd,5)+0.8)/1097*1000);}
const mx=gA.map(g=>wA.map(w=>cSP(w,g)));

const font = "'Inter', -apple-system, sans-serif";
const serif = "'Georgia', 'Times New Roman', serif";

function T({headers, rows, compact}) {
  return (
    <div style={{overflowX:"auto",marginBottom:24}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:compact?12:13,fontFamily:font}}>
        <thead>
          <tr style={{borderBottom:"2px solid #333"}}>
            {headers.map((h,i)=>(
              <th key={i} style={{padding:"8px 10px",color:"#333",fontWeight:600,textAlign:i===0?"left":"right",fontSize:11,letterSpacing:0.5,textTransform:"uppercase"}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,ri)=>(
            <tr key={ri} style={{borderBottom:"1px solid #E5E5E0",background:r.em?"#F5F5F0":undefined}}>
              {r.c.map((c,ci)=>(
                <td key={ci} style={{padding:"7px 10px",textAlign:ci===0?"left":"right",color:r.em?"#111":"#555",fontWeight:r.em?600:400,fontSize:compact?12:13}}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({n, title, children}){
  return (
    <div style={{marginBottom:48}}>
      <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:16,borderBottom:"1px solid #DDD",paddingBottom:8}}>
        <span style={{fontSize:13,color:"#AAA",fontFamily:font,fontWeight:600}}>{n}</span>
        <h2 style={{fontSize:22,fontWeight:400,color:"#111",margin:0,fontFamily:serif}}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function P({children}){return <p style={{fontSize:14,lineHeight:1.8,color:"#666",margin:"0 0 14px 0",fontFamily:font,fontWeight:400}}>{children}</p>;}
function Sub({children}){return <p style={{fontSize:12,fontWeight:600,color:"#999",textTransform:"uppercase",letterSpacing:1,margin:"20px 0 8px 0",fontFamily:font}}>{children}</p>;}

export default function DCFMemo(){
  return (
    <div style={{background:"#FAFAF8",minHeight:"100vh",fontFamily:serif}}>
      <div style={{maxWidth:780,margin:"0 auto",padding:"48px 24px"}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:48}}>
          <p style={{fontSize:11,letterSpacing:4,color:"#AAA",textTransform:"uppercase",fontFamily:font,marginBottom:20}}>Confidential</p>
          <h1 style={{fontSize:36,fontWeight:400,color:"#111",margin:"0 0 6px 0",letterSpacing:-0.3}}>Newmont Corporation</h1>
          <p style={{fontSize:15,color:"#888",fontStyle:"italic",margin:"0 0 4px 0"}}>Discounted Cash Flow Valuation</p>
          <p style={{fontSize:12,color:"#BBB",fontFamily:font,margin:0}}>March 10, 2026 &nbsp;&middot;&nbsp; NYSE: NEM &nbsp;&middot;&nbsp; $116.29</p>
        </div>

        {/* Verdict */}
        <div style={{borderTop:"2px solid #111",borderBottom:"2px solid #111",padding:"16px 0",textAlign:"center",marginBottom:48}}>
          <p style={{fontSize:11,letterSpacing:3,color:"#999",textTransform:"uppercase",fontFamily:font,margin:"0 0 6px 0"}}>Verdict</p>
          <p style={{fontSize:20,fontWeight:400,color:"#111",margin:"0 0 4px 0"}}>Moderately Undervalued</p>
          <p style={{fontSize:13,color:"#888",fontFamily:font,margin:0}}>Fair Value ~$137 &nbsp;&middot;&nbsp; Current $116.29 &nbsp;&middot;&nbsp; ~18% upside</p>
        </div>

        {/* Layman */}
        <Section n="" title="What This Means in Plain English">
          <P>Newmont is the world's largest gold miner. It produces roughly 5.6 million ounces of gold a year from mines across five continents and sits on 134 million ounces of gold reserves, enough to sustain production for over two decades.</P>
          <P>Gold has been on an extraordinary run. It started 2024 around $2,000 per ounce and now trades above $5,100. That surge has transformed Newmont's economics. The company's cost to mine an ounce of gold is about $1,620. When gold sells for $5,100, the profit margin on every single ounce is roughly $3,480. That is an immensely profitable business.</P>
          <P>So why might the stock still be undervalued? The stock has roughly tripled from its 2024 lows, which makes some investors nervous about chasing it. Gold miners historically trade at a discount to the value of their underlying gold because of operational risks and the cyclical nature of commodity prices. Many investors are still catching up to the new gold price reality and what it means for cash flows.</P>
          <P>Our model suggests the stock is worth about $137 per share, roughly 18% above where it trades today. The thesis depends on one big variable. If gold stays above $4,500 per ounce, Newmont will be a cash flow machine. If gold retraces below $3,000, the math changes dramatically.</P>
          <P>You are fundamentally making a bet on the gold price staying elevated. If you believe in the structural bull case for gold, Newmont is the highest-quality vehicle to express that view.</P>
        </Section>

        <Section n="01" title="Company Overview">
          <P>Newmont Corporation is the world's leading gold producer and the only gold miner in the S&P 500. Following the 2023 acquisition of Newcrest Mining, the company divested six non-core assets and consolidated around a Tier 1 portfolio of eleven managed operations and three non-managed joint ventures.</P>
          <T headers={["Metric","FY2024","FY2025 Guidance"]} rows={[
            {c:["Gold Production (M oz)","6.8","5.9"]},
            {c:["Avg Realized Gold Price","$2,408/oz","~$3,800/oz"]},
            {c:["AISC","$1,444/oz","$1,620/oz"]},
            {c:["Revenue","$18.68B","~$24.5B"]},
            {c:["Adj. EBITDA","$8.7B","~$11.8B"]},
            {c:["Free Cash Flow","$2.96B","~$6.0B"],em:true},
            {c:["Gold Reserves","134M oz","134M oz"]},
          ]} />
        </Section>

        <Section n="02" title="Revenue Projection">
          <P>Revenue is projected on stable Tier 1 gold production of ~5.6M oz/year, combined with institutional gold price consensus. J.P. Morgan forecasts ~$5,000/oz by Q4 2026. UBS targets $5,000/oz. Goldman Sachs projects $5,000 by 2027. Other metals revenue (copper, silver, zinc, lead) grows 3-5% annually.</P>
          <Sub>Gold Price Assumptions ($/oz)</Sub>
          <T headers={years} rows={[{c:goldP,em:true}]} compact />
          <Sub>Revenue Build ($B)</Sub>
          <T headers={["","2025E","2026E","2027E","2028E","2029E"]} rows={[
            {c:["Revenue","$24.5","$30.0","$31.5","$32.5","$33.5"],em:true},
            {c:["YoY Growth","31.2%","22.4%","5.0%","3.2%","3.1%"]},
            {c:["Gold Revenue","$21.3","$26.3","$27.4","$27.9","$28.5"]},
            {c:["Other Metals","$3.2","$3.7","$4.1","$4.6","$5.0"]},
          ]} />
        </Section>

        <Section n="03" title="Operating Margins">
          <P>EBITDA margin expanded to 46.6% in 2024 as gold prices rose while costs stayed anchored. Q3 2025 operating margin reached 45.8%. We project EBITDA margins stabilizing at 49-50%, reflecting the favorable gold price environment partially offset by ~3% annual cost escalation, higher royalties, and elevated sustaining capital.</P>
          <T headers={["",...years]} rows={[
            {c:["Revenue ($B)",...revenue.map(r=>`$${r.toFixed(1)}`)]},
            {c:["EBITDA ($B)",...ebitda.map(e=>`$${e.toFixed(2)}`)]},
            {c:["EBITDA Margin",...ebitdaM.map(m=>`${m.toFixed(1)}%`)],em:true},
            {c:["D&A ($B)",...dna.map(d=>`$${d.toFixed(1)}`)]},
            {c:["EBIT ($B)",...ebit.map(e=>`$${e.toFixed(2)}`)]},
            {c:["EBIT Margin",...revenue.map((r,i)=>`${(ebit[i]/r*100).toFixed(1)}%`)],em:true},
          ]} />
        </Section>

        <Section n="04" title="Free Cash Flow">
          <P>FCF derived from NOPAT plus depreciation less capex. 30% blended tax rate. Capital expenditure guided at ~$3.1B for 2025 (sustaining $1.8B + development $1.3B), growing modestly as the company invests in Cerro Negro ($800M), Cadia, Tanami, and other Tier 1 sites.</P>
          <T headers={["($B)",...years]} rows={[
            {c:["EBIT",...ebit.map(e=>`$${e.toFixed(2)}`)]},
            {c:["Tax @ 30%",...ebit.map(e=>`(${(e*0.30).toFixed(2)})`)]},
            {c:["NOPAT",...nopat.map(n=>`$${n}`)]},
            {c:["+ D&A",...dna.map(d=>`$${d.toFixed(2)}`)]},
            {c:["- Capex",...capex.map(c=>`(${c.toFixed(2)})`)]},
            {c:["Free Cash Flow",...fcf.map(f=>`$${f.toFixed(2)}`)],em:true},
            {c:["FCF Margin",...revenue.map((r,i)=>`${(fcf[i]/r*100).toFixed(1)}%`)],em:true},
          ]} />
        </Section>

        <Section n="05" title="Cost of Capital">
          <P>WACC estimated at 7.7%. Cost of equity via CAPM with 4.1% risk-free rate, 5.5% equity risk premium, and beta of 0.69. Low beta reflects gold's safe-haven diversification properties. Low leverage (net debt/EBITDA 0.6x) means equity dominates the capital structure at 96%.</P>
          <T headers={["Component","Value"]} rows={[
            {c:["Risk-Free Rate","4.10%"]},
            {c:["Equity Risk Premium","5.50%"]},
            {c:["Beta","0.69"]},
            {c:["Cost of Equity","7.90%"]},
            {c:["After-Tax Cost of Debt","3.15%"]},
            {c:["Equity / Debt Weight","96.1% / 3.9%"]},
            {c:["WACC","7.7%"],em:true},
          ]} />
        </Section>

        <Section n="06" title="Terminal Value">
          <P>Computed via two methods, weighted equally. Exit multiple of 10.0x EV/EBITDA (large-cap gold miner average). Perpetuity growth of 2.5% (long-run gold appreciation in line with inflation).</P>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
            {[
              {title:"Exit Multiple",items:[["2029E EBITDA",`$${ebitda[5].toFixed(2)}B`],["Multiple","10.0x"],["Terminal Value",`$${tvE.toFixed(1)}B`],["PV",`$${pvE.toFixed(1)}B`]]},
              {title:"Perpetuity Growth",items:[["2029E FCF",`$${fcf[5].toFixed(2)}B`],["Growth Rate","2.5%"],["Terminal Value",`$${tvP.toFixed(1)}B`],["PV",`$${pvP.toFixed(1)}B`]]},
            ].map(col=>(
              <div key={col.title} style={{background:"#FFF",border:"1px solid #E5E5E0",padding:20}}>
                <p style={{fontSize:11,fontWeight:600,letterSpacing:1,color:"#999",textTransform:"uppercase",margin:"0 0 12px 0",fontFamily:font}}>{col.title}</p>
                {col.items.map(([l,v],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #F0F0EC",fontFamily:font,fontSize:13}}>
                    <span style={{color:"#888"}}>{l}</span>
                    <span style={{color:i>=2?"#111":"#555",fontWeight:i>=2?600:400}}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Section>

        <Section n="07" title="Valuation Bridge">
          <T headers={["","Exit Multiple","Perpetuity Growth"]} rows={[
            {c:["PV of FCFs (Yr 1-5)",`$${sP.toFixed(1)}B`,`$${sP.toFixed(1)}B`]},
            {c:["PV of Terminal Value",`$${pvE.toFixed(1)}B`,`$${pvP.toFixed(1)}B`]},
            {c:["Enterprise Value",`$${evE.toFixed(1)}B`,`$${evP.toFixed(1)}B`]},
            {c:["Net Cash","+$0.8B","+$0.8B"]},
            {c:["Equity Value",`$${eqE.toFixed(1)}B`,`$${eqP.toFixed(1)}B`]},
            {c:["Shares Outstanding","1,097M","1,097M"]},
            {c:["Implied Price",`$${Math.round(pE)}`,`$${Math.round(pP)}`],em:true},
          ]} />
          <div style={{borderTop:"2px solid #111",borderBottom:"2px solid #111",padding:"12px 0",textAlign:"center",marginBottom:24}}>
            <span style={{fontSize:16,color:"#111",fontFamily:font,fontWeight:600}}>Blended Fair Value: ~${Math.round(pB)} per share</span>
          </div>
        </Section>

        <Section n="08" title="Sensitivity Analysis">
          <P>Implied share price at various WACC and terminal growth rate combinations. Base case (7.7% / 2.5%) in bold.</P>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,fontFamily:font,marginBottom:24}}>
              <thead>
                <tr style={{borderBottom:"2px solid #333"}}>
                  <th style={{padding:"8px 10px",textAlign:"left",fontSize:11,letterSpacing:0.5,color:"#999"}}>WACC \ g</th>
                  {wA.map(w=><th key={w} style={{padding:"8px 10px",textAlign:"right",fontSize:11,color:"#999"}}>{w.toFixed(1)}%</th>)}
                </tr>
              </thead>
              <tbody>
                {gA.map((g,gi)=>(
                  <tr key={g} style={{borderBottom:"1px solid #E5E5E0"}}>
                    <td style={{padding:"7px 10px",fontWeight:600,color:"#555"}}>{g.toFixed(1)}%</td>
                    {wA.map((w,wi)=>{
                      const base = g===2.5 && w===7.7;
                      return <td key={w} style={{padding:"7px 10px",textAlign:"right",fontWeight:base?700:400,color:base?"#111":"#666",background:base?"#F5F5F0":undefined}}>${mx[gi][wi]}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P><em>Range: ${Math.min(...mx.flat())} to ${Math.max(...mx.flat())} per share.</em></P>
        </Section>

        <Section n="09" title="Market Comparison">
          <T headers={["","Value"]} rows={[
            {c:["Current Price","$116.29"]},
            {c:["DCF (Exit Multiple)",`$${Math.round(pE)}`]},
            {c:["DCF (Perpetuity Growth)",`$${Math.round(pP)}`]},
            {c:["Blended Fair Value",`$${Math.round(pB)}`],em:true},
            {c:["Implied Upside",`${((pB/116.29-1)*100).toFixed(1)}%`],em:true},
            {c:["Analyst Consensus","$133 - $140"]},
            {c:["52-Week Range","$42.03 - $134.88"]},
          ]} />
          <P>Our fair value aligns with the Street consensus of $133-$140. Recent upgrades from Citi ($150), BofA ($151), and Bernstein (Outperform). J.P. Morgan initiated Overweight. 18/18 analysts rate Buy.</P>
        </Section>

        <Section n="10" title="Key Risks">
          {[
            ["Gold Price","The dominant variable. Every $100/oz move = ~$560M revenue, ~$390M FCF. A sustained $3,500 gold price = ~$80 fair value. $6,000 gold = $170+."],
            ["Cost Inflation","Mining costs face pressure on diesel, labor, explosives. A move in AISC to $2,000/oz (from $1,620) would reduce FCF by ~$2.1B annually."],
            ["Geopolitical Risk","Operations in PNG, Ghana, Suriname, Argentina, Peru. The $800M Cerro Negro commitment is meaningful exposure to Argentine policy volatility."],
            ["Production Risk","Stable 5.6M oz/year assumed. The 2023 Penasquito strike is a reminder that targets are not guaranteed."],
            ["Terminal Value","Represents >75% of EV. A 1-point WACC change swings fair value by ~$30/share."],
            ["Buyback Pace","$3B authorization, $1.2B used. Pace at elevated prices affects per-share value. Not modeled."],
          ].map(([t,d],i)=>(
            <div key={i} style={{marginBottom:16}}>
              <p style={{fontSize:13,fontWeight:600,color:"#333",margin:"0 0 4px 0",fontFamily:font}}>{t}</p>
              <p style={{fontSize:13,color:"#888",lineHeight:1.65,margin:0,fontFamily:font}}>{d}</p>
            </div>
          ))}
        </Section>

        {/* Disclaimer */}
        <div style={{borderTop:"1px solid #DDD",paddingTop:20,marginTop:20}}>
          <p style={{fontSize:11,color:"#BBB",lineHeight:1.7,fontFamily:font,fontStyle:"italic"}}>
            This memorandum is for informational and educational purposes only. It does not constitute investment advice. All projections are inherently uncertain. Consult a qualified professional before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
