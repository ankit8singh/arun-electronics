// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
const cartCount = document.querySelector('.cart-count');

// Initialize the website
// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation FIRST
    initNavigation();
    
    // Update cart count
    updateCartCount();
    
    
    
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
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!navMenu) return;
    
    // Simple navigation for all users (no login required)
    navMenu.innerHTML = `
        <li><a href="index.html" class="${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}">Home</a></li>
        <li><a href="services.html" class="${currentPage === 'services.html' ? 'active' : ''}">Services</a></li>
        <li><a href="products.html" class="${currentPage === 'products.html' ? 'active' : ''}">Products</a></li>
        <li><a href="gallery.html" class="${currentPage === 'gallery.html' ? 'active' : ''}">Gallery</a></li>
        <li><a href="about.html" class="${currentPage === 'about.html' ? 'active' : ''}">About</a></li>
        <li><a href="contact.html" class="${currentPage === 'contact.html' ? 'active' : ''}">Contact</a></li>
        <li class="cart-icon">
            <a href="cart.html"><i class="fas fa-shopping-cart"></i></a>
            <span class="cart-count">${getCartCount()}</span>
        </li>
    `;
    
    // Mobile menu functionality
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

// Toggle mobile menu


// ==================== CART FUNCTIONS ====================

// Add product to cart
function addToCart(productId) {
    const products = getProducts();
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
            originalPrice: product.originalPrice,
            discount: product.discount,
            image: product.image,
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

// ==================== PRODUCTS DATA ====================

// Get products data with complete details
function getProducts() {
    return [
        {
            id: 1,
            name: "LED Bulb 9W",
            category: "led-bulbs",
            price: 120,
            originalPrice: 150,
            discount: 20,
            image: "images/led-bulb.jpg",
            images: [
                "images/led-bulb.jpg",
                "images/led-bulb-2.jpg", 
                "images/led-bulb-3.jpg"
            ],
            description: "Energy efficient 9W LED bulb with 2-year warranty. Perfect for home and office use with warm white light.",
            rating: 4.5,
            specifications: {
                "Wattage": "9W",
                "Lumen": "800 LM",
                "Color Temperature": "2700K (Warm White)",
                "Base Type": "B22",
                "Lifespan": "25000 Hours",
                "Warranty": "2 Years"
            },
            features: [
                "Energy saving - 80% less power consumption",
                "Instant full brightness",
                "No mercury, eco-friendly",
                "Works in voltage 100V-300V",
                "No flickering, eye protection"
            ],
            reviews: [
                {
                    user: "Rajesh Kumar",
                    rating: 5,
                    comment: "Excellent product! Very bright and energy efficient.",
                    date: "2023-10-15"
                }
            ],
            isOnSale: true
        },
        {
            id: 2,
            name: "LED Tube Light 20W",
            category: "tube-lights",
            price: 350,
            originalPrice: 420,
            discount: 17,
            image: "images/tubelight.jpg",
            images: [
                "images/tube-light.jpg",
                "images/tube-light-2.jpg"
            ],
            description: "20W LED tube light with high lumen output for commercial and residential use.",
            rating: 4.2,
            specifications: {
                "Wattage": "20W",
                "Lumen": "1800 LM", 
                "Length": "4 Feet",
                "Color Temperature": "6500K (Day Light)",
                "Lifespan": "30000 Hours",
                "Warranty": "3 Years"
            },
            features: [
                "High lumen output",
                "Energy efficient",
                "Easy installation", 
                "Durable design",
                "Flicker-free light"
            ],
            reviews: [],
            isOnSale: true
        },
        {
            id: 3,
            name: "LED Panel Light 24W",
            category: "panel-lights", 
            price: 850,
            originalPrice: 1000,
            discount: 15,
            image: "images/pannel-light.jpg",
            images: [
                "images/panel-light.jpg"
            ],
            description: "Sleek 24W LED panel light for modern office and home interiors.",
            rating: 4.7,
            specifications: {
                "Wattage": "24W",
                "Lumen": "2200 LM",
                "Size": "2x2 Feet", 
                "Color Temperature": "4000K (Cool White)",
                "Lifespan": "35000 Hours",
                "Warranty": "5 Years"
            },
            features: [
                "Slim and modern design",
                "Uniform light distribution",
                "Easy ceiling mounting",
                "Energy efficient",
                "Dimmable option available"
            ],
            reviews: [],
            isOnSale: true
        },
        {
            id: 4,
            name: "Electrical Wire 90m",
            category: "wires",
            price: 1200,
            originalPrice: 1200,
            discount: 0,
            image: "images/download (2).jpeg",
            images: [
                "images/electrical-wire.jpg"
            ],
            description: "90 meters of high-quality electrical wire for home and industrial use.",
            rating: 4.4,
            specifications: {
                "Length": "90 Meters",
                "Wire Gauge": "1.5 sq mm",
                "Voltage Rating": "1100V",
                "Insulation": "PVC",
                "Standards": "ISI Certified",
                "Color": "Red, Blue, Green, Yellow"
            },
            features: [
                "Fire resistant insulation",
                "Copper conductor",
                "ISI certified quality",
                "Long lasting durability", 
                "Safe for home wiring"
            ],
            reviews: [],
            isOnSale: false
        },
        {
            id: 5,
            name: "Modular Switch",
            category: "switches",
            price: 85,
            originalPrice: 100,
            discount: 15,
            image: "images/download (3).jpeg",
            images: [
                "images/modular-switch.jpg"
            ],
            description: "Premium quality modular switch with safety features and modern design.",
            rating: 4.6,
            specifications: {
                "Type": "Single Pole Switch",
                "Rating": "6A 250V",
                "Material": "Fire Retardant PC",
                "Color": "White",
                "Standards": "ISI Certified",
                "Warranty": "2 Years"
            },
            features: [
                "Child safety shutters",
                "Smooth operation",
                "Modern design",
                "Easy installation",
                "Durable construction"
            ],
            reviews: [],
            isOnSale: true
        },
        {
            id: 6, 
            name: "Ceiling Rose Holder",
            category: "holders",
            price: 45,
            originalPrice: 60,
            discount: 25,
            image: "images/download (4).jpeg",
            images: [
                "images/ceiling-rose.jpg"
            ],
            description: "Durable ceiling rose holder for secure bulb fitting and electrical connections.",
            rating: 4.1,
            specifications: {
                "Type": "Ceiling Rose Holder",
                "Material": "Heat Resistant Plastic", 
                "Rating": "6A 250V",
                "Color": "White",
                "Compatibility": "All B22 Bulbs",
                "Warranty": "1 Year"
            },
            features: [
                "Heat resistant material",
                "Easy to install",
                "Secure connections",
                "Universal compatibility",
                "Safety certified"
            ],
            reviews: [],
            isOnSale: true
        },
        {
            id: 7,
            name: "4-Socket Extension Board", 
            category: "extension",
            price: 350,
            originalPrice: 450,
            discount: 22,
            image: "images/download (5).jpeg",
            images: [
                "images/extension-board.jpg"
            ],
            description: "4-socket extension board with surge protection and individual switches.",
            rating: 4.3,
            specifications: {
                "Sockets": "4 Sockets",
                "Rating": "16A 250V",
                "Cable Length": "2 Meters", 
                "Protection": "Surge Protection",
                "Switches": "Individual Switches",
                "Warranty": "2 Years"
            },
            features: [
                "Surge protection",
                "Individual switches",
                "Child safety shutters",
                "Fire resistant body",
                "2 meter long cable"
            ],
            reviews: [],
            isOnSale: true
        },
        {
            id: 8,
            name: "Fairy Lights 10m",
            category: "decorative",
            price: 250,
            originalPrice: 350, 
            discount: 29,
            image: "images/download (6).jpeg",
            images: [
                "images/fairy-lights.jpg"
            ],
            description: "10 meters of decorative fairy lights for festivals, weddings and home decoration.",
            rating: 4.8,
            specifications: {
                "Length": "10 Meters",
                "Bulbs": "100 LED Bulbs",
                "Color": "Warm White",
                "Power": "Low Voltage DC",
                "Modes": "8 Lighting Modes",
                "Warranty": "1 Year"
            },
            features: [
                "8 different lighting modes",
                "Waterproof for outdoor use",
                "Energy efficient LEDs",
                "Remote control included",
                "Timer function available"
            ],
            reviews: [],
            isOnSale: true
        }
    ];
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

// Render products
function renderProducts(category) {
    const productsGrid = document.getElementById('all-products');
    const products = getProducts();
    
    let filteredProducts = products;
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    let html = '';
    filteredProducts.forEach(product => {
        const discountBadge = product.isOnSale && product.discount > 0 ? 
            `<div class="discount-badge">${product.discount}% OFF</div>` : '';
        
        const priceHTML = product.isOnSale && product.discount > 0 ?
            `<div class="product-price">
                <span class="current-price">₹${product.price}</span>
                <span class="original-price">₹${product.originalPrice}</span>
            </div>` :
            `<div class="product-price">₹${product.price}</div>`;
        
        html += `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    ${discountBadge}
                    <img src="${product.image}" alt="${product.name}">
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
                    <p>${product.description}</p>
                    
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
    
    if (productsGrid) {
        productsGrid.innerHTML = html;
        
        // Add event listeners to add-to-cart buttons
        productsGrid.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                addToCart(productId);
            });
        });
    }
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

// Generate star rating
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// ==================== FEATURED PRODUCTS FUNCTIONS ====================

// Get Random Featured Products
function getFeaturedProducts() {
    const allProducts = getProducts();
    
    if (allProducts.length <= 4) {
        return allProducts;
    }
    
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
}

// Render Featured Products on Homepage
function renderFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-products');
    if (!featuredGrid) return;
    
    const featuredProducts = getFeaturedProducts();
    
    let html = '';
    featuredProducts.forEach(product => {
        const discountBadge = product.isOnSale && product.discount > 0 ? 
            `<div class="discount-badge">${product.discount}% OFF</div>` : '';
        
        const priceHTML = product.isOnSale && product.discount > 0 ?
            `<div class="product-price">
                <span class="current-price">₹${product.price}</span>
                <span class="original-price">₹${product.originalPrice}</span>
            </div>` :
            `<div class="product-price">₹${product.price}</div>`;
        
        html += `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    ${discountBadge}
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    ${priceHTML}
                    <div class="product-rating">
                        ${generateStarRating(product.rating)}
                    </div>
                    <p>${product.description}</p>
                    
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
    // Check if cart is empty
    if (cart.length === 0) {
        showNotification('Your cart is empty! Please add items first.', 'error');
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 2000);
        return;
    }
    
    updateCheckoutSummary();
    
    // Payment option event listeners
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            const group = this.closest('.payment-options');
            group.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Place order button
    const placeOrderBtn = document.getElementById('place-order');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }
}

// Update checkout summary
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

// Place order
function placeOrder() {
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
    
    // Create order summary
    const orderDetails = {
        customer: { name, phone, address, pincode },
        items: cart,
        total: document.getElementById('checkout-total')?.textContent || '₹0',
        date: new Date().toLocaleString(),
        orderId: 'ARN-' + Date.now()
    };
    
    // Send order via WhatsApp
    const whatsappMessage = createWhatsAppMessage(orderDetails);
    const whatsappUrl = `https://wa.me/919084984045?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    
    showNotification('Order placed successfully! Redirecting to WhatsApp...', 'success');
    
    // Redirect to WhatsApp
    setTimeout(() => {
        window.location.href = whatsappUrl;
    }, 1500);
}

// Create WhatsApp message
function createWhatsAppMessage(order) {
    let message = `New Order - ${order.orderId}\n\n`;
    message += `Customer: ${order.customer.name}\n`;
    message += `Phone: ${order.customer.phone}\n`;
    message += `Address: ${order.customer.address}, ${order.customer.pincode}\n\n`;
    message += `Order Details:\n`;
    
    order.items.forEach(item => {
        message += `- ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}\n`;
    });
    
    message += `\nTotal: ${order.total}\n`;
    message += `Order Date: ${order.date}`;
    
    return message;
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

// UPI Copy function
function copyUPI() {
    const upiId = 'arn.electric@okhdfcbank';
    navigator.clipboard.writeText(upiId).then(function() {
        showNotification('UPI ID copied to clipboard: ' + upiId, 'success');
    });
}

// Continue shopping after order
function continueShopping() {
    const orderSuccess = document.getElementById('order-success');
    if (orderSuccess) {
        orderSuccess.style.display = 'none';
    }
    window.location.href = 'products.html';
}

// Initialize UPI payment section
function initUPIPayment() {
    const paymentOptions = document.querySelectorAll('.payment-option[data-payment]');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const paymentMethod = this.dataset.payment;
            const upiDetails = document.getElementById('upi-details');
            
            if (paymentMethod === 'upi' && upiDetails) {
                upiDetails.style.display = 'block';
            } else if (upiDetails) {
                upiDetails.style.display = 'none';
            }
        });
    });
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


// ✅ NEW FUNCTION: Get Random Featured Products
function getFeaturedProducts() {
    const allProducts = getProducts();
    
    // Agar 4 se kam products hain, toh sabhi return kar do
    if (allProducts.length <= 4) {
        return allProducts;
    }
    
    // Randomly 4 products select karo
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
}

// ✅ NEW FUNCTION: Render Featured Products on Homepage
function renderFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-products');
    if (!featuredGrid) return;
    
    const featuredProducts = getFeaturedProducts();
    
    let html = '';
    featuredProducts.forEach(product => {
        html += `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-overlay">
                        <button class="btn btn-quick-view" onclick="viewProductDetails(${product.id})">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">₹${product.price}</div>
                    <div class="product-rating">
                        ${generateStarRating(product.rating)}
                    </div>
                    <p>${product.description}</p>
                    
                    <div class="product-actions">
                        <button class="btn btn-outline view-details" onclick="viewProductDetails(${product.id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn add-to-cart" data-id="${product.id}">
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
    
    featuredGrid.innerHTML = html;
    
    // Add event listeners to add-to-cart buttons
    featuredGrid.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
}

// ✅ ALTERNATIVE FUNCTION: Get Latest Products (Newest First)
function getLatestProducts() {
    const allProducts = getProducts();
    
    // Products ko ID ke basis par sort karo (highest ID first = latest)
    const sortedProducts = [...allProducts].sort((a, b) => b.id - a.id);
    
    // First 4 products return karo
    return sortedProducts.slice(0, 4);
}
