/* ==========================================================================
   Oak & Co — Data + procedural imagery
   Catalogue "photos" are inline-SVG timber-grain panels with a furniture
   silhouette (data-URIs), tinted to the wood species.
   ========================================================================== */
(function () {
  "use strict";

  function shade(hex, amt) {
    const n = parseInt(hex.replace("#", ""), 16);
    const c = (x) => Math.max(0, Math.min(255, x));
    return "#" + (c((n >> 16) + amt) << 16 | c(((n >> 8) & 255) + amt) << 8 | c((n & 255) + amt)).toString(16).padStart(6, "0");
  }

  const SHAPES = {
    sideboard: (c) => `<rect x='60' y='120' width='200' height='80' rx='8' fill='${c}'/><line x1='160' y1='124' x2='160' y2='196' stroke='${shade(c, -30)}' stroke-width='3'/><circle cx='130' cy='160' r='4' fill='${shade(c, -40)}'/><circle cx='190' cy='160' r='4' fill='${shade(c, -40)}'/><rect x='72' y='200' width='10' height='18' fill='${shade(c, -30)}'/><rect x='238' y='200' width='10' height='18' fill='${shade(c, -30)}'/>`,
    table: (c) => `<rect x='50' y='118' width='220' height='16' rx='5' fill='${c}'/><rect x='66' y='134' width='12' height='86' fill='${shade(c, -22)}'/><rect x='242' y='134' width='12' height='86' fill='${shade(c, -22)}'/>`,
    chair: (c) => `<rect x='130' y='70' width='60' height='86' rx='8' fill='${shade(c, 12)}'/><rect x='120' y='150' width='80' height='20' rx='5' fill='${c}'/><rect x='124' y='168' width='10' height='52' fill='${shade(c, -22)}'/><rect x='186' y='168' width='10' height='52' fill='${shade(c, -22)}'/>`,
    bed: (c) => `<rect x='50' y='150' width='220' height='52' rx='8' fill='${c}'/><rect x='50' y='90' width='44' height='112' rx='8' fill='${shade(c, 12)}'/>`,
    desk: (c) => `<rect x='60' y='120' width='200' height='14' rx='5' fill='${c}'/><rect x='200' y='134' width='52' height='60' fill='${shade(c, -14)}'/><rect x='72' y='134' width='10' height='86' fill='${shade(c, -22)}'/>`,
    shelf: (c) => `<rect x='100' y='70' width='120' height='150' rx='4' fill='none' stroke='${c}' stroke-width='12'/><line x1='100' y1='130' x2='220' y2='130' stroke='${c}' stroke-width='10'/>`,
  };

  /* timber grain = stacked translucent strokes over a wood-tone field */
  function piece(type, color) {
    const grain = Array.from({ length: 9 }, (_, i) =>
      `<path d='M0 ${20 + i * 26} q160 ${i % 2 ? 14 : -14} 320 0' stroke='${shade(color, -26)}' stroke-width='2' fill='none' opacity='.28'/>`).join("");
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 240'>
      <rect width='320' height='240' fill='${shade(color, 30)}'/>${grain}
      <rect y='150' width='320' height='90' fill='${shade(color, 14)}' opacity='.5'/>
      ${SHAPES[type](color)}
    </svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  const WOOD = { Oak: "#c6a15b", Walnut: "#6e4530", Ash: "#d8c39a", Teak: "#a9763f" };

  // id, name, category, wood, from, blurb, type
  const P = [
    ["s1", "Halling Sideboard", "Storage", "Oak", 2400, "Dovetailed, book-matched front.", "sideboard"],
    ["s2", "Mörk Sideboard", "Storage", "Walnut", 2900, "Floating base, push-latch doors.", "sideboard"],
    ["t1", "Refectory Table", "Tables", "Oak", 3200, "Single-plank top, breadboard ends.", "table"],
    ["t2", "Trestle Table", "Tables", "Ash", 2600, "Wedged through-tenon trestles.", "table"],
    ["t3", "Round Pedestal", "Tables", "Teak", 2100, "Turned column, splayed feet.", "table"],
    ["c1", "Spindle Chair", "Seating", "Ash", 540, "Steam-bent back, woven seat.", "chair"],
    ["c2", "Lowback Chair", "Seating", "Walnut", 620, "Sculpted saddle seat.", "chair"],
    ["b1", "Plank Bed", "Bedroom", "Oak", 2800, "Solid headboard, slatted base.", "bed"],
    ["b2", "Float Bed", "Bedroom", "Teak", 3100, "Cantilevered, hidden joinery.", "bed"],
    ["d1", "Maker's Desk", "Workspace", "Walnut", 1900, "Cable channel, dovetail drawer.", "desk"],
    ["d2", "Writing Desk", "Workspace", "Ash", 1500, "Slim profile, leather inlay.", "desk"],
    ["h1", "Ladder Shelf", "Storage", "Teak", 980, "Five tiers, wall-anchored.", "shelf"],
  ].map(([id, name, category, wood, from, blurb, type]) => ({ id, name, category, wood, from, blurb, type, image: piece(type, WOOD[wood]) }));

  window.OAKCO = {
    products: P, WOOD, piece,
    woods: Object.keys(WOOD),
    categories: [...new Set(P.map((p) => p.category))],
    featureImg: piece("sideboard", WOOD.Oak),
    heroBg: (() => {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='#241c14'/>${Array.from({ length: 14 }, (_, i) => `<path d='M0 ${10 + i * 22} q200 ${i % 2 ? 18 : -18} 400 0' stroke='#3a2c1c' stroke-width='3' fill='none' opacity='.6'/>`).join("")}<circle cx='320' cy='70' r='40' fill='#c6a15b' opacity='.18'/></svg>`;
      return "data:image/svg+xml," + encodeURIComponent(svg);
    })(),
    featureList: ["Hand-cut dovetail joinery", "Book-matched solid oak", "Hand-rubbed natural oil", "Numbered & signed"],
    enquiryTicks: ["Reply within 2 working days", "Bespoke sizes welcome", "Sample chips posted free", "Lead time 6–10 weeks"],
    accordion: [
      { wood: "Oak", desc: "Pale, golden and famously durable. Prominent grain that warms with age. Our default for tables and beds.", finish: "Natural oil or soft wax" },
      { wood: "Walnut", desc: "Rich chocolate tones with a fine, even grain. A premium choice that reads formal and timeless.", finish: "Oil; darkens gently in light" },
      { wood: "Ash", desc: "Light, springy and tough — ideal for steam-bent chairs and slim profiles. Bold, straight grain.", finish: "Clear matte lacquer or oil" },
      { wood: "Teak", desc: "Naturally oily and weather-resilient. Honey-brown, silvering if left outdoors. Beautiful for statement pieces.", finish: "Left raw or lightly oiled" },
    ],
  };
})();
