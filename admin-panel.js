// Admin Panel Functionality with Complete Supabase Integration
class AdminPanel {
    constructor() {
        this.products = [];
        this.orders = [];
        this.returnRequests = [];
        this.init();
    }

    async init() {
        this.checkAuth();
        await this.loadProductsFromSupabase();
        await this.loadOrdersFromSupabase();
        await this.loadReturnRequestsFromSupabase();
        this.setupEventListeners();
        this.setupRealtimeSubscriptions();
        this.loadDashboard();
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

    // ✅ SUPABASE SE PRODUCTS LOAD KARO
    async loadProductsFromSupabase() {
        try {
            const { data: products, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.products = products || [];
            this.loadProducts();
            
        } catch (error) {
            console.error('Error loading products:', error);
            this.showNotification('Error loading products', 'error');
        }
    }

    // ✅ SUPABASE SE ORDERS LOAD KARO
    async loadOrdersFromSupabase() {
        try {
            const { data: orders, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.orders = orders || [];
            this.loadOrders();
            this.loadDashboard();
            
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showNotification('Error loading orders', 'error');
        }
    }

    // ✅ SUPABASE SE RETURN REQUESTS LOAD KARO
    async loadReturnRequestsFromSupabase() {
        try {
            const { data: returns, error } = await supabase
                .from('return_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.returnRequests = returns || [];
            this.loadReturnRequests();
            
        } catch (error) {
            console.error('Error loading return requests:', error);
        }
    }

    // ✅ REAL-TIME UPDATES SETUP KARO
    setupRealtimeSubscriptions() {
        // Orders ke liye real-time updates
        supabase
            .channel('orders-channel')
            .on('postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('🆕 New order received:', payload.new);
                    this.showNotification('🆕 New Order Received!', 'success');
                    this.loadOrdersFromSupabase();
                }
            )
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('📦 Order updated:', payload.new);
                    this.loadOrdersFromSupabase();
                }
            )
            .subscribe();

        // Return requests ke liye real-time updates
        supabase
            .channel('returns-channel')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'return_requests' },
                (payload) => {
                    console.log('🔄 New return request:', payload.new);
                    this.showNotification('🔄 New Return Request!', 'info');
                    this.loadReturnRequestsFromSupabase();
                }
            )
            .subscribe();
    }

    // ✅ PRODUCT ADD KARO (Supabase mein)
    async addProduct() {
        try {
            const formData = new FormData(document.getElementById('addProductForm'));
            
            const productData = {
                name: formData.get('productName'),
                category: formData.get('productCategory'),
                price: parseFloat(formData.get('productPrice')),
                original_price: parseFloat(formData.get('originalPrice')) || parseFloat(formData.get('productPrice')),
                discount: parseInt(formData.get('productDiscount')) || 0,
                image_url: formData.get('productImageUrl') || 'images/placeholder.jpg',
                description: formData.get('productDescription'),
                features: formData.get('productFeatures').split('\n').filter(f => f.trim()),
                specifications: this.parseSpecifications(formData.get('productSpecs')),
                rating: 4.0,
                is_active: true,
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('products')
                .insert([productData])
                .select();

            if (error) throw error;

            this.showNotification('Product added successfully!', 'success');
            await this.loadProductsFromSupabase();
            document.getElementById('addProductForm').reset();
            
        } catch (error) {
            console.error('Error adding product:', error);
            this.showNotification('Error adding product', 'error');
        }
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

    async editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('originalPrice').value = product.original_price;
            document.getElementById('productDiscount').value = product.discount;
            document.getElementById('productImageUrl').value = product.image_url;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productFeatures').value = product.features.join('\n');
            document.getElementById('productSpecs').value = JSON.stringify(product.specifications, null, 2);
            
            showTab('addProduct');
            
            // Delete the product from Supabase when editing
            await this.deleteProductFromSupabase(productId);
            
            document.querySelector('#addProductForm button').innerHTML = '<i class="fas fa-save"></i> Update Product';
            
            this.showNotification('Product loaded for editing. Update and save changes.', 'info');
        }
    }

    async deleteProductFromSupabase(productId) {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId);

            if (error) throw error;
            
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    async deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', productId);

                if (error) throw error;

                await this.loadProductsFromSupabase();
                this.loadDashboard();
                this.showNotification('Product deleted successfully!', 'success');
                
            } catch (error) {
                console.error('Error deleting product:', error);
                this.showNotification('Error deleting product', 'error');
            }
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
            const paymentStatus = order.payment_status || 'pending';
            const totalAmount = order.total_amount || 0;

            html += `
                <div class="order-card" data-status="${orderStatus}" data-payment="${paymentStatus}">
                    <div class="order-header">
                        <div class="order-info">
                            <h4>Order #${order.order_id}</h4>
                            <div class="order-meta">
                                <span class="customer">${order.customer_name} • ${order.customer_phone}</span>
                                <span class="date">${new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div class="order-amount">
                            <strong>₹${totalAmount}</strong>
                        </div>
                    </div>
                    
                    <div class="order-details">
                        <div class="order-items-preview">
                            ${order.items ? order.items.map(item => 
                                `${item.name} (Qty: ${item.quantity})`
                            ).join(', ') : 'No items'}
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
                        
                        ${paymentStatus === 'pending' && order.payment_method !== 'Cash on Delivery' ? `
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
                    <h2>Order Details - ${order.order_id}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="details-grid">
                        <div class="detail-section">
                            <h3>Customer Information</h3>
                            <div class="detail-item">
                                <label>Name:</label>
                                <span>${order.customer_name}</span>
                            </div>
                            <div class="detail-item">
                                <label>Phone:</label>
                                <span>${order.customer_phone}</span>
                            </div>
                            ${order.customer_email ? `
                            <div class="detail-item">
                                <label>Email:</label>
                                <span>${order.customer_email}</span>
                            </div>
                            ` : ''}
                            <div class="detail-item">
                                <label>Address:</label>
                                <span>${order.customer_address}, ${order.customer_pincode}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Order Information</h3>
                            <div class="detail-item">
                                <label>Order Date:</label>
                                <span>${new Date(order.created_at).toLocaleString()}</span>
                            </div>
                            <div class="detail-item">
                                <label>Payment Method:</label>
                                <span>${order.payment_method || 'Cash on Delivery'}</span>
                            </div>
                            <div class="detail-item">
                                <label>Status:</label>
                                <span class="status-badge ${order.status || 'pending'}">
                                    ${this.formatStatus(order.status || 'pending')}
                                </span>
                            </div>
                            <div class="detail-item">
                                <label>Payment Status:</label>
                                <span class="payment-badge ${order.payment_status || 'pending'}">
                                    ${this.formatPaymentStatus(order.payment_status || 'pending')}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="order-items-details">
                        <h3>Order Items</h3>
                        ${order.items ? order.items.map(item => `
                            <div class="order-item-detail">
                                <div class="item-info">
                                    <strong>${item.name}</strong>
                                    <div>₹${item.price} × ${item.quantity} = ₹${item.total}</div>
                                </div>
                            </div>
                        `).join('') : 'No items found'}
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
                            <span>₹${order.total_amount || 0}</span>
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
                        
                        ${order.payment_status === 'pending' && order.payment_method !== 'Cash on Delivery' ? `
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

    // ✅ ORDER STATUS UPDATE KARO (Supabase mein)
    async updateOrderStatus(orderIndex, newStatus) {
        try {
            const order = this.orders[orderIndex];
            if (!order) return;

            const { error } = await supabase
                .from('orders')
                .update({ 
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', order.id);

            if (error) throw error;

            this.showNotification(`Order status updated to: ${this.formatStatus(newStatus)}`, 'success');
            
        } catch (error) {
            console.error('Error updating order:', error);
            this.showNotification('Error updating order status', 'error');
        }
    }

    // ✅ PAYMENT STATUS UPDATE KARO (Supabase mein)
    async markPaymentPaid(orderIndex) {
        try {
            const order = this.orders[orderIndex];
            if (!order) return;

            const { error } = await supabase
                .from('orders')
                .update({ 
                    payment_status: 'paid',
                    updated_at: new Date().toISOString()
                })
                .eq('id', order.id);

            if (error) throw error;

            this.showNotification('Payment marked as paid', 'success');
            
        } catch (error) {
            console.error('Error updating payment:', error);
            this.showNotification('Error updating payment status', 'error');
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

    // ✅ RETURN REQUEST MANAGEMENT
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

    loadReturnRequests() {
        const returnsList = document.getElementById('returnsList');
        if (!returnsList) return;

        if (this.returnRequests.length === 0) {
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
        this.returnRequests.forEach((returnReq, index) => {
            const status = returnReq.status || 'requested';
            
            html += `
                <div class="return-card" data-status="${status}">
                    <div class="return-header">
                        <div class="return-info">
                            <h4>Return Request #RT${returnReq.return_id}</h4>
                            <div class="return-meta">
                                <span class="order-ref">Order: ${returnReq.order_id}</span>
                                <span class="customer">${returnReq.customer_name} • ${returnReq.customer_phone}</span>
                                <span class="date">Requested: ${new Date(returnReq.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div class="return-amount">
                            <strong>₹${returnReq.refund_amount || 0}</strong>
                        </div>
                    </div>
                    
                    <div class="return-details">
                        <div class="return-reason">
                            <strong>Reason:</strong> ${returnReq.reason}
                        </div>
                        <div class="return-items">
                            <strong>Items:</strong> ${returnReq.items ? returnReq.items.map(item => item.name).join(', ') : 'No items'}
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

    viewReturnDetails(returnIndex) {
        const returnReq = this.returnRequests[returnIndex];
        if (!returnReq) return;

        const modal = this.createReturnDetailsModal(returnReq, returnIndex);
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    createReturnDetailsModal(returnReq, returnIndex) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>Return Request #RT${returnReq.return_id}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="details-grid">
                        <div class="detail-section">
                            <h3>Customer Information</h3>
                            <div class="detail-item">
                                <label>Name:</label>
                                <span>${returnReq.customer_name}</span>
                            </div>
                            <div class="detail-item">
                                <label>Phone:</label>
                                <span>${returnReq.customer_phone}</span>
                            </div>
                            <div class="detail-item">
                                <label>Order ID:</label>
                                <span>${returnReq.order_id}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Return Information</h3>
                            <div class="detail-item">
                                <label>Request Date:</label>
                                <span>${new Date(returnReq.created_at).toLocaleString()}</span>
                            </div>
                            <div class="detail-item">
                                <label>Reason:</label>
                                <span>${returnReq.reason}</span>
                            </div>
                            <div class="detail-item">
                                <label>Refund Amount:</label>
                                <span>₹${returnReq.refund_amount || 0}</span>
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
                        ${returnReq.items ? returnReq.items.map(item => `
                            <div class="return-item-detail">
                                <div class="item-info">
                                    <strong>${item.name}</strong>
                                    <div>Qty: ${item.quantity} • Amount: ₹${item.amount}</div>
                                </div>
                            </div>
                        `).join('') : 'No items found'}
                    </div>
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

    async updateReturnStatus(returnIndex, newStatus) {
        try {
            const returnReq = this.returnRequests[returnIndex];
            if (!returnReq) return;

            const { error } = await supabase
                .from('return_requests')
                .update({ 
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', returnReq.id);

            if (error) throw error;

            await this.loadReturnRequestsFromSupabase();
            this.showNotification(`Return request ${this.getReturnStatusTypes()[newStatus]}`, 'success');
            
        } catch (error) {
            console.error('Error updating return status:', error);
            this.showNotification('Error updating return status', 'error');
        }
    }

    async processRefund(returnIndex) {
        try {
            const returnReq = this.returnRequests[returnIndex];
            if (!returnReq) return;

            const { error } = await supabase
                .from('return_requests')
                .update({ 
                    status: 'refunded',
                    updated_at: new Date().toISOString()
                })
                .eq('id', returnReq.id);

            if (error) throw error;

            await this.loadReturnRequestsFromSupabase();
            this.showNotification(`Refund of ₹${returnReq.refund_amount} processed successfully`, 'success');
            
        } catch (error) {
            console.error('Error processing refund:', error);
            this.showNotification('Error processing refund', 'error');
        }
    }

    filterReturns() {
        const statusFilter = document.getElementById('return-status-filter').value;
        
        const returnCards = document.querySelectorAll('.return-card');
        returnCards.forEach(card => {
            const returnStatus = card.dataset.status;
            const statusMatch = statusFilter === 'all' || returnStatus === statusFilter;
            card.style.display = statusMatch ? 'block' : 'none';
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

    // ✅ DASHBOARD DATA CALCULATE KARO
    loadDashboard() {
        const totalProductsEl = document.getElementById('totalProducts');
        const totalOrdersEl = document.getElementById('totalOrders');
        const totalRevenueEl = document.getElementById('totalRevenue');
        
        if (totalProductsEl) totalProductsEl.textContent = this.products.length;
        if (totalOrdersEl) totalOrdersEl.textContent = this.orders.length;
        
        // Calculate total revenue from PAID orders only
        const totalRevenue = this.orders
            .filter(order => order.payment_status === 'paid')
            .reduce((sum, order) => sum + (order.total_amount || 0), 0);
        
        if (totalRevenueEl) totalRevenueEl.textContent = totalRevenue;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
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

    // When returns tab is clicked, refresh return requests
    if (tabName === 'returns') {
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