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
getProducts() {
    return [
        {
            id: 1,
            name: "LED Bulb 9W",
            category: "led-bulbs",
            price: 120,
            originalPrice: 150,
            image: "images/led-bulb.jpg", // 👈 YAHAN PATH CORRECT KARO
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
            ]
        },
        {
            id: 2,
            name: "LED Tube Light 20W",
            category: "tube-lights",
            price: 350,
            originalPrice: 420,
            image: "images/tubelight.jpg", // 👈 YAHAN PATH CORRECT KARO
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
            reviews: []
        },
        {
            id: 3,
            name: "LED Panel Light 24W",
            category: "panel-lights", 
            price: 850,
            originalPrice: 1000,
            image: "images/pannel-light.jpg", // 👈 YAHAN PATH CORRECT KARO
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
            reviews: []
        },
        {
            id: 4,
            name: "Electrical Wire 90m",
            category: "wires",
            price: 1200,
            originalPrice: 1400,
            image: "images/download (2).jpeg", // 👈 YAHAN PATH CORRECT KARO
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
            reviews: []
        },
        {
            id: 5,
            name: "Modular Switch",
            category: "switches",
            price: 85,
            originalPrice: 100,
            image: "images/download (3).jpeg", // 👈 YAHAN PATH CORRECT KARO
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
            reviews: []
        },
        {
            id: 6, 
            name: "Ceiling Rose Holder",
            category: "holders",
            price: 45,
            originalPrice: 60,
            image: "images/download (4).jpeg", // 👈 YAHAN PATH CORRECT KARO
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
            reviews: []
        },
        {
            id: 7,
            name: "4-Socket Extension Board", 
            category: "extension",
            price: 350,
            originalPrice: 450,
            image: "images/download (5).jpeg", // 👈 YAHAN PATH CORRECT KARO
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
            reviews: []
        },
        {
            id: 8,
            name: "Fairy Lights 10m",
            category: "decorative",
            price: 250,
            originalPrice: 350, 
            image: "images/download (6).jpeg", // 👈 YAHAN PATH CORRECT KARO
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
            reviews: []
        }
    ];
}

    renderProductDetails() {
        // Update basic info
        document.getElementById('product-name').textContent = this.currentProduct.name;
        document.getElementById('product-category').textContent = this.formatCategory(this.currentProduct.category);
        document.getElementById('detail-product-name').textContent = this.currentProduct.name;
        document.getElementById('detail-product-price').textContent = `₹${this.currentProduct.price}`;
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