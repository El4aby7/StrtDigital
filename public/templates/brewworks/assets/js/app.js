/* ==========================================================================
   Brewworks — App logic: header/footer, category-filtered menu, add-to-cart
   drawer with qty steppers + live totals, a localStorage loyalty tracker, and
   a simulated checkout. Cart + beans persist on the device.
   ========================================================================== */
(function () {
  "use strict";
  const D = window.BREW;
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => "$" + n.toFixed(2);

  const ICON = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8h12l1 12H5L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    bean: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4c6 0 13 4 13 11 0 4-3 5-6 5C8 20 2 16 2 9 2 5 4 4 7 4zm1 3c-2 2-1 7 3 9"/></svg>',
  };

  /* ---- Persistent state ---------------------------------------------- */
  const KEY = "brewworks";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const saved = load();
  let cart = saved.cart || {};          // { id: qty }
  let beans = saved.beans || 0;         // loyalty beans earned
  const persist = () => localStorage.setItem(KEY, JSON.stringify({ cart, beans }));

  let toastT;
  function toast(m) { const t = qs("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600); }

  /* ---- Chrome -------------------------------------------------------- */
  function injectChrome() {
    qs("#site-header").innerHTML = `
      <header class="nav" id="nav">
        <div class="container nav__inner">
          <a class="brand" href="#home">Brew<b>works</b></a>
          <nav class="nav__links" id="nav-links">
            <a href="#order">Menu</a><a href="#rewards">Rewards</a>
            <button class="navcart cart-open" aria-label="Open cart">${ICON.bag}<span id="nav-count">0</span></button>
          </nav>
          <button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false">&#9776;</button>
        </div>
      </header>`;
    qs("#site-footer").innerHTML = `
      <footer class="footer">
        <div class="container footer__grid">
          <div><a class="brand brand--light" href="#home">Brew<b>works</b></a><p>Small-batch coffee & all-day brunch. Order ahead, earn rewards, skip the queue.</p></div>
          <div><h4>Visit</h4><p>${ICON.pin} 3 Roastery Lane, Harbour District</p><p>${ICON.clock} Daily 7am–5pm</p></div>
          <div><h4>Order</h4><a href="#order">Coffee</a><a href="#order">Brunch</a><a href="#rewards">Rewards</a></div>
        </div>
        <div class="container footer__base"><span>© ${new Date().getFullYear()} Brewworks Coffee Co.</span><span>A StrtDigital template demo</span></div>
      </footer>`;
    const burger = qs("#burger"), links = qs("#nav-links");
    burger.addEventListener("click", () => { const o = links.classList.toggle("open"); burger.setAttribute("aria-expanded", String(o)); });
    qsa("a", links).forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));
    addEventListener("scroll", () => qs("#nav").classList.toggle("scrolled", scrollY > 20), { passive: true });
    qs("#fab-icon").innerHTML = ICON.bag;
  }

  function observeReveal() {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    qsa("[data-reveal]").forEach((el) => io.observe(el));
  }

  /* ---- Menu ---------------------------------------------------------- */
  let cat = "All";
  function buildCats() {
    qs("#cats").innerHTML = D.cats.map((c, i) => `<button class="cat${i === 0 ? " on" : ""}" data-cat="${c}">${c}</button>`).join("");
    qsa("#cats .cat").forEach((b) => b.addEventListener("click", () => {
      cat = b.dataset.cat;
      qsa("#cats .cat").forEach((x) => x.classList.toggle("on", x === b));
      renderProducts();
    }));
  }
  function renderProducts() {
    const list = cat === "All" ? D.products : D.products.filter((p) => p.cat === cat);
    qs("#product-grid").innerHTML = list.map((p) => `
      <article class="product">
        <div class="product__media"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
        <div class="product__body">
          <div class="product__top"><h3>${p.name}</h3><span class="product__price">${money(p.price)}</span></div>
          <p>${p.desc}</p>
          <button class="btn btn--accent btn--sm btn--block" data-add="${p.id}">Add to order</button>
        </div>
      </article>`).join("");
    qsa("[data-add]").forEach((b) => b.addEventListener("click", () => add(b.dataset.add)));
  }

  /* ---- Cart ---------------------------------------------------------- */
  function add(id) { cart[id] = (cart[id] || 0) + 1; afterChange(); toast(`Added ${D.products.find((p) => p.id === id).name}`); }
  function setQty(id, q) { if (q <= 0) delete cart[id]; else cart[id] = q; afterChange(); }
  function count() { return Object.values(cart).reduce((a, b) => a + b, 0); }
  function subtotal() { return Object.entries(cart).reduce((s, [id, q]) => s + D.products.find((p) => p.id === id).price * q, 0); }

  function afterChange() { persist(); renderCart(); renderRewards(); syncCounts(); }
  function syncCounts() {
    const n = count();
    qs("#nav-count").textContent = n; qs("#fab-count").textContent = n;
    qs("#cart-fab").classList.toggle("show", n > 0);
  }

  function renderCart() {
    const ids = Object.keys(cart), foot = qs("#cart-foot"), empty = qs("#cart-empty");
    if (!ids.length) { qs("#cart-items").innerHTML = ""; empty.hidden = false; foot.hidden = true; return; }
    empty.hidden = true; foot.hidden = false;
    qs("#cart-items").innerHTML = ids.map((id) => {
      const p = D.products.find((x) => x.id === id), q = cart[id];
      return `<div class="citem">
        <img src="${p.image}" alt="">
        <div class="citem__info"><strong>${p.name}</strong><span>${money(p.price)}</span></div>
        <div class="stepper">
          <button data-dec="${id}" aria-label="Decrease">−</button><span>${q}</span><button data-inc="${id}" aria-label="Increase">+</button>
        </div>
      </div>`;
    }).join("");
    qs("#cart-subtotal").textContent = money(subtotal());
    qsa("[data-inc]").forEach((b) => b.addEventListener("click", () => setQty(b.dataset.inc, cart[b.dataset.inc] + 1)));
    qsa("[data-dec]").forEach((b) => b.addEventListener("click", () => setQty(b.dataset.dec, cart[b.dataset.dec] - 1)));
  }

  /* ---- Rewards (beans = items in current cart + banked) -------------- */
  function renderRewards() {
    const total = beans + count();                 // banked + pending this order
    const goal = D.rewardGoal, progress = total % goal, free = Math.floor(total / goal);
    qs("#beans").innerHTML = Array.from({ length: goal }, (_, i) =>
      `<span class="beanslot${i < progress ? " filled" : ""}">${ICON.bean}</span>`).join("");
    qs("#loyalty-pts").textContent = total;
    qs("#loyalty-fill").style.width = (progress / goal * 100) + "%";
    const left = goal - progress;
    qs("#loyalty-hint").textContent = total === 0 ? "Add items to start earning beans →" : `${left} more bean${left === 1 ? "" : "s"} to a free coffee`;
    qs("#rewards-note").textContent = free > 0 ? `🎉 You've unlocked ${free} free coffee${free === 1 ? "" : "s"}!` : "";
  }

  /* ---- Drawer + checkout --------------------------------------------- */
  function openDrawer() { qs("#drawer").hidden = false; document.body.style.overflow = "hidden"; }
  function closeDrawer() { qs("#drawer").hidden = true; document.body.style.overflow = ""; }
  function wireDrawer() {
    qsa(".cart-open").forEach((b) => b.addEventListener("click", openDrawer));
    qsa("[data-drawer-close]").forEach((b) => b.addEventListener("click", closeDrawer));
    qs("#checkout-btn").addEventListener("click", checkout);
    qsa("[data-co-close]").forEach((b) => b.addEventListener("click", closeCheckout));
    addEventListener("keydown", (e) => { if (e.key === "Escape") { closeDrawer(); closeCheckout(); } });
  }
  function checkout() {
    const n = count(), total = subtotal();
    closeDrawer();
    qs("#checkout-body").innerHTML = `
      <div class="co">
        <div class="co__tick">✓</div>
        <h3>Order confirmed!</h3>
        <p>${n} item${n === 1 ? "" : "s"} · ${money(total)} — ready for pickup in about 10 minutes.</p>
        <p class="co__code">Pickup code <strong>BW-${Math.floor(1000 + Math.random() * 9000)}</strong></p>
        <p class="muted">You earned ${n} bean${n === 1 ? "" : "s"} on this order. (Demo — no payment taken.)</p>
        <button class="btn btn--accent btn--block" data-co-close>Done</button>
      </div>`;
    qs("#checkout-modal").hidden = false;
    qsa("[data-co-close]", qs("#checkout-modal")).forEach((b) => b.addEventListener("click", closeCheckout));
    // bank the beans, clear the cart
    beans += n; cart = {}; afterChange();
  }
  function closeCheckout() { qs("#checkout-modal").hidden = true; document.body.style.overflow = ""; }

  function fillStatic() {
    qs("#hero-img").style.backgroundImage = `url("${D.heroImg}")`;
    qs("#hero-chips").innerHTML = D.heroChips.map((c) => `<span>${c}</span>`).join("");
  }

  injectChrome(); fillStatic();
  buildCats(); renderProducts(); wireDrawer();
  afterChange(); observeReveal();
})();
