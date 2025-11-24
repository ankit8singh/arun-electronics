// Admin Panel Functionality with Complete Order Management
class AdminPanel {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('adminProducts')) || this.getDefaultProducts();
        this.orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
         this.returnRequests = JSON.parse(localStorage.getItem('returnRequests')) || []; 
        this.init();
    }

    // ✅ NEW: Return Request Management in Admin Panel
// Add these functions to your existing AdminPanel class

// Return request status types
getReturnStatusTypes() {
    return {
        'requested': 'Return Requested',
        'approved': 'Approved for Return',
        'rejected': 'Return Rejected',
        'received': 'Item Received',
        'refunded': 'Refund Processed',
        'cancelled': 'Return Cancelled'
    };
}

// Load return requests
loadReturnRequests() {
    const returnsList = document.getElementById('returnsList');
    if (!returnsList) return;

    const returnRequests = JSON.parse(localStorage.getItem('returnRequests')) || [];

    if (returnRequests.length === 0) {
        returnsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-undo" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                <h3>No Return Requests</h3>
                <p>Return requests will appear here when customers submit them</p>
            </div>
        `;
        return;
    }

    let html = '';
    returnRequests.forEach((returnReq, index) => {
        const order = this.orders.find(o => o.orderId === returnReq.orderId);
        const status = returnReq.status || 'requested';
        
        html += `
            <div class="return-card" data-status="${status}">
                <div class="return-header">
                    <div class="return-info">
                        <h4>Return Request #RT${returnReq.returnId}</h4>
                        <div class="return-meta">
                            <span class="order-ref">Order: ${returnReq.orderId}</span>
                            <span class="customer">${returnReq.customerName} • ${returnReq.customerPhone}</span>
                            <span class="date">Requested: ${returnReq.requestDate}</span>
                        </div>
                    </div>
                    <div class="return-amount">
                        <strong>₹${returnReq.refundAmount || 0}</strong>
                    </div>
                </div>
                
                <div class="return-details">
                    <div class="return-reason">
                        <strong>Reason:</strong> ${returnReq.reason}
                    </div>
                    <div class="return-items">
                        <strong>Items:</strong> ${returnReq.items.map(item => item.name).join(', ')}
                    </div>
                </div>
                
                <div class="return-status-badges">
                    <span class="return-status-badge ${status}">
                        ${this.getReturnStatusTypes()[status]}
                    </span>
                </div>
                
                <div class="return-actions">
                    <button class="btn-admin small" onclick="adminPanel.viewReturnDetails(${index})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    
                    ${status === 'requested' ? `
                        <button class="btn-admin small success" onclick="adminPanel.updateReturnStatus(${index}, 'approved')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn-admin small danger" onclick="adminPanel.updateReturnStatus(${index}, 'rejected')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : ''}
                    
                    ${status === 'approved' ? `
                        <button class="btn-admin small success" onclick="adminPanel.updateReturnStatus(${index}, 'received')">
                            <i class="fas fa-box"></i> Mark Received
                        </button>
                    ` : ''}
                    
                    ${status === 'received' ? `
                        <button class="btn-admin small success" onclick="adminPanel.processRefund(${index})">
                            <i class="fas fa-rupee-sign"></i> Process Refund
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });

    returnsList.innerHTML = html;
}

// View return details
viewReturnDetails(returnIndex) {
    const returnRequests = JSON.parse(localStorage.getItem('returnRequests')) || [];
    const returnReq = returnRequests[returnIndex];
    if (!returnReq) return;

    const order = this.orders.find(o => o.orderId === returnReq.orderId);
    const modal = this.createReturnDetailsModal(returnReq, order, returnIndex);
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

// Create return details modal
createReturnDetailsModal(returnReq, order, returnIndex) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h2>Return Request #RT${returnReq.returnId}</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            
            <div class="modal-body">
                <div class="details-grid">
                    <div class="detail-section">
                        <h3>Customer Information</h3>
                        <div class="detail-item">
                            <label>Name:</label>
                            <span>${returnReq.customerName}</span>
                        </div>
                        <div class="detail-item">
                            <label>Phone:</label>
                            <span>${returnReq.customerPhone}</span>
                        </div>
                        <div class="detail-item">
                            <label>Order ID:</label>
                            <span>${returnReq.orderId}</span>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Return Information</h3>
                        <div class="detail-item">
                            <label>Request Date:</label>
                            <span>${returnReq.requestDate}</span>
                        </div>
                        <div class="detail-item">
                            <label>Reason:</label>
                            <span>${returnReq.reason}</span>
                        </div>
                        <div class="detail-item">
                            <label>Refund Amount:</label>
                            <span>₹${returnReq.refundAmount || 0}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status:</label>
                            <span class="return-status-badge ${returnReq.status}">
                                ${this.getReturnStatusTypes()[returnReq.status]}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="return-items-details">
                    <h3>Items to Return</h3>
                    ${returnReq.items.map(item => `
                        <div class="return-item-detail">
                            <div class="item-info">
                                <strong>${item.name}</strong>
                                <div>Qty: ${item.quantity} • Amount: ₹${item.amount}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                ${returnReq.additionalNotes ? `
                <div class="additional-notes">
                    <h3>Additional Notes</h3>
                    <p>${returnReq.additionalNotes}</p>
                </div>
                ` : ''}
            </div>
            
            <div class="modal-footer">
                <div class="action-buttons">
                    ${returnReq.status === 'requested' ? `
                        <button class="btn-admin success" onclick="adminPanel.updateReturnStatus(${returnIndex}, 'approved'); this.closest('.modal').remove()">
                            <i class="fas fa-check"></i> Approve Return
                        </button>
                        <button class="btn-admin danger" onclick="adminPanel.updateReturnStatus(${returnIndex}, 'rejected'); this.closest('.modal').remove()">
                            <i class="fas fa-times"></i> Reject Return
                        </button>
                    ` : ''}
                    
                    ${returnReq.status === 'approved' ? `
                        <button class="btn-admin success" onclick="adminPanel.updateReturnStatus(${returnIndex}, 'received'); this.closest('.modal').remove()">
                            <i class="fas fa-box"></i> Mark Item Received
                        </button>
                    ` : ''}
                    
                    ${returnReq.status === 'received' ? `
                        <button class="btn-admin success" onclick="adminPanel.processRefund(${returnIndex}); this.closest('.modal').remove()">
                            <i class="fas fa-rupee-sign"></i> Process Refund
                        </button>
                    ` : ''}
                    
                    <button class="btn-admin" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

// Update return status
updateReturnStatus(returnIndex, newStatus) {
    const returnRequests = JSON.parse(localStorage.getItem('returnRequests')) || [];
    
    if (returnRequests[returnIndex]) {
        returnRequests[returnIndex].status = newStatus;
        returnRequests[returnIndex].updatedAt = new Date().toLocaleString();
        
        // If rejected, notify customer
        if (newStatus === 'rejected') {
            this.notifyCustomerReturnRejected(returnRequests[returnIndex]);
        }
        
        // If approved, notify customer with instructions
        if (newStatus === 'approved') {
            this.notifyCustomerReturnApproved(returnRequests[returnIndex]);
        }
        
        localStorage.setItem('returnRequests', JSON.stringify(returnRequests));
        this.loadReturnRequests();
        
        this.showNotification(`Return request ${this.getReturnStatusTypes()[newStatus]}`, 'success');
    }
}

// Process refund
processRefund(returnIndex) {
    const returnRequests = JSON.parse(localStorage.getItem('returnRequests')) || [];
    const returnReq = returnRequests[returnIndex];
    
    if (returnReq && returnReq.status === 'received') {
        returnReq.status = 'refunded';
        returnReq.refundDate = new Date().toLocaleString();
        returnReq.updatedAt = new Date().toLocaleString();
        
        // Update revenue (subtract refunded amount)
        this.updateRevenueForRefund(returnReq.refundAmount);
        
        // Notify customer
        this.notifyCustomerRefundProcessed(returnReq);
        
        localStorage.setItem('returnRequests', JSON.stringify(returnRequests));
        this.loadReturnRequests();
        this.loadDashboard();
        
        this.showNotification(`Refund of ₹${returnReq.refundAmount} processed successfully`, 'success');
    }
}

// Update revenue for refund
updateRevenueForRefund(refundAmount) {
    // This function would update your revenue tracking
    // For now, we'll just log it
    console.log(`💰 Refund processed: ₹${refundAmount}`);
}

// Notify customer functions
notifyCustomerReturnRejected(returnReq) {
    const message = `❌ Your return request #RT${returnReq.returnId} has been rejected. Please contact support for more details.`;
    this.createCustomerNotification(returnReq.customerPhone, message);
}

notifyCustomerReturnApproved(returnReq) {
    const message = `✅ Your return request #RT${returnReq.returnId} has been approved! Please ship the item to our address or visit our store. We'll process your refund once we receive the items.`;
    this.createCustomerNotification(returnReq.customerPhone, message);
}

notifyCustomerRefundProcessed(returnReq) {
    const message = `💰 Refund of ₹${returnReq.refundAmount} for return #RT${returnReq.returnId} has been processed! It will reflect in your account within 3-5 business days.`;
    this.createCustomerNotification(returnReq.customerPhone, message);
}

createCustomerNotification(phone, message) {
    // In a real system, this would send SMS/email
    // For now, we'll create a WhatsApp link
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    console.log('📱 Customer Notification:', { phone, message, whatsappUrl });
    
    // You can automatically open WhatsApp or just show the link
    // window.open(whatsappUrl, '_blank');
}
    // ✅ DEFAULT PRODUCTS FUNCTION
    getDefaultProducts() {
        return [
            {
                id: 1,
                name: "LED Bulb 9W",
                category: "led-bulbs",
                price: 120,
                originalPrice: 150,
                discount: 20,
                image: "images/led-bulb.jpg",
                images: ["images/led-bulb.jpg", "images/led-bulb-2.jpg", "images/led-bulb-3.jpg"],
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
                discount: 17,
                image: "images/tubelight.jpg",
                images: ["images/tube-light.jpg", "images/tube-light-2.jpg"],
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
                discount: 15,
                image: "images/pannel-light.jpg",
                images: ["images/panel-light.jpg"],
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
                discount: 14,
                image: "images/download (2).jpeg",
                images: ["images/electrical-wire.jpg"],
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
                discount: 15,
                image: "images/download (3).jpeg",
                images: ["images/modular-switch.jpg"],
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
                discount: 25,
                image: "images/download (4).jpeg",
                images: ["images/ceiling-rose.jpg"],
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
                discount: 22,
                image: "images/download (5).jpeg",
                images: ["images/extension-board.jpg"],
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
                discount: 29,
                image: "images/download (6).jpeg",
                images: ["images/fairy-lights.jpg"],
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

    init() {
        this.checkAuth();
        this.loadDashboard();
        this.setupEventListeners();
        this.loadProducts();
        this.loadOrders();
         this.loadReturnRequests();
        this.saveProductsToWebsite();
    }

    checkAuth() {
        if (localStorage.getItem('adminLoggedIn') !== 'true') {
            window.location.href = 'admin-login.html';
        }
    }

    setupEventListeners() {
        // Add product form
        document.getElementById('addProductForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct();
        });

        // Auto-calculate discount
        document.getElementById('productPrice').addEventListener('input', this.calculateDiscount.bind(this));
        document.getElementById('originalPrice').addEventListener('input', this.calculateDiscount.bind(this));
    }

    calculateDiscount() {
        const price = parseFloat(document.getElementById('productPrice').value);
        const originalPrice = parseFloat(document.getElementById('originalPrice').value);
        
        if (price && originalPrice && originalPrice > price) {
            const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
            document.getElementById('productDiscount').value = discount;
        }
    }

    addProduct() {
        const formData = new FormData(document.getElementById('addProductForm'));
        
        const product = {
            id: Date.now(),
            name: formData.get('productName'),
            category: formData.get('productCategory'),
            price: parseFloat(formData.get('productPrice')),
            originalPrice: parseFloat(formData.get('originalPrice')) || parseFloat(formData.get('productPrice')),
            discount: parseInt(formData.get('productDiscount')) || 0,
            image: formData.get('productImage'),
            images: [formData.get('productImage')],
            description: formData.get('productDescription'),
            rating: 4.0,
            specifications: this.parseSpecifications(formData.get('productSpecs')),
            features: formData.get('productFeatures').split('\n').filter(f => f.trim()),
            reviews: []
        };

        this.products.push(product);
        this.saveProducts();
        this.loadProducts();
        this.loadDashboard();

        document.getElementById('addProductForm').reset();
        this.showNotification('Product added successfully!', 'success');
    }

    parseSpecifications(specsText) {
        if (!specsText.trim()) return {};
        
        try {
            return JSON.parse(specsText);
        } catch (e) {
            const specs = {};
            specsText.split('\n').forEach(line => {
                const [key, value] = line.split(':').map(s => s.trim());
                if (key && value) specs[key] = value;
            });
            return specs;
        }
    }

    loadProducts() {
        const productsList = document.getElementById('productsList');
        if (!productsList) return;
        
        productsList.innerHTML = '';

        if (this.products.length === 0) {
            productsList.innerHTML = '<p>No products found. Add your first product!</p>';
            return;
        }

        this.products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <div class="product-info">
                    <strong>${product.name}</strong>
                    <div>Category: ${this.formatCategory(product.category)} | Price: ₹${product.price} | Discount: ${product.discount}%</div>
                </div>
                <div class="product-actions">
                    <button class="btn-admin" onclick="adminPanel.editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-admin danger" onclick="adminPanel.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            productsList.appendChild(productItem);
        });
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('originalPrice').value = product.originalPrice;
            document.getElementById('productDiscount').value = product.discount;
            document.getElementById('productImage').value = product.image;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productFeatures').value = product.features.join('\n');
            document.getElementById('productSpecs').value = JSON.stringify(product.specifications, null, 2);
            
            showTab('addProduct');
            
            this.products = this.products.filter(p => p.id !== productId);
            document.querySelector('#addProductForm button').innerHTML = '<i class="fas fa-save"></i> Update Product';
            
            this.showNotification('Product loaded for editing. Update and save changes.', 'info');
        }
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.saveProducts();
            this.loadProducts();
            this.loadDashboard();
            this.showNotification('Product deleted successfully!', 'success');
        }
    }

    // ✅ COMPLETE ORDER MANAGEMENT FUNCTIONS
    loadOrders() {
        const ordersList = document.getElementById('ordersList');
        if (!ordersList) return;

        if (this.orders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                    <h3>No Orders Yet</h3>
                    <p>Orders will appear here when customers place them</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.orders.forEach((order, index) => {
            const orderStatus = order.status || 'pending';
            const paymentStatus = order.payment?.status || 'pending';
            const totalAmount = order.summary?.total || 0;

            html += `
                <div class="order-card" data-status="${orderStatus}" data-payment="${paymentStatus}">
                    <div class="order-header">
                        <div class="order-info">
                            <h4>Order #${order.orderId}</h4>
                            <div class="order-meta">
                                <span class="customer">${order.customer.name} • ${order.customer.phone}</span>
                                <span class="date">${order.date}</span>
                            </div>
                        </div>
                        <div class="order-amount">
                            <strong>₹${totalAmount}</strong>
                        </div>
                    </div>
                    
                    <div class="order-details">
                        <div class="order-items-preview">
                            ${order.items.map(item => 
                                `${item.name} (Qty: ${item.quantity})`
                            ).join(', ')}
                        </div>
                        
                        <div class="order-status-badges">
                            <span class="status-badge ${orderStatus}">${this.formatStatus(orderStatus)}</span>
                            <span class="payment-badge ${paymentStatus}">${this.formatPaymentStatus(paymentStatus)}</span>
                        </div>
                    </div>
                    
                    <div class="order-actions">
                        <button class="btn-admin small" onclick="adminPanel.viewOrderDetails(${index})">
                            <i class="fas fa-eye"></i> View
                        </button>
                        
                        ${orderStatus === 'pending' ? `
                            <button class="btn-admin small success" onclick="adminPanel.updateOrderStatus(${index}, 'confirmed')">
                                <i class="fas fa-check"></i> Accept
                            </button>
                            <button class="btn-admin small danger" onclick="adminPanel.updateOrderStatus(${index}, 'cancelled')">
                                <i class="fas fa-times"></i> Reject
                            </button>
                        ` : ''}
                        
                        ${orderStatus === 'confirmed' ? `
                            <button class="btn-admin small success" onclick="adminPanel.updateOrderStatus(${index}, 'processing')">
                                <i class="fas fa-cog"></i> Process
                            </button>
                        ` : ''}
                        
                        ${orderStatus === 'processing' ? `
                            <button class="btn-admin small success" onclick="adminPanel.updateOrderStatus(${index}, 'shipped')">
                                <i class="fas fa-shipping-fast"></i> Ship
                            </button>
                        ` : ''}
                        
                        ${orderStatus === 'shipped' ? `
                            <button class="btn-admin small success" onclick="adminPanel.updateOrderStatus(${index}, 'delivered')">
                                <i class="fas fa-check-circle"></i> Deliver
                            </button>
                        ` : ''}
                        
                        ${paymentStatus === 'pending' && order.payment?.method !== 'Cash on Delivery' ? `
                            <button class="btn-admin small success" onclick="adminPanel.markPaymentPaid(${index})">
                                <i class="fas fa-rupee-sign"></i> Mark Paid
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        ordersList.innerHTML = html;
    }

    viewOrderDetails(orderIndex) {
        const order = this.orders[orderIndex];
        if (!order) return;

        const modal = this.createOrderDetailsModal(order, orderIndex);
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    createOrderDetailsModal(order, orderIndex) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>Order Details - ${order.orderId}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="details-grid">
                        <div class="detail-section">
                            <h3>Customer Information</h3>
                            <div class="detail-item">
                                <label>Name:</label>
                                <span>${order.customer.name}</span>
                            </div>
                            <div class="detail-item">
                                <label>Phone:</label>
                                <span>${order.customer.phone}</span>
                            </div>
                            ${order.customer.email ? `
                            <div class="detail-item">
                                <label>Email:</label>
                                <span>${order.customer.email}</span>
                            </div>
                            ` : ''}
                            <div class="detail-item">
                                <label>Address:</label>
                                <span>${order.customer.address}, ${order.customer.pincode}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Order Information</h3>
                            <div class="detail-item">
                                <label>Order Date:</label>
                                <span>${order.date}</span>
                            </div>
                            <div class="detail-item">
                                <label>Delivery:</label>
                                <span>${order.delivery?.method || 'Home Delivery'}</span>
                            </div>
                            <div class="detail-item">
                                <label>Payment:</label>
                                <span>${order.payment?.method || 'Cash on Delivery'}</span>
                            </div>
                            <div class="detail-item">
                                <label>Status:</label>
                                <span class="status-badge ${order.status || 'pending'}">
                                    ${this.formatStatus(order.status || 'pending')}
                                </span>
                            </div>
                            <div class="detail-item">
                                <label>Payment Status:</label>
                                <span class="payment-badge ${order.payment?.status || 'pending'}">
                                    ${this.formatPaymentStatus(order.payment?.status || 'pending')}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="order-items-details">
                        <h3>Order Items</h3>
                        ${order.items.map(item => `
                            <div class="order-item-detail">
                                <div class="item-info">
                                    <strong>${item.name}</strong>
                                    <div>₹${item.price} × ${item.quantity} = ₹${item.total}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="order-summary-details">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>₹${order.summary?.subtotal || 0}</span>
                        </div>
                        <div class="summary-row">
                            <span>Delivery:</span>
                            <span>₹${order.summary?.delivery || 0}</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span>₹${order.summary?.total || 0}</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <div class="action-buttons">
                        ${order.status === 'pending' ? `
                            <button class="btn-admin success" onclick="adminPanel.updateOrderStatus(${orderIndex}, 'confirmed'); this.closest('.modal').remove()">
                                <i class="fas fa-check"></i> Accept Order
                            </button>
                            <button class="btn-admin danger" onclick="adminPanel.updateOrderStatus(${orderIndex}, 'cancelled'); this.closest('.modal').remove()">
                                <i class="fas fa-times"></i> Reject Order
                            </button>
                        ` : ''}
                        
                        ${order.status === 'confirmed' ? `
                            <button class="btn-admin success" onclick="adminPanel.updateOrderStatus(${orderIndex}, 'processing'); this.closest('.modal').remove()">
                                <i class="fas fa-cog"></i> Start Processing
                            </button>
                        ` : ''}
                        
                        ${order.status === 'processing' ? `
                            <button class="btn-admin success" onclick="adminPanel.updateOrderStatus(${orderIndex}, 'shipped'); this.closest('.modal').remove()">
                                <i class="fas fa-shipping-fast"></i> Mark Shipped
                            </button>
                        ` : ''}
                        
                        ${order.status === 'shipped' ? `
                            <button class="btn-admin success" onclick="adminPanel.updateOrderStatus(${orderIndex}, 'delivered'); this.closest('.modal').remove()">
                                <i class="fas fa-check-circle"></i> Mark Delivered
                            </button>
                        ` : ''}
                        
                        ${order.payment?.status === 'pending' && order.payment?.method !== 'Cash on Delivery' ? `
                            <button class="btn-admin success" onclick="adminPanel.markPaymentPaid(${orderIndex}); this.closest('.modal').remove()">
                                <i class="fas fa-rupee-sign"></i> Mark Payment Paid
                            </button>
                        ` : ''}
                        
                        <button class="btn-admin" onclick="this.closest('.modal').remove()">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }

    updateOrderStatus(orderIndex, newStatus) {
        if (this.orders[orderIndex]) {
            this.orders[orderIndex].status = newStatus;
            this.orders[orderIndex].updatedAt = new Date().toLocaleString();
            
            if (newStatus === 'delivered' && this.orders[orderIndex].payment?.method === 'Cash on Delivery') {
                this.orders[orderIndex].payment.status = 'paid';
            }
            
            this.saveOrders();
            this.loadOrders();
            this.loadDashboard();
            
            this.showNotification(`Order status updated to: ${this.formatStatus(newStatus)}`, 'success');
        }
    }

    markPaymentPaid(orderIndex) {
        if (this.orders[orderIndex]) {
            this.orders[orderIndex].payment.status = 'paid';
            this.orders[orderIndex].payment.paidAt = new Date().toLocaleString();
            this.orders[orderIndex].updatedAt = new Date().toLocaleString();
            
            this.saveOrders();
            this.loadOrders();
            this.loadDashboard();
            
            this.showNotification('Payment marked as paid', 'success');
        }
    }

    filterOrders() {
        const statusFilter = document.getElementById('order-status-filter').value;
        const paymentFilter = document.getElementById('payment-status-filter').value;
        
        const orderCards = document.querySelectorAll('.order-card');
        orderCards.forEach(card => {
            const orderStatus = card.dataset.status;
            const paymentStatus = card.dataset.payment;
            
            const statusMatch = statusFilter === 'all' || orderStatus === statusFilter;
            const paymentMatch = paymentFilter === 'all' || paymentStatus === paymentFilter;
            
            card.style.display = statusMatch && paymentMatch ? 'block' : 'none';
        });
    }

    formatStatus(status) {
        const statusMap = {
            'pending': 'Pending',
            'confirmed': 'Confirmed',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    }

    formatPaymentStatus(status) {
        const statusMap = {
            'pending': 'Payment Pending',
            'paid': 'Paid',
            'failed': 'Payment Failed'
        };
        return statusMap[status] || status;
    }

    saveOrders() {
        localStorage.setItem('adminOrders', JSON.stringify(this.orders));
    }

    // ✅ FIXED: Load dashboard with proper revenue calculation
    loadDashboard() {
        const totalProductsEl = document.getElementById('totalProducts');
        const totalOrdersEl = document.getElementById('totalOrders');
        const totalRevenueEl = document.getElementById('totalRevenue');
        
        if (totalProductsEl) totalProductsEl.textContent = this.products.length;
        if (totalOrdersEl) totalOrdersEl.textContent = this.orders.length;
        
        // Calculate total revenue from PAID orders only
        const totalRevenue = this.orders
            .filter(order => order.payment?.status === 'paid')
            .reduce((sum, order) => sum + (order.summary?.total || 0), 0);
        
        if (totalRevenueEl) totalRevenueEl.textContent = totalRevenue;
    }

    saveProducts() {
        localStorage.setItem('adminProducts', JSON.stringify(this.products));
        this.saveProductsToWebsite();
    }

    saveProductsToWebsite() {
        localStorage.setItem('websiteProducts', JSON.stringify(this.products));
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
}


// Tab navigation
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.admin-nav li').forEach(item => {
        item.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

     // ✅ ADD THIS: When returns tab is clicked, refresh return requests
    if (tabName === 'returns') {
        console.log('🔄 Loading return requests...');
        if (typeof adminPanel !== 'undefined' && adminPanel.loadReturnRequests) {
            adminPanel.loadReturnRequests();
        }
    }
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin-login.html';
}

// Initialize admin panel
const adminPanel = new AdminPanel();


// Admin panel me Supabase integration
async function addProductToSupabase(productData) {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select();

        if (error) throw error;
        
        console.log('✅ Product added to Supabase:', data);
        return data[0];

    } catch (error) {
        console.error('Error adding product to Supabase:', error);
        return null;
    }
}

// Existing addProduct function update karo
async function addProduct(formData) {
    const product = {
        name: formData.get('productName'),
        category: formData.get('productCategory'),
        price: parseFloat(formData.get('productPrice')),
        original_price: parseFloat(formData.get('originalPrice')) || parseFloat(formData.get('productPrice')),
        discount: parseInt(formData.get('productDiscount')) || 0,
        image_url: formData.get('productImage'),
        description: formData.get('productDescription'),
        features: formData.get('productFeatures').split('\n').filter(f => f.trim()),
        specifications: JSON.parse(formData.get('productSpecs') || '{}'),
        rating: 4.0,
        is_active: true
    };

    // Supabase me save karo
    const result = await addProductToSupabase(product);
    
    if (result) {
        showNotification('Product added to database!', 'success');
    } else {
        showNotification('Error adding product', 'error');
    }
}

// Image upload function for Supabase Storage
async function uploadProductImage(file) {
    try {
        console.log('📤 Uploading image to Supabase Storage...');
        
        // Unique filename create karo
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        
        // Supabase storage me upload karo
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);
        
        if (error) throw error;
        
        // Public URL get karo
        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
        
        console.log('✅ Image uploaded:', publicUrl);
        return publicUrl;
        
    } catch (error) {
        console.error('❌ Image upload failed:', error);
        return null;
    }
}

// Updated addProduct function
async function addProduct(formData) {
    const imageFile = formData.get('productImageFile');
    
    let imageUrl = '';
    
    // Agar new image upload ki hai
    if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadProductImage(imageFile);
    } else {
        // Ya phir existing URL use karo
        imageUrl = formData.get('productImageUrl') || 'images/placeholder.jpg';
    }
    
    const product = {
        name: formData.get('productName'),
        category: formData.get('productCategory'),
        price: parseFloat(formData.get('productPrice')),
        original_price: parseFloat(formData.get('originalPrice')) || parseFloat(formData.get('productPrice')),
        discount: parseInt(formData.get('productDiscount')) || 0,
        image_url: imageUrl,  // ✅ Cloud URL ya local URL
        description: formData.get('productDescription'),
        features: formData.get('productFeatures').split('\n').filter(f => f.trim()),
        specifications: JSON.parse(formData.get('productSpecs') || '{}'),
        rating: 4.0,
        is_active: true
    };

    // Supabase me save karo
    const result = await addProductToSupabase(product);
    
    if (result) {
        showNotification('Product added to database!', 'success');
    } else {
        showNotification('Error adding product', 'error');
    }
}