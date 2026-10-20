// Hand-drawn schematic diagrams. Colors come from CSS classes defined in static/css/site.css
// (.dg-*), so they follow the light and dark themes. All are schematics, not to scale.

const sub = (base, s) => `${base}<tspan class="dg-sub" dy="3">${s}</tspan><tspan dy="-3">\u200b</tspan>`;

function honeycomb(x0, x1, y0, y1, step) {
  let d = "";
  for (let x = x0 + step; x < x1; x += step) d += `M${x} ${y0}V${y1}`;
  return `<path class="dg-thin" d="${d}"/>`;
}

const sandwich = `
<svg viewBox="0 0 760 320" role="img" aria-labelledby="dg-sw-t" class="diagram">
  <title id="dg-sw-t">Sandwich coupon in 3-point bend with five failure modes labeled</title>
  <defs>
    <marker id="dg-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="dg-fill-ink"/></marker>
    <marker id="dg-tick" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M5 0V10" class="dg-line"/></marker>
  </defs>
  <!-- applicator -->
  <path class="dg-part" d="M346 96H414V112A34 34 0 0 1 346 112Z"/>
  <path class="dg-line" d="M380 30V92" marker-end="url(#dg-arr)"/>
  <text class="dg-label" x="390" y="44">P</text>
  <!-- skins and core -->
  <rect class="dg-skin" x="80" y="140" width="600" height="10"/>
  <rect class="dg-core" x="80" y="150" width="600" height="58"/>
  ${honeycomb(80, 680, 150, 208, 12)}
  <rect class="dg-skin" x="80" y="208" width="600" height="10"/>
  <!-- supports -->
  <path class="dg-part" d="M120 218L104 244H136Z"/>
  <path class="dg-part" d="M640 218L624 244H656Z"/>
  <!-- span dimension -->
  <path class="dg-line" d="M120 258H640" marker-start="url(#dg-tick)" marker-end="url(#dg-tick)"/>
  <text class="dg-dim" x="380" y="272" text-anchor="middle">L, support span</text>
  <!-- thickness dimension -->
  <path class="dg-line" d="M704 140V218" marker-start="url(#dg-tick)" marker-end="url(#dg-tick)"/>
  <path class="dg-thin" d="M684 140H710M684 218H710"/>
  <text class="dg-dim" x="714" y="183">d</text>
  <!-- failure callouts -->
  <g class="dg-call">
    <circle cx="290" cy="145" r="4"/><path d="M290 145L200 86H90"/>
    <circle cx="380" cy="154" r="4"/><path d="M380 154L470 86H600"/>
    <path class="dg-wave" d="M540 140q6 -7 12 0t12 0t12 0"/><path d="M560 136L616 112H740"/>
    <path d="M212 152L248 206" class="dg-dash"/><path d="M230 180L170 300H90"/>
    <circle cx="480" cy="213" r="4"/><path d="M480 213L520 300H600"/>
  </g>
  <text class="dg-label" x="90" y="80">Top skin compression</text>
  <text class="dg-note" x="90" y="98">CLT, ply by ply</text>
  <text class="dg-label" x="470" y="80">Local core crush</text>
  <text class="dg-note" x="470" y="98">under the applicator</text>
  <text class="dg-label" x="616" y="106">Skin wrinkling</text>
  <text class="dg-note" x="616" y="130">${sub("σ", "wr")} = k(${sub("E", "f")}${sub("E", "c")}${sub("G", "c")})<tspan dy="-6" class="dg-sub">1/3</tspan></text>
  <text class="dg-label" x="90" y="294">Core shear</text>
  <text class="dg-note" x="90" y="314">${sub("P", "shear")} = 2wd${sub("τ", "core")}</text>
  <text class="dg-label" x="520" y="294">Bottom skin tension</text>
</svg>`;

const vartm = `
<svg viewBox="0 0 820 282" role="img" aria-labelledby="dg-vt-t" class="diagram">
  <title id="dg-vt-t">Cross-section of a VARTM layup: mold plate, dry carbon fiber, peel ply, flow media, vacuum bag, resin inlet and vacuum outlet</title>
  <defs>
    <marker id="dg-arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-fill-accent"/></marker>
    <pattern id="dg-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V8" class="dg-thin"/></pattern>
  </defs>
  <rect class="dg-part" x="40" y="196" width="580" height="22"/>
  <rect x="40" y="196" width="580" height="22" fill="url(#dg-hatch)"/>
  <rect class="dg-skin" x="140" y="176" width="420" height="20"/>
  <rect class="dg-ply" x="132" y="170" width="436" height="6"/>
  <rect class="dg-media" x="132" y="162" width="380" height="8"/>
  <rect class="dg-tape" x="56" y="186" width="16" height="10"/>
  <rect class="dg-tape" x="588" y="186" width="16" height="10"/>
  <path class="dg-bag" d="M64 186C70 150 110 150 132 152H568C590 150 596 150 596 186"/>
  <!-- inlet and outlet -->
  <path class="dg-tube" d="M150 40V160"/>
  <path class="dg-tube" d="M550 40V168"/>
  <text class="dg-label" x="150" y="28" text-anchor="middle">Resin inlet</text>
  <text class="dg-note" x="150" y="54" dx="12">catalyzed resin</text>
  <text class="dg-label" x="550" y="28" text-anchor="middle">To vacuum pump</text>
  <path class="dg-flow" d="M190 112H500" marker-end="url(#dg-arr2)"/>
  <text class="dg-accent-text" x="345" y="102" text-anchor="middle">resin flow</text>
  <!-- layer callouts -->
  <g class="dg-thin">
    <path d="M592 152L650 70H664"/><path d="M512 166L650 104H664"/>
    <path d="M568 173L650 138H664"/><path d="M560 186L650 172H664"/><path d="M620 207L650 206H664"/>
  </g>
  <text class="dg-label" x="670" y="74">Vacuum bag</text>
  <text class="dg-label" x="670" y="108">Flow media</text>
  <text class="dg-label" x="670" y="142">Peel ply</text>
  <text class="dg-label" x="670" y="176">Dry carbon fiber</text>
  <text class="dg-label" x="670" y="210">Mold plate</text>
  <text class="dg-label" x="64" y="240">Sealant tape</text>
  <path class="dg-thin" d="M64 196V226"/>
  <text class="dg-note" x="340" y="272" text-anchor="middle">Cure starts at 70 °C, from a local heat source or by holding the whole part in an oven</text>
</svg>`;

function spider(cx, cy) {
  const nodes = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    nodes.push([cx + 62 * Math.cos(a), cy + 15 * Math.sin(a)]);
  }
  const legs = nodes.map(([x, y]) => `M${cx} ${cy}L${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  const dots = nodes.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"/>`).join("");
  return `<path class="dg-spider" d="${legs}"/><ellipse class="dg-dash" cx="${cx}" cy="${cy}" rx="34" ry="8"/><g class="dg-node">${dots}<circle cx="${cx}" cy="${cy}" r="4"/></g>`;
}

function plate(y) {
  let ticks = "";
  for (let x = 60; x <= 440; x += 30) if (Math.abs(x - 250) > 70) ticks += `<circle cx="${x}" cy="${y}" r="2.5"/>`;
  return `<path class="dg-shell" d="M40 ${y}H460"/><g class="dg-node">${ticks}</g>`;
}

const fastener = `
<svg viewBox="0 0 780 300" role="img" aria-labelledby="dg-fs-t" class="diagram">
  <title id="dg-fs-t">Two shell plates joined by a CBUSH spring element, each end connected to the plate through a spider of RBE2 or RBE3 legs, and a spring model of bolt and member stiffness</title>
  <defs>
    <marker id="dg-arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-fill-ink"/></marker>
  </defs>
  ${plate(80)}
  ${plate(220)}
  ${spider(250, 80)}
  ${spider(250, 220)}
  <path class="dg-spring" d="M250 84V112l12 6l-24 12l24 12l-24 12l24 12l-24 12l12 6V216"/>
  <g class="dg-call"><path d="M262 150H330"/><path d="M314 84L340 46H360"/></g>
  <text class="dg-accent-text" x="336" y="146">CBUSH shank</text>
  <text class="dg-note" x="336" y="164">stiffness from the workbook</text>
  <text class="dg-accent-text" x="364" y="42">Spider to the plate</text>
  <text class="dg-note" x="364" y="60">RBE2 too stiff, RBE3 too soft</text>
  <text class="dg-label" x="40" y="66">Plate 1, shell mesh</text>
  <text class="dg-label" x="40" y="250">Plate 2, shell mesh</text>
  <!-- spring model -->
  <path class="dg-sep" d="M510 30V280"/>
  <text class="dg-label" x="540" y="22">Joint as two springs</text>
  <rect class="dg-part" x="550" y="70" width="190" height="10"/>
  <rect class="dg-part" x="550" y="210" width="190" height="10"/>
  <path class="dg-spring" d="M600 80V100l12 6l-24 12l24 12l-24 12l24 12l-24 12l12 6V210"/>
  <path class="dg-spring" d="M690 80V100l12 6l-24 12l24 12l-24 12l24 12l-24 12l12 6V210"/>
  <text class="dg-label" x="560" y="150">${sub("k", "b")}</text>
  <text class="dg-label" x="710" y="150">${sub("k", "m")}</text>
  <path class="dg-line" d="M645 224V250" marker-end="url(#dg-arr3)"/>
  <path class="dg-line" d="M645 68V42" marker-end="url(#dg-arr3)"/><text class="dg-note" x="655" y="52">${sub("F", "ext")}</text>
  <text class="dg-note" x="655" y="264">${sub("F", "ext")}</text>
  <text class="dg-note" x="540" y="290">${sub("F", "b")} = ${sub("F", "i")} + ${sub("k", "b")}/(${sub("k", "b")}+${sub("k", "m")}) ${sub("F", "ext")}</text>
</svg>`;

export const diagrams = { sandwich, vartm, fastener };
