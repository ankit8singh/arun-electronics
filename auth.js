// Authentication System for Arn Electric Solutions

// User management
let users = JSON.parse(localStorage.getItem('arn_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('arn_current_user')) || null;

// Initialize auth system
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
    checkAuthState();
});

// Initialize authentication
function initAuth() {
    // Password toggle functionality
    initPasswordToggles();
    
    // Form submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        initPasswordStrength();
    }
    
    // Update navigation based on auth state
    updateNavigation();
}

// Check authentication state on page load
function checkAuthState() {
    const protectedPages = ['services.html', 'products.html', 'gallery.html', 'about.html', 'contact.html', 'cart.html', 'checkout.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    // If user is not logged in and trying to access protected page, redirect to login
    if (!currentUser && protectedPages.includes(currentPage) && currentPage !== 'index.html') {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(currentPage);
        return;
    }
    
    // If user is logged in and on auth pages, redirect to home
    if (currentUser && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        window.location.href = 'index.html';
    }
}

// Update navigation based on auth state
function updateNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    if (currentUser) {
        // User is logged in
        navMenu.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="products.html">Products</a></li>
            <li><a href="gallery.html">Gallery</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
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
        // User is not logged in
        navMenu.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="login.html">Login</a></li>
            <li><a href="signup.html">Sign Up</a></li>
        `;
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login successful
        currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            loginMethod: 'email'
        };
        
        localStorage.setItem('arn_current_user', JSON.stringify(currentUser));
        
        // Show success message
        showNotification('Login successful!', 'success');
        
        // Redirect to intended page or home
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect') || 'index.html';
        
        setTimeout(() => {
            window.location.href = redirectTo;
        }, 1000);
        
    } else {
        // Login failed
        showNotification('Invalid email or password', 'error');
    }
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        createdAt: new Date().toISOString(),
        loginMethod: 'email'
    };
    
    users.push(newUser);
    localStorage.setItem('arn_users', JSON.stringify(users));
    
    // Auto login
    currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        loginMethod: 'email'
    };
    
    localStorage.setItem('arn_current_user', JSON.stringify(currentUser));
    
    showNotification('Account created successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Social Login Functions (Demo - in real app, use proper OAuth)
function loginWithGoogle() {
    showNotification('Google login would be implemented with OAuth', 'info');
    // Simulate successful login
    simulateSocialLogin('Google');
}

function loginWithFacebook() {
    showNotification('Facebook login would be implemented with OAuth', 'info');
    // Simulate successful login
    simulateSocialLogin('Facebook');
}

function loginWithInstagram() {
    showNotification('Instagram login would be implemented with OAuth', 'info');
    // Simulate successful login
    simulateSocialLogin('Instagram');
}

function signupWithGoogle() {
    showNotification('Google signup would be implemented with OAuth', 'info');
    // Simulate successful signup
    simulateSocialSignup('Google');
}

function signupWithFacebook() {
    showNotification('Facebook signup would be implemented with OAuth', 'info');
    // Simulate successful signup
    simulateSocialSignup('Facebook');
}

function signupWithInstagram() {
    showNotification('Instagram signup would be implemented with OAuth', 'info');
    // Simulate successful signup
    simulateSocialSignup('Instagram');
}

// Simulate social login (for demo)
function simulateSocialLogin(provider) {
    const socialUser = {
        id: 'social_' + Date.now(),
        name: 'User from ' + provider,
        email: `user@${provider.toLowerCase()}.com`,
        phone: '+91 XXXXX XXXXX',
        loginMethod: provider.toLowerCase()
    };
    
    // Check if user exists, if not create
    let user = users.find(u => u.email === socialUser.email);
    if (!user) {
        user = {
            ...socialUser,
            password: 'social_auth',
            createdAt: new Date().toISOString()
        };
        users.push(user);
        localStorage.setItem('arn_users', JSON.stringify(users));
    }
    
    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        loginMethod: user.loginMethod
    };
    
    localStorage.setItem('arn_current_user', JSON.stringify(currentUser));
    
    showNotification(`Logged in with ${provider}`, 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Simulate social signup (for demo)
function simulateSocialSignup(provider) {
    const socialUser = {
        id: 'social_' + Date.now(),
        name: `New User from ${provider}`,
        email: `newuser@${provider.toLowerCase()}.com`,
        phone: '+91 XXXXX XXXXX',
        loginMethod: provider.toLowerCase()
    };
    
    // Create new user
    const newUser = {
        ...socialUser,
        password: 'social_auth',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('arn_users', JSON.stringify(users));
    
    currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        loginMethod: newUser.loginMethod
    };
    
    localStorage.setItem('arn_current_user', JSON.stringify(currentUser));
    
    showNotification(`Account created with ${provider}`, 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('arn_current_user');
    showNotification('Logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Password strength checker
function initPasswordStrength() {
    const passwordInput = document.getElementById('signup-password');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        const strengthBar = document.getElementById('password-strength');
        const strengthText = document.getElementById('password-text');
        
        if (strengthBar && strengthText) {
            strengthBar.style.width = strength.percentage + '%';
            strengthBar.className = 'strength-fill ' + strength.class;
            strengthText.textContent = strength.text;
            strengthText.className = 'strength-text ' + strength.class;
        }
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score += 25;
    if (password.match(/\d/)) score += 25;
    if (password.match(/[^a-zA-Z\d]/)) score += 25;
    
    if (score >= 75) return { percentage: 100, class: 'strong', text: 'Strong' };
    if (score >= 50) return { percentage: 75, class: 'good', text: 'Good' };
    if (score >= 25) return { percentage: 50, class: 'fair', text: 'Fair' };
    return { percentage: 25, class: 'weak', text: 'Weak' };
}

// Password toggle functionality
function initPasswordToggles() {
    // Login page password toggle
    const loginToggle = document.getElementById('toggle-password');
    if (loginToggle) {
        loginToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('login-password');
            togglePasswordVisibility(passwordInput, this);
        });
    }
    
    // Signup page password toggles
    const signupToggle = document.getElementById('toggle-signup-password');
    const confirmToggle = document.getElementById('toggle-confirm-password');
    
    if (signupToggle) {
        signupToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('signup-password');
            togglePasswordVisibility(passwordInput, this);
        });
    }
    
    if (confirmToggle) {
        confirmToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('signup-confirm-password');
            togglePasswordVisibility(passwordInput, this);
        });
    }
}

function togglePasswordVisibility(input, icon) {
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
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
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// User profile functions (stubs for future implementation)
function viewProfile() {
    showNotification('Profile page would be implemented', 'info');
}

function viewOrders() {
    showNotification('Order history would be implemented', 'info');
}

// Check if user is authenticated (for other pages)
function isAuthenticated() {
    return currentUser !== null;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}