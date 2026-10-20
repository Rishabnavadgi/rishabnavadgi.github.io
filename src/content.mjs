// All site copy and project data lives here. Edit this file, then run `npm run build`.
//
// Block types used inside case-study sections:
//   { p: "html" }                                  paragraph (inline HTML allowed)
//   { list: ["html", ...] }                        bullet list
//   { math: "LaTeX" }                              display equation (MathJax)
//   { figure: { src, alt, caption, w, h, wide } }  authentic image
//   { diagram: "key", caption }                    schematic from src/diagrams.mjs
//   { placeholder: "what is missing", note }       visible gap to fill (hidden with HIDE_PLACEHOLDERS=1)
//   { table: { caption, head: [], rows: [[]], note, numeric: [colIdx] } }
//   { status: [[state, item], ...] }               done / active / planned tracker
//   { figs: [block, block] }                       two figures side by side

export const site = {
  name: "Rishab Navadgi",
  // Replace with the real domain once deployed (used for canonical and Open Graph tags).
  url: "https://rishabnavadgi.github.io/",
  title: "Rishab Navadgi | Composite Structures and Aerospace Design",
  description:
    "Engineering portfolio of Rishab Navadgi, Materials Science and Engineering at UIUC. Composite sandwich structures, rapid-cure carbon fiber manufacturing, and bolted joint modeling for satellite FEA.",
  email: "rishab.navadgi@gmail.com",
  linkedin: "https://www.linkedin.com/in/rishab-navadgi-718ba829a/",
  github: "https://github.com/Rishabnavadgi",
  resume: "assets/Rishab_Navadgi_Resume.pdf",
  location: "Urbana-Champaign, IL",
  degree: "B.S. Materials Science and Engineering",
  school: "University of Illinois Urbana-Champaign",
  grad: "Expected Dec 2029",
};

export const hero = {
  eyebrow: "Materials Science and Engineering · UIUC",
  lines: ["Composite structures", "Aerospace design", "Structural analysis"],
  intro:
    "I'm a sophomore in Materials Science and Engineering at the University of Illinois. I size and build carbon fiber structures for a Formula SAE electric car, and I build the analysis tools a satellite structures team uses for its bolted joints.",
  image: {
    src: "assets/img/lassi-satellite-cad-iso.png",
    alt: "Isometric CAD view of a small satellite with deployed solar panels and antennas",
    w: 1236,
    h: 950,
  },
  sheet: [
    ["Title", "Satellite structure, CAD"],
    ["Org", "LASSI, UIUC"],
    ["Tool", "Siemens NX"],
    ["Sheet", "01 of 07"],
  ],
  roles: [
    ["Illini Electric Motorsports", "Front Impact Structures lead"],
    ["Laboratory for Advanced Space Systems at Illinois", "Structures team"],
  ],
};

export const projects = [
  // ─────────────────────────────────────────────────────────────── AIP
  {
    id: "aip",
    featured: true,
    code: "IEM-01",
    title: "Composite anti-intrusion plate",
    summary:
      "Merging the aluminum anti-intrusion plate into the carbon fiber front bulkhead as one sandwich structure, sized with laminate theory and a ply-schedule search script.",
    org: "Illini Electric Motorsports (Formula SAE Electric)",
    role: "Front Impact Structures lead, chassis team",
    period: "Aug 2025 - Present",
    tools: ["Python", "Classical Laminate Theory", "Sandwich beam theory", "FSAE SES"],
    status: ["active", "Sizing done · coupons next"],
    facts: [
      ["Load case", "120 kN over 200 × 100 mm"],
      ["Baseline", "3.60 lb aluminum plate"],
      ["Projected saving", "2 lb, about 10%"],
    ],
    cover: { src: "assets/img/aip-2024-aluminum.jpg", alt: "The 2024-25 aluminum anti-intrusion plate bolted behind an aluminum honeycomb impact attenuator", w: 351, h: 376 },
    sections: {
      overview: [
        { p: "The anti-intrusion plate (AIP) sits between the impact attenuator and the front bulkhead. It keeps the attenuator out of the cockpit in a frontal crash and spreads the load into the bulkhead. Our 2024-25 car used a separate aluminum plate that weighs 3.60 lb." },
        { p: "The goal is to combine the AIP and front bulkhead into one carbon fiber sandwich structure while keeping equivalency in the FSAE Structural Equivalency Spreadsheet (SES). The combined part is projected to save about 2 lb, roughly 10% of the front impact structure mass. That number is a projection until a passing layup is built and weighed." },
      ],
      contribution: [
        { list: [
          "Lead the front impact structures project on the chassis team.",
          "Set up the sizing method and wrote the Python script that searches ply schedules.",
          "Running the SES equivalency case from tested laminate data.",
          "Running a material trade study for front impact protection, comparing carbon fiber laminates against steel and aluminum on mass, structural equivalency, cost, and manufacturability.",
        ] },
      ],
      challenge: [
        { p: "The rules require that the AIP not fail under a 120 kN static load applied over a 200 mm × 100 mm patch, with a safety factor of at least 1.00. A composite AIP proves this in the SES through tested 3-point bend and perimeter shear coupons, scaled to the real panel." },
        { p: "A sandwich panel can fail several ways, so the lightest layup is the one that clears all of them at once." },
        { diagram: "sandwich", caption: "Sandwich panel failure modes checked in sizing, shown on a 3-point bend coupon. Schematic, not to scale." },
      ],
      approach: [
        { p: "I modeled the AIP as a sandwich beam. The skins carry bending and the core carries shear. Skin failure comes from Classical Laminate Theory, where the stress in each ply is compared against that ply's strength. Core shear failure load and skin wrinkling stress come from sandwich beam theory." },
        { math: "P_{\\text{shear}} = 2\\,w\\,d\\,\\tau_{\\text{core}}" },
        { math: "\\sigma_{\\text{wr}} = k\\left(E_f\\,E_c\\,G_c\\right)^{1/3}" },
        { p: "Here \\(w\\) is coupon width, \\(d\\) the distance between skin centroids, \\(\\tau_{\\text{core}}\\) the core shear strength, and \\(E_f\\), \\(E_c\\), \\(G_c\\) the face modulus, core modulus, and core shear modulus." },
        { p: "To find candidate layups I wrote a Python script that generates every ply schedule allowed by the inputs and analyzes each one as a beam in 3-point bend. It reports bending stiffness, failure load, the governing mode, and a scaled AIP safety factor, then ranks the schedules." },
      ],
      evidence: [
        { p: "I first ran the SES with previously tested samples. Meeting equivalency took 30 total plies. That layup had a 70% margin in perimeter shear and a 1.8% margin in bending, so 3-point bend governs the design." },
        { figs: [
          { figure: { src: "assets/img/aip-ses-baseline.png", alt: "SES Composite Anti Intrusion tab showing 3-point and shear equivalence with a bending safety factor of 101.8% and perimeter shear safety factor of 170%", caption: "SES result from previously tested samples. Bending safety factor 101.8%, perimeter shear 170.0%.", w: 865, h: 754 } },
          { table: {
            caption: "Key SES values for the baseline layup",
            head: ["Quantity", "Value"],
            numeric: [1],
            rows: [
              ["Core thickness", "1.00 in"],
              ["Each skin (5 layup repeats)", "0.115 in"],
              ["Panel thickness", "1.23 in"],
              ["Panel height × width", "13.5 × 11.5 in"],
              ["Max bending stress, horizontal", "3.45 × 10⁴ psi"],
              ["Ultimate tensile strength", "3.51 × 10⁴ psi"],
              ["Safety factor, bending", "101.8%"],
              ["Perimeter shear stress at 120 kN", "9.93 × 10³ psi"],
              ["Safety factor, perimeter shear", "170.0%"],
            ],
          } },
        ] },
        { table: {
          caption: "Top three ply schedules from the script, 6 plies per skin. Ply notation as output by the script.",
          head: ["#", "Top face (outer → core)", "EI (N·m²)", "Failure load (kN)", "Governing mode", "Core shear limit (kN)", "AIP safety factor"],
          numeric: [0, 2, 3, 5, 6],
          rows: [
            ["1", "[0 0U 0 0U 0 0]", "4888", "31.09", "Face, fiber compression", "40.5", "0.90"],
            ["2", "[0 0U 0 0 0U 0]", "4872", "30.99", "Face, fiber compression", "40.5", "0.90"],
            ["3", "[0 0 0U 0 0U 0]", "4857", "30.89", "Face, fiber compression", "40.5", "0.90"],
          ],
          note: "The next seven schedules fall to a safety factor of 0.84 to 0.86 with the same governing mode.",
        } },
        { figure: { src: "assets/img/aip-2024-aluminum.jpg", alt: "Aluminum anti-intrusion plate with aluminum honeycomb impact attenuator mounted in front", caption: "Baseline. The 2024-25 aluminum AIP and honeycomb impact attenuator.", w: 351, h: 376 } },
        { placeholder: "Photo of the 3-point bend fixture or a tested coupon", note: "A failed coupon showing top-skin compression would back up the governing mode in the table." },
        { placeholder: "Load-displacement curves from the new coupons", note: "Add once the two best schedules are tested." },
      ],
      outcome: [
        { p: "Bending governs this design, not perimeter shear. With 6 plies per skin, the best schedules fail near 31 kN by fiber compression in the top skin, well below the 40.5 kN core shear limit. Their scaled AIP safety factor is 0.90, so the layup has to be scaled up before it passes." },
      ],
      next: [
        { status: [
          ["done", "Sizing method and ply-schedule search script"],
          ["done", "Baseline SES case from previously tested samples"],
          ["active", "Lay up 3-point bend and perimeter shear coupons for the two best schedules"],
          ["planned", "Enter results in the SES and scale until equivalency is met, then pick the lightest passing layup"],
          ["planned", "Extend the script to rank schedules on perimeter shear as well as 3-point bend"],
        ] },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────── RESIN
  {
    id: "resin",
    featured: true,
    code: "IEM-02",
    title: "Rapid-cure carbon fiber parts",
    summary:
      "Building carbon fiber parts with a frontal-polymerization resin from an on-campus lab, and writing the process that took cures from hours to under 30 minutes.",
    org: "Illini Electric Motorsports, with an on-campus research lab",
    role: "Manufacturing lead on a 5-person project",
    period: "2025 - 2026",
    tools: ["VARTM", "FROMP resin", "Dry carbon fiber", "SOP writing"],
    status: ["done", "Parts ran on the 2026 car"],
    facts: [
      ["Cure time", "Hours → under 30 min"],
      ["Process", "VARTM, oven initiation at 70 °C"],
      ["Delivered", "Electronics enclosures"],
    ],
    cover: { src: "assets/img/resin-initiation.jpg", alt: "Gloved hand holding a vial of amber resin as a soldering iron starts a curing front", w: 605, h: 643 },
    sections: {
      overview: [
        { p: "Standard epoxy for carbon fiber parts often takes hours to cure in an oven. A research lab on campus developed a resin that cures by Frontal Ring-Opening Metathesis Polymerization (FROMP). Once one spot reaches the initiation temperature, a reaction front travels through the part and cures it in minutes." },
        { p: "The project scope was to test this resin on non-structural parts for our car and make sure we could produce them reliably with few defects, meaning dry spots and resin voids." },
      ],
      contribution: [
        { list: [
          "Oversaw the manufacturing scope for the 5-person team, covering layups, infusion setup, and process control.",
          "Developed VARTM procedures for this resin with dry carbon fiber.",
          "Diagnosed incomplete cures and moved initiation from a local heat source to the oven.",
          "Wrote the SOPs for catalyst ratio handling, infusion setup, front initiation, and cure verification.",
        ] },
      ],
      challenge: [
        { p: "The resin is mixed with a catalyst to speed up the reaction, so working time and mixing ratio had to be controlled closely through every infusion." },
        { p: "On larger parts with complex geometry, a local heat source started a front that did not travel all the way through the part, leaving uncured regions." },
      ],
      approach: [
        { p: "We used Vacuum-Assisted Resin Transfer Molding (VARTM). Dry carbon fiber is sealed under a vacuum bag on a mold, and the vacuum pulls liquid resin through the fiber." },
        { diagram: "vartm", caption: "VARTM layup stack used for the infusions. Schematic, not to scale." },
        { p: "We first started the front with a soldering iron at one point. For larger parts I switched to curing in an oven held at the 70 °C initiation temperature, so the whole part reached initiation evenly and cured evenly." },
      ],
      evidence: [
        { figs: [
          { figure: { src: "assets/img/resin-initiation.jpg", alt: "Soldering iron touching a vial of resin to start the front", caption: "Starting a front with a local heat source.", w: 605, h: 643 } },
          { figure: { src: "assets/img/resin-front.jpg", alt: "Vial of resin with a visible cured region moving through the liquid", caption: "The front traveling through the sample after initiation.", w: 579, h: 643 } },
        ] },
        { figs: [
          { figure: { src: "assets/img/resin-layup-peel-ply.jpg", alt: "Dry carbon fiber laid up on a plate with peel ply on top and blue tape", caption: "Layup with peel ply as the top layer.", w: 386, h: 359 } },
          { figure: { src: "assets/img/resin-infusion.jpg", alt: "Bagged part with resin lines during infusion", caption: "Part with alternate geometry during infusion.", w: 393, h: 325 } },
        ] },
        { figs: [
          { figure: { src: "assets/img/resin-cured-bagged.jpg", alt: "Cured carbon fiber part still under the vacuum bag", caption: "Cured part before debagging.", w: 336, h: 301 } },
          { figure: { src: "assets/img/resin-cured-dry-areas.jpg", alt: "Cured carbon fiber enclosure with visible dry areas near one edge", caption: "Cured part with dry areas from inconsistent resin flow.", w: 640, h: 480 } },
        ] },
        { placeholder: "Photo of a finished enclosure installed on the 2026 car" },
        { placeholder: "Cure time per part, oven versus local initiation", note: "Even a short table of part, size, and cure time would back the under 30 minutes figure." },
      ],
      outcome: [
        { list: [
          "Cure time went from hours to under 30 minutes using local or oven initiation.",
          "Delivered electronics enclosures that ran on the 2026 competition car.",
          "SOPs covering catalyst ratio, infusion setup, front initiation, and quality control made the process repeatable for the team.",
          "Some parts still showed dry areas from inconsistent resin flow, which is the main open process issue.",
        ] },
      ],
      next: [
        { status: [
          ["planned", "Embed thermistors through a part to measure temperature as the front travels"],
          ["planned", "Test several resistive heating wires across the part surface for even heating and front propagation"],
        ] },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────── FASTENERS
  {
    id: "fasteners",
    featured: true,
    code: "LASSI-01",
    title: "Bolted joint modeling for satellite FEA",
    summary:
      "A modeling reference and an Excel workbook that compute bolt, member, and shear stiffness plus preload for every fastener, so joint results in NX Nastran can be trusted.",
    org: "Laboratory for Advanced Space Systems at Illinois (LASSI)",
    role: "Structures team, fastener modeling methods and tools",
    period: "Aug 2025 - Present",
    tools: ["Siemens NX", "NX Nastran", "CBUSH / PBUSH", "RBE2 / RBE3", "Excel"],
    status: ["active", "In use · validation pending"],
    facts: [
      ["Coverage", "200+ fasteners"],
      ["Shear model", "Huth-Schwarmann"],
      ["Used for", "Analysis ahead of CDR"],
    ],
    cover: { src: "assets/img/fastener-screws.jpg", alt: "CAD close-up of screws joining a rail to a green panel and yellow bracket", w: 466, h: 720 },
    sections: {
      overview: [
        { p: "Our earlier FEA models produced errors at joints that nobody could explain, so the joint results could not be trusted. I traced them to two sources. Fasteners were modeled inconsistently, and their stiffness values were calculated incorrectly." },
        { p: "The goal was one method and one toolset for modeling fasteners in FEA, removing as many sources of error as possible. Under launch loads every bolted joint has to meet three requirements. The clamped parts must not separate, they must not slip, and the bolt must keep a positive strength margin." },
      ],
      contribution: [
        { p: "The structures team has 15 members. My scope is the methods and tools for modeling fasteners." },
        { list: [
          "Wrote the lab's fastener modeling reference document, standardizing element selection, stiffness assumptions, and modeling practice.",
          "Built the Excel workbook that computes stiffness and preload for 200+ fasteners and formats the results for direct entry into NX element properties.",
        ] },
      ],
      challenge: [
        { p: "<strong>Error source one, the modeling method.</strong> A fastener in a finite element model has two parts. One element represents the shank, and a second set of elements connects the shank to the plates around it. In NX Nastran the shank can be a CBUSH, a spring with a stiffness the analyst sets in each direction, or a CBAR, a beam with a cross-section. The connection can be an RBE2, which is perfectly rigid, or an RBE3, which spreads load over nearby nodes without adding stiffness." },
        { p: "An RBE2 makes the area around the hole solid, so the joint comes out stiffer than it is. An RBE3 leaves that area free to deform, so the joint comes out more flexible than it is." },
        { diagram: "fastener", caption: "Two-plate fastener idealization with a CBUSH shank and spider connections. Schematic, not to scale." },
        { p: "<strong>Error source two, the stiffness values.</strong> Bolts in a joint share load in proportion to their stiffness. One wrong stiffness value misrepresents the load at that bolt and shifts load onto its neighbors." },
      ],
      approach: [
        { p: "For the method, the reference document explains which element combination to use for which kind of joint and why." },
        { p: "For the values, the workbook calculates bolt axial stiffness, clamped member stiffness, shear stiffness, and preload for every fastener. Shear flexibility comes from the Huth-Schwarmann method." },
        { math: "C = \\left(\\frac{t_1 + t_2}{2d}\\right)^{a} \\frac{b}{n}\\left(\\frac{1}{t_1 E_1} + \\frac{1}{n\\,t_2 E_2} + \\frac{1}{2\\,t_1 E_3} + \\frac{1}{2\\,n\\,t_2 E_3}\\right)" },
        { p: "Here \\(t_1\\) and \\(t_2\\) are plate thicknesses, \\(d\\) the fastener diameter, \\(E_1\\) and \\(E_2\\) the plate moduli, \\(E_3\\) the fastener modulus, \\(n\\) the number of shear planes, and \\(a\\) and \\(b\\) empirical constants for the joint type." },
        { p: "Under an external load the bolt and clamped plates act as two springs. The bolt carries its preload plus a share of the external load set by its stiffness relative to the total. Preload comes from installation torque through the nut factor." },
        { math: "F_b = F_i + \\frac{k_b}{k_b + k_m}\\,F_{\\text{ext}}" },
        { math: "T = K\\,D\\,F_i" },
      ],
      evidence: [
        { table: {
          caption: "Sample rows from the workbook. Member stiffness \\(k_m\\) is the two clamped members in series, and axial stiffness is \\(k_b + k_m\\).",
          head: ["Fastener", "k bolt (lbf/in)", "k member 1", "k member 2", "k member (series)", "k axial", "Shear flexibility (in/lbf)", "k shear (lbf/in)"],
          numeric: [1, 2, 3, 4, 5, 6, 7],
          rows: [
            ["RAIL-EP-01", "1,449,541", "3,293,751", "4,476,135", "1,897,489", "3,347,030", "7.491 × 10⁻⁶", "133,496"],
            ["RAIL-EP-02", "1,404,582", "4,835,572", "6,834,554", "2,831,930", "4,236,512", "7.491 × 10⁻⁶", "133,496"],
            ["SIDEPNL-X1", "1,853,009", "4,189,606", "4,476,135", "2,164,067", "4,017,076", "7.678 × 10⁻⁶", "130,234"],
            ["PCB-STK-01", "1,144,189", "740,361", "3,405,587", "608,151", "1,752,341", "2.666 × 10⁻⁵", "37,503"],
          ],
          note: "Rotational stiffness columns are omitted here. The full workbook output is in the figure below.",
        } },
        { figure: { src: "assets/img/fastener-stiffness-table.png", alt: "Spreadsheet of resolved axial, shear, and rotational stiffness values for about thirty named fasteners", caption: "Resolved stiffness values from the workbook, formatted for entry into NX.", w: 1259, h: 769, wide: true } },
        { figure: { src: "assets/img/fastener-screws.jpg", alt: "CAD detail of screws in the satellite structure", caption: "Screws in our structure that the workbook covers.", w: 466, h: 720 } },
        { placeholder: "Screenshot of a fastener modeled in NX with CBUSH and spider elements", note: "Use your own model. A deformed-shape or bolt force plot would show the method in use." },
        { placeholder: "Joint geometry, load cases, and boundary conditions for one representative joint", note: "Keep to what LASSI allows you to share publicly." },
        { placeholder: "Comparison of RBE2 versus RBE3 connections on the same joint", note: "Bolt load or local stiffness for each approach, side by side." },
      ],
      outcome: [
        { p: "The team now models joints from the reference document and calculates stiffness values with the workbook. With consistent stiffness values and a clear split between modeling methods, the team got results it judged representative of the satellite ahead of its Critical Design Review." },
        { p: "The method has not yet been benchmarked against a detailed model, so I treat it as in use and not yet validated." },
      ],
      next: [
        { status: [
          ["done", "Modeling reference document adopted by the structures team"],
          ["done", "Stiffness and preload workbook for 200+ fasteners"],
          ["active", "Applying the method across the satellite FEA model"],
          ["planned", "Benchmark the method against a detailed solid model of one joint"],
          ["planned", "Extend the workbook to epoxied and riveted joints"],
        ] },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────── SATELLITE CAD
  {
    id: "satellite-cad",
    featured: false,
    code: "LASSI-02",
    title: "Satellite CAD and proposal model",
    summary:
      "Simplified a research satellite assembly from 500 components to 20 so it could be 3D printed as a physical model for a proposal.",
    org: "Laboratory for Advanced Space Systems at Illinois (LASSI)",
    role: "Undergraduate research assistant",
    period: "2025 - 2026",
    tools: ["Siemens NX", "FDM / SLA printing"],
    status: ["done", "Model built for proposal"],
    facts: [
      ["Mission", "Dual-use propellant research satellite"],
      ["Assembly", "500 → 20 components"],
      ["Used for", "University Nanosatellite Program proposal"],
    ],
    cover: { src: "assets/img/lassi-satellite-cad.jpg", alt: "Isometric CAD render of a small satellite with deployed solar panels and antennas", w: 1086, h: 827 },
    sections: {
      overview: [
        { p: "LASSI is developing a dual-use propellant research satellite. For its University Nanosatellite Program proposal the team needed a physical model that reviewers could hold, along with CAD that clearly showed the design." },
      ],
      contribution: [
        { list: [
          "Developed and simplified CAD models of the satellite.",
          "Reduced the assembly from 500 components to 20 for printing.",
          "Planned the print process and built the 3D-printed models for proposal presentations.",
        ] },
      ],
      challenge: [
        { p: "The working CAD carries the detail the design and analysis need. A model meant to be printed and handed to reviewers needs far fewer parts while still reading as the same satellite." },
      ],
      approach: [
        { placeholder: "How you decided what to merge, remove, and keep, and how you planned the prints", note: "Two or three sentences plus a before and after view would cover it." },
      ],
      evidence: [
        { figure: { src: "assets/img/lassi-satellite-cad.jpg", alt: "CAD render of the satellite", caption: "Satellite CAD.", w: 1086, h: 827 } },
        { placeholder: "Photo of the printed proposal model" },
        { placeholder: "Before and after assembly tree, or an exploded view of the 20-part model" },
      ],
      outcome: [
        { p: "The simplified model was printed and used in the proposal presentations." },
      ],
      next: [
        { placeholder: "What you would change in the next model", note: "For example, print tolerances, materials, or which features to keep." },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────── MASS TRACKING
  {
    id: "mass-tracking",
    featured: false,
    code: "IEM-03",
    title: "Vehicle mass tracking",
    summary:
      "One spreadsheet that rolls up 20+ subprojects, including composite panel masses from ply schedules, so the team can track car mass against last year.",
    org: "Illini Electric Motorsports",
    role: "Chassis team",
    period: "2025 - 2026",
    tools: ["Excel"],
    status: ["done", "Used by the full team"],
    facts: [
      ["Scope", "20+ subprojects"],
      ["Prediction", "Within 5-7% of final mass"],
      ["Turnaround", "Delivered in one week"],
    ],
    cover: { src: "assets/img/iem-team-monocoque.jpg", alt: "Illini Electric Motorsports team posing behind a carbon fiber monocoque in the shop", w: 1106, h: 558 },
    sections: {
      overview: [
        { p: "Mass affects acceleration, handling, energy use, and suspension geometry on an FSAE car. Each subteam tracked mass its own way, so there was no reliable total until late in the build." },
      ],
      contribution: [
        { p: "I built a spreadsheet that combines more than 20 subprojects and accounts for ply schedules and material properties. Project leads enter their own masses, and each project shows its difference from the same part on the previous year's car." },
      ],
      challenge: [
        { p: "Composite panels have no catalog mass. Their mass depends on area, ply count by type, and core, so the sheet has to compute it from the layup." },
      ],
      approach: [
        { p: "Mass for each composite panel \\(j\\) is computed from its area, the number of plies of each type, and the core." },
        { math: "m_j = A_j\\left(n_{0,j}\\,g_0 + n_{45,j}\\,g_{45} + n_{U,j}\\,g_U\\right) + \\rho_{\\text{core}}\\,t_{\\text{core},j}\\,A_j" },
        { p: "Here \\(g\\) is the areal weight of each ply type and \\(n\\) the number of those plies in the panel." },
      ],
      evidence: [
        { figure: { src: "assets/img/iem-team-monocoque.jpg", alt: "Team photo with the carbon fiber monocoque", caption: "Illini Electric Motorsports with the carbon fiber monocoque.", w: 1106, h: 558, wide: true } },
        { placeholder: "Screenshot of the mass tracking sheet", note: "Blur or crop anything the team does not want public." },
      ],
      outcome: [
        { p: "The sheet was delivered within a week and used by the team to calculate mass for the entire car. Predicted mass came within 5-7% of the final mass." },
      ],
      next: [
        { status: [
          ["planned", "Add a growth margin for changes made during manufacturing"],
          ["planned", "Store tested layup schedules that scale per panel, so the only inputs are a scaling factor and panel area"],
        ] },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────── CUBESAT
  {
    id: "cubesat",
    featured: false,
    code: "AE-298",
    title: "Agricultural water monitoring CubeSat",
    summary:
      "Led a 3-person conceptual design of a small satellite that images farmland for soil moisture and crop health. Selected as the best design of 12 teams.",
    org: "AE 298, University of Illinois (course design project)",
    role: "Team lead, 3 students",
    period: "Course project",
    tools: ["Siemens NX", "Mass, power, volume and data budgets"],
    status: ["done", "Best design of 12 teams"],
    facts: [
      ["Orbit", "500 km sun-synchronous"],
      ["Requirement", "25,000 acres per week"],
      ["Data", "128 MB/day made, 150 MB/day downlink"],
    ],
    cover: { src: "assets/img/cubesat-cad.png", alt: "CAD model of a CubeSat with two deployed blue solar panels and camera apertures on top", w: 459, h: 543 },
    sections: {
      overview: [
        { p: "A group conceptual design project for AE 298. The mission was to image 25,000 acres of farmland per week and capture visible and near-infrared images plus short-wave infrared images of target fields, to estimate soil moisture and crop health." },
      ],
      contribution: [
        { p: "I led a team of 3 students through mission design, component selection, budgets, and subsystem layout." },
      ],
      challenge: [
        { p: "Fit a hyperspectral camera, a flight computer that runs hot during imaging, propulsion, and enough power and downlink into a small satellite, with margin in every budget." },
      ],
      approach: [
        { list: [
          "Chose a 500 km sun-synchronous orbit so every image had the same lighting.",
          "Picked the Satlantis iSIM-90 as the primary camera early, which set baselines for every other component.",
          "Pointing uses onboard propulsion, reaction wheels, and magnetorquers.",
          "Three copper straps carry flight computer heat to a radiator on the side facing away from the Sun. Film heaters keep the battery warm in eclipse.",
          "Two S-band radios send images down, one as a backup.",
        ] },
        { p: "Rejecting the flight computer's 20 W at 20 °C sets the radiator size, which fits on one face." },
        { math: "A = \\frac{Q}{\\varepsilon\\,\\sigma\\,T^{4}} \\approx 0.056\\ \\text{m}^2" },
      ],
      evidence: [
        { figure: { src: "assets/img/cubesat-conops.jpg", alt: "Concept of operations diagram in six stages from launch to deorbit", caption: "Concept of operations, from launch through field identification, soil moisture measurement, downlink, and deorbit.", w: 1418, h: 940, wide: true } },
        { figs: [
          { figure: { src: "assets/img/cubesat-interface.png", alt: "Block diagram of subsystems connected to the flight computer, payload, and power system", caption: "Subsystem interface diagram.", w: 1083, h: 559 } },
          { figure: { src: "assets/img/cubesat-internal.png", alt: "Internal layout drawing showing GNSS antenna, flight computer, reaction wheels, thruster, and camera electronics", caption: "Internal configuration.", w: 485, h: 256 } },
        ] },
        { table: {
          caption: "Budget summary",
          head: ["Budget", "Value"],
          numeric: [1],
          rows: [
            ["Peak solar array power", "72 W from six arrays"],
            ["Battery capacity", "71 Wh"],
            ["Data generated", "128 MB per day"],
            ["Downlink capacity", "150 MB per day"],
          ],
        } },
        { placeholder: "Final mass and average power, with margin", note: "Reconcile the numbers in your slides first. The text and tables there disagree (see the build notes)." },
      ],
      outcome: [
        { p: "The design met all mission parameters with the required margin in mass, volume, and power, and it was selected as the best satellite design in the class out of 12 teams." },
      ],
      next: [
        { status: [
          ["planned", "Resize the radiator for every heat source, including the propulsion system, not only the flight computer and camera"],
          ["planned", "Add a cooldown period between imaging cycles to the concept of operations"],
        ] },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────── UAV
  {
    id: "uav",
    featured: false,
    code: "UAV-01",
    title: "Aero Tracking search-and-rescue UAV",
    summary:
      "A fully 3D-printed fixed-wing drone under 850 g, with lightweight PLA tuned for consistent prints and paired elevons for control.",
    org: "Team project",
    role: "Structures, printing, and electronics",
    period: "Nov 2024 - May 2025",
    tools: ["CAD / CAM", "Lightweight PLA", "FDM printing", "Soldering"],
    status: ["done", "Built · tracking explored"],
    facts: [
      ["Mass", "Under 850 g"],
      ["Thrust to weight", "1.16"],
      ["Print parameters tuned", "5"],
    ],
    cover: null,
    sections: {
      overview: [
        { p: "With a team, I developed a lightweight fixed-wing drone for search and rescue. The airframe is fully 3D printed." },
      ],
      contribution: [
        { list: [
          "Engineered the 3D-printed airframe to a final mass under 850 g with a thrust to weight ratio of 1.16.",
          "Tested 3D printing materials to compare properties for structural components.",
          "Ran process studies on lightweight PLA, calibrating 5 print parameters for consistent quality and easier manufacturing.",
          "Integrated paired elevons for control, which cut the number of control surfaces and kept the build light and low cost.",
          "Custom-soldered the electronics.",
        ] },
      ],
      challenge: [
        { p: "Lightweight PLA foams as it prints. That saves mass, but wall quality and strength swing with temperature, flow, and speed, so the process has to be tuned before parts are repeatable." },
      ],
      approach: [
        { placeholder: "The 5 print parameters and how you tuned them", note: "A small table of parameter, range tried, and final value would carry this section." },
      ],
      evidence: [
        { placeholder: "Photo of the finished aircraft" },
        { placeholder: "CAD of the airframe, ideally with the internal structure visible" },
        { placeholder: "Material test coupons or print calibration results" },
      ],
      outcome: [
        { p: "The completed aircraft met its mass target under 850 g. Camera-based object and thermal tracking were explored as planned features and are not part of the completed build." },
      ],
      next: [
        { placeholder: "What you would improve in a second aircraft" },
      ],
    },
  },
];

export const about = {
  bio: [
    "I study Materials Science and Engineering at UIUC. Most of my time goes into composite structures, where the material, the layup, and the process set how a part performs.",
    "On Illini Electric Motorsports I size and build carbon fiber parts for the car's front impact structure. At LASSI I work on the structural analysis side of a small satellite, building the tools the team uses to model bolted joints. I like work where the analysis has to hold up to a test or a build.",
  ],
  interests: [
    "Composite materials and laminate structures",
    "Structural testing and failure behavior",
    "Finite element analysis",
    "Aerospace structures",
    "CAD and mechanical design",
    "Additive manufacturing",
  ],
  timeline: [
    ["Aug 2025 - Present", "Illini Electric Motorsports", "Chassis team, Front Impact Structures lead"],
    ["Aug 2025 - Present", "Laboratory for Advanced Space Systems at Illinois", "Research assistant, structures team"],
    ["Sep 2022 - May 2025", "Waubonsie Valley Robotics", "Team captain. Led 8 students in VEX Robotics. Two state qualifications, top 10 rankings, and awards for competition excellence and robot construction."],
    ["Aug 2023 - May 2025", "Waubonsie Valley High School", "Student technician. Maintained 5+ fabrication machines, including 3D printers, laser cutters, and CNCs."],
    ["May 2024 - Aug 2024", "Pangea Solutions", "Research assistant. Led an intern team that designed a UAV curriculum reaching 200+ students."],
  ],
};

export const skills = [
  ["CAD and design", ["Siemens NX", "Creo 10.0", "AutoCAD", "Assembly simplification for printing"]],
  ["Analysis", ["NX Nastran", "CBUSH, CBAR, RBE2, RBE3 joint modeling", "Classical Laminate Theory", "Sandwich beam theory", "Huth-Schwarmann fastener flexibility", "FSAE Structural Equivalency Spreadsheet"]],
  ["Composites manufacturing", ["Carbon fiber layups", "Sandwich panels", "VARTM infusion", "Rapid-cure FROMP resin processing"]],
  ["Testing", ["Coupon prep for tensile, bond strength, and 3-point bend tests", "Perimeter shear coupons (planned)"]],
  ["Fabrication", ["FDM and SLA printing", "Waterjet", "Mill", "Lathe", "CO₂ and fiber laser cutters"]],
  ["Software and documentation", ["Python", "Java", "Excel engineering tools", "SOPs and modeling reference documents"]],
];
