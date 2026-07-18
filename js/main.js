/* ==========================================================================
   main.js — Mehdi Crêpes & Drinks — behavior
   1. Icon set (inline SVG, no external icon font — zero broken-asset risk)
   2. Two-level filter rendering (group -> sub) + product list
   3. Product bottom sheet: extras checkboxes, qty stepper, live total
   4. Order (cart) summary sheet
   ========================================================================== */

const Icons = {
  crepe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8c0-2.5 4-4.5 9-4.5S21 5.5 21 8"/><path d="M3 8c0 1.8 1 3.3 3 4.3L4 20l4-2 2 2 2-2 2 2 2-2 4 2-2-7.7c2-1 3-2.5 3-4.3"/></svg>`,
  waffle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 3.5v17M14 3.5v17M3.5 9h17M3.5 15h17"/></svg>`,
  cup: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3.5c-.6.6-.6 1.4 0 2M12 3.5c-.6.6-.6 1.4 0 2"/></svg>`,
  flame: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s5 4.5 5 9.5a5 5 0 0 1-10 0c0-1.5.7-2.6 1.5-3.5.2 1.2 1 1.8 1.5 1.8-.3-2.5.8-5 2-7.8Z"/></svg>`,
  snow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12"/><path d="M12 2 9.5 4.5M12 2l2.5 2.5M12 22l-2.5-2.5M12 22l2.5-2.5"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 9.5 17 19 7"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 20.5L6 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></svg>`
};

document.addEventListener("DOMContentLoaded", () => {

  const state = {
    group: "crepe",
    sub: "crepe",
    cart: [] // { itemId, name, unitPrice, qty, extras:[{id,label,price}], lineTotal }
  };

  const heroImg = document.getElementById("heroImg");
  const groupBar = document.getElementById("groupBar");
  const subBar = document.getElementById("subBar");
  const menuSection = document.getElementById("menuSection");
  const cartBadge = document.getElementById("cartBadge");
  const cartCount = document.getElementById("cartCount");

  const overlay = document.getElementById("overlay");
  const sheet = document.getElementById("sheet");
  const sheetImg = document.getElementById("sheetImg");
  const sheetClose = document.getElementById("sheetClose");
  const sheetEyebrow = document.getElementById("sheetEyebrow");
  const sheetTitle = document.getElementById("sheetTitle");
  const sheetDesc = document.getElementById("sheetDesc");
  const sheetExtras = document.getElementById("sheetExtras");
  const sheetExtrasList = document.getElementById("sheetExtrasList");
  const qtyValue = document.getElementById("qtyValue");
  const qtyMinus = document.getElementById("qtyMinus");
  const qtyPlus = document.getElementById("qtyPlus");
  const sheetAddBtn = document.getElementById("sheetAddBtn");
  const sheetAddPrice = document.getElementById("sheetAddPrice");

  const cartOverlay = document.getElementById("cartOverlay");
  const cartSheet = document.getElementById("cartSheet");
  const cartClose = document.getElementById("cartCloseBtn");
  const cartList = document.getElementById("cartList");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartGrandTotal = document.getElementById("cartGrandTotal");
  const cartClearBtn = document.getElementById("cartClearBtn");

  const toast = document.getElementById("toast");

  let activeItem = null;
  let activeQty = 1;
  let activeExtras = new Set();

  function setHeroImage(group) {
    const src = groupMeta[group].image;
    heroImg.onerror = () => {
      heroImg.onerror = null;
      heroImg.style.display = "none";
    };
    heroImg.style.display = "block";
    heroImg.src = src;
  }

  function renderGroupBar() {
    groupBar.innerHTML = groupOrder.map(g => {
      const meta = groupMeta[g];
      return `
        <button class="pill pill--lg ${state.group === g ? "is-active" : ""}" data-group="${g}">
          <span class="pill-icon">${Icons[meta.icon]}</span>
          <span>${meta.label}</span>
        </button>`;
    }).join("");

    groupBar.querySelectorAll(".pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const g = btn.dataset.group;
        if (g === state.group) return;
        state.group = g;
        state.sub = subOrder[g][0];
        setHeroImage(g);
        renderGroupBar();
        renderSubBar();
        renderList();
      });
    });
  }

  function renderSubBar() {
    const subs = subOrder[state.group];
    subBar.innerHTML = subs.map(s => {
      const meta = subMeta[s];
      return `
        <button class="pill ${state.sub === s ? "is-active" : ""}" data-sub="${s}">
          <span class="pill-icon">${Icons[meta.icon]}</span>
          <span>${meta.label}</span>
        </button>`;
    }).join("");

    subBar.querySelectorAll(".pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const s = btn.dataset.sub;
        if (s === state.sub) return;
        state.sub = s;
        renderSubBar();
        renderList();
      });
    });
  }

  function currentItems() {
    return menuData.filter(i => i.group === state.group && i.sub === state.sub);
  }

  function iconFor(item) {
    if (item.sub === "gouffre") return "waffle";
    if (item.group === "drinks") return item.sub === "chaude" ? "flame" : "snow";
    return "crepe";
  }

  function cardHTML(item) {
    return `
      <button class="card" data-id="${item.id}">
        <span class="card-thumb">${Icons[iconFor(item)]}</span>
        <span class="card-body">
          <span class="card-name">${item.name}</span>
          <span class="card-price">${item.price} dh</span>
        </span>
        <span class="card-add" data-quickadd="${item.id}" aria-label="Ajouter ${item.name}">${Icons.plus}</span>
      </button>`;
  }

  function renderList() {
    const items = currentItems();

    if (state.group === "crepe" && state.sub === "crepe") {
      const sucre = items.filter(i => i.type === "sucre");
      const sale = items.filter(i => i.type === "sale");
      menuSection.innerHTML =
        (sucre.length ? `<h2 class="section-heading">Crêpes sucrés</h2><div class="product-list">${sucre.map(cardHTML).join("")}</div>` : "") +
        (sale.length ? `<h2 class="section-heading">Crêpes salés</h2><div class="product-list">${sale.map(cardHTML).join("")}</div>` : "");
    } else {
      menuSection.innerHTML = items.length
        ? `<div class="product-list">${items.map(cardHTML).join("")}</div>`
        : `<p class="empty-state">Aucun article ici pour le moment.</p>`;
    }

    menuSection.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", e => {
        if (e.target.closest("[data-quickadd]")) return;
        const item = menuData.find(i => i.id === card.dataset.id);
        if (item) openSheet(item);
      });
    });

    menuSection.querySelectorAll("[data-quickadd]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const item = menuData.find(i => i.id === btn.dataset.quickadd);
        if (item) {
          addToCart(item, 1, []);
          pulseIcon(btn);
          showToast(`${item.name} ajouté`);
        }
      });
    });

    animateListIn();
  }

  function animateListIn() {
    const cards = menuSection.querySelectorAll(".card");
    if (!window.gsap) return;
    gsap.fromTo(cards, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.03 });
  }

  function pulseIcon(el) {
    if (!window.gsap) return;
    gsap.fromTo(el, { scale: 0.7 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
  }

  function openSheet(item) {
    activeItem = item;
    activeQty = 1;
    activeExtras = new Set();

    sheetImg.innerHTML = Icons[iconFor(item)];
    sheetEyebrow.textContent = subMeta[item.sub].label;
    sheetTitle.textContent = item.name;
    sheetDesc.textContent = item.desc;

    if (item.extras) {
      sheetExtras.style.display = "block";
      sheetExtrasList.innerHTML = extrasCatalog.map(ex => `
        <label class="extra-row" data-extra="${ex.id}">
          <span class="extra-check">${Icons.check}</span>
          <span class="extra-label">${ex.label}</span>
          <span class="extra-price">+${ex.price} dh</span>
        </label>`).join("");

      sheetExtrasList.querySelectorAll(".extra-row").forEach(row => {
        row.addEventListener("click", () => {
          const id = row.dataset.extra;
          if (activeExtras.has(id)) activeExtras.delete(id);
          else activeExtras.add(id);
          row.classList.toggle("is-checked");
          updateSheetTotal();
        });
      });
    } else {
      sheetExtras.style.display = "none";
      sheetExtrasList.innerHTML = "";
    }

    qtyValue.textContent = activeQty;
    updateSheetTotal();

    document.body.style.overflow = "hidden";
    gsap.set(overlay, { pointerEvents: "auto" });
    gsap.to(overlay, { opacity: 1, duration: 0.25 });
    gsap.to(sheet, { y: "0%", duration: 0.45, ease: "power3.out" });
  }

  function closeSheet() {
    document.body.style.overflow = "";
    gsap.to(overlay, { opacity: 0, duration: 0.2, onComplete: () => gsap.set(overlay, { pointerEvents: "none" }) });
    gsap.to(sheet, { y: "100%", duration: 0.35, ease: "power3.in" });
  }

  function extrasTotal() {
    return [...activeExtras].reduce((sum, id) => {
      const ex = extrasCatalog.find(e => e.id === id);
      return sum + (ex ? ex.price : 0);
    }, 0);
  }

  function updateSheetTotal() {
    if (!activeItem) return;
    const unit = activeItem.price + extrasTotal();
    sheetAddPrice.textContent = (unit * activeQty) + " dh";
  }

  qtyMinus.addEventListener("click", () => {
    if (activeQty <= 1) return;
    activeQty--;
    qtyValue.textContent = activeQty;
    updateSheetTotal();
  });
  qtyPlus.addEventListener("click", () => {
    activeQty++;
    qtyValue.textContent = activeQty;
    updateSheetTotal();
  });

  sheetAddBtn.addEventListener("click", () => {
    if (!activeItem) return;
    const chosenExtras = [...activeExtras].map(id => extrasCatalog.find(e => e.id === id));
    addToCart(activeItem, activeQty, chosenExtras);
    showToast(`${activeItem.name} ajouté à la commande`);
    closeSheet();
  });

  sheetClose.addEventListener("click", closeSheet);
  overlay.addEventListener("click", closeSheet);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });

  function addToCart(item, qty, extras) {
    const unit = item.price + extras.reduce((s, e) => s + e.price, 0);
    state.cart.push({
      itemId: item.id,
      name: item.name,
      unitPrice: unit,
      qty,
      extras,
      lineTotal: unit * qty
    });
    renderCartBadge();
  }

  function renderCartBadge() {
    const count = state.cart.reduce((s, l) => s + l.qty, 0);
    cartCount.textContent = count;
    cartBadge.classList.toggle("is-visible", count > 0);
    if (window.gsap && count > 0) {
      gsap.fromTo(cartBadge, { scale: 0.85 }, { scale: 1, duration: 0.3, ease: "back.out(3)" });
    }
  }

  function renderCartSheet() {
    if (!state.cart.length) {
      cartList.innerHTML = "";
      cartEmpty.style.display = "block";
      cartGrandTotal.textContent = "0 dh";
      return;
    }
    cartEmpty.style.display = "none";
    cartList.innerHTML = state.cart.map((line, idx) => `
      <div class="cart-line">
        <div class="cart-line-main">
          <span class="cart-line-name">${line.qty}× ${line.name}</span>
          ${line.extras.length ? `<span class="cart-line-extras">${line.extras.map(e => e.label).join(", ")}</span>` : ""}
        </div>
        <span class="cart-line-price">${line.lineTotal} dh</span>
        <button class="cart-line-remove" data-idx="${idx}" aria-label="Retirer">${Icons.close}</button>
      </div>
    `).join("");

    cartList.querySelectorAll(".cart-line-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        state.cart.splice(Number(btn.dataset.idx), 1);
        renderCartBadge();
        renderCartSheet();
      });
    });

    const grand = state.cart.reduce((s, l) => s + l.lineTotal, 0);
    cartGrandTotal.textContent = grand + " dh";
  }

  function openCartSheet() {
    renderCartSheet();
    document.body.style.overflow = "hidden";
    gsap.set(cartOverlay, { pointerEvents: "auto" });
    gsap.to(cartOverlay, { opacity: 1, duration: 0.25 });
    gsap.to(cartSheet, { y: "0%", duration: 0.45, ease: "power3.out" });
  }

  function closeCartSheet() {
    document.body.style.overflow = "";
    gsap.to(cartOverlay, { opacity: 0, duration: 0.2, onComplete: () => gsap.set(cartOverlay, { pointerEvents: "none" }) });
    gsap.to(cartSheet, { y: "100%", duration: 0.35, ease: "power3.in" });
  }

  cartBadge.addEventListener("click", openCartSheet);
  cartClose.addEventListener("click", closeCartSheet);
  cartOverlay.addEventListener("click", closeCartSheet);
  cartClearBtn.addEventListener("click", () => {
    state.cart = [];
    renderCartBadge();
    renderCartSheet();
  });

  let toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    clearTimeout(toastTimer);
    gsap.killTweensOf(toast);
    gsap.set(toast, { display: "flex" });
    gsap.fromTo(toast, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
    toastTimer = setTimeout(() => {
      gsap.to(toast, { y: 20, opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => gsap.set(toast, { display: "none" }) });
    }, 1800);
  }

  setHeroImage(state.group);
  renderGroupBar();
  renderSubBar();
  renderList();
  renderCartBadge();
});