'use strict';

/**
 * ====================================================================
 * FOOTCAP ULTRA-PREMIUM INTERACTIVE E-COMMERCE ENGINE
 * ====================================================================
 */

// Global State
const state = {
  theme: localStorage.getItem('footcap_theme') || 'light',
  cart: JSON.parse(localStorage.getItem('footcap_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('footcap_wishlist') || '[]'),
  activeBrand: 'all',
  activeSort: 'featured',
  selectedSize: '42'
};

// Products Database
const productsDB = [
  {
    id: 1,
    name: 'Running Sneaker Shoes',
    brand: 'nike',
    category: 'Men / Women',
    price: 180.85,
    originalPrice: 220.00,
    rating: 4.9,
    reviews: 148,
    badge: 'NEW',
    badgeType: 'badge-new',
    image: './assets/images/product-1.jpg',
    colors: ['#0f172a', '#ff4655', '#ffffff'],
    description: 'Designed for relentless runners, featuring responsive Zoom Air cushioning, hyper-breathable engineered knit, and high-traction rubber lugs for all conditions.'
  },
  {
    id: 2,
    name: 'Leather Mens Slipper',
    brand: 'bata',
    category: 'Men / Casual',
    price: 190.85,
    originalPrice: 210.00,
    rating: 4.7,
    reviews: 92,
    badge: 'HOT',
    badgeType: 'badge-hot',
    image: './assets/images/product-2.jpg',
    colors: ['#78350f', '#0f172a'],
    description: 'Artisanal handcrafted full-grain leather slide engineered with memory-foam footbeds for superior luxury comfort throughout the day.'
  },
  {
    id: 3,
    name: 'Simple Fabric Shoe',
    brand: 'apex',
    category: 'Men / Women',
    price: 160.85,
    originalPrice: null,
    rating: 4.8,
    reviews: 115,
    badge: 'NEW',
    badgeType: 'badge-new',
    image: './assets/images/product-3.jpg',
    colors: ['#64748b', '#0f172a', '#ffffff'],
    description: 'Minimalist aerodynamic silhouette constructed with sustainable organic woven canvas, lightweight EVA midsoles, and sleek contemporary lines.'
  },
  {
    id: 4,
    name: 'Air Jordan 7 Retro',
    brand: 'nike',
    category: 'Men / Sports',
    price: 170.85,
    originalPrice: 200.21,
    rating: 5.0,
    reviews: 236,
    badge: '-25%',
    badgeType: 'badge-sale',
    image: './assets/images/product-4.jpg',
    colors: ['#ff4655', '#0f172a', '#e2e8f0'],
    description: 'The legendary championship silhouette remastered with premium tumbled leather, heritage neoprene bootie construction, and iconic dual Air units.'
  },
  {
    id: 5,
    name: 'Nike Air Max 270 SE',
    brand: 'nike',
    category: 'Men / Women',
    price: 120.85,
    originalPrice: null,
    rating: 4.9,
    reviews: 310,
    badge: 'NEW',
    badgeType: 'badge-new',
    image: './assets/images/product-5.jpg',
    colors: ['#3b82f6', '#0f172a', '#ffffff'],
    description: 'Nike’s biggest heel Max Air unit delivers an ultra-soft trampoline ride that feels as impossible as it looks. Engineered for supreme street comfort.'
  },
  {
    id: 6,
    name: 'Adidas Sneakers Shoes',
    brand: 'adidas',
    category: 'Men / Women',
    price: 100.85,
    originalPrice: 130.00,
    rating: 4.8,
    reviews: 174,
    badge: 'HOT',
    badgeType: 'badge-hot',
    image: './assets/images/product-6.jpg',
    colors: ['#0f172a', '#ffffff'],
    description: 'Iconic 3-Stripes heritage meets Cloudfoam energy cushioning. A timeless daily sneaker built for effortless versatility and durability.'
  },
  {
    id: 7,
    name: 'Nike Basketball Shoes',
    brand: 'nike',
    category: 'Men / Sports',
    price: 120.85,
    originalPrice: null,
    rating: 4.9,
    reviews: 88,
    badge: null,
    badgeType: null,
    image: './assets/images/product-7.jpg',
    colors: ['#e11d48', '#0f172a'],
    description: 'Explosive court responsiveness engineered with multidirectional herringbone traction, reinforced lateral outriggers, and dynamic lockdown lacing.'
  },
  {
    id: 8,
    name: 'Puma Velocity Nitro 2',
    brand: 'puma',
    category: 'Men / Women',
    price: 100.85,
    originalPrice: null,
    rating: 4.7,
    reviews: 64,
    badge: 'NEW',
    badgeType: 'badge-new',
    image: './assets/images/product-8.jpg',
    colors: ['#10b981', '#0f172a', '#ffffff'],
    description: 'Lightweight, ultra-responsive road running powerhouse equipped with NITRO FOAM infusion and PUMAGRIP all-surface traction compound.'
  }
];

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderProducts();
  setupFilterAndSort();
  setupCart();
  setupWishlist();
  setupModals();
  setupSearch();
  setupCountdown();
  setupNewsletter();
  setupNavAndScroll();
});

/**
 * ====================================================================
 * 1. THEME SWITCHER (Dark / Light Mode)
 * ====================================================================
 */
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  const themeToggleBtn = document.querySelector('[data-theme-toggle]');
  
  updateThemeIcon(themeToggleBtn, state.theme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('footcap_theme', state.theme);
      updateThemeIcon(themeToggleBtn, state.theme);
      showToast(state.theme === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
    });
  }
}

function updateThemeIcon(btn, theme) {
  if (!btn) return;
  const icon = btn.querySelector('ion-icon');
  if (icon) {
    icon.setAttribute('name', theme === 'dark' ? 'sunny-outline' : 'moon-outline');
  }
}

/**
 * ====================================================================
 * 2. PRODUCT RENDERING & FILTERING
 * ====================================================================
 */
function renderProducts() {
  const productContainer = document.querySelector('[data-product-list]');
  if (!productContainer) return;

  // Filter
  let filtered = productsDB.filter(p => {
    if (state.activeBrand === 'all') return true;
    return p.brand.toLowerCase() === state.activeBrand.toLowerCase();
  });

  // Sort
  if (state.activeSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.activeSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.activeSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  productContainer.innerHTML = filtered.map(product => {
    const isWishlisted = state.wishlist.includes(product.id);
    return `
      <li class="product-item" data-product-id="${product.id}">
        <div class="product-card">
          <figure class="card-banner" data-action="quickview" data-id="${product.id}" style="cursor: pointer;">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            
            ${product.badge ? `<div class="card-badge ${product.badgeType}">${product.badge}</div>` : ''}

            <div class="card-actions">
              <button class="card-action-btn wishlist-btn ${isWishlisted ? 'active' : ''}" 
                      data-action="wishlist" data-id="${product.id}" aria-label="Add to Wishlist" title="Wishlist">
                <ion-icon name="${isWishlisted ? 'heart' : 'heart-outline'}"></ion-icon>
              </button>
              <button class="card-action-btn" data-action="quickview" data-id="${product.id}" aria-label="Quick View" title="Quick View">
                <ion-icon name="eye-outline"></ion-icon>
              </button>
            </div>
          </figure>

          <div class="card-body">
            <div class="card-brand-row">
              <span class="card-brand">${product.brand}</span>
              <div class="card-rating">
                <ion-icon name="star"></ion-icon>
                <span>${product.rating} (${product.reviews})</span>
              </div>
            </div>

            <h3 class="card-title" data-action="quickview" data-id="${product.id}" style="cursor: pointer;">${product.name}</h3>

            <div class="card-color-swatches">
              ${product.colors.map(c => `<span class="color-dot" style="background-color: ${c}"></span>`).join('')}
            </div>

            <div class="card-footer-row">
              <div class="card-price-box">
                <span class="card-price">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="card-price-del">$${product.originalPrice.toFixed(2)}</span>` : ''}
              </div>

              <button class="card-add-btn" data-action="add-to-cart" data-id="${product.id}">
                <ion-icon name="bag-handle-outline"></ion-icon>
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </li>
    `;
  }).join('');

  attachProductCardEvents();
}

function setupFilterAndSort() {
  const filterBtns = document.querySelectorAll('[data-filter-btn]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeBrand = btn.dataset.filterBtn;
      renderProducts();
    });
  });

  const sortSelect = document.querySelector('[data-sort-select]');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.activeSort = e.target.value;
      renderProducts();
    });
  }
}

function attachProductCardEvents() {
  document.querySelectorAll('[data-action="add-to-cart"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      addToCart(id, '42');
    });
  });

  document.querySelectorAll('[data-action="wishlist"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      toggleWishlist(id, btn);
    });
  });

  document.querySelectorAll('[data-action="quickview"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      openQuickView(id);
    });
  });
}

/**
 * ====================================================================
 * 3. CART SYSTEM & SLIDE-OVER DRAWER
 * ====================================================================
 */
function setupCart() {
  const cartBtn = document.querySelector('[data-cart-btn]');
  const cartDrawer = document.querySelector('[data-cart-drawer]');
  const cartOverlay = document.querySelector('[data-cart-overlay]');
  const cartCloseBtn = document.querySelector('[data-cart-close]');

  if (cartBtn && cartDrawer && cartOverlay) {
    cartBtn.addEventListener('click', () => openCart());
    cartOverlay.addEventListener('click', () => closeCart());
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => closeCart());
  }

  const checkoutBtn = document.querySelector('[data-checkout-btn]');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (state.cart.length === 0) {
        showToast('Your bag is currently empty!');
        return;
      }
      showToast('🎉 Order Placed! Thank you for choosing Footcap.');
      state.cart = [];
      saveCart();
      updateCartUI();
      closeCart();
    });
  }

  // Preload sample items if empty for premium presentation
  if (state.cart.length === 0) {
    state.cart = [
      { id: 1, size: '42', quantity: 1 },
      { id: 4, size: '43', quantity: 1 }
    ];
    saveCart();
  }

  updateCartUI();
}

function openCart() {
  const cartDrawer = document.querySelector('[data-cart-drawer]');
  const cartOverlay = document.querySelector('[data-cart-overlay]');
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  const cartDrawer = document.querySelector('[data-cart-drawer]');
  const cartOverlay = document.querySelector('[data-cart-overlay]');
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function addToCart(productId, size = '42', quantity = 1) {
  const existing = state.cart.find(item => item.id === productId && item.size === size);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({ id: productId, size, quantity });
  }

  saveCart();
  updateCartUI();
  
  const product = productsDB.find(p => p.id === productId);
  showToast(`🛍️ Added "${product ? product.name : 'Item'}" (Size EU ${size}) to Bag!`);
  
  // Bump cart button animation
  const cartBtn = document.querySelector('[data-cart-btn]');
  if (cartBtn) {
    cartBtn.classList.add('bump');
    setTimeout(() => cartBtn.classList.remove('bump'), 400);
  }
}

function updateCartItemQty(id, size, delta) {
  const index = state.cart.findIndex(i => i.id === id && i.size === size);
  if (index > -1) {
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
  }
  saveCart();
  updateCartUI();
}

function removeCartItem(id, size) {
  state.cart = state.cart.filter(i => !(i.id === id && i.size === size));
  saveCart();
  updateCartUI();
  showToast('Item removed from Bag');
}

function saveCart() {
  localStorage.setItem('footcap_cart', JSON.stringify(state.cart));
}

function updateCartUI() {
  const cartList = document.querySelector('[data-cart-items]');
  const cartBadge = document.querySelector('[data-cart-badge]');
  const cartTotalText = document.querySelector('[data-cart-total]');
  const subtotalText = document.querySelector('[data-cart-subtotal]');
  const shippingText = document.querySelector('[data-cart-shipping]');
  const finalTotalText = document.querySelector('[data-cart-final-total]');
  const meterProgress = document.querySelector('[data-meter-progress]');
  const meterText = document.querySelector('[data-meter-text]');

  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) cartBadge.textContent = totalCount;

  let subtotal = 0;
  state.cart.forEach(item => {
    const p = productsDB.find(x => x.id === item.id);
    if (p) subtotal += p.price * item.quantity;
  });

  const freeShippingThreshold = 150;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;
  const total = subtotal + shipping;

  if (cartTotalText) cartTotalText.innerHTML = `Basket: <strong>$${total.toFixed(2)}</strong>`;
  if (subtotalText) subtotalText.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingText) shippingText.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  if (finalTotalText) finalTotalText.textContent = `$${total.toFixed(2)}`;

  // Shipping progress meter
  if (meterProgress && meterText) {
    if (subtotal >= freeShippingThreshold) {
      meterProgress.style.width = '100%';
      meterText.innerHTML = '🎉 You unlocked <strong>FREE Express Shipping!</strong>';
    } else {
      const remaining = freeShippingThreshold - subtotal;
      const pct = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
      meterProgress.style.width = `${pct}%`;
      meterText.innerHTML = `Add <strong>$${remaining.toFixed(2)}</strong> more for FREE Shipping!`;
    }
  }

  // Render items
  if (cartList) {
    if (state.cart.length === 0) {
      cartList.innerHTML = `
        <div class="cart-empty-message">
          <ion-icon name="bag-outline"></ion-icon>
          <p>Your shopping bag is empty.</p>
          <button class="btn btn-primary" onclick="closeCart(); document.getElementById('shop').scrollIntoView();" style="margin-top: 15px;">
            Shop Bestsellers
          </button>
        </div>
      `;
    } else {
      cartList.innerHTML = state.cart.map(item => {
        const prod = productsDB.find(p => p.id === item.id);
        if (!prod) return '';
        return `
          <div class="cart-item">
            <div class="cart-item-img">
              <img src="${prod.image}" alt="${prod.name}">
            </div>
            <div class="cart-item-info">
              <h4 class="cart-item-name">${prod.name}</h4>
              <p class="cart-item-meta">Size: EU ${item.size}</p>
              <span class="cart-item-price">$${(prod.price * item.quantity).toFixed(2)}</span>
            </div>
            <div class="cart-qty-ctrl">
              <button class="qty-btn" onclick="updateCartItemQty(${item.id}, '${item.size}', -1)">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="updateCartItemQty(${item.id}, '${item.size}', 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeCartItem(${item.id}, '${item.size}')" title="Remove">
              <ion-icon name="trash-outline"></ion-icon>
            </button>
          </div>
        `;
      }).join('');
    }
  }
}

/**
 * ====================================================================
 * 4. WISHLIST SYSTEM
 * ====================================================================
 */
function setupWishlist() {
  updateWishlistBadge();
}

function toggleWishlist(productId, btnElement) {
  const index = state.wishlist.indexOf(productId);
  const product = productsDB.find(p => p.id === productId);

  if (index > -1) {
    state.wishlist.splice(index, 1);
    if (btnElement) {
      btnElement.classList.remove('active');
      const icon = btnElement.querySelector('ion-icon');
      if (icon) icon.setAttribute('name', 'heart-outline');
    }
    showToast(`Removed from Wishlist`);
  } else {
    state.wishlist.push(productId);
    if (btnElement) {
      btnElement.classList.add('active');
      const icon = btnElement.querySelector('ion-icon');
      if (icon) icon.setAttribute('name', 'heart');
    }
    showToast(`❤️ Saved "${product ? product.name : 'Shoe'}" to Wishlist!`);
  }

  localStorage.setItem('footcap_wishlist', JSON.stringify(state.wishlist));
  updateWishlistBadge();
}

function updateWishlistBadge() {
  const badge = document.querySelector('[data-wishlist-badge]');
  if (badge) badge.textContent = state.wishlist.length;
}

/**
 * ====================================================================
 * 5. QUICK VIEW MODAL
 * ====================================================================
 */
function setupModals() {
  const modalOverlay = document.querySelector('[data-quickview-overlay]');
  const modalClose = document.querySelector('[data-modal-close]');

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeQuickView();
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => closeQuickView());
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
      closeCart();
      closeSearch();
    }
  });
}

function openQuickView(productId) {
  const product = productsDB.find(p => p.id === productId);
  if (!product) return;

  const modalOverlay = document.querySelector('[data-quickview-overlay]');
  const modalImg = document.querySelector('[data-qv-img]');
  const modalBrand = document.querySelector('[data-qv-brand]');
  const modalTitle = document.querySelector('[data-qv-title]');
  const modalPrice = document.querySelector('[data-qv-price]');
  const modalDel = document.querySelector('[data-qv-del]');
  const modalDesc = document.querySelector('[data-qv-desc]');
  const modalAddBtn = document.querySelector('[data-qv-add-btn]');
  const sizePillsContainer = document.querySelector('[data-qv-sizes]');

  if (modalImg) modalImg.src = product.image;
  if (modalBrand) modalBrand.textContent = product.brand;
  if (modalTitle) modalTitle.textContent = product.name;
  if (modalPrice) modalPrice.textContent = `$${product.price.toFixed(2)}`;
  if (modalDel) {
    modalDel.textContent = product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : '';
  }
  if (modalDesc) modalDesc.textContent = product.description;

  // Sizes setup
  const sizes = ['40', '41', '42', '43', '44', '45'];
  state.selectedSize = '42';

  if (sizePillsContainer) {
    sizePillsContainer.innerHTML = sizes.map(sz => `
      <button class="size-pill ${sz === state.selectedSize ? 'active' : ''}" data-size="${sz}">${sz}</button>
    `).join('');

    sizePillsContainer.querySelectorAll('.size-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        sizePillsContainer.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.selectedSize = pill.dataset.size;
      });
    });
  }

  if (modalAddBtn) {
    modalAddBtn.onclick = () => {
      addToCart(product.id, state.selectedSize);
      closeQuickView();
    };
  }

  if (modalOverlay) {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeQuickView() {
  const modalOverlay = document.querySelector('[data-quickview-overlay]');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * ====================================================================
 * 6. SEARCH MODAL OVERLAY
 * ====================================================================
 */
function setupSearch() {
  const searchOpenBtn = document.querySelector('[data-search-btn]');
  const searchOverlay = document.querySelector('[data-search-overlay]');
  const searchInput = document.querySelector('[data-search-input]');
  const searchResults = document.querySelector('[data-search-results]');
  const searchCloseBtn = document.querySelector('[data-search-close]');

  if (searchOpenBtn && searchOverlay) {
    searchOpenBtn.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (searchInput) {
        searchInput.value = '';
        renderSearchResults('');
        setTimeout(() => searchInput.focus(), 100);
      }
    });

    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearch();
    });

    if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim().toLowerCase());
    });
  }
}

function closeSearch() {
  const searchOverlay = document.querySelector('[data-search-overlay]');
  if (searchOverlay) {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function renderSearchResults(query) {
  const resultsContainer = document.querySelector('[data-search-results]');
  if (!resultsContainer) return;

  const matches = productsDB.filter(p => {
    if (!query) return true;
    return p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
  });

  if (matches.length === 0) {
    resultsContainer.innerHTML = `<p style="padding: 20px; color: var(--text-muted); text-align: center;">No matching sneakers found for "${query}"</p>`;
    return;
  }

  resultsContainer.innerHTML = matches.slice(0, 5).map(prod => `
    <div class="search-result-item" onclick="closeSearch(); openQuickView(${prod.id});">
      <img src="${prod.image}" alt="${prod.name}">
      <div>
        <h4 style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary);">${prod.name}</h4>
        <span style="font-size: 1.2rem; color: var(--accent); font-weight: 700;">$${prod.price.toFixed(2)}</span>
      </div>
      <ion-icon name="arrow-forward-outline" style="margin-left: auto; font-size: 1.8rem; color: var(--text-muted);"></ion-icon>
    </div>
  `).join('');
}

/**
 * ====================================================================
 * 7. COUNTDOWN TIMER
 * ====================================================================
 */
function setupCountdown() {
  // Target: 14 hours and 35 mins from now
  let targetTime = Date.now() + (14 * 3600 + 35 * 60 + 20) * 1000;

  function updateTimer() {
    const diff = Math.max(0, targetTime - Date.now());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const hElem = document.querySelector('[data-timer-hours]');
    const mElem = document.querySelector('[data-timer-mins]');
    const sElem = document.querySelector('[data-timer-secs]');

    if (hElem) hElem.textContent = String(hours).padStart(2, '0');
    if (mElem) mElem.textContent = String(mins).padStart(2, '0');
    if (sElem) sElem.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * ====================================================================
 * 8. NEWSLETTER & COUPONS
 * ====================================================================
 */
function setupNewsletter() {
  const form = document.querySelector('[data-newsletter-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && input.value) {
        showToast(`🎉 VIP Club Welcome! Code "FOOTCAPVIP15" sent to ${input.value}`);
        input.value = '';
      }
    });
  }

  const copyCoupon = document.querySelector('[data-copy-coupon]');
  if (copyCoupon) {
    copyCoupon.addEventListener('click', () => {
      navigator.clipboard.writeText('FOOTCAP25');
      showToast('📋 Coupon "FOOTCAP25" copied to clipboard! (20% OFF)');
    });
  }
}

/**
 * ====================================================================
 * 9. NAVIGATION & SCROLL EVENTS
 * ====================================================================
 */
function setupNavAndScroll() {
  const header = document.querySelector('[data-header]');
  const goTopBtn = document.querySelector('[data-go-top]');
  const navOpenBtn = document.querySelector('[data-nav-open-btn]');
  const navCloseBtn = document.querySelector('[data-nav-close-btn]');
  const navbar = document.querySelector('[data-navbar]');
  const overlay = document.querySelector('[data-overlay]');

  if (navOpenBtn && navbar && overlay) {
    navOpenBtn.addEventListener('click', () => {
      navbar.classList.add('active');
      overlay.classList.add('active');
    });
  }

  function closeMobileNav() {
    if (navbar) navbar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }

  if (navCloseBtn) navCloseBtn.addEventListener('click', closeMobileNav);
  if (overlay) overlay.addEventListener('click', closeMobileNav);

  // Close nav on click of link
  document.querySelectorAll('.navbar-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY >= 60) {
      if (header) header.classList.add('active');
      if (goTopBtn) goTopBtn.classList.add('active');
    } else {
      if (header) header.classList.remove('active');
      if (goTopBtn) goTopBtn.classList.remove('active');
    }
  });
}

/**
 * ====================================================================
 * 10. TOAST NOTIFICATION GENERATOR
 * ====================================================================
 */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">
      <ion-icon name="checkmark-outline"></ion-icon>
    </div>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Global exposure for inline helper calls
window.addToCart = addToCart;
window.updateCartItemQty = updateCartItemQty;
window.removeCartItem = removeCartItem;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.closeCart = closeCart;
window.closeSearch = closeSearch;