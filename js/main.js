/* ==========================================================================
   main.js — Adhen Crêpes — behavior
   --------------------------------------------------------------------------
   The client browses, adds dishes to a cart (from the card's + stepper or
   from the detail sheet with extras), reviews the cart, then taps
   "Commander via WhatsApp" — which opens a pre-filled WhatsApp chat to the
   shop's number with the full order, so a human barista confirms it.

   Sections:
   1. Icon set
   2. Cart state + WhatsApp message builder
   3. Hero
   4. Level-1 / level-2 filters
   5. Product grid — card has its own quick-add stepper (no sheet needed)
   6. Detail sheet — description, extras, qty, "Ajouter au panier"
   7. Cart bar + cart sheet
   ========================================================================== */

const Icons = {
    crepe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8c0-2.5 4-4.5 9-4.5S21 5.5 21 8"/><path d="M3 8c0 1.8 1 3.3 3 4.3L4 20l4-2 2 2 2-2 2 2 2-2 4 2-2-7.7c2-1 3-2.5 3-4.3"/></svg>`,
    waffle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 3.5v17M14 3.5v17M3.5 9h17M3.5 15h17"/></svg>`,
    cup: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3.5c-.6.6-.6 1.4 0 2M12 3.5c-.6.6-.6 1.4 0 2"/></svg>`,
    flame: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s5 4.5 5 9.5a5 5 0 0 1-10 0c0-1.5.7-2.6 1.5-3.5.2 1.2 1 1.8 1.5 1.8-.3-2.5.8-5 2-7.8Z"/></svg>`,
    coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z"/><path d="M16 10.5h1.5a2.3 2.3 0 0 1 0 4.6H16"/><path d="M8 2.5c-.7.7-.7 1.5 0 2.3M11.5 2.5c-.7.7-.7 1.5 0 2.3"/></svg>`,
    crown: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 8.2 7 11l5-6.5L17 11l3.5-2.8L19 18H5L3.5 8.2Z"/><circle cx="12" cy="3.6" r="1.4"/><circle cx="3.4" cy="7.6" r="1.4"/><circle cx="20.6" cy="7.6" r="1.4"/></svg>`,
    trending: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17 9.5 10.5 13.5 14.5 21 6"/><path d="M15 6h6v6"/></svg>`,
    snow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12"/><path d="M12 2 9.5 4.5M12 2l2.5 2.5M12 22l-2.5-2.5M12 22l2.5-2.5"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 9.5 17 19 7"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.7 6.1 6.6.6-5 4.4 1.5 6.5L12 16.9l-5.8 3.5 1.5-6.5-5-4.4 6.6-.6z"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
    minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M5 12h14"/></svg>`,
    bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 20.5L6 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.7.8-.9 1c-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2.1-.2 0-.4 0-.5L9 9c-.1-.2-.6-1.5-.9-2-.2-.6-.5-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.3c0 1.3.9 2.6 1.1 2.8.1.2 2 3.1 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3Z"/></svg>`,
    mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10.5c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10.5" r="2.7"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.6 2.1"/></svg>`,
    phoneCall: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.2 1.1L6.6 10.8Z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M16.8 7.2h.01"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m20 20-4.3-4.3"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15.5M13.5 5.5 20 12l-6.5 6.5"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.6h2.6l.4-3H13.5V8.4c0-.9.2-1.5 1.5-1.5h1.6V4.2C16.3 4.1 15.3 4 14.2 4c-2.3 0-3.9 1.4-3.9 4v2.4H7.7v3h2.6V21h3.2Z"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5c.5 3.4 1.4 5.6 2.8 7 1.4 1.4 3.6 2.3 7 2.8-3.4.5-5.6 1.4-7 2.8-1.4 1.4-2.3 3.6-2.8 7-.5-3.4-1.4-5.6-2.8-7-1.4-1.4-3.6-2.3-7-2.8 3.4-.5 5.6-1.4 7-2.8 1.4-1.4 2.3-3.6 2.8-7Z"/></svg>`
};

// Global fallback: if a real photo 404s, swap the card thumbnail for the
// matching line-icon instead of showing a broken-image glyph. Exposed on
// window because it's called from an inline onerror="" attribute.
window.handleThumbError = function (imgEl, iconKey) {
    imgEl.onerror = null;
    const wrap = imgEl.closest(".card-thumb");
    if (!wrap) return;
    wrap.classList.remove("has-photo");
    wrap.innerHTML = `<span class="card-thumb-icon">${Icons[iconKey]}</span>`;
};

// If a category tile photo (home screen) 404s, just hide the <img> — the
// gradient + big line-icon already sitting behind it becomes the visual.
window.handleTileImgError = function (imgEl) {
    imgEl.onerror = null;
    imgEl.style.display = "none";
};

window.handleSheetPhotoError = function (imgEl, iconKey) {
    imgEl.onerror = null;
    const hero = imgEl.closest(".sheet-hero");
    const wrap = document.getElementById("sheetImg");
    if (hero) hero.classList.remove("has-photo");
    if (wrap) wrap.innerHTML = Icons[iconKey];
};

document.addEventListener("DOMContentLoaded", () => {

    const state = { group: null, sub: null };
    const cart = []; // { key, itemId, name, unitBase, extras:[{id,label,price}], qty }

    // ---- DOM refs ------------------------------------------------------------
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
    const sheetSalesText = document.getElementById("sheetSalesText");
    const sheetExtras = document.getElementById("sheetExtras");
    const sheetExtrasList = document.getElementById("sheetExtrasList");
    const qtyValue = document.getElementById("qtyValue");
    const qtyMinus = document.getElementById("qtyMinus");
    const qtyPlus = document.getElementById("qtyPlus");
    const sheetAddBtn = document.getElementById("sheetAddBtn");
    const sheetAddPrice = document.getElementById("sheetAddPrice");

    const cartBar = document.getElementById("cartBar");
    const cartBarCount = document.getElementById("cartBarCount");
    const cartBarTotal = document.getElementById("cartBarTotal");

    const cartOverlay = document.getElementById("cartOverlay");
    const cartSheet = document.getElementById("cartSheet");
    const cartCloseBtn = document.getElementById("cartCloseBtn");
    const cartLines = document.getElementById("cartLines");
    const cartSheetEmpty = document.getElementById("cartSheetEmpty");
    const cartSheetTotal = document.getElementById("cartSheetTotal");
    const cartClearBtn = document.getElementById("cartClearBtn");
    const whatsappBtn = document.getElementById("whatsappBtn");

    const toast = document.getElementById("toast");

    let activeItem = null;
    let activeQty = 1;
    let activeExtras = new Set();

    /* ==========================================================================
       1b. LIVE SALES COUNTER
       "X commandes ce mois" is no longer a fixed number: each item keeps a
       baseline (item.sales, seeded in data.js so a brand-new item doesn't
       show "0") and a *real* live count on top, stored in a free public
       hit-counter (countapi.mileshilliard.com — no signup/keys, one request
       per item per unique key). Every time someone taps "Commander via
       WhatsApp", we hit the counter once per unit ordered, so the number
       genuinely grows with real orders.
       If the API is slow/unreachable the site just keeps showing the
       baseline number — nothing else breaks.
       ========================================================================== */
    const SALES_API = "https://countapi.mileshilliard.com/api/v1";
    const liveSalesCache = {};       // itemId -> live hit count already fetched
    const fetchedSalesIds = new Set(); // itemIds we've already requested, so we
    // don't re-fetch the same item every time the list re-renders

    function salesDisplay(item) {
        return item.sales + (liveSalesCache[item.id] || 0);
    }

    function refreshSalesDOM(item) {
        document.querySelectorAll(`[data-sales-for="${item.id}"]`).forEach(el => {
            el.textContent = salesDisplay(item) + " commandes ce mois";
        });
    }

    async function fetchLiveSales(item) {
        if (fetchedSalesIds.has(item.id)) return;
        fetchedSalesIds.add(item.id);
        try {
            const res = await fetch(`${SALES_API}/get/${item.salesKey}`);
            if (res.ok) {
                const data = await res.json();
                liveSalesCache[item.id] = parseInt(data.value, 10) || 0;
                refreshSalesDOM(item);
            }
            // 404 just means no one has ordered it yet — baseline stays as-is.
        } catch (e) {
            // Offline or the free API is down — keep showing the baseline number.
        }
    }

    function loadLiveSalesFor(items) {
        items.forEach(fetchLiveSales);
    }

    function registerSale(item, qty) {
        // Bump it locally right away so the number visibly grows the instant
        // checkout happens, then actually persist it in the background —
        // one hit per unit ordered.
        liveSalesCache[item.id] = (liveSalesCache[item.id] || 0) + qty;
        refreshSalesDOM(item);
        for (let i = 0; i < qty; i++) {
            fetch(`${SALES_API}/hit/${item.salesKey}`).catch(() => {});
        }
    }

    /* ==========================================================================
       2. CART — state, merge-by-signature, totals, WhatsApp message
       ========================================================================== */
    function lineSignature(itemId, extraIds) {
        return itemId + "|" + [...extraIds].sort().join(",");
    }

    function addToCart(item, qty, extras) {
        const extraIds = extras.map(e => e.id);
        const key = lineSignature(item.id, extraIds);
        const existing = cart.find(l => l.key === key);
        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({
                key,
                itemId: item.id,
                name: item.name,
                unitBase: item.price,
                extras,
                qty
            });
        }
        renderCartBar();
    }

    function setLineQty(key, qty) {
        const line = cart.find(l => l.key === key);
        if (!line) return;
        if (qty <= 0) {
            const idx = cart.indexOf(line);
            cart.splice(idx, 1);
        } else {
            line.qty = qty;
        }
        renderCartBar();
    }

    function plainQty(itemId) {
        const line = cart.find(l => l.key === lineSignature(itemId, []));
        return line ? line.qty : 0;
    }

    function lineUnit(line) {
        return line.unitBase + line.extras.reduce((s, e) => s + e.price, 0);
    }

    function cartCount() {
        return cart.reduce((s, l) => s + l.qty, 0);
    }

    function cartTotal() {
        return cart.reduce((s, l) => s + lineUnit(l) * l.qty, 0);
    }

    function buildWhatsAppMessage() {
        const lines = cart.map(l => {
            const extraTxt = l.extras.length ? ` (${l.extras.map(e => e.label).join(", ")})` : "";
            return `• ${l.qty}× ${l.name}${extraTxt} — ${lineUnit(l) * l.qty} dh`;
        });
        const msg =
            `Bonjour ${shopConfig.name} 👋\n\nJe voudrais commander :\n` +
            lines.join("\n") +
            `\n\nTotal : ${cartTotal()} dh\n\n(Commande envoyée depuis le menu digital)`;
        return msg;
    }

    function openWhatsAppCheckout() {
        if (!cart.length) return;
        cart.forEach(line => {
            const item = menuData.find(i => i.id === line.itemId);
            if (item) registerSale(item, line.qty);
        });
        const text = encodeURIComponent(buildWhatsAppMessage());
        const url = `https://wa.me/${shopConfig.whatsapp}?text=${text}`;
        window.open(url, "_blank", "noopener");
    }

    /* ==========================================================================
       3. HERO
       ========================================================================== */
    function setHeroImage(group) {
        const src = groupMeta[group].heroImage || groupMeta[group].image;
        heroImg.onerror = () => {
            heroImg.onerror = null;
            heroImg.style.display = "none";
        };
        heroImg.style.display = "block";
        heroImg.src = src;
        heroImg.alt = groupMeta[group].label;
        if (window.gsap) gsap.fromTo(heroImg, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" });
        heroSub.textContent = groupMeta[group].label + " — commandez en quelques taps.";
    }

    // Landing photo, shown before the person picks Crêpes / Boissons.
    function setDefaultHeroImage() {
        if (!heroDefaultImage) return;
        heroImg.onerror = () => {
            heroImg.onerror = null;
            heroImg.style.display = "none";
        };
        heroImg.style.display = "block";
        heroImg.src = heroDefaultImage;
        heroImg.alt = "";
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

    /* ==========================================================================
       4. FILTERS
       ========================================================================== */
    function selectGroup(g) {
        const isFirstPick = state.group === null;
        if (g === state.group) return;
        state.group = g;
        state.sub = subOrder[g][0];
        setHeroImage(g);
        hideScrollCue();
        renderGroupBar();
        renderSubBar(isFirstPick);
        renderList();
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
            btn.addEventListener("click", () => selectGroup(btn.dataset.group));
        });
    }

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
        if (item.group === "drinks") return item.sub === "chaude" ? "coffee" : "snow";
        return "crepe";
    }

    /* ==========================================================================
       5. PRODUCT GRID — card has its own quick-add stepper
       ========================================================================== */
    function thumbHTML(item) {
        if (item.image) {
            return `<img src="${item.image}" alt="" loading="lazy" onerror="window.handleThumbError(this, '${iconFor(item)}')">`;
        }
        return `<span class="card-thumb-icon">${Icons[iconFor(item)]}</span>`;
    }

    function cardSideHTML(item) {
        const qty = plainQty(item.id);
        if (qty > 0) {
            return `
        <span class="card-price">${item.price}<small> dh</small></span>
        <span class="card-stepper" data-stepper-for="${item.id}">
          <button class="card-stepper-btn" data-qtybtn="minus" data-item="${item.id}" aria-label="Retirer">${Icons.minus}</button>
          <span class="card-stepper-value">${qty}</span>
          <button class="card-stepper-btn" data-qtybtn="plus" data-item="${item.id}" aria-label="Ajouter">${Icons.plus}</button>
        </span>`;
        }
        return `
      <span class="card-price">${item.price}<small> dh</small></span>
      <button class="card-add-btn" data-quickadd="${item.id}" aria-label="Ajouter ${item.name}">${Icons.plus}</button>`;
    }

    function cardHTML(item) {
        return `
      <div class="card" data-id="${item.id}">
        <button class="card-open" data-open="${item.id}" aria-label="Voir ${item.name}">
          <span class="card-thumb ${item.image ? "has-photo" : ""}">
            ${thumbHTML(item)}
            ${item.popular ? `<span class="card-ribbon">${Icons.crown}Populaire</span>` : ""}
          </span>
          <span class="card-body">
            <span class="card-name">${item.name}</span>
            <span class="card-desc">${item.desc}</span>
            <span class="card-sales">${Icons.trending}<span data-sales-for="${item.id}">${salesDisplay(item)} commandes ce mois</span></span>
          </span>
        </button>
        <span class="card-side" data-side-for="${item.id}">
          ${cardSideHTML(item)}
        </span>
      </div>`;
    }

    function sectionHeadingHTML(label) {
        return `<h2 class="section-heading"><span>${label}</span><i class="section-heading-rule" aria-hidden="true"></i></h2>`;
    }

    /* ---- Home screen: hero → pills → 3 featured product cards → promo
       banner → footer. No search, no category tiles — the pills above
       already do the category picking. ------------------------------------ */
    function pickFeatured(count) {
        const popular = menuData.filter(i => i.popular);
        const rest = menuData.filter(i => !i.popular);
        const pool = popular.length >= count ? popular : popular.concat(rest);
        // Spread picks across different sub-categories so the 3 cards don't
        // all end up being e.g. three sweet crêpes.
        const seen = new Set();
        const picks = [];
        for (const item of pool) {
            const bucket = item.group + "|" + item.sub;
            if (seen.has(bucket) && picks.length < pool.length) continue;
            seen.add(bucket);
            picks.push(item);
            if (picks.length === count) break;
        }
        if (picks.length < count) {
            for (const item of pool) {
                if (picks.length === count) break;
                if (!picks.includes(item)) picks.push(item);
            }
        }
        return picks.slice(0, count);
    }

    function featureCardHTML(item) {
        return `
      <button class="feature-card" data-open="${item.id}">
        <span class="feature-card-media">
          <span class="feature-card-icon-bg">${Icons[iconFor(item)]}</span>
          <img src="${item.image}" alt="" loading="lazy" onerror="window.handleTileImgError(this)">
          ${item.popular ? `<span class="feature-card-ribbon">${Icons.crown}Populaire</span>` : ""}
        </span>
        <span class="feature-card-body">
          <span class="feature-card-name">${item.name}</span>
          <span class="feature-card-desc">${item.desc}</span>
          <span class="feature-card-price">${item.price} dh</span>
        </span>
      </button>`;
    }

    function promoBannerHTML() {
        const g = groupOrder[0];
        return `
      <button class="promo-banner" data-group="${g}">
        <span class="promo-banner-media">
          <span class="promo-banner-icon-bg">${Icons[groupMeta[g].icon]}</span>
          <img src="${groupMeta[g].image}" alt="" loading="lazy" onerror="window.handleTileImgError(this)">
        </span>
        <span class="promo-banner-body">
          <svg class="promo-banner-wave" viewBox="0 0 120 20" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-5 12c8-8 16-8 24 0s16 8 24 0 16-8 24 0 16 8 24 0" fill="none" stroke="currentColor" stroke-width="1.4"/>
          </svg>
          <span class="promo-banner-title">Coup de cœur du moment</span>
          <span class="promo-banner-text">Nos crêpes et gouffres garnis minute, à composer avec vos extras préférés.</span>
          <span class="promo-banner-cta"><span>Voir la carte</span>${Icons.arrowRight}</span>
        </span>
      </button>`;
    }

    function homeScreenHTML() {
        const featured = pickFeatured(3);
        return `
      <h2 class="section-heading section-heading--home"><span>Nos préférés</span><i class="section-heading-rule" aria-hidden="true"></i></h2>
      <div class="feature-list">
        ${featured.map(featureCardHTML).join("")}
      </div>
      ${promoBannerHTML()}`;
    }

    function bindHomeEvents() {
        menuSection.querySelectorAll(".promo-banner[data-group]").forEach(btn => {
            btn.addEventListener("click", () => selectGroup(btn.dataset.group));
        });
    }

    function renderList() {
        if (!state.group) {
            menuSection.innerHTML = homeScreenHTML();
            bindCardEvents();
            bindHomeEvents();
            animateListIn();
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

        bindCardEvents();
        animateListIn();
        loadLiveSalesFor(items);
    }

    function bindCardEvents() {
        menuSection.querySelectorAll("[data-open]").forEach(btn => {
            btn.addEventListener("click", () => {
                const item = menuData.find(i => i.id === btn.dataset.open);
                if (item) openSheet(item);
            });
        });

        menuSection.querySelectorAll("[data-quickadd]").forEach(btn => {
            btn.addEventListener("click", () => {
                const item = menuData.find(i => i.id === btn.dataset.quickadd);
                if (!item) return;
                addToCart(item, 1, []);
                refreshCardSide(item.id);
                showToast(`${item.name} ajouté`);
            });
        });

        bindStepperEvents();
    }

    function bindStepperEvents() {
        menuSection.querySelectorAll("[data-qtybtn]").forEach(btn => {
            btn.addEventListener("click", () => {
                const itemId = btn.dataset.item;
                const item = menuData.find(i => i.id === itemId);
                if (!item) return;
                const key = lineSignature(itemId, []);
                const current = plainQty(itemId);
                if (btn.dataset.qtybtn === "plus") {
                    if (current === 0) addToCart(item, 1, []);
                    else setLineQty(key, current + 1);
                } else {
                    setLineQty(key, current - 1);
                }
                refreshCardSide(itemId);
            });
        });
    }

    function refreshCardSide(itemId) {
        const side = menuSection.querySelector(`[data-side-for="${itemId}"]`);
        const item = menuData.find(i => i.id === itemId);
        if (!side || !item) return;
        side.innerHTML = cardSideHTML(item);
        bindStepperEvents();
        const newBtn = side.querySelector(".card-add-btn, .card-stepper");
        if (window.gsap && newBtn) gsap.fromTo(newBtn, { scale: 0.8 }, { scale: 1, duration: 0.25, ease: "back.out(3)" });
    }

    function animateListIn() {
        if (!window.gsap) return;
        gsap.fromTo(menuSection, { opacity: 0.5 }, { opacity: 1, duration: 0.2 });
        const cards = menuSection.querySelectorAll(".card");
        if (cards.length) {
            gsap.fromTo(cards, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.03 });
        }
    }

    /* ==========================================================================
       6. DETAIL SHEET — description, extras, qty, "Ajouter au panier"
       ========================================================================== */
    function openSheet(item) {
        activeItem = item;
        activeQty = 1;
        activeExtras = new Set();

        if (item.image) {
            sheetHero.classList.add("has-photo");
            sheetImg.innerHTML = `<img src="${item.image}" alt="${item.name}" onerror="window.handleSheetPhotoError(this, '${iconFor(item)}')">`;
        } else {
            sheetHero.classList.remove("has-photo");
            sheetImg.innerHTML = Icons[iconFor(item)];
        }

        sheetEyebrow.textContent = subMeta[item.sub].label;
        sheetPopularTag.style.display = item.popular ? "inline-flex" : "none";
        sheetTitle.textContent = item.name;
        sheetBasePrice.textContent = item.price + " dh";
        sheetDesc.textContent = item.desc;
        sheetSalesText.dataset.salesFor = item.id;
        sheetSalesText.textContent = salesDisplay(item) + " commandes ce mois";
        fetchLiveSales(item);

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
        refreshCardSide(activeItem.id);
        showToast(`${activeItem.name} ajouté au panier`);
        closeSheet();
    });

    sheetClose.addEventListener("click", closeSheet);
    overlay.addEventListener("click", closeSheet);
    document.addEventListener("keydown", e => { if (e.key === "Escape") { closeSheet(); closeCartSheet(); } });

    /* ==========================================================================
       7. CART BAR + CART SHEET
       ========================================================================== */
    function renderCartBar() {
        const count = cartCount();
        if (count > 0) {
            cartBar.classList.add("is-visible");
            cartBarCount.textContent = count;
            cartBarTotal.textContent = cartTotal() + " dh";
            if (window.gsap) gsap.fromTo(cartBar, { y: 8, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" });
        } else {
            cartBar.classList.remove("is-visible");
        }
        if (cartSheet.classList.contains("is-open")) renderCartSheet();
    }

    function renderCartSheet() {
        if (!cart.length) {
            cartLines.innerHTML = "";
            cartSheetEmpty.style.display = "block";
            cartSheetTotal.textContent = "0 dh";
            whatsappBtn.classList.add("is-disabled");
            return;
        }
        cartSheetEmpty.style.display = "none";
        whatsappBtn.classList.remove("is-disabled");

        cartLines.innerHTML = cart.map(line => `
      <div class="cart-line">
        <div class="cart-line-main">
          <span class="cart-line-name">${line.name}</span>
          ${line.extras.length ? `<span class="cart-line-extras">${line.extras.map(e => e.label).join(", ")}</span>` : ""}
          <span class="cart-line-unit">${lineUnit(line)} dh l'unité</span>
        </div>
        <div class="cart-line-right">
          <div class="card-stepper">
            <button class="card-stepper-btn" data-cartminus="${line.key}" aria-label="Retirer">${Icons.minus}</button>
            <span class="card-stepper-value">${line.qty}</span>
            <button class="card-stepper-btn" data-cartplus="${line.key}" aria-label="Ajouter">${Icons.plus}</button>
          </div>
          <span class="cart-line-price">${lineUnit(line) * line.qty} dh</span>
        </div>
      </div>
    `).join("");

        cartLines.querySelectorAll("[data-cartplus]").forEach(btn => {
            btn.addEventListener("click", () => {
                const line = cart.find(l => l.key === btn.dataset.cartplus);
                if (line) setLineQty(line.key, line.qty + 1);
                renderCartBar();
                if (line) refreshCardSide(line.itemId);
            });
        });
        cartLines.querySelectorAll("[data-cartminus]").forEach(btn => {
            btn.addEventListener("click", () => {
                const line = cart.find(l => l.key === btn.dataset.cartminus);
                if (line) setLineQty(line.key, line.qty - 1);
                renderCartBar();
                if (line) refreshCardSide(line.itemId);
            });
        });

        cartSheetTotal.textContent = cartTotal() + " dh";
    }

    function openCartSheet() {
        renderCartSheet();
        cartSheet.classList.add("is-open");
        document.body.style.overflow = "hidden";
        gsap.set(cartOverlay, { pointerEvents: "auto" });
        gsap.to(cartOverlay, { opacity: 1, duration: 0.25 });
        gsap.to(cartSheet, { y: "0%", duration: 0.45, ease: "power3.out" });
    }

    function closeCartSheet() {
        if (!cartSheet.classList.contains("is-open")) return;
        cartSheet.classList.remove("is-open");
        document.body.style.overflow = "";
        gsap.to(cartOverlay, { opacity: 0, duration: 0.2, onComplete: () => gsap.set(cartOverlay, { pointerEvents: "none" }) });
        gsap.to(cartSheet, { y: "100%", duration: 0.35, ease: "power3.in" });
    }

    cartBar.addEventListener("click", openCartSheet);
    cartCloseBtn.addEventListener("click", closeCartSheet);
    cartOverlay.addEventListener("click", closeCartSheet);
    cartClearBtn.addEventListener("click", () => {
        cart.length = 0;
        renderCartBar();
        renderList();
    });
    whatsappBtn.addEventListener("click", openWhatsAppCheckout);

    /* ==========================================================================
       FOOTER — populated from shopConfig so data.js stays the single file
       to edit for real shop details.
       ========================================================================== */
    function initFooter() {
        const nameEl = document.getElementById("footerShopName");
        const copyNameEl = document.getElementById("footerCopyName");
        const yearEl = document.getElementById("footerYear");

        const mapsLink = document.getElementById("footerMapsLink");
        const hoursRow = document.getElementById("footerHoursRow");
        const phoneLink = document.getElementById("footerPhoneLink");
        const instaLink = document.getElementById("footerInstaLink");
        const whatsappLink = document.getElementById("footerWhatsappLink");

        const instaBtn = document.getElementById("footerInstaBtn");
        const fbBtn = document.getElementById("footerFbBtn");

        if (nameEl) nameEl.textContent = shopConfig.name;
        if (copyNameEl) copyNameEl.textContent = shopConfig.name;
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        if (mapsLink) mapsLink.href = shopConfig.mapsUrl;
        if (phoneLink) phoneLink.href = "tel:" + shopConfig.phoneDisplay.replace(/\s+/g, "");
        if (whatsappLink) whatsappLink.href = `https://wa.me/${shopConfig.whatsapp}`;
        if (hoursRow) {
            hoursRow.addEventListener("click", () => showToast(shopConfig.hours));
        }

        const hasInsta = !!shopConfig.instagramHandle;
        if (instaLink) {
            if (hasInsta) instaLink.href = shopConfig.instagramUrl;
            else instaLink.style.display = "none";
        }
        if (instaBtn) {
            if (hasInsta) instaBtn.href = shopConfig.instagramUrl;
            else instaBtn.style.display = "none";
        }

        const hasFb = !!shopConfig.facebookUrl;
        if (fbBtn) {
            if (hasFb) fbBtn.href = shopConfig.facebookUrl;
            else fbBtn.style.display = "none";
        }
    }

    /* ---- Toast ----------------------------------------------------------- */
    let toastTimer = null;
    function showToast(msg) {
        toast.textContent = msg;
        clearTimeout(toastTimer);
        if (window.gsap) {
            gsap.killTweensOf(toast);
            gsap.set(toast, { display: "flex" });
            gsap.fromTo(toast, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" });
        } else {
            toast.style.display = "flex";
        }
        toastTimer = setTimeout(() => {
            if (window.gsap) {
                gsap.to(toast, { y: 16, opacity: 0, duration: 0.25, ease: "power2.in", onComplete: () => gsap.set(toast, { display: "none" }) });
            } else {
                toast.style.display = "none";
            }
        }, 1600);
    }

    /* ==========================================================================
       INIT
       ========================================================================== */
    setDefaultHeroImage();
    renderGroupBar();
    renderSubBar(false);
    renderList();
    renderCartBar();
    bounceScrollCue();
    initFooter();
});