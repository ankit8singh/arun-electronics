// order-history.js
console.log('📋 Loading order history...');

class OrderHistory {
    constructor() {
        this.userId = null;
        this.orders = [];
        this.init();
    }

    init() {
        console.log('🔧 Initializing order history...');
        
        // Check if user is logged in
        if (typeof auth === 'undefined' || !auth.isLoggedIn()) {
            this.showLoginRequired();
            return;
        }
        
        this.userId = auth.currentUser.id;
        this.loadUserOrders();
        this.initNavigation();
    }

    // Load user's orders
    loadUserOrders() {
        console.log('📥 Loading orders for user:', this.userId);
        
        const userOrders = JSON.parse(localStorage.getItem('userOrders')) || {};
        this.orders = userOrders[this.userId] || [];
        
        console.log(`✅ Loaded ${this.orders.length} orders for user`);
        this.renderOrders();
    }

    // Render orders in the table
    renderOrders() {
        const ordersContainer = document.getElementById('orders-container');
        const emptyState = document.getElementById('empty-orders');
        
        if (!ordersContainer) return;

        if (this.orders.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            ordersContainer.innerHTML = '';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        // Sort orders by date (newest first)
        const sortedOrders = this.orders.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        let html = '';
        sortedOrders.forEach(order => {
            const statusClass = this.getStatusClass(order.status);
            const paymentStatus = order.payment.status === 'paid' ? 'Paid' : 'Pending';
            
            html += `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-info">
                            <h3>Order #${order.orderId}</h3>
                            <span class="order-date">${order.date}</span>
                        </div>
                        <div class="order-status">
                            <span class="status-badge ${statusClass}">${order.status}</span>
                            <span class="payment-status">${paymentStatus}</span>
                        </div>
                    </div>
                    
                    <div class="order-details">
                        <div class="order-items">
                            <strong>Items:</strong>
                            ${order.items.map(item => 
                                `${item.name} (Qty: ${item.quantity})`
                            ).join(', ')}
                        </div>
                        
                        <div class="order-summary">
                            <div class="summary-item">
                                <span>Subtotal:</span>
                                <span>₹${order.summary.subtotal}</span>
                            </div>
                            <div class="summary-item">
                                <span>Delivery:</span>
                                <span>₹${order.summary.delivery}</span>
                            </div>
                            <div class="summary-item total">
                                <span>Total:</span>
                                <span>₹${order.summary.total}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="order-footer">
                        <div class="customer-info">
                            <strong>Delivery to:</strong> ${order.customer.name} | ${order.customer.phone}
                        </div>
                        <div class="order-actions">
                            <button class="btn btn-outline" onclick="viewOrderDetails('${order.orderId}')">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            <button class="btn btn-outline" onclick="trackOrder('${order.orderId}')">
                                <i class="fas fa-map-marker-alt"></i> Track Order
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        ordersContainer.innerHTML = html;
    }

    // Get CSS class for order status
    getStatusClass(status) {
        const statusMap = {
            'pending': 'status-pending',
            'confirmed': 'status-confirmed',
            'shipped': 'status-shipped',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        return statusMap[status] || 'status-pending';
    }

    // Show login required message
    showLoginRequired() {
        const ordersContainer = document.getElementById('orders-container');
        if (ordersContainer) {
            ordersContainer.innerHTML = `
                <div class="login-required">
                    <i class="fas fa-user-lock" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                    <h3>Login Required</h3>
                    <p>Please login to view your order history</p>
                    <a href="login.html" class="btn" style="margin-top: 20px;">
                        <i class="fas fa-sign-in-alt"></i> Login Now
                    </a>
                </div>
            `;
        }
    }

    // Initialize navigation
    initNavigation() {
        if (typeof initNavigation === 'function') {
            initNavigation();
        }
    }
}

// View order details
function viewOrderDetails(orderId) {
    console.log('🔍 Viewing order details:', orderId);
    // You can implement a detailed order view modal here
    alert(`Order Details for: ${orderId}\n\nDetailed view coming soon!`);
}

// Track order
function trackOrder(orderId) {
    console.log('📍 Tracking order:', orderId);
    alert(`Order Tracking for: ${orderId}\n\nTracking feature coming soon!`);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    new OrderHistory();
});