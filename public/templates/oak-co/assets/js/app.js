/* ==========================================================================
   Oak & Co — App logic: header/footer, wood + category catalogue filters,
   a materials accordion, and an enquiry form (prefilled from "Enquire"
   buttons) with client-side validation. No cart — this is a catalogue.
   ========================================================================== */
(function () {
  "use strict";
  const D = window.OAKCO;
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => "$" + Number(n).toLocaleString("en-US");

  const ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 13 4 4L19 7"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  };

  let toastT;
  function toast(m) { const t = qs("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2800); }

  function injectChrome() {
    qs("#site-header").innerHTML = `
      <header class="nav" id="nav">
        <div class="container nav__inner">
          <a class="brand" href="#home">Oak&nbsp;&amp;&nbsp;Co<span>.</span></a>
          <nav class="nav__links" id="nav-links">
            <a href="#catalogue">Catalogue</a><a href="#materials">Woods</a><a href="#feature">Workshop</a>
            <a class="btn btn--accent btn--sm" href="#enquiry">Enquire</a>
          </nav>
          <button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false">&#9776;</button>
        </div>
      </header>`;
    qs("#site-footer").innerHTML = `
      <footer class="footer">
        <div class="container footer__grid">
          <div><a class="brand brand--light" href="#home">Oak&nbsp;&amp;&nbsp;Co<span>.</span></a><p>A small workshop making heirloom timber furniture to order, one piece at a time.</p></div>
          <div><h4>The workshop</h4><p>${ICON.pin} Unit 5, The Sawmill, Greenfield</p><p>${ICON.mail} hello@oakandco.demo</p><p>Visits by appointment</p></div>
          <div><h4>Catalogue</h4><a href="#catalogue">Tables</a><a href="#catalogue">Seating</a><a href="#catalogue">Storage</a></div>
        </div>
        <div class="container footer__base"><span>© ${new Date().getFullYear()} Oak &amp; Co Workshop</span><span>A StrtDigital template demo</span></div>
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

  /* ---- Catalogue filters --------------------------------------------- */
  const state = { wood: "All", cat: "All" };
  function pill(group, value) { return `<button class="pill${value === "All" ? " on" : ""}" data-group="${group}" data-value="${value}">${value}</button>`; }
  function buildFilters() {
    qs("#wood-filters").insertAdjacentHTML("beforeend", ["All", ...D.woods].map((w) => pill("wood", w)).join(""));
    qs("#cat-filters").insertAdjacentHTML("beforeend", ["All", ...D.categories].map((c) => pill("cat", c)).join(""));
    qsa(".pill").forEach((b) => b.addEventListener("click", () => {
      state[b.dataset.group] = b.dataset.value;
      qsa(`.pill[data-group="${b.dataset.group}"]`).forEach((x) => x.classList.toggle("on", x === b));
      render();
    }));
    qs("#reset").addEventListener("click", () => {
      state.wood = "All"; state.cat = "All";
      qsa(".pill").forEach((x) => x.classList.toggle("on", x.dataset.value === "All"));
      render();
    });
  }
  function render() {
    const list = D.products.filter((p) => (state.wood === "All" || p.wood === state.wood) && (state.cat === "All" || p.category === state.cat));
    qs("#empty").hidden = list.length !== 0;
    qs("#cat-grid").innerHTML = list.map((p) => `
      <article class="piece">
        <div class="piece__media"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="piece__wood">${p.wood}</span></div>
        <div class="piece__body">
          <h3>${p.name}</h3>
          <p>${p.blurb}</p>
          <div class="piece__foot"><span class="piece__price">from ${money(p.from)}</span><button class="link-btn" data-enquire="${p.name}">Enquire →</button></div>
        </div>
      </article>`).join("");
    qsa("[data-enquire]", qs("#cat-grid")).forEach((b) => b.addEventListener("click", () => enquire(b.dataset.enquire)));
  }

  /* ---- Accordion ----------------------------------------------------- */
  function buildAccordion() {
    qs("#accordion").innerHTML = D.accordion.map((a, i) => `
      <div class="acc${i === 0 ? " open" : ""}">
        <button class="acc__head" aria-expanded="${i === 0}">
          <span class="acc__dot" style="--c:${D.WOOD[a.wood]}"></span>${a.wood}
          <span class="acc__sign" aria-hidden="true">+</span>
        </button>
        <div class="acc__body"><p>${a.desc}</p><p class="acc__finish">Recommended finish — <strong>${a.finish}</strong></p></div>
      </div>`).join("");
    qsa(".acc__head").forEach((h) => h.addEventListener("click", () => {
      const acc = h.parentElement, open = acc.classList.contains("open");
      qsa(".acc").forEach((a) => { a.classList.remove("open"); a.querySelector(".acc__head").setAttribute("aria-expanded", "false"); });
      if (!open) { acc.classList.add("open"); h.setAttribute("aria-expanded", "true"); }
    }));
  }

  /* ---- Enquiry ------------------------------------------------------- */
  function enquire(piece) {
    if (piece) qs("#e-piece").value = piece;
    qs("#enquiry").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => qs("#e-name").focus(), 500);
    toast(`Enquiry started for ${piece}`);
  }
  function wireForm() {
    qs("#e-wood").insertAdjacentHTML("beforeend", D.woods.map((w) => `<option>${w}</option>`).join(""));
    const form = qs("#enquiry-form"), msg = form.querySelector(".form-msg");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = qs("#e-name"), email = qs("#e-email"), message = qs("#e-msg"), bad = [];
      if (name.value.trim().length < 2) bad.push(name);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) bad.push(email);
      if (message.value.trim().length < 10) bad.push(message);
      qsa("input,textarea", form).forEach((i) => i.classList.remove("invalid"));
      if (bad.length) { bad.forEach((i) => i.classList.add("invalid")); msg.textContent = "Please complete the highlighted fields (tell us a little about the project)."; msg.className = "form-msg err"; bad[0].focus(); return; }
      msg.textContent = "✓ Thank you — we'll reply within two working days with options and a quote.";
      msg.className = "form-msg ok";
      toast("Enquiry sent (demo)"); form.reset();
    });
    // global delegation for the feature-section enquire button
    qsa("[data-enquire]").forEach((b) => { if (!b.closest("#cat-grid")) b.addEventListener("click", () => enquire(b.dataset.enquire)); });
  }

  function fillStatic() {
    qs("#hero-bg").style.backgroundImage = `url("${D.heroBg}")`;
    qs("#feature-img").style.backgroundImage = `url("${D.featureImg}")`;
    qs("#feature-list").innerHTML = D.featureList.map((t) => `<li>${ICON.check}${t}</li>`).join("");
    qs("#enquiry-ticks").innerHTML = D.enquiryTicks.map((t) => `<li>${ICON.check}${t}</li>`).join("");
  }

  injectChrome(); fillStatic();
  buildFilters(); render(); buildAccordion(); wireForm(); observeReveal();
})();
