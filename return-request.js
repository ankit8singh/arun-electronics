// return-request.js
console.log('📦 Return Request System Loading...');

class ReturnRequestSystem {
    constructor() {
        this.currentOrder = null;
        this.selectedItems = [];
        this.init();
    }

    init() {
        console.log('🔧 Initializing return request system...');
        this.setupEventListeners();
        this.setupReasonSelection();
        
        // Navigation initialize karo
        if (typeof initNavigation === 'function') {
            initNavigation();
        }
    }

    setupEventListeners() {
        // Form submission
        const returnForm = document.getElementById('returnRequestForm');
        if (returnForm) {
            returnForm.addEventListener('submit', (e) => this.handleReturnSubmit(e));
        }

        // Reason selection
        document.querySelectorAll('.reason-option').forEach(option => {
            option.addEventListener('click', (e) => this.handleReasonSelection(e));
        });
    }

    setupReasonSelection() {
        document.querySelectorAll('.reason-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.reason-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                this.querySelector('input').checked = true;
            });
        });
    }

    // Order search function
    searchOrder() {
        const orderId = document.getElementById('orderSearch').value.trim();
        if (!orderId) {
            alert('Please enter an Order ID');
            return;
        }

        console.log('🔍 Searching for order:', orderId);
        
        const orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
        this.currentOrder = orders.find(order => order.orderId === orderId);

        if (this.currentOrder) {
            this.displayOrderDetails();
            this.displayOrderItems();
            this.updateRefundSummary();
        } else {
            alert('Order not found. Please check the Order ID and try again.');
        }
    }

    displayOrderDetails() {
        const orderDetails = document.getElementById('orderDetails');
        const order = this.currentOrder;

        orderDetails.innerHTML = `
            <div class="order-info">
                <h4>Order #${order.orderId}</h4>
                <p><strong>Date:</strong> ${order.date}</p>
                <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.phone})</p>
                <p><strong>Status:</strong> <span class="status ${order.status}">${order.status}</span></p>
                <p><strong>Total Amount:</strong> ₹${order.summary.total}</p>
            </div>
        `;
        orderDetails.style.display = 'block';
    }

    displayOrderItems() {
        const itemsList = document.getElementById('orderItemsList');
        const order = this.currentOrder;

        let html = '';
        order.items.forEach((item, index) => {
            html += `
                <div class="order-item-select">
                    <input type="checkbox" id="item-${index}" value="${index}" onchange="returnSystem.handleItemSelection(this)">
                    <label for="item-${index}">
                        <strong>${item.name}</strong> - Qty: ${item.quantity} - ₹${item.total}
                    </label>
                </div>
            `;
        });

        itemsList.innerHTML = html;
        this.selectedItems = []; // Reset selection
    }

    handleItemSelection(checkbox) {
        const itemIndex = parseInt(checkbox.value);
        
        if (checkbox.checked) {
            this.selectedItems.push(itemIndex);
        } else {
            this.selectedItems = this.selectedItems.filter(index => index !== itemIndex);
        }
        
        console.log('Selected items:', this.selectedItems);
        this.updateRefundSummary();
    }

    handleReasonSelection(event) {
        // Reason already handled by setupReasonSelection
        this.updateRefundSummary();
    }

    updateRefundSummary() {
        const refundSummary = document.getElementById('refundSummary');
        
        if (!this.currentOrder || this.selectedItems.length === 0) {
            refundSummary.innerHTML = '<p>Select items and reason to see refund details</p>';
            return;
        }

        const selectedReason = document.querySelector('input[name="returnReason"]:checked');
        if (!selectedReason) {
            refundSummary.innerHTML = '<p>Please select a return reason</p>';
            return;
        }

        // Calculate refund amount
        let totalRefund = 0;
        let refundItems = [];

        this.selectedItems.forEach(index => {
            const item = this.currentOrder.items[index];
            totalRefund += item.total;
            refundItems.push(`${item.name} (₹${item.total})`);
        });

        // Delivery charges logic
        const deliveryRefund = this.selectedItems.length === this.currentOrder.items.length ? 
                              this.currentOrder.summary.delivery : 0;

        const finalRefund = totalRefund + deliveryRefund;

        refundSummary.innerHTML = `
            <h4>Refund Calculation</h4>
            <p><strong>Items to Return:</strong> ${refundItems.join(', ')}</p>
            <p><strong>Items Refund:</strong> ₹${totalRefund}</p>
            ${deliveryRefund > 0 ? `<p><strong>Delivery Charges Refund:</strong> ₹${deliveryRefund}</p>` : ''}
            <p><strong>Total Refund Amount:</strong> ₹${finalRefund}</p>
            <p><strong>Refund Method:</strong> Original Payment Method</p>
            <p style="color: #666; font-size: 0.9rem; margin-top: 10px;">
                Refund will be processed within 3-5 business days after we receive the items.
            </p>
        `;
    }

    async handleReturnSubmit(event) {
        event.preventDefault();
        console.log('📝 Handling return request submission...');

        // Validation
        if (!this.currentOrder) {
            alert('Please search and select an order first');
            return;
        }

        if (this.selectedItems.length === 0) {
            alert('Please select at least one item to return');
            return;
        }

        const selectedReason = document.querySelector('input[name="returnReason"]:checked');
        if (!selectedReason) {
            alert('Please select a return reason');
            return;
        }

        const additionalNotes = document.getElementById('additionalNotes').value;

        // Create return request
        const returnRequest = {
            returnId: 'RET-' + Date.now(),
            orderId: this.currentOrder.orderId,
            customer: this.currentOrder.customer,
            items: this.selectedItems.map(index => this.currentOrder.items[index]),
            reason: selectedReason.value,
            additionalNotes: additionalNotes,
            status: 'requested',
            requestedAt: new Date().toISOString(),
            requestedDate: new Date().toLocaleString('en-IN'),
            refundAmount: this.calculateRefundAmount(),
            adminNotes: '',
            resolution: '',
            resolvedAt: null
        };

        console.log('📦 Return request created:', returnRequest);

        // Save return request
        this.saveReturnRequest(returnRequest);

        // Show success message
        this.showSuccessMessage(returnRequest);

        // Reset form
        setTimeout(() => {
            this.resetForm();
        }, 3000);
    }

    calculateRefundAmount() {
        let totalRefund = 0;
        this.selectedItems.forEach(index => {
            totalRefund += this.currentOrder.items[index].total;
        });

        // Full order return = delivery charges bhi refund
        if (this.selectedItems.length === this.currentOrder.items.length) {
            totalRefund += this.currentOrder.summary.delivery;
        }

        return totalRefund;
    }

    saveReturnRequest(returnRequest) {
        const returnRequests = JSON.parse(localStorage.getItem('returnRequests')) || [];
        returnRequests.push(returnRequest);
        localStorage.setItem('returnRequests', JSON.stringify(returnRequests));
        
        console.log('💾 Return request saved to localStorage');
        console.log('Total return requests:', returnRequests.length);
    }

    showSuccessMessage(returnRequest) {
        // Hide form
        document.getElementById('returnRequestForm').style.display = 'none';
        
        // Show success message
        const successHTML = `
            <div class="success-message" style="text-align: center; padding: 40px;">
                <div style="font-size: 4rem; color: #27ae60; margin-bottom: 20px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 style="color: #27ae60; margin-bottom: 15px;">Return Request Submitted Successfully!</h2>
                <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <p><strong>Return ID:</strong> ${returnRequest.returnId}</p>
                    <p><strong>Order ID:</strong> ${returnRequest.orderId}</p>
                    <p><strong>Estimated Refund:</strong> ₹${returnRequest.refundAmount}</p>
                    <p><strong>Status:</strong> <span style="color: #f39c12;">Pending Approval</span></p>
                </div>
                <p style="color: #666; margin-bottom: 20px;">
                    We have received your return request. Our team will review it and contact you within 24 hours.
                </p>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn" onclick="window.location.href='order-history.html'">
                        <i class="fas fa-history"></i> View Order History
                    </button>
                    <button class="btn btn-outline" onclick="returnSystem.resetForm()">
                        <i class="fas fa-undo"></i> Submit Another Return
                    </button>
                    <a href="https://wa.me/919084984045?text=Return%20Request%20${returnRequest.returnId}" 
                       class="btn" target="_blank">
                        <i class="fab fa-whatsapp"></i> Get Help on WhatsApp
                    </a>
                </div>
            </div>
        `;

        document.querySelector('.return-form').innerHTML = successHTML;
    }

    resetForm() {
        // Reload the page for fresh start
        window.location.reload();
    }
}

// Global functions for HTML onclick
function searchOrder() {
    if (typeof returnSystem !== 'undefined') {
        returnSystem.searchOrder();
    }
}

function handleItemSelection(checkbox) {
    if (typeof returnSystem !== 'undefined') {
        returnSystem.handleItemSelection(checkbox);
    }
}

// Initialize return system
const returnSystem = new ReturnRequestSystem();