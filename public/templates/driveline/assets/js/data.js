/* ==========================================================================
   DriveLine — Data + procedural imagery
   The hero car is a single inline-SVG render re-tinted live as the buyer picks
   a paint colour, so no binary image assets are needed.
   ========================================================================== */
(function () {
  "use strict";

  function shade(hex, amt) {
    const n = parseInt(hex.replace("#", ""), 16);
    const c = (x) => Math.max(0, Math.min(255, x));
    return "#" + (c((n >> 16) + amt) << 16 | c(((n >> 8) & 255) + amt) << 8 | c((n & 255) + amt)).toString(16).padStart(6, "0");
  }

  /* Sleek EV coupe, three-quarter-ish profile, tinted to the chosen paint. */
  function carRender(color = "#e9edf2") {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 300'>
      <defs>
        <linearGradient id='body' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stop-color='${shade(color, 30)}'/><stop offset='.5' stop-color='${color}'/><stop offset='1' stop-color='${shade(color, -40)}'/>
        </linearGradient>
        <linearGradient id='glass' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stop-color='#bfe9ee'/><stop offset='1' stop-color='#1b3147'/>
        </linearGradient>
      </defs>
      <ellipse cx='320' cy='250' rx='250' ry='22' fill='#000' opacity='.35'/>
      <path d='M70 200 Q90 150 170 142 Q230 96 320 94 Q430 96 470 150 Q560 158 580 200 L585 222 Q585 236 568 236 L92 236 Q72 236 72 220 Z' fill='url(#body)'/>
      <path d='M185 148 Q235 108 320 106 Q418 108 452 154 L420 168 Q360 150 250 154 Z' fill='url(#glass)' opacity='.92'/>
      <path d='M72 214 L580 214' stroke='${shade(color, -55)}' stroke-width='3' opacity='.5'/>
      <path d='M120 196 q40 -8 90 -8' stroke='#fff' stroke-width='2' opacity='.35' fill='none'/>
      <ellipse cx='185' cy='236' rx='46' ry='46' fill='#0c1722'/><circle cx='185' cy='236' r='22' fill='#2a3a4c'/><circle cx='185' cy='236' r='8' fill='#7fe3df'/>
      <ellipse cx='470' cy='236' rx='46' ry='46' fill='#0c1722'/><circle cx='470' cy='236' r='22' fill='#2a3a4c'/><circle cx='470' cy='236' r='8' fill='#7fe3df'/>
      <rect x='560' y='186' width='22' height='10' rx='4' fill='#ff5a5a'/>
      <rect x='78' y='184' width='20' height='12' rx='5' fill='#eafcff'/>
    </svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  const PAINTS = [
    { id: "white", name: "Glacier White", hex: "#e9edf2", price: 0 },
    { id: "silver", name: "Quartz Silver", hex: "#b9c2cc", price: 0 },
    { id: "mint", name: "Aurora Mint", hex: "#7fe0c8", price: 700 },
    { id: "blue", name: "Deep Marine", hex: "#274a73", price: 700 },
    { id: "red", name: "Solar Red", hex: "#c0392b", price: 1200 },
    { id: "black", name: "Obsidian", hex: "#23282e", price: 1200 },
  ];

  const TRIMS = [
    { id: "standard", name: "Standard", price: 48900, range: "320 mi", zero60: "5.6s", top: "130 mph", power: "295 hp", tag: "The essential DL-One" },
    { id: "performance", name: "Performance", price: 57900, range: "300 mi", zero60: "3.9s", top: "155 mph", power: "455 hp", tag: "Dual-motor AWD" },
    { id: "plaid", name: "Plaid", price: 69900, range: "340 mi", zero60: "3.1s", top: "175 mph", power: "760 hp", tag: "Track-ready tri-motor" },
  ];

  const ADDONS = [
    { id: "tow", name: "Tow package", desc: "Up to 3,500 lb", price: 1200 },
    { id: "audio", name: "Studio audio", desc: "17-speaker immersive", price: 2200 },
    { id: "autopilot", name: "Pilot Assist", desc: "Hands-on highway driving", price: 6000 },
    { id: "wheels", name: "21\" Aero wheels", desc: "Forged, lightweight", price: 2800 },
    { id: "interior", name: "Premium interior", desc: "Vegan leather + wood", price: 1800 },
  ];

  window.DRIVELINE = {
    carRender, PAINTS, TRIMS, ADDONS,
    ticker: ["0–60 in 3.1s", "340 mi range", "15-min fast charge", "5-star safety", "Over-the-air updates", "8-year battery warranty"],
    specTabs: [
      { id: "perf", label: "Performance", rows: [["Power", "up to 760 hp"], ["0–60 mph", "3.1 s"], ["Top speed", "175 mph"], ["Drivetrain", "Tri-motor AWD"]] },
      { id: "range", label: "Range & charging", rows: [["EPA range", "340 mi"], ["Fast charge", "10–80% in 18 min"], ["Home charge", "11 kW onboard"], ["Battery", "98 kWh"]] },
      { id: "dim", label: "Dimensions", rows: [["Length", "4,720 mm"], ["Seating", "5 adults"], ["Cargo", "640 L + 88 L frunk"], ["Curb weight", "1,990 kg"]] },
      { id: "feat", label: "Comfort & tech", rows: [["Display", "15.4\" center"], ["Climate", "Tri-zone"], ["Glass roof", "Panoramic"], ["Updates", "Over-the-air"]] },
    ],
  };
})();
