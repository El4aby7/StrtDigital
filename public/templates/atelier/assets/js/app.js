/* ==========================================================================
   ATELIER — App logic: header/footer, full-bleed lookbook, shoppable look
   quick-view (per-item size selector + save-to-wishlist), a wishlist drawer
   (persisted), a campaign gallery, and a validated newsletter form.
   ========================================================================== */
(function () {
  "use strict";
  const D = window.ATELIER;
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => "$" + n;

  const ICON = {
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20s-7-4.5-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 15.5 12 20 12 20z"/></svg>',
    heartFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7-4.5-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 15.5 12 20 12 20z"/></svg>',
  };

  /* ---- Persistent wishlist ------------------------------------------- */
  const KEY = "atelier-wishlist";
  let wl = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } })();
  const persist = () => localStorage.setItem(KEY, JSON.stringify(wl));

  let toastT;
  function toast(m) { const t = qs("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600); }

  function injectChrome() {
    qs("#site-header").innerHTML = `
      <header class="nav" id="nav">
        <div class="container nav__inner">
          <a class="brand" href="#home">ATELIER</a>
          <nav class="nav__links" id="nav-links">
            <a href="#lookbook">Lookbook</a><a href="#gallery">Campaign</a>
            <button class="navwl" id="nav-wl" aria-label="Open wishlist">${ICON.heart}<span id="wl-count">0</span></button>
          </nav>
          <button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false">&#9776;</button>
        </div>
      </header>`;
    qs("#site-footer").innerHTML = `
      <footer class="footer">
        <div class="container footer__grid">
          <div><a class="brand brand--light" href="#home">ATELIER</a><p>An independent label exploring volume, movement and colour. Designed and made in small runs.</p></div>
          <div><h4>Explore</h4><a href="#lookbook">SS26 Lookbook</a><a href="#gallery">Campaign</a><a href="#home">Stockists</a></div>
          <div><h4>Connect</h4><a href="#">Instagram</a><a href="#">Newsletter</a><a href="#">hello@atelier.demo</a></div>
        </div>
        <div class="container footer__base"><span>© ${new Date().getFullYear()} ATELIER Studio</span><span>A StrtDigital template demo</span></div>
      </footer>`;
    const burger = qs("#burger"), links = qs("#nav-links");
    burger.addEventListener("click", () => { const o = links.classList.toggle("open"); burger.setAttribute("aria-expanded", String(o)); });
    qsa("a", links).forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));
    qs("#nav-wl").addEventListener("click", openWl);
    addEventListener("scroll", () => qs("#nav").classList.toggle("scrolled", scrollY > 40), { passive: true });
  }

  function observeReveal() {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    qsa("[data-reveal]").forEach((el) => io.observe(el));
  }

  /* ---- Lookbook ------------------------------------------------------ */
  function buildLooks() {
    qs("#looks").innerHTML = D.looks.map((l, i) => `
      <article class="look ${i % 2 ? "look--rev" : ""}">
        <div class="look__media"><img src="${l.image}" alt="${l.name}" loading="lazy"></div>
        <div class="look__copy" data-reveal>
          <span class="look__idx">${String(i + 1).padStart(2, "0")}</span>
          <h2>${l.name.split("—")[1] || l.name}</h2>
          <p>${l.note}</p>
          <ul class="look__items">${l.items.map((it) => `<li>${it.n} <span>${money(it.p)}</span></li>`).join("")}</ul>
          <button class="btn btn--dark" data-look="${l.id}">Shop this look</button>
        </div>
      </article>`).join("");
    qsa("[data-look]").forEach((b) => b.addEventListener("click", () => openLook(b.dataset.look)));
  }

  /* ---- Look quick-view (size selector per item + save) --------------- */
  function openLook(id) {
    const l = D.looks.find((x) => x.id === id);
    const total = l.items.reduce((s, it) => s + it.p, 0);
    qs("#lm-body").innerHTML = `
      <div class="lm">
        <div class="lm__media"><img src="${l.image}" alt="${l.name}"></div>
        <div class="lm__info">
          <h2 id="lm-title">${l.name}</h2>
          <p class="muted">${l.note}</p>
          <div class="lm__items">
            ${l.items.map((it, idx) => `
              <div class="lmitem" data-idx="${idx}">
                <div class="lmitem__top"><strong>${it.n}</strong><span>${money(it.p)}</span></div>
                <div class="sizes" role="group" aria-label="Size for ${it.n}">
                  ${D.sizes.map((s) => `<button class="size" data-size="${s}">${s}</button>`).join("")}
                </div>
                <button class="lmitem__save" data-save="${it.n}">${ICON.heart}<span>Save</span></button>
              </div>`).join("")}
          </div>
          <div class="lm__foot">
            <span>Complete look · <strong>${money(total)}</strong></span>
            <button class="btn btn--dark btn--block" id="save-all">Save whole look</button>
          </div>
        </div>
      </div>`;

    // per-item size selection
    qsa("#lm-body .lmitem").forEach((row) => {
      qsa(".size", row).forEach((b) => b.addEventListener("click", () => {
        qsa(".size", row).forEach((x) => x.classList.toggle("on", x === b));
      }));
      row.querySelector("[data-save]").addEventListener("click", () => {
        const size = (row.querySelector(".size.on") || {}).dataset?.size;
        if (!size) { row.querySelector(".sizes").classList.add("shake"); setTimeout(() => row.querySelector(".sizes").classList.remove("shake"), 400); toast("Pick a size first"); return; }
        save({ name: row.querySelector("strong").textContent, size, look: l.name, image: l.image });
      });
    });
    qs("#save-all").addEventListener("click", () => {
      // require every item to have a size
      const rows = qsa("#lm-body .lmitem");
      const missing = rows.filter((r) => !r.querySelector(".size.on"));
      if (missing.length) { missing.forEach((r) => { r.querySelector(".sizes").classList.add("shake"); setTimeout(() => r.querySelector(".sizes").classList.remove("shake"), 400); }); toast("Choose a size for each piece"); return; }
      rows.forEach((r) => save({ name: r.querySelector("strong").textContent, size: r.querySelector(".size.on").dataset.size, look: l.name, image: l.image }, true));
      closeLook(); openWl(); toast("Look saved to wishlist");
    });

    qs("#look-modal").hidden = false; document.body.style.overflow = "hidden";
  }
  function closeLook() { qs("#look-modal").hidden = true; document.body.style.overflow = ""; }

  /* ---- Wishlist ------------------------------------------------------ */
  function save(item, silent) {
    const key = `${item.name}|${item.size}`;
    if (wl.some((w) => w.key === key)) { if (!silent) toast("Already saved"); return; }
    wl.push({ ...item, key }); afterChange();
    if (!silent) toast(`Saved ${item.name} (${item.size})`);
  }
  function afterChange() { persist(); qs("#wl-count").textContent = wl.length; renderWl(); }
  function renderWl() {
    const empty = qs("#wl-empty");
    if (!wl.length) { qs("#wl-items").innerHTML = ""; empty.hidden = false; return; }
    empty.hidden = true;
    qs("#wl-items").innerHTML = wl.map((w) => `
      <div class="wlitem">
        <img src="${w.image}" alt="">
        <div class="wlitem__info"><strong>${w.name}</strong><span>${w.look} · Size ${w.size}</span></div>
        <button class="wlitem__rm" data-rm="${w.key}" aria-label="Remove">&times;</button>
      </div>`).join("");
    qsa("[data-rm]").forEach((b) => b.addEventListener("click", () => { wl = wl.filter((w) => w.key !== b.dataset.rm); afterChange(); }));
  }
  function openWl() { qs("#wishlist").hidden = false; document.body.style.overflow = "hidden"; }
  function closeWl() { qs("#wishlist").hidden = true; document.body.style.overflow = ""; }

  /* ---- Gallery ------------------------------------------------------- */
  function buildGallery() {
    qs("#gallery-strip").innerHTML = D.gallery.map((img, i) =>
      `<figure class="gframe" data-reveal style="transition-delay:${(i % 3) * 70}ms"><img src="${img}" alt="ATELIER campaign ${i + 1}" loading="lazy"></figure>`).join("");
  }

  /* ---- Newsletter ---------------------------------------------------- */
  function wireForms() {
    qsa("[data-lm-close]").forEach((b) => b.addEventListener("click", closeLook));
    qsa("[data-wl-close]").forEach((b) => b.addEventListener("click", closeWl));
    addEventListener("keydown", (e) => { if (e.key === "Escape") { closeLook(); closeWl(); } });

    const form = qs("#news-form"), msg = qs("#news-msg"), email = qs("#news-email");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      email.classList.remove("invalid");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) { email.classList.add("invalid"); msg.textContent = "Please enter a valid email."; msg.className = "form-msg err"; return; }
      msg.textContent = "✓ You're on the list — SS26 early access incoming."; msg.className = "form-msg ok";
      form.reset(); toast("Subscribed (demo)");
    });
  }

  function fillStatic() { qs("#hero-bg").style.backgroundImage = `url("${D.heroImg}")`; }

  injectChrome(); fillStatic();
  buildLooks(); buildGallery(); wireForms();
  afterChange(); observeReveal();
})();
