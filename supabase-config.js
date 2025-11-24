// supabase-config.js
console.log('🔧 Loading Supabase configuration...');

// Wait for supabase library to load
function initializeSupabase() {
    console.log('🔄 Checking if supabase library is available...');
    
    if (typeof supabase === 'undefined') {
        console.error('❌ Supabase library not loaded yet');
        return null;
    }
    
    try {
        // YOUR ACTUAL CREDENTIALS
        const SUPABASE_URL = 'https://hngubacqxejjdmscpgoo.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZ3ViYWNxeGVqamRtc2NwZ29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODQ0NzcsImV4cCI6MjA3OTU2MDQ3N30.rlgWa_t8DJ0Epkv5ClRgEJtlnnQFUyMEds_vnrJ66mQ';

        const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client initialized successfully');
        return client;
        
    } catch (error) {
        console.error('❌ Supabase initialization failed:', error);
        return null;
    }
}

// Initialize with retry
function initSupabaseWithRetry(retries = 3, delay = 100) {
    return new Promise((resolve) => {
        const tryInit = (attempt) => {
            const client = initializeSupabase();
            if (client) {
                window.supabase = client;
                resolve(client);
            } else if (attempt < retries) {
                console.log(`🔄 Retry ${attempt + 1}/${retries}...`);
                setTimeout(() => tryInit(attempt + 1), delay);
            } else {
                console.error('❌ Failed to initialize Supabase after retries');
                resolve(null);
            }
        };
        
        tryInit(0);
    });
}

// Initialize and make globally available
initSupabaseWithRetry().then(client => {
    if (client) {
        console.log('🎉 Supabase fully initialized and ready!');
    }
});

// Export for other scripts
window.initializeSupabase = initializeSupabase;