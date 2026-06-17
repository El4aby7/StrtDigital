/* ==========================================================================
   Saffron — App logic: header/footer, course-tab + vegetarian menu filter,
   gallery lightbox (keyboard + prev/next), and a validated reservation form.
   ========================================================================== */
(function () {
  "use strict";
  const D = window.SAFFRON;
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];

  const ICON = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 13 4 4L19 7"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13z"/><path d="M5 19c3-4 6-6 9-7"/></svg>',
  };

  let toastT;
  function toast(m) { const t = qs("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 3000); }

  function injectChrome() {
    qs("#site-header").innerHTML = `
      <header class="nav" id="nav">
        <div class="container nav__inner">
          <a class="brand" href="#home">Saffron</a>
          <nav class="nav__links" id="nav-links">
            <a href="#story">Our kitchen</a><a href="#menu">Menu</a><a href="#gallery">Gallery</a>
            <a class="btn btn--accent btn--sm" href="#reserve">Reserve</a>
          </nav>
          <button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false">&#9776;</button>
        </div>
      </header>`;
    qs("#site-footer").innerHTML = `
      <footer class="footer">
        <div class="container footer__grid">
          <div><a class="brand brand--light" href="#home">Saffron</a><p>A modern spice kitchen — bold flavour, honest sourcing, warm hospitality.</p></div>
          <div><h4>Find us</h4><p>${ICON.pin} 18 Lantern Lane, Old Town</p><p>${ICON.phone} (555) 240-7788</p></div>
          <div><h4>Hours</h4><p>${ICON.clock} Dinner Tue–Sun 5:30–11</p><p>${ICON.clock} Lunch Fri–Sun 12–3</p></div>
        </div>
        <div class="container footer__base"><span>© ${new Date().getFullYear()} Saffron Kitchen</span><span>A StrtDigital template demo</span></div>
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

  /* ---- Menu (course tabs + veg filter) ------------------------------- */
  let course = D.courses[0];
  function buildTabs() {
    qs("#course-tabs").innerHTML = D.courses.map((c, i) =>
      `<button role="tab" class="tab${i === 0 ? " on" : ""}" data-course="${c}" aria-selected="${i === 0}">${c}</button>`).join("");
    qsa("#course-tabs .tab").forEach((b) => b.addEventListener("click", () => {
      course = b.dataset.course;
      qsa("#course-tabs .tab").forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-selected", String(on)); });
      renderMenu();
    }));
    qs("#veg-only").addEventListener("change", renderMenu);
  }
  function renderMenu() {
    const vegOnly = qs("#veg-only").checked;
    const items = D.menu.filter((m) => m.course === course && (!vegOnly || m.veg));
    qs("#menu-empty").hidden = items.length !== 0;
    qs("#menu-list").innerHTML = items.map((m) => `
      <article class="dish" data-reveal>
        <div class="dish__main">
          <h3>${m.name} ${m.veg ? `<span class="dish__veg" title="Vegetarian">${ICON.leaf}</span>` : ""} ${m.sig ? `<span class="dish__sig">Signature</span>` : ""}</h3>
          <p>${m.desc}</p>
        </div>
        <span class="dish__dots"></span>
        <span class="dish__price">$${m.price}</span>
      </article>`).join("");
    qsa("#menu-list [data-reveal]").forEach((el) => el.classList.add("in"));
  }

  /* ---- Gallery + lightbox -------------------------------------------- */
  let lbIndex = 0;
  function buildGallery() {
    qs("#gallery-grid").innerHTML = D.gallery.map((g, i) => `
      <button class="gtile" data-i="${i}" data-reveal style="transition-delay:${(i % 3) * 70}ms">
        <img src="${g.img}" alt="${g.cap}" loading="lazy"><span>${g.cap}</span>
      </button>`).join("");
    qsa(".gtile").forEach((t) => t.addEventListener("click", () => openLb(+t.dataset.i)));
  }
  function openLb(i) {
    lbIndex = (i + D.gallery.length) % D.gallery.length;
    const g = D.gallery[lbIndex];
    qs("#lb-img").src = g.img; qs("#lb-img").alt = g.cap; qs("#lb-cap").textContent = g.cap;
    qs("#lightbox").hidden = false; document.body.style.overflow = "hidden";
  }
  function closeLb() { qs("#lightbox").hidden = true; document.body.style.overflow = ""; }
  function wireLightbox() {
    qs("[data-lb-close]").addEventListener("click", closeLb);
    qs("[data-lb-next]").addEventListener("click", () => openLb(lbIndex + 1));
    qs("[data-lb-prev]").addEventListener("click", () => openLb(lbIndex - 1));
    qs("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLb(); });
    addEventListener("keydown", (e) => {
      if (qs("#lightbox").hidden) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") openLb(lbIndex + 1);
      if (e.key === "ArrowLeft") openLb(lbIndex - 1);
    });
  }

  /* ---- Reservation form ---------------------------------------------- */
  function wireForm() {
    const form = qs("#reserve-form"), msg = form.querySelector(".form-msg");
    qs("#r-date").min = new Date().toISOString().split("T")[0];
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = {
        date: qs("#r-date"), time: qs("#r-time"), party: qs("#r-party"),
        phone: qs("#r-phone"), name: qs("#r-name"), email: qs("#r-email"),
      };
      const bad = [];
      if (!f.date.value) bad.push(f.date);
      if (!f.time.value) bad.push(f.time);
      if (!f.party.value) bad.push(f.party);
      if (f.phone.value.replace(/\D/g, "").length < 7) bad.push(f.phone);
      if (f.name.value.trim().length < 2) bad.push(f.name);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value)) bad.push(f.email);
      qsa("input,select", form).forEach((i) => i.classList.remove("invalid"));
      if (bad.length) { bad.forEach((i) => i.classList.add("invalid")); msg.textContent = "Please complete the highlighted fields."; msg.className = "form-msg err"; bad[0].focus(); return; }
      const dateTxt = new Date(f.date.value + "T00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
      msg.innerHTML = `✓ Table requested for <strong>${f.party.value}</strong> on <strong>${dateTxt}</strong> at <strong>${f.time.value}</strong>. We'll text ${f.phone.value} to confirm.`;
      msg.className = "form-msg ok";
      toast("Reservation requested (demo)");
      form.reset();
    });
  }

  function fillStatic() {
    qs("#hero-bg").style.backgroundImage = `url("${D.hero}")`;
    qs("#story-img").style.backgroundImage = `url("${D.story}")`;
    qs("#story-stats").innerHTML = D.stats.map(([n, l]) => `<div><strong>${n}</strong><span>${l}</span></div>`).join("");
    qs("#reserve-info").innerHTML = D.reserveInfo.map((t) => `<li>${ICON.check}${t}</li>`).join("");
  }

  injectChrome(); fillStatic();
  buildTabs(); renderMenu(); buildGallery(); wireLightbox(); wireForm(); observeReveal();
})();
