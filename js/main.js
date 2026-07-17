const productList = document.getElementById('productList');
const categoryFilters = document.getElementById('categoryFilters');
const resultsTitle = document.getElementById('resultsTitle');
const resultsCount = document.getElementById('resultsCount');
const splashScreen = document.getElementById('splashScreen');
const bottomSheet = document.getElementById('bottomSheet');
const backdrop = document.getElementById('backdrop');
const sheetClose = document.getElementById('sheetClose');
const sheetHandle = document.getElementById('sheetHandle');
const sheetImage = document.getElementById('sheetImage');
const sheetCategory = document.getElementById('sheetCategory');
const sheetTitle = document.getElementById('sheetTitle');
const sheetPrice = document.getElementById('sheetPrice');
const sheetDescription = document.getElementById('sheetDescription');
const extrasSection = document.getElementById('extrasSection');
const extrasList = document.getElementById('extrasList');
const quantityValue = document.getElementById('quantityValue');
const decreaseQty = document.getElementById('decreaseQty');
const increaseQty = document.getElementById('increaseQty');
const addToOrderBtn = document.getElementById('addToOrderBtn');
const ctaTotal = document.getElementById('ctaTotal');

const state = {
  activeCategory: 'All',
  selectedItem: null,
  selectedExtras: new Set(),
  quantity: 1,
  sheetOpen: false,
  previousFocus: null
};

const formatPrice = (value, currency = 'dh') => `${value.toFixed(2)} ${currency}`;

const getFilteredItems = () =>
  state.activeCategory === 'All'
    ? menuItems
    : menuItems.filter((item) => item.category === state.activeCategory);

function renderCategoryFilters() {
  categoryFilters.innerHTML = '';

  menuCategories.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `category-pill ${category === state.activeCategory ? 'category-pill--active' : ''}`;
    button.textContent = category;
    button.setAttribute('aria-pressed', String(category === state.activeCategory));

    button.addEventListener('click', () => {
      if (category === state.activeCategory) return;
      state.activeCategory = category;
      renderCategoryFilters();
      renderProducts(true);
    });

    categoryFilters.appendChild(button);
  });
}

function createProductCard(item) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'product-card';
  card.setAttribute('data-id', item.id);
  card.setAttribute('aria-label', `Open details for ${item.name}`);

  card.innerHTML = `
    <div class="product-card__thumb">
      <img src="${item.image}" alt="${item.name}" loading="lazy" />
    </div>
    <div class="product-card__body">
      <span class="product-card__category">${item.category}</span>
      <div class="product-card__title-row">
        <h4 class="product-card__title">${item.name}</h4>
        <span class="product-card__price">${formatPrice(item.price, item.currency)}</span>
      </div>
      <p class="product-card__description">${item.description}</p>
      <span class="product-card__action" aria-hidden="true">+</span>
    </div>
  `;

  card.addEventListener('click', () => openBottomSheet(item, card));
  return card;
}

function renderProducts(withAnimation = false) {
  const items = getFilteredItems();
  productList.innerHTML = '';

  items.forEach((item) => {
    productList.appendChild(createProductCard(item));
  });

  resultsTitle.textContent = state.activeCategory === 'All' ? 'All Menu' : state.activeCategory;
  resultsCount.textContent = `${items.length} item${items.length > 1 ? 's' : ''}`;

  if (withAnimation) {
    gsap.fromTo(
      '.product-card',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'all'
      }
    );
  }
}

function renderExtras(item) {
  extrasList.innerHTML = '';

  if (!item.extras || item.extras.length === 0) {
    extrasSection.classList.add('hidden');
    return;
  }

  extrasSection.classList.remove('hidden');

  item.extras.forEach((extra) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = `extra-option ${state.selectedExtras.has(extra.id) ? 'extra-option--selected' : ''}`;
    option.innerHTML = `
      <span class="extra-option__check" aria-hidden="true"></span>
      <span class="extra-option__name">${extra.name}</span>
      <span class="extra-option__price">+${formatPrice(extra.price, item.currency)}</span>
    `;

    option.addEventListener('click', () => {
      if (state.selectedExtras.has(extra.id)) {
        state.selectedExtras.delete(extra.id);
      } else {
        state.selectedExtras.add(extra.id);
      }

      renderExtras(item);
      updateSheetTotals();
    });

    extrasList.appendChild(option);
  });
}

function updateSheetTotals() {
  if (!state.selectedItem) return;

  const extrasTotal = state.selectedItem.extras
    .filter((extra) => state.selectedExtras.has(extra.id))
    .reduce((sum, extra) => sum + extra.price, 0);

  const total = (state.selectedItem.price + extrasTotal) * state.quantity;
  quantityValue.textContent = state.quantity;
  ctaTotal.textContent = formatPrice(total, state.selectedItem.currency);
}

function populateSheet(item) {
  sheetImage.src = item.image;
  sheetImage.alt = item.name;
  sheetCategory.textContent = item.category;
  sheetTitle.textContent = item.name;
  sheetPrice.textContent = formatPrice(item.price, item.currency);
  sheetDescription.textContent = item.description;

  renderExtras(item);
  updateSheetTotals();
}

const sheetTimeline = gsap.timeline({
  paused: true,
  defaults: { ease: 'power3.out' },
  onReverseComplete: () => {
    backdrop.classList.add('hidden');
    bottomSheet.setAttribute('aria-hidden', 'true');
    state.sheetOpen = false;
    document.body.style.overflow = '';
    if (state.previousFocus) {
      state.previousFocus.focus();
    }
  }
});

sheetTimeline
  .to(backdrop, { autoAlpha: 1, duration: 0.22 }, 0)
  .to(bottomSheet, { y: '0%', duration: 0.48 }, 0)
  .from(
    '.bottom-sheet__media-wrap, .bottom-sheet__intro, .bottom-sheet__description, .extras, .sheet-footer',
    { y: 18, opacity: 0, duration: 0.36, stagger: 0.05 },
    0.08
  );

function openBottomSheet(item, triggerElement) {
  state.selectedItem = item;
  state.selectedExtras = new Set();
  state.quantity = 1;
  state.previousFocus = triggerElement;

  populateSheet(item);

  backdrop.classList.remove('hidden');
  bottomSheet.setAttribute('aria-hidden', 'false');
  state.sheetOpen = true;
  document.body.style.overflow = 'hidden';
  sheetTimeline.play(0);
}

function closeBottomSheet() {
  if (!state.sheetOpen) return;
  sheetTimeline.reverse();
}

function bootSplashSequence() {
  const introTimeline = gsap.timeline();

  introTimeline
    .fromTo(
      '.splash-screen__inner',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
    )
    .to({}, { duration: 1 })
    .to(splashScreen, {
      y: '-100%',
      duration: 0.9,
      ease: 'power3.inOut',
      onComplete: () => {
        splashScreen.style.display = 'none';
      }
    })
    .fromTo(
      '.product-card',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.48,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all'
      },
      '-=0.15'
    );
}

function initEvents() {
  backdrop.addEventListener('click', closeBottomSheet);
  sheetClose.addEventListener('click', closeBottomSheet);
  sheetHandle.addEventListener('click', closeBottomSheet);

  increaseQty.addEventListener('click', () => {
    if (!state.selectedItem) return;
    state.quantity += 1;
    updateSheetTotals();
  });

  decreaseQty.addEventListener('click', () => {
    if (!state.selectedItem || state.quantity === 1) return;
    state.quantity -= 1;
    updateSheetTotals();
  });

  addToOrderBtn.addEventListener('click', () => {
    if (!state.selectedItem) return;
    addToOrderBtn.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.98)' },
        { transform: 'scale(1)' }
      ],
      { duration: 220, easing: 'ease-out' }
    );
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.sheetOpen) {
      closeBottomSheet();
    }
  });
}

function init() {
  renderCategoryFilters();
  renderProducts();
  initEvents();
  // Intro animation disabled: bootSplashSequence is not run on load.
}

init();
