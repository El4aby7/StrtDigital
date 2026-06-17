/* ==========================================================================
   Maison — Data + procedural imagery
   Each product "photo" is an inline-SVG furniture silhouette on a warm room
   backdrop (data-URI), re-tinted to the selected material.
   ========================================================================== */
(function () {
  "use strict";

  function shade(hex, amt) {
    const n = parseInt(hex.replace("#", ""), 16);
    const c = (x) => Math.max(0, Math.min(255, x));
    return "#" + (c((n >> 16) + amt) << 16 | c(((n >> 8) & 255) + amt) << 8 | c((n & 255) + amt)).toString(16).padStart(6, "0");
  }

  /* Silhouettes per furniture type, drawn in the chosen material colour. */
  const SHAPES = {
    sofa: (c) => `<rect x='40' y='150' width='220' height='60' rx='14' fill='${c}'/><rect x='40' y='110' width='220' height='60' rx='16' fill='${shade(c, 18)}'/><rect x='34' y='130' width='30' height='70' rx='12' fill='${shade(c, -10)}'/><rect x='236' y='130' width='30' height='70' rx='12' fill='${shade(c, -10)}'/><rect x='60' y='210' width='14' height='18' fill='${shade(c, -40)}'/><rect x='226' y='210' width='14' height='18' fill='${shade(c, -40)}'/>`,
    chair: (c) => `<rect x='110' y='80' width='80' height='90' rx='12' fill='${shade(c, 18)}'/><rect x='100' y='160' width='100' height='30' rx='8' fill='${c}'/><rect x='106' y='188' width='12' height='34' fill='${shade(c, -40)}'/><rect x='182' y='188' width='12' height='34' fill='${shade(c, -40)}'/>`,
    table: (c) => `<rect x='60' y='120' width='180' height='18' rx='6' fill='${c}'/><rect x='72' y='138' width='12' height='84' fill='${shade(c, -25)}'/><rect x='216' y='138' width='12' height='84' fill='${shade(c, -25)}'/><rect x='140' y='138' width='12' height='84' fill='${shade(c, -25)}' opacity='.6'/>`,
    bed: (c) => `<rect x='40' y='150' width='220' height='60' rx='10' fill='${c}'/><rect x='40' y='90' width='40' height='120' rx='10' fill='${shade(c, 14)}'/><rect x='80' y='140' width='180' height='30' rx='8' fill='#f1e9dd'/><rect x='90' y='120' width='70' height='34' rx='8' fill='#fff'/>`,
    lamp: (c) => `<path d='M120 70 h60 l18 50 h-96z' fill='${shade(c, 22)}'/><rect x='146' y='120' width='8' height='90' fill='${shade(c, -20)}'/><ellipse cx='150' cy='214' rx='34' ry='8' fill='${shade(c, -30)}'/>`,
    shelf: (c) => `<rect x='80' y='70' width='140' height='150' rx='6' fill='none' stroke='${c}' stroke-width='10'/><line x1='80' y1='120' x2='220' y2='120' stroke='${c}' stroke-width='8'/><line x1='80' y1='170' x2='220' y2='170' stroke='${c}' stroke-width='8'/>`,
  };

  function furniture(type, color, bg = "#efe6da") {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 240'>
      <rect width='300' height='240' fill='${bg}'/>
      <rect y='150' width='300' height='90' fill='${shade(bg, -10)}'/>
      <circle cx='250' cy='55' r='30' fill='#fff' opacity='.5'/>
      ${SHAPES[type](color)}
    </svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  const MAT = { oak: "#c98a5e", walnut: "#7a4a30", linen: "#cdbfa6", charcoal: "#4a4742", sage: "#8a9a78", clay: "#b5715a" };

  // id, name, room, type, price, defaultMat, materials[], sizes[]
  const P = [
    ["p1", "Lund Sofa", "Living", "sofa", 1490, "linen", ["linen", "sage", "charcoal"], ["2-seat", "3-seat", "Corner"]],
    ["p2", "Halden Armchair", "Living", "chair", 690, "sage", ["linen", "sage", "clay"], ["Standard"]],
    ["p3", "Arc Floor Lamp", "Living", "lamp", 280, "charcoal", ["charcoal", "oak"], ["Standard"]],
    ["p4", "Verde Shelving", "Living", "shelf", 540, "oak", ["oak", "walnut", "charcoal"], ["3-tier", "5-tier"]],
    ["p5", "Sol Bed Frame", "Bedroom", "bed", 1190, "oak", ["oak", "walnut", "linen"], ["Queen", "King"]],
    ["p6", "Nook Nightstand", "Bedroom", "table", 320, "walnut", ["oak", "walnut"], ["Standard"]],
    ["p7", "Loom Reading Chair", "Bedroom", "chair", 620, "clay", ["linen", "clay", "sage"], ["Standard"]],
    ["p8", "Field Dining Table", "Dining", "table", 1290, "oak", ["oak", "walnut"], ["4-seat", "6-seat", "8-seat"]],
    ["p9", "Mesa Dining Chair", "Dining", "chair", 240, "oak", ["oak", "walnut", "charcoal"], ["Set of 2", "Set of 4"]],
    ["p10", "Glow Pendant", "Dining", "lamp", 210, "oak", ["oak", "charcoal"], ["Standard"]],
    ["p11", "Studio Desk", "Workspace", "table", 740, "walnut", ["oak", "walnut"], ["Compact", "Wide"]],
    ["p12", "Task Chair", "Workspace", "chair", 420, "charcoal", ["charcoal", "sage"], ["Standard"]],
  ].map(([id, name, room, type, price, mat, materials, sizes]) => ({
    id, name, room, type, price, mat, materials, sizes,
    image: furniture(type, MAT[mat]),
  }));

  window.MAISON = {
    products: P, MAT, furniture,
    rooms: ["All", "Living", "Bedroom", "Dining", "Workspace"],
    roomCards: [
      { name: "Living", blurb: "Sink-in sofas & soft light", type: "sofa", c: "linen" },
      { name: "Bedroom", blurb: "Calm, grounding pieces", type: "bed", c: "oak" },
      { name: "Dining", blurb: "Tables made for lingering", type: "table", c: "walnut" },
      { name: "Workspace", blurb: "Focused, handsome desks", type: "shelf", c: "charcoal" },
    ].map((r) => ({ ...r, img: furniture(r.type, MAT[r.c], "#e7ddcd") })),
    heroImg: furniture("sofa", MAT.sage, "#e7ddcd"),
    promise: [
      ["truck", "Free delivery", "On every order, room-of-choice."],
      ["moon", "100-night returns", "Live with it, then decide."],
      ["leaf", "Sustainably sourced", "FSC timber, natural fibres."],
      ["tool", "Made to order", "Built for you in 4–6 weeks."],
    ],
  };
})();
