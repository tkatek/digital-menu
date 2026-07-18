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

// ---- Level-1 groups (top filter row) -------------------------------------
const groupMeta = {
  crepe:  { label: "Crêpes",   icon: "crepe", image: "assets/images/creep.jpg" },
  drinks: { label: "Boissons", icon: "cup",   image: "assets/images/drin k.jpg" }
};
const groupOrder = ["crepe", "drinks"];

// ---- Level-2 subcategories (second filter row, contextual) ---------------
const subMeta = {
  crepe:   { label: "Crêpes",  icon: "crepe",  group: "crepe" },
  gouffre: { label: "Gouffre", icon: "waffle", group: "crepe" },
  chaude:  { label: "Chaude",  icon: "flame",  group: "drinks" },
  froide:  { label: "Froide",  icon: "snow",   group: "drinks" }
};
const subOrder = {
  crepe:  ["crepe", "gouffre"],
  drinks: ["chaude", "froide"]
};

// ---- Real "Extras" pulled from the physical menu board --------------------
// Sits between the Gouffre and Crêpes Salés columns on the board, so it's
// applied to sweet crêpes + gouffres — not to savory crêpes or drinks.
const extrasCatalog = [
  { id: "nutella",  label: "Extra Nutella",      price: 3 },
  { id: "banane",   label: "Extra banane",       price: 3 },
  { id: "biscuit",  label: "Extra biscuit",      price: 5 },
  { id: "fruitsec", label: "Extra fruits secs",  price: 7 },
  { id: "fruits",   label: "Extra fruits",       price: 8 }
];

function describeItem(item) {
  const d = {
    crepe_sucre:  "Crêpe fine roulée minute, garnie généreusement.",
    crepe_sale:   "Crêpe salée garnie, servie chaude à la commande.",
    gouffre:      "Gaufre croustillante dehors, moelleuse dedans.",
    chaude:       "Servi bien chaud, préparé minute au comptoir.",
    froide:       "Servi frais, glaçons et bulles inclus."
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

const menuData = rawMenuData.map((item, i) => {
  const fallbackImage = item.group === "drinks" ? "assets/images/drin k.jpg" : "assets/images/creep.jpg";
  return {
    id: "item-" + i,
    extras: false,
    popular: false,
    image: item.image || fallbackImage,
    ...item,
    desc: describeItem(item)
  };
});