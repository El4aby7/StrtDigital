/* ==========================================================================
   Brewworks — Data + procedural imagery
   Menu "photos" are inline-SVG cups/plates (data-URIs); no binary assets.
   ========================================================================== */
(function () {
  "use strict";

  /* A drink in a cup, or a plated food item, tinted per product. */
  function item(kind, color) {
    let art;
    if (kind === "drink") {
      art = `<rect x='58' y='52' width='84' height='100' rx='10' fill='#f4ece0'/>
             <rect x='58' y='52' width='84' height='${30}' rx='10' fill='${color}'/>
             <path d='M142 70 h16 a12 12 0 0 1 0 36 h-16' fill='none' stroke='#3a2418' stroke-width='6'/>
             <ellipse cx='100' cy='52' rx='42' ry='8' fill='#3a2418' opacity='.25'/>`;
    } else if (kind === "bakery") {
      art = `<ellipse cx='100' cy='120' rx='58' ry='40' fill='${color}'/>
             <ellipse cx='100' cy='112' rx='58' ry='40' fill='${color}' opacity='.7'/>
             <circle cx='82' cy='108' r='5' fill='#3a2418'/><circle cx='112' cy='118' r='5' fill='#3a2418'/><circle cx='98' cy='126' r='5' fill='#3a2418'/>`;
    } else {
      art = `<circle cx='100' cy='110' r='62' fill='#f4ece0'/>
             <circle cx='100' cy='110' r='44' fill='${color}'/>
             <path d='M70 96 q30 -10 60 0' stroke='#6f7a4a' stroke-width='4' fill='none' opacity='.6'/>`;
    }
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='#efe2d2'/>${art}</svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  const C = { coffee: "#6b4423", milk: "#cbb089", matcha: "#7fa05a", choc: "#4a2c18", berry: "#a8456b", gold: "#d9952f", green: "#7f9a52" };

  // id, name, cat, price, desc, kind, color
  const P = [
    ["c1", "Flat White", "Coffee", 4.5, "Double ristretto, silky microfoam.", "drink", C.milk],
    ["c2", "Cortado", "Coffee", 4.0, "Equal parts espresso & warm milk.", "drink", C.coffee],
    ["c3", "Cold Brew", "Coffee", 5.0, "18-hour steep, smooth & bold.", "drink", C.coffee],
    ["c4", "Iced Latte", "Coffee", 5.0, "House blend over ice.", "drink", C.milk],
    ["t1", "Matcha Latte", "Tea & more", 5.5, "Ceremonial grade, oat milk.", "drink", C.matcha],
    ["t2", "Chai Latte", "Tea & more", 5.0, "Spiced black tea, steamed milk.", "drink", C.gold],
    ["t3", "Hot Chocolate", "Tea & more", 5.0, "70% single-origin, whipped.", "drink", C.choc],
    ["b1", "Butter Croissant", "Bakery", 4.0, "72-hour laminated, flaky.", "bakery", C.gold],
    ["b2", "Blueberry Muffin", "Bakery", 4.2, "Bursting with fruit, crumb top.", "bakery", C.berry],
    ["b3", "Cinnamon Roll", "Bakery", 4.8, "Cream-cheese glaze.", "bakery", C.milk],
    ["b4", "Banana Bread", "Bakery", 4.0, "Walnut, dark muscovado.", "bakery", C.coffee],
    ["f1", "Avocado Toast", "Brunch", 11.0, "Sourdough, chilli, lime, feta.", "food", C.green],
    ["f2", "Big Brunch Bowl", "Brunch", 13.5, "Eggs, greens, beans, dukkah.", "food", C.gold],
    ["f3", "Smashed Berry Bircher", "Brunch", 9.0, "Oats, yoghurt, seasonal fruit.", "food", C.berry],
    ["f4", "Halloumi Wrap", "Brunch", 10.5, "Grilled halloumi, slaw, harissa.", "food", C.green],
  ].map(([id, name, cat, price, desc, kind, color]) => ({ id, name, cat, price, desc, image: item(kind, color) }));

  window.BREW = {
    products: P,
    cats: ["All", ...new Set(P.map((p) => p.cat))],
    heroImg: item("drink", C.milk),
    heroChips: ["☕ Small-batch roasted", "🥐 Baked from scratch", "🌱 Plant milks free"],
    rewardGoal: 9,
  };
})();
