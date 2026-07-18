/* ==========================================================================
   main.js — Mehdi Crêpes & Drinks — behavior
   --------------------------------------------------------------------------
   This is a browse-only digital menu: the client scrolls, taps a dish to
   see its details/extras, then shows the screen to staff at the counter
   to order. There is no cart, no checkout, no persisted state — by design.

   Sections below:
   1. Icon set            — inline SVG, zero broken-asset risk
   2. Hero                — background photo swap + scroll cue
   3. Level-1 filter       — category row, always visible
   4. Level-2 filter       — sub-category row, hidden until a category
                             has been chosen (this was the reported bug)
   5. Product grid         — photo-first cards, "Populaire" ribbon support
   6. Detail sheet         — description, extras, live total, no cart
   ========================================================================== */

const Icons = {
  crepe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8c0-2.5 4-4.5 9-4.5S21 5.5 21 8"/><path d="M3 8c0 1.8 1 3.3 3 4.3L4 20l4-2 2 2 2-2 2 2 2-2 4 2-2-7.7c2-1 3-2.5 3-4.3"/></svg>`,
  waffle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 3.5v17M14 3.5v17M3.5 9h17M3.5 15h17"/></svg>`,
  cup: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3.5c-.6.6-.6 1.4 0 2M12 3.5c-.6.6-.6 1.4 0 2"/></svg>`,
  flame: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s5 4.5 5 9.5a5 5 0 0 1-10 0c0-1.5.7-2.6 1.5-3.5.2 1.2 1 1.8 1.5 1.8-.3-2.5.8-5 2-7.8Z"/></svg>`,
  snow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12"/><path d="M12 2 9.5 4.5M12 2l2.5 2.5M12 22l-2.5-2.5M12 22l2.5-2.5"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 9.5 17 19 7"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.7 6.1 6.6.6-5 4.4 1.5 6.5L12 16.9l-5.8 3.5 1.5-6.5-5-4.4 6.6-.6z"/></svg>`
};

document.addEventListener("DOMContentLoaded", () => {

  const state = {
    group: null, // nothing selected until the client taps a category
    sub: null
  };

  // ---- DOM refs ----------------------------------------------------------
  const heroImg = document.getElementById("heroImg");
  const heroSub = document.getElementById("heroSub");
  const scrollCue = document.getElementById("scrollCue");
  const groupBar = document.getElementById("groupBar");
  const subBar = document.getElementById("subBar");
  const menuSection = document.getElementById("menuSection");

  const overlay = document.getElementById("overlay");
  const sheet = document.getElementById("sheet");
  const sheetHero = document.getElementById("sheetHero");
  const sheetImg = document.getElementById("sheetImg");
  const sheetClose = document.getElementById("sheetClose");
  const sheetEyebrow = document.getElementById("sheetEyebrow");
  const sheetPopularTag = document.getElementById("sheetPopularTag");
  const sheetTitle = document.getElementById("sheetTitle");
  const sheetBasePrice = document.getElementById("sheetBasePrice");
  const sheetDesc = document.getElementById("sheetDesc");
  const sheetExtras = document.getElementById("sheetExtras");
  const sheetExtrasList = document.getElementById("sheetExtrasList");
  const qtyValue = document.getElementById("qtyValue");
  const qtyMinus = document.getElementById("qtyMinus");
  const qtyPlus = document.getElementById("qtyPlus");
  const sheetAddBtn = document.getElementById("sheetAddBtn");
  const sheetAddPrice = document.getElementById("sheetAddPrice");

  let activeItem = null;
  let activeQty = 1;
  let activeExtras = new Set();

  // ==========================================================================
  // 2. HERO
  // ==========================================================================
  function setHeroImage(group) {
    const src = groupMeta[group].image;
    heroImg.onerror = () => {
      heroImg.onerror = null;
      heroImg.style.display = "none";
    };
    heroImg.style.display = "block";
    heroImg.src = src;
    heroImg.alt = groupMeta[group].label;
    if (window.gsap) gsap.fromTo(heroImg, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" });
    heroSub.textContent = "Sélection " + groupMeta[group].label.toLowerCase() + " — montrez votre choix au comptoir pour commander.";
  }

  scrollCue.addEventListener("click", () => {
    groupBar.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function bounceScrollCue() {
    if (!window.gsap) return;
    gsap.to(scrollCue, { y: 6, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
  }

  function hideScrollCue() {
    if (window.gsap) {
      gsap.killTweensOf(scrollCue);
      gsap.to(scrollCue, { opacity: 0, duration: 0.3, onComplete: () => (scrollCue.style.display = "none") });
    } else {
      scrollCue.style.display = "none";
    }
  }

  // ==========================================================================
  // 3. LEVEL-1 FILTER — category row, always visible
  // ==========================================================================
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
        const isFirstPick = state.group === null;
        if (g === state.group) return;
        state.group = g;
        state.sub = subOrder[g][0];
        setHeroImage(g);
        hideScrollCue();
        renderGroupBar();
        renderSubBar(isFirstPick);
        renderList();
      });
    });
  }

  // ==========================================================================
  // 4. LEVEL-2 FILTER — sub-category row
  // Hidden completely (display: none via CSS) until state.group is set, then
  // revealed with a short fade/slide the first time only.
  // ==========================================================================
  function renderSubBar(animateReveal) {
    if (!state.group) {
      subBar.classList.remove("is-visible");
      subBar.innerHTML = "";
      return;
    }

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
        renderSubBar(false);
        renderList();
      });
    });

    const wasHidden = !subBar.classList.contains("is-visible");
    subBar.classList.add("is-visible");
    if (animateReveal && wasHidden && window.gsap) {
      gsap.fromTo(subBar, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
    }
  }

  function currentItems() {
    if (!state.group || !state.sub) return [];
    return menuData.filter(i => i.group === state.group && i.sub === state.sub);
  }

  function iconFor(item) {
    if (item.sub === "gouffre") return "waffle";
    if (item.group === "drinks") return item.sub === "chaude" ? "flame" : "snow";
    return "crepe";
  }

  // ==========================================================================
  // 5. PRODUCT GRID
  // ==========================================================================
  function thumbHTML(item) {
    if (item.image) return `<img src="${item.image}" alt="" loading="lazy">`;
    return `<span class="card-thumb-icon">${Icons[iconFor(item)]}</span>`;
  }

  function cardHTML(item) {
    return `
      <button class="card" data-id="${item.id}">
        <span class="card-thumb ${item.image ? "has-photo" : ""}">
          ${thumbHTML(item)}
          ${item.popular ? `<span class="card-ribbon">${Icons.star}Populaire</span>` : ""}
        </span>
        <span class="card-body">
          <span class="card-name">${item.name}</span>
          <span class="card-desc">${item.desc}</span>
        </span>
        <span class="card-side">
          <span class="card-price">${item.price}<small> dh</small></span>
          <span class="card-chevron" aria-hidden="true">${Icons.chevron}</span>
        </span>
      </button>`;
  }

  // Ornamental rule used to separate the sucré / salé sub-groups —
  // the small centered diamond is the menu's recurring signature mark.
  function sectionHeadingHTML(label) {
    return `<h2 class="section-heading"><span>${label}</span><i class="section-heading-rule" aria-hidden="true"></i></h2>`;
  }

  function promptHTML() {
    return `
      <div class="category-prompt">
        <span class="category-prompt-icon">${Icons.crepe}</span>
        <h2 class="category-prompt-title">Choisissez une catégorie</h2>
        <p class="category-prompt-text">Crêpes ou Boissons — touchez un bouton ci-dessus pour découvrir le menu.</p>
      </div>`;
  }

  function renderList() {
    if (!state.group) {
      menuSection.innerHTML = promptHTML();
      return;
    }

    const items = currentItems();

    if (state.group === "crepe" && state.sub === "crepe") {
      const sucre = items.filter(i => i.type === "sucre");
      const sale = items.filter(i => i.type === "sale");
      menuSection.innerHTML =
        (sucre.length ? `${sectionHeadingHTML("Crêpes sucrés")}<div class="product-list">${sucre.map(cardHTML).join("")}</div>` : "") +
        (sale.length ? `${sectionHeadingHTML("Crêpes salés")}<div class="product-list">${sale.map(cardHTML).join("")}</div>` : "");
    } else {
      menuSection.innerHTML = items.length
        ? `<div class="product-list">${items.map(cardHTML).join("")}</div>`
        : `<p class="empty-state">Aucun article ici pour le moment.</p>`;
    }

    menuSection.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", () => {
        const item = menuData.find(i => i.id === card.dataset.id);
        if (item) openSheet(item);
      });
    });

    animateListIn();
  }

  function animateListIn() {
    if (!window.gsap) return;
    gsap.fromTo(menuSection, { opacity: 0.5 }, { opacity: 1, duration: 0.2 });
    const cards = menuSection.querySelectorAll(".card");
    if (cards.length) {
      gsap.fromTo(cards, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.03 });
    }
  }

  // ==========================================================================
  // 6. DETAIL SHEET — informational only, no cart
  // ==========================================================================
  function openSheet(item) {
    activeItem = item;
    activeQty = 1;
    activeExtras = new Set();

    if (item.image) {
      sheetHero.classList.add("has-photo");
      sheetImg.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
    } else {
      sheetHero.classList.remove("has-photo");
      sheetImg.innerHTML = Icons[iconFor(item)];
    }

    sheetEyebrow.textContent = subMeta[item.sub].label;
    sheetPopularTag.style.display = item.popular ? "inline-flex" : "none";
    sheetTitle.textContent = item.name;
    sheetBasePrice.textContent = item.price + " dh";
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

  sheetAddBtn.addEventListener("click", closeSheet);
  sheetClose.addEventListener("click", closeSheet);
  overlay.addEventListener("click", closeSheet);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });

  // ==========================================================================
  // INIT
  // ==========================================================================
  renderGroupBar();
  renderSubBar(false);
  renderList();
  bounceScrollCue();
});