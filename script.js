// // script.js - ADD AT VERY TOP
// console.log('🎯 script.js LOADED!');

// // Safety check for supabaseProducts
// if (typeof supabaseProducts === 'undefined') {
//     console.warn('⚠️ supabaseProducts not defined - will use local products');
    
//     // Create a temporary fallback
//     window.supabaseProducts = {
//         getAllProducts: function(category = 'all') {
//             console.log('🔄 Using local fallback products');
//             return Promise.resolve(getLocalProducts());
//         },
//         getProductById: function(productId) {
//             console.log('🔄 Using local fallback for product details');
//             const localProducts = getLocalProducts();
//             return Promise.resolve(localProducts.find(p => p.id === productId) || null);
//         },
//         getCategories: function() {
//             console.log('🔄 Using local fallback categories');
//             return Promise.resolve(['led-bulbs', 'tube-lights', 'wires', 'switches']);
//         },
//         client: null
//     };
// } else {
//     console.log('✅ supabaseProducts is available');
// }

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
const cartCount = document.querySelector('.cart-count');

// ==================== SUPABASE INTEGRATION ====================

// ✅ Local fallback products function
function getLocalProducts() {
    console.log('📦 Using local fallback products');
    return [
        {
            id: 1,
            name: "LED Bulb 9W",
            price: 120,
            original_price: 150,
            discount: 20,
            category: "led-bulbs",
            image_url: "images/led-bulb.jpg",
            description: "Energy efficient 9W LED bulb with 2-year warranty",
            features: ["Energy saving", "Long lifespan", "Eco-friendly"],
            specifications: {"Wattage": "9W", "Lumen": "800 LM", "Warranty": "2 Years"},
            rating: 4.5,
            is_active: true
        },
        {
            id: 2,
            name: "LED Tube Light 20W",
            price: 350,
            original_price: 420,
            discount: 17,
            category: "tube-lights", 
            image_url: "images/tubelight.jpg",
            description: "20W LED tube light for commercial use",
            features: ["High lumen output", "Energy efficient", "Easy installation"],
            specifications: {"Wattage": "20W", "Length": "4 Feet", "Warranty": "3 Years"},
            rating: 4.2,
            is_active: true
        },
        {
            id: 3,
            name: "Electrical Wire 90m",
            price: 1200,
            original_price: 1400,
            discount: 14,
            category: "wires",
            image_url: "images/wire.jpg",
            description: "90 meters high-quality electrical wire",
            features: ["Fire resistant", "ISI certified", "Copper conductor"],
            specifications: {"Length": "90m", "Standard": "ISI Certified", "Color": "Red/Blue/Green"},
            rating: 4.4,
            is_active: true
        },
        {
            id: 4,
            name: "Modular Switch",
            price: 85,
            original_price: 100,
            discount: 15,
            category: "switches",
            image_url: "images/switch.jpg",
            description: "Premium quality modular switch",
            features: ["Child safety", "Modern design", "Easy installation"],
            specifications: {"Type": "Single Pole", "Rating": "6A 250V", "Warranty": "2 Years"},
            rating: 4.6,
            is_active: true
        }
    ];
}

// ✅ UPDATED: Get products from Supabase with fallback
// ✅ UPDATED: Get products with better error handling
async function getProducts(category = 'all') {
    console.log(`🛍️ Getting products for category: ${category}`);
    console.log(`🔍 supabaseProducts available: ${typeof supabaseProducts !== 'undefined'}`);
    
    // Check if supabaseProducts is available and working
    if (typeof supabaseProducts !== 'undefined' && supabaseProducts && supabaseProducts.client) {
        try {
            console.log('🚀 Trying to fetch from Supabase...');
            const products = await supabaseProducts.getAllProducts(category);
            console.log(`✅ Retrieved ${products.length} products from Supabase`);
            return products;
        } catch (error) {
            console.log('❌ Supabase fetch failed, using local products');
            return getLocalProducts();
        }
    } else {
        console.log('🔄 Supabase not available, using local products');
        return getLocalProducts();
    }
}

// ✅ Categories load karo
async function loadCategories() {
    try {
        if (typeof supabaseProducts !== 'undefined') {
            const categories = await supabaseProducts.getCategories();
            updateCategoryFilters(categories);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// ✅ Generate star rating function
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars  
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars + ` <span class="rating-text">(${rating})</span>`;
}

// ==================== INITIALIZATION ====================

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation FIRST
    initNavigation();
    
    // Update cart count
    updateCartCount();
    
        if (typeof auth !== 'undefined') {
        auth.updateUI();
    }

    // ✅ ADDED: Load categories from Supabase
    loadCategories();
    
    // ✅ ADDED: Render featured products on homepage
    renderFeaturedProducts();
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
    
    // Buy Now buttons event listener
    document.addEventListener('click', function(e) {
        if (e.target.closest('.buy-now')) {
            e.preventDefault();
            const productId = parseInt(e.target.closest('.buy-now').dataset.id);
            buyNow(productId);
        }
    });
    
    // Initialize page-specific functionality
    if (window.location.pathname.includes('products.html')) {
        initProductsPage();
    }
    
    if (window.location.pathname.includes('cart.html')) {
        initCartPage();
    }
    
    if (window.location.pathname.includes('checkout.html')) {
        initCheckoutPage();
    }
    
    if (window.location.pathname.includes('gallery.html')) {
        initGalleryPage();
    }
    
    if (window.location.pathname.includes('contact.html')) {
        initContactPage();
    }
});

// ==================== NAVIGATION FUNCTIONS ====================

function initNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (!navMenu) return;
    
    let navHTML = '';
    
    // Common navigation links
    navHTML += `
        <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Home</a></li>
        <li><a href="services.html" class="${currentPage === 'services.html' ? 'active' : ''}">Services</a></li>
        <li><a href="products.html" class="${currentPage === 'products.html' ? 'active' : ''}">Products</a></li>
        <li><a href="gallery.html" class="${currentPage === 'gallery.html' ? 'active' : ''}">Gallery</a></li>
        <li><a href="about.html" class="${currentPage === 'about.html' ? 'active' : ''}">About</a></li>
        <li><a href="contact.html" class="${currentPage === 'contact.html' ? 'active' : ''}">Contact</a></li>
    `;
    
    // Authentication-based links
    if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
        // User logged in - show user menu and orders
        navHTML += `
            <li><a href="order-history.html" class="${currentPage === 'order-history.html' ? 'active' : ''}">My Orders</a></li>
            <li class="user-menu">
                <a href="javascript:void(0)" class="user-dropdown">
                    <i class="fas fa-user"></i> ${auth.currentUser.name}
                    <i class="fas fa-chevron-down"></i>
                </a>
                <div class="dropdown-menu">
                    <a href="order-history.html"><i class="fas fa-history"></i> My Orders</a>
                    <a href="profile.html"><i class="fas fa-user-edit"></i> Profile</a>
                    <div class="dropdown-divider"></div>
                    <a href="javascript:void(0)" onclick="auth.logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </li>
        `;
    } else {
        // User not logged in - show login
        navHTML += `<li><a href="login.html" class="${currentPage === 'login.html' ? 'active' : ''}">Login</a></li>`;
    }
    
    // Cart icon (always visible)
    navHTML += `
        <li class="cart-icon">
            <a href="cart.html"><i class="fas fa-shopping-cart"></i></a>
            <span class="cart-count">${getCartCount()}</span>
        </li>
    `;
    
    navMenu.innerHTML = navHTML;
    initMobileMenu();
}

// Mobile menu functionality - FIXED VERSION
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        console.log('📱 Mobile menu elements found, adding event listeners...');
        
        // Remove any existing event listeners
        const newToggle = mobileToggle.cloneNode(true);
        mobileToggle.parentNode.replaceChild(newToggle, mobileToggle);
        
        // Get the new toggle element
        const newMobileToggle = document.querySelector('.mobile-toggle');
        
        // Add click event listener
        newMobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('📱 Mobile toggle clicked');
            
            // Toggle active class on nav menu
            navMenu.classList.toggle('active');
            newMobileToggle.classList.toggle('active');
            
            console.log('📱 Nav menu active:', navMenu.classList.contains('active'));
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !newMobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                newMobileToggle.classList.remove('active');
            }
        });
        
        // Close mobile menu when clicking on nav links
        navMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navMenu.classList.remove('active');
                newMobileToggle.classList.remove('active');
            }
        });
        
    } else {
        console.log('❌ Mobile menu elements not found:', {
            mobileToggle: !!mobileToggle,
            navMenu: !!navMenu
        });
    }
}

// ==================== CART FUNCTIONS ====================

// Add product to cart - FIXED VERSION
function addToCart(productId, event = null) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // ✅ CHECK AUTHENTICATION
    if (typeof auth !== 'undefined' && !auth.isLoggedIn()) {
        auth.requireLogin('add items to cart', 'products.html');
        return false;
    }
    
    const products = getLocalProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) return false;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.original_price,
            discount: product.discount,
            image: product.image_url,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`, 'success');
    
    return true;
}

// Buy Now function
function buyNow(productId) {
    // ✅ CHECK AUTHENTICATION
    if (typeof auth !== 'undefined' && !auth.isLoggedIn()) {
        auth.requireLogin('buy products', 'products.html');
        return false;
    }
    
    // Add product to cart and redirect to cart page
    addToCart(productId);
    
    // Show success message
    showNotification('Product added to cart! Redirecting to cart...', 'success');
    
    // Redirect to cart page
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1500);
    
    return true;
}

// View Product Details
function viewProductDetails(productId) {
    console.log(`🔍 Redirecting to product details page for ID: ${productId}`);
    
    // Direct product details page par redirect karo
    window.location.href = `product-details.html?id=${productId}`;
}

// Update cart count
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    if (cartCountElements.length > 0) {
        const totalItems = getCartCount();
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }
}

function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// ==================== PRODUCTS PAGE FUNCTIONS ====================

// Products Page
function initProductsPage() {
    const productsGrid = document.getElementById('all-products');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Render all products
    renderProducts('all');
    
    // Category filter event listeners
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter products
            renderProducts(this.dataset.category);
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterProducts(this.value);
        });
    }
    
    // Sort functionality
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

// ✅ UPDATED: Render products function with Supabase support
async function renderProducts(category = 'all') {
    const productsGrid = document.getElementById('all-products');
    if (!productsGrid) return;

    console.log(`🎨 Rendering products for: ${category}`);

    // Loading show karo
    productsGrid.innerHTML = '<div class="loading">🔄 Loading products...</div>';

    try {
        const products = await getProducts(category);
        
        if (products.length === 0) {
            productsGrid.innerHTML = '<div class="no-products">No products found</div>';
            return;
        }
        
        let html = '';
        products.forEach(product => {
            const discountBadge = product.discount > 0 ? 
                `<div class="discount-badge">${product.discount}% OFF</div>` : '';
            
            const priceHTML = product.discount > 0 ?
                `<div class="product-price">
                    <span class="current-price">₹${product.price}</span>
                    <span class="original-price">₹${product.original_price || product.originalPrice}</span>
                </div>` :
                `<div class="product-price">₹${product.price}</div>`;

            html += `
                <div class="product-card" data-category="${product.category}">
                    <div class="product-image">
                        ${discountBadge}
                        <img src="${product.image_url || product.image}" alt="${product.name}" 
                             onerror="this.src='images/placeholder.jpg'">
                        <div class="product-overlay">
                            <button class="btn btn-quick-view" onclick="viewProductDetails(${product.id})">
                                <i class="fas fa-eye"></i> Quick View
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        ${priceHTML}
                        <div class="product-rating">
                            ${generateStarRating(product.rating || 4.0)}
                        </div>
                        <p>${product.description?.substring(0, 80) || product.description}...</p>
                        
                        <div class="product-actions">
                            <button class="btn btn-outline view-details" onclick="viewProductDetails(${product.id})">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            <button class="btn add-to-cart" onclick="addToCart(${product.id}, event)">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                            <button class="btn btn-primary buy-now" onclick="buyNow(${product.id})">
                                <i class="fas fa-bolt"></i> Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        productsGrid.innerHTML = html;
        console.log(`✅ Rendered ${products.length} products`);

    } catch (error) {
        console.error('❌ Error rendering products:', error);
        productsGrid.innerHTML = '<div class="error">⚠️ Error loading products. Please refresh the page.</div>';
    }
}

// ✅ UPDATED: Product details function with Supabase support
function viewProductDetails(productId) {
    console.log(`🔍 Redirecting to product details page for ID: ${productId}`);
    
    // Direct product details page par redirect karo
    window.location.href = `product-details.html?id=${productId}`;
}

// Product details modal function
function showProductModal(product) {
    console.log('🔍 Showing product modal for:', product.name);
    
    // Simple alert for now - aap bad me modal implement kar sakte hain
    alert(`Product: ${product.name}\nPrice: ₹${product.price}\nDescription: ${product.description}`);
}

// Filter products by search
function filterProducts(searchTerm) {
    const products = document.querySelectorAll('#all-products .product-card');
    
    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchTerm.toLowerCase())) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Sort products
function sortProducts(sortBy) {
    const productsGrid = document.getElementById('all-products');
    const products = Array.from(productsGrid.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        const priceA = parseInt(a.querySelector('.product-price .current-price')?.textContent.replace('₹', '') || 
                              a.querySelector('.product-price').textContent.replace('₹', ''));
        const priceB = parseInt(b.querySelector('.product-price .current-price')?.textContent.replace('₹', '') || 
                              b.querySelector('.product-price').textContent.replace('₹', ''));
        
        switch(sortBy) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'popular':
                const ratingA = parseFloat(a.querySelector('.product-rating').dataset.rating || 0);
                const ratingB = parseFloat(b.querySelector('.product-rating').dataset.rating || 0);
                return ratingB - ratingA;
            default:
                return 0;
        }
    });
    
    // Clear and re-append sorted products
    productsGrid.innerHTML = '';
    products.forEach(product => productsGrid.appendChild(product));
}

// Update category filters
function updateCategoryFilters(categories) {
    console.log('🏷️ Updating category filters:', categories);
    
    const filtersContainer = document.getElementById('category-filters');
    if (!filtersContainer) return;
    
    let html = '<button class="filter-btn active" data-category="all">All Products</button>';
    
    categories.forEach(category => {
        const categoryName = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        html += `<button class="filter-btn" data-category="${category}">${categoryName}</button>`;
    });
    
    filtersContainer.innerHTML = html;
    
    // Filter buttons par event listeners add karo
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderProducts(category);
        });
    });
}

// ==================== FEATURED PRODUCTS FUNCTIONS ====================

// Get Latest Products (Newest First - Highest ID first)
function getLatestProducts() {
    const allProducts = getLocalProducts(); // Temporary - Supabase integration ke baad change karenge
    
    // Products ko ID ke basis par sort karo (highest ID first = latest)
    const sortedProducts = [...allProducts].sort((a, b) => b.id - a.id);
    
    // First 4 products return karo
    return sortedProducts.slice(0, 4);
}

// Render Featured Products on Homepage (LATEST PRODUCTS)
function renderFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-products');
    if (!featuredGrid) return;
    
    // Ab latest products use karo random ki jagah
    const featuredProducts = getLatestProducts();
    
    let html = '';
    featuredProducts.forEach(product => {
        const discountBadge = product.discount > 0 ? 
            `<div class="discount-badge">${product.discount}% OFF</div>` : '';
        
        const priceHTML = product.discount > 0 ?
            `<div class="product-price">
                <span class="current-price">₹${product.price}</span>
                <span class="original-price">₹${product.original_price}</span>
            </div>` :
            `<div class="product-price">₹${product.price}</div>`;
        
        html += `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    ${discountBadge}
                    <img src="${product.image_url}" alt="${product.name}">
                    <div class="product-overlay">
                        <button class="btn btn-quick-view" onclick="viewProductDetails(${product.id})">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    ${priceHTML}
                    <div class="product-rating">
                        ${generateStarRating(product.rating)}
                    </div>
                    <p>${product.description.substring(0, 80)}...</p>
                    
                    <div class="product-actions">
                        <button class="btn btn-outline view-details" onclick="viewProductDetails(${product.id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-primary buy-now" data-id="${product.id}">
                            <i class="fas fa-bolt"></i> Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    featuredGrid.innerHTML = html;
    
    // Add event listeners to add-to-cart buttons
    featuredGrid.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
}

// ==================== CART PAGE FUNCTIONS ====================

let cartEventInitialized = false;

function initCartPage() {
    renderCartItems();
    
    // Only add event listeners once
    if (!cartEventInitialized) {
        document.addEventListener('click', handleCartClick);
        cartEventInitialized = true;
    }
}

function handleCartClick(e) {
    // Plus button
    if (e.target.closest('.quantity-btn.plus') || e.target.classList.contains('fa-plus')) {
        const btn = e.target.closest('.quantity-btn.plus') || e.target.closest('.quantity-btn');
        if (btn && btn.dataset.id) {
            const productId = parseInt(btn.dataset.id);
            increaseQuantity(productId);
        }
    }
    
    // Minus button
    else if (e.target.closest('.quantity-btn.minus') || e.target.classList.contains('fa-minus')) {
        const btn = e.target.closest('.quantity-btn.minus') || e.target.closest('.quantity-btn');
        if (btn && btn.dataset.id) {
            const productId = parseInt(btn.dataset.id);
            decreaseQuantity(productId);
        }
    }
    
    // Remove button
    else if (e.target.closest('.remove-btn') || e.target.classList.contains('fa-trash')) {
        const btn = e.target.closest('.remove-btn');
        if (btn && btn.dataset.id) {
            const productId = parseInt(btn.dataset.id);
            removeFromCart(productId);
        }
    }
}

// Render cart items
function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const deliveryCharges = document.getElementById('delivery-charges');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (cart.length === 0) {
        if (cartItems) cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to continue shopping</p>
                <a href="products.html" class="btn" style="margin-top: 20px;">Continue Shopping</a>
            </div>
        `;
        if (cartSubtotal) cartSubtotal.textContent = '₹0';
        if (deliveryCharges) deliveryCharges.textContent = '₹0';
        if (cartTotal) cartTotal.textContent = '₹0';
        
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.style.backgroundColor = '#ccc';
            checkoutBtn.style.cursor = 'not-allowed';
            checkoutBtn.textContent = 'Cart is Empty';
        }
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const priceHTML = item.discount > 0 ?
            `<div class="product-price">
                <span class="current-price">₹${item.price}</span>
                <span class="original-price">₹${item.originalPrice}</span>
                <span class="item-discount">${item.discount}% OFF</span>
            </div>` :
            `<div class="product-price">₹${item.price}</div>`;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                    ${item.discount > 0 ? `<div class="cart-discount-badge">${item.discount}% OFF</div>` : ''}
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    ${priceHTML}
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}" type="button">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-number">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}" type="button">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-btn" data-id="${item.id}" type="button">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="item-total">
                    ₹${itemTotal}
                </div>
            </div>
        `;
    });
    
    if (cartItems) cartItems.innerHTML = html;
    
    // Calculate delivery charges
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal + delivery;
    
    if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal}`;
    if (deliveryCharges) deliveryCharges.textContent = `₹${delivery}`;
    if (cartTotal) cartTotal.textContent = `₹${total}`;
    
    // Update checkout button
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.style.backgroundColor = '';
        checkoutBtn.style.cursor = 'pointer';
        checkoutBtn.textContent = 'Proceed to Checkout';
    }
}

// Increase item quantity
function increaseQuantity(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += 1;
        saveCart();
        renderCartItems();
        updateCartCount();
    }
}

// Decrease item quantity
function decreaseQuantity(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
            saveCart();
            renderCartItems();
            updateCartCount();
        } else {
            removeFromCart(productId);
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    const initialLength = cart.length;
    cart = cart.filter(item => item.id !== productId);
    
    if (cart.length < initialLength) {
        saveCart();
        renderCartItems();
        updateCartCount();
        showNotification('Product removed from cart', 'success');
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ==================== CHECKOUT PAGE FUNCTIONS ====================

function initCheckoutPage() {
    console.log('🛒 Initializing checkout page...');

     if (typeof auth !== 'undefined' && !auth.isLoggedIn()) {
        auth.requireLogin('checkout', 'cart.html');
        return;
    }
    
    // Check if cart is empty
    if (cart.length === 0) {
        showNotification('Your cart is empty! Please add items first.', 'error');
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 2000);
        return;
    }
    
    updateCheckoutSummary();
    renderCheckoutItems();
    
    // Payment option event listeners
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            const group = this.closest('.payment-options');
            group.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            // Show UPI details if UPI payment selected
            const paymentMethod = this.dataset.payment;
            const upiDetails = document.getElementById('upi-details');
            
            if (paymentMethod === 'upi' && upiDetails) {
                upiDetails.style.display = 'block';
            } else if (upiDetails) {
                upiDetails.style.display = 'none';
            }
        });
    });
    
    // Delivery option event listeners
    document.querySelectorAll('.payment-option[data-method]').forEach(option => {
        option.addEventListener('click', function() {
            const group = this.closest('.payment-options');
            group.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Place order button event listener
    const placeOrderBtn = document.getElementById('place-order');
    if (placeOrderBtn) {
        console.log('✅ Place order button found');
        placeOrderBtn.addEventListener('click', placeOrder);
    } else {
        console.log('❌ Place order button not found');
    }
}

// Render checkout items function
function renderCheckoutItems() {
    const orderItems = document.querySelector('.order-items');
    if (!orderItems) return;
    
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="order-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-price">₹${item.price} x ${item.quantity}</div>
                </div>
                <div class="item-total">₹${item.price * item.quantity}</div>
            </div>
        `;
    });
    
    orderItems.innerHTML = html;
}

// Update checkout summary function
function updateCheckoutSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal + delivery;
    
    const subtotalEl = document.getElementById('checkout-subtotal');
    const deliveryEl = document.getElementById('checkout-delivery');
    const totalEl = document.getElementById('checkout-total');
    
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (deliveryEl) deliveryEl.textContent = `₹${delivery}`;
    if (totalEl) totalEl.textContent = `₹${total}`;
}

// Place order function
// ✅ UPDATED: Place order function - Save to both admin and user
function placeOrder() {
    console.log('🛒 Place order clicked');
    
    // Validate form
    const name = document.getElementById('name')?.value;
    const phone = document.getElementById('phone')?.value;
    const address = document.getElementById('address')?.value;
    const pincode = document.getElementById('pincode')?.value;
    
    if (!name || !phone || !address || !pincode) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Get selected options
    const deliveryMethod = document.querySelector('.payment-option[data-method].active')?.dataset.method || 'home';
    const paymentMethod = document.querySelector('.payment-option[data-payment].active')?.dataset.payment || 'cod';
    
    // Calculate amounts
    const subtotal = getCartSubtotal();
    const deliveryCharge = deliveryMethod === 'home' ? (subtotal > 500 ? 0 : 50) : 0;
    const total = subtotal + deliveryCharge;
    
    // Create order
    const orderDetails = {
        orderId: 'ARN-' + Date.now(),
        customer: { 
            name, 
            phone, 
            email: document.getElementById('email')?.value || '',
            address, 
            pincode 
        },
        delivery: {
            method: deliveryMethod === 'home' ? 'Home Delivery' : 'Pick-up from Shop',
            charges: deliveryCharge
        },
        payment: {
            method: paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment',
            status: paymentMethod === 'cod' ? 'pending' : 'pending',
            paidAt: null
        },
        status: 'pending',
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
        })),
        summary: {
            subtotal: subtotal,
            delivery: deliveryCharge,
            total: total
        },
        date: new Date().toLocaleString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    console.log('📦 Order Created:', orderDetails);
    
    // ✅ SAVE TO BOTH ADMIN AND USER
    saveOrderToAdmin(orderDetails);
    saveOrderToUser(orderDetails);
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Redirect to success page
    window.location.href = `order-success.html?orderId=${orderDetails.orderId}`;
    
    // Send WhatsApp message
    const whatsappMessage = createWhatsAppMessage(orderDetails);
    const whatsappUrl = `https://wa.me/919084984045?text=${encodeURIComponent(whatsappMessage)}`;
    
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1000);
}

// ✅ NEW: Save order to admin (existing)
function saveOrderToAdmin(order) {
    const orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
    orders.push(order);
    localStorage.setItem('adminOrders', JSON.stringify(orders));
    console.log('✅ Order saved to admin');
}

// ✅ NEW: Save order to user's personal order history
function saveOrderToUser(order) {
    if (typeof auth === 'undefined' || !auth.isLoggedIn()) {
        console.log('❌ User not logged in, cannot save to user orders');
        return;
    }
    
    const userId = auth.currentUser.id;
    const userOrders = JSON.parse(localStorage.getItem('userOrders')) || {};
    
    // Initialize user's order array if not exists
    if (!userOrders[userId]) {
        userOrders[userId] = [];
    }
    
    // Add order to user's order history
    userOrders[userId].push(order);
    localStorage.setItem('userOrders', JSON.stringify(userOrders));
    
    console.log('✅ Order saved to user history for user:', userId);
    console.log('User orders:', userOrders[userId]);
}

// Get cart subtotal
function getCartSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart total
function getCartTotal() {
    const subtotal = getCartSubtotal();
    const delivery = subtotal > 500 ? 0 : 50;
    return subtotal + delivery;
}

// Create WhatsApp message function
function createWhatsAppMessage(order) {
    let message = `🛍️ *NEW ORDER - ${order.orderId}*\n\n`;
    
    // Customer Details
    message += `👤 *CUSTOMER DETAILS:*\n`;
    message += `• Name: ${order.customer.name}\n`;
    message += `• Phone: ${order.customer.phone}\n`;
    if (order.customer.email) {
        message += `• Email: ${order.customer.email}\n`;
    }
    message += `• Address: ${order.customer.address}, ${order.customer.pincode}\n\n`;
    
    // Delivery & Payment
    message += `🚚 *DELIVERY:* ${order.delivery.method}\n`;
    message += `💳 *PAYMENT:* ${order.payment.method}\n`;
    message += `📊 *PAYMENT STATUS:* ${order.payment.status}\n\n`;
    
    // UPI Instructions if applicable
    if (order.payment.method === 'UPI Payment') {
        message += `📱 *UPI INSTRUCTIONS:*\n`;
        message += `• UPI ID: arn.electric@okhdfcbank\n`;
        message += `• Amount: ₹${order.summary.total}\n`;
        message += `• Please share payment screenshot\n\n`;
    }
    
    // Order Items
    message += `📦 *ORDER ITEMS:*\n`;
    order.items.forEach(item => {
        message += `• ${item.name} (Qty: ${item.quantity}) - ₹${item.total}\n`;
    });
    
    // Order Summary
    message += `\n💰 *ORDER SUMMARY:*\n`;
    message += `• Subtotal: ₹${order.summary.subtotal}\n`;
    message += `• Delivery: ₹${order.summary.delivery}\n`;
    message += `• *Total: ₹${order.summary.total}*\n\n`;
    
    // Additional Info
    message += `📅 Order Date: ${order.date}\n`;
    message += `🆔 Order ID: ${order.orderId}\n`;
    
    return message;
}

// Save order function
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
    orders.push(order);
    localStorage.setItem('adminOrders', JSON.stringify(orders));
}

// Show order success modal
function showOrderSuccessModal(orderId) {
    const modal = document.getElementById('order-success');
    const orderIdElement = document.getElementById('order-id');
    
    if (modal && orderIdElement) {
        orderIdElement.textContent = orderId;
        modal.style.display = 'flex';
    }
}

// Continue shopping function
function continueShopping() {
    const modal = document.getElementById('order-success');
    if (modal) {
        modal.style.display = 'none';
    }
    window.location.href = 'products.html';
}

// UPI Copy function
function copyUPI() {
    const upiId = 'arn.electric@okhdfcbank';
    navigator.clipboard.writeText(upiId).then(function() {
        showNotification('UPI ID copied to clipboard: ' + upiId, 'success');
    }).catch(function() {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = upiId;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showNotification('UPI ID copied to clipboard: ' + upiId, 'success');
    });
}

// ==================== OTHER PAGES FUNCTIONS ====================

// Gallery Page
function initGalleryPage() {
    const galleryItems = [
        { src: "images/gal1.jpg", title: "Complete House Wiring" },
        { src: "images/gal2.jpeg", title: "Modern Light Fitting" },
        { src: "images/gal12.jpeg", title: "Decorative Lighting Setup" },
        { src: "images/gal11.jpeg", title: "Switchboard Installation" },
        { src: "images/gal3.jpeg", title: "LED Lighting Solution" },
        { src: "images/gal4.jpeg", title: "Electrical Repair Work" },
        { src: "images/gal6.jpg", title: "Festival Lighting" },
        { src: "images/gal7.jpg", title: "Office Wiring Project" },
        { src: "images/gal8.jpeg", title: "Chandelier Installation" },
        { src: "images/gal9.jpeg", title: "MCB Repair" },
        { src: "images/gal4.jpeg", title: "LED Strip Installation" },
        { src: "images/gal5.jpeg", title: "Industrial Wiring" }
    ];
    
    const galleryGrid = document.querySelector('.full-gallery-grid');
    if (galleryGrid) {
        let html = '';
        galleryItems.forEach(item => {
            html += `
                <div class="gallery-item">
                    <img src="${item.src}" alt="${item.title}">
                    <div class="gallery-overlay">
                        <h3>${item.title}</h3>
                    </div>
                </div>
            `;
        });
        galleryGrid.innerHTML = html;
    }
}

// Contact form submission
function initContactPage() {
    const contactForm = document.getElementById('service-booking-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            const message = createServiceBookingMessage(data);
            const whatsappUrl = `https://wa.me/919084984045?text=${encodeURIComponent(message)}`;
            
            window.location.href = whatsappUrl;
        });
    }
}

// Create service booking message for WhatsApp
function createServiceBookingMessage(data) {
    let message = `New Service Booking Request\n\n`;
    message += `Name: ${data.name}\n`;
    message += `Phone: ${data.phone}\n`;
    if (data.email) message += `Email: ${data.email}\n`;
    message += `Address: ${data.address}\n`;
    message += `Service: ${data.service}\n`;
    if (data.date) message += `Preferred Date: ${data.date}\n`;
    if (data.time) message += `Preferred Time: ${data.time}\n`;
    if (data.message) message += `Details: ${data.message}\n`;
    
    return message;
}

// ==================== UTILITY FUNCTIONS ====================

// Show notification
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

console.log('✅ script.js loaded successfully with Supabase integration');

// Smart image handling function
function getProductImageUrl(product) {
    const imageUrl = product.image_url || product.image;
    
    // Agar Supabase storage URL hai
    if (imageUrl.includes('supabase.co/storage')) {
        return imageUrl;
    }
    // Agar local image hai
    else if (imageUrl.startsWith('images/')) {
        return imageUrl;
    }
    // Agar external URL hai
    else if (imageUrl.startsWith('http')) {
        return imageUrl;
    }
    // Agar invalid hai, placeholder use karo
    else {
        return 'images/placeholder.jpg';
    }
}

// Usage in product rendering:
