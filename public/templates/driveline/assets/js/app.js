/* ==========================================================================
   DriveLine — App logic: header/footer, live configurator (paint/trim/options
   drive the render + running price), spec tabs, and a validated test-drive form.
   ========================================================================== */
(function () {
  "use strict";
  const D = window.DRIVELINE;
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => "$" + Number(n).toLocaleString("en-US");

  const ICON = {
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 13 4 4L19 7"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  };

  let toastT;
  function toast(msg) { const t = qs("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 3000); }

  /* ---- Chrome -------------------------------------------------------- */
  function injectChrome() {
    qs("#site-header").innerHTML = `
      <header class="nav" id="nav">
        <div class="container nav__inner">
          <a class="brand" href="#main">Drive<b>Line</b></a>
          <nav class="nav__links" id="nav-links">
            <a href="#configurator">Configure</a><a href="#specs">Specs</a><a href="#test-drive">Test drive</a>
            <a class="btn btn--accent btn--sm" href="#configurator">Build yours</a>
          </nav>
          <button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false">&#9776;</button>
        </div>
      </header>`;
    qs("#site-footer").innerHTML = `
      <footer class="footer">
        <div class="container footer__grid">
          <div><a class="brand brand--light" href="#main">Drive<b>Line</b></a><p>The electric coupe, built around you. Reserve, configure and drive — all in one place.</p></div>
          <div><h4>Showroom</h4><p>${ICON.pin} 9 Voltage Way, Metro City</p><p>${ICON.phone} (555) 700-3100</p><p>Open daily · 10am–8pm</p></div>
          <div><h4>Explore</h4><a href="#configurator">Configurator</a><a href="#specs">Full specs</a><a href="#test-drive">Book a drive</a></div>
        </div>
        <div class="container footer__base"><span>© ${new Date().getFullYear()} DriveLine EV</span><span>A StrtDigital template demo</span></div>
      </footer>`;
    const burger = qs("#burger"), links = qs("#nav-links");
    burger.addEventListener("click", () => { const o = links.classList.toggle("open"); burger.setAttribute("aria-expanded", String(o)); });
    qsa("a", links).forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));
    addEventListener("scroll", () => qs("#nav").classList.toggle("scrolled", scrollY > 20), { passive: true });
  }

  function observeReveal() {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    qsa("[data-reveal]").forEach((el) => io.observe(el));
  }

  /* ---- Configurator state ------------------------------------------- */
  const build = { paint: D.PAINTS[0], trim: D.TRIMS[0], addons: new Set() };

  function renderCar() {
    const url = D.carRender(build.paint.hex);
    qs("#hero-car").src = url; qs("#cfg-car").src = url;
    qs("#paint-name").textContent = build.paint.name;
  }

  function buildSwatches() {
    qs("#swatches").innerHTML = D.PAINTS.map((p) =>
      `<button class="swatch" data-id="${p.id}" title="${p.name}${p.price ? " (+" + money(p.price) + ")" : ""}" style="--c:${p.hex}" aria-label="${p.name}"></button>`).join("");
    qsa("#swatches .swatch").forEach((b) => b.addEventListener("click", () => {
      build.paint = D.PAINTS.find((p) => p.id === b.dataset.id);
      qsa("#swatches .swatch").forEach((x) => x.classList.toggle("on", x === b));
      renderCar(); price();
    }));
    qs("#swatches .swatch").classList.add("on");
  }

  function buildTrims() {
    qs("#trims").innerHTML = D.TRIMS.map((t) => `
      <button class="trim" data-id="${t.id}">
        <div class="trim__head"><strong>${t.name}</strong><span>${money(t.price)}</span></div>
        <p>${t.tag}</p>
        <ul><li>${t.power}</li><li>${t.zero60} 0–60</li><li>${t.range}</li></ul>
      </button>`).join("");
    qsa("#trims .trim").forEach((b) => b.addEventListener("click", () => {
      build.trim = D.TRIMS.find((t) => t.id === b.dataset.id);
      qsa("#trims .trim").forEach((x) => x.classList.toggle("on", x === b));
      price();
    }));
    qs("#trims .trim").classList.add("on");
  }

  function buildAddons() {
    qs("#addons").innerHTML = D.ADDONS.map((a) => `
      <label class="addon">
        <input type="checkbox" value="${a.id}">
        <span class="addon__txt"><strong>${a.name}</strong><em>${a.desc}</em></span>
        <span class="addon__price">+${money(a.price)}</span>
      </label>`).join("");
    qsa("#addons input").forEach((cb) => cb.addEventListener("change", () => {
      cb.checked ? build.addons.add(cb.value) : build.addons.delete(cb.value);
      cb.closest(".addon").classList.toggle("on", cb.checked);
      price();
    }));
  }

  function optionsTotal() {
    let sum = build.paint.price;
    build.addons.forEach((id) => sum += D.ADDONS.find((a) => a.id === id).price);
    return sum;
  }

  function price() {
    const base = build.trim.price, opts = optionsTotal(), total = base + opts;
    qs("#sum-trim").textContent = build.trim.name;
    qs("#sum-base").textContent = money(base);
    qs("#sum-opts").textContent = (opts ? "+" : "") + money(opts);
    qs("#sum-total").textContent = money(total);
    qs("#sum-month").textContent = money(Math.round(total / 60));
    qs("#hero-price").textContent = money(D.TRIMS[0].price);
    renderDriveBuild(total);
  }

  function renderDriveBuild(total) {
    const opts = [...build.addons].map((id) => D.ADDONS.find((a) => a.id === id).name);
    qs("#drive-build").innerHTML = `
      <div class="chiprow">
        <span class="bchip">${build.trim.name}</span>
        <span class="bchip" style="--c:${build.paint.hex}"><i></i>${build.paint.name}</span>
        ${opts.map((o) => `<span class="bchip">${o}</span>`).join("")}
      </div>
      <p class="drive__total">Your build: <strong>${money(total)}</strong></p>`;
  }

  /* ---- Spec tabs ----------------------------------------------------- */
  function buildTabs() {
    qs("#tab-nav").innerHTML = D.specTabs.map((t, i) =>
      `<button role="tab" class="tab${i === 0 ? " on" : ""}" data-id="${t.id}" aria-selected="${i === 0}">${t.label}</button>`).join("");
    qs("#tab-panels").innerHTML = D.specTabs.map((t, i) =>
      `<div class="tab-panel${i === 0 ? " on" : ""}" data-id="${t.id}">
        ${t.rows.map(([k, v]) => `<div class="spec-row"><span>${k}</span><strong>${v}</strong></div>`).join("")}
      </div>`).join("");
    qsa("#tab-nav .tab").forEach((b) => b.addEventListener("click", () => {
      qsa("#tab-nav .tab").forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-selected", String(on)); });
      qsa("#tab-panels .tab-panel").forEach((p) => p.classList.toggle("on", p.dataset.id === b.dataset.id));
    }));
  }

  /* ---- Forms --------------------------------------------------------- */
  function wireForm() {
    const form = qs("#drive-form"), msg = form.querySelector(".form-msg");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const bad = [];
      const fields = { name: qs("#d-name"), email: qs("#d-email"), phone: qs("#d-phone"), date: qs("#d-date"), time: qs("#d-time") };
      if (fields.name.value.trim().length < 2) bad.push(fields.name);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email.value)) bad.push(fields.email);
      if (fields.phone.value.replace(/\D/g, "").length < 7) bad.push(fields.phone);
      if (!fields.date.value) bad.push(fields.date);
      if (!fields.time.value) bad.push(fields.time);
      qsa("input,select", form).forEach((i) => i.classList.remove("invalid"));
      if (bad.length) { bad.forEach((i) => i.classList.add("invalid")); msg.textContent = "Please complete the highlighted fields."; msg.className = "form-msg err"; bad[0].focus(); return; }
      msg.textContent = `✓ Booked! Your ${build.trim.name} DL-One in ${build.paint.name} will be ready. Check your email for confirmation.`;
      msg.className = "form-msg ok";
      toast("Test drive booked (demo)");
      form.reset();
    });
    qs("#reserve-btn").addEventListener("click", () => { qs("#test-drive").scrollIntoView({ behavior: "smooth" }); toast("Build saved — pick a test-drive slot"); });
    // sensible min date = today
    qs("#d-date").min = new Date().toISOString().split("T")[0];
  }

  /* ---- Showroom angle dots (re-tint to fake angle changes) ----------- */
  function buildAngles() {
    const dots = ["Front 3/4", "Profile", "Rear"];
    qs("#angle-dots").innerHTML = dots.map((d, i) => `<button class="dot${i === 0 ? " on" : ""}" title="${d}" aria-label="${d}"></button>`).join("");
    qsa("#angle-dots .dot").forEach((b, i) => b.addEventListener("click", () => {
      qsa("#angle-dots .dot").forEach((x) => x.classList.toggle("on", x === b));
      qs("#hero-car").style.transform = `scaleX(${i === 2 ? -1 : 1}) translateY(${i === 1 ? "-4px" : "0"})`;
    }));
  }

  function fillStatic() {
    qs("#ticker").innerHTML = (D.ticker.concat(D.ticker)).map((t) => `<span>${ICON.bolt}${t}</span>`).join("");
    qs("#hero-price").textContent = money(D.TRIMS[0].price);
  }

  /* ---- Init ---------------------------------------------------------- */
  injectChrome(); fillStatic();
  buildSwatches(); buildTrims(); buildAddons(); buildTabs(); buildAngles();
  renderCar(); price(); wireForm(); observeReveal();
})();
