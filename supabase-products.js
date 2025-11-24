// supabase-products.js
console.log('🎯 supabase-products.js LOADED!');

// Safety check - wait for supabase to load
function initializeSupabaseProducts() {
    console.log('🔧 Initializing SupabaseProducts...');
    
    class SupabaseProducts {
        constructor() {
            console.log('🏗️ SupabaseProducts constructor called');
            
            if (typeof supabase === 'undefined') {
                console.warn('⚠️ Supabase client not available');
                this.client = null;
            } else {
                this.client = supabase;
                console.log('✅ SupabaseProducts initialized with client');
            }
        }

        // All products get karo
        async getAllProducts(category = 'all') {
            console.log(`📥 Getting products for category: ${category}`);
            
            // Agar Supabase available nahi hai
            if (!this.client) {
                console.log('🔄 Supabase not available, using local fallback');
                return this.getDefaultProducts();
            }

            try {
                let query = this.client
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .order('id', { ascending: true });

                // Agar category filter hai
                if (category !== 'all') {
                    query = query.eq('category', category);
                }

                const { data: products, error } = await query;

                if (error) {
                    console.error('❌ Supabase error:', error);
                    return this.getDefaultProducts();
                }

                console.log(`✅ ${products.length} products loaded from Supabase`);
                return products;
                
            } catch (error) {
                console.error('❌ Error loading products:', error);
                return this.getDefaultProducts();
            }
        }

        // Single product by ID
        async getProductById(productId) {
            console.log(`📥 Getting product by ID: ${productId}`);
            
            // Agar Supabase available nahi hai
            if (!this.client) {
                console.log('🔄 Supabase not available, using local fallback');
                const localProducts = this.getDefaultProducts();
                return localProducts.find(p => p.id === productId) || null;
            }

            try {
                const { data: product, error } = await this.client
                    .from('products')
                    .select('*')
                    .eq('id', productId)
                    .single();

                if (error) throw error;
                
                console.log('✅ Product found:', product?.name);
                return product;

            } catch (error) {
                console.error('❌ Error getting product:', error);
                return null;
            }
        }

        // Categories get karo
        async getCategories() {
            console.log('📥 Getting categories...');
            
            // Agar Supabase available nahi hai
            if (!this.client) {
                console.log('🔄 Supabase not available, using local categories');
                return ['led-bulbs', 'tube-lights', 'wires', 'switches'];
            }

            try {
                const { data, error } = await this.client
                    .from('products')
                    .select('category')
                    .eq('is_active', true);

                if (error) throw error;
                
                const categories = [...new Set(data.map(item => item.category))];
                console.log('✅ Categories loaded:', categories);
                return categories;

            } catch (error) {
                console.error('❌ Error getting categories:', error);
                return ['led-bulbs', 'tube-lights', 'wires', 'switches'];
            }
        }

        // Default products (fallback)
        getDefaultProducts() {
            console.log('🔄 Using fallback products');
            return [
                {
                    id: 1,
                    name: "LED Bulb 9W",
                    price: 120,
                    original_price: 150,
                    discount: 20,
                    category: "led-bulbs",
                    image_url: "images/led-bulb.jpg",
                    description: "Energy efficient 9W LED bulb with 2-year warranty",
                    features: ["Energy saving", "Long lifespan", "Eco-friendly"],
                    specifications: {"Wattage": "9W", "Lumen": "800 LM", "Warranty": "2 Years"},
                    rating: 4.5,
                    is_active: true
                },
                {
                    id: 2,
                    name: "LED Tube Light 20W",
                    price: 350,
                    original_price: 420,
                    discount: 17,
                    category: "tube-lights", 
                    image_url: "images/tubelight.jpg",
                    description: "20W LED tube light for commercial use",
                    features: ["High lumen output", "Energy efficient", "Easy installation"],
                    specifications: {"Wattage": "20W", "Length": "4 Feet", "Warranty": "3 Years"},
                    rating: 4.2,
                    is_active: true
                },
                {
                    id: 3,
                    name: "Electrical Wire 90m",
                    price: 1200,
                    original_price: 1400,
                    discount: 14,
                    category: "wires",
                    image_url: "images/wire.jpg",
                    description: "90 meters high-quality electrical wire",
                    features: ["Fire resistant", "ISI certified", "Copper conductor"],
                    specifications: {"Length": "90m", "Standard": "ISI Certified", "Color": "Red/Blue/Green"},
                    rating: 4.4,
                    is_active: true
                },
                {
                    id: 4,
                    name: "Modular Switch",
                    price: 85,
                    original_price: 100,
                    discount: 15,
                    category: "switches",
                    image_url: "images/switch.jpg",
                    description: "Premium quality modular switch",
                    features: ["Child safety", "Modern design", "Easy installation"],
                    specifications: {"Type": "Single Pole", "Rating": "6A 250V", "Warranty": "2 Years"},
                    rating: 4.6,
                    is_active: true
                }
            ];
        }
    }

    // Create global instance
    console.log('🌍 Creating global supabaseProducts instance...');
    window.supabaseProducts = new SupabaseProducts();
    console.log('✅ supabaseProducts created:', typeof window.supabaseProducts);
}

// Initialize when script loads
console.log('🚀 supabase-products.js executing...');
initializeSupabaseProducts();