// product-details.js - Product Details Page Functionality
class ProductDetails {
    constructor() {
        this.productId = this.getProductIdFromURL();
        this.currentProduct = null;
        this.quantity = 1;
    }

    getProductIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('id')) || 1;
    }

    init() {
        this.loadProductDetails();
        this.setupEventListeners();
    }

    loadProductDetails() {
        const products = this.getProducts();
        this.currentProduct = products.find(p => p.id === this.productId) || products[0];
        
        if (this.currentProduct) {
            this.renderProductDetails();
            this.loadRelatedProducts();
        }
    }

    // product-details.js - Image paths update karo
// Updated getProducts function in product-details.js
getProducts() {
    // First try to get products from admin panel
    const adminProducts = JSON.parse(localStorage.getItem('websiteProducts'));
    if (adminProducts && adminProducts.length > 0) {
        return adminProducts;
    }
    
    // Fallback to default products
    return [
        // Your existing products as backup
        {
            id: 1,
            name: "LED Bulb 9W",
            category: "led-bulbs",
            price: 120,
            originalPrice: 150,
            discount: 20,
            // ... rest of product data
        }
        // ... other products
    ];
}
    renderProductDetails() {
    // Update basic info
    document.getElementById('product-name').textContent = this.currentProduct.name;
    document.getElementById('product-category').textContent = this.formatCategory(this.currentProduct.category);
    document.getElementById('detail-product-name').textContent = this.currentProduct.name;
    
    // ✅ UPDATE: Discount price display with styling
    this.renderProductPrice();
    
    document.getElementById('detail-product-rating').innerHTML = this.generateStarRating(this.currentProduct.rating);
    
    // Update main image
    document.getElementById('main-product-img').src = this.currentProduct.image;
    document.getElementById('main-product-img').alt = this.currentProduct.name;

    // Render thumbnails
    this.renderThumbnails();

    // Render specifications
    this.renderSpecifications();

    // Render features
    this.renderFeatures();

    // Render description
    document.getElementById('product-description').textContent = this.currentProduct.description;

    // Render reviews
    this.renderReviews();

    // Update WhatsApp message
    this.updateWhatsAppMessage();
}

// ✅ NEW FUNCTION: Product price with discount display
renderProductPrice() {
    const priceContainer = document.getElementById('detail-product-price');
    
    if (this.currentProduct.discount > 0) {
        priceContainer.innerHTML = `
            <div class="price-with-discount">
                <span class="current-price">₹${this.currentProduct.price}</span>
                <span class="original-price">₹${this.currentProduct.originalPrice}</span>
                <span class="discount-badge">${this.currentProduct.discount}% OFF</span>
            </div>
        `;
    } else {
        priceContainer.innerHTML = `
            <div class="price-without-discount">
                <span class="current-price">₹${this.currentProduct.price}</span>
            </div>
        `;
    }
}

    renderThumbnails() {
        const thumbnailsContainer = document.querySelector('.image-thumbnails');
        thumbnailsContainer.innerHTML = '';

        this.currentProduct.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
            thumbnail.innerHTML = `<img src="${image}" alt="Thumbnail ${index + 1}">`;
            thumbnail.addEventListener('click', () => this.changeMainImage(image, thumbnail));
            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    changeMainImage(imageSrc, clickedThumbnail) {
        document.getElementById('main-product-img').src = imageSrc;
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
        clickedThumbnail.classList.add('active');
    }

    renderSpecifications() {
        const specsContainer = document.getElementById('product-specs');
        specsContainer.innerHTML = '';

        for (const [key, value] of Object.entries(this.currentProduct.specifications)) {
            const specItem = document.createElement('div');
            specItem.className = 'spec-item';
            specItem.innerHTML = `
                <span class="spec-key">${key}:</span>
                <span class="spec-value">${value}</span>
            `;
            specsContainer.appendChild(specItem);
        }
    }

    renderFeatures() {
        const featuresContainer = document.getElementById('product-features');
        featuresContainer.innerHTML = '';

        this.currentProduct.features.forEach(feature => {
            const featureItem = document.createElement('li');
            featureItem.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
            featuresContainer.appendChild(featureItem);
        });
    }

    renderReviews() {
        const reviewsContainer = document.getElementById('reviews-list');
        const overallRating = document.getElementById('overall-rating');
        const overallStars = document.getElementById('overall-stars');

        if (this.currentProduct.reviews.length > 0) {
            overallRating.textContent = this.currentProduct.rating;
            overallStars.innerHTML = this.generateStarRating(this.currentProduct.rating);

            reviewsContainer.innerHTML = '';
            this.currentProduct.reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review-item';
                reviewElement.innerHTML = `
                    <div class="review-header">
                        <div class="review-user">${review.user}</div>
                        <div class="review-rating">${this.generateStarRating(review.rating)}</div>
                    </div>
                    <div class="review-comment">${review.comment}</div>
                    <div class="review-date">${review.date}</div>
                `;
                reviewsContainer.appendChild(reviewElement);
            });
        } else {
            reviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review this product!</p>';
        }
    }

    loadRelatedProducts() {
        const relatedContainer = document.getElementById('related-products');
        const products = this.getProducts();
        const relatedProducts = products.filter(p => p.category === this.currentProduct.category && p.id !== this.currentProduct.id).slice(0, 4);

        if (relatedProducts.length > 0) {
            let html = '';
            relatedProducts.forEach(product => {
                html += `
                    <div class="product-card">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <div class="product-price">₹${product.price}</div>
                            <div class="product-rating">
                                ${this.generateStarRating(product.rating)}
                            </div>
                            <div class="product-actions">
                                <button class="btn btn-small" onclick="window.location.href='product-details.html?id=${product.id}'">
                                    View Details
                                </button>
                                <button class="btn btn-small add-to-cart" data-id="${product.id}">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            relatedContainer.innerHTML = html;
        } else {
            relatedContainer.innerHTML = '<p>No related products found.</p>';
        }
    }

    setupEventListeners() {
        // Quantity controls
        document.getElementById('increase-qty').addEventListener('click', () => this.changeQuantity(1));
        document.getElementById('decrease-qty').addEventListener('click', () => this.changeQuantity(-1));
        document.getElementById('quantity').addEventListener('change', (e) => this.setQuantity(parseInt(e.target.value)));

        // Add to cart
        document.getElementById('add-to-cart-detail').addEventListener('click', () => this.addToCart());

        // Buy now
        document.getElementById('buy-now').addEventListener('click', () => this.buyNow());
    }

    changeQuantity(change) {
        this.quantity = Math.max(1, Math.min(10, this.quantity + change));
        document.getElementById('quantity').value = this.quantity;
    }

    setQuantity(qty) {
        this.quantity = Math.max(1, Math.min(10, qty));
        document.getElementById('quantity').value = this.quantity;
    }

    addToCart() {
        if (typeof addToCart === 'function') {
            for (let i = 0; i < this.quantity; i++) {
                addToCart(this.currentProduct.id);
            }
            this.showNotification(`Added ${this.quantity} ${this.currentProduct.name} to cart!`, 'success');
        } else {
            this.showNotification('Cart functionality not available', 'error');
        }
    }

    buyNow() {
        this.addToCart();
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000);
    }

    updateWhatsAppMessage() {
        const waButtons = document.querySelectorAll('[data-wa-type="product_info"]');
        waButtons.forEach(button => {
            button.setAttribute('data-wa-message', 
                `I'm interested in ${this.currentProduct.name}. Please share complete details and price.`);
        });
    }

    generateStarRating(rating) {
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

    formatCategory(category) {
        const categoryMap = {
            'led-bulbs': 'LED Bulbs',
            'tube-lights': 'Tube Lights',
            'panel-lights': 'Panel Lights',
            'wires': 'Electrical Wires',
            'switches': 'Switches & Sockets',
            'holders': 'Holders',
            'extension': 'Extension Boards',
            'decorative': 'Decorative Lights'
        };
        return categoryMap[category] || category;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const productDetails = new ProductDetails();
    productDetails.init();
});

// products.js - Agar alag file hai toh
function renderFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-products');
    if (!featuredGrid) return;
    
    const products = getProducts();
    // Latest products (highest ID first)
    const latestProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 4);
    
    let html = '';
    latestProducts.forEach(product => {
        // Same HTML structure as above
        // ... 
    });
    
    featuredGrid.innerHTML = html;
}

// Page load pe call karo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('featured-products')) {
        renderFeaturedProducts();
    }
});