/* ==========================================================================
   Maison — App logic: header/footer, room filter, quick-view with live
   material/size options driving the render + price, and a cart-preview drawer
   with qty steppers, totals and simulated checkout (persists on device).
   ========================================================================== */
(function () {
  "use strict";
  const D = window.MAISON;
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => "$" + Number(n).toLocaleString("en-US");

  const ICON = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 6h12v9H2zM14 9h4l3 3v3h-7"/><circle cx="6" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10z"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13z"/><path d="M5 19c3-4 6-6 9-7"/></svg>',
    tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 7a4 4 0 0 1-5 5l-6 6 2 2 6-6a4 4 0 0 0 5-5z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  };

  /* ---- Persistent cart ----------------------------------------------- */
  const KEY = "maison-cart";
  let cart = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } })();
  const persist = () => localStorage.setItem(KEY, JSON.stringify(cart));

  let toastT;
  function toast(m) { const t = qs("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600); }

  function injectChrome() {
    qs("#site-header").innerHTML = `
      <header class="nav" id="nav">
        <div class="container nav__inner">
          <a class="brand" href="#home">Maison</a>
          <nav class="nav__links" id="nav-links">
            <a href="#rooms">Rooms</a><a href="#shop">Shop</a><a href="#" data-scroll>Our promise</a>
            <button class="navcart" id="nav-cart" aria-label="Open bag">${ICON.bag}<span id="nav-count">0</span></button>
          </nav>
          <button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false">&#9776;</button>
        </div>
      </header>`;
    qs("#site-footer").innerHTML = `
      <footer class="footer">
        <div class="container footer__grid">
          <div><a class="brand brand--light" href="#home">Maison</a><p>Made-to-order furniture in natural materials. Designed to live with you for the long run.</p></div>
          <div><h4>Showroom</h4><p>${ICON.pin} 24 Maker's Yard, Riverside</p><p>Open Wed–Sun · 10–6</p></div>
          <div><h4>Shop</h4><a href="#shop">Living</a><a href="#shop">Bedroom</a><a href="#shop">Dining</a></div>
        </div>
        <div class="container footer__base"><span>© ${new Date().getFullYear()} Maison Living</span><span>A StrtDigital template demo</span></div>
      </footer>`;
    const burger = qs("#burger"), links = qs("#nav-links");
    burger.addEventListener("click", () => { const o = links.classList.toggle("open"); burger.setAttribute("aria-expanded", String(o)); });
    qsa("a", links).forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));
    qs("#nav-cart").addEventListener("click", openDrawer);
    addEventListener("scroll", () => qs("#nav").classList.toggle("scrolled", scrollY > 20), { passive: true });
  }

  function observeReveal() {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    qsa("[data-reveal]").forEach((el) => io.observe(el));
  }

  /* ---- Room cards + filter ------------------------------------------- */
  let room = "All";
  function buildRoomCards() {
    qs("#rooms-grid").innerHTML = D.roomCards.map((r, i) => `
      <button class="roomcard" data-room="${r.name}" data-reveal style="transition-delay:${i * 60}ms">
        <img src="${r.img}" alt="${r.name}"><div class="roomcard__txt"><strong>${r.name}</strong><span>${r.blurb}</span></div>
      </button>`).join("");
    qsa(".roomcard").forEach((b) => b.addEventListener("click", () => { setRoom(b.dataset.room); qs("#shop").scrollIntoView({ behavior: "smooth" }); }));
  }
  function buildRoomTabs() {
    qs("#room-tabs").innerHTML = D.rooms.map((r, i) => `<button class="rtab${i === 0 ? " on" : ""}" data-room="${r}">${r}</button>`).join("");
    qsa(".rtab").forEach((b) => b.addEventListener("click", () => setRoom(b.dataset.room)));
  }
  function setRoom(r) {
    room = r;
    qsa(".rtab").forEach((x) => x.classList.toggle("on", x.dataset.room === r));
    renderProducts();
  }
  function renderProducts() {
    const list = room === "All" ? D.products : D.products.filter((p) => p.room === room);
    qs("#product-grid").innerHTML = list.map((p) => `
      <article class="product" data-id="${p.id}">
        <div class="product__media"><img src="${p.image}" alt="${p.name}" loading="lazy"><button class="product__quick" data-quick="${p.id}">Quick view</button></div>
        <div class="product__body">
          <div class="product__top"><h3>${p.name}</h3><span class="product__price">${money(p.price)}</span></div>
          <p class="product__room">${p.room} · ${p.materials.length} finishes</p>
          <button class="btn btn--accent btn--sm btn--block" data-quick="${p.id}">Choose options</button>
        </div>
      </article>`).join("");
    qsa("[data-quick]").forEach((b) => b.addEventListener("click", () => openQuick(b.dataset.quick)));
  }

  /* ---- Quick view ---------------------------------------------------- */
  const sel = {};   // current option selection for the open product
  function openQuick(id) {
    const p = D.products.find((x) => x.id === id);
    sel.mat = p.mat; sel.size = p.sizes[0];
    qs("#qv-body").innerHTML = `
      <div class="qv">
        <div class="qv__media"><img id="qv-img" src="${p.image}" alt="${p.name}"></div>
        <div class="qv__info">
          <span class="eyebrow">${p.room}</span>
          <h2 id="qv-title">${p.name}</h2>
          <p class="qv__price" id="qv-price">${money(p.price)}</p>
          <p class="muted">Made to order in 4–6 weeks. Free delivery to your room of choice.</p>
          <div class="qv__opt"><span class="qv__lbl">Material — <strong id="qv-matname">${p.mat}</strong></span>
            <div class="qv__mats" id="qv-mats"></div></div>
          <div class="qv__opt"><span class="qv__lbl">Size / config</span>
            <div class="qv__sizes" id="qv-sizes"></div></div>
          <button class="btn btn--accent btn--block" id="qv-add">Add to bag — <span id="qv-add-price">${money(p.price)}</span></button>
        </div>
      </div>`;
    qs("#qv-mats").innerHTML = p.materials.map((m) =>
      `<button class="matdot${m === sel.mat ? " on" : ""}" data-mat="${m}" title="${m}" style="--c:${D.MAT[m]}" aria-label="${m}"></button>`).join("");
    qs("#qv-sizes").innerHTML = p.sizes.map((s, i) =>
      `<button class="sizebtn${i === 0 ? " on" : ""}" data-size="${s}">${s}</button>`).join("");

    qsa("#qv-mats .matdot").forEach((b) => b.addEventListener("click", () => {
      sel.mat = b.dataset.mat;
      qsa("#qv-mats .matdot").forEach((x) => x.classList.toggle("on", x === b));
      qs("#qv-matname").textContent = sel.mat;
      qs("#qv-img").src = D.furniture(p.type, D.MAT[sel.mat]);
    }));
    qsa("#qv-sizes .sizebtn").forEach((b) => b.addEventListener("click", () => {
      sel.size = b.dataset.size;
      qsa("#qv-sizes .sizebtn").forEach((x) => x.classList.toggle("on", x === b));
      updatePrice(p);
    }));
    qs("#qv-add").addEventListener("click", () => { addToCart(p); closeQuick(); openDrawer(); });
    updatePrice(p);
    qs("#qv-modal").hidden = false; document.body.style.overflow = "hidden";
  }
  // size index nudges price a little so config feels real
  function priceFor(p) { const idx = p.sizes.indexOf(sel.size); return Math.round(p.price * (1 + idx * 0.18)); }
  function updatePrice(p) { const v = money(priceFor(p)); qs("#qv-price").textContent = v; qs("#qv-add-price").textContent = v; }
  function closeQuick() { qs("#qv-modal").hidden = true; document.body.style.overflow = ""; }

  /* ---- Cart ---------------------------------------------------------- */
  function addToCart(p) {
    const price = priceFor(p), key = `${p.id}|${sel.mat}|${sel.size}`;
    const ex = cart.find((c) => c.key === key);
    if (ex) ex.qty++; else cart.push({ key, id: p.id, name: p.name, mat: sel.mat, size: sel.size, price, qty: 1, image: D.furniture(p.type, D.MAT[sel.mat]) });
    afterChange(); toast(`Added ${p.name}`);
  }
  function afterChange() { persist(); renderCart(); syncCount(); }
  function syncCount() { qs("#nav-count").textContent = cart.reduce((a, c) => a + c.qty, 0); }
  function renderCart() {
    const foot = qs("#cart-foot"), empty = qs("#cart-empty");
    if (!cart.length) { qs("#cart-items").innerHTML = ""; empty.hidden = false; foot.hidden = true; return; }
    empty.hidden = true; foot.hidden = false;
    qs("#cart-items").innerHTML = cart.map((c) => `
      <div class="citem">
        <img src="${c.image}" alt="">
        <div class="citem__info"><strong>${c.name}</strong><span>${c.mat} · ${c.size}</span><span class="citem__price">${money(c.price)}</span></div>
        <div class="stepper"><button data-dec="${c.key}" aria-label="Decrease">−</button><span>${c.qty}</span><button data-inc="${c.key}" aria-label="Increase">+</button></div>
      </div>`).join("");
    qs("#cart-subtotal").textContent = money(cart.reduce((s, c) => s + c.price * c.qty, 0));
    qsa("[data-inc]").forEach((b) => b.addEventListener("click", () => { cart.find((c) => c.key === b.dataset.inc).qty++; afterChange(); }));
    qsa("[data-dec]").forEach((b) => b.addEventListener("click", () => {
      const c = cart.find((x) => x.key === b.dataset.dec); c.qty--; if (c.qty <= 0) cart = cart.filter((x) => x !== c); afterChange();
    }));
  }

  /* ---- Drawer + checkout --------------------------------------------- */
  function openDrawer() { qs("#drawer").hidden = false; document.body.style.overflow = "hidden"; }
  function closeDrawer() { qs("#drawer").hidden = true; document.body.style.overflow = ""; }
  function wire() {
    qsa("[data-drawer-close]").forEach((b) => b.addEventListener("click", closeDrawer));
    qsa("[data-qv-close]").forEach((b) => b.addEventListener("click", closeQuick));
    qs("#checkout-btn").addEventListener("click", () => {
      const msg = qs("#cart-msg");
      msg.textContent = "✓ Order placed (demo) — we'll email your delivery window."; msg.className = "form-msg ok";
      toast("Order placed (demo)");
      setTimeout(() => { cart = []; afterChange(); msg.textContent = ""; closeDrawer(); }, 1600);
    });
    addEventListener("keydown", (e) => { if (e.key === "Escape") { closeQuick(); closeDrawer(); } });
  }

  function fillStatic() {
    qs("#hero-img").style.backgroundImage = `url("${D.heroImg}")`;
    qs("#promise-grid").innerHTML = D.promise.map(([ic, t, s], i) =>
      `<div class="promise__item" data-reveal style="transition-delay:${i * 60}ms">${ICON[ic]}<div><strong>${t}</strong><span>${s}</span></div></div>`).join("");
  }

  injectChrome(); fillStatic();
  buildRoomCards(); buildRoomTabs(); renderProducts(); wire();
  afterChange(); observeReveal();
})();
