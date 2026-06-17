/* ==========================================================================
   AutoHub — App logic: header/footer injection, inventory filtering & sort,
   vehicle quick-view modal, and client-side form validation (stubbed submit).
   ========================================================================== */
(function () {
  "use strict";
  const D = window.AUTOHUB;
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => "$" + Number(n).toLocaleString("en-US");
  const miles = (n) => n.toLocaleString("en-US") + " mi";

  const ICON = {
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13"/><path d="M3 13h18v4H3z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 13 4 4L19 7"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3v6m0 6v6M3 12h6m6 0h6"/><path d="m6 6 3 3m6 6 3 3M18 6l-3 3M9 15l-3 3"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 12V4h8l9 9-8 8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
    fuel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="4" width="9" height="16" rx="2"/><path d="M13 9h3a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3"/></svg>',
    gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 14l4-3"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4m8-4v4"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  };

  /* ---- Toast --------------------------------------------------------- */
  let toastT;
  function toast(msg) {
    const t = qs("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 3200);
  }

  /* ---- Header / footer (shared, injected) ---------------------------- */
  function injectChrome() {
    qs("#site-header").innerHTML = `
      <header class="nav" id="nav">
        <div class="container nav__inner">
          <a class="brand" href="#main">${ICON.car}<span>Auto<b>Hub</b></span></a>
          <nav class="nav__links" id="nav-links">
            <a href="#inventory">Inventory</a>
            <a href="#finance">Finance</a>
            <a href="#" data-scroll="finance">Sell your car</a>
            <a class="btn btn--accent btn--sm" href="#finance">Book test drive</a>
          </nav>
          <button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false">${ICON.car}</button>
        </div>
      </header>`;
    qs("#site-footer").innerHTML = `
      <footer class="footer">
        <div class="container footer__grid">
          <div>
            <a class="brand brand--light" href="#main">${ICON.car}<span>Auto<b>Hub</b></span></a>
            <p>Honest pricing, inspected cars, and finance that fits. Serving drivers since 2009.</p>
          </div>
          <div><h4>Visit us</h4><p>${ICON.pin} 42 Forecourt Rd, Springfield</p><p>${ICON.phone} (555) 018-2255</p><p>Mon–Sat · 9am–6pm</p></div>
          <div><h4>Shop</h4><a href="#inventory">All inventory</a><a href="#inventory">Electric &amp; hybrid</a><a href="#finance">Finance options</a></div>
        </div>
        <div class="container footer__base"><span>© ${new Date().getFullYear()} AutoHub Motors</span><span>A StrtDigital template demo</span></div>
      </footer>`;

    const burger = qs("#burger"), links = qs("#nav-links");
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    // smooth-close mobile menu on link tap
    qsa("a", links).forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));
    addEventListener("scroll", () => qs("#nav").classList.toggle("scrolled", scrollY > 20), { passive: true });
  }

  /* ---- Reveal on scroll ---------------------------------------------- */
  function observeReveal() {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    qsa("[data-reveal]").forEach((el) => io.observe(el));
  }

  /* ---- Filter state -------------------------------------------------- */
  const state = { q: "", make: "", body: "", fuel: "", maxPrice: 80000, sort: "featured" };

  function option(label, value) { return `<option value="${value}">${label}</option>`; }
  function chip(group, value, label) {
    return `<button type="button" class="chip" data-group="${group}" data-value="${value}">${label}</button>`;
  }

  function buildFilters() {
    // hero quick-search selects
    qs("#q-make").innerHTML = option("Any make", "") + D.makes.map((m) => option(m, m)).join("");
    qs("#q-body").innerHTML = option("Any body", "") + D.bodies.map((b) => option(b, b)).join("");
    // sidebar chip groups
    qs("#fg-make").insertAdjacentHTML("beforeend", D.makes.map((m) => chip("make", m, m)).join(""));
    qs("#fg-body").insertAdjacentHTML("beforeend", D.bodies.map((b) => chip("body", b, b)).join(""));
    qs("#fg-fuel").insertAdjacentHTML("beforeend", D.fuels.map((f) => chip("fuel", f, f)).join(""));

    qsa(".chip").forEach((c) => c.addEventListener("click", () => {
      const g = c.dataset.group, v = c.dataset.value;
      state[g] = state[g] === v ? "" : v;                 // toggle single-select per group
      syncChips(); render();
    }));
    qs("#f-search").addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); render(); });
    qs("#f-price").addEventListener("input", (e) => {
      state.maxPrice = +e.target.value;
      qs("#f-price-out").textContent = money(state.maxPrice);
      render();
    });
    qs("#f-sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
    qs("#clear-filters").addEventListener("click", resetFilters);
    qs("#reset-empty").addEventListener("click", resetFilters);
    qs("#filter-toggle").addEventListener("click", () => {
      const open = qs("#filters").classList.toggle("open");
      qs("#filter-toggle").setAttribute("aria-expanded", String(open));
    });
  }

  function syncChips() {
    qsa(".chip").forEach((c) => c.classList.toggle("on", state[c.dataset.group] === c.dataset.value));
  }
  function resetFilters() {
    Object.assign(state, { q: "", make: "", body: "", fuel: "", maxPrice: 80000, sort: "featured" });
    qs("#f-search").value = ""; qs("#f-price").value = 80000; qs("#f-price-out").textContent = money(80000);
    qs("#f-sort").value = "featured"; syncChips(); render();
  }

  /* ---- Render results ------------------------------------------------ */
  function filtered() {
    let list = D.vehicles.filter((v) => {
      if (state.make && v.make !== state.make) return false;
      if (state.body && v.body !== state.body) return false;
      if (state.fuel && v.fuel !== state.fuel) return false;
      if (v.price > state.maxPrice) return false;
      if (state.q && !`${v.name} ${v.body} ${v.fuel} ${v.trans}`.toLowerCase().includes(state.q)) return false;
      return true;
    });
    const by = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "year-desc": (a, b) => b.year - a.year,
      "miles-asc": (a, b) => a.miles - b.miles,
      featured: (a, b) => (b.featured - a.featured) || a.price - b.price,
    }[state.sort];
    return list.sort(by);
  }

  function card(v) {
    return `<article class="car" data-id="${v.id}">
      <div class="car__media">
        <img src="${v.image}" alt="${v.name}" loading="lazy">
        ${v.badge ? `<span class="car__badge">${v.badge}</span>` : ""}
        <button class="car__save" aria-label="Save ${v.name}" data-save>${ICON.shield}</button>
      </div>
      <div class="car__body">
        <div class="car__top"><h3>${v.name}</h3><span class="car__price">${money(v.price)}</span></div>
        <ul class="car__specs">
          <li>${ICON.cal}${v.year}</li><li>${ICON.gauge}${miles(v.miles)}</li>
          <li>${ICON.fuel}${v.fuel}</li><li>${ICON.gear}${v.trans}</li>
        </ul>
        <div class="car__cta">
          <button class="btn btn--ghost btn--sm" data-view>View details</button>
          <button class="btn btn--accent btn--sm" data-drive>Test drive</button>
        </div>
      </div>
    </article>`;
  }

  function render() {
    const list = filtered(), grid = qs("#car-grid");
    grid.innerHTML = list.map(card).join("");
    qs("#empty").hidden = list.length !== 0;
    qs("#result-count").textContent = list.length === D.vehicles.length
      ? `Showing all ${list.length} cars`
      : `${list.length} car${list.length === 1 ? "" : "s"} match`;

    grid.querySelectorAll(".car").forEach((el) => {
      const v = D.vehicles.find((x) => x.id === el.dataset.id);
      el.querySelector("[data-view]").addEventListener("click", () => openModal(v));
      el.querySelector("[data-drive]").addEventListener("click", () => goFinance(v));
      el.querySelector("[data-save]").addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("on"); toast("Saved to your shortlist");
      });
      el.querySelector(".car__media img").addEventListener("click", () => openModal(v));
    });
  }

  /* ---- Quick-view modal ---------------------------------------------- */
  function openModal(v) {
    qs("#vm-body").innerHTML = `
      <div class="vm__media"><img src="${v.image}" alt="${v.name}"></div>
      <div class="vm__info">
        <span class="eyebrow">${v.body} · ${v.fuel}</span>
        <h2 id="vm-title">${v.name}</h2>
        <p class="vm__price">${money(v.price)}</p>
        <div class="vm__specs">
          <div>${ICON.cal}<span>Year</span><strong>${v.year}</strong></div>
          <div>${ICON.gauge}<span>Mileage</span><strong>${miles(v.miles)}</strong></div>
          <div>${ICON.gear}<span>Transmission</span><strong>${v.trans}</strong></div>
          <div>${ICON.fuel}<span>Fuel</span><strong>${v.fuel}</strong></div>
        </div>
        <p class="muted">Inspected and certified under our 150-point check. Estimated finance from <strong>${money(Math.round(v.price / 60))}/mo</strong> over 60 months.</p>
        <div class="vm__cta">
          <button class="btn btn--accent" data-drive>Book a test drive</button>
          <button class="btn btn--ghost" data-close>Keep browsing</button>
        </div>
      </div>`;
    const m = qs("#vehicle-modal");
    m.hidden = false; document.body.style.overflow = "hidden";
    m.querySelector("[data-drive]").addEventListener("click", () => { closeModal(); goFinance(v); });
  }
  function closeModal() { qs("#vehicle-modal").hidden = true; document.body.style.overflow = ""; }
  function goFinance(v) {
    qs("#fin-car").value = v ? v.name : "";
    qs("#finance").scrollIntoView({ behavior: "smooth" });
    if (v) toast(`We'll prep details for the ${v.make} ${v.model}`);
  }

  /* ---- Forms (client-side validation, simulated submit) -------------- */
  function wireForm() {
    const form = qs("#finance-form"), msg = form.querySelector(".form-msg");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const bad = [];
      const name = qs("#fin-name"), email = qs("#fin-email"), phone = qs("#fin-phone");
      if (name.value.trim().length < 2) bad.push(name);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) bad.push(email);
      if (phone.value.replace(/\D/g, "").length < 7) bad.push(phone);
      qsa("input", form).forEach((i) => i.classList.remove("invalid"));
      if (bad.length) {
        bad.forEach((i) => i.classList.add("invalid"));
        msg.textContent = "Please check the highlighted fields."; msg.className = "form-msg err";
        bad[0].focus(); return;
      }
      msg.textContent = "✓ Thanks! A finance specialist will email you within one business hour.";
      msg.className = "form-msg ok";
      form.reset();
      toast("Finance enquiry sent (demo)");
    });
  }

  /* ---- Hero quick-search funnels into the sidebar filters ------------ */
  function wireHeroSearch() {
    qs("#hero-search").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      state.make = f.make.value; state.body = f.body.value;
      state.maxPrice = f.budget.value ? +f.budget.value : 80000;
      qs("#f-price").value = state.maxPrice; qs("#f-price-out").textContent = money(state.maxPrice);
      syncChips(); render();
      qs("#inventory").scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ---- Static content blocks ----------------------------------------- */
  function fillStatic() {
    qs("#usp").innerHTML = D.usps.map(([ic, t, s], i) =>
      `<div class="usp__item" data-reveal style="transition-delay:${i * 60}ms">${ICON[ic]}<div><strong>${t}</strong><span>${s}</span></div></div>`).join("");
    qs("#finance-ticks").innerHTML = D.financeTicks.map((t) => `<li>${ICON.check}${t}</li>`).join("");
    qs("#stat-count").textContent = D.vehicles.length + "+";
  }

  /* ---- Init ---------------------------------------------------------- */
  injectChrome();
  fillStatic();
  buildFilters();
  render();
  wireForm();
  wireHeroSearch();
  observeReveal();
  // hero background art
  qs("#hero-bg").style.backgroundImage = `url("${D.carImage({ color: "#14B8C4", body: "SUV" })}")`;
  // modal close handlers
  qsa("[data-close]", qs("#vehicle-modal")).forEach((b) => b.addEventListener("click", closeModal));
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
})();
