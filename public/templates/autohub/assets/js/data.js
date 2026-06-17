/* ==========================================================================
   AutoHub — Data + procedural imagery
   All vehicle "photos" are generated as inline SVG data-URIs, so the template
   stays dependency-free (no binary assets to ship).
   ========================================================================== */
(function () {
  "use strict";

  /* Stylised side-profile car illustration, tinted to the listing colour.
     bodyType nudges the roofline so SUVs/trucks read differently from sedans. */
  function carImage({ color = "#2EE6C5", body = "Sedan" } = {}) {
    const roof = body === "SUV" || body === "Truck" ? 58 : 70;       // higher cabin = taller car
    const rearDrop = body === "Truck" ? "L300 120 L300 150" : "";     // flat bed for trucks
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'>
      <defs>
        <linearGradient id='bg' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stop-color='#0D1B2A'/><stop offset='1' stop-color='#16293d'/>
        </linearGradient>
        <linearGradient id='car' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stop-color='${color}'/><stop offset='1' stop-color='${shade(color, -28)}'/>
        </linearGradient>
      </defs>
      <rect width='400' height='240' fill='url(#bg)'/>
      <ellipse cx='200' cy='196' rx='150' ry='14' fill='#000' opacity='.28'/>
      <path d='M58 150 Q70 120 120 116 L150 ${roof+38} Q170 ${roof} 215 ${roof} L255 116 Q320 118 342 150 ${rearDrop} L342 168 Q342 178 332 178 L68 178 Q58 178 58 168 Z' fill='url(#car)'/>
      <path d='M150 ${roof+38} Q170 ${roof} 215 ${roof} L250 ${roof+36} Z' fill='#0D1B2A' opacity='.35'/>
      <rect x='150' y='160' width='100' height='4' rx='2' fill='#0D1B2A' opacity='.25'/>
      <circle cx='124' cy='178' r='26' fill='#0d141c'/><circle cx='124' cy='178' r='13' fill='#cdd6df'/>
      <circle cx='278' cy='178' r='26' fill='#0d141c'/><circle cx='278' cy='178' r='13' fill='#cdd6df'/>
      <rect x='330' y='140' width='14' height='8' rx='3' fill='#ffd36b'/>
    </svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  /* lighten/darken a hex colour by amt (-100..100) */
  function shade(hex, amt) {
    const n = parseInt(hex.replace("#", ""), 16);
    const r = clamp((n >> 16) + amt), g = clamp(((n >> 8) & 255) + amt), b = clamp((n & 255) + amt);
    return "#" + (r << 16 | g << 8 | b).toString(16).padStart(6, "0");
  }
  const clamp = (v) => Math.max(0, Math.min(255, v));

  const PAINT = { white: "#e9edf2", silver: "#b9c2cc", black: "#2a2f36", blue: "#3b6fb5", red: "#c0432f", green: "#2f7d62" };

  // id, make, model, year, price, miles, body, fuel, trans, paint, featured, badge
  const V = [
    ["v1", "Tesla", "Model 3 Long Range", 2023, 42990, 8200, "Sedan", "Electric", "Auto", "white", true, "Hot"],
    ["v2", "Toyota", "RAV4 Hybrid XLE", 2022, 31450, 21400, "SUV", "Hybrid", "Auto", "silver", true, ""],
    ["v3", "Ford", "F-150 Lariat", 2021, 38900, 33100, "Truck", "Petrol", "Auto", "blue", false, ""],
    ["v4", "Honda", "Civic Sport", 2023, 26350, 5400, "Sedan", "Petrol", "Manual", "red", true, "New in"],
    ["v5", "BMW", "i4 eDrive40", 2023, 51990, 9800, "Sedan", "Electric", "Auto", "black", true, ""],
    ["v6", "Mazda", "CX-5 Touring", 2022, 28700, 18900, "SUV", "Petrol", "Auto", "silver", false, ""],
    ["v7", "Hyundai", "Ioniq 5", 2023, 44600, 7600, "SUV", "Electric", "Auto", "white", true, "Hot"],
    ["v8", "Volkswagen", "Golf GTI", 2021, 27950, 24500, "Hatch", "Petrol", "Manual", "red", false, ""],
    ["v9", "Subaru", "Outback Premium", 2022, 30900, 19800, "SUV", "Petrol", "Auto", "green", false, ""],
    ["v10", "Kia", "EV6 GT-Line", 2023, 47300, 6100, "SUV", "Electric", "Auto", "blue", true, "New in"],
    ["v11", "Toyota", "Corolla Hybrid", 2022, 24100, 22600, "Hatch", "Hybrid", "Auto", "white", false, ""],
    ["v12", "Audi", "Q5 Quattro", 2021, 39800, 28700, "SUV", "Petrol", "Auto", "black", false, ""],
    ["v13", "Chevrolet", "Silverado LT", 2020, 34500, 41200, "Truck", "Petrol", "Auto", "silver", false, ""],
    ["v14", "Nissan", "Leaf SV Plus", 2022, 27600, 15300, "Hatch", "Electric", "Auto", "blue", false, ""],
    ["v15", "Mercedes-Benz", "C300", 2022, 45900, 16800, "Sedan", "Petrol", "Auto", "white", false, ""],
    ["v16", "Honda", "CR-V EX-L", 2023, 33200, 9100, "SUV", "Hybrid", "Auto", "silver", true, ""],
  ].map(([id, make, model, year, price, miles, body, fuel, trans, paint, featured, badge]) => ({
    id, make, model, year, price, miles, body, fuel, trans, paint, featured, badge,
    name: `${year} ${make} ${model}`,
    image: carImage({ color: PAINT[paint], body }),
  }));

  window.AUTOHUB = {
    vehicles: V,
    makes: [...new Set(V.map((v) => v.make))].sort(),
    bodies: [...new Set(V.map((v) => v.body))],
    fuels: [...new Set(V.map((v) => v.fuel))],
    usps: [
      ["shield", "7-day returns", "Not in love? Bring it back."],
      ["check", "Every car inspected", "150-point quality check."],
      ["spark", "Instant finance", "Soft-check pre-approval."],
      ["tag", "No hidden fees", "The price you see is the price you pay."],
    ],
    financeTicks: ["Soft credit check — no score impact", "Decision in under 60 seconds", "Flexible terms from 12–84 months", "Trade-in valuation included"],
    carImage,
  };
})();
