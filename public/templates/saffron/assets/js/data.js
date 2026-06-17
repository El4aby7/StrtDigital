/* ==========================================================================
   Saffron — Data + procedural imagery
   "Photos" are abstract plated-dish / interior SVGs (data-URIs) so the
   template is fully self-contained.
   ========================================================================== */
(function () {
  "use strict";

  /* Top-down plated dish: a plate ring with a few warm food blobs + garnish. */
  function plate(seed = 1, base = "#e0a94a") {
    const rnd = mulberry(seed);
    const blobs = Array.from({ length: 4 }, () => {
      const a = rnd() * 6.28, r = 20 + rnd() * 30, x = 110 + Math.cos(a) * r, y = 110 + Math.sin(a) * r;
      const rad = 18 + rnd() * 22, hue = ["#b5532e", "#7d8a4a", "#caa64c", "#8a3b2a", "#d98c3f"][Math.floor(rnd() * 5)];
      return `<circle cx='${x.toFixed(0)}' cy='${y.toFixed(0)}' r='${rad.toFixed(0)}' fill='${hue}' opacity='.92'/>`;
    }).join("");
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'>
      <rect width='220' height='220' fill='#241b15'/>
      <circle cx='110' cy='110' r='96' fill='#2e231b'/>
      <circle cx='110' cy='110' r='86' fill='#f4ece0'/>
      <circle cx='110' cy='110' r='62' fill='#efe2cf'/>
      ${blobs}
      <circle cx='110' cy='110' r='6' fill='${base}'/>
      <path d='M70 60 q40 -14 80 0' stroke='#6f7a4a' stroke-width='3' fill='none' opacity='.5'/>
    </svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  /* Warm interior / texture panel for hero, story & gallery variety. */
  function texture(seed = 1, c1 = "#3a2a1e", c2 = "#7a4a2a") {
    const rnd = mulberry(seed * 7);
    const dots = Array.from({ length: 22 }, () => `<circle cx='${(rnd() * 320).toFixed(0)}' cy='${(rnd() * 220).toFixed(0)}' r='${(rnd() * 30 + 6).toFixed(0)}' fill='#000' opacity='${(rnd() * .12).toFixed(2)}'/>`).join("");
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 220'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs>
      <rect width='320' height='220' fill='url(#g)'/>${dots}
      <circle cx='250' cy='60' r='34' fill='#e0a94a' opacity='.22'/>
    </svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  // tiny seeded RNG for stable, repeatable imagery
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  const COURSES = ["Starters", "Mains", "Breads & sides", "Desserts"];

  // name, course, price, desc, veg, signature
  const M = [
    ["Tandoori cauliflower", "Starters", 14, "Charred florets, mint-yoghurt, pomegranate.", true, true],
    ["Pepper-fry calamari", "Starters", 16, "Curry leaf, black pepper, lime.", false, false],
    ["Beetroot & paneer tikki", "Starters", 13, "Crisp patties, tamarind glaze.", true, false],
    ["Bone-marrow nalli", "Starters", 18, "Slow-roasted, saffron butter, naan.", false, true],
    ["Butter chicken", "Mains", 26, "24-hour marinade, tomato-fenugreek gravy.", false, true],
    ["Lamb rogan josh", "Mains", 29, "Kashmiri chillies, slow-braised shoulder.", false, true],
    ["Dal makhani", "Mains", 19, "Black lentils, simmered overnight.", true, false],
    ["Malai kofta", "Mains", 21, "Paneer dumplings, cashew-cream sauce.", true, false],
    ["Goan fish curry", "Mains", 27, "Coconut, kokum, market catch.", false, false],
    ["Garlic naan", "Breads & sides", 5, "Stone-baked, cultured butter.", true, false],
    ["Saffron pilaf", "Breads & sides", 8, "Basmati, whole spice, fried onion.", true, false],
    ["Burnt-chilli greens", "Breads & sides", 9, "Seasonal greens, garlic, lemon.", true, false],
    ["Gulab jamun", "Desserts", 11, "Warm, cardamom syrup, pistachio.", true, true],
    ["Saffron kulfi", "Desserts", 10, "Set cream, almond praline.", true, false],
    ["Mango & lime posset", "Desserts", 11, "Alphonso mango, shortbread.", true, false],
  ].map(([name, course, price, desc, veg, sig], i) => ({ id: "d" + i, name, course, price, desc, veg, sig }));

  const GALLERY = [
    { cap: "The open kitchen", img: texture(2, "#2a1d13", "#7a4a2a") },
    { cap: "Signature butter chicken", img: plate(5) },
    { cap: "The spice pantry", img: texture(8, "#3a2410", "#a4632c") },
    { cap: "Tandoori platter", img: plate(11, "#b5532e") },
    { cap: "The dining room", img: texture(14, "#241b15", "#5a3a22") },
    { cap: "Saffron kulfi", img: plate(19, "#e0a94a") },
  ];

  window.SAFFRON = {
    courses: COURSES, menu: M, gallery: GALLERY,
    hero: texture(3, "#1c130c", "#8a4a22"),
    story: texture(6, "#2a1d13", "#a4632c"),
    plate,
    stats: [["10+", "house spice blends"], ["4.8★", "1,400 reviews"], ["100%", "ground fresh daily"]],
    reserveInfo: ["Tables held for 15 minutes", "Tasting menu available Fri–Sun", "We cater to most allergies — just ask", "Private dining for 10–24 guests"],
  };
})();
