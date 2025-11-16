// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
const cartCount = document.querySelector('.cart-count');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count
    updateCartCount();
    
    // Event listeners
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
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
});

// Toggle mobile menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
}

// Add product to cart
function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    
    // Show notification
    alert(`${product.name} added to cart!`);
}

// Update cart count
function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Get products data
function getProducts() {
    return [
        {
            id: 1,
            name: "LED Bulb 9W",
            category: "led-bulbs",
            price: 120,
            image: "images/led-bulb.jpg",
            description: "Energy efficient 9W LED bulb with 2-year warranty",
            rating: 4.5
        },
        {
            id: 2,
            name: "LED Tube Light 20W",
            category: "tube-lights",
            price: 350,
            image: "images/tubelight.jpg",
            description: "20W LED tube light with high lumen output",
            rating: 4.2
        },
        {
            id: 3,
            name: "LED Panel Light 24W",
            category: "panel-lights",
            price: 850,
            image: "images/pannel-light.jpg",
            description: "Sleek 24W LED panel light for modern interiors",
            rating: 4.7
        },
        {
            id: 4,
            name: "Electrical Wire 90m",
            category: "wires",
            price: 1200,
            image: "images/download (2).jpeg",
            description: "90 meters of high-quality electrical wire",
            rating: 4.4
        },
        {
            id: 5,
            name: "Modular Switch",
            category: "switches",
            price: 85,
            image: "images/download (3).jpeg",
            description: "Premium quality modular switch with safety features",
            rating: 4.6
        },
        {
            id: 6,
            name: "Ceiling Rose Holder",
            category: "holders",
            price: 45,
            image: "images/download (4).jpeg",
            description: "Durable ceiling rose holder for secure bulb fitting",
            rating: 4.1
        },
        {
            id: 7,
            name: "4-Socket Extension Board",
            category: "extension",
            price: 350,
            image: "images/download (5).jpeg",
            description: "4-socket extension board with surge protection",
            rating: 4.3
        },
        {
            id: 8,
            name: "Fairy Lights 10m",
            category: "decorative",
            price: 250,
            image: "images/download (6).jpeg",
            description: "10 meters of decorative fairy lights for festivals",
            rating: 4.8
        }
    ];
}

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
    searchInput.addEventListener('input', function() {
        filterProducts(this.value);
    });
    
    // Sort functionality
    const sortSelect = document.querySelector('.sort-select');
    sortSelect.addEventListener('change', function() {
        sortProducts(this.value);
    });
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
        html += `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">₹${product.price}</div>
                    <div class="product-rating">
                        ${generateStarRating(product.rating)}
                    </div>
                    <p>${product.description}</p>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
    });
    
    productsGrid.innerHTML = html;
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
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
        const priceA = parseInt(a.querySelector('.product-price').textContent.replace('₹', ''));
        const priceB = parseInt(b.querySelector('.product-price').textContent.replace('₹', ''));
        
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

// Cart Page
function initCartPage() {
    renderCartItems();
    
    // Event listeners for cart controls
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quantity-btn.plus')) {
            const productId = parseInt(e.target.closest('.quantity-btn').dataset.id);
            increaseQuantity(productId);
        }
        
        if (e.target.closest('.quantity-btn.minus')) {
            const productId = parseInt(e.target.closest('.quantity-btn').dataset.id);
            decreaseQuantity(productId);
        }
        
        if (e.target.closest('.remove-btn')) {
            const productId = parseInt(e.target.closest('.remove-btn').dataset.id);
            removeFromCart(productId);
        }
    });
}

// Render cart items
function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const deliveryCharges = document.getElementById('delivery-charges');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
        cartSubtotal.textContent = '₹0';
        deliveryCharges.textContent = '₹0';
        cartTotal.textContent = '₹0';
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="product-price">₹${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <div class="quantity-btn minus" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </div>
                        <span>${item.quantity}</span>
                        <div class="quantity-btn plus" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </div>
                    </div>
                    <div class="remove-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    
    // Calculate delivery charges (free for orders above ₹500)
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal + delivery;
    
    cartSubtotal.textContent = `₹${subtotal}`;
    deliveryCharges.textContent = `₹${delivery}`;
    cartTotal.textContent = `₹${total}`;
}

// Increase item quantity
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        saveCart();
        renderCartItems();
        updateCartCount();
    }
}

// Decrease item quantity
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(productId);
            return;
        }
        saveCart();
        renderCartItems();
        updateCartCount();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout Page
function initCheckoutPage() {
    updateCheckoutSummary();
    
    // Payment option event listeners
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options in the same group
            const group = this.closest('.payment-options');
            group.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
        });
    });
    
    // Place order button
    document.getElementById('place-order').addEventListener('click', placeOrder);
}

// Update checkout summary
function updateCheckoutSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal + delivery;
    
    document.getElementById('checkout-subtotal').textContent = `₹${subtotal}`;
    document.getElementById('checkout-delivery').textContent = `₹${delivery}`;
    document.getElementById('checkout-total').textContent = `₹${total}`;
}

// Place order
function placeOrder() {
    // Validate form
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const pincode = document.getElementById('pincode').value;
    
    if (!name || !phone || !address || !pincode) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    // Create order summary
    const orderDetails = {
        customer: { name, phone, address, pincode },
        items: cart,
        total: document.getElementById('checkout-total').textContent,
        date: new Date().toLocaleString(),
        orderId: 'ARN-' + Date.now()
    };
    
    // Send order via WhatsApp (demo)
    const whatsappMessage = createWhatsAppMessage(orderDetails);
    const whatsappUrl = `https://wa.me/919084984045?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    
    // Redirect to WhatsApp
    window.location.href = whatsappUrl;
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


// Contact form submission
function initContactPage() {
    const contactForm = document.getElementById('service-booking-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Create WhatsApp message
            const message = createServiceBookingMessage(data);
            const whatsappUrl = `https://wa.me/919084984045?text=${encodeURIComponent(message)}`;
            
            // Redirect to WhatsApp
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
        alert('UPI ID copied to clipboard: ' + upiId);
    });
}

// Continue shopping after order
function continueShopping() {
    document.getElementById('order-success').style.display = 'none';
    window.location.href = 'products.html';
}

// Initialize UPI payment section
function initUPIPayment() {
    const paymentOptions = document.querySelectorAll('.payment-option[data-payment]');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const paymentMethod = this.dataset.payment;
            const upiDetails = document.getElementById('upi-details');
            
            if (paymentMethod === 'upi') {
                upiDetails.style.display = 'block';
            } else {
                upiDetails.style.display = 'none';
            }
        });
    });
}

// Update your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Your existing initialization code...
    
    // Initialize page-specific functionality
    if (window.location.pathname.includes('contact.html')) {
        initContactPage();
    }
    
    if (window.location.pathname.includes('checkout.html')) {
        initUPIPayment();
    }
});

// Update DOMContentLoaded in script.js
document.addEventListener('DOMContentLoaded', function() {
    // Your existing initialization code...
    
    // Initialize auth if auth.js is loaded
    if (typeof initAuth === 'function') {
        initAuth();
    }
    
    // Check auth state for protected pages
    checkPageAccess();
});

// Check page access based on authentication
function checkPageAccess() {
    const currentUser = JSON.parse(localStorage.getItem('arn_current_user')) || null;
    const protectedPages = ['services.html', 'products.html', 'gallery.html', 'about.html', 'contact.html', 'cart.html', 'checkout.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    // If user is not logged in and trying to access protected page, redirect to login
    if (!currentUser && protectedPages.includes(currentPage) && currentPage !== 'index.html') {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(currentPage);
        return;
    }
}

// Add protected content notices (optional)
function addProtectedNotices() {
    const currentUser = JSON.parse(localStorage.getItem('arn_current_user')) || null;
    
    if (!currentUser) {
        // Add login prompts to various sections
        const serviceSection = document.querySelector('.services-grid');
        const productSection = document.querySelector('.products-grid');
        
        if (serviceSection) {
            const loginPrompt = document.createElement('div');
            loginPrompt.className = 'protected-content';
            loginPrompt.innerHTML = `
                <h2>Access All Services</h2>
                <p>Login or create an account to book electrical services and get expert help</p>
                <div class="auth-buttons">
                    <a href="login.html" class="btn">Login</a>
                    <a href="signup.html" class="btn btn-outline">Sign Up</a>
                </div>
            `;
            serviceSection.parentNode.insertBefore(loginPrompt, serviceSection);
        }
    }
}



// Update navigation based on login status
function updateNavigation() {
    const navMenu = document.getElementById('main-nav');
    const currentUser = JSON.parse(localStorage.getItem('arn_current_user')) || null;
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!navMenu) return;

    if (currentUser) {
        // User logged in - full navigation
        navMenu.innerHTML = `
            <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Home</a></li>
            <li><a href="services.html" class="${currentPage === 'services.html' ? 'active' : ''}">Services</a></li>
            <li><a href="products.html" class="${currentPage === 'products.html' ? 'active' : ''}">Products</a></li>
            <li><a href="gallery.html" class="${currentPage === 'gallery.html' ? 'active' : ''}">Gallery</a></li>
            <li><a href="about.html" class="${currentPage === 'about.html' ? 'active' : ''}">About</a></li>
            <li><a href="contact.html" class="${currentPage === 'contact.html' ? 'active' : ''}">Contact</a></li>
            <li class="user-menu">
                <a href="#" class="user-dropdown">
                    <i class="fas fa-user-circle"></i>
                    ${currentUser.name.split(' ')[0]}
                    <i class="fas fa-chevron-down"></i>
                </a>
                <div class="dropdown-menu">
                    <a href="#" onclick="viewProfile()"><i class="fas fa-user"></i> Profile</a>
                    <a href="#" onclick="viewOrders()"><i class="fas fa-shopping-bag"></i> My Orders</a>
                    <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </li>
            <li class="cart-icon">
                <a href="cart.html"><i class="fas fa-shopping-cart"></i></a>
                <span class="cart-count">0</span>
            </li>
        `;
    } else {
        // User not logged in - limited navigation
        navMenu.innerHTML = `
            <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Home</a></li>
            <li><a href="login.html" class="${currentPage === 'login.html' ? 'active' : ''}">Login</a></li>
            <li><a href="signup.html" class="${currentPage === 'signup.html' ? 'active' : ''}">Sign Up</a></li>
        `;
    }
    
    // Mobile menu toggle functionality
    initMobileMenu();
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// Logout function
function logout() {
    localStorage.removeItem('arn_current_user');
    showNotification('Logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
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

// Profile functions (stub)
function viewProfile() {
    showNotification('Profile page coming soon!', 'info');
}

function viewOrders() {
    showNotification('Order history coming soon!', 'info');
}

// Check authentication on page load
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('arn_current_user')) || null;
    const protectedPages = ['services.html', 'products.html', 'gallery.html', 'about.html', 'contact.html', 'cart.html', 'checkout.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    // If user not logged in and trying to access protected page
    if (!currentUser && protectedPages.includes(currentPage)) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(currentPage);
        return false;
    }
    
    // If user logged in and on auth pages, redirect to home
    if (currentUser && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Update your existing DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Your existing cart and other initializations...
    
    // Initialize navigation and auth
    updateNavigation();
    
    // Check authentication
    if (!checkAuth()) {
        return;
    }
    
    // Rest of your existing code...
    updateCartCount();
    // ... other initializations
});


// Update navigation for ALL pages
function updateNavigation() {
    const navMenu = document.getElementById('main-nav');
    const currentUser = JSON.parse(localStorage.getItem('arn_current_user')) || null;
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!navMenu) return;

    if (currentUser) {
        // User logged in - full navigation with user menu
        navMenu.innerHTML = `
            <li><a href="index.html" class="${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}">Home</a></li>
            <li><a href="services.html" class="${currentPage === 'services.html' ? 'active' : ''}">Services</a></li>
            <li><a href="products.html" class="${currentPage === 'products.html' ? 'active' : ''}">Products</a></li>
            <li><a href="gallery.html" class="${currentPage === 'gallery.html' ? 'active' : ''}">Gallery</a></li>
            <li><a href="about.html" class="${currentPage === 'about.html' ? 'active' : ''}">About</a></li>
            <li><a href="contact.html" class="${currentPage === 'contact.html' ? 'active' : ''}">Contact</a></li>
            <li class="user-menu">
                <a href="#" class="user-dropdown">
                    <i class="fas fa-user-circle"></i>
                    ${currentUser.name.split(' ')[0]}
                    <i class="fas fa-chevron-down"></i>
                </a>
                <div class="dropdown-menu">
                    <a href="#" onclick="viewProfile()"><i class="fas fa-user"></i> Profile</a>
                    <a href="#" onclick="viewOrders()"><i class="fas fa-shopping-bag"></i> My Orders</a>
                    <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </li>
            <li class="cart-icon">
                <a href="cart.html"><i class="fas fa-shopping-cart"></i></a>
                <span class="cart-count">0</span>
            </li>
        `;
    } else {
        // User not logged in - limited navigation
        navMenu.innerHTML = `
            <li><a href="index.html" class="${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}">Home</a></li>
            <li><a href="login.html" class="${currentPage === 'login.html' ? 'active' : ''}">Login</a></li>
            <li><a href="signup.html" class="${currentPage === 'signup.html' ? 'active' : ''}">Sign Up</a></li>
        `;
    }
    
    // Mobile menu functionality
    initMobileMenu();
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        // Remove existing event listeners
        mobileToggle.replaceWith(mobileToggle.cloneNode(true));
        const newMobileToggle = document.querySelector('.mobile-toggle');
        
        newMobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// Check authentication and update navigation on EVERY page load
document.addEventListener('DOMContentLoaded', function() {
    // Update navigation first
    updateNavigation();
    
    // Then check authentication
    if (!checkAuth()) {
        return;
    }
    
    // Then initialize other features
    updateCartCount();
    
    // Page-specific initializations
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

// Authentication check function
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('arn_current_user')) || null;
    const protectedPages = ['services.html', 'products.html', 'gallery.html', 'about.html', 'contact.html', 'cart.html', 'checkout.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    // If user not logged in and trying to access protected page
    if (!currentUser && protectedPages.includes(currentPage)) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(currentPage);
        return false;
    }
    
    // If user logged in and on auth pages, redirect to home
    if (currentUser && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('arn_current_user');
    showNotification('Logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

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




