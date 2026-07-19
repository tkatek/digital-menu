/* ==========================================================================
   data.js — Menu content for "Mehdi Crêpes & Drinks"
   --------------------------------------------------------------------------
   This is the ONLY file you should need to touch day-to-day: add a dish,
   change a price, mark something popular, or attach a real photo — the
   layout, filters and detail sheet all pick it up automatically.

   TAXONOMY
     group : "crepe" | "drinks"          level-1 filter (top row)
     sub   : "crepe" | "gouffre"         level-2 filter, when group = crepe
             "chaude" | "froide"         level-2 filter, when group = drinks
     type  : "sucre" | "sale"            only used to sub-head the crêpe list

   PER-ITEM FIELDS
     name     string   required
     group    string   required, see above
     sub      string   required, see above
     type     string   "sucre" | "sale" — crêpes only
     price    number   required, in dh
     extras   boolean  true = the extras list (Nutella, banane…) is offered
     popular  boolean  true = shows a gold "Populaire" ribbon on the card
     image    string   optional path, e.g. "assets/images/crepe-nutella.jpg"
                        Recommended: square or 4:5, ≥600×600px, JPG/WEBP.
                        Drop the file in assets/images/ and add this one
                        key — the card thumbnail AND the detail sheet
                        switch from the line-icon to the real photo with
                        zero other code changes.
   ========================================================================== */

// ---- Shop identity & checkout ---------------------------------------------
// WhatsApp number in international format, digits only, NO leading "+".
// Example: a Morocco mobile 06 12 34 56 78 becomes "212612345678".
// >>> REPLACE THIS with the real shop number before going live. <<<
//
// Everything below is used by the footer (Nous trouver / Horaires / Appeler /
// Instagram cards) — edit these six lines and the footer updates everywhere,
// no HTML changes needed.
const shopConfig = {
    name: "Mehdi Crêpes & Drinks",
    whatsapp: "212600000000",
    phoneDisplay: "06 00 00 00 00",       // shown on the footer "Appeler" card
    address: "Guéliz, Marrakech",          // shown on the footer "Nous trouver" card
    mapsUrl: "https://maps.google.com/?q=Mehdi+Crepes+Drinks+Marrakech", // >>> REPLACE with your real Google Maps link <<<
    hours: "Tous les jours · 9h – minuit",
    instagramHandle: "@mehdi.crepes",      // set to "" to hide the Instagram card
    instagramUrl: "https://instagram.com/mehdi.crepes",
    facebookUrl: ""                        // set to your Page URL to show the Facebook icon, or leave "" to hide it
};

// ---- Level-1 groups (top filter row) -------------------------------------
// `image`     — small tile photo (feature cards, promo banner)
// `heroImage` — big banner photo shown behind the title once that group
//               is selected (falls back to `image` if you don't have a
//               separate wide shot for it)
const groupMeta = {
    crepe: { label: "Crêpes", icon: "crepe", image: "assets/images/creep.jpg", heroImage: "assets/images/gofer hero.jpg" },
    drinks: { label: "Boissons", icon: "cup", image: "assets/images/drink.jpg", heroImage: "assets/images/drinks hero.jpg" }
};
const groupOrder = ["crepe", "drinks"];

// Shown behind the title on first load, before a category is picked.
const heroDefaultImage = "assets/images/reda.jpeg";

// ---- Level-2 subcategories (second filter row, contextual) ---------------
const subMeta = {
    crepe: { label: "Crêpes", icon: "crepe", group: "crepe" },
    gouffre: { label: "Gouffre", icon: "waffle", group: "crepe" },
    chaude: { label: "Chaude", icon: "flame", group: "drinks" },
    froide: { label: "Froide", icon: "snow", group: "drinks" }
};
const subOrder = {
    crepe: ["crepe", "gouffre"],
    drinks: ["chaude", "froide"]
};

// ---- Real "Extras" pulled from the physical menu board --------------------
// Sits between the Gouffre and Crêpes Salés columns on the board, so it's
// applied to sweet crêpes + gouffres — not to savory crêpes or drinks.
const extrasCatalog = [
    { id: "nutella", label: "Extra Nutella", price: 3 },
    { id: "banane", label: "Extra banane", price: 3 },
    { id: "biscuit", label: "Extra biscuit", price: 5 },
    { id: "fruitsec", label: "Extra fruits secs", price: 7 },
    { id: "fruits", label: "Extra fruits", price: 8 }
];

function describeItem(item) {
    const d = {
        crepe_sucre: "Crêpe fine roulée minute, garnie généreusement.",
        crepe_sale: "Crêpe salée garnie, servie chaude à la commande.",
        gouffre: "Gaufre croustillante dehors, moelleuse dedans.",
        chaude: "Servi bien chaud, préparé minute au comptoir.",
        froide: "Servi frais, glaçons et bulles inclus."
    };
    if (item.sub === "crepe") return d["crepe_" + item.type];
    return d[item.sub] || "Préparé minute, à savourer sur place.";
}

// price stored as a Number (dh) so totals can be computed live.
const rawMenuData = [
    // --- BOISSONS CHAUDES ---
    { name: "Café espresso", group: "drinks", sub: "chaude", price: 8 },
    { name: "Double espresso", group: "drinks", sub: "chaude", price: 12 },
    { name: "Allongé", group: "drinks", sub: "chaude", price: 8 },
    { name: "Ness-Ness", group: "drinks", sub: "chaude", price: 10 },
    { name: "Café séparé", group: "drinks", sub: "chaude", price: 12 },
    { name: "Cappuccino", group: "drinks", sub: "chaude", price: 10, popular: true },
    { name: "Chocolate chaud", group: "drinks", sub: "chaude", price: 9 },
    { name: "Café crème", group: "drinks", sub: "chaude", price: 10 },
    { name: "Lait chaud", group: "drinks", sub: "chaude", price: 8 },
    { name: "Lait avec lipton", group: "drinks", sub: "chaude", price: 9 },
    { name: "Eau avec lipton", group: "drinks", sub: "chaude", price: 9 },
    { name: "Lait avec Lwiza", group: "drinks", sub: "chaude", price: 10 },
    { name: "Eau avec lwiza", group: "drinks", sub: "chaude", price: 8 },
    { name: "Eau", group: "drinks", sub: "chaude", price: 3 },

    // --- BOISSONS FROIDES ---
    { name: "Jus de orange", group: "drinks", sub: "froide", price: 15 },
    { name: "Milkshake au choix", group: "drinks", sub: "froide", price: 20, popular: true },
    { name: "Ace coffee", group: "drinks", sub: "froide", price: 15 },
    { name: "Mojito", group: "drinks", sub: "froide", price: 15 },
    { name: "Jus banane", group: "drinks", sub: "froide", price: 15 },
    { name: "Jus d'avocat", group: "drinks", sub: "froide", price: 18, popular: true },
    { name: "Jus fraise", group: "drinks", sub: "froide", price: 18 },
    { name: "Jus de citron", group: "drinks", sub: "froide", price: 12 },
    { name: "Panaché", group: "drinks", sub: "froide", price: 18 },
    { name: "Soda", group: "drinks", sub: "froide", price: 10 },

    // --- CRÊPES SUCRÉS (extras allowed) ---
    { name: "Crêpes Nutella", group: "crepe", sub: "crepe", type: "sucre", price: 14, extras: true, popular: true },
    { name: "Crêpes Nutella banane", group: "crepe", sub: "crepe", type: "sucre", price: 16, extras: true },
    { name: "Crêpes Nutella lotus", group: "crepe", sub: "crepe", type: "sucre", price: 18, extras: true },
    { name: "Crêpes Nutella lotus banane", group: "crepe", sub: "crepe", type: "sucre", price: 20, extras: true },
    { name: "Crêpes kinder bueno", group: "crepe", sub: "crepe", type: "sucre", price: 20, extras: true, popular: true },
    { name: "Crêpes kinder bueno banane", group: "crepe", sub: "crepe", type: "sucre", price: 22, extras: true },
    { name: "Crêpes Nutella Oreo", group: "crepe", sub: "crepe", type: "sucre", price: 18, extras: true },
    { name: "Crêpes Nutella Oreo banane", group: "crepe", sub: "crepe", type: "sucre", price: 20, extras: true },
    { name: "Crêpes Nutella kitkat", group: "crepe", sub: "crepe", type: "sucre", price: 18, extras: true },
    { name: "Crêpes Nutella kitkat banane", group: "crepe", sub: "crepe", type: "sucre", price: 20, extras: true },
    { name: "Crêpe Nutella Milka", group: "crepe", sub: "crepe", type: "sucre", price: 16, extras: true },
    { name: "Crêpes Nutella Milka banane", group: "crepe", sub: "crepe", type: "sucre", price: 18, extras: true },
    { name: "Crêpes Nutella fruits secs", group: "crepe", sub: "crepe", type: "sucre", price: 22, extras: true },
    { name: "Crêpes Nutella fruits sec banane", group: "crepe", sub: "crepe", type: "sucre", price: 25, extras: true },
    { name: "Crêpes Nutella fruits", group: "crepe", sub: "crepe", type: "sucre", price: 20, extras: true },
    { name: "Crêpes Nutella konafa", group: "crepe", sub: "crepe", type: "sucre", price: 20, extras: true },
    { name: "Crêpes mixte (sucré)", group: "crepe", sub: "crepe", type: "sucre", price: 30, extras: true },

    // --- GOUFFRES (extras allowed) ---
    { name: "Gouffre nature", group: "crepe", sub: "gouffre", price: 10, extras: true },
    { name: "Gouffre Nutella", group: "crepe", sub: "gouffre", price: 15, extras: true, popular: true },
    { name: "Gouffre banane", group: "crepe", sub: "gouffre", price: 17, extras: true },
    { name: "Gouffre + biscuit au choix", group: "crepe", sub: "gouffre", price: 22, extras: true },

    // --- CRÊPES SALÉS (no sweet extras) ---
    { name: "Crêpes fromage", group: "crepe", sub: "crepe", type: "sale", price: 20, extras: false },
    { name: "Crêpes fromage dinde fumé", group: "crepe", sub: "crepe", type: "sale", price: 25, extras: false, popular: true },
    { name: "Crêpes viande haché", group: "crepe", sub: "crepe", type: "sale", price: 25, extras: false },
    { name: "Crêpes dinde", group: "crepe", sub: "crepe", type: "sale", price: 20, extras: false },
    { name: "Crêpes mixte (salé)", group: "crepe", sub: "crepe", type: "sale", price: 30, extras: false }
];

// Real photo sets pulled from assets/images/ — one per sub-category so
// every dish gets an actual picture instead of the fallback line-icon.
// Photos are cycled in order, so e.g. the 1st, 4th, 7th... sweet crêpe
// share creep1.jpg, the 2nd/5th/8th share creep2.jpg, and so on.
const photoSets = {
    "crepe|crepe|sucre": ["assets/images/creep1.jpg", "assets/images/creep2.jpg", "assets/images/creep3.jpg"],
    "crepe|crepe|sale": ["assets/images/creep1.jpg", "assets/images/creep2.jpg", "assets/images/creep3.jpg"],
    "crepe|gouffre": ["assets/images/gofer1.jpg", "assets/images/gofer2.jpg", "assets/images/gofer3.jpg", "assets/images/gofer4.jpg"],
    "drinks|chaude": ["assets/images/drink1.jpg", "assets/images/drink2.jpg", "assets/images/drink3.jpg"],
    "drinks|froide": ["assets/images/drink1.jpg", "assets/images/drink2.jpg", "assets/images/drink3.jpg"]
};
const photoCounters = {};

function pickPhoto(item) {
    const key = item.group + "|" + item.sub + (item.type ? "|" + item.type : "");
    const set = photoSets[key];
    if (!set) return item.group === "drinks" ? "assets/images/drink.jpg" : "assets/images/creep.jpg";
    const n = photoCounters[key] || 0;
    photoCounters[key] = n + 1;
    return set[n % set.length];
}

const menuData = rawMenuData.map((item, i) => {
    return {
        id: "item-" + i,
        extras: false,
        popular: false,
        ...item,
        image: item.image || pickPhoto(item),
        desc: describeItem(item)
    };
});