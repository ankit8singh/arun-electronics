// footer-component.js
class FooterComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-column">
                        <h3>Arun Electric Solutions</h3>
                        <p>Your trusted partner for all electrical needs</p>
                        <div class="social-links">
                            <a href="#"><i class="fab fa-facebook-f"></i></a>
                            <a href="#"><i class="fab fa-instagram"></i></a>
                            <a href="https://wa.me/919084984045"><i class="fab fa-whatsapp"></i></a>
                        </div>
                    </div>
                    <div class="footer-column">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="services.html">Services</a></li>
                            <li><a href="products.html">Products</a></li>
                            <li><a href="gallery.html">Gallery</a></li>
                            <li><a href="about.html">About</a></li>
                            <li><a href="contact.html">Contact</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>Contact Info</h3>
                        <ul>
                            <li><i class="fas fa-map-marker-alt"></i> Nehtaur, Bijnor, India</li>
                            <li><i class="fas fa-phone"></i> +91 9084984045</li>
                            <li><i class="fas fa-envelope"></i> info@arnelectric.com</li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>Opening Hours</h3>
                        <ul>
                            <li>Mon-Sat: 9:00 AM - 8:00 PM</li>
                            <li>Sunday: 10:00 AM - 6:00 PM</li>
                            <li class="emergency">Emergency: 24/7 Available</li>
                        </ul>
                    </div>
                </div>
                <div class="copyright">
                    <p>&copy; 2025 Arun Electric Solutions. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
        
        <!-- Sticky Call Button -->
        <a href="tel:+919084984045" class="sticky-call">
            <i class="fas fa-phone"></i>
        </a>
        `;
    }
}

// Register custom element
customElements.define('footer-component', FooterComponent);