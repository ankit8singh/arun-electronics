// auth.js - Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupEventListeners();
        this.updateUI();
    }

    // Load current user from localStorage
    loadCurrentUser() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log('👤 Current user loaded:', this.currentUser);
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Password toggle
        this.setupPasswordToggle();
        
        // Password strength checker
        this.setupPasswordStrength();
    }

    // Handle login
    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me')?.checked;

        console.log('🔐 Login attempt:', { email, password, rememberMe });

        // Simple validation
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Login successful
            this.currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            };

            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

            // Remember me functionality
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            }

            this.showNotification('Login successful!', 'success');
            this.updateUI();

            // Redirect to previous page or home
            setTimeout(() => {
                const returnUrl = localStorage.getItem('returnUrl') || 'index.html';
                localStorage.removeItem('returnUrl');
                window.location.href = returnUrl;
            }, 1000);

        } else {
            this.showNotification('Invalid email or password', 'error');
        }
    }

    // Handle signup
    handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const phone = document.getElementById('signup-phone').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const agreeTerms = document.getElementById('agree-terms').checked;

        console.log('📝 Signup attempt:', { name, email, phone, password, confirmPassword, agreeTerms });

        // Validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        if (!agreeTerms) {
            this.showNotification('Please agree to the terms and conditions', 'error');
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            this.showNotification('User with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            phone: phone,
            password: password, // In real app, hash the password
            createdAt: new Date().toISOString(),
            orders: []
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after signup
        this.currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        this.showNotification('Account created successfully!', 'success');
        this.updateUI();

        // Redirect to home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    // Logout function
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showNotification('Logged out successfully', 'success');
        this.updateUI();
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Require login for protected actions
    requireLogin(action = 'perform this action', redirectUrl = null) {
        if (!this.isLoggedIn()) {
            // Save the current URL for redirect after login
            if (redirectUrl) {
                localStorage.setItem('returnUrl', redirectUrl);
            } else {
                localStorage.setItem('returnUrl', window.location.href);
            }
            
            this.showNotification(`Please login to ${action}`, 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return false;
        }
        return true;
    }

    // Update UI based on login status
    updateUI() {
        this.updateNavigation();
        this.updateProtectedElements();
    }

    // Update navigation menu
    updateNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;

        if (this.isLoggedIn()) {
            // User is logged in - show user menu
            navMenu.innerHTML = navMenu.innerHTML.replace(
                /<li><a href="login\.html".*?<\/li>/,
                this.getUserMenuHTML()
            );
        } else {
            // User is not logged in - show login/signup
            navMenu.innerHTML = navMenu.innerHTML.replace(
                /<li class="user-menu">.*?<\/li>/,
                '<li><a href="login.html">Login</a></li>'
            );
        }
    }

    // Get user menu HTML
    getUserMenuHTML() {
        return `
            <li class="user-menu">
                <a href="javascript:void(0)" class="user-dropdown">
                    <i class="fas fa-user"></i> ${this.currentUser.name}
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
    }

    // Update protected elements on page
    updateProtectedElements() {
        // Add to Cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            if (!this.isLoggedIn()) {
                button.onclick = (e) => {
                    e.preventDefault();
                    this.requireLogin('add items to cart', 'products.html');
                };
            }
        });

        // Buy Now buttons
        document.querySelectorAll('.buy-now').forEach(button => {
            if (!this.isLoggedIn()) {
                button.onclick = (e) => {
                    e.preventDefault();
                    this.requireLogin('buy products', 'products.html');
                };
            }
        });

        // Checkout button
        const checkoutBtn = document.querySelector('a[href="checkout.html"]');
        if (checkoutBtn && !this.isLoggedIn()) {
            checkoutBtn.onclick = (e) => {
                e.preventDefault();
                this.requireLogin('checkout', 'cart.html');
            };
        }

        // My Orders link
        const ordersLink = document.querySelector('a[href="order-history.html"]');
        if (ordersLink && !this.isLoggedIn()) {
            ordersLink.onclick = (e) => {
                e.preventDefault();
                this.requireLogin('view order history');
            };
        }
    }

    // Password toggle functionality
    setupPasswordToggle() {
        const togglePassword = document.getElementById('toggle-password');
        const toggleSignupPassword = document.getElementById('toggle-signup-password');
        const toggleConfirmPassword = document.getElementById('toggle-confirm-password');

        [togglePassword, toggleSignupPassword, toggleConfirmPassword].forEach(toggle => {
            if (toggle) {
                toggle.addEventListener('click', function() {
                    const input = this.parentElement.previousElementSibling;
                    const type = input.type === 'password' ? 'text' : 'password';
                    input.type = type;
                    this.classList.toggle('fa-eye');
                    this.classList.toggle('fa-eye-slash');
                });
            }
        });
    }

    // Password strength checker
    setupPasswordStrength() {
        const passwordInput = document.getElementById('signup-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', this.checkPasswordStrength);
        }
    }

    checkPasswordStrength() {
        const password = this.value;
        const strengthBar = document.getElementById('password-strength');
        const strengthText = document.getElementById('password-text');

        if (!strengthBar || !strengthText) return;

        let strength = 0;
        let text = 'Weak';
        let color = '#e74c3c';

        // Check password strength
        if (password.length >= 6) strength += 25;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
        if (password.match(/\d/)) strength += 25;
        if (password.match(/[^a-zA-Z\d]/)) strength += 25;

        // Update UI
        strengthBar.style.width = strength + '%';

        if (strength >= 75) {
            text = 'Strong';
            color = '#27ae60';
        } else if (strength >= 50) {
            text = 'Medium';
            color = '#f39c12';
        } else {
            text = 'Weak';
            color = '#e74c3c';
        }

        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }

    // Social login functions (placeholder)
    loginWithGoogle() {
        this.showNotification('Google login coming soon!', 'info');
    }

    loginWithFacebook() {
        this.showNotification('Facebook login coming soon!', 'info');
    }

    loginWithInstagram() {
        this.showNotification('Instagram login coming soon!', 'info');
    }

    signupWithGoogle() {
        this.showNotification('Google signup coming soon!', 'info');
    }

    signupWithFacebook() {
        this.showNotification('Facebook signup coming soon!', 'info');
    }

    signupWithInstagram() {
        this.showNotification('Instagram signup coming soon!', 'info');
    }

    // Show notification
    showNotification(message, type = 'info') {
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
}

// Initialize auth system
const auth = new AuthSystem();

// Make auth globally available
window.auth = auth;