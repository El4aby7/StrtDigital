/* ==========================================================================
   ATELIER — Data + procedural imagery
   Editorial "photographs" are inline-SVG figure/garment compositions on bold
   colour fields (data-URIs); no binary assets.
   ========================================================================== */
(function () {
  "use strict";

  /* A cropped fashion-editorial figure: a stylised silhouette in a garment
     colour over a two-tone studio backdrop. `pose` shifts the composition. */
  function editorial(bg, garment, pose = 0) {
    const cx = 150 + (pose - 1) * 18;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 420'>
      <rect width='300' height='420' fill='${bg}'/>
      <rect width='300' height='${150 + pose * 30}' fill='#000' opacity='.07'/>
      <ellipse cx='${cx}' cy='405' rx='90' ry='20' fill='#000' opacity='.18'/>
      <circle cx='${cx}' cy='86' r='30' fill='#e9d9c5'/>
      <path d='M${cx - 8} 110 h16 v18 h-16z' fill='#e9d9c5'/>
      <path d='M${cx - 52} 150 Q${cx} 128 ${cx + 52} 150 L${cx + 44} 300 Q${cx} 320 ${cx - 44} 300 Z' fill='${garment}'/>
      <path d='M${cx - 52} 150 Q${cx - 80} 220 ${cx - 62} 280' stroke='${garment}' stroke-width='20' fill='none' stroke-linecap='round'/>
      <path d='M${cx + 52} 150 Q${cx + 80} 220 ${cx + 62} 280' stroke='${garment}' stroke-width='20' fill='none' stroke-linecap='round'/>
      <rect x='${cx - 30}' y='300' width='24' height='96' rx='10' fill='#1c1c1c'/>
      <rect x='${cx + 6}' y='300' width='24' height='96' rx='10' fill='#1c1c1c'/>
    </svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  // A bolder full-bleed variant for the hero (wider crop)
  function cover(bg, garment) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'>
      <rect width='600' height='700' fill='${bg}'/>
      <rect x='0' y='0' width='600' height='340' fill='#000' opacity='.06'/>
      <circle cx='300' cy='150' r='52' fill='#e9d9c5'/>
      <path d='M226 250 Q300 210 374 250 L356 520 Q300 552 244 520 Z' fill='${garment}'/>
      <path d='M226 250 Q150 360 192 500' stroke='${garment}' stroke-width='34' fill='none' stroke-linecap='round'/>
      <path d='M374 250 Q450 360 408 500' stroke='${garment}' stroke-width='34' fill='none' stroke-linecap='round'/>
      <rect x='262' y='520' width='32' height='160' rx='14' fill='#1c1c1c'/>
      <rect x='308' y='520' width='32' height='160' rx='14' fill='#1c1c1c'/>
    </svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  const PAL = { bone: "#e7e1d4", sand: "#d8c7ad", sky: "#a9c3cf", coral: "#e9573f", olive: "#7b7a4e", slate: "#5d6470", ink: "#1c1c1c", lilac: "#b6a8c9" };

  const SIZES = ["XS", "S", "M", "L", "XL"];

  // Six looks; each bundles 2–3 shoppable pieces.
  const LOOKS = [
    { id: "l1", name: "Look 01 — Drift", note: "Oversized poplin, raw-hem trouser.", bg: PAL.bone, garment: PAL.coral,
      items: [{ n: "Poplin Volume Shirt", p: 180 }, { n: "Raw-Hem Trouser", p: 220 }] },
    { id: "l2", name: "Look 02 — Tide", note: "Fluid knit over wide-leg denim.", bg: PAL.sky, garment: PAL.slate,
      items: [{ n: "Fluid Rib Knit", p: 160 }, { n: "Wide-Leg Denim", p: 195 }, { n: "Leather Mule", p: 240 }] },
    { id: "l3", name: "Look 03 — Ochre", note: "Tailored vest, pleated short.", bg: PAL.sand, garment: PAL.olive,
      items: [{ n: "Tailored Vest", p: 210 }, { n: "Pleated Short", p: 140 }] },
    { id: "l4", name: "Look 04 — Ash", note: "Deconstructed blazer, slip dress.", bg: PAL.slate, garment: PAL.bone,
      items: [{ n: "Deconstructed Blazer", p: 340 }, { n: "Bias Slip Dress", p: 230 }] },
    { id: "l5", name: "Look 05 — Bloom", note: "Cropped trench, column skirt.", bg: PAL.lilac, garment: PAL.ink,
      items: [{ n: "Cropped Trench", p: 380 }, { n: "Column Skirt", p: 200 }] },
    { id: "l6", name: "Look 06 — Sol", note: "Linen set, woven belt.", bg: PAL.coral, garment: PAL.bone,
      items: [{ n: "Linen Camp Shirt", p: 150 }, { n: "Linen Trouser", p: 175 }, { n: "Woven Belt", p: 90 }] },
  ].map((l, i) => ({ ...l, image: editorial(l.bg, l.garment, i % 3) }));

  const GALLERY = [
    cover(PAL.coral, PAL.bone), editorial(PAL.olive, PAL.bone, 1), editorial(PAL.sky, PAL.ink, 2),
    editorial(PAL.sand, PAL.coral, 0), cover(PAL.slate, PAL.sand), editorial(PAL.lilac, PAL.ink, 1),
  ];

  window.ATELIER = {
    looks: LOOKS, gallery: GALLERY, sizes: SIZES,
    heroImg: cover(PAL.bone, PAL.coral),
  };
})();
