

const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') ? 'http://127.0.0.1:5000' : '';

// --- PREMIUM UI UTILITIES ---
window.showToast = function (message, icon = '✅') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);
    // Force reflow for animation
    void toast.offsetWidth;
    toast.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
};

// Global Error Safety Net
window.addEventListener('unhandledrejection', function (event) {
    console.warn("Unhandled Rejection:", event.reason);
    // Only show toast if it looks like a network error or fetch failure
    if (event.reason && (event.reason.message.includes('Failed to fetch') || event.reason.message.includes('NetworkError'))) {
        window.showToast("Connection Issue: Retrying in background...", "⚠️");
    }
});


window.openModal = function ({ title, body, confirmText = 'Confirm', onConfirm }) {
    const overlay = document.getElementById('modal-overlay');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const actionsEl = document.getElementById('modal-actions');

    titleEl.textContent = title;
    bodyEl.innerHTML = body;

    actionsEl.innerHTML = `
        <button class="btn btn-outline" id="modal-cancel">Cancel</button>
        <button class="btn btn-primary" id="modal-confirm">${confirmText}</button>
    `;

    overlay.classList.add('active');

    const close = () => overlay.classList.remove('active');

    document.getElementById('modal-cancel').onclick = close;
    document.getElementById('modal-confirm').onclick = () => {
        if (onConfirm()) close();
    };
};

window.toggleTheme = function () {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');

    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    icon.innerHTML = isLight
        ? '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'
        : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
};

// Apply saved theme on load
if (localStorage.getItem('theme') === 'light') {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('light-mode');
        const icon = document.getElementById('theme-icon');
        if (icon) icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // State
    // Load Coupon from Storage
    try {
        const savedCoupon = localStorage.getItem('appliedCoupon');
        if (savedCoupon) window.appliedCoupon = JSON.parse(savedCoupon);
    } catch (e) { console.error("Error parsing saved coupon:", e); }

    const state = {
        cart: JSON.parse(localStorage.getItem('savedCart')) || [],
        wishlist: [],
        settings: {},
        products: [
            // --- DRAGON FRUITS (Special Category) ---
            {
                id: 101,
                name: "Dragon Fruit (White Flesh)",
                price: 120,
                category: "Fruits",
                subCategory: "Dragon",
                color: "#FF1493",
                description: "Exotic white-fleshed dragon fruit. Mildly sweet.",
                rating: 4.8,
                originalPrice: 150
            },
            {
                id: 102,
                name: "Dragon Fruit (Red Flesh)",
                price: 150,
                category: "Fruits",
                subCategory: "Dragon",
                color: "#C71585",
                description: "Premium red-fleshed dragon fruit. Rich in antioxidants.",
                rating: 4.9,
                originalPrice: 196
            },

            // --- MANGOES (Delhi Summer Special) ---
            {
                id: 201,
                name: "Mango Dasheri (Malihabad)",
                price: 100,
                category: "Fruits",
                subCategory: "Normal",
                color: "#FFD700",
                description: "Famous Dasheri mangoes from Malihabad. Sweet and aromatic.",
                rating: 4.9,
                originalPrice: 127
            },
            {
                id: 202,
                name: "Mango Langra (Banaras)",
                price: 80,
                category: "Fruits",
                subCategory: "Normal",
                color: "#9ACD32",
                description: "Green-skinned Langra mangoes with unique tangy-sweet flavor.",
                rating: 4.8,
                originalPrice: 108
            },
            {
                id: 203,
                name: "Mango Chausa",
                price: 120,
                category: "Fruits",
                subCategory: "Normal",
                color: "#FFC20E",
                description: "Sweetest sucking mango, golden yellow Chausa.",
                rating: 4.9,
                originalPrice: 145
            },
            {
                id: 204,
                name: "Mango Safeda (Banganapalli)",
                price: 90,
                category: "Fruits",
                subCategory: "Normal",
                color: "#F4C430",
                description: "Early season Safeda mangoes. Large and pulp-filled.",
                rating: 4.7,
                originalPrice: 108
            },

            // --- SEASONAL & COMMON DELHI FRUITS ---
            {
                id: 1,
                name: "Kashmiri Apple (Kinnaur)",
                price: 180,
                category: "Fruits",
                subCategory: "Normal",
                color: "#D32F2F",
                description: "Crispy and sweet red apples from Kinnaur/Kashmir.",
                rating: 4.8,
                originalPrice: 243
            },
            {
                id: 301,
                name: "Lychee (Shahi)",
                price: 150,
                category: "Fruits",
                subCategory: "Normal",
                color: "#FF4500",
                description: "Juicy and sweet Shahi Lychee from Muzaffarpur.",
                rating: 4.7,
                originalPrice: 187
            },
            {
                id: 302,
                name: "Jamun (Black Plum)",
                price: 200,
                category: "Fruits",
                subCategory: "Normal",
                color: "#4B0082",
                description: "Tart and sweet Jamun. Great for diabetics.",
                rating: 4.6,
                originalPrice: 254
            },
            {
                id: 303,
                name: "Phalsa (Indian Sherbet Berry)",
                price: 250,
                category: "Fruits",
                subCategory: "Normal",
                color: "#800000",
                description: "Tiny tangy berries, perfect for cooling sherbet.",
                rating: 4.5,
                originalPrice: 305
            },
            {
                id: 2,
                name: "Banana (Chitti)",
                price: 60,
                category: "Fruits",
                subCategory: "Normal",
                color: "#FFE135",
                description: "Sweet spotted bananas. High energy.",
                rating: 4.5,
                originalPrice: 73
            },
            {
                id: 304,
                name: "Guava (Allahabad Safeda)",
                price: 60,
                category: "Fruits",
                subCategory: "Normal",
                color: "#98FB98",
                description: "Crunchy guava with sweet white flesh.",
                rating: 4.4,
                originalPrice: 73
            },
            {
                id: 305,
                name: "Guava (Pink Flesh)",
                price: 80,
                category: "Fruits",
                subCategory: "Normal",
                color: "#F08080",
                description: "Soft and sweet pink-fleshed guava.",
                rating: 4.5,
                originalPrice: 100
            },
            {
                id: 306,
                name: "Pomegranate (Kandhari Anar)",
                price: 160,
                category: "Fruits",
                subCategory: "Normal",
                color: "#DC143C",
                description: "Deep red ruby pearls, rich in iron.",
                rating: 4.7,
                originalPrice: 206
            },
            {
                id: 307,
                name: "Papaya (Disco)",
                price: 50,
                category: "Fruits",
                subCategory: "Normal",
                color: "#FF8C00",
                description: "Sweet, ripe papaya. Good for digestion.",
                rating: 4.6,
                originalPrice: 63
            },
            {
                id: 308,
                name: "Chiku (Sapota)",
                price: 70,
                category: "Fruits",
                subCategory: "Normal",
                color: "#8B4513",
                description: "Sweet and granular brown Chiku.",
                rating: 4.5,
                originalPrice: 91
            },
            {
                id: 309,
                name: "Custard Apple (Sitaphal)",
                price: 120,
                category: "Fruits",
                subCategory: "Normal",
                "color": "#90EE90",
                description: "Creamy and sweet Sitaphal.",
                rating: 4.8,
                originalPrice: 157
            },
            {
                id: 310,
                name: "Mosambi (Sweet Lime)",
                price: 60,
                category: "Fruits",
                subCategory: "Normal",
                "color": "#ADFF2F",
                description: "Juicy Mosambi, ideal for juice.",
                "rating": 4.4,
                originalPrice: 73
            },
            {
                id: 311,
                name: "Kinnow / Orange",
                price: 50,
                category: "Fruits",
                subCategory: "Normal",
                "color": "#FFA500",
                description: "Juicy Punjab Kinnow.",
                rating: 4.3,
                originalPrice: 65
            },
            {
                id: 312,
                name: "Muskmelon (Kharbuja)",
                price: 40,
                category: "Fruits",
                subCategory: "Normal",
                "color": "#F4A460",
                description: "Sweet and aromatic Kharbuja.",
                rating: 4.5,
                originalPrice: 51
            },
            {
                id: 313,
                name: "Watermelon (Tarbooz)",
                price: 30,
                category: "Fruits",
                subCategory: "Normal",
                "color": "#2E8B57",
                "description": "Hydrating red Watermelon.",
                "rating": 4.6,
                originalPrice: 38
            },
            {
                id: 314,
                name: "Pear (Babu Gosha)",
                price: 120,
                category: "Fruits",
                subCategory: "Normal",
                "color": "#9ACD32",
                "description": "Soft and sweet Indian pear.",
                "rating": 4.4,
                originalPrice: 160
            },
            {
                id: 315,
                name: "Plum (Aloo Bukhara)",
                price: 140,
                category: "Fruits",
                subCategory: "Normal",
                "color": "#800080",
                "description": "Sweet and sour juicy plums.",
                "rating": 4.5,
                originalPrice: 169
            },
            {
                id: 316,
                name: "Peach (Aadoo)",
                price: 130,
                category: "Fruits",
                subCategory: "Normal",
                "color": "#FFB07C",
                "description": "Velvety skin sweet peaches.",
                "rating": 4.4,
                originalPrice: 175
            },
            {
                id: 317,
                name: "Grapes (Black Seedless)",
                "price": 100,
                "category": "Fruits",
                subCategory: "Normal",
                "color": "#4B0082",
                "description": "Sweet black seedless grapes.",
                "rating": 4.7,
                originalPrice: 135
            },
            {
                id: 318,
                name: "Grapes (Green Sonaka)",
                "price": 80,
                "category": "Fruits",
                subCategory: "Normal",
                "color": "#ADFF2F",
                "description": "Long sweet green grapes.",
                "rating": 4.6,
                originalPrice: 96
            },
            {
                id: 319,
                name: "Ber (Jujube)",
                "price": 60,
                "category": "Fruits",
                subCategory: "Normal",
                "color": "#B8860B",
                "description": "Sweet and crunchy apple ber.",
                "rating": 4.2,
                originalPrice: 78
            },
            {
                id: 320,
                name: "Strawberry",
                price: 250,
                "category": "Fruits",
                "subCategory": "Normal",
                "color": "#FF0000",
                "description": "Fresh Mahabaleshwar strawberries. (Per Box)",
                "rating": 4.8,
                originalPrice: 322
            },
            {
                id: 321,
                name: "Kiwi",
                price: 40,
                "category": "Fruits",
                "subCategory": "Normal",
                "color": "#8B4513",
                "description": "Tangy Zespri Kiwi. (Per Piece)",
                "rating": 4.5,
                originalPrice: 49
            },
            {
                id: 322,
                name: "Amla (Gooseberry)",
                price: 40,
                "category": "Fruits",
                "subCategory": "Normal",
                "color": "#9ACD32",
                "description": "Vitamin C rich fresh Amla.",
                "rating": 4.3,
                originalPrice: 50
            },

            // --- VEGETABLES ---
            {
                id: 401,
                name: "Potato (Old/Pahari)",
                price: 30,
                category: "Vegetables",
                color: "#DEB887",
                "description": "Best for sabzi and fries.",
                rating: 4.5,
                originalPrice: 39
            },
            {
                id: 402,
                name: "Onion (Nashik)",
                price: 40,
                category: "Vegetables",
                color: "#C71585",
                "description": "Dry pink onions.",
                rating: 4.4,
                originalPrice: 52
            },
            {
                id: 403,
                name: "Tomato (Desi)",
                price: 50,
                category: "Vegetables",
                color: "#FF4500",
                "description": "Tangy desi tomatoes.",
                "rating": 4.5,
                originalPrice: 61
            },
            {
                id: 404,
                name: "Carrot (Red/Winter)",
                price: 40,
                category: "Vegetables",
                color: "#FF6347",
                "description": "Sweet red carrots for Halwa.",
                "rating": 4.6,
                originalPrice: 53
            },
            {
                id: 405,
                name: "Cauliflower (Gobi)",
                price: 50,
                category: "Vegetables",
                color: "#F5F5DC",
                "description": "Fresh white florets.",
                "rating": 4.3,
                originalPrice: 65
            },
            {
                id: 406,
                name: "Bhindi (Okra)",
                price: 60,
                category: "Vegetables",
                color: "#32CD32",
                "description": "Small tender Bhindi.",
                "rating": 4.3,
                originalPrice: 78
            },
            {
                id: 407,
                name: "Coriander (Dhaniya)",
                price: 20,
                category: "Vegetables",
                color: "#228B22",
                "description": "Fresh aromatic bunch.",
                "rating": 4.8,
                originalPrice: 25
            },
            {
                id: 408,
                name: "Green Chilli",
                price: 80,
                category: "Vegetables",
                color: "#006400",
                "description": "Spicy Indian chillis.",
                "rating": 4.5,
                originalPrice: 98
            },
            {
                id: 409,
                name: "Ginger (Adrak)",
                price: 120,
                category: "Vegetables",
                color: "#D2B48C",
                "description": "Fresh ginger root.",
                "rating": 4.7,
                originalPrice: 159
            },
            {
                id: 410,
                name: "Garlic (Lahsun)",
                price: 200,
                category: "Vegetables",
                color: "#FFFAFA",
                "description": "Desi aromatic garlic.",
                "rating": 4.6,
                originalPrice: 242
            },
            {
                id: 411,
                name: "Spinach (Palak)",
                price: 30,
                category: "Vegetables",
                color: "#008000",
                "description": "Fresh leafy spinach.",
                "rating": 4.5,
                originalPrice: 39
            },
            {
                id: 412,
                name: "Lemon (Nimbu)",
                price: 10,
                category: "Vegetables",
                "color": "#FFF700",
                "description": "Juicy yellow lemons. (Per Piece)",
                "rating": 4.7,
                originalPrice: 13
            },

            // --- NEW FRUITS ---
            {
                id: 330,
                name: "Pineapple (Rani)",
                price: 80,
                category: "Fruits",
                subCategory: "Normal",
                color: "#FFD700",
                "description": "Sweet and tangy Rani Pineapple. (Per Piece)",
                rating: 4.6,
                originalPrice: 100
            },
            {
                id: 331,
                name: "Orange (Nagpur)",
                price: 60,
                category: "Fruits",
                subCategory: "Normal",
                color: "#FFA500",
                "description": "Famous juicy Nagpur oranges.",
                rating: 4.5,
                originalPrice: 79
            },
            {
                id: 332,
                name: "Cherry (Imported)",
                price: 300,
                category: "Fruits",
                subCategory: "Normal",
                color: "#8B0000",
                "description": "Sweet red cherries. (Per Box)",
                rating: 4.8,
                originalPrice: 399
            },
            {
                id: 333,
                name: "Apricot (Khubani)",
                price: 200,
                category: "Fruits",
                subCategory: "Normal",
                color: "#FFB07C",
                "description": "Sweet dried apricots.",
                rating: 4.4,
                originalPrice: 240
            },
            {
                id: 334,
                name: "Avocado (Butter Fruit)",
                price: 150,
                category: "Fruits",
                subCategory: "Normal",
                "color": "#556B2F",
                "description": "Creamy ripe avocados. (Per Piece)",
                rating: 4.7,
                originalPrice: 180
            },
            {
                id: 335,
                name: "Blueberry",
                price: 400,
                category: "Fruits",
                subCategory: "Normal",
                "color": "#483D8B",
                "description": "Antioxidant rich blueberries. (Per Box)",
                "rating": 4.9,
                originalPrice: 480
            },

            // --- NEW VEGETABLES ---
            {
                id: 420,
                name: "Bottle Gourd (Lauki)",
                price: 40,
                category: "Vegetables",
                color: "#90EE90",
                "description": "Fresh tender bottle gourd. (Per Piece)",
                rating: 4.4,
                originalPrice: 50
            },
            {
                id: 421,
                name: "Bitter Gourd (Karela)",
                price: 60,
                category: "Vegetables",
                color: "#006400",
                "description": "Fresh green karela.",
                rating: 4.3,
                originalPrice: 81
            },
            {
                id: 422,
                name: "Capsicum (Shimla Mirch)",
                price: 80,
                category: "Vegetables",
                color: "#008000",
                "description": "Crunchy green capsicum.",
                rating: 4.5,
                originalPrice: 96
            },
            {
                id: 423,
                name: "Cucumber (Kheera)",
                price: 40,
                category: "Vegetables",
                color: "#228B22",
                "description": "Cool and crisp cucumber.",
                rating: 4.6,
                originalPrice: 48
            },
            {
                id: 424,
                name: "Brinjal (Bharta)",
                price: 60,
                category: "Vegetables",
                color: "#4B0082",
                "description": "Large purple brinjal for Bharta.",
                "rating": 4.5,
                originalPrice: 72
            },
            {
                id: 425,
                name: "Cabbage (Patta Gobi)",
                price: 50,
                category: "Vegetables",
                color: "#98FB98",
                "description": "Fresh leafy cabbage. (Per Piece)",
                "rating": 4.3,
                originalPrice: 65
            },
            {
                id: 426,
                name: "Peas (Matar)",
                price: 80,
                category: "Vegetables",
                color: "#32CD32",
                "description": "Sweet green peas pods.",
                "rating": 4.7,
                originalPrice: 108
            },
            {
                id: 427,
                name: "Beans (French)",
                price: 100,
                category: "Vegetables",
                color: "#228B22",
                "description": "Tender french beans.",
                "rating": 4.6,
                originalPrice: 120
            },
            {
                id: 332,
                name: "Cherry (Imported)",
                price: 300,
                category: "Fruits",
                subCategory: "Normal",
                color: "#8B0000",
                description: "Sweet red cherries. (Per Box)",
                rating: 4.8
            },
            {
                id: 333,
                name: "Apricot (Khubani)",
                price: 200,
                category: "Fruits",
                subCategory: "Normal",
                color: "#FFB07C",
                description: "Sweet dried apricots.",
                rating: 4.4
            },
            {
                id: 334,
                name: "Avocado (Butter Fruit)",
                price: 150,
                category: "Fruits",
                subCategory: "Normal",
                color: "#556B2F",
                description: "Creamy ripe avocados. (Per Piece)",
                rating: 4.7
            },
            {
                id: 335,
                name: "Blueberry",
                price: 400,
                category: "Fruits",
                subCategory: "Normal",
                color: "#483D8B",
                description: "Antioxidant rich blueberries. (Per Box)",
                rating: 4.9
            },

            // --- NEW VEGETABLES ---
            {
                id: 420,
                name: "Bottle Gourd (Lauki)",
                price: 40,
                category: "Vegetables",
                color: "#90EE90",
                description: "Fresh tender bottle gourd. (Per Piece)",
                rating: 4.4
            },
            {
                id: 421,
                name: "Bitter Gourd (Karela)",
                price: 60,
                category: "Vegetables",
                color: "#006400",
                description: "Fresh green karela.",
                rating: 4.3
            },
            {
                id: 422,
                name: "Capsicum (Shimla Mirch)",
                price: 80,
                category: "Vegetables",
                color: "#008000",
                description: "Crunchy green capsicum.",
                rating: 4.5
            },
            {
                id: 423,
                name: "Cucumber (Kheera)",
                price: 40,
                category: "Vegetables",
                color: "#228B22",
                description: "Cool and crisp cucumber.",
                rating: 4.6
            },
            {
                id: 424,
                name: "Brinjal (Bharta)",
                price: 60,
                category: "Vegetables",
                color: "#4B0082",
                description: "Large purple brinjal for Bharta.",
                rating: 4.5
            },
            {
                id: 425,
                name: "Cabbage (Patta Gobi)",
                price: 50,
                category: "Vegetables",
                color: "#98FB98",
                description: "Fresh leafy cabbage. (Per Piece)",
                rating: 4.3
            },
            {
                id: 426,
                name: "Peas (Matar)",
                price: 80,
                category: "Vegetables",
                color: "#32CD32",
                description: "Sweet green peas pods.",
                rating: 4.7
            },
            {
                id: 427,
                name: "Beans (French)",
                price: 100,
                category: "Vegetables",
                color: "#228B22",
                description: "Tender french beans.",
                rating: 4.6
            }
        ],
        route: 'home',
        user: {}
    };

    // --- Backend Integration ---
    const API_BASE = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
        ? 'http://127.0.0.1:5000'
        : window.location.origin; // Dynamically use current domain if live

    // --- Activity Logging ---
    async function logActivity(data) {
        // Only log if we have a user or it's a significant anonymous action
        const user = state.user.name || 'Guest';
        try {
            await fetch(`${API_BASE}/api/log-activity`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: data.type,
                    user: user,
                    details: data.details
                })
            });
        } catch (e) {
            console.warn("Logging failed", e);
        }
    }

    async function fetchProducts() {
        const mainContent = document.getElementById('app-main');
        if (mainContent && state.route === 'home') {
            mainContent.innerHTML = `
                <div class="container" style="padding-top: 8rem;">
                    <div class="shimmer" style="height: 400px; width: 100%; margin-bottom: 2rem;"></div>
                    <div class="product-grid">
                        ${Array(6).fill(`<div class="shimmer" style="height: 300px; border-radius: 20px;"></div>`).join('')}
                    </div>
                </div>
            `;
        }
        try {
            const [prodRes, setRes] = await Promise.all([
                fetch(`${API_BASE}/api/products?t=${Date.now()}`),
                fetch(`${API_BASE}/api/settings`)
            ]);

            if (!prodRes.ok) throw new Error('Failed to fetch products');

            const productsData = await prodRes.json();
            state.products = Array.isArray(productsData) ? productsData : (productsData.products || []);
            try { state.settings = await setRes.json(); } catch (e) { }

            router();
        } catch (error) {
            console.error('Error loading products:', error);
            showToast("Failed to sync products", "❌");
        }
    }

    // DOM Elements
    // DOM Elements - Selectors removed from here to ensure fresh selection in functions
    const mobileBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.glass-header');
    const cartCount = document.querySelector('.cart-count');

    // --- Login Logic ---
    // --- Login Logic Refactored ---

    // Finalize login (common for both Sign In and Sign Up)
    function finishLogin() {
        console.log("Finishing login. User:", state.user);
        localStorage.setItem('fruitShopUser', JSON.stringify(state.user));

        // CACHE LOGIC
        try {
            const knownUsers = JSON.parse(localStorage.getItem('knownUsers') || '{}');
            if (state.user && state.user.phone) {
                knownUsers[state.user.phone] = state.user;
                localStorage.setItem('knownUsers', JSON.stringify(knownUsers));

                // SYNC WITH SERVER (Fix for empty User DB)
                // We fire this in background to ensure server has the user record and logs the login
                fetch(`${API_BASE}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(state.user)
                }).then(async res => {
                    if (res.status === 403) {
                        alert("⛔ YOUR ACCOUNT IS BANNED.");
                        logoutUser();
                    }
                }).catch(e => console.warn("Sync failed", e));
            }
        } catch (err) {
            console.error("Cache save error:", err);
        }

        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) loginBtn.style.display = 'none';

        closeLoginModal();

        // Refresh View if needed
        if (state.route === 'profile') router();
        if (window.location.hash === '#cart') renderCart();

        // Reload profile if currently on profile page
        if (window.location.hash === '#profile') {
            renderProfile();
        }
    }

    // Triggered by Login buttons in UI
    window.loginUser = function () {
        showLoginModal();
    };

    window.showLoginModal = function () {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.remove('hidden');
            // Reset to selection view
            document.getElementById('login-selection').classList.remove('hidden');
            document.getElementById('signin-form').classList.add('hidden');
            document.getElementById('signup-form').classList.add('hidden');
        }
    }

    window.closeLoginModal = function () {
        const modal = document.getElementById('login-modal');
        if (modal) modal.classList.add('hidden');
    }

    window.showSignInForm = function () {
        document.getElementById('login-selection').classList.add('hidden');
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('signin-form').classList.remove('hidden');
        // Auto focus phone input
        setTimeout(() => document.getElementById('signin-phone').focus(), 100);
    }

    window.showSignUpForm = function () {
        document.getElementById('login-selection').classList.add('hidden');
        document.getElementById('signin-form').classList.add('hidden');
        document.getElementById('otp-form').classList.add('hidden'); // Ensure OTP form is hidden
        document.getElementById('signup-form').classList.remove('hidden');
        setTimeout(() => document.getElementById('signup-name').focus(), 100);
    }

    // --- SECURE OTP AUTHENTICATION ---
    let tempAuthUser = null;
    let authType = 'login'; // 'login' or 'signup'

    window.processSignIn = async function () {
        const phoneInput = document.getElementById('signin-phone');
        let phone = phoneInput.value.trim();

        if (!phone) {
            showToast("Please enter a phone number", "⚠️");
            return;
        }

        // Server Lookup
        try {
            showToast("Checking account...", "🔍");
            const checkRes = await fetch(`${API_BASE}/api/user?phone=${encodeURIComponent(phone)}`);
            const checkData = await checkRes.json();

            if (checkData.found) {
                if (checkData.user.is_banned) {
                    showToast("ACCESS DENIED: Account suspended", "⛔");
                    return;
                }

                tempAuthUser = checkData.user;
                authType = 'login';
                requestOtp(phone);
            } else {
                if (confirm("User not found. Do you want to create a new account?")) {
                    showSignUpForm();
                    document.getElementById('signup-phone').value = phone;
                }
            }
        } catch (e) {
            console.warn("Server check failed:", e);
            alert("Connection error. Please try again.");
        }
    }

    window.processSignUp = async function () {
        const name = document.getElementById('signup-name').value.trim();
        const phone = document.getElementById('signup-phone').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const address = document.getElementById('signup-address').value.trim();

        if (!name || !phone || !address) {
            alert("Please fill in Name, Phone, and Address.");
            return;
        }

        tempAuthUser = { name, phone, email, address };
        authType = 'signup';
        requestOtp(phone);
    }

    window.requestOtp = async function (phone) {
        showToast("Sending OTP...", "⏳");
        try {
            const res = await fetch(`${API_BASE}/api/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });
            const d = await res.json();
            if (d.success) {
                if (d.debug_otp) alert("DEV MSG: Your OTP is " + d.debug_otp);
                showOtpForm(phone);
                showToast("OTP Sent Successfully", "✅");
                console.log("DEV INFO: Check Server Console for OTP if SMS API is not configured.");
            } else {
                alert("Failed to send OTP: " + d.message);
            }
        } catch (e) {
            console.error(e);
            alert("Error sending OTP. Please check connection.");
        }
    }

    window.showOtpForm = function (phone) {
        document.getElementById('login-selection').classList.add('hidden');
        document.getElementById('signin-form').classList.add('hidden');
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('otp-form').classList.remove('hidden');

        const display = document.getElementById('otp-phone-display');
        if (display) display.innerText = phone;

        document.getElementById('otp-input').value = '';
        setTimeout(() => document.getElementById('otp-input').focus(), 100);
    }

    window.verifyOtpAndLogin = async function () {
        const otpInput = document.getElementById('otp-input');
        const otp = otpInput.value.trim();

        if (otp.length !== 6) {
            showToast("Please enter valid 6-digit OTP", "⚠️");
            otpInput.classList.add('shake');
            setTimeout(() => otpInput.classList.remove('shake'), 400);
            return;
        }

        try {
            showToast("Verifying...", "🔐");
            const res = await fetch(`${API_BASE}/api/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: tempAuthUser.phone, otp })
            });
            const d = await res.json();

            if (d.success) {
                // OTP Verified. Perform Action.
                if (authType === 'signup') {
                    // Register the user on server
                    const regRes = await fetch(`${API_BASE}/api/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(tempAuthUser)
                    });
                    const regData = await regRes.json();
                    if (!regData.success) {
                        alert(regData.error || "Registration Failed");
                        return;
                    }
                }

                // Set User State
                state.user = {
                    ...tempAuthUser,
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(tempAuthUser.name)}&background=random`
                };

                finishLogin();
                showToast("Authentication Successful!", "🎉");
            } else {
                showToast("Invalid OTP. Try again.", "❌");
                otpInput.value = '';
            }
        } catch (e) {
            console.error(e);
            alert("Verification Error");
        }
    }

    window.resendOtp = function () {
        if (tempAuthUser && tempAuthUser.phone) requestOtp(tempAuthUser.phone);
    }

    window.logoutUser = function () {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('fruitShopUser');
            state.user = {};
            alert("Logged out successfully.");
            window.location.hash = ''; // Go home
            window.location.reload(); // Reload to clear state cleanly
        }
    };

    // Check for logged in user on load
    (function checkLogin() {
        const savedUser = localStorage.getItem('fruitShopUser');
        if (savedUser) {
            try {
                state.user = JSON.parse(savedUser);

                // SYNC WITH SERVER ON LOAD
                // Ensure server knows we are here
                fetch(`${API_BASE}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(state.user)
                }).then(async res => {
                    if (res.status === 403) {
                        alert("⛔ YOUR ACCOUNT IS BANNED.");
                        localStorage.removeItem('fruitShopUser');
                        state.user = {};
                        window.location.reload();
                    }
                }).catch(e => console.warn("Background sync failed", e));

                // Hide login button if it exists (might need to run after DOM load too, handled in SetupEventListeners mostly, 
                // but let's ensure we know we are logged in)
                console.log("Welcome back", state.user.name);
            } catch (e) {
                console.error("Auth Error", e);
            }
        }

        // Fetch Settings
        fetch(`${API_BASE}/api/settings`).then(res => res.json()).then(data => {
            if (data.weekend_discount != null) {
                state.settings = data;
                const discount = data.weekend_discount;

                // Update Index Display
                const elIndex = document.getElementById('weekend-discount-display');
                if (elIndex) elIndex.textContent = discount;

                // Update App.js Injected Display
                const elApp = document.getElementById('weekend-discount-display-app');
                if (elApp) elApp.textContent = discount;
            }
        }).catch(e => { });

        // Sale Page Renderer
        window.renderSalePage = function () {
            const isSunday = new Date().getDay() === 0;
            const discountPct = (state.settings && state.settings.weekend_discount != null) ? state.settings.weekend_discount : 5;
            const multiplier = (100 - discountPct) / 100;

            // Apply Discount Logic
            const saleItems = state.products
                .filter(p => p.originalPrice && p.price < p.originalPrice)
                .map(p => ({
                    ...p,
                    price: Math.floor(p.price * multiplier), // Dynamic Extra Discount
                    isSaleItem: true // Mark as sale item
                }));

            const mainContent = document.getElementById('app-main');
            if (!mainContent) return;

            mainContent.innerHTML = `
            <div class="container" style="padding-top: 8rem; padding-bottom: 4rem;">
                <h1 style="font-family: var(--font-serif); margin-bottom: 1rem; color: #f59e0b;">Weekend Sale ⚡</h1>
                
                ${!isSunday ? `
                    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; text-align: center; font-weight: 600;">
                        ⚠️ This sale is ONLY applicable on Sundays. You cannot purchase at these prices today.
                    </div>
                ` : `
                    <p style="margin-bottom: 3rem; color: var(--text-gray); font-size: 1.2rem;">Extra ${discountPct}% OFF applied deeply on all sale items!</p>
                `}

                <div class="product-grid">
                    ${saleItems.map(p => {
                // Create a custom grid item that checks for Sunday
                const smartImg = getSmartImage(p);
                return `
                            <div class="product-card reveal">
                                <div class="product-badge" style="background:#f59e0b;">Weekend Deal</div>
                                <div class="product-image">
                                    <img src="${smartImg}" alt="${p.name}">
                                </div>
                                <div class="product-info">
                                    <h3>${p.name}</h3>
                                    <p class="price">
                                        <span class="old-price">₹${Math.floor(p.price / multiplier)}</span>
                                        ₹${p.price}
                                    </p>
                                    <button class="btn btn-primary" style="width: 100%; ${!isSunday ? 'opacity: 0.6; cursor: not-allowed;' : ''}" 
                                        onclick="${isSunday ? `addToCart(${p.id}, ${p.price})` : `alert('This sale price is only applicable on Sunday!')`}">
                                        ${isSunday ? 'Add to Cart' : 'Sunday Only'}
                                    </button>
                                </div>
                            </div>
                        `;
            }).join('')}
                </div>
                 <div style="margin-top: 3rem; text-align: center;">
                    <button class="btn btn-outline" onclick="window.location.hash=''; window.location.reload();">Back to Home</button>
                </div>
            </div>
        `;
            window.scrollTo(0, 0);
        };
    })();

    // --- Router ---
    // Scroll Effect for Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Animation Observer ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    function initAnimations() {
        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => observer.observe(el));
    }

    function router() {
        const hash = window.location.hash;
        console.log('Router navigating to:', hash); // Debug log

        // --- DYNAMIC BACKGROUND LOGIC ---
        const videoContainer = document.querySelector('.video-bg-container');
        const videoElement = document.getElementById('vbg');

        if (videoContainer) {
            const isHome = !hash || hash === '#' || hash === '#home';

            if (isHome) {
                // Show Video Background on Home
                videoContainer.style.display = 'block';
                // Reset body to allow video to show through
                document.body.style.setProperty('background', 'transparent', 'important');
                document.body.style.setProperty('background-color', 'transparent', 'important');

                if (videoElement) {
                    videoElement.style.display = 'block';
                    videoElement.play().catch(e => { console.log("Auto-play blocked"); });
                }
            } else {
                // Hide Video Background on Inner Pages
                videoContainer.style.display = 'none';
                if (videoElement) videoElement.pause();

                // Force Premium Dark Background for Readability
                document.body.style.setProperty('background', '#0A0A0A', 'important');
                document.body.style.setProperty('background-color', '#0A0A0A', 'important');
                document.body.style.setProperty('background-image', 'none', 'important');
            }
        }

        // Log navigation
        logActivity({ type: 'view_page', details: hash || 'Home' });

        if (hash.startsWith('#product/')) {
            const id = parseInt(hash.split('/')[1]);
            const product = state.products.find(p => p.id === id);
            if (product) {
                renderProductDetails(product);
                window.scrollTo(0, 0);
            }
        } else if (hash === '#cart') {
            console.log('Rendering Cart View');
            renderCart();
            window.scrollTo(0, 0);
        } else if (hash === '#wishlist') {
            renderWishlist();
            window.scrollTo(0, 0);
        } else if (hash === '#profile') {
            renderProfile();
            window.scrollTo(0, 0);
        } else if (hash === '#edit-profile') {
            renderEditProfile();
            window.scrollTo(0, 0);
        } else if (hash === '#about') {
            renderStory();
            window.scrollTo(0, 0);
        } else if (hash === '#subscriptions') {
            renderSubscriptionPage();
            window.scrollTo(0, 0);
        } else {
            console.log('Rendering Home View');
            renderHome();
        }

        // Re-initialize animations after render
        setTimeout(initAnimations, 100);
    }

    window.addEventListener('hashchange', router);

    // Initial Load Router Call - Ensure it runs after DOM is fully ready
    fetchProducts(); // This will call router() after data loads

    // --- Views ---

    function getSmartImage(product) {
        // Clean name: "Banana (Chitti)" -> "Banana"
        let cleanName = product.name.split('(')[0].trim();
        const lowerName = product.name.toLowerCase();

        // Specific overrides for better matching
        if (lowerName.includes('dragon fruit (white')) cleanName = 'white dragon fruit cut';
        if (lowerName.includes('dragon fruit (red')) cleanName = 'red dragon fruit cut';
        if (lowerName.includes('grapes (black')) cleanName = 'black grapes bunch';
        if (lowerName.includes('grapes (green')) cleanName = 'green grapes bunch';
        if (lowerName.includes('guava (pink')) cleanName = 'pink guava fruit cut';
        if (lowerName.includes('guava (allahabad')) cleanName = 'white guava fruit';
        if (lowerName.includes('spinach')) cleanName = 'fresh spinach leaves bunch';
        if (lowerName.includes('bhindi')) cleanName = 'fresh raw okra bhindi';

        // Mango Specifics
        if (lowerName.includes('dasheri')) cleanName = 'yellow dasheri mango pile';
        if (lowerName.includes('langra')) cleanName = 'green langra mango';
        if (lowerName.includes('chausa')) cleanName = 'yellow chausa mango';
        if (lowerName.includes('safeda')) cleanName = 'yellow safeda mango fruit';

        // New Additions
        if (lowerName.includes('lauki')) cleanName = 'bottle gourd fresh';
        if (lowerName.includes('karela')) cleanName = 'bitter gourd fresh';
        if (lowerName.includes('capsicum')) cleanName = 'green capsicum fresh';
        if (lowerName.includes('brinjal')) cleanName = 'purple brinjal fresh';
        if (lowerName.includes('cabbage')) cleanName = 'green cabbage fresh';
        if (lowerName.includes('peas')) cleanName = 'green peas pods';
        if (lowerName.includes('beans')) cleanName = 'french beans fresh';
        if (lowerName.includes('pineapple')) cleanName = 'pineapple whole fruit';
        if (lowerName.includes('avocado')) cleanName = 'avocado fruit';
        if (lowerName.includes('cherry')) cleanName = 'red sweet cherries';
        if (lowerName.includes('blueberry')) cleanName = 'blueberries fruit';

        // Context based on category
        let type = product.category === 'Vegetables' ? 'fresh raw vegetable' : 'fresh organic fruit';

        const query = `${cleanName} ${type} realistic close up 4k`;
        return `https://tse2.mm.bing.net/th?q=${encodeURIComponent(query)}&w=400&h=400&c=7&rs=1&p=0`;
    }

    function renderStory() {
        const mainContent = document.getElementById('app-main');
        if (!mainContent) return;
        mainContent.innerHTML = `
            <div class="container" style="padding-top: 8rem; padding-bottom: 4rem; max-width: 900px;">
                <h1 style="font-family: var(--font-serif); font-size: 3rem; margin-bottom: 2rem; color: var(--primary-color);">Our Story 🍃</h1>
                
                <div style="background: rgba(255,255,255,0.05); padding: 3rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05);">
                    <p style="font-size: 1.2rem; margin-bottom: 1.5rem; color: var(--text-light);">
                        Welcome to <strong style="color: var(--primary-color);">Ajay Fruit Mart</strong>, where nature's finest treasures meet your doorstep. 
                        Started in 2024 with a simple mission: to make premium, exotic, and farm-fresh produce accessible to everyone in Delhi.
                    </p>
                    
                    <p style="font-size: 1.1rem; margin-bottom: 1.5rem; color: var(--text-gray);">
                        We don't just sell fruits; we curate experiences. From the sweet orchards of Himachal to the tropical vines of Maharashtra, 
                        every fruit and vegetable in our collection is hand–picked for its quality, taste, and freshness.
                    </p>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 3rem;">
                        <div>
                            <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #32CD32;">Our Promise</h3>
                            <ul style="list-style: none; color: var(--text-gray);">
                                <li style="margin-bottom: 0.5rem;">✅ 100% Organic & Chemical Free</li>
                                <li style="margin-bottom: 0.5rem;">✅ Farm to Table within 24 Hours</li>
                                <li style="margin-bottom: 0.5rem;">✅ Premium Export Quality</li>
                            </ul>
                        </div>
                        <div>
                            <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #FFA500;">Why Choose Us?</h3>
                            <p style="color: var(--text-gray);">
                                Unlike regular markets, we prioritize quality over quantity. Our temperature-controlled delivery ensures 
                                that your mangoes arrive sweet and your spinach arrives crisp.
                            </p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 3rem; text-align: center;">
                        <a href="#fruits-section" class="btn btn-primary" onclick="window.location.hash=''">Explore Our Collection</a>
                    </div>
                </div>
            </div>
        `;
    }

    window.generateUPIQR = function (amount) {
        const upiID = "fruitshop@upi"; // TODO: Replace with user provided ID
        const name = "Ajay Fruit Mart";
        const upiLink = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`;
    }

    window.toggleQR = function (value) {
        const qr = document.getElementById('qr-container');
        if (qr) {
            qr.style.display = value === 'UPI' ? 'block' : 'none';
        }
    }

    function renderCart() {
        const { itemTotal, deliveryFee, baseDeliveryFee, distanceSurcharge, distance, discount, weekendSavings, finalTotal, couponError } = getCartTotals();

        const mainContent = document.getElementById('app-main');
        if (!mainContent) return;

        mainContent.innerHTML = `
            <div class="container cart-container" style="padding-top: 8rem; padding-bottom: 4rem; max-width: 800px;">
                <h1 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 2rem;">Your Cart (${state.cart.length})</h1>
                
                ${state.cart.length === 0 ? `
                    <div style="text-align: center; padding: 4rem; background: rgba(255,255,255,0.05); border-radius: 16px;">
                        <p style="color: var(--text-gray); font-size: 1.2rem; margin-bottom: 2rem;">Your cart is empty.</p>
                        <a href="#" class="btn btn-primary" onclick="window.location.hash=''">Start Shopping</a>
                    </div>
                ` : `
                    <div class="cart-layout" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; align-items: start;">
                        <div class="cart-items" style="display: flex; flex-direction: column; gap: 1.5rem;">
                            ${state.cart.map((item) => `
                                <div class="cart-item" style="display: flex; gap: 1.5rem; background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; align-items: center;">
                                    <div style="width: 80px; height: 80px; border-radius: 8px; overflow: hidden;">
                                        <img src="${getSmartImage(item)}" alt="${item.name}" class="cart-thumb" />
                                    </div>
                                    <div style="flex: 1;">
                                        <h3 style="margin-bottom: 0.5rem;">${item.name}</h3>
                                        <p style="color: var(--text-gray);">₹${item.price} / ${getPriceUnit(item)}</p>
                                        <p style="color: var(--primary-color); font-weight: bold;">₹${Math.round(item.price * (item.qty || 1))} Total</p>
                                    </div>
                                    <div class="qty-selector" style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 8px;">
                                        <!-- Decrease by 0.5 or 1 based on unit? Let's use 0.5 for generic or 1 -->
                                        <!-- Actually, consistency with grid: -1 might be too much for 0.5kg items -->
                                        <!-- Let's iterate by 0.1 or 0.25 to allow fine control in cart -->
                                        <button onclick="updateCartItemQty(${item.id}, -0.1)" style="color: white; font-weight: bold; background: none; border: none; cursor: pointer;">-</button>
                                        <span style="font-weight: bold; min-width: 40px; text-align: center;">${item.qty || 1} ${getPriceUnit(item) === 'Kg' ? 'kg' : ''}</span>
                                        <button onclick="updateCartItemQty(${item.id}, 0.1)" style="color: white; font-weight: bold; background: none; border: none; cursor: pointer;">+</button>
                                    </div>
                                    <button onclick="removeAllFromCart(${item.id})" style="color: #FF6B6B; font-weight: 500; margin-left: 10px; background: none; border: none; cursor: pointer;">Remove</button>
                                </div>
                            `).join('')}
                        </div>

                        <div class="checkout-section">
                            ${!state.user.name ? `
                                <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 16px; text-align: center;">
                                    <h3 style="margin-bottom: 1rem; font-family: var(--font-serif);">Login Required</h3>
                                    <p style="color: var(--text-gray); margin-bottom: 1.5rem;">You must be logged in to place an order.</p>
                                    <button class="btn btn-primary" onclick="loginUser()">Login to Checkout</button>
                                </div>
                            ` : `
                                <div class="checkout-form">
                                    <h3 style="font-family: var(--font-serif); margin-bottom: 1.5rem; color: var(--primary-color);">Delivery Details 🚚</h3>
                                    <div class="form-group">
                                        <label>Full Name</label>
                                        <input type="text" id="c-name" placeholder="Enter your name" value="${state.user.name}" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label>Phone Number</label>
                                        <input type="tel" id="c-phone" placeholder="+91 98765 43210" value="${state.user.phone}" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label>Address</label>
                                        <textarea id="c-address" rows="3" placeholder="House No, Street, Locality">${state.user.address}</textarea>
                                    </div>
                                    <div class="form-group">
                                        <label>City & Pincode</label>
                                        <div style="display: flex; gap: 1rem;">
                                            <input type="text" id="c-city" placeholder="City" value="Delhi">
                                            <input type="text" id="c-pincode" placeholder="Pincode">
                                        </div>
                                    </div>
                                    
                                    <div class="form-group" style="margin-top: 2rem;">
                                        <h3 style="font-family: var(--font-serif); margin-bottom: 1rem; color: var(--primary-color);">Payment Method 💳</h3>
                                        
                                        <label class="payment-option" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 1rem; cursor: pointer; border: 1px solid rgba(255,255,255,0.1);">
                                            <input type="radio" name="payment" value="UPI" checked onchange="window.toggleQR(this.value)" style="width: 20px; height: 20px; accent-color: var(--primary-color);">
                                        <span style="font-size: 1.1rem;">UPI (GPay / PhonePe / Paytm)</span>
                                    </label>

                                    <!-- QR Code Container -->
                                    <div id="qr-container" style="text-align: center; margin-bottom: 1rem; background: white; padding: 1rem; border-radius: 12px; width: fit-content; margin-left: auto; margin-right: auto; display: block !important;">
                                        <p style="color: black; font-weight: bold; margin-bottom: 0.5rem; display: block;">Scan to Pay: ₹${finalTotal}</p>
 
                                        <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAMJAtwDASIAAhEBAxEB/8QAHgABAAIDAAMBAQAAAAAAAAAAAAgJBgcKAwQFAgH/xABvEAAABAQBAwkNEgsEBgkDBAMAAgMEAQUGBwgJERITGSExOFd2lbQUGCIyN0FRVnWWs9PUFRYXNlJTYXFyc3SSk5SxstHSIzM0NUJVWIGRtcFUYqGiJENlgqThJSY5REdjZneFZIajJ4OExEXC8P/EAB0BAQEBAQEAAwEBAAAAAAAAAAACAQQDBgcIBQn/xAAuEQEAAgEEAgECBQQCAwAAAAAAAQISAwQFMQYRMgchEyJBUWEUFSMzgZEWQnL/2gAMAwEAAhEDEQA/ALOwAB1vIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYTd68lAWPpUtZ3Gmx5bKTuSMdVI1O4/DKf3ExgzYBGLXI8IW+K94hfeJDXI8IW+K94hfeJDKFJOgIxa5HhC3xXvEL7xIa5HhC3xXvEL7xIZQJOgIxa5HhC3xXvEL7xIa5HhC3xXvEL7xIZQJOgIxa5HhC3xXvEL7xIa5HhC3xXvEL7xIZQJOgIxa5HhC3xXvEL7xIa5HhC3xXvEL7xIZQJOgIxa5HhC3xXvEL7xIa5HhC3xXvEL7xIZQJOgIxa5HhC3xXvEL7xIa5HhC3xXvEL7xIZQJOgIxa5HhC3xXvEL7xI3Xai7dDXspFKubeTE76SqOFUCOTtzt+jJ0/QKBkMyABrW9GIm0+H9pK3d06gWlqM4Oqm0OmwVcaZye9kMCWygEYtcjwhb4r3iF94kZDb7HLhuulWMtoCiaydP51NTHI0bqSl2j4QgZQpvwAAakARiPlIMIu+M94lfeJDXI8IW+K94hfeJGZQpJ0BF8uUlwi74Ex4lej965HhC3xXvEL7xIyLwJOgNZ2WxGWkxAIzdxayoFpsSTHQTdnUYKt9A6vvhCjZg1IAANAAAAABHytceGGi3NWTWiKsrd00nEmXM1eIFlLs2pnKM9iQYCMWuR4Qt8V7xC+8SPzrk2EXT6oEy4lejJvCknwEYtcjwhb4r3iF94kZraPF9Ye+dVGou2lVuplNyNTPjoqS1w3IREnvhCjcoG6AABqQAAAARyqbKBYXKRqSa0nPa7eoTSTPV5c8R8xnZ9TcJH0Tj5+uR4Qt8V7xC+8SJyhSToCMGuU4SNWMn5/JjxK7DXI8Ie+M94hfeJDKBJ8BF8+Ulwi74Ex4lej965HhC3xXvEL7xIRaBJ0BH2iceGGi4VWSqiKUrd07nE6XK1ZoQlLtLTOYSCGxPtoAANQAAAAAAAADF7mXIpO0lEzK4ddzA7GSSrUuaXJEDqnJpqkTJ0Cf8AfOMGUAIxa5HhC3xXvEL7xI/muSYRt8N9xC+GTeFJPAIwEyk2EU5PT/MeJXwa5HhD3xnvEL7xIzKBJ8BGAmUpwi9vkx4ldj9a5HhC3xXvEL7xI2LQJOgNa2XxE2nxANJo7tZUC0yRk50k3Z1GCrfQOf3whRsoakAYbde7VD2WpFWvLhzE7CSprpIHckQO40Dn6ToExpTXI8IW+K94hfeJDKFJOgIxa5HhC3xXvEL7xIa5HhC3xXvEL7xIZQJOgIxa5HhC3xXvEL7xIa5HhC3xXvEL7xIZQJOgIxa5HhC3xXvEL7xIa5HhC3xXvEL7xIZQJOgIxa5HhC3xXvEL7xIa5HhC3xXvEL7xIZQJOgIxa5HhC3xXvEL7xIa5HhC3xXvEL7xIZQJOgIxa5HhC3xXvEL7xIa5HhC3xXvEL7xIZQJOgIxa5HhC3xXvEL7xIa5HhC3xXvEL7xIZQJOgMJtDeSgL6Uqas7cTU8ylJHJ2OqnaHb/hk/wC4oM2BIAANAAAAAAABD7Km7mAvCVgJgiH2VN3MBeEzATbpSoIAH7RRWXWK3boHUOobQIRPoznOYcy34AfX859W9qs3+YLB5z6t7VZv8wWAfIAfX859W9qs3+YLB5z6t7VZv8wWAfIAfX859W9qs3+YLB5z6t7VZv8AMFgHyAH1/OfVvarN/mCwec+re1Wb/MFgHyAH1/OfVvarN/mCwec+re1Wb/MFgHyAH1/OfVvarN/mCw+WsisgsZu4TOmdM+pnIfoDkOUB+BcxkwGZVsJkpjFcxs84mEc8PZNCH9RTOLn8lzuS5T3XmHhIAJV+Z0PXo/FgK8csM0IhSNsYp/ozKY+CRFjGeIr2yvcumMzpa2iEtl6rtSD+Zx0Sdb8EjtispZ6VaCQ2T9TgpjBtxCO0Z29j/wACuNIec+re1Wb/ADBYSDwCU1UcvxeW7dPpBMG6RHTuEVFGhiEhDmFcS1df5nQ9d/ywDzOh67/lgPdAVlKcYc1zr8pV92ceIfbc0fVqjlX/AKqzfp/7IsPH5z6t7VZv8wWEqfIAfVJStTnOZNOnJoodPpycyH6Afrzn1b2qzf5gsAscyOrYjmRXTMfai6k/1HQsW8zoeu/5YCu3JGqEpaT3PTqc0JMZZxKDppvzFQjmjB36qMBYP58KRht1TKPnyX3hWUpxe35nQ9d/ywDzOh67/lgPQWrmiW+jzRWEkT045i6cwShnj2Nkw8vnwpLtplHz5L7wZSYw9rzOh67/AJYB5nQ9d/ywHpKVnR6JDLLVXJSEJDOY5n6UIFh7ecfxOtKOWIVVOrJMdM0M5TQfpRgb/EMpMYe/5nQ9fN/AUP40k4J4q7nQhtFn68Rer58KS7aZR8+S+8KOsYcjnU7xPXJmUmlL58zWnyx0nDVAyyR45vYDKVNCgPr+c+re1Wb/ADBYei/lUylRyt5pLnTQ6hNUIRdM5PrCR6wmhknG8FcTb9Q21Ckn/KWoheJj5KycSmR4mJg6nU0aS5FWlXpCGcLkSKoczhrtZwFwXmdD13/LAPM6Hrv+WA9Xz4Ul20yj58l94fhSs6PRIZZaq5KQhIZzHM/ShAsPbzispTjD3fM6Hrv+WAeZ0PXf8sB6KdaUcsQqqdWSY6ZoZymg/SjA3+I8nnwpLtplHz5L7wZSYwoFxIboe6XDSecuONdDYeIpZF1iEue4bnIoRSsp4oQ6fw4414JUAPbYSeazXS8y5c6d6n0+oIHV0Pij3POfVvarN/mCwD5AD3X8kncqIVSaSd60Ip0h10DkHpAN1YLU4KYq7YwjtGn6ERe/5n5i5orx+LAUQ4LDFLittfCHXqBGH+AvrFZSPS8zoeu/5YB5nQ9d/wAsB7o+R58KS7aZR8+S+8GUpxh7XmdD13/LAPM6Hrv+WA9Xz4Ul20yj58l94eMlcUUoqdElXyQyifTkhMEomL7cNLYDKTGHveZ0PXf8sA8zoeu/5YD1fPhSXbTKPnyX3h4zVxRRFCInq+SFUU6QkZglCJvahpbIZSYw97zOh67/AJYCOeUQZang3uIYq5oRgnLY54902okF58KS7aZR8+S+8I65QuoqefYO7itGM+lq6xkpbCCabtMxvzm162cMpMVJQAAlQA+m2pWp3aJXDOnJougoToDkaHOQ48nnPq3tVm/zBYB8gB5XLZyxWMzeIHQXT6ch09A5B4gFneR8alc0jck5tqM0l/8AgQ0f6Cw/zOh69H4sBXtkdI5qTud3SlnglhYnniKylnpEPKftNRwmTbRVjDNOJfHPH2DRh/QUzi5/Kjbkubd15f4SIpgEtAH7RRWXWK3bpnUOofUyEJ0ZznMPqec+re1Wb/MFgHyAH1/OfVvarN/mCwec+re1Wb/MFgHyAH1/OfVvarN/mCwec+re1Wb/ADBYB8gB9fzn1b2qzf5gsHnPq3tVm/zBYB8gB9fzn1b2qzf5gsHnPq3tVm/zBYB8gB9fzn1b2qzf5gsHnPq3tVm/zBYB8gB+1kVkFjN3CB0zpm0DkU6A5DlH4AW+5LLcwG4SvxMEQ+yWW5gNwlfiYI6adPOwAAKYAAAAAAAIfZU3cwF4TMBMEQ+ypu5gLwmYCbdKVBDPbA9Xi2/C2TcrTGBDPbA9Xi2/C2TcrTHMt0MgAAAAAAAAAAAAAAAAOdS6/VRrHhBMeUHHRWOdS6/VRrHhBMeUHAYoLn8lzuS5T3XmHhICmAXP5LnclynuvMPCQAS3AAAAAAAAAAAAAAAAFY+WQ/Pdqvgs4+u0FcIseyyH57tV8FnH12grhAAAAAAAAF9mCzcp2v4PN/6ihMX2YLNyna/g83/qA3UKnssD1aKJ4Lx5UsLYRVDlgurHRHBg3LFAEBwAAAAAAAAAAAAFu2SWkUlSw+TepUpW0JNnlSu2y7wiZYLKokQbxTKeMOxn2hOAQtyTO5gmHC19ydqJpAIC5YEkDWgoeMetUkfAGFUYteywPUaojhMbkqoqhAbpwXkKfFZbDS2y1E3jD+AvtFCmCrdWWv4QI/QL6wAc5VxfT/VHdl54Y46NRzlXF9P9Td2XvhjgMeAAAAAAAAAAHlbfhHKXuyDxDytfylL3ZAHSFI5JJqalLWQ09K2sulrFKCLZo1SKmkiSG0UpS7EID3wABRdlAylLjCuTHsvGfIEBHoSHyg27FuN8KacgQEeAFoWRzKXzqXOOX9KYyzwSwsUFduR09KNze6cu8EsLEgESMqNuS5t3Xl/hIimAXP5UbclzbuvL/CRFMADK7UdVGjuEEu5QQdFY51LUdVGjuEEu5QQdFYAAAAAAAAAAAAAAAAAOea/3V4uRwtnPK1BgQz2/3V4uRwtnPK1BgQC33JZbmA3CV+JgiH2Sy3MBuEr8TBHTTp52AABTAAAAAAABD7Km7mAvCZgJgiH2VN3MBeEzATbpSoIZ7YHq8W34WyblaYwIZ7YHq8W34WyblaY5luhkAABS9iExjYmqUv1cSmKeu/O2EslVVzVkxapRJqaDdF0chCQ/dsDX3PxYs9/GoPiQGNYpN0xdfhpOuWnGsAG9OfixZ7+NQfEgHPxYs9/GoPiQGiwAb05+LFnv41B8SAc/Fiz38ag+JAaLABMPDFi9xJ1liFt7StVXdnkylE1n7Rm8bKRJqa6ZjbMI+wLkxQZg83UtruE7LwovzABzqXX6qNY8IJjyg46KxzqXX6qNY8IJjyg4DFBc/kudyXKe68w8JAUwC5/Jc7kuU915h4SACW4AAAAAAAAAAAAAAAArCyx/pitd8DmnhG4rmFj2WQ/Pdqvgs4+u0FcIDfWCC0lJXqxG05RFcEcKSoyTh8oikcpYLRbE1YiR82zmFtHON4St4qm/iKffFZeTD3XlPdzJpyQXUAI215giwqtKHqJ0xsvIWrhGUPDJrp6rA5DQRNmjCOlHsQFHY6NbidT+pu4z3wBxzlAA25SOLTEhQdOtKWpK8E+l0plqepM2hTEOVFPsDUYAN6c/Fiz38ag+JAa7uZd25d45o1nVzavmE/eMEOZWyrmGaBEtPSGHgAAAAAAAAAAAuYw24HsMjmxNCTyorasagmU5p9jNnL2ZmOoqZR03TVPDpoZoZ4/4DZXON4St4qm/iKffGXYbtzta3gXJOQojYwDFLcWtt/aKQqUvbelmcglSro70zRppaEVjwLAx+ijGOeMCl/gMrAAEA8sETTtJQ0P/AFEfwBhVKLXssD1GqI4TG5KqKoQG6MGCeqYq7Xm9TUbaP+AvuFCmCrdWWv4QI/QL6wAaOc4JMKTpwq8dWTkKyyxonUOfVjGNH443iADRfON4St4qm/iKffFU2Pq3VF2vxM1BSFBSNvJZMiylx0mbeGZMhztSC80Ur5TzdeVD3MlfJAEURNPJl4fLX3wrGsH1zJJ5st6YaM4Npat+THM4gpA51IQ247G0IWCx7I3/AJ7ur8Fk/wBd2AmJzjeEreKpv4in3xorHDhTw724wuVzWtDWokkmnkvSl3Mz5sQ8FE4xmLUu3pR6wnSI35RbcaXF97ln8zagKOR/SH1M4/gAN4o438WSCRS+jpUho9mJkzj98/Fiz38ag+JAaLABcbhfsDZm/wDYmkrx3noCV1ZWdSN1lZnOZjA8XDhRNwqkWMY54ZoZi7Q2rzjeEreKpv4in3x8rJ77ju3PwZ9y9wJEgMGtnZS1lm0ZihbGi2FOoTQ6arsjPShBU5IRgWMYRjHahGIzkAARIyo25Lm3deX+EiKYBc/lRtyXNu68v8JEUwAMrtR1UaO4QS7lBB0VjnUtR1UaO4QS7lBB0VgAprxO4vsSlG4hLh0rSt3Z5LZRKagds2bZOJNTQTKbah7AuUFBmMPdS3R4TvfCgPo8/Fiz38ag+JAOfixZ7+NQfEgNFgA3pz8WLPfxqD4kA5+LFnv41B8SA0WADenPxYs9/GoPiQGwcPeMbE1Vd+rd0xUN352/lk1quVMnzVWJNTXbrOiEOSP7tgRKGz8Le6YtRw0kvLSAOgcAABzzX+6vFyOFs55WoMCGe3+6vFyOFs55WoMCAW+5LLcwG4SvxMEQ+yWW5gNwlfiYI6adPOwAAKYAAAAAAAIfZU3cwF4TMBMEQ+ypu5gLwmYCbdKVBDPbA9Xi2/C2TcrTGBDPbA9Xi2/C2TcrTHMt0MgAAOfjFJumLr8NJ1y041gNn4pN0xdfhpOuWnGsAAAAAAAAbjwebqW13Cdl4UX5igzB5upbXcJ2XhRfmADnUuv1Uax4QTHlBx0VjnUuv1Uax4QTHlBwGKC5/Jc7kuU915h4SApgFz+S53Jcp7rzDwkAEtxF/HBixqjCpKqTm1NUrK5154XTtusR+udOCepEIaEYRL7r/ASgFduWL9KNsu6cx8EiA17rwt0d6GlPnzkeJfLB3aMmYzW01JwjDsqPDfQIBAAsC14W6O9DSnz5yGvC3R3oaU+fORX6ADpTSPqiRT+qhnH7Hia/kyXvZfoHlAV+Yn8pRX1hr5VNaiTW5kEzaSCLSBXTtdwRRTVmhV9nR2P0ow2Bq7Xhbo70NKfPnI0flFd2XcT32WfytoI2gN94rcXFS4rXlOvajpGVSWFOJuipFZrKKRUirCENuPsQgNCAADZGH2+E+w83QY3PpqTsJk8l6LhuVs9MeCRyKk1M+aJBLrXhbo70NKfPnIr9ABPOf5W+589kUwkhrT0snCYM12xj81Oeg0yxL9ERAwAABYJhsyYlPXetDJrlVxcWYy1aoEoPGjeUppxSTax2oZ49eOaIr7F9mCzcp2v4PN/6gI0az3a/feqr5o3+wQ2xt4X5FhZr6Q0nTtUvpw1nMn80FFXxCFOmfmg6fWF5QqhywXVjojgwbligCA43LhNw8rYmbtIW9hOyypoiyNMX7gsM6kW5DpkNBL2YxGmhNPJL7p2ZcEX/ACloAkDrPVrt96qfmjf7Bi11MlVbS31sKvrppdSpXLim5BMZug3O2blIoo3QUVhn2OzDN+8WVjXOJHc7XS4FzvkKwDnvAAAdB+Gzc6Ws4FSPkKI2ONc4btzta3gXJOQojYwCEGMjH5WuGS7aFu6foGSTpotJ0pmZw8XVTOQxznLGHQ7GboRorXhbo70NKfPnIxDK0bp2W8EWHKXYhYAshou4L7KnTJxau4rFtRbGj0PN9FxIzGXUcKRUKjoGgtsQhDPHagM01nu1++9VXzRv9g1FkferHW/BgvLExa8AhTabJg2/tFcmnblSe5tQv31OvSPU0HTdHU1Iw60c20JrAAAAAACI+ITJ10TiGujMLpT24s9lTx+g3bxbNW6RkyESIUsNk2zHPoiXAAK/tZ7tfvvVV80b/YMXriXEyUhGk4tuoat1Lkni2dknUNS5ngyzRgYmo9aPNW17AspFcWWQ/MVq/hc4+o1AYRrwt0d6GlPnzkfTpjGTVOPKeNcJ9Z0XLaZlNeaoRxMpW4UUcNuZCRelzQNHNCMeZRXUJJZOrdl2799mf8rdgJh6z3a/feqr5o3+wfzWerXb71U/NG/2CwIAFfaWR6toQsIK3iqc+b1LFuUfvWe7X771VfNG/wBgsBABgVj7USyxlq5DayUzReYtZCmski5cFKVVXVFlFo54Q2M+c8YfuGegAAAAAiRlRtyXNu68v8JEUwC5/Kjbkubd15f4SIpgAZXajqo0dwgl3KCDorHOpajqo0dwgl3KCDorABQZjD3Ut0eE73wovzFBmMPdS3R4TvfCgNOAAAAAAANn4W90xajhpJeWkGsBs/C3umLUcNJLy0gDoHAAAc81/urxcjhbOeVqDAhnt/urxcjhbOeVqDAgFvuSy3MBuEr8TBEPslluYDcJX4mCOmnTzsAACmAAAAAAACH2VN3MBeEzATBEPsqbuYC8JmAm3SlQQz2wPV4tvwtk3K0xgQz2wPV4tvwtk3K0xzLdDIAADn4xSbpi6/DSdctONYDZ+KTdMXX4aTrlpxrAAAAAAAAG48Hm6ltdwnZeFF+YoMwebqW13Cdl4UX5gA51Lr9VGseEEx5QcdFY51Lr9VGseEEx5QcBigufyXO5LlPdeYeEgKYBc/kudyXKe68w8JABLcVzZY9TRpq16fqn0zj/AAg1+0WMiu3LF+lG2XdOY+CRAVdj7VG0bUdwapl9G0jK1pjNpqroN26KZzGOPiiQ+T53YtufhTvkC4DYGtT4pvV0jxof7A1qfFN6ukeND/YLjwAQ2hlV8LSREyGRrOGlDNDPJyeNDXXMLPrNacTk8aKd3X5Sr7s48QCe93MJ118bFw5rids2pJ4UfWkUzS4s2cRbuszVMjM+mnDPo5ztIxzZxh+tT4pvV0jxof7BP/J07jS3Xvcz/mboSQAU2xyVeKmCxYkSpOBYdfzWN9g/etT4pvV0jxof7BceACm1TJV4qYfiU6T42N9g/etT4pfVUhxof7BceACm+OSoxTQKaBS0jGMf9qn+wIZKjFNEpYGLSMIw/wBqn+wXIAApw1qfFN6ukeND/YJQ21xwWWwvULJsPlzy1B56KBalks0jLZdBwhq6fYMU0NvP2BO4UKY1d1ZdDhAt9ACyLXXMLPrNacTk8aIL5QDElbnErcOmqktt5rQZymSxZOYzBnBsbTi5ObrxiItAACQ+Be/tD4cb0OK/r5vNlZY4kriWQjL2xVzEOZRM+1CMOx2RHgAFxuuuYWfWa04nJ40YleHKZYaq3tLW1FySFXxmE/pyYyxpA8m0IRVXbKJk2Ynj1459oVPgAAAAOg7DVHPhztWbs0TI4/8AAIjZA1zhu3O1reBck5CiNjAK+8duB+9eIm9Dau7eRkEJYnI0Jafm96ZI8VCKHPGMIQhHY6KAjprU+Kb1dI8aH+wXHgAgrk/8HN38NVw6lqW4/mHBnN5KVi35geGWNqkFyH2c8NrNCInUAAMZuTX8jtZQk6uHU0HMZXIWpnbrmdOB1NCGbPmLnhn2xFzXXMLPrNacTk8aNv409yndDg84/oKEwFxuuuYWfWa04nJ40fgmVfwvHJA8GFbwhHsylHx4p1ABcbrrmFn1mtOJyeNEjbKXlpC/NANbj0OV9CVO11kCQeIairppHiU2cuePXgOeUXUZMPciU73SmXKTAJXCH+UKwu3MxLy6h2dtTSkilPrzBV4Z+5ijDRWIjCGbNt9IYTAABThrU+Kb1dI8aH+wbfwj5Pq/tk8Q1I3PrFSmjSiSnexcQaP1FVfwzRZGGaEYbPTF/iLMAAB4zn1MhlB5B4nX5Mr72b6AEO9dcws+s1pxOTxoa65hZ9ZrTicnjRTkAC4kuVgwumjGHMNbwzdmUo+PHk11zCz6zWnE5PGinIAF++HrFFbTEyznUwtqnOIN5Eqii5NMGfM8dNQsTFhCGePWLEbfFduR09KNze6cu8EsLEgESMqNuS5t3Xl/hIimAXP5UbclzbuvL/CRFMADK7UdVGjuEEu5QQdFY51LUdVGjuEEu5QQdFYAKDMYe6lujwne+FF+YoMxh7qW6PCd74UBpwAAAAAABs/C3umLUcNJLy0g1gNn4W90xajhpJeWkAdA4AADnmv91eLkcLZzytQYEM9v91eLkcLZzytQYEAt9yWW5gNwlfiYIh9kstzAbhK/EwR006edgAAUwAAAAAAAQ+ypu5gLwmYCYIh9lTdzAXhMwE26UqCGe2B6vFt+Fsm5WmMCGe2B6vFt+Fsm5WmOZboZAAAUW4kbJ3jnuIW5c5k9p6yfS99V03ctHbWRulEnCZnp80YRhsRh7MBrj0Ab8byded7Lv7g6GQAc83oA343k6872Xf3A9AG/G8nXney7+4OhkAHPN6AN+N5OvO9l39wPQBvxvJ153su/uDoZABR9hRsxeOQYlLbzue2qrGXS5lUTRVy7dyJ0iimQptvPHYh+8XggAAOdS6/VRrHhBMeUHHRWOdS6/VRrHhBMeUHAYoLn8lzuS5T3XmHhICmAXP5LnclynuvMPCQAS3FdWWNMWFKWxz/rGZ+CRFiorpyxpCmpS2MY9aYzTwKICr8SHyfhiFxg23hDrvHkP+AXEeBIfJ+FIbGDbeMOs8eR/wCAXAXngAAOepzYG+vNKv8A+i1ed7rv7g8foA343k6872Xf3B0MgAj5gFkc6pnCTQUjqOUPZXMmhJiVw0eoxSWSNGYuYwgYsdqOaMI+1GAkGAAMeqm4lAUMdBOta6p+nzOYRMiWaTNBpFWENuJdUMXPm9gfD9H6xG/XQXfIz8YICZZD892q+Czj67QVwgOimQ3dtRVUwTlFL3NpOcv1oRMm1l86bOFjwht5iEPGMRlopXyYe68p7uZNOSC6gAAAABSNi9s1d+ocTNxZ1IrU1jNJc8nqyjV0zkzhdFTY60YbERdyADnm9AG/G8nXney7+4MZqej6tot+lK60pWbyJ0olq5G01YLNDnJ6spFB0fip/LA9Wih+C5uWKAIEgAAAANg4eGzZ9iBtkzeIEXQXrCTJrInT0yHIZ8QB66Nh75O0SuG9ma5UIoQpyHJTrs5Dk+IPJ6AN+N5OvO9l39wdCLVq3ZN02bNEiCCBSkSSITRKQsNosID2AGirGXftJS9lLf0zUt0KRk03k9KyhjMJe+nrVFy0cJs0inRVIY8DEMWMI54RhAZx6P1iN+ugu+Rn4wUW4lN0VdHhrPOXHGuAHR9TVY0lWjE0zo2qJRPmZDxSM4lj5J0kU8IZ9GJ0zRhCPsbY+wIW5JncwTDha+5O1E0gAAABp7GBKppPMMdx5PJJc6fv3ciXTbt2qcTqqH2IwhCEPaFI/oA343k6872Xf3B0MgA55vQBvxvJ153su/uD8o2HvkuQqjezNcqE4Ou/uDobABzzegDfjeTrzvZd/cFvmTlp6oKUwryCS1RI5hKJik/mBlWj5rFBVPO4Ntlj9Ik6AAPg1RX9CUPzP59K0kUgg70uZ4zSYotdV0em0dUNDSzdfMPvCuLLIfmK1fwucfUagJwej9YjfroLvkZ+MHvSW8NpKlmaUlpy6VIzWYr7KTRlO2q6ynuSEPE0f3QHOwJJZOrdl2799mf8rdgLxB4nX5Mr72b6B5QAc83oA343k6872Xf3A9AG/G8nXney7+4OhkAHNtOJJOKcmS8jqCVPZbMWh9Tcs3bc6SyPuiGHpCQ+UDKQuMG5EY9d4zj/AMAgI8ALQcjkYsaUudm/WMs8EsLFRXVkcywLSlzoQ/WMs8EsLFQESMqNuS5t3Xl/hIimAXP5UbclzbuvL/CRFMADK7UdVGjuEEu5QQdFY51LUdVGjuEEu5QQdFYAKPcV1mLxz/EncidyK1VYzGXPaieqtnbOROl0VCGNt54bEf3C8IAHPN6AN+N5OvO9l39wPQBvxvJ153su/uDoZABzzegDfjeTrzvZd/cD0Ab8byded7Lv7g6GQAc83oA343k6872Xf3BsfDdZa8cixC20nE7tPWTGXsaulDl27dSN0mk3TK9JsxjHYhD2Yi9IAAAABzzX+6vFyOFs55WoMCGe3+6vFyOFs55WoMCAW+5LLcwG4SvxMEQ+yWW5gNwlfiYI6adPOwAAKYAAAAAAAIfZU3cwF4TMBMEQ+ypu5gLwmYCbdKVBDPbA9Xi23C2TcuIMCHsy1+/kz9tOJW+XaPWCpV2zlBTQWRWTPpEOU5ekOUcy3SaA5+eekxM/tB3G753oc9JiZ/aDuN3zvQHQMA5+eekxM/tB3G753oc9JiZ/aDuN3zvQHQMA5+eekxM/tB3G753oc9JiZ/aDuN3zvQHQMA5+eekxM/tB3G753oc9JiZ/aDuN3zvQHQMA5+eekxM/tB3G753oc9JiZ/aDuN3zvQHQMOdS6/VRrHhBMeUHGS89JiZ/aDuN3zvRrZ48eTJ4vMJg6Ou6dqnXWWUU0znObojnMA8AufyXO5LlPdeYeEgKYBc/kudyXKe68w8JABLcV25Yv0o2y7pzHwSIsSFc+WOhnpm2Hw6afUbAKwRIfJ87sW3Pwp3yBcR4Ehcn4XSxhW3j2HjvkC4C9EAAAAc/q+KLEsRZRMmIO4+xtf8AWd6PHz0mJn9oO43fO9AdAwDQOA2pqhrHCfQlTVZPJhOJs+JMDOn0wcGXcLmLMHJYROc2zGOYsIe1CA38ArHyyH57tV8FnH12grhFjOWP9MVrvgc08I3FcwCV2TD3XlPdzJpyQXUClLJjQz4vqZN2GEz5EcXWgAD4FdLOGtEVC7bLGRWQlTtRJQkcxiHKieJTQj1owFDHPSYmf2g7jd870B0DAOfnnpMTP7Qdxu+d6LqcJE+nNT4a7d1DUc3ezSZzCRorunjxcyyy6kc+c5jm2YxiA26KocsF1Y6I4MG5YoLXhU7lgOrVRfBWPK1gECwASiyc1p6Gu/iKLJrgSdKasZbJlpuk0VTKdEy6ayEIFVIb2wEXRsfDXuirXcNZHy4gu+51nDR+z9bvvaZ+LGGXssBY2i7N13WVHWeouRT6QUzNZpK5pLpE2bvGTtFoqoksksQkDEMU0M8IwiAkIA5+eekxM/tB3G753oc9JiZ/aDuN3zvQHrYlN0VdHhrPOXHGuBelZOwFjazs1QlY1jZ+i59Pp9TMqmc0msxkTZw7fO1miSiqyyxyRMcxjRzxjGIzPnWcNH7P1u+9pn4sBH7JM7mCYcLX3J2omkKkcoJWNXYe76M6HsXVE3t1Tp6fbzA0ppV4aWMjuFFVynXOi3hDsQ63WEZ+ekxM/tB3G753oDoGAVoZLK792LkXUrCWXEuZVVStmcgK4bt5xNVXZUVIuSQ0oaWxnzRjD94svAAGosW89nNMYa7iVDTs3eyuZy+RrrtXjNcyKyCkM2YxTl2YRgKVuekxM/tB3G753oDoGAc/PPSYmf2g7jd870X00K7cPaIp587XOu4cSpoqqqc2kZQ5kSxMaMevGMYxjnAfdABUflD76XqoHFHPaboe71Z0/KUpdLlSMpbOlmrcih2+eMc0NiGeOzHN1wFuAriyyH5itX8LnH1Gogtz0mJn9oO43fO9Ez8m0qriSmteNcQq57mJU+jLVpWnVxozcjI6sV9OKMXJY5s+aEM+bPtAK4BJLJ1bsu3fvsz/AJW7FufOs4aP2frd97TPxY0njMtTa+zeGutbl2mt5T1F1XJ0mPmdO6dliEvftIqP2yZoprpFgaHQxjsbQCXoDn556TEz+0Hcbvnej9o4o8Sh1ipnxA3Fh/8Ac73xoDoDAAAUYZQbdi3G+FNOQICPAkLlAy6OMK5Eey8acgQEegFomR09KNze6cu8EsLEhXPkcYZqZuf8Olf1HIsYARIyo25Lm3deX+EiKYBc/lRtyXNu68v8JEUwAMrtR1UaO4QS7lBB0VjmwZvHkteITCXujoOmipF0Vk1NA5Dl6IhyjZPPSYmf2g7jd870B0DAOfnnpMTP7Qdxu+d6HPSYmf2g7jd870B0DAOfnnpMTP7Qdxu+d6HPSYmf2g7jd870B0DAOfnnpMTP7Qdxu+d6HPSYmf2g7jd870B0DAOfnnpMTP7Qdxu+d6HPSYmf2g7jd870B0DAOfnnpMTP7Qdxu+d6HPSYmf2g7jd870B8y/3V4uTwtnPLjjAh7Myfv5y/cziaPl3b1+qZdy5XU01lllD6RzmObpzmHrALfclluYDcJX4mCIfZLLcwG4SvxMEdNOnnYAAFMAAAAAAAEPsqbuYC8JmAmCNb37sPSGImhi0BW76btJem+SfacqUIitpp++EMMspQSAt2a5JTDQsmeJqquKaEY5tmZsv6NYjza0fhn7ari8atPJRyrVBgLfNaPwz9tVxeNWnkoa0fhn7ari8atPJQFQYC3zWj8M/bVcXjVp5KGtH4Z+2q4vGrTyUBUGAt81o/DP21XF41aeShrR+GftquLxq08lAVBgLfNaPwz9tVxeNWnkoa0fhn7ari8atPJQFQYC3zWj8M/bVcXjVp5KGtH4Z+2q4vGrTyUBUGAt81o/DP21XF41aeShrR+GftquLxq08lAVBi5/Jc7kuU915h4SAxzWj8M/bVcXjVp5KJK2JsdSWHm3iFtqHfTV1K27hZ0RSZqkVX01I5zZzEISEYbHYAbFFduWL9KNsu6cx8EiLEhXPljtKFM2wjD+3TT6jYBWCJD5Pndi25+FO+QLiPAkLgA1XnwLb59rmxzyNcBeiAAA5rnX5Sr7s48Q8rr8pV92ceIBeNk6dxpbr3uZ/zN0JICk6zGUVvhYu28ltdSFP0a6lMlIvBseZMXJ18yrhVbozFclh+lH+IzXXb8S/arbvix75SA2JlkPz3ar4LOPrtBXCLLbKMEMqUlN5tiFPGSr26URbyuFIRizKoR5pmUitBzFxnjnbF2NjbGz9aPwz9tVxeNWnkoCGOTD3XlPdzJpyQXUCvS6uGSgsn3RrnEzZWZz6a1TI1U2LdvUrpNwyOR2aCJ4GIgmibaNDZgYaO12/Ev2q274se+UgLW7idT+pu4z3wBxzlCZ86yrmI6dyd7J3lK29I3fNlmx1CS55HNGMM0f8AvPYiIYAAvswWblO1/B5v/UUJiWdscpZfu09ASO3VM07RC8skLIjNqd6wdRWjCG1nzOYZ9sBdGKocsF1Y6I4MG5YoPg67fiX7Vbd8WPfKRoDEZiar/E/Usqqm4EskLNzKmMZe2JKkDpE0YnUPHS1U6gDUgmnkl907MuCL/lLQQsEz8k9uoHfBR94dABcONc4kdztdLgXO+QrDYw+DXFJS+vKNntETZVZJlUMsdSl0q3jAqpEXCRk1IkjGEYQNmNHNnhH/AAAc44C3zWj8M/bVcXjVp5KGtH4Z+2q4vGrTyUBJTDdudrW8C5JyFEbGHwKFpNjQNHyOh5Yusszp+WNZU1VcGLFU6LdIqZIn0YQhGOaGz/zH3wFPmVo3Tst4IsOUuxCwXjX/AMBtnMR9bpV9Xc8qxnMkWJJeQsqeN0koJFjGMOhUQPHPs9ka11o/DP21XF41aeSgI+ZH/qyVvwYLywgtdFcF5rfybJhyRjdDD+s8nU3q135hPi1YoVy3I3zxWzlI2KhmjCJY9cai12/Ev2q274se+UgLEsae5Tuhwecf0FCYnvQ+Ou8GLGr5ThyuLI6TYUxX7iEomjiTt3KDwrdT1kyiykOtt5hIXWj8M/bVcXjVp5KAqDHRrbvqf0z3GZeAIIja0fhn7ari8atPJRMyTSpCSSdjJWxjGRYNkmpDH2TGIQsCwz/ugA94Ur5TzdeVD3MlfJBdQKU8pvpc9/U+ba5glnIiAIqix7I3/nu6vwWT/XdiuEWMZHDShUd0Cx/sMr8I4AWfCN+UW3Glxfe5Z/M2okgI3ZRjcZ3F97ln8zagKOh5Wv5Sl7sg8Q8rX8pS92QB0ogAAKMMoNuxbjfCmnIEBHgXVXfycdi71XHnFzatqKtm82nhiGcJy982TQhoplThmKdueO1CG3EYjrR+GftquLxq08lAYPkdPSjc3unLvBLCxIaaw34Vrd4XpdOpZb6a1A9Rny6Th1GbuUVjQOmWJS6MU0k80Mxo7ecblARIyo25Lm3deX+EiKYB0JX4sdSWIa3y9tq2ezVrK3DlF0c8tXIktpJxzlhAxyGhm2ewI060fhn7ari8atPJQFQYC3zWj8M/bVcXjVp5KGtH4Z+2q4vGrTyUBUGAt81o/DP21XF41aeShrR+GftquLxq08lAVBgLfNaPwz9tVxeNWnkoa0fhn7ari8atPJQFQYC3zWj8M/bVcXjVp5KGtH4Z+2q4vGrTyUBUGAt81o/DP21XF41aeShrR+GftquLxq08lAVBgLfNaPwz9tVxeNWnkoa0fhn7ari8atPJQFQYC3zWj8M/bVcXjVp5KPA6ySeGhIpTFqq4pc3YmbL+rWAD2MlluYDcJX4mCNb2EsPSGHahjUBRD6bu5eo+Vfac1UIstpqe9kKNkDqp0gAAGpAAAAAAAABrHEJfymMOFAluHVcmmkyZHfJMdRl2hqump74cowbcl/4o3uh7QgY3yutiWxNA1uq8j7OizN9LgfZo7KqWbrOrZLRspt/WCbyezFvLm8V0kSEKoqcqcP0+tGI57dvVNoAASAAAAAAAANPYmcTNKYXqSldYVfIprNGk0mMJcQkvKUxyHimY+eMDRhsZiREcdd9sRvdV38i08eAneAhrbHKfWhuncOn7cyWhauavqjfoy9ss6SQKiVQ+1njA8Y5hMoAABB2ocrFZim6gmVOvrd1mdxK3qzFWJEkIwidM2aP6YCcQCCGu+2I3uq7+RaePH8hlfbHR/wDDauPiNPHAJ4Cu3LF+lG2XdOY+CRGR677Yje6rv5Fp48RZx24zqCxUyKkZVRtMT6VnkDt24cGmREiQMRVNOGbNnj2AEPhIfJ87sW3Pwp3yBcR4Gz8M92JVY++VK3VnkrdTFlIFnBlm7T8cbVGyiYDoHAQQ132xG91XfyLTx4a77Yje6rv5Fp48BU66/KVfdnHiH7WPprGU9cMPwAAJRYfcnpebEJQRLiyabU9I5U8UMVhGbnVjF4mU6hTKF1Ehs0Bs3Wgr7b5FBfKPPEANlZG/8xXU+Fyf6joWOiKOBDCdXGFVnWUvrWopDNj1GqxWQPK4rZiQRgtCMD6oQvq4bXYiJXAIo5TzciVF3SlvKSilcXS5T88SYSJ4aH61lnKCiloAAedgwczV+2lcvQ1R07VIgiT1ZzdCQTbk2SRv5M5QzmbutaKlazlsmsdk4UdRO2UjDPEholRzRAQdATt1oC+2+PQXyrzxAFyQl+4bdxLf/LvfJwEEgE7daAvtvj0F8q88QI54mMMlZYXKslNIVpOJTNnE3l0ZiitLDHilowOoloHgqQoDTwmnkl907MuCL/lLQQsEzsk8qaGKFynH9KlH3hkAFxAAAAAAAAIUVxlULPUDWlQ0PNaArJd9Tc0dyt0dBJCJDKIKmTjmjp7WeA+PrvtiN7qu/kWnjwE7wECy5X6ykemtpWpfbI3++PLrvtiN7qu/kWnjwHrZYHqNURwmNyVUVQizS51wJVlSZY0tbZhm7paYUe488DpeqCwTSUSzxQ0Ccz6tnjGJhrrWgr7b5FBfKPPEAI94Kt1Za/hAj9AvrFa9g8mReC0N56PuVOK5o17LqcmRHy7VoZ1BZTNt6MTJZv4iygAABB2d5WiyMinT6SOrdVydZi5i2UiRFpGGeHX/AB4CcQpXynm68qHuZK+SCXOu+2I3uq7+RaePGqK+wv1plDqocYn7Xz2R07Ts8SJLm7GexWI9IdqWKJzm1EqhIZ4wjmhnAV3ix7I3/nu6vwWT/XdjENaCvtvkUF8o88QJU4EMHFe4VZnWLutKlkE2hUaLMiHmWZeME9SipsR1UhesbrAJfCN+UW3Glxfe5Z/M2okgNSYq7TTm+NhKptTT0xZMZlPitCoOHkDainFJ4itGJs2ztJ/xjABQIPK1/KUvdkE6NaAvtvj0F8q88QP2nkhb7ImitG49BRND/wA155OAtmAQQ132xG91XfyLTx4a77Yje6rv5Fp48BO8Bg9lLsSW+FsZHdKn5e8YsJ6moqi3eQhBYkCKmTjpQhGMNskf4jOAABH3E9jOoHCvNJFK6zpmfTVSft13CEZYVGOjBLbhHVDlGktd9sRvdV38i08eAneAgZrvtlI9LbWtY/7jf74/eu/2H3uq7+RaePATwAQPNlfbGQ/8Nq6+SaeOAuV9sZH/AMNq6+SaeOATwAQP13+w+91XfyLTx4/Gu/WU3tK1+I3++AnmAghrvtiN7qu/kWnjx+Nd9slvb1p8Rv8AfATyAQQ132xG91XfyLTx42rhtx522xN167oCj6QqaVvGksUmh1ZmmgUmplVKnm6BQ0c8YmASaAAAAAAH5htj13/SE90IXVhlVbOUVV07o+aW/rFR5Ipi4lzgyCSJyGUSUMSOaOn2Sj4zrK7WKcJQKS3VeQz9fQZl+hwKr2yU3AGscPd/KYxH0Ca4dKSaaS1kR8qx1GY6Gq6afvZzDZw6HmAADQAAAAAAAQ+ypu5gLwlYCYIh5lUDkTwxocJmHglxNulKhBntgerxbfhbJuVpjAhndh1iIXyt24U6ROqpQof52Qcy3Q2AAAANUzrFZhwpycv6en96KUl8ylblRm8auJgQiiCxI5jENCO1GER6XPi4Wd/qjOM0/tAbjAaY583Ctq3M/o8Ujqnqeb4Dyc+LhZ3+qM4zT+0BHPK+9QikeFifJHAqYFqOUAqmnsVFs5BROHObNrizyVT0kzfMKfOV0sg1ggqSKpoQ2tk2aHZEEec7xTbwlacVmAMHm6ltdwnZeFF+Ypbwu4XcRNIYibd1PU9maslsoltQtHLx45l5iJoJlNtx9j2RdIADnUuv1Uax4QTHlBx0Vii64mEvEvNrgVPN5dYysXDN5OHjhBROVmzKJmXzw/w2QEegG4+c7xTbwlacVmGuKyoir7d1AtStdU69kc2akIoqxek1JUhFCaRNIgD4YAPuUVQtY3Hn6NK0LTUwnk2WIdRJiyQ1VU5Ck0jgPhgNx853im3hK04rMPGphBxSJFMc1hK4NHsQk6pwGoAG4+c7xTbwlacVmDnO8U28JWnFZgGnAG308IOKRUpTlsJXBY9iMnVIPJzneKbeErTiswC2PJ07jS3Xvcz/AJm6EkBoXAtSVTUJhWoak6xkT2TzmXEmBHbJ4XMsiY0wcHhA0PZgaEfajAb6AAGFXBvTai06zJvcqv5NTikxgYzWEwcQS1WBdvNn7AxHnxcLO/1RnGaf2gNaZTzciVF3SlvKSilcWw5QnEdYm4eGSd0pQ91qdnk2dP2Bk2bF6RRQ5YOIZ/oFTwDIbden+me7LLwxB0ajnEol42ltZyGYPFyINWk0arrH9QQqxBesTGThZULA5L70hGEev5oFAblAac58XCzv9UZxmn9o2fTVUU9WMiZVNS03bTOVTJLVmjtubSTWJ6osewA+oKocsF1Y6I4MG5YoLXhWzlQrH3furdWkZnba28+qNqwp4zZyvLmcVipHM5UjAsc3XzbOYBWeJp5JfdOzLgi/5S0Gj+c7xTbwlacVmEicCNC1lhgvS5uLiCpt/b6mV5EvLCTSepRatzujqpnKlDPsbUI5vaAW1ANOc+LhZ3+qM4zT+0fw+MjCymXSNfij4Q7olAbkAaaJjJwsKQ0iX5o+MI/7RKP1z4uFnf6ozjNP7QFKeJTdFXR4azzlxxrgZ3ficSqoL5XEqCRviO5dMqqmztm5T6RZFR2cxDlGCAADMLeWiuddhV8hbahp1UZ5aUh3hJc0MrqJVBmfOd4pt4StOKzAJK5H3qx1vwYLyxMWvCtnJe2Pu/aq6tXTO5Nt59TjV/TxWzZeYs4olVOVynGJYZ+vm2cwsmAAHy6lqSQUdIXtT1RNEJdKpalFd27XjmTRJDbMaPYGsOfFws7/AFRnGaf2gNxjnKuL6f6m7svfDHF6XPi4Wd/qjOM0/tFQlV4UcSdRVTOJ9JLI1e6YTGYLvWjgkqNorJKG0iGAaHF1GTD3IlO90plykwq65zvFNvCVpxWYWN4Krq26w72DlFrb6VhLKGq5k8druJNO1yt3KZFVomJGMI7eeEesAmwA05z4uFnf6ozjNP7R+DYy8K5TwTNfij4GjtQ80CgNzANOc+LhZ3+qM4zT+0fhXGXhXQJqit+KPKXs+aBQG5h4nX5Mr72b6BqHnxcLO/1RnGaf2j8rYxMLUUT5r9UZHOSMdiaJgKDgAAF5uT33Hdufgz7l7gSJEdcnodNTB1bkyfSxbv8ANxg5EigFXeWM9N9s+5sx8IkK7RaTlSrK3YuxU1AOLa2/ndSElrB+VzGXtoqwSMcyeaEc21HYEGec7xTbwlacVmAacAbDrnD7e22cijUdwLX1FIJXBciMXkwYmSR1Uw14AAA2xK8J2JeeSxrOpPZCr3bCYIEdN3BJcY5VklCaRDF/jABqcBuPnO8U28JWnFZhqufSGcUxO31N1BLl2E0ljg7R4zXT0DorJn0TkMA9AAAAE2skhul55wMe8taCEomzkkd0xO+Bj3lrQBb6AAAAAAOea/3V4uRwtnPK1BgQkrejChiUn1465nklsfVzyXTGpZo7aOU5eY5FUVHRzkPD9wwyODvFGl01hq0jD2JSeICxvJZbmA3CV+JgiLeTloWsrdYfV6ZrymZnIpqnUDxxFq+QOkfQMUglIOmnUPOwAAKYAAAAAAAIfZU3cwF4TMBMEQ+ypu5gLwlYCLdKVBDPbA9XW3PC2UcrIMCGe2B6vFt+Fsm5WmOdboZAAAc/GKTdMXX4aTrlpxrAbPxSbpi6/DSdctONYAAAACd+SC6u1YcET8sbC2cVMZILq7VhwRPyxsLZwAAAAAAABTBlR91nNu4su8ELnxTDlR91lNu4su8EAiOLEsjnoxq+5cYfq2XeEVFdosSyOfpvuZ3Nl3hFQFogAAAAAAAAAAAACsfLIfnu1XwWcfXaCuEWPZZD892q+Czj67QVwgAAAAAAAC+zBZuU7X8Hm/8AUUJi+zBZuU7X8Hm/9QG6gAAAQtys25gl/C1jyd0JpCFuVm3MEv4WseTugFPYAAAAAAAAALg8kwWBcMMxhDtuf8naiaYhbkmdzBMOFr7k7UTSAAAAGlcae5Tuhwecf0FCYvsxp7lO6HB5x/QUJgA6Nbd9T+me4zLwBBzlDo1t31P6Z7jMvAEAZCKV8p5uvKh7mSvkguoFK+U83XlQ9zJXyQBFEAAAAAAAAAAAABefk+c3OeW5zbXMr3l7gSHEdsnvuO7c/Bn3L3AkSAAAAIkZUbcmTXuxL/rxFMAufyo25MmvdiX/AF4imABlFqOqjR3d6XcoIOi4c6lqOqjR3CCXcoIOisAFBmMPdS3R4TvfCi/MUGYw91LdHhO98KA04AAACbWSP3S084Fu+WNBCUTaySG6XnnAx7y1oAt8AAAAAAAeo/6Untj2x6j/AKUntiqfKE2ekAAOlAAAAAAAAAAAPQnMhkNRtiM6gkkvmTVM+qERfNyKkIf1WgYe+AwfEYWptdqRoxtpSsIxj1pM3h//AKDEb2W4t5JbNV9NpPQVOsXrKmJq4buG0qbpqJKFaKRgYpoEzwjngNry/wDFG90MLv8AdQq4/BKb8jVHPb5PSqhL0V7o75NV8dOA9Fe6O+TVfHTgYoAlq+bDjQNCTrD5beez2jJDMphMqUlTt48dS1BRVdU7VMx1DmMWMYxjGOfbGxvQotbva0rxM3+4MZwtbmi1PAuS8iSG0AGI+hBaXVYr+hdSOqRhmifzEbaUYdjPoDyehRa3e1pXiZv9wZUAD4cnomjKbcHeU5SUllTg5NAyzJgigeJexExCwjm9gfcAAGocXTx2wwx3LfMHSjZwhTrtRJVOOYxDQLsRhEUZeivdHfJqvjpwLyMY25ZujwaefUFBgDK/RXujvk1Xx04HhbXOuQxRK3Z3CqVBBPpCJzdwQgxoAGV+ivdHfJqvjpwLY8nLTNOV3hnl9T1vT8vqCbuJs/Kq/mzUjpwpAqmaGc6kIxFOIufyXO5LlPdeYeEgAkb6FFrd7WleJm/3BBHKqt29saYt46tsklSa71/MCOFJIXmEyxIEQjmNFGEIx/eLGBXbli/SjbLunMfBIgK5vRXujvk1Xx04Hhc3OuQ7RM3eXCqVdBTpyKTdwcgxoAGV+ivdHfJqvjpwHor3R3yar46cDFAAZK2udchiiVuzuFUqCCfSETm7ghB5vRXujvk1Xx04++MUABkpLnXLQOq4TuFUqZ3HTnJN3HRjzeivdHfJqvjpwMUABZtkpkkrmye5S1ySkq1Rg6lJWhp2Xm4zckSOtgsVoRjD9wnt6FFrd7WleJm/3BAzI3/mK6nwuT/UdCx0BiC1n7SONHV7W0ipoxzl05I2jmj2YZyDy+hRa3e1pXiZv9wZUADWlxbU2vhb2qYFtzTBImkr6EYklDeEdlA/X0Rz6Do1uJ1P6m7jPfAHHOUAD78qr+vJGzLL5HXE+YNU+kRaTNZInxCnHwAAZX6K90d8mq+OnAtDyTNR1BUtpa0eVHPZjNHJKigQqr5zFY8C6gXNDPEVIi1/I/7Fm62h/wCpocmTAT3EK8rUWBsMUshHrVgwj/w7oTUELcrNuYJfwtY8ndAKexmtkKek9XXpoCk6gac1yudVRK5c/baocmrNlXZCnJplGFDY+GvdFWu4ayPlxAF8DOz9qGDNBi2ttTEEWyRUU4GlDeMYEhtQzxIPL6FFrd7WleJm/wBwZUADnqxDs20tv9cuXy9qRBqhWE5IiiToCEIV8ca+Gx8Sm6Kujw1nnLjjXAC4PJLkITDHNCp7XnwmHJ2ommIW5JncwTDha+5O1E0gAAABo/G2gm4wn3OTVh0PmCqaP7jFj/QUMi+zGnuU7ocHnH9BQmADJWdy7kS1sVnL6/qVBBPpEUJs4IQgxoAGV+ivdHfJqvjpwMfms4ms8fmmk8mrqZPVOncunB1Vj6P98w9QAAAAAG9MD1D0xcTFRQlI1nJ05lKnTh2ou2UOcpDqIsV1ibHXGixJLJ1bsu3fvsz/AJW7AXNehRa3e1pXiZv9weNzam1vMysI21pWJYkNnhGTt80dj3Iy4eJ1+TK+9m+gBzXAAAPuyqvK5p9sVnI61n0ta+stJmskT4hTj3vRXujvk1Xx04GKAAyf0Trl80leeiHUur6Gp6fmu409AeT0V7o75NV8dOBigAPuziua2qNn5n1BWM7mTXS1TUXT9VUmn7gxx8IAAf0hzkOVRNQ6Z0+kOMoRupc5AhU07jVQmRMmpkISbOBiwAMr9Fe6O+TVfHTgY28ePJk8XmEwdru3S5zKLLLqaZznN+mY5h4AAAAAATbySO6YnnAx7y1oISCbWSQ3S884GPeWtAFvgAAAAAAD1H/Sk9se2PUf9KT2xVPlCbPSAAHSgAAAAAAAAAAAAAe9L/xRvdDCMQZTHsNcohDZjGpCcQhHsR5iVGby/wDFG90MLv8AdQq4/BKb8jVHNb5PSrnnAAEtSbofKKYn7f0hKKJkdSyeMskTNCXsSrSVvE5W6SaZCFjm29jYH3ddHxZdsFOcSpCI4ALvMn9fO4OIWzEzru5Ttk5mzapHUsTO1awQJqBEGxy5iw9lQ0RJoQkyR25onvDR5yJkJtgIsZQjEDcnDtbCnastk9ZNn0wn5JeuZ20g4JFIyKhtqO1slgIEa6Piy7YKc4lSEr8r71CKR4WJ8kcCpgBNu2uNi/OJKv6dsJc6bSl1SldTFKTTdNrLEm6x2q0NnNHZzZxMXWucJXa7P+OVRWFg83UtruE7LwovzARJ1rnCV2uz/jlUeJHJa4TUEdTPJqkW/vKTk8Y/QJdgAiTrXOErtdn/AByqItX8v7cjAhch3h+w/TBiypFk1QmaCEyaFerEVcF0jwhHYjmzwFrYphyo+6ym3cWXeCANdHxZdsFOcSpDVN+sV14cRzCTy+6EzlzpGSLLqtSNGBG+dRWEIfRCH8Bp0AAAAAAAAXFUtkr8M7GnWDWqEp3OZmkiUrh+SYHb6vHs6JdqH7x9bWucJXa7P+OVRLFr+TJe9l+geUBEUmS2wnpGMeEoqTObbzzk/wB0eTWucJXa7P8AjlUS2ABqew+GS1OG9vOW9r5e+aknqiKrzmp4ZxExk4RKXNn2tiMRtgAAaExt3brSxtgJrcWgF2yM4ZPWiSZnDeCxIlUVgWMIlj7Yrc10fFl2wU5xKkJ4ZTzciVF3SlvKSilcBK2bZTXFXOpa8k7qoaf5neInbKRJJUs8CqQjD6IiKQAAAAAA3PYvF1evDpKX8jtjO5c2l80cc1rpO5YkvEy3sR6w0wACXGuj4su2CnOJUhr692NO+uIOjkaGuRNJU5lKT5OYFK0lhG54qplULD6Y/wARogAAbFw37oe1vDSR8uINdDY+GvdFWu4ayPlxAHQeAAA57sSG6Hulw0nnLjjXQ2PiU3RV0eGs85cca4AbysljPvvh9pRairbzyVIypZ2o/Mg6liS8YLnzZ4Qj1s+aH8BsTXScWXbBTnEqQiSACWhsqFi2NEsUqokOaPW8wkB+tdJxZdsFOcSpCJIAJvWvxn32xOXBkFgbpTiVuKTrZ8WUzUjOWpN3B259vZ2c2fN1hMLWucJXa7P+OVRWVgq3Vlr+ECP0C+sBEnWucJXa7P8AjlUU5VPKiSOpJvI01NUIwfrtCH97PojpDHOVcX0/1N3Ze+GOAx4WK4F8Blmr1WVTuhc1SZzNxNni6LVBq4O0I1IgockIQh2RXULqMmHuRKd7pTLlJgHr61zhK7XZ/wAcqjxHyWmE86kFTSipc8P9tH+6JdgAiTrXOErtdn/HKowW9uFi0WDO2E7xKWQl0wZVrR5UDStd+8O7QJFy4I1PpJG2Iw0HJv4CeAjflFtxpcX3uWfzNqArv10nFl2wU5xKkP7DKi4tDQMXzw04WMOv5ipCJAAAAACzDBrk9rG3VsNIbnXIjNptMak1dySDZ2dqRuUiqqOjCENnP0MRvDWucJXa7P8AjlUZbk99x3bn4M+5e4EiQERNa0wm6rq3mLUml3ZP9g8utc4Su12f8cqiWwAIiK5LTCcrGBjSepc8OxOj/YPLrXOErtdn/HKolsACFFxcmbhdklAVNOpPJZ6i+l8oeumqhpuoaCapG5s0c0fcwFQA6LLr9S2se4Ew5Occ6YALScLeTisLXVjaWrq4cJrNprUjMk1ids8O1KimsSH4GEIbMYQFWwvzwc7lm13Bpn9QBqzWucJXa7P+OVR+Na2wnarq3mNUml3ZP9glyACJOtc4Su12f8cqjVOI+1FIZPShml7cNjZaXVRNZohTbhWani/SizVTUWPCJTQzwzcyliLDBCTK47miRcNGfInoCHWuk4su2CnOJUgNlQsWpimilUkgzw/2M3ESQAS1LlRMWsdupJBxM3H910nFl2wU5xKkIkgA6KrTVBMastXRtVThUij+c0/L5g6OQuiUyqzYih4wh1oZzRGQv+lJ7Yw2wPUJtxwSk/I0hmT/AKUntiqfKE2ekAAOlAAAAAAAAAAANRYnsQDTDdbhK4jym1J4geYoS47ZN1zOcmqFPsjboh9lTdzAXhMwE26U181ywlIt4GKex06hD2JylH6YRHxbjZWOk63t9VFFt7MzdspP5O8lZHCk3RMmU67dROG0WEeuK3QHMsAAAAAAFvWSN3NU/wCGz3kTITcEJMkduaJ7w0eciZCbYCB2V+6h9HcKi8kXFTQtnyvvUIpHhYnyRwKmAGZ2auES1F1qVuSpLIzQlMzNCYcyQX1KKugbpdOIsR14ukN42c8cJ+JFXYALRNeLpDeNnPHCfiR4YZY6molzmsRMof8AzxPJxWCAC0TXi6Q3jZzxwn4kY1OsM0zykMwPiep2qm9FNJkUkoLLHzaL05eZY5s8dqGeMY9YVwC5/Jc7kuU915h4SACOOs51jv4Sjic33h/I5Het4GLoXskkIQ/2Sf7RaMACrnWcqw38JRxOb7wLZHet4FjBpeySlz+qlJ/tFowAKutZzrHfwlHE5vvBrOdY7+Eo4nN94WigA/CRNTSKT1MMw/YAAAAAI24tsZ8owoP6ZYzWhXtRRqRNychm71NvqWpQhGOfShHPtiP+vF0hvGznjhPxIxnLIfnu1XwWcfXaCuEBOPFZlF6dxF2cmFrpdayZyhV86bOObFZqkoQkE1M/6MICDgAA9mVS1zOJkzk8vT1R0/cFQRJ/fUPokE/JLkf69eyZm8m125TLXi7ch3LPzMMuVBb2IxjsiDduvT/TPdll4Yg6NQFXWs51jv4Sjic33h/CZHatf071yWPtSk/2i0YAFXWs51jv4Sjic33hFzFfhfnGFWtZRR81qltUHmtKoTMrhFuZuWEYLKJaERfQKocsF1Y6I4MG5YoAgOAAADYuG/dD2t4aSPlxBrobHw17oq13DWR8uIA6DwAAFcNzclHVVwbk1ZXad5JY0JUk8fzcrc8picyEHK5lYlz59vZGMaznWO/hKOJzfeFooAKBsUOHiZ4Yrkp24mtSt54dWXITEjtJvqJYFVOoSMIw9saiE08rRunZbwRYcpdiFgAAAAzeyFyCWgu1S9zVJQpNU6cmBXvMkF9SitmFhuvF0hvGznjhPxIq7ABaJrxdIbxs544T8SMQPkoKsr0565TvJK2haiNGblbmlMTwRi4hA8YbMfZgK6h0a276n9M9xmXgCAK29ZzrHfwlHE5vvDIZJiol2ToZ86xUVHOa1eSDNMIzdo8IyIsV3nW2SGIbNGEYx64skFK+U83XlQ9zJXyQBJbXi6Q3jZzxwn4kSAwj40ZPiwmFSsZTQb2noU4m2Oczh8m41bVYRjDNoQhmzZhR2LHsjf8Anu6vwWT/AF3YCzgRuyjG4zuL73LP5m1EkRG/KLbjS4vvcs/mbUBRyP6Qh1DlTH8Hla/lKXuyAJ+U7kgrizSRsX89uvKpS/XSIo4YRYGcEbqdiEc+aMR9DWc6x38JRxOb7wtFABrTDlah1YuytMWpfzhOaryBFZI7xJOJCrROuornzR2unzfuGywAAAAAapxMX5ZYb7WuLnzCnF52g2eN2pmiLgqJzaqaMM8DGhGGxm2hELXjKQ3jJzxyn4kbcyo25Lm3deX+EiKYAFn7nKp0rctqtblrZucM1arLGSJuVJwiYiJ3JYpQjHMXrRjHaGI6znWO/hKOJzfeEGbUdVGjuEEu5QQdFYCrrWc6x38JRxOb7wsNslb5zae0lKW3eTJJ+tTcsRl53SZdEqsU4ZtKEI7QzgAAAAAEI8rlGEMNEhjHt0ZcieibghJlcdzRIuGjPkT0BUIPsUjSk5rmq5NRNOoprTaoHyErYlUUIQh3C59TIXTMPjjZ+FvdMWo4aSXlpAEv2uR2rQyCR1r2SpIxoFMomWUmzZ+xtj96znWO/hKOJzfeFooAK52mU5pix7RGy7+0c3mjqgCFpc71KaolTcnYlK3OrDOWOxnLCP8AEfx1lg6QcJ5iWRnUYdiM4Sh9EICv+/3V4uRwtnPK1BgQC+HDDiAb4kbbq3EaU0pI0CTFeXEbKO4ODn1MpNkbdEPslluYDcJX4mCOqnSAAAakAAAAAAAQ6yqaxCYY2yfrlUMPAriYoh9lTdzAXhKwE26UqCH7RRWdLJN26B1F1DkIQhOjOc5h+BntgerxbfhbJuVpjmWz+WYD8Ws6ljWcy2zzxZo9QI6bqkmTDOYptke3rfOMXeWe8YsPHC88AHN5UdPzqj6gmlK1EyOxm0meLy5+3OoQ50XCR9TOXoR8wbPxSbpi6/DSdctONYALeskbm52mfZu3V7yJkJuCEmSO3NE94aPORMhNsBA3K/ngWxtHQj21Fj/BouKmxbPlfeoRSPCxPkjgVMAAAAAN2UXguxP3DpdjWNHWmmL2VTIhlGziL1sjE5IHUL0ipyjSY6LLUdS2ju4Ev5OQBS1rfOMXeWe8YsPHCcWE29Ns8IVnWlmMRtVJUZWTJ65frytw2WcHKguaB0z6bdMxM0YeyJ2imHKj7rKbdxZd4IBYtrg+DzfpZ8VP/EDPrT4j7K3ydTFnaquW8/WlSZFXhU2q6MUim2ox1Uhf8Bz5ixLI5+m+5nc2XeEVAWiDHq9r2krX0lMK6rqbklcjlZSHePDIqKQSgdQqZY6KZTGjnMcsNiEdsZCI7ZQjcd3G+DMeXtwH91wfB5v0s+Kn/iA1wfB5v0s+Kn/iBRiADpTIcpywPDrj9jxNfyZL3sv0DygAAACBOU2w83jvrOaAUtXRC0+TlDaYpvTFcJpFTgqZCEIdFs5+hj/CIhNrfOMXeWe8YsPHC88AFA1zMJWIWztLqVlcm2ziTyZJcjVR2Z62PGBlPejmGohdRlPNyJUXdKW8pKKVwH3aGcotK2p544U1NBCaNVDn/uFWIOjkc5VuvT/TPdll4Yg6NQAAAAFTuWAOma9dFtz7fnWgb/i1xbEKocsF1Y6I4MG5YoAgOPuUVRVU3FqZlSFGSdaazeZKlRbNyaBNM5uh6cw+GJp5JfdOzLgi/wCUtAGs9b5xi7yz3jFh44ZNbHB1iTtRcqkLo3Ate5ktM0hPWE9nExUfMzlaS9ouVw4UiRM+zHMWMfahHsC6ka5xI7na6XAud8hWAa+1wbB5mz+jWx4sfeIH51wnB3v0s+Kn/iBRkAC82GUJwdx2r0NOKZh4gNcJwd79LPip/wCIFGQAJ74wbZ11jUuy3uxhjkCtcUm2lCUmPM26xGhSPEVDqHS0Hep582kWEY9mPsjR+t84xd5Z7xiw8cJ+5JncwTDha+5O1E0gHPtdjDbe+xbBhNLqUG4kDWaLGbtDmeNltJQvvZzDWQteywPUaojhMbkqoqhAedmzeTFylL5e1Ou6XNqZEU09M5xIDW+cYu8s94xYeOHw8FW6stfwgR+gX1gKMNb5xi7yz3jFh44WbUzjrwo03Tkqp2e3gZNJlK2SDJ2geXPoRTWSTKU5fxPZgJMjnKuL6f6m7svfDHAXW64Pg836WfFT/wAQIK4q7JXRxb3oml7cO1KL1lRU1bMmrSZoqptiGVQSImr0Dg6R83W/cINi6jJh7kSne6Uy5SYBW9rfOMXeWe8YsPHCTWCVo6wLTCrH2K5Pzgo1gk0SkhnMIO4uTtoKmcQ/0XVM0ejLHZ6ws1FcWWQ/MVq/hc4+o1ASV1wfB5v0s+Kn/iBrDExiGs1iisjU9irE1y2qyt6mTallcoRbLoHcRQdJOFOjWTKSENTRP1xUAJJZOrdl2799mf8AK3YD1tb6xibyzzjJh44f1LJ+4wUjlOayj6PtTBj44XmDxOvyZX3s30AI964Tg736WfFT/wAQGuE4O9+lnxU/8QKMgAXmQyhWDqO1elpxTMPED+64Tg736WfFT/xAoyABeZHKF4OSm0I3qZwj2PMqYeIH61wfB5v0s+Kn/iBRiAC2nFlei2mLyzruy+HKq0qzrJ8+bPkJW3bLNznboG01TabhMpM0Iez1xB/W+sYm8s84yYeOGX5LjdZSnuLMfBC54BShb7Adi1ktf01OJrZ16myl84Zu3B/NFgfRImrn+gXXgAANG1VjcwuURUkzpGqrsNJfOJM5M0fNDy94YyCpdssdFGMP3wjmG8hQZjD3Ut0eE73woC2vXB8Hm/Sz4qf+IG0LU3rtffCTO6htXVaM/lzJzFouukgqkUi0CwjEn4QhY7UYdYc8ItnyQXUIq7hYpyRuAneIR5XI0C4aZBGPbqy5E9E3BCTK47miRcNGfInoCoQbQwu7pe0/DWS8tINXjZ+FvdMWo4aSXlpAHQOAAApdu9gVxXVRdytqmktnnjphNajmL5mrzczJE6Srg5yH6JbsRh/EYirk/MYKUM8bKzCPtTNj44XoD1X/AEhPdCq9iLeT8tbXtn7CGo+49PGk0383XjzmY6hD9AYhMwksADoeQAANAAAAAAABD7Km7mAvCVgJgj+HIQ/4xMhxhDnCGe2B6vFt+Fsm5WmOgqXtW8CGjzMjCMY9YkBh9/UUfQKuR+BJHPSU4z7G3/oao5bPWGfgOa7mlz6+cOaXPr5wGysUm6Yuvw0nXLTjWAAAt7yR25onvDR5yJkJtjmsIscn4tQ6Y/XNLn184C2LK+9QikeFifJHAqYE78kMYyt+Kw1aHRQpE/LGwti5lbf2dL4kAHNcA6UDNGp4aJ2yUYe4gP7zK1/syXxIAOa4dFlqOpbR3cCX8nIMl5lbf2dL4kBzu3XcrJ3RrFNNc/5+f8oOA6JxTDlR91lNu4su8EImc0ufXzjxnOdT8YoA/gsSyOfpvuZ3Nl3hFRXaLEMjqkl59bkKw6eEql5Y+1qqgC0YR2yhG47uN8GY8vbiRIjrlC0yq4Objpm2otmP8wbAKMwAAHSi1/Jkvey/QPKPC0LAjVEkNqCZfoHmAAAAAAABFHKebkSou6Ut5SUUrjpSOQikOjIQ4/nMrb+zpfEgA5z7den+me7LLwxB0ajxcytv7Ol8SA8oAAChjGkusTFZc8iZz+mBba9oBfOKocsF1Y6I4MG5YoIGc1OfX1PlB+TnOp+MUAfgTTyS+6dmXBF/yloIo0Zbqs6/mRZXS8gdP11BLS1GTcrOfnQeVhMuZPVs0OgOAt9GucRcILYf7nNUtE6ylGzspU8+yaMWKux/iNA29yeNs6YgWLuXc2Zv1j+GG6ZBhotpIDpqMZCzaHSjpF5lT0NkBRGSgK8U/F0VPlPe5YqB6ArxP8ZRc+4sWHQVC2VOQhmNBeMezpj+GtjTUYZoFWh/vAOeZ5IZ2x/OEneoe/oHIPQHRGe27VCEYy2ZLoxj6o2cer5360k0dJm8bzGH/nEzx/xARqyTO5gmHC19ydqJpCt7HThdubemu2tyJFEjRZpJkJcdh6s5DnMK9a2oCv7ePzSurJM+YLpgLM8sD1GqI4TG5KqKoRPrJBHMe8tcatm0vOzD+HNiYtX5lbf2dL4kAFDOCrdWWv4QI/QL6x4uZkPWi/wHlABzlXF9P9Td2Xvhjjo1HONXjZFrXNQs26epkQmzohCf3CqnAfCF1GTD3IlO90plykwpXF0uTASTRwjSLQ2jTWZG/fzQYBLEVxZZD8xWr+Fzj6jUWOj8HSSU6chTe3ABzWCSOTn3ZVu/fZn/ACt0LwOZW39nS+JAf3mdD1kn8AHkHidfkyvvZvoHlHhdl02qxeymaH+ADmvAAAAAAAAABLjJcbrKU9xZj4IXPDmpHl5pc+vnAdKIDmu5pc+vnDmlz6+cB0oigzGHupbo8J3vhRqHmlz6+cX2YOyJqYWrXmMmnHPTTPahnh0gCg4Wz5ILqEVdwsU5I3E6uZW39nS+JAfoiSSfSEKX2oAP2ISZXHc0SLhoz5E9E2xCPK5bmmQ8NWXInoCoUbPwt7pi1HDSS8tINYAA6VgHNdzS59fOHNLn184DpRHqP+lJ7Yw2wPUJtxwSk/I0hmT/AKUntiqfKE2ekAAOlAAAAAAAAAAAAAA96X/ije6GF3+6hVx+CU35GqM0l/4o3uhhOIIpj2HuSQsc0TUjOIQj2I8xKjmt8npVz0gACWgAAAAAAnfkgurtWHBE/LGwtnFS2SD6vdX8EFOWthbSAANY4mKrn9C2Br2sqWmPME3lEjcu2TmJIG1FUpc8I5o7YqI1xjGVvzLcRSvyYBeKOdS6/VRrHhBMeUHG5tcYxlb8y3EUr8mFj9J4EsKNa0nJqxqi0qLucVAwbTSYufNqYliu6XRIdU+w468foAUngLxtbpwabzCXHkz8oFYOPW01DWYxFzSi7byaEpkhJewdJs4OFVYEUOlmjmOscwCO4sSyOfpvuZ3Nl3hFRXaNhWhv9duw7yZP7S1ean1pqmRF2cjNs51YqfX/AAxDAOhQR2yhG47uN8GY8vbisPXGMZW/MtxFK/JhsXD3iXvfijvLTVir61qWp6Fqw67eaytRi2ac0kSROuSGm2ImfNGJS5/ah2AEKQF42t04NN5hLjyZ+UBrdODTeYS48mflACRbX8mS97L9A8oo9UyiuMpI5iFvQpH25HK/Jh+NcYxlb8y3EUr8mAXigNIYKrg1ddTDJRdf15NjTOfTZN8Z46iiRLVIpvl0i9CToYdCQsNjsDd4AAghlMMR96rBzi36Vpa1jISTlvMTvYQYtnGqRRMhEscyxDQhsGjDY7IhTrjGMrfmW4ilfkwC8UBV7gSxhYjry4jJNQtxrlqTiRO2L5Y7eErZIfhEkNKGc6KUI7ezti0IAAAABQpjV3Vl0OEC30C+sUT4p6Vn9W4w7j0/IGSz127qZzmLDrQzbQDRDBg8mrxKXy9odddc+gQhBNTDfk96hrU7aeXEIdBr+MIw8aJC4PsDspohkhUtUtSO5ucnRqn6VETolUnl8lalaMECppk7ADW9s8PNC27lSEvl0maokT/1KZOgG0EGrdqmVJuiUhC7UIQHmAAAAAAAAAAAB4nDVu6JFJwiU5Y9aMBq65mHqhbhytVi/kzZUp4fijk6GI2sACHOGrDNKMMF6J/UzZY6UrqCVRYJJn/QPBymcTCSVTWTKqkaBiG2oj15nKWE3bRav0IKJx7Iwsppzb93mWMd5J1DbEeumA2AA1JiVryb0jhyrmv6HmxWs1lckVdsXJSlPqKkM2aObaFSuuMYyt+ZbiKV+TALxRzlXF9P9Td2XvhjjeGuMYyt+ZbiKV+TCOr9+8mr91NJgvqjp2qddY/qzmPpHAeAXUZMPciU73SmXKTClcXS5MAkSYSJGWP61mfKDAJYgAAAANIY1bg1davDJWlf0HNjSyfSlNiZm6giRXU4qPkEjdCfoY9Cc0NnsgN3jxOvyZX3s30Cj/XGMZW/MtxFK/Jh+08orjKVOUhr0KQ9qRyvyYBGsBeNrdODTeYS48mflAa3Tg03mEuPJn5QAo5Abjxg29pi1eJKtqDouUwlkklbpsVk2gc5oEKZsmpHo1Ix+kacAAE5MmzhWtLf2FY1RdSUrzptIVEGDaX81qoIxMsWKkVtJE5Tx2uz1xOLW6cGm8wlx5M/KAFHIC8U2TnwZn6ay6Mf/nJn5SP7rdODTeYS48mflACjkBeLrdGDPeXS48mflI/sMnTg0htWYS48mflACjkX54Odyza7g0z+oMS1unBpvMJceTPygb0o6kafoGmJZRlJS6DGSydsVqxawUOeCKRYZik0lDGNHN7MYgPuAArtyj2KK/Fhbs07TtqK7NIpbMKcg/cJQlzRxFRxzSsSEdJchs2xCH8AFiQhJlcdzRIuGjPkT0QV1xjGVvzLcRSvyYYVdrFjf++dNI0jdS4MZ3KWzwkwSbmlzNtErghFCkNpoIl7Mf4gNRgAy+0FGS+412qLt/NXS7VpU0/YyhZw36chF3BEzmIAxABeA0ycmDpFqik5s8iusmkVM6sZ3Ms5s3/8gebW6cGm8wlx5M/KAG07A9Qm3HBKT8jSGZP+lJ7Y9enpHKqVkEtpmRoczy6UNEmTRKJom0EUiwIQulHZ2IQhD9w9h/0pPbFU+UJs9IAAdKAAAAAAAAAAAAAB70v/ABRvdDC7/dQq4/BKb8jVGaS/8Ub3QwnEFpegPcnQh0XnRnGb2+YlRzW+T0q56QABLQAAAAAATvyQXV2rDgifljYWzihjCfifmGFeuJrWktpBtUB5tKoywzdZ2ZvFMsVk1YbftCWGvHTveAZd8h/JgE1MY25ZujwaefUFBgsfQyhc1xYOksNbu1remELkRLTys3Tm3NR2ZXBc2nBKKZM8c3sj7Ws3yLf9fd7hPKAFYw6LLUdS2ju4Ev5OQQM1m+Rb/r7vcJ5QPhq5VWeWwUPbZOzLOYJ0nnkhHRZzowcRa5kYxhnLHZ6GACzkUw5UfdZTbuLLvBDc2vITv9n9l3yH8mH0pfhia5SNuXFDN6yWoReZR8yfMhqyK/ISDWOhA2qmOnGMYx7EMwCs8BZzrN8i3/X3e4TygRtxnYKmmE+V0tNmNwF6kJULl22UgtLUmuo6mUpoRhoxjDNmNABFgSHyfO7Ftz8Kd8gXEeBnth7tO7GXap66jCTozVzIFFjEaLKaiVbVEVEwHQyArH15Cd/s/su+Q/kwa8hO/wBn9l3yH8mAVzOvylX3Zx4h+zn1Q5lB+AF42Tp3Gluve5n/ADN0JICn3D3lLZ7YO0sgtKjaZlN21PJrlK7NNooGUgq4VW2jQj6qI2VryE7/AGf2XfIfyYAyyH57tV8FnH12grhEhcXWLp/ixf008e0Q3potMouilKV9F1FfVYQh1oQ7Aj0Aldkw915T3cyackF1ApTyZETQxf0wWPXYTPkRxdYAAPm1LNDyKnJrOkkoKHl7Jd0UnqokJE2b9+YVs68hO/2f2XfIfyYBZossm3SMssaBCE2YxEW7aYb6ed3orS77tAi7ifzldymr6hHahAfiwWJGv8UMh5te28b0pLlT6JDlmB3Blf8AIUSflMsbShimxakgUicMwDzNmyDNEqDdOBCF2oQHmAAAAAAAB+FDkITOc2aAEz67frMGxAagr/Evb+hlFGXNcZi+S6Zu22TDVzjHA01U0EKVdFJDrxHJqb7Q05xtZ/D3PkPH7W2N9SPaV8NjbiG1txEfKSxiUJPHMG04bLynP+k42hvSUTyVzxom+lrtJdFWGcpyRzwjAemjuNPX+9J9uzZ8ntd9H+C8S+iAAPd/QB4XTVB4gZu4JAxDbcB5gARzxKUbUJrNV5Q8kIdwhUUlXQbewtEUfTJg8lTxeXzBA6C6BzJnIoOkGbSxrOGCrB4nA6Shc0YCpnKFYajUnOjXFp6XQImqbQfFTAQbABYrbvJHmqeiZRUVV3gVlk0mDZNyq1aSdNygSMYZ4Q6I0OtEBXULqMmHuRKd7pTLlJhpDWb5Fv8Ar7vcJ5QPkv8AFS9ycrs2FmWUWjXbaQFI/hOF3kZec/NZYrZopFIrtRjHaiAszAVj68hO/wBn9l3yH8mEkcFmM+Y4r5jVTB5QCNNlplJqboX/ADSZaK0Ix280M0IZgEpxG/KLbjS4vvcs/mbUSQEbsovuNLie4ln8zagKOh5Wv5Sl7sg8Q8rX8pS92QB0ogAAKMMoNuxbjfCmnIEBHgW8X7yZErvtdqoLru7xPZMtPlElIsSSYrhNHQRKntxXLnjmLn2obYwDWb5Fv+vu9wnlAD28jp6Ubm905d4JYWJCtKZ1Apkn1U6VlLWFy07iRNMVFHJ/MqLU7UsYbcNWzwjAw9LXkp5+z+y75D+TALOgFYkcsbUUc2hYWXxz/wDqA3iR/deSnn7P7LvkP5MAs6AVi68hPt4Fh3yH8mH915CewLnNYFh3yH8mAWcgKxdeSnn7P7LvkP5MPynlkKhMXOawjD91QG8SAs8FTGV96u1H8EScscjL9eQnf7P7LvkP5MIp4tMUD3FTW8nrJ9RqVOHlEqhK+ZyuzOIqRgsor1oQ7IDRoAAANn4W90xajhpJeWkGsBtDC7ul7T8NZLy0gDoGAAAB6j/pSe2PbHqP+lJ7YqnyhNnpAADpQAAAAAAAAAAAAAPel/4o3uhhd/uoVcfglN+RqjNJf+KN7oY1d6RTKqbU1pS8mSKrMJzT0xl7RMxoFgdZVsoQhc8drPE0BzW+T0q52AErtbDxedp0m4+aBrYeLztOk3HzQS1FEB9arqXnND1XOKKqFJNKayCYryt8kkppplcIH1Mw+SAANuWPwr3txDN5g+thSkHrSWn1NV47XI1bxP6ghlNsbS1sPF52nSbj5oAiiA3NfHCNe/DrImFRXPkMvZsJo8gxQM3miLiJlo7WfsDTIDceDzdS2u4TsvCi/MUEYQDaOKW1sOzVEvh/+UX7gA51Lr9VGseEEx5QcdFYpzrrJtYr6hreoJ9LqOlPMkzmrl4jqk7aQjoKKZ9r2gENRc/kudyXKe68w8JAQO1sPF52nSbj5oJW4d7924wM21QsBiJmbiT1fLnS8yVbMWx35IIOI6acYHRhGHZ6wCfYrtyxfpRtl3TmPgkRuTXPMInblN+JHP3RDzKL4rLOYi6eoeX2unL58rKHz5R5BdkohCCaiScNuPtAINAAAAAAAAkzTGTlxY1dIWVRsqDbN0JglBQqUxmaTVynn9WiptD6uth4vO06TcfNAEUQGUXNtrVln67mlua3bINZ1JjJEdpIOCLEJqiJFCdGUYuAAAAJXZMPdeU93MmnJBdQKIsEl3qKsdiDk1xK+XcoSZq0eIKnbIRcGIoq3OWGfMLL9c8widuU34kc/dASNuJ1P6m7jPfAHHPvaihn9xq8lVJs0NU1dwTVveS9OLbZ7lGMLNWyKY0rJKumysynTVeXM0/MZxCJ11UzFJDa7MYDSuDTBfcWz9erzO6UpYNZlGBYtSt3hHEAE2bDW6llvqJYS1k1InBFAqCUYeoKNmjxN0SNkSIJwzFJDNAeUAAB/IgP5t9cfyJieqgNIYhr7wtqzLJZBoKTdwXP7yXsiJjy+Vzjv/NDzzL6uPl3DeGb/mdD+or6rWevf6vj/IeQ7fYan4cx7lZFE0IQ0ox2ICJOJy/7tN0rQdHu4FjCGZ44T63sDGZLjLnxKadyipGmrzE6Byou09rOI/vH601crzBwvqi65zHOcfFPKeH5Hha4aunPqf1jp8W8j8orq7eNLaTP5u5fk5zqH1RQ51Dj8gA+vH1ta9r9gzKgLs1lbp4VxJJqeKH6bZTpDjDR4XjkjRHmhQVXVtpfmrPp/U4bb77ebqmjx8TOpafURCdNssWlH1TFOXVL/wBEvYw2Tn/FR/eN8t3CLtIq6ChTpnhnKaAqH821lD/g09TG37Q4ka3tw4I2WdHfytQ/RoqdYf1Nr5DHvDW/7fqPhvpz5VbZxqb3Tj3669/dY9sD+5tjaGC2yu5S90JSWYyNxDTKX8KjHpiG7Aznaj7A+TaepXVrFqT7h/B3O11tnqzo69ZraP0l+hrK/VuZbcGiH8uetoKFUQMmp7mI2aPGuiRwkdBSHQnhmiPR4Odq69DP7c15NaTeIanzIufUfeTdIOgi3fU/pnuMy8AQV9YysF9xLw16hMrWSti6f9HzYVd4RuLDKMYu5XSEilUwLArpnLWyC5YR6VQiRSmh/GEQH2hSvlPN15UPcyV8kF1ArPxvYIcQ98sQ86uDb6mZc6kjpmwQTUXmyDY5zooaMdg2zm0tjZAVsix7I3/nu6vwWT/XdjR+th4vO06TcfNBvbCswd5OZ5UUzxTJkkDau026MniwULMdM7WKhlYR1GGeH5RCO0AsyEb8otuNLi+9yz+ZtR8HXPMInblN+JHP3RgN9cUNn8YNqp7husXOX01resCIklbZ0zUZEPFsum6PEyq0IQhDU0DAKlR5Wv5Sl7sglTrYeLztOk3HzQfpLJi4vEzlP5zZNsf7eaALpgAAABHe5WPbDfaatpnb6tKmmTadygxSukEpYqrCGfazRLDZgMZ1zzCJ25TfiRz90BGnLGem+2fc2Y+ESFdosfxSyeYZRaZ0/UeFpCE9Z0Yguxm0ZgoWXaB3GYxIQ1aGeOwWMdoaO1sPF52nSbj5oAiiA3veHBViAsRRp6/uPTcvZylJyk2UVbzRs4jAynsfuGiAAB5WzZy+coM2aB111zkTRRTT0znObpCFIJPyjJq4tJvK2k3aURLkyu0CLam6nLZJYsfZ7ACLYCV2th4vO06TcfNBGutKOnlAVdOKGqVsk2mskfKS98kkppplVSPomiA+KADa1j8MF58Qxn5rY0tF43l0dFw5cKkbt4x9QRVTrgNUgJXa2Hi87TpNx80H5NkxsX0dqh5Tx8yARTGz8Le6YtRw0kvLSDb+th4vO06TcfNB9+3mBnEVYqv6bvTcWnZYzpehJwzqWcuCTduuoiyaKFXcGIQvsFNH9wC4kBFHXPMInblN+JHP3Q1zzCJ25TfiRz90BK4eo/6Untj1qYqKW1bTcqqqTnOZhOGKEwbGOXRNFFUkDkjGHW2DQHsv+lJ7YqnyhNnpAADpQAAAAAAAAAAAAAPel/4o3uh7EdsevL/xRvdA7dN2SCjx4sRBBApjqqnPolIWG2aMf3Dmt29Ie0Ax70Q6A7eaf4zQ+8Hoh0B280/xmh94S1Qzik3TF1+Gk65acawG6MSVG1fNsQ9zptKaUnD5g9rCcLN3LVgdZJYpnpzEMU5Rrj0Orgdo9Q8WKgLWskduaJ7w0eciZCbYhfkoZRNZJhxnrKcy10xc+fJ4eKTkkSnzRZMtnNH2oiaACCGV96hFI8LE+SOBUwLZsr71DKP4WE5I4FTIDceDzdS2u4TsvCi/MUB4SJhL5TiZtnMps9bMmbWo2h1XDpQhCkKUwvbLcS38dquqej/8mh94BkIDHvRDoDt5p/jND7w8ba5duHaMF2twKbXTjtHTmqBix/fAwDJRTDlR91lNu4su8ELffRDoDt5p/jND7wp3yms2l05xVzZ1J5m2eN4SeXEiq2UIsWH4L2AEUgAAAAH9IQ5zlTTTOodQ+pkIA/gDIfQ6uB2j1DxYqHodXA7R6h4sVAdGDX8mS97L9A8o8TX8mS97L9A8oCjvKK7su4nvss/lbQRtEj8otuzLi++yz+VtBHAAAAAAAAGQ269P9M92WXhiC/yl9GbVjNJrH/u/4KAoNtK25rujSDf1yfMOUEF/lt0c8rWew2l1jRAZeAAA/OfNGOwPi1fUrCk6fdzuYKlTTbpmNnj1x9qOaGePYEQcW904zJ8SgJQ6hqKHRvMw/s8DxV+Y3tNvXruZ/aH8zlN9XYba2pPf6NDV/WD+uKnfVJMDn/Dqm0CeoIMRWOPaWOPnrHH6U2m2ptdKujpx6iI9Q+odzrzq3nUt3L01jj1SPDoHHkWOPRPpqHKmPHmNrtt1srxuqxNfU+/b+VqWZQQ+qEKoP0PG2JqaJUx5B+I+Qrp03WpXS+MTPpxPIiiddYrdNPo1DamQferm0FRpsWs0l/4chEiqHR/TIcZFaWlfNJ+aePE/wKHSDdOYfSnmXnOpx2+rttpPuK/J+ofop45PFx/e9xSJtPxiUKkUTkPqaiepnTH0kSDYF6KYbSqfFmDQmpkdl6P3YwIfMOJ5KnKbSu5r/wC0P2Tst1G70a6tf1hnVm7gTG3lcMZk0XORBRUibkn6ByGFlsnmKM2ljeYN/wAWsnA5RUv72LQbOHOa2dORUzmNFgjpR9nRgPsTxrXvaLaVuofSP1d47R0b6O8pHq1vcSzYAAfLH0swWpYFk1Zy2bw2nUNSN7YzoYhclIpJSjMY/wDdViR/zQGSyt2R/LWzxM8DFWSKeEYdfPAB7QAAAK4ssh+YrV/C5x9RqLHRXlleZFOp7JbYISWUPZgoRzN4mTaoRVjDoGubPm2uuAq2EksnVuy7d++zP+Vuxo70Orgdo9Q8WKiQOAenqjpPFnQU/qaQzKTy1qaYc0Ppg0M2QLE0udF6I59gBdoAx70Q6A7eaf4zQ+8Ebi2+hDSjXVPQh2fNND7wDIQGNNrl26doFctq/ppVI3SnTmyBix9qMDDyeiHQHbzT/GaH3gFKOUG3YtxvhTTkCAjwJM46KbqOqcVtf1BTUhmU4lrt0z5nfMmhnLc0Ss0C5inJsDQ/odXA7R6h4sVAWR5HT0o3N7py7wSwsSFfOSIks4kVLXKQnUneS1ZSYS9SCblEycc2pr9kWDAIkZUbclzbuvL/AAkRTALnsqOeBMJszjH9cy/65hTCAyu1HVRo7hBLuUEHRWOdC1zlFpcuk3DxciaCE7YHOdToCEIVwQdBiVyLdrJkVQr2nDkUhnIYs0QjA0PY6LZAZGKDMYe6lujwne+FF6Xoh0B280/xmh94UhYrqUqmosSdyp3IabmsxYOqjfHbu2TQyySxdL9E5QGhxbPkguoRV3CxTkjcVc+h1cDtHqHixUWp5JaSTqRWRq5rO5U7YLHqtQ8E3SMUz5uZG/WiAnEAD0JrOpPJEIOZ1NWbBA5oEKo6XKkQxo/o5zRhAB741fil3NF1uBc65EqMv9EOgO3mn+M0PvDW+JOs6RnGHi5sqk1VSh+9e0hN0GzZq+SVVWUM0UgUpSwNGMYxjEBQkAyH0Orgdo9Q8WKh6HVwO0eoeLFQF/FgeoTbjglJ+RpDMn/Sk9sYfYVM6NjLdIqQjAydJygpoR24RgzSzjMH/Sk9sVT5Qmz0gAB0oAAAAAAAAAAAAAHvS/8AFG90MLv91Crj8EpvyNUZnL/xZ/dDDL/dQq4/BKb8jVHNb5PSrnnAAEtdA2Frc0Wp4FyXkSQ2gNX4WtzRangXJeRJDaAAAAAgflfeoZR/CwnJHAqZFs+V96hFI8LE+SOBUwAAAAAAAAAAAAAAA33gSk0qqHFlb6UzyWM5gwWeOYmbum5FkjRKzXN1xoQSHyfO7Ftz8Kd8gXAXngAAAAACjrKL7sq43u5Z/K2ojcJJZRXdl3E99ln8raCNoAAAAAAAM7sOTTvZQSfrlRy3lBBftbwmhSzYv9430iguwh9C99BcI5dyggv0t56Vm3uj/SAyUAABhF3K4QoGiX07UV0FtDQQ986wrnms1cziZOZpMD6ou7VMocSzxpzRVKRSyVQ6RZXTEQDj7s+nfHU0dlO69fmvL648q3VtTcRo/pV4XJx81Y49pycfPcnH2ZV8K1LPTcnHsSdnqh+bFB65CHdLFTGQIkIgQqY+pfqp5T/bdp/btC3579/xD+fqWfoe5Kpa5nL9CXt+nUOPTG4LP0rqDY1QPE+jU/Ej8e+Vc5ThdhfXtP5p+0Pk/hfjmp5JylNvWPyxPuZ/hnkhk6MjlSEvbk/FkH0QGO1zU7elZEu/UP0cC6BCD8vVrr8xvP3teX7d4zj67emns9vX1EeoiGp71ztGZTpKWNz6pzKXOca5HlcvFnzlV44U1Rdc+mceIfpPhOPjjtlTbftD7d2O3rs9tWk/pDKba0g/res5bT7RDT01yqLe8lFnVPSlGRyVpKG8MyTZIpCe0I9YQ7Rwp2QmrOcNoQezHZS/uEEluwPtTgtj/S6Gdu7Pzh9R/IY5jkfwNKfyaf2/5foAAf3n1yxS6DeDmipgnGGfoYRH0qN9Kco+BI/VgPnXNXK3ox+qaOaECwH0qPNA9Kyk0OuzSj/lgA+wAAAAAAAjflFtxpcX3uWfzNqJICN+UW3Glxfe5Z/M2oCjkAAAAAAXm5Pfcd25+DPuXuBIkR2ye+47tz8GfcvcCRIAAAAiPlRyQPhNmcI/rmX/AFzCmEXP5UbclzbuvL/CRFMAAAAAC/PBzuWbXcGmf1BQYL88HO5ZtdwaZ/UAbjAAABCTK47miRcNGfInom2ISZXHc0SLhoz5E9AVCDZ+FvdMWo4aSXlpBrAbPwt7pi1HDSS8tIA6BwAAAeo/6Untj2x6j/pSe2Kp8oTZ6QAA6UAAAAAAAAAAAAAD3Zf+LP7oYTiEJp2FuUT1VITiH/BKjNpf+LP7oYZf7qFXH4JTfkao5rfJ6Vc84AAlrbNO4ssSNIyRlTdPXoqllK5a3I0aNivs5EUUyaJCFH0ufVxWb+9VfOYDSgALocmhcyvbrWDnFUXGqp9P5onVbtmV28NpKQRI2axKXP2M5jR/eJaiEmSO3NE94aPORMhNsBA7K+9Q+jeFZeSOBU0LZ8r71CKR4WJ8kcCpgAAAABdtZXBDhiZ2npWE0tZKZ66cytu8VfTRKKjhQ6xSqm0o5+yb/AUkjostR1LaO7gS/k5AGv8AnLMKe8RSfzP/AJiqXKD24oq1uJeb0vQMhayeUxlrBcrFoXMQp4t8211heIKYcqPuspt3Fl3ggERwAAASFyfhdLGFbePYeO+QLiPQkPk+d2Lbn4U75AuAvPAAAUMLY08Vaaxk/R3qr5zAePn1cVm/vVXzmA0y6/KVfdnHiAXHYTLI2kxB4fKRu/emg5TWNZT9J3GZTiaI6o4cGSeuEi5459iECl2vZG3ucswp7xFJ/M/+YxnJ07jS3Xvcz/mboSQAVI5Uay9rbQzy3xbaUZLqcJNWsyO6KxJEuqRIZCMI5v3iC4seyyH57tV8FnH12grhAb8wN2npG82JGm6MrlBVeVGScP1GxVNhZRsTViFP7Atw5yzCnvEUn8z/AOYrByYe68p7uZNOSC6gBoae4ScNNLSN/Ushs3TUvmMoaLPWbpNvGB0FkyRMU0I5+tGAzexk2NNrfSxyoppHVQItH/eGRXD9IFTdx3vgDjQeBW4CdaWnlTvVSniZAraGbspQjD+oCTgAACNWM6SKr0swnCZc8EFik/xENVjizi4dHsq5pZ7T7skI6unGBI+pN2RXDX9HzihKhc0/OGp0zoG6A/qyD7o+nfLaeptZ2N59WrPuH115Xsb01v6isfaWKuTj56xx7Tk4+hQ0qJPKtl8vUJqiCivRj5/zXK6XB8drchr/ABpWZ/6fDNrtL7/c12un3aYiHpyptqZNUUHvDdVSWflr78JI1CND+o/QGLtrM1CotqajtqmQfgDmPqpxfke71N9r6uM++pfKt99Muf2uvFK6eUT1MMZo+nlqjnaDNPpP0ziRjRsi0bJN26egQhR8WkqPYUqz1Nv+EXU6c4++Pz15v5P/AH/dRXRn/HXp+g/p14d/4vssteI/Ft2/h1CJpmUiI5XWq89RT40vbqf6Kx+uNrXaqZzTlOGIzTPq7roICOSOmp+EUHyT6e+P98hrV/8Al97eM7Kt7Tubf8PKNlWDtk5uRXDRoon/ANHtDau5GumzZZ85SZtyKKHUNqZCCw/DfatK3VEoRdpQhMXxdVcR9mI+9OF2Nt3rxNvjHbw8+8krwfHWppz/AJL/AGhtWWsUJYyRaIEgRNEhSFh7Q9yMc3WDYjsj+Z9uI+xen5cteb2m1n6AABjXV95lGW25m0S9Zsc/xRk9BRz0RT8c8Y55Y22/eiiP+OuviUbaabOyKaBiNzNYx9lWGb+g37bz0gUz3HZeAIAyEVRZQHElfm2GJqeUnb26U+k0pRl8uVIzaOMxCKHb54xzezHZFropXynm68qHuZK+SANec+ris396q+cwE6clze67N351cRK5lfTSoyyxtLTMyvTwNFGChl4xze3mgKqxY9kb/wA93V+Cyf67sBZwPh1nRVK3Dpx3SFayJrOJK/gWDlm5LpJq6J4HLnh7Biwj+4fcABpXnLMKe8RSfzP/AJjxuMFeFOKCkPQIpTNEsc+Zpm/qN3DxOvyZX3s30AOa4AABeZk9SxJg6tyWPWbv/wCYORIoR2ye+47tz8GfcvcCRIAAAAiJlSyaeE2YxzxhoTuXG2PdmFMgufyo25Lm3deX+EiKYAAAAAF+GDNPUsK1rk+xTbT6ooPF+eDncs2u4NM/qANxgAAAhHlctzTIeGrLkT0TcEJMrjuaJFw0Z8iegKhBs/C3umLUcNJLy0g1gNn4W90xajhpJeWkAdA4AAAPUf8ASk9se2PUmHSF9sVT5Qmz0gAB0oAAAAAAAAAABovGPfqo8ONok7h0xJpfMnXms3YnbPon0NBQhxvQQ+ypu5gLwmYCbdKR2b5Xq8LYujG1tFxh7BnkPoHy62yrV2a3pCe0W6thSKDafy51K1VSqu4mTKukonnzRj7Ig+A5lgAACxywuS0o241o6ZuDW9xpw3f1JLm83IlLCk1IiC6aapIZ47ccw2DrP9nt9GsPiN/uCVOFrc0Wp4FyXkSQ2gA1Fhlw505hgoB5b6mJ/MpuzdzVabGcTDR1SCiiaScS5y7GaEEYfxG3QABA7K/dQ2juFReSOBU0LZ8r71CKR4WJ8kcCpgAAAABOSlcrLeCmacllPwtjRrgssaIMyq6o6IZQqRYF2s+bagINgAnzrwd4t6qi/lXv2iKWIi+0+xGXNdXPqSTsJa7ctEGkGzMyhkiESJ2Y7MRrMAAAAAGa2aupPLIXLkd1KaYS93MpCoczdF6Q5m54KIqJdFEhyjCgAT514O8W9VRfyr37Q14O8W9VRfyr37RAYAFr0ckHaBU5VlLpVhE3uUPuj+az9Z3fSrH4rf7gno1/Jkvey/QPKAq6q7GPWuBGonmFGhaQk1QyShIETazKcKL81OIuyQe9FBHYz/6Tt5h8fXg7xb1VF/KvftGmMoruy7ie+yz+VtBG0BZbbmWlyqyb6c3YWjR5rcHTbMU6e0o80QedEeKmrwjHbawhm9kZjrQFnd9Gsfit/uDGsjf+YrqfC5P9R0LHQETsP2Tut5h5ucwuhTdeVHMnrBBw3K3elRimYipDFjnjAufaN/gJYgADGbn80ehpVvMmjq/mE/1PS2tPmc+bP7GcVrZMi7J2Tl5Qz1fPqBinZkFl1xOp/U3cZ74A4oLsVcV5a65coqhuvqZE1dQc+4MA6EiGKoWBybUR+xg1oa2l9a0exmDJxBQp0CnT7MSdYZyA/MdvMMEuhaClboS0zWctYEclLmTckhmOQZ37YQz7Y9dvuNXaaka2jaa2j9YeOto03FJ09SPcSrnu5hori3Z1XjJqeZyv15PpyDX1q35GNcseaP8AWK6AtUcN27pKKDlEqiZ9gxTQzwiNAXawj0vWLrzw0epCTThOOkWKewQ8fZ7A+Z77y63OcLr8RyEf7KTWLQ+K08c/oN/p73aT8bRMww8B+kqdquRN4MamlZ0XLWGgZROOmSMB+R/mbz/C7rhd/qbXWrMepl+nthvNLe6FNWk9wDytmyztym3bp6ooobQIPyiioufUm5DqHG2baW9Wbqlnc3Js/wCqJ2B/R8T8V3nke/poUpOPv7z+0PDluU0eO0ZvM/f9Ifeltsadd0pCRzyXpOiLEzK6cM+caeqPBBSExexcySdOpalH/UpbQk2WEIbAZtgfs/acHstrtabWtI9UiIfWu08l5TYattTba01y+8tJ2wws0Tb12nNFInmL1LpVltmI3UQhUiQInDa2h+owhmz5x/YQhm2x/T0NDT29cdOPUOHkOU3XKan427vN7fy/oAA93ADxnOVMhlD7Q8gwW79bsKJpB7MXrgpCpomOfP6gBXVlN7sneuWdDMl82rmMd4QfAp/K23ikMiZSctsKMXKxbpt4Hgd5DPGEM0Ov2BFa+tyHl0blzeqHC+qEUV1BH3kowABPnXg7xb1VF/KvftETsQN8J9iFug/ufUknYS13MW6CBmzMyhkiESSIntx2YjW4AAsayOOl54rpZ/7FKfruRXKLHsjf+e7q/BZP9d2As4Gp8Ud2JrYmxVUXZkUqaTJ/ICNTpNXZzQSUiq6RRjCMYbMOnz+3AbYEb8otuNLi+9yz+ZtQEMteDvFvVUX8q9+0fw+V/vEdMxfQqoyEfZO9j/UQHAAAAAS+shlKrpWPthJLWyegKXmbCQkVSbOHKjqC6hDqqKbMIRzdeIzvXg7xb1VF/KvftEBgAT21369e9fRHxnfjR+9eDvFvVUX8q9+0QGABKzEPlC7jYi7aOLZ1HQ1Oyhm4doOTuWR3UVYGSjn2ox7IimAAAAAAL8MGeq86ta/Vun87bTP8UUHi/PBzuWbXcGmf1AG4wAAAQjyuObnapBn7dWXInom4ISZXHc0SLhoz5E9AVCDIKArOYW5rmnrgylu1cP6cmrWbt0XUTmSOqgqRQpDaIx8AE+NeCvJvVUV8q9+0f3Xg7xb1VF/KvftEBgAT1QywF6YE/C2tok5uzBR7D+oL5Xm8i5IENauj08/ZM8j9IgUAC8rBxfqo8R1olLh1PJpfLXXms4YkbMYn0NBMhBvQQ+yWW5gNwlfiYI6qdIAABqQAAAAAABDrKpn0MMbbhQw8EuJiiH2VN3MBeEzATbpSoIe3KpVMqgmrORydod3MZk4SatmxOnWWUPokIUeoM9sD1eLbcLZNy4g5lpGSrJUYnZrK2syhMKIaxcIkVMi5mbkqxY9iOZtsD2taXxO/ruguNnPkwuDABhNlKSmlv7O0PQM7O3NMqcp2Xyp0ZCOknqqDdNM2jHsZyjNgABHe/wDjjs3hrrNtQlwWNSuJm7l5ZmnGWMklk9RMcxNmJ1SZo5yx6w1rrs2GD9T15xS38oEVcrful5HwMZctdiEoCzu+VzJFlL6dY2dw9IPWU6pl8WpHpqlIVm3i3KTUOhOiZWMYx5q7A0vrS+J39d0Fxs58mH3ckH1dav4In5Y2FswClW5OTbxB2qoOdXEqSZ0ipLZCzO8dJspivFY0IbebOjs7YimL88Y25ZujwaefUFBgAJY0DkzcSlwqNltZMDU1KkJq3g4I0mT1dFyTPtZ8yOx+8ROHRZajqW0d3Al/JyAKpdaWxO/ryguNnPkw/Jck5ifhE0IzShs0ev5qL+JFwwAKe9aWxO/ryguNnPkw03iMwi3UwwNZI9uM5kSqdQqLotTytyovmUShCPR6ZC9aMBfQK7Msb6T7Z905j4JEBV4PuUVRVTXEqmX0bSMrWmM2mqug3bokOYx/0jj4YkPk+d2Lbn4U75AuA2ZrS+J39d0Fxs58mDWl8Tv67oLjZz5MLgwAeNAsSoJlj1iwgPIAAKOcoruy7ie+yz+XNBG8SSyiu7LuJ77LP5W0EbQEycn7i9tZhfl1asLjMKhVVqJdgo1NKmSS0IwRTXhGHRHL1oiXeuzYYP1PXnFLfygU9gAu9shj+sffy4bK29DSyrEptMEl1SRmDFFJGBUSGOeMTEWNHPmh2OwJMilfJh7rynu5k05ILqAHyKvlbidUlOpKyiWC7+XOWqWltaZ0jFLn/fGAqT1pfE7+u6C42c+TC4MAEQ8LdqL74dqZSkt0HEmftEDaCK0veqL9B6k2mQolqxet5g1Tdtj6aakM8Ig8ZoPm52rkmmmpDNGERoS119abjcGrLXKPyQcU1NFWR0zn2SlL1wEggHjIcqhCqE2h5AAAAB6r2XtZglFF0kVQvYiMacWzpddWKnMRCRj2IDLQjsbA/k73hOP5G2W60q2n+Ye+jutbQ/1WmHwZXRVPymOqIS9KB/VaOyPuwhmhmLDYH62tuI/kc8R0bPjtpx9MNrpxWP4hGrramvOWpaZfoAAdzzAAAAAHjOcqZDKH2gHjevG8vbKO3J4ETThnjERJxSWnv1iIptWS2vcSWXtFzZljzB8ohH+BCGG/pi7eV7M/MqX9BK25vwy3qxnLNogxbEatyaJCQzQgAqC1pbE7+vKC42c+TD8lyTmJ8xcys0obP3UX8SLhgAU960tid/XlBcbOfJh+S5JzE/CJoRmlDZo9fzUX8SLhgAU960tid/XlBcbOfJhtKxLFxkvXM5mmIspHre4iaKMs87BoPDFMy6fVoraj/atvZFmQriyyH5itX8LnH1GoDZeuzYYP1PXnFLfygYpdTFtavG7QU0wu2dZz5tWFawRLLVJ4xKgyhFqqR4eKiiZ1NjU2xtjN1xVMJJZOrdl2799mf8rdgNga0tid/XlBcbOfJgUyTeJ1NIxoTmgjR7rOfJhcIPE6/JlfezfQA5rgAAAAAAAAAZfam1NZXoruW28oSXc1zeZK/wC4gT9NVX1CRRKPWlsTv68oLjZz5MPi5LjdZSnuLMfBC54BT0bJNYoI7U3oPjVfyYC5JrFBDbm9B8ar+TC4UAFPetLYnf15QXGznyYSToHHjZbDHRsqw93Il1Tq1Pb1sSQTM8rlySrQ7hEuaOpnMsXPCMBPEUGYw91LdHhO98KAsi12XDD+p684pb+UDfmHvEhb/EvTMxqy3jebosZY+jL1oTNsVFSKsCFPHNApzbGY0OuOf4Wz5ILqEVdwsU5I3ATvEI8rluaJDw0ZcieibghJlcdzRIuGjPkT0BUIAAAAAAJUW2ybeI+59FyyuZSWnpUzm6cHKKEydLouYpR2s8IQjmz+yMoUyTuJ1uXShOKCNDus58mFpFgeoVbjglKORpDNH/SE90Kr2y33RzwS2PrLD5Zk1v67Xlh5j5sOn+nLljqo6ChCDfwAOh5gAA0AAAAAAAEPMqgcieGNDhMw8EuJhiHmVQ3MSXCZh9RcZbpSoQZrZB+wlV6aAmk0fINGTSqJWu5crqEIiiiV2QxzmOYYUA5Vug8uJLDrHpb+W5j/APdTHxo/vPI4dt/u3PfSx8aOe8AHSRK5nK57Lm05kz9s+YvkiLtnTVUqiSyRoaRTkOXYMWMI7cB7w1fha3NFqeBcl5EkNoAKgsrhulpJwMZctdiEwm1lcIFhiXkho7caMZctdiEoCaeSuruh6BvNVU0risZHTrNzSxkUXE3mKLQhz81NegKZU0M/8RZ7zyOHbf7tz30sfGjnvABeFiXvHaKv7BV7RVCXTpGpKgnEjctZbKpNO2r168cGL0CaKCR4nOaMetCAqE52zEVvC3H71n3iR9zB5upbXcJ2XhRfmA58OdsxFbwtx+9Z94kXUW8v5YqQ2/pmSTy9VBMJhL5MxbO2zmpGSaqKpG5IGKYsVIRhGERucc6l1+qjWPCCY8oOAvl55HDtv92576WPjR/C4lMOh45i39txGPsVUx8aOfAAHQhzyOHbf7tz30sfGiFuUtdtcQNMULL7DuyXIdSZ++UmKNIqFnBmZDpplKdYjY0Ywhnz7ERWCLEsjn6b7mdzZd4RUBDTnbMRW8LcfvWfeJG9cDdkL1UjisoCoKqs/W0nljV07O4fTGROmzdKJma5YQMc5c2f2xc0AAAAAAAAKbcedk7zVjiyr6oqUtFWU7lLs7CCD+XSJ05bmMSXNSRgU5C5s8I54RzdcaC52zEVvC3H71n3iR0HgA5yqtt7X9ALNm9eUPUNNHdlOo2JOZYsyOsQvqdUIUY8LG8sjoeb1q4m2+Y5x9dqK5AEmcnRVlL0TikkM/rKopVIpYSXTJMz2ZvCNECnM32oHVjCH+MBbvzyOHbf7tz30sfGjnvAB0Jo4icPq6pEG99LeqKHjmIQlTsomNHsQhBXZGwxzlW69P8ATPdll4Yg6NQAUdYj7lVHbPGjcepqVmOpOG9RrQjDsRzC8UUJY0ykLisufHs1A5j/AIALMMJ2MqmbqSRBhMHcEJkiXRXa5tksezAS2aPGz5Eq7RUqicdqMBzi03U8+pGaoTyn5ku0dIH1Qh01BYPhlyiqScWlO3GNBq5j+DK4j0hwFnQDDaNupSlZs0nMumSBzK7UEz6RY/vGYEOU5dMm0A/QAAAAAAAAAAD8HOROGmc2aAx2eVzK5VHmdr/pbqPSpJgPvO3bdiiZw6UKRMm3GI05Wt66APNPO/PLmUvTDaEPwkZpOW7U6n7lDlGlMdt7K/s/auX1IgQqbqfzHzObFh1vwKhhUnUlTz6rpqvPKgmS7t0ufozqKAL7JRf3DTJmZWrS/VuClh1/PWx2f/yj3+eRw7b/AHbnvpY+NHPeADoQ55HDtv8Adue+lj40fyGJTDpGGeF/bcRhwqY+NHPgADoQ55HDtv8Adue+lj40fmGJXDnHav8AW3j/APdTDxo58QAdCHPI4dt/u3PfSx8aIB5V+5lt7hSa2haCuBTNSnZuZtzQSUTZB5FKESNdmMEjGiK6wABJLJ1bsu3fvsz/AJW7EbRJLJ1bsu3fvsz/AJW7AXiDxOvyVb3s30Dyjwu9lqtDspm+gBzXgAAMrpK1F0a/YKzSg7a1XUrJBXUFnMqkrh2Qh/UGOmQw+5ztmIreFuP3rPvEi4PJ6s2rfCDb5dBomgo5bPFFdGG2bm1wJGAOciraArygHKDOvKLn1NLuyaoijOJYqyOsT1ZSKEKPgCxDLGFLGsraxj+rJh4VMV3gJa5LpROGLSTpl24yiY8nF0IpeyXcCxxaSY0OtKJjycXQgAAAAKRsVdh74VJiQuRUEgs3W80lj2onarV6zp90ugumY3WjDYj7cBdyADnw52zEVvC3H71n3iRYhk3KgkdhLT1LTN9JsxtxOH1RKPWzCrHJZS4Xb6glCCsE3JixjCObrCf4qYyvvV2o/giTljkBZDzyOHbf7tz30sfGiKeUWqemr62KldHWOqCXXEn7WqGcxXl1JuiTd2VqVq7gdaKLU0Y5oZ/aFTYm1kkN0vPOBj3lrQBGrnbMRW8JcbvWfeJA+G/EPvCXG71n3iR0IgA57udvxD7wtxu9Z94kOdsxFbwlxu9Z94kdCIAMIsgxeS6ytAyyZNVmztpS8qbuEFiaKiShWiZTFMWO1GEYRhGAyx/0pPbHtj1H/Sk9sVT5Qmz0gAB0oAAAAAAAAAABD7Km7mAvCVgJgj49U0dSVcy3zHrOlpTUEv1Qq3Mk1YJO0dMv6egoMsQ52QHQOxw44eDFUz2Ftzsm2f8Aqsx8UPPHDZh0jCMPQCtxH2POqw8UOWz1hz4gOg/nbMOsNqwVuO9Vj4of3nbsO28JbnvWY+KAerha3NFqeBcl5EkNoCiq/l6byUXfW4dG0Zd2spHI5HVE1l0slkrnrpo0YNEnRypIIopHKQhSjBeeTxFb/Vx++l944BJPK37peR8DGXLXYhKPs1VW1YV3MiziuKum9QzFNIqBHM1frO1iIl/Q01DmHxgABMLJi2noG6185sSvqcazlCQSI0zat3SZFm5luaCI5zENCO1DZFp3O3Ydt4S3Pesx8UApSwebqW13Cdl4UX5jBJRYWxtPzRtO5DZmhZbMGR4KtnbOnWaKyJ4bRiHInAxY+zCIzsAHOpdfqo1jwgmPKDjorGvXOHfD88XUcvLF29XWVNpHUUphkYx49mMYpZ4xAc9YDoQ527DtvCW571mPihUZlHaPpSh8UM5ktHU9LZOw8zZcsViwaJt0Cni3zZykJCEP4QARiFiWRz9N9zO5su8IqK7RYdkdiZ65uOt2JSwL/wDkMAtIABoXHTPp3S2FKv6gpmdzGTzRm3aHbPpcuZBwieL1Auchy7MI5oxh+8BvoBz4c8niK3+rj99L7xwc8niK3+rj99L7xwDoPAeJr+TJe9l+geUAAU248r1XmozFlXtNUnd2tpJKWp5eZBhLp66bNyGPLmp4xKQh82eMYxjEaC55PEVv9XH76X3jgE18sh+e7VfBZx9doK4RZtkzkUcQcmuA5vylG5R5K5lpZWeryea5mZFCuonIkZ0WMYQ9oTa527DtvCW571mPigHPeA6D44bcOsemsHbmP/2qx8UP7zt2HbeEtz3rMfFAKELden+me7LLwxB0ajUFa4fbDSuj59NJXZGgGj1pLHSzdwhTTJNRJQiR4lMU0E88IwiKT+eTxFb/AFcfvpfeOAdB4oUxq7qy6HCBb6BjfPJ4it/q4/fS+8cLdsLtorTXEw+0HXNfWvpKp6jnUmRdTGbzmTNnz12tHPnOsuqQxzm9mMQFIQDoQ527DtvCW571mPihWRlU7fUNQN3KPa0PR8mp5s7pqJ1m8oYos0jmK7P0RipQhn/gAjjbTEJc61blJSn6gXUap/8Ac11NNEWJ4OsZ9TX3qpe35JcdObtJcaY7P4k5CHIUVQiZ+SdhpYoXhvUUo/h/+duAtQJXU2lvQT6QLFN2Ux76NxKcPDOu4ihDsmGTRKWO2PQfU9JJkmdJ/LEFyKF0TFOXPCMAHpJV1Sa3STtvH+I/ild0mjHMpOkC/wAR407eUOhD8FTLAkPYTzD+nt5RCv4ymWJ/dJ5wHhXuLThC6bZxFzDspj0I1zOZn0Mjp9aOfpYqdcUx37v9e+n72XBpun7sVXKZXKaqm7FgzYzNZuRq2SdnKQhdEYDzyGIff6uN30vvHAL2CU7V0+hBSdzXmROPTIpj78kpOSyMsDM2sNU9cPsmFBHPIYiN/e4ffS+8cHPJ4it/u43fS+8cAsZywPUaojhMbkqoqhGU1bdS6Nfs0JfXlyqoqVq0V1dFGcTdw7IQ/qykUOYYsAANm4ZaJpu5N/KFoOrGZ3Eonc3TbPEyKHIdQkReHzt2HbeEtz3rMfFAOe8B0Ic7dh23hLc96zHxQ/nO2YdM2b0ArcZuCrHxQDnwAdCHO3Ydt4S3Pesx8UKhsopSNMUVinqGS0fTzCTy0jGWnKxYNE26BTmaE2SkJCEP8AEaAAToyVlm7b3OrWtpzcClJfP1KcaMoMEJigRw3hBfV4HiZFWEYZ9jrwAQXEksnVuy7d++zP8AlbsW/c7dh23hLc96zHxQ0jjTtrbe0mGStrgWrt/TdG1RKkWMGE6p6Vt5a/ZxUmDchopOESFOTPA0dqICWg8Tr8mV97N9A58+eTxFb/dxu+l944D4kMQ6hOr1cbvpfeOAa6AAAXm5Pfcd25+DPuXuBIkR1yepIEwc24JDag2fcvciRQCrvLGem+2fc2Y+ESFdo6L6wtjbW4CrdevLfU1UirQhiNzzeUoPDIljtwJqpDZv3D4HO3Ydt4S3Pesx8UAqnyXG6ylPcWY+CFzwhbj6oaibLYdZjXVnqPkdCVIjNGCJJxTUuSlj4hDqZjFIu3IU8M/tisLnk8RW/wBXH76X3jgHQeAoTtniFv5MbjUowf3yr5yzcztgmugpUr46ahDOCC+wAAAABUxlfertR/BEnLHItnFS2V8TKa/NImj2oJw/41yAgkJtZJDdLzzgY95a0EJR9mlazrCg5kacUPV03p6YqJagdzKn6zRY6Jui0NNMB0egOfDnk8RW/wBXH76X3jhsXDffu+89xCWzkU6vVXcxlr6rZO2dNHlQulkHCJnRCnIchzgLygAAAepMM2pljHsii69uIC/MovRX0olN66+ZsGdTzRu1at6lfEIgQrs5SEIQpxhR8SGIff7uN30vvHCq9i/kBFPJs1ZVlaYczz6tKlm89mUageJ81TV2d2toFIT9NQSsHRCAAAakAAAAAAAAAB7sv/Fn90PZjtj1pf8Aiz+6Hsx2xzW7ekP0AAJa5+MUm6Yuvw0nXLTjWA2hik3S11+Gs65acavAAAAE78kF1dqw4In5Y2Fs4qWyQnV7q3gery1qLaQABr3EHXM7tnZKtLg02RqaaU/KF37WDqGdKJ0y54aUOxtir3XacTv6joLilz5SAuEAU967Tid/UdBcUufKR+S5WPE+UudWV0Nn7lr+OAXDCmHKj7rKbdxZd4Ifa12nE7+o6C4pc+UiNl772VfiCuA4uLXSMsJM3Tdu0MSXonTS0EidmOyAwAWJZHP033M7my7wiortFh2R1gYtc3IhH9VMPrmAWkCO2UI3HdxvgzHl7cSJEdcoVCMcHVx4Q/szH+YNgFGYAADpRa/kyXvZfoHlHgZafMaGq9PqZdL28w84CjvKK7su4nvss/lbQRtF2t38ndYi9tx5tdCs5lVpZxOTImXIymCKbcupIlSLokMib9EvXjHZGHa0zhg/XFecbN/JwGtMjb+Ybp/C5R9R0LHRWdfV86yX7qTyzDoYj1C4aariaFqcsHhimZbBdRgjqOb8q2YbI1ZrtOJ39R0FxS58pAXCAKeTZWHE/Dal1DcVL+OH612nE7+o6C4pc+UgLY7idT+pu4z3wBxzlCbUsynuI2t5k1oucSmiiMJ64LK3SiUuXgcqS8IkzwzrdiMRKrWmcMH64rzjZv5OAp7F9mCzcp2v4PN/6jS+tM4YP1xXnGzfycSptnb6SWqoOS28ppZ4pKqfaFZMzPFCnWimXa0jFKWEY+zmAZSKocsF1Y6I4MG5YoLXhU5lgurVRfBWPK1gEDBNPJL7p2ZcEX/KWghYJn5J0qsMT7uJtrzqPvDoALhwAAAAABz4YlN0VdHhrPOXHGuBc5WOTDw611V07raeTatCzKfzFzNHnM8ybppxXWPE54whqEYwhnNsbMR8fWmcMH64rzjZv5OAp7ASFxy2Co7DjedCgaFcTNWUqyRtMCmmDkq6sFDqKE24wh2OwI9AACR+BrDLT2J66D+narnLpnJZLL4zB2m1jqbh0WMYJEKVTrQ2RPXWmcMH64rzjZv5OArmwVbqy1/CBH6BfWIo23ybNgbVVzJLh0rNqxNNqfdQdsoO5igokU/sl1CEYw/eJXAAAAAKV8p5uvKh7mSvkguoFKeU3gaGL+pzQ67CWciIAiqLHsjf+e7q/BZP9d2K4RuHDtimuZhjdzp5blKUKmnpUCPCTFqopH8FDsw9sBfqI35RbcaXF97ln8zaiBmu0Ynf1JQXFLnykZTazFxdHHDXsswv3gYyBrSVaxULMlJG2UbPCQapneE0DKHUhDOdpCGfMAgGAuE1pnDB+uK842b+Tj8q5JvDCRuqUs3ryGeEYxzTZvn5OAp9AAAXm5Pfcd25+DPuXuBIkR1yesIwwc24hH+zPv5g5EigABCvKAYvrq4Y6ho+WW7byBVKfM3S68JmgdTMZKMM2aJYwzQzREUNdoxO/qSguKXPlICZmVG3Jc27ry/wkRTAJIXxx63txAUA4tvW7Omk5U4coOTqMGipFtJKOfrxj1xG8BldqOqjR3CCXcoIOisc51sSOT3LpPmdQia/m2w0Dqer5oIOjEAAAABUxlfertR/BEnLHItnEf8AENgmtFiYquX1fcSY1Ki8lrCEtQLLHiSKcEoKGU2YHSPGMdI0euAopAXCa0zhg/XFecbN/JxHDHfgds7hss7LK8t89qRWYOajbSwxZk+TXJFE6Ds+bZLDsAIFDZ+FvdMWo4aSXlpBrAfaoirptb+sZFXUhghGZU5MWs0aQcJ6ZIuEFSKF0wHR4Ap7LlZMT0duU0HxUv5SGu04nf1HQXFLnykBGq/3V4uRwtnPK1BgQtyprJx2CvHTsqu7V01rBKeVwyQqKYEaTJuVArt4mVdWKZYt9jZN/gPcdZJ7DAiSBoTeu4Zo9abN/JwH8yWW5gNwlfiYI1zYmxNGYeqKNQFCOpmvKzvlX3/SK5FVtNT3JCjYw6q9IAABqQAAAAAAAAatxFX/AJBhwt+W4VSSSYzZmd8lLtRY6GnpqDBt+X/iz+6HtiADfK9WcbF0TWwrKPzb+hoD79G5Vq1Na1fI6Nl1tKrTdz2ZNZYic5kNAqi6hSQjHoutE3+A57dvVOAAASOfjFJumLr8NJ1y041gLJru5LG6txrr1lcKWXJpZk1qOfv5u3buE3MVEiuFzKZo6MIwz7MNoYlrPl4t9Wi/knv2AIDAJ7a0DevfQoj4rvxQ/es+Xi31aL+Se/YA9TJBdXer+CJ+WNhbQKyLf2xm2S6m615LpvWtXSyqG0abQa08maC6Tg5iONM2rZtKEYNow2IjPteBs7vW1j8Zv98BJbGNuWbo8Gnn1BQYLIr75UG191bO1fbmT25qho8qKUrS9FZyZCCZDqQzbOzEVugAAJq24yV966+oiU1c+q+m6eVmqEHXmc9gqdRIp4Z4ZzIQzbUeyAhUAnzrPl4t9Wi/knv2CJ2IWxlQ4drmvLYVLNWcydsm6DuDlkVQqRyKk0tqOzABrcWJZHP033M7my7wiortEncDOLGl8Ks9qma1RSk0nCNRt2rZPmExIGR1HswjtwAXciO2UI3HdxvgzHl7caP14Gzm9fWHx2/3xrDExlKLZXvsbVdq5Jb+p5e+n6CKSbhyZCBCaLhJTPtxz9KArxAAAdKLX8mS97L9A8ogC1ywNpTN0jq2pq4kTQzZtVbx/qPNrv8AZ3eurH4zf74CfACARcsHaSP/AIU1d8qh9o8uu/2d3rqx+M3++A1/lkPz3ar4LOPrtBXCLKLhSxXKsKsJxapUtHJ211Rq9JUJDRO4M96xdQz5oQ5lGIaz5eLfVov5J79gCAwCVmIbJ5XHw6W0dXMqCtqdmrFm5RbHbsCOiqZlY5s+zDsiKYDIbden+me7LLwxB0ajm8piakkdSSqeKEOoSWvW7o5PV6mfSFpJcsDZ+P8A4V1j8ZD7wCfQCA2vA2d3rax+M3++JlWluLLrtW2p65EqYuGTOomJHyDdwbOqQhtqBvZAZeKocsF1Y6I4MG5YoLXhDHHBgfrvFLXtP1TS9YyKTN5PKYy85H6axjqGisZTPDQhGGbZgAp3E08kvunZlwRf8paDJtZ8vFvq0X8k9+wb3waYBrg4ZLuLXEqWt5BOGislXluoMCOCngY6hDQj0cM2boQE5gAfBryrGdAUPUddv2yjhtTspdzZdJLp1E26J1TFL7MYFjCHtgPvAID67/Z3eurH4zf74a7/AGd3rqx+M3++AnwAgInlgLTHzwPaerixh/5qEf6j967/AGd3rqx+M3++AjplaN07LeCLDlLsQsFjldWOn2U0nhcQ9sZ4wpGVS9uWljsZ6moZcyreMVjG/A54Q/Ks231hjms+Xi31aL+Se/YA/mR96sdb8GC8sTFrwrIoCgZpktJs5ujdJ80rCX1g38wG7an4KEVRXgoRbTPq+bPCMIG2ojPteBs7vW1j8Zv98BPkBARbLAWkIWJkrU1cpm/81CH9R+teBs7vW1j8Zv8AfAT5AQG14Gz29bWP8UPvCdNPzVOeyGWztNKKZJi0RdFJH9GChIGzf4gPoClfKebryoe5kr5ILqBSnlN4mji/qcsOswlnIiAIqgA3HhowuXAxP1NMKfo1zL5e0lKBFn0xemiZNvE3SQhCGzGPsQAacEksnVuy7d++zP8Albsbn1ny8W+rRfyT37BtTDBk3rmWFvrTF1p5cGmpmwkRncVGzRNyVY+rNDobETQhDrwAWEjxOvyZX3s30Dyj8Kk1RIxPVQzAOawBPnWfLxb6tF/JPfsDWfLxb6tF/JPfsATUye+47tz8GfcvcCRIrupHGnReCCnmeFmuaRnE/nlBEi1dTGUaMGrgy8VXUIk1TNGGwaOxEfZ13+zu9dWPxm/3wGs8sZ6b7Z9zZj4RIV2iye4VPuMqk5Z1VapwnRza35VJc7JURDRM5O6LpEMTUM+aGYoxHWfLxb6tF/JPfsAQGASqxGZPi42HG3Cly6grWnpqxReIMlEGCTghyQVjmz7MIZ9mAiqAyu1HVRo7hBLuUEHRWOdC2J1iXLpNRuhq5052wUIT1Z+aCDovAAAQuujlQ7W2quNUNt5vbqqXjynX60vXXamRimdRPbjDObPDOAmiAgPrv9nd66sfjN/viSeGDE3TGKSkJpWNK09M5Q2lUxjLTpv9HTOeCZTxjDR62Y8AG5RCTK47miRcNGfInom2IR5XLc0yHhqy5E9AVCgAAAAADoZsD1CbccEpPyNIZk/6UntjDMPxjHsLbY5oZompCTxjDsR5iSGZv+lJ7YqnyhNnpAADpQAAAAAAAAAACH2VN3MBeErATBEXcopb6tbm4f0qVt/TUwns1jUDNxBq1Jpn0CkOJt0pTGM9sD1eLb8LZNytMZaXBZisN0tiqqh7bQZnZnCDiap+8FDT2c2WqdpLpXUsudunKjaH4NFNwQ5z/wCERzLXcgAAADUU9xb4a6YnT+naivLTcumcrcqs3jVw5iVRFZM2ichoZtuER6XPp4U9/ek/nn/IBuoBiturm0BdeSq1LbqrZdUUtQcnZndsVNNMqxSliYmfsw0ofxGVAIIZX3qEUjwsT5I4FTAuQynNrLiXZtHS8jtvR8wqJ+0qMjtZuyLAxypFQVhGP8YwgK2ucqxWbxFVfNoANKANr1PhSxGUZT76q6os/UMslEtRi4eO3LaBSokGqAAdFlqOpbR3cCX8nIOdMXi2zxlYXWFuKYYP72U22cMpMzbrprLmIYiiaJCmhGEYdkBJEUw5UfdZTbuLLvBCzTn08Ke/vSfzz/kKqcoVcWiboYlJjVNvqkaTuVHljBArpmbSIY5UtrOAjSADIKEoGtbl1AjStA069nk2WIdRJo1JpKnImTSOAx8BuvnKsVm8RVXzaA8a+DPFSgmZWNiKuMbsQl5jxAaYAbr5yrFZvEVV82gHOVYrN4iqvm0AGlAG50MGWKpdMqsLEVcU3YiyMSI8nOVYrN4iqvm0AGlAH2Kxo6qLf1E9pGspI5k85lxiEcMXRNFVGBiaRB8cBZzkb/zFdT4XJ/qOhY6Kpslzfa0VnZZcJrc6vJVTqk3cy47Erw8S6ommR1n2cwnfz6eFPf3pP55/yAa7ynm5EqLulLeUlFK4tbygmJiwdysM07pKhbqSGeTZ0/l5k2bVYxzqFg4hn2oewKpAAAG35LhDxMVFJmFQySytSPpbNGqT1q4I2hoqpKkgchi/ujD+IDUAvswWblO1/B5v/UU/c5Vis3iKq+bQFnOHTEVY+zlkKNtbdG5UnpirKYlicum8pmKxiOGjksY6RDwjDsxASyAaV59PCnv70n88/wCQzu3F2bb3al7qaW2rKW1E1YqwQcrsT6RCKRhnzRj2QGXgAAA1ziR3O10uBc75CsNjDBb7SeZ1BZC4UgkjI7uYzOlJsyZt0+mWWUaKkISHsxNGEAHPGA3XzlWKzeIqr5tAOcqxWbxFVfNoANKAPbnEnmVPzh9T08YnaTGWulWrxsp06KyZ9E5DD1AFwmSZ3MEw4WvuTtRNIQryS54HwxTM0O29/wAnaiagCA+WB6jVEcJjclVFUItaywS8CWkoZD9Jaojwh+5A32iqUAAAAB0a276n9M9xmXgCDnKF5lA4z8LDahqfauL300iq3ljVFQiq5imKYqRIRhGEYdkBIoUr5TzdeVD3MlfJBZ9z6eFPf3pP55/yFUWUDr+jbmYm57VlA1E1nEpVl0tSK7aGzkOcrfsgI4Cx7I3/AJ7ur8Fk/wBd2K4RY1kcTFjUd0c39jlfhHACzwAAAAB+DnKQsTx6wD9gNK8+nhT396T+ef8AIOfTwp7+9J/PP+QCprKDbsW43wppyBAR4EwMU1jbv4gL+1bd6zVvZtVlH1Gs2Ulk4lqem2dkTbEQPt7ObYjs+wNVc5Vis3iKq+bQATZyOnpRub3Tl3glhYkK4cAE1l2EOSVlJcSzgtuntSPGTmVpTuBkjPCJJqEOcuxHPs5hLTn08Ke/vSfzz/kA1llRtyXNu68v8JEUwC3TGnda3WJexj61Ng6uYVzVzt+0eISmTniqudJI0TnNmhDYhCAr25yrFZvEVV82gA1/ajqo0dwgl3KCDorFF9F4TMSdH1lIqqqOzFSsZTJ5m1mD5wdtDRRQSVIc5v4Qj/AWzc+nhT396T+ef8gG6hQZjD3Ut0eE73wouJ59PCnv70n88/5Cry/eHS+d4L01tc+2lsJ7UVJ1POXMxlE0Yt9Nu8bnN0CpM/tAIrC2fJBdQiruFinJG4gLzlWKveJqr5vAWR5Ma1dxLS2jqiR3JpKY0+/d1Ed0g3ek0TmRi3SLCMPixATGEJMrjuaJFw0Z8ieibYhHlctzTIeGrLkT0BUKAAAANzN8GWKZ43QdtbGVSZFchFCmI1gPLzlWKzeIqr5tABddYHqE244JSfkaQzJ/0pPbGMWYlj+R2eoWSzVqZs+l9NSxq5QNsGSVTaplOWPswjCMBlD7pC5tvOKp8oTZ6IAA6UAAAAAAAAAAAAAD3Zf+LP7oezHbHrS/8Wf3Q9mO2Oa3b0h+gABLXPxik3TF1+Gk65acawGz8Um6Yuvw0nXLTjWAC3vJHbmie8NHnImQm2ISZI7c0T3ho85EyE2wAAABpzGNuWbo8Gnn1BQYL88Y25ZujwaefUFBgAAAAAAAAsSyOfpvuZ3Nl3hFRXaLEsjn6b7mdzZd4RUBaIAAAAAAAAACjvKK7su4nvss/lbQRtEksoruy7ie+yz+VtBG0AAAAAAAGQ269P8ATPdll4Yg6NRzlW69P9M92WXhiDo1ABQpjV3Vl0OEC30C+sUKY1d1ZdDhAt9ADSgteyP3UarfhMXkqQqhFr2R+6jVb8Ji8lSAT4AAAAAAAAABz4YlN0VdHhrPOXHGuBsfEpuiro8NZ5y441wAuEyTO5gmHC19ydqJpCFuSZ3MEw4WvuTtRNIBAfLA9RqiOExuSqiqEWvZYHqNURwmNyVUVQgAAAAAAAAAAAseyN/57ur8Fk/13YrhFj2Rv/Pd1fgsn+u7AWcAAAA8Tr8mV97N9A8o8Tr8mV97N9ADmuAAAXm5Pfcd25+DPuXuBIkR2ye+47tz8GfcvcCRICrvLGem+2fc2Y+ESFdosSyxnpvtn3NmPhEhXaAlxkuN1lKe4sx8ELnhTDkuN1lKe4sx8ELngGK3X6ltY9wJhyc450x0WXX6ltY9wJhyc450wAX54Odyza7g0z+oKDBfng53LNruDTP6gDcYAAAISZXHc0SLhoz5E9E2xCTK47miRcNGfInoCoQbPwt7pi1HDSS8tINYDZ+FvdMWo4aSXlpAHQOAAAD1H/Sk9se2PUf9KT2xVPlCbPSAAHSgAAAAAAAAAAAAAe7L/wAWf3Q9mO2PWl/4s/uh7Mdsc1u3pD9AACWvhOaFol4uq7dUdI111jRMoqrLkTmOaO3GMYlzxHj9DygO0an+LEPujIQAVG5UiZTGh8Q0llVFTB1IGalJNFlG8tUi1TUPF47hs6Ox/AQ89EW4HbxUPGaolzlb90vI+BjLlrsQlAWA5Jmp6jn99KsTnlQTKYETpI50yvHZltH/AExtswzi1UVMZILq7VhwRPyxsLZwGmMZaCTjCtdFFaHQRpt3GP7i5xQgL88Y25ZujwaefUFBgAL+LGWhtbTFn6NlkooKSlRjKGzqEFGiax4KLJwVOaJzwzxzmjGIoHHRZajqW0d3Al/JyAPZ9DygO0an+LEPuinPKXyOUSLFdOGsolrZmgpKpccySKcCFjHmf2NgXWimHKj7rKbdxZd4IBEce3LZxNZM55sk81dMF/VtXB0j/wCUeoADIfRFuB28VDxmqPG5rmtnaJm7ysZ2ugp05FH6pyD4QAMh9EW4HbxUPGaoeiLcDt4qHjNUY8ADpRa/kyXvZfoHlHia/kyXvZfoHlAUcZRbdmXF99ln8raCOAkllFd2XcT32WfytoI2gLFskbbqiapNcKq6iptnMZpKzS9o1WclgrAiKxXBzQhCOxs5hY/6HlAdo1P8WIfdEA8jf+YrqfC5P9R0LHQGNOLaW5dQhBxQFNqwLGBoapKkDQz/ALyjyeh5QHaNT/FiH3RkIAMBr+gaESoKpFE6JkBTFlD2MIwlqGxHUD/3RQR6ItwO3ioeM1R0KXE6n9TdxnvgDjnKAZD6ItwO3ioeM1R8Ny5cvnKrx4udddc2qHWOppnOceIAAe/Kqhn0jOZSRzyYsDqdPzI4Ol9UegADIfRFuB28VDxmqPGtXNbO9S5orGdqamYpyao/WPoHKPhAAyH0RbgdvFQ8Zqj8rV/Xi5DJqVpPlCKE0DkPM1R8AAH3yXCrxMhE064nyZE+kInM1h+vRFuB28VDxmqMeAB+3LlZ2sq4cLnXXXOY5zqdGc5zD8AAD6cqqepJGQycjn8xYEU6cjR2dL6o970RbgdvFQ8ZqjHgAfTmtT1JPCJJzyfzSZETNqhCO3Z1dD4w+YAANqYW6Sp2u8Q9A0dV0uSmUmnE5RbO2ypzlgsXML4fQ8oDtGp/ixD7oo1wVbqy1/CBH6BfWAx70PKA7Rqf4sQ+6OeWuWzZjW1Qs2aepoITR0REnqCFWOOjsc5VxfT/AFN3Ze+GOAx4W/5Ma1tu1sNLGsV6QlribTt+8TfOHCZXEVYIrnITZNCMNiAqAF1GTD3IlO90plykwCRvoeUB2jU/xYh90e9K6apyQnOpJJBLpeZSHRxaNCJRN7ejCGcfTAAEdsoM9fSvCBcGYSx4q1dIpy0yayZ4lMSPmk12YRgJEiN+UW3Glxfe5Z/M2oClr0RbgdvFQ8ZqjyNrhV+o5STUrifdN+s1hjQ8rX8pS92QB0Yeh5QHaNT/ABYh90PQ8oDtGp/ixD7oyEAHqy+XS+UtSsZYxbM26fSot0ipkLn7BS7EB7QAAq3yxSRPPvbdf9PzKflh8cv2ivEWJZYz032z7mzHwiQrtASyyXzdFXFvJFFOnRlMyMT97fMLpBTDkuN1lKe4sx8ELngGIXhQSdWkrdsuXOmtTkyIeHZLFspCI52B0WXX6ltY9wJhyc450wAfXYVhVsqbcxyuqpu0Q9ZQfrJEHyAAZD6ItwO3ioeM1Ranklp3Op7ZGrnU7mrt+sSq1CQUdLRUPm5kb9eIqLFs+SC6hFXcLFOSNwE7xCPK5bmmQ8NWXInom4ISZXHc0SLhoz5E9AVCD9kOdA5VE1DpnT6Q4/AAPvkuFXhCFTTrifcZrD9eiLcDt4qHjNUY8ADobsModSxlulVTRiY1Jygxox68Ys0s4zB/0pPbGG2B6hNuOCUn5GkMyf8ASk9sVT5Qmz0gAB0oAAAAAAAAAABHPHheKv7G2SSrm280TYTSE7atDnUaEcEOioU//ISMEPsqbuYC8JWAm3SkLUMpvi6Qhm8+UmND2ZI2iP0bKdYv4bVayXiFoIpAOZaVhcp1i+jt1vJ+IGg/uufYvO3GTcQtBFIAErC5TfF/HbriU8Qsh+tc8xeduMm4haCKIALTMMtrKNygNAPL14m2Ss8qqVTZem27mXqHl5SMkk01yE0EYw/SdHjEbc1sPCJ2mzfjtz94YlkjtzRPeGjzkTITbAaTsnhCsjh7qN7VFr5I/YvZkyiwcmWmCq5TpROU+0aO3nLAbsAAGP17RUguPRs4oSqElFZVO2h2jxNM+gYyRtuEI9YRx1sPCJ2mzfjtz94SuABFHWw8InabN+O3P3hBWo8ofiit/UEyoWnavlJJTTr1WTsinkjQxyt2xoJEz/uhAXMDnUuv1Uax4QTHlBwEg9c8xeduMm4haCVuHewluMc1tUL/AOImWOJxV8xdLy1VyxcnYEig3joJwgRGMIdnriqQXP5LnclynuvMPCQAezrYeETtNm/Hbn7whxlGsKNocOskoaa2slTtipOHj5B6Vw9UWgoUiacYbfti3UV25Yv0o2y7pzHwSICrsbNw1WoYXwvlStrppM1Ze1nblYqy6SemoUiaKi+aA1kJD5Pndi25+FO+QLgLIdbDwidps347c/eDWw8InabN+O3P3hK4AFLKmU4xeIm1Lz5yaMez5gtB+dc8xeduMm4haCKzr8pV92ceIBlVz7m1XeCu5pcaunjd1PZwZI7tVNuREh9TRTTJ0Bf7hBioAA2xYvFFeTDqSbNrVz9pL0J2okq9I4YIuNJRKEYZ4ap7EY/xG1tc8xeduMm4haCKIAJWKZTfF+XarmUw/wDgWQ/WueYvO3GTcQtBFEAEo5nlKsWk5lryTvqxlBm7xE7ZWKckaZ4FUhm+iIi4AAAtJwoZO+wFeWIpmvLjMJlOZtUrYszMYrtVsVsQ20hCEI580M2znFWwvswWblO1/B5v/UBrvWw8InabN+O3P3hAPKI4eLcYdrlUzT1sJc4Yy2bSCLpZJw6UXjFwVyoWEYZ/YzC6oVQ5YLqx0RwYNyxQBAcAAAGT2xpJGv7l0nQbh8doSpZ2wkx3KaemdEjlwRPTGMDY+GvdFWu4ayPlxAFrjLJg4TkmaCT2lJs4cJpFIot5suCxUjDr7Bh5dbDwidps347c/eErgAROJkwMJBNqlZ5H2544+0fvWw8InabN+O3P3hK4AFHmPmyFAWBvg2oi27ByzlSkibzAyay53BtUOooT+gjYJp5WjdOy3giw5S7ELAAAABufBiU5sVVr4pq6MYVG00odmGbZF94oUwVbqy1/CBH6BfWACLMxyaeE+azBzNH1IzdRy7WiuseM5cdEaP8AvbQlMACKOth4RO02b8dufvDfNorRUTY+im9vrfM3DSTNVVVkkl3BljFMpHSN0RtnNnGagAAAAAjdlGNxncX3uWfzNqJIiN+UW3Glxfe5Z/M2oCjkeVr+Upe7IPEPK1/KUvdkAdKIAACrXFrjzxIWgxD1jbmiKmljWSSZduRqipJkHByFO3IeMM8dmMM8Y7Y1DrnmLztxk3ELQYxlBt2Lcb4U05AgI8ANoXzxIXVxGP5VMbpThpMFZMisi0g3YIt9AqnX/BjV4AAzO0t3a8shWbe4Ft5unLpy2RVblVUaJOCRTU6cmgoN9655i87cZNxC0EUQAShnmUjxYT+SvpLMaxlBmz9uqzXKnJGmeBVIZs/8I5hF4AAAAAAWy5IHqH1jwqNyRAVNC2fJBdQiruFinJG4Cd4hHlctzVIOGzLkT0TcEJMrjuaJFw0Z8iegKhBldpqMQuTdCkLfuZioxTqaeMZQo4TT0zokcOCJ6QxQbPwt7pi1HDSS8tIAtWQyYWEoiCZHFIzZZUpcxlIzlxCMY/uMP3rYeETtNm/Hbn7wlcACnCtcfeJS09Yz21lE1TK2sgo2ZuqelaSkkbKnKyZmMgjH+BSw/dAfEVynOLlaGj58pMWHsSRoNIX+6vFyOFs55WoMCAXZYD7xV/fKyKtc3Imib6bxnbpoU5GhG5CJJlIJGCH2Sy3MBuEr8TBHVTp52AABrAAAAAAABpnFlh+c4k7WFtwzqYkiP5poTHmxRpzR+LIcbmAYK2W+R1nTkmn6PzDN7FOHj/8A2R5dZvnsC5i3+Yd7Z/KRZdL/AMWf3Q9sc9u3qrF1m+fb/wAw72z+UhrNs8/aAZd7Z/KRZ0AkViQyOVRRz6d+pfHP/wCnzeOH91m2eftAMu9s/lIs6ABonB/hvd4W7Yv7dvKrJUKj6drzfmsrbUPxiCKehGGeO1qGfP7I3sAAAAAAAAACtqrckVPKnqqdVIW+jJrCbP3D7UoSAxoEiqbPGH44WSgArH1m+d/tAMu9s/lImrhVsM6w32fa2ud1GnOzNXjl1zam31DSgqbPsl7MMw3GAAK58sdE0Katfo/26a+DbixgV25Yv0o2y7pzHwSICrsbEw9XZTsVeSmrrqyGM4hIVlleYYO+Z4raoiolsH0DDXYALOdeQkW8E+74yeThryEi3gn3fGTycVjAAsgNkc50qYqx7+sdKHYpw+blI/Os3zv9oBl3tn8pFmbX8mS97L9A8oCsQuRwqCG3fyX97ynlA/es3zv9oBl3tn8pFnAAKwdZwqTVc/o8SzQ7HnfPn8MPNrN87/aAZd7Z/KRZwACsI+RxqPRzEvxLf30+bxw8us3zv9oBl3tn8pFnAAKsqqyRU9pynJrP0b4s3ikrYrvCIeYRyRWiknGOzHmn2BXsOjW4nU/qbuM98Acc5QAJ/wBjcqRLLQWlpe2LqyzyaK05L02EHhKhIWDiMM+zCHM/siAAALOdeQkW8E+74yeTj58yt4tlVlU7ryebehqSjoed87Jyj5pmc5zavqmkWKOaHRQhAVrC17I/dRqt+ExeSpANf6zfO/2gGXe2fykeNTI31CYuYt+2H76fN44WeAArH1m+d/tAMu9s/lI/LfJoTjD8ulfhe7bWdJ22N57jy1OTahF8WX6TqCEcxuvEsYQ9uAs6GucSO52ulwLnfIVgEKNeQkW8E+74yeThryEi3gn3fGTycVjAA6Mbc1gS4FvKWr0rKLKFSSZlN4N4ngeKEHCBFdCJuvm0s2f2Bko1zhu3O1reBck5CiNjAIYYusn3NsT100rjNbnNpARKUIysrZSWQcR6BQ54xjGJobcTDSms2zz9oBl3tn8pFnQAKS8W+BmbYUqWkdVO7hIVKlOZiZgYsJbBvFHPDPCOxGPZEXRa9lgeo1RHCY3JVRVCA3PgxMcuKq18E0tKMajaaUexDNsi+8UKYKt1Za/hAj9AvrABXlPsrzJ5DOphI1LDu1Vpc6M1PGFRkhniXr/k+wLDRzlXF9P9Td2XvhjgLGNeQkW8E+74yeTj868hKP2fnnfOn5MKyAAWca8lIt4F93yE8nH815CUfs/PO+dPyYVkAAs415KRbwL7vkJ5OPXmGM5jj5bKYSpZb91RbqvOhSnikyTmBWZmcebc8UIETjGOZr2RWeJJZOrdl2799mf8rdgJGazfO/2gGXe2fykfouRznSRjLRv6x0uDh/KRZsPE6/JlfezfQArn15CRbwT7vjJ5OGvISLeCfd8ZPJxWMADY+Ii7SN9ry1LdhvIlZOnPlkVSMVV4OFEtTbJpZ9jYGuAABIfCVg1qjFa4nqrGqW1PyiQQKk4fHQ5oPzSeGcqRUo7G1CMRJfWb53+0Ay72z+UjJsjp6Ubm905d4JYWJAKw1MjfUJi5i37Yfvp83jh+tZtnn7QDLvbP5SLOgAVjazfPYFzFv8w72z+Uj+azfPt/5h3tn8pFnQAKxdZtnn7QDLvbP5SIHXWoBe1lyqotw5mRH6tMzVzLDOSJ6BVoJG0dMdFYoMxh7qW6PCd74UBpwS5wb48WOFWhZzRTy2Tio4zebKTQjlObEawLCJE04wjDUTdiAiMACznXkJFvBPu+Mnk40ZjAx+yrFHa9jb1lbF7TyjOdt5vzSrOEnOaCaDgn6JYeqiIcgADZ2FzdL2n4ayTlpBrEbPwt7pi1HDSS8tIA6BwAAFcVf5Jqf1xXlSVp6NbNrCoJu8mnM/mNpQRiusZTNDov70Bj7jI6zpEul6PzDN7NOH8pFno9R/0pPbFU7TZozCdh+c4bbWHtu8qkk9P5przHmwjTmf8AGEINzAA6EAAA0AAAAAAAGH3Ru3b2y1MFq+5c/wDMaUc1Fa808yKuPwynSE0ESGGYCH2VN3MBeEzAZZTYDPKJYN0k4lUvQnGOfryKZ+TD2dcWwaZs/ozo5u4cz8nFHIDlWvG1xbBpvzpcRzPycNcWwab86XEcz8nFHIALxtcWwab86XEcz8nDXFsGm/OlxHM/JxRyAC8bXFsGm/OlxHM/Jw1xbBpvzpcRzPycUcgAvG1xbBpvzpcRzPycNcWwab86XEcz8nFHIALxtcWwab86XEcz8nDXFsGm/OlxHM/JxRyAC8bXFsGm/OlxHM/Jw1xbBpvzpcRzPycUcgAvG1xbBpvzpcRzPycbjtjdagLyUqlW1tqgLOZKsso3I6g3WQ0lCdMXRVKU2xn7A51hc/kudyXKe68w8JABLcVz5Y1YpKatcj11X01hD9ybcWMCu3LF+lG2XdOY+CRAVdgAAAAAC8NHKK4M4JEgS86WbNmh/wBBTPyYfvXFsGm/OlxHM/JxRyADoxtzcajbr0bL6/oCcQmkgmmqcxvNQVR1XU1TJH6BUpTwzHIaGzCGfMMlEb8nTuNLde9zP+ZuhJAAAAAYpcy6NCWdpJxXVx56WTyNqomks7i3VWgQxzaJYaKRTGjnjHrQGmtcWwab86XEcz8nHwcp5uRKi7pS3lJRSuAu1qPHvhKqmnZnTMju6k4mU4aLy9mjGSTIsVF1UzFIXZb9eMYCtvW58ZW8ytx7K/KRo+3Xp/pnuyy8MQdGoCjrW58ZW8ytx7K/KRoSq6Un9DVLNKNqqXmZTaTuVWT5udQh4IqkPonLplHSAKFMau6suhwgW+gBpQWtZH1eB7SVyh+kjURIR/egX7BVKLXsj91Gq34TF5KkAnwMJuxeO3VkabSq65tRwkkoVdkZQdGaLuIascpokLookMbZ0Y9brDNhC3KzbmCX8LWPJ3QDYWuLYNN+dLiOZ+TjGbl40MMt2rcVbam3lz0ZpVFYyR9T0mYRlL9Hmt+8bKIt0oHUQKXZNGHXFL42Phr3RVruGsj5cQBsrW58ZW8ytx7K/KQ1ufGVvMrceyvykXigAwiyEhmtKWYoOlZ82g1mklpmVy583geB9ScItEyKEzw2I5jFjsjNwAAAAARByktjLp33ttSsgtRShp7MJdPIu3KRXjdvqaOomhnzrHLCOeObaFfGtz4yt5lbj2V+Ui8UAFROGDA7ilt1iDoWtawtYeWyWTTdJ4/cwm7FWOaENmOikrGMf4C3YAABzjV45Rd1zULxufoF5u6UJ7gyxx0cjnKuL6f6m7svfDHAY8Nq2mwuX5vlLHU5tZb5edMWShElVjPWzbPHsfhzlGqhdRkw9yJTvdKZcpMAro1ufGVvMrceyvykNbpxlbzS3Hsu8pF4oAKOtbnxlbzK3Hsr8pG68F+DHEzaXExRdfV/bGMrkUqi9g5dRmjJaJdUZLJE6BFWMduMOt1xa0AAPE5/J1PcGHlABR1rc+MreZW49lflIa3PjK3mVuPZX5SLxQAc49dUJVNtKsmVC1tK4S6eyZTUXbSChFtRNoaXTpnMQfBEh8oNuxbjfCmnIEBHgBZ9kclUj01dDQ6z6VZ/k3AsYFduR09KNze6cu8EsLEgGI3NurQNm6UVrm5E/hJ5Ggqm3O6i2VXhA545iQ0ESGPs+1mGndcWwab86XEcz8nGMZUbclzbuvL/AAkRTAAvPluUEwgziYNJVLbwJLu3ysEG6RZLMoROePW2W+YSHHOpajqo0dwgl3KCDorABQRi+OU+KS6USbZaqmEI/Ki/cUGYw91LdHhO98KA04NiWjw+Xhvy4fNLU0Q5nh5anA7k8XDduTP7tY5RrsWz5ILqEVdwsU5I3AQp1ufGVvMrceyvykNbpxlbzS3Hsu8pF4oAKOtbnxlbzK3Hsr8pGd2GwIYr6Jvhb6samtOZpKZLVEtmT5eE2l6kUm6LkhzmhAjiMYxzQjsQhGPsC4oAAAAAHqP+lJ7Y9sepMPxZfbFU+UJs9IAAdKAAAAAAAAAAAQ+ypu5gLwmYCYIh9lTdzAXhMwE26UqCABntgerxbfhbJuVpjmWwfmZz6wcOZnPrBx0ogA5ruZnPrBw5mc+sHHSiADmu5mc+sHDmZz6wcdKIAOa7mZz6wcOZnPrBx0ogA5ruZnPrBw5mc+sHHSiADmu5mc+sHHiHSsOdS6/VRrHhBMeUHAYoLn8lzuS5T3XmHhICmAXP5LnclynuvMPCQAS3FduWKIY9I2yhD9ZzHwSIsSABzXczOfWDgdssn+MQOOlER1yhRIKYObjkjtRbMeXtgFGYAADykbOVCfiFA5mc+sHHR1SVNyGj6altMUxK0ZbK5c3Ki0aIwzERJCGwWH8R9cBG7J2qJkwbW70lCQ6CZ9fN/wD5N0JGc1Nv7Ql8eApAyiu7LuJ77LP5W0EbQHSfza00tDmpLP7uA/XNTb+0JfHgOa4AF1OU3iVXCNUZUzkjGMwl2bZ/+oKKW+ZnPrBxKnJh7rynu5k05ILqAHOdb1s5Tr+mlFED/nll4Yg6LOam39oS+PAfDuJ1P6m7jPfAHHOUA6Ueam39oS+PAUM41DENitufDsT9caUAAFruR+6jtbcJC8nIKoha1kfUUiWlrpcnTK1ESJv3IFAT8ELcrNuYJfwtY8ndCaQhXlaSQPhhlpY9t7Dk7oBT6Ni4bzkTxD2t4aSPlxBroAHSjzU1/tKXx4BzU2/tCXx4DmuAB0rANc4btzta3gXJOQojYwAAAAAAAPwc5E4aZzZoD881Nv7Ql8eA01jT3Kd0ODzj+goTAdKPNTb+0JfHgOc+4Xp+qXuy98KoMeAAF02TFWQhhGp4sF045plMYbEc3/eDClkAHSjzU2/tCXx4D9EVSU6Q5Te1Ec1gseyN/wCe7q/BZP8AXdgLOB+DnInDTObNAfsRvyi240uL73LP5m1ASL5qbf2hL48A5qa/2lL48BzXAA6UCvGh+ldJR/34D+81Nv7Ql8eA5rgASGygpiGxh3HhHbg6aQ/4FAR5AAFomR09KNze6cu8EsLEhXPkcSl87Nz1C/pvpXH/ACORYwAiVlQ9ydNO7Ev+vEUx8zOfWDjpRABzsWobOfRRo78Af8/S3lBB0TgAAKDMYe6lujwne+FF+YoIxgplJikulAu2aqJhGPyoDUAtlyQayELF1gSC5DRLVqmfZ/8ApG4qaAB0o81Nv7Ql8eA/kXbWG25S+PAc14AOlHmpt/aEvjwH8M7akhpHcpQh7uA5rwAdKPNTX+0pfHgHNTb+0JfHgOa4AHSeR8yP0jtGP+/Aeu/ctdAuk5Sh7cc45uAFV7HR6Q5D/i1CHH9EPslluYDcJn4mCOiqAAAakAAAAAAAQ+ypu5gLwmYCYIh9lTdzAXhMwE26UqCGe2B6vFt+Fsm5WmMCGe2B6vFt+Fsm5WmOZboZAAAAFNmIDG/inpC+dwaUp27DxjKJLVE0l7BsSXtDam3RcnIQueMM8diEIZ47IwPXBsYu/S94uYeJAXngKMNcGxi79L3i5h4kNcGxi79L3i5h4kBeeAow1wbGLv0veLmHiQ1wbGLv0veLmHiQF54CnrDTjZxRV3f6gKPqq6rt/KZxPWrN625iaJ6sic2zDPDZhn9gXCgA51Lr9VGseEEx5QcdFY51Lr9VGseEEx5QcBigufyXO5LlPdeYeEgKYBc/kudyXKe68w8JABLcAEKMppfa69jqaoV9aurlZCvNn71J4cqSakFE000zQ2DdjSj/ABATXEdsoRuO7jfBmPL24q51wbGLv0veLmHiRsjDriKvXicvXTFjr410rVVE1SdVOaylRBFuRwRJE65YaaBSHzZylzwzw2oAIYALztb4webyzPjV/wCPDW+MHm8sz41f+PASDa/kyXvZfoHlFGauUCxgpHMQt630fbl7HxI/muC4xN+l5xaw8SA9nKK7su4nvss/lbQRtGQ19X1X3PqyYV3Xc4PNp7NdCDx2dMhDn1MhEydKQpOkIMeAAAAErsmFHNi7p0vZlk05ILqBSnkyIGji/pg0eswmfIji6wBj1xOp/U3cZ74A45yh0YXMSMtbiq001NSUPI3xCqepjFA+aP7hzngAALacIWBTDZVmHyk6zruhoVJNqjaFmijl27XSOjE2fMmXUVC7EMwCpYWvZH7qNVvwmLyVIbw1vjB5vLM+NX/jxs21NkrXWPlL2S2spNGQsZivB05RSXWVgdWBdHSjFU5o580AGdiFuVm3MEv4WseTuhNIYbdG0Vur0U6lSFzaaTnkoSdEeFaKLqpFgsQpoEPnSMWOxAxs2zm2QHO2AvO1vjB5vLM+NX/jxhN8MDGFSk7JXAqWnbRM2czlFLzaYMnJJi9idFwkzVMQ8M60dqMIAKZwAAHQhhu3O1reBck5CiNjCh6mscWKmkJBL6ap270way2VNkmTNvFkzPFFukTQIXokfYh/AfS1wbGLv0veLmHiQF54CLWTnuvcC8thHlX3KqKM7nBKidMuaopFJnSI3bxhDNDY2zGj+8SlAAAAGlcae5Tuhwecf0FCYvnxtJmVwn3PTIpEkYyBbZh7ZRQwAAAuktTk9MK6Fuad88FuiVA/WYJOV5i8fuCKrHVLA8YxgioUnX60AFLYC87W+MHm8sz41f8AjxVrjwtjRVocSk8oq3smTlEkRZy9RBmkc5kyKKNk8+wAj2LHsjf+e7q/BZP9d2K4RntqL8XZsY4mDu1dYuJCtNSpEeGSSRPqxU/fCGAdDIjflFtxpcX3uWfzNqKwNcGxi79L3i5h4kbNwz4hbzYo73U3Yi/Fbq1VQtT81JzaUroItyOSoNjuUc50CkPGGqIQ68NoBCsBedrfGDzeWZ8av/HhHJ74OowzRsox4zf+PAUYgLzCZPXB0lDMSyzSEO60w8eP1rfGDzeWZ8av/HgKMQG5sYtB0xa/ErW1DUXKk5ZI5W6bFatkznMRApmyao0yAtEyOnpRub3Tl3glhYkOfC0uIi89jUX7a1ldryFOanKq7Ik2RUIson76Q3ZGwNcGxi79L3i5h4kBeeAowPlA8YMNq9kw4uYeJDXBsYu/S94uYeJAXngKMDZQPGCYueF7JhD2pcw8SBcoHjBKXPG9kwj7cuYeJAXnigzGHupbo8J3vhRkmuDYxd+l7xcw8SNHVZVlQV1U0yq6qpgd7Npy5M6fODpkIZZU/Tm6EB8kAFgeTXwoWYvfRVTV7dKnIz9RnMzSluzWWMmgnCBE1NVLqJi7MYxh1wFfgC87W+MHm8sz41f+PEVso9hasHZOxUoq219vGUgm7iqWjFRym6XUMdAzV3E5I6qpGHWAVtAAzGz1GS+4t2aMt/NHK7VjU0/l0ocqoRzLEIu4ImcxQGHALy22T2wfoN0klbNMlzpkgSKikxexibN/+8P1re2DveWZ8av/AB4CjIBlt2pCwpW69Z0vJ0NTZSmoJkxbE9Qik4OUgxIBb7kstzAbhK/EwRDrJX7mNfhM/wDBICYo6adQ87AAApgAAAAAAAh9lTdzAXhMwEwRD7Km7mAvCZgJt0pUEM9sD1eLb8LZNytMYEM9sD1eLb8LZNytMcy3QyAAA5+MUm6Yuvw0nXLTjWA2fik3TF1+Gk65acawAAAAAAABuPB5upbXcJ2XhRfmKDMHm6ltdwnZeFF+YAOdS6/VRrHhBMeUHHRWOdS6/VRrHhBMeUHAYoLn8lzuS5T3XmHhICmAXP5LnclynuvMPCQAS3FduWL9KNsu6cx8EiLEhH7FthIlmK+W03KprWrunkaecuHJYt2Sa8VTKkKX9KMM2bRAUVCQ+T53YtufhTvkC4l7rOlIb+U54nT8cM7sTky6bsddmn7rMbsTWbOJCqc5Ga0tSSTUgZEycdmBoxhsGATXAAAc1zr8pV92ceIWimyO1ImjnjfKc8TJ+OH81nSkN/Kc8Tp+OAVdgLQdZzpbf2mnEKXjh+tZzpDfznPEyfjgFXgCS+NjCLLMJ8ypRlKq0eVESo0XRjmctE0NA6UIR60Yw64jQAldkw915T3cyackF1ApTyZGlz39MZ9rmCZ8iOLrAGPXE6n9TdxnvgDjnKHSLUUpjPpBM5HBeKHmizWa6rCGfQ1QkS6Wbr5s4r+1nSkN/Kc8Tp+OAVdi+zBZuU7X8Hm/9RFfWdKQ38pzxOn44Tfs3bhG0VsKbto3mqkySpxgmwTdKJwIZQpevGENgBmYAIg40Mc89wqVtIaVldvmVQpzqVmmETrPYoGTNBUxM21mjDoYRAS+AVda8ZWO8fKOODfdH8Plia1/QspJY+3Nj/YAtGGucSO52ulwLnfIVhALXiqx3j5Txwb7o/bTKXVHiDdJWHf2ql0la3JULSCsxTmZlTMyTDSamXzQhtQ0o5v3AK6QFoms6Uhv5TnidPxwazpSG/lOeJ0/HAKuwGS3LpIlAXIqqg03R3ZKanj+TEcqJ6B1uZnB09MY0AuEyTO5gmHC19ydqJpClnC3lAKkww26Xt3Lrcy6ftVZk4mvNKrwzcxTKlThmjnh7EBuHXjKx3j5Rxwb7oC0UBEHBfjnnuKutp9Ss0t8xp1OSysswgdF9FwZQ0VSk0drNCHRREvgGlcae5Tuhwecf0FCY6I7x23Qu7a+pLZuJqpLUqiYHYndJpwOZKBs2zCEdvaEINZ0pDfynPE6fjgFXY6Nbd9T+me4zLwBBA7WdKQ38pzxOn44WA07KfMCn5ZI9Xit5nM0Wmqxhm09TJAulm62fMA+iKV8p5uvKh7mSvkguoEOMSGTnp7ETdeZ3Sm90prJ1Jgg2bwYt5akuQhUkip585owjHPmz/vAU4ALRNZ0pDfynPE6fjhGTGvgxlOE9nSLyTV09qEtSKPklIOWKSGo6hBvHPDRjHY2QEVhJLJ1bsu3fvsz/lbsRtGf2Hu7NLC3Xkd2JTJ202eSCLgxWbpQ5Cngs2UQAdC4CrrXjKx3j5Rxwb7o/WvFVhvISjjqP2ALQwFW6OWKrfQhzRZOR6cesWbn+wfvXjKx3j5Rxwb7oCOuUG3YtxvhTTkCAjwLNpVgpkuORgjipnlwJhSb6vyxdHkzaXpOkW2oRM1hDOY0M8cxI5/b9se9rOlIb+U54nT8cAq7ASRxq4S5dhPqGmZVKaxeVEhP2jhzEzhqmgch0jQj1oxh1xG4AAAAAHv09JHNRz6WU3Lzppups9SYonP0mmqfRJpCyiUZHaSHlbY87vVMUZjFFM7gjWVIxRg4htxhnNDPABWQAtD1nOkN/Oc8TJ+OHjLkcqZh019plH/4EnlACsAWz5ILqEVdwsU5I3GN6znSG/nOeJk/HD4NQXQeZK90nZelZUS4DaqU/PQo9mKvMJ0TxhzNqRSE0oR2G0I/vAWYiEmVx3NEi4aM+RPRpfXiqx3j5Txwb7o+hIb1PsqG8Ph7qeQpUG2kqcavLNJcrzec5kP9GihoG0Yf99zx9oBW4NoYW90tajhrJeWkE9NZ0pDfynPE6fjhkltclTSltriUvcBreCbzBWmZuzm5GqsqRTTWUbqlUhCMYGjmz5tsBO4AABzzX+6vFyOFs55WoMCGc341b0b7ic0dP565vp/OzjBgFvuSy3MBuEr8TBEOslfq3Oxr8Jn/AIJATFHTTqHnYAAFMAAAAAAAEPsqbuYC8JmAmCIfZU3cwF4TMBNulKghntgerxbfhbJuVpjAhntgerxbfhbJuVpjmW6GQAAHPxik3TF1+Gk65acawGz8Um6Yuvw0nXLTjWAAAAAAAANx4PN1La7hOy8KL8xQZg83UtruE7LwovzABzqXX6qNY8IJjyg46KxzqXX6qNY8IJjyg4DFBc/kudyXKe68w8JAUwC5/Jc7kuU915h4SACW4AAAAAAAAAAAAAAjldHHxh3s3Xc0ttXM7m6U7k8UoOiNpWoqSGqJFULGEYewYYtro2Ertin/ABMqAj7lkPz3ar4LOPrtBXCLI8Tcvc5SN7TsywvanMUaCScN5tGbmiw0DPIQMlCGfZjstf8AEaU1rjFl2v05x0kA9XJh7rynu5k05ILqBWrgnwOX/sRiDk9xbgyaUIyVoxfIKHbTRNwpBRZDNCObbzZ4CyoAAejOpq3kknfzt0U5kJe2VdKwJDOYxCEiaOb90IiK+ujYSu2Kf8TKgJbAIk66NhK7Yp/xMqJJW6r+n7oURKLg0sdc0onbaDtoddPUzmTjtRiXrbQDJBVDlgurHRHBg3LFBa8KncsB1aqL4Kx5WsAgWAAADY+GvdFWu4ayPlxBrgbFw37oe1vDSR8uIA6EQAAHPhiU3RV0eGs85cca4E57y5OLFBW13q5rKRSGQqS6f1JMZozMpOUyKQbrrnOSEYZs8I5ow2IjENa4xZdr9OcdJAIjgM/vXZKvrAVgSg7jtGbeaqM03ui2cEcp6keOaP8AiMAAT4yPvVjrfgwXliYteFTuR/6tVacFYcrRFsQAAAAAAijMcpthWlMwdSp/PKhTdMlTILEjJVM5Tl2wErgESddFwl9sU/4lVHiJlS8J51IpFm9S54f7FP8AeAS7FcWWQ/MVq/hc4+o1G59dGwldsU/4mVEOconiqtBiQlVCs7Xv5m7PIHMxUewcsToZoKpoQht+0AhKAAAAAAAAAC83J77ju3PwZ9y9wJEiunCPlAMO1pMPlI22rSaT9vN5E3XRcwJKVFC5zOFVM+eHuhuDXRsJXbFP+JlQEccsZ6b7Z9zZj4RIV2iX+USxLWuxIVFRcxtc+mDlGRsniLs7podvCBlTQhCGz7QiAAAAAMrtR1UaO4QS7lBB0VjnGoacM6cranqgmGnzLLZo1dLan0+gmqQxxcCTKkYSzl0iz6os3cVT7QEuAESddGwldsU/4mVElqAriQ3KoyTV5TKip5XPWhHrQypNA8UzbUYw6wDIBUxlfertR/BEnLHItnFSuV86vlJcEEeXOgEExNrJIbpeecDHvLWghKJJ4BL92+w53nmNb3HUfpyx7Ty8qTOzbxcGIsdy0Ps5gF4YCJOujYSu2Kf8TKj61G5RrDDXVWyaiqcnk6Umk/mLeVsiKSlRMh11jwISETR2oZ4w2QEoAAAHPNf7q8XI4WznlagwITfurk3MUdYXRrCrJLIZDGXzufzCYtjKTlMikEl1znhCMM2xsRgMUVyXuLNGGl53qdND2J0kAmTkstzAbhK/EwRHXArZmvLE2UVoK4jFq0mnm26dkIguVwQ6KhCCRQ6q9IAABqQAAAAAABD7Km7mAvCZgJgiH2VN3MBeEzATbpSoIZ7YHq8W34WyblaYwIZ7YHq8W34WyblaY5luhkAABz8YpN0xdfhpOuWnGsBvPEtba400xFXPmctoGo3rNzWM3UQXRlThRNQhnp9qMNiMBrf0KLo721V8SuAGKAMr9Ci6O9tVfErgPQoujvbVXxK4AYoAyv0KLo721V8SuA9Ci6O9tVfErgBnGDzdS2u4TsvCi/MUXYS7cXAlOJe2Uym9C1AzZt6lZKKLuJaummnDS7MdiH7xeiADnUuv1Uax4QTHlBx0VjnUuv1Uax4QTHlBwGKC5/Jc7kuU915h4SApgFz+S53Jcp7rzDwkAEtwAAAAHpTSbSuRMVJlOZi1YM0c0VXDpYqSRc8c3RHNHNDrbYD3QGK+iva3fKpXjlv98PRXtbvlUrxy3++AyoAABR3lFd2XcT32WfytoI2iV+UBoCvJ5i9uDM5HQ1QTFkqeW6LhnLVViGiWXNc8M8NgR79Ci6O9tVfErgBYdkb/AMxXU+Fyf6joWOiuDJULI2xlFykLkqQpNV86lJ2pZ9/oB1yQI62SwWjDOJ6+iva3fKpXjlv98BlQDH5XcGgp4+JLJJW0gmLxSEYkbNJkiqqbNDPHMUpoxjsbIyABj1xOp/U3cZ74A45yh0Z3IVTQt3VK6qmgROSvjmN6mEEDxjEc5gAL7MFm5Ttfweb/ANRQmL6cE5oGwoWvNDajT6P0mAbtFUOWC6sdEcGDcsUFrwq5ys9IVbU93qMNTdLTabFRpuMFDMWBnGjHms+xHN//ANsgK7wGV+hRdHe2qviVwPnzuhqzpxsWYVBSM7lLVQ2gRZ8wVbk0/UaZiAPiDY+GvdFWu4ayPlxBrgbFw37oe1vDSR8uIA6EQAAAAABT5laN07LeCLDlLsQsE7MqZQ9Z1JiTYvqfpCdTRqnSzIh1GjBRwT8e47GwIfehRdHe2qviVwAmbkferHW/BgvLExa8KqMlq1e2zurWD+5DVSlWzynYJtlp2lzARUxXZOhKZaMM/tCy30V7W75VK8ct/vgMqAYg4vBaRqnqrq6VIok9UpO2xYfxiceX0V7W75VK8ct/vgMqHOVcX0/1N3Ze+GOOgv0V7W75VK8ct/vjnwrxZF1XNRuG65FEVJu8UIdPoyHIZU4D4QAPrySj6tqYiqlN0xN5sRD8cdi0WcaHxQHyAGV+hRdHe2qviVwPCe2NyE1km6lvalTXX0tRIpKXGmfRAY0Ayv0KLo721V8SuB4XNsbkNETOHlvalQQT6c6kocEIAxoBlfoUXR3tqr4lcD8+hRdHe1qjiVwAxYAAAAfZklGVhUzYzym6Rm82QTNoHWYsFnBCH/3R9L0KLo721V8SuAGKAPpzumKkplZJvUkgmkpOuTVCEfNDtzn+MPmAADzs2byZOUJfL2i7h0uciaKKCemc5zdIQpBknoUXR3tqr4lcAMUAZO5tjcto2VePLeVKgggUyiyx5S4IQhCjGAAX54Odyza7g0z+oKDBebhCufbRlhmtzLnVw6YRcsqfaIuEjzhvAyZ4FzZo9FD6AEiRUxlfertR/BEnLHIs99Fe1u+VSvHLf74qwysdR0/Ut8KSc05UEtmiSdJlIY7N0muUhua3W3oxjABCIAAAGz8Le6YtRw0kvLSDWA2RhpmMvlGIe2M3mr1sxaNawk67hw6UIRJFIrohjGMcwDoOAYpC7NqzF0y3MpSJezCcts31x/fRXtbvlUrxy3++Ayoeo/6Untj+snrOaNEH7F0k4auEyrJKpG0iKEjslMU3XgP5MPxZfbFU+UJs9IAAdKAAAAAAAAAAAQ+ypu5gLwmYCYIh9lTdzAXhMwE26UqCGe2B6vFt+Fsm5WmMCGe2B6vFt+Fsm5WmOZboZAAAAAAAAAAAAAAAAAc6l1+qjWPCCY8oOOisc6l1+qjWPCCY8oOAxQXP5LnclynuvMPCQFMAufyXO5LlPdeYeEgAluAAACO2UI3HdxvgzHl7cSJEdsoRuO7jfBmPL24CjIAAB0otfyZL3sv0DyjxNfyZL3sv0DygAAACsfLIfnu1XwWcfXaCuEWPZZD892q+Czj67QVwgJXZMPdeU93MmnJBdQKV8mHuvKe7mTTkguoAY5chMi1u6pRULAxTyV8UxY7UYRQPsDnMHRrcTqf1N3Ge+AOOcoAF9OCcsC4ULXlhtQp9H6TChYX2YLNyna/g83/qA3UAAACFmVo3MUs4XsOTuhNMQtys25gl/C1jyd0Ap7GxcN+6Htbw0kfLiDXQ2Phr3RVruGsj5cQB0HgAAAAAAAAAgPlgeo1RHCY3JVRVCLXssD1GqI4TG5KqKoQAAAAAAABc5ku5RKGuFSTzhpK2qD1/MH8XblNIpDuYlXNCBjRgKYxdRkw9yJTvdKZcpMAlcAAAAAAA8Tr8lW97N9A8o8Tr8mV97N9ADmuAAAXiZO6VSuX4RaEdsZY3arv0nizs6aRSGXVg9XLpmzbcc0BJIR2ye+47tz8GfcvcCRICrrLFlLGs7axj+rJh4VMV3CxLLGem+2fc2Y+ESFdoCVeTKlErnGLGSJTeWoPCNZc/cowcEKYybhMmci0PZ2dgXVimHJcbrKU9xZj4IXPAMSu6mmtaitEVYQiQ9PTEpoR68ItlM451h0WXX6ltY9wJhyc450wAAAAAAAAAAAAAAAAAdDNgeoTbjglJ+RpDMn/Sk9sYbYHqE244JSfkaQzJ/slJD2RVPlCbPSAAHSgAAAAAAAAAAEPsqbuYC8JmAmCIfZU3cwF4SsBNulKgh7cqmsykc1ZzyTuztHstXSdNnKfTorJn0iHKPUAcy24+fExTb/dacaGDnxMU2/3WnGhhpwAG4+fExTb/AHWnGhg58TFNv91pxoYacABuPnxMU2/3WnGhg58TFNv91pxoYacABuPnxMU2/wB1pxoYOfExTb/dacaGGnAAbj58TFNv91pxoYOfExTb/dacaGGnAAbj58TFNv8AdacaGGpZk/eTV+6mkwXOu6dqnXWWP+mdQ+kc49YAAXP5LnclynuvMPCQFMAubyX7pFPCdKoGNm/6ZmBf80IgJdiDGVMuvcu1VNW/eW2rib024fvX6To8udxQMsmUiMYQNGG3mjGOb24ib3N6H97+ArxyxK6C1IWyLA2eBplMfBIh6sIR8+Jim3+6040MPkVXiZxA1xIHlLVjeGqJxKX5CpuWLmYmMkvon0v6QGswAAAAG4EcX+KFBMqPo91qaPZjOFYj9c+Lin3+q140MNOgA3CXF/ikKYx437rWMIdbzYVH958XFPv9VrxoYadABZpk82TfFhLK4mGJUsLkuaccS5KVHqGBXXMZVU3EVYJ59iGeMNsS/wCc6ws7wtGcWJ/YIg5HVdJCR3UgeOaBXUn+o6FjHN6PYN/AbjI19R+HKxNu58jVNDWppuRTVuQ6abxiyIkoQpi6JoZ4dmGwNkZojwc3of3v4Bzeh/e/gGMs9vg3NbwXtvViOnEkVJG/Jpl2DFzoH2YeyOdAdFtw37fzgVLGOnsyd7tF/wDIPEc6QxoNnUvicxCUdI21M0teSrJXKWBNTbNEZqqVJAnqCjWIANx8+Jim3+6040MLIsl5dC411LX1fN7kVjNKieM5/BqgvMHEVVCJwRLHNnjtbMRT0LW8kI4QTs5XEImzQLUpeTpgJ9iFeVp3MUr4YMOTuhMvm9HsG/gIY5WF2kphhl8EjwNnq5hDY+DuhuMioAe3KprMpHMmc4k75dhMWDgjts5QUORZFZM+kQ5Tl6Q5R6gDBuLnwsUm/wCVrxoqHPi4p9/qteNDDToANwwxfYpIdLfutY+3OFR/efFxT7/Va8aGGnQAXSZNG4VcXMw+P6kuDVMxqCaFqZ41g8frxVVikRu20S549aGeMc3sxEshCjJPOkEcMMwgc0IZqufw/wCHaiZ3N6PYN/AbjIgZlgiadpKGh/6iP4AwqlFrWV9XRUs5Q8IRzwNUxuSqfaKpRgAAAAAAALpMmAnqOEaQl/2pMuUGFLYujyZDlFLCLT8TGzQ80pjD/iI/aAljmiGaI8HN6H97+Ac3of3v4DcZZ7eyNDY6auqWhMKtc1ZR08dyecy8kvM0fNDaKqBjTBsSMSx9o0Ye1GI3hzej2DfwEccom7RPg2uKUueP4OWw2If7TahjLVUXPi4p9/qteNDD+mxi4pzEzwv1WcP/AJUw04AwAAAF5eTzLo4ObcF7DZ//ADByJFiOOT8eIJ4PbcEhA0IFaPIZow/+uXEheb0ewb+A3GRWBlii564tub/ZT+H+corxFiGWIVSXqy2mpmzxjLZjGEf/ANxMV3jB9yjq3rG3k9TqahalmcgmyJDpldy5c6CpSG6cmkUbH58TFNv91pxoYacABv6iMU+Iyqa0p6majvVV76UzeaNWL1ovMTGK4bqqkIcpv3Rj/EW6851hZ3haM4sT+wUaWo6qNHd3pdygg6Jeb0P738AGpOc6wt7wtGcWJ/YPwlg0wso59TsPR5c/+zyjb3N6H97+Ac3of3v4CvUsyal5zrCzvC0ZxYn9grRyn9rre2rvLTEot3ScspuXuaWK5Wby9KCJVVea3WzmhsC4jm9HsG/gKncryskvfWkIkjn/AOqJM0f/AOY5GYy1BQAAYAAAAAAA2rJsVuJKnpW1kslvbWTVgySIg3bkmiuiiiXoSEKPdjjExRq9NfmtIQ9ibHgNOgAuayctd1lcbD4vU1eVNM57NVKgeN4uny51TxIUhBKQQ+yWW5gNwlfiYI6q9POwAANYAAAAAAANY4h7B01iPoItvasnE0lrIj5GY6tLtDVtNP3RDDZwDBBnWkrGb4defKNPJg1pKxm+HXnyjTyYTmATjVuSDOtJWM3w68+UaeTBrSVjN8OvPlGnkwnMAY1MkGdaSsZvh158o08mDWkrGb4defKNPJhOYAxqZIM60lYzfDrz5Rp5MGtJWM3w68+UaeTCcwBjUyQZ1pKxm+HXnyjTyYNaSsZvh158o08mE5gDGpkgzrSVjN8OvPlGnkwa0lYzfDrz5Rp5MJzAGNTJBnWkrGb4defKNPJg1pKxm+HXnyjTyYTmAMamSDWtI2N3wq8+UaeTCT1gbIU9h6t0hbel5rMZlLkHTh0RZ9oatpq+5IUbHAVjDQaVxL4VaLxQMZFLKzqCdSkkgWXcI+ZqiRDnOrDN/rCGG6gD0lBnWkrGb4defKNPJh/T5JGyUfxdx64J808SJygJxq3JBnWkrGb4defKNPJg1pKxm+HXnyjTyYTmAMamSDBMkjZP/WXGrg/zTxIa0jYzfCrz5Rp5OJzgGNTJBgmSRsnvjVr8o08SP7rSVjN8OvPlGnkwnMAY1MmkMNGE6icLreftKMn86mxJ+dqq481VEfwepQzf6sheyN3gApgAANHpTuVEnkkmEjUUOmR+1VaHOn+gRQmiIT60jY3fCrz5Rp5MJygMxUgzrSVjN8OvPlGnkw/pMkjZPfGrlT5p4kTlATjVmSDWtI2N3wq8+UaeTCQmGzDNSWGGm5rS9HzybzJrNn5HxzzLQOch9DR/RIUbhAMYaDVuIrD9TGJOhUKAqycTSWskJilMdWlyhCLaaZDl/SIYbSAUlBnWkrGb4defKNPJh/T5JGyG+NXPyjTxInKAnGrckGiZJGyG+NXPyjTxI/mtJWM3w68+UaeTCcwBjUyQYJkkbJ741cqfNPEj+60lYzfDrz5Rp5MJzAGNTJq3Drh+pjDZQq9AUnOJpMmS8xVmOrTFQh1tNQhC/okKNpAAqI9NagxJ4ZqSxPU3KqXrCeTeWNZS/M+IeW6BDnPoaP6RDCPOtI2N3wq8+UaeTCcoDMYEGj5JGyUfxdx64J808SP5rSVjN8OvPlGnkwnMAzGrMkGdaSsZvh158o08mH9JkkbJQ/GXHrg/zTxInKAY1MkGtaRsbvhV58o08mEobB2WkWH62zO2dMTSYTKXsV11yLPtDVfwp9L9EbEAVjDQAAakGD3utRJb52ynFrKjmT1hLpyVDV3LHQ1YmpOCLdBpEN6gZwAyfuIM60lYzfDrz5Rp5MP7rSNjd8auflGnkwnKAnGrckGiZJGyUPxlx64P808SP5rSVjN8OvPlGnkwnMAY1MmE2YtXJbJ20kdr5C+evpfIiKporOoliqfTVOp0WiM2ABTGgsS2Dmg8UM1kc0rSp59LTyFBdBsSVKI9HqvvhDDS+tI2N3wq8+UaeTCcoCcYUg0fJI2T3xq5T+aeJH81pKxm+HXnyjTyYTmAMasyQqkOStstTk+l9Qsq/rVR1LXiTtEh1GnTpH95E1QAVi0AAGpBHTElgkt1iZq2X1fWNVVDLHMtlxZcmSWqNykOQpzqfpEMJFgMEGdaSsZvh158o08mH9PkkbJ741cp/NPEicoCcatyQZ1pKxm+HXnyjTyYf0+SRshvjVz8o08SJygGNTJBomSRshvjVz8o08SP5rSVjN8OvPlGnkwnMAY1MkGEckjZP/WXKrVT5p4kf3WkrGb4defKNPJhOYAxqZNY4eLB01hwoI1vaTnE0mTI75aY6tMdDVtNT3JCjZwAKYAADQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABr29l9re2BpMtX1+9XIRdxzKxZtU9VdvXHrSRBpWV5QihWk7l7C51qLi26l02U1BnN6klPM7HP7Y8+NW31w3s/the+3dJHq5S2M3cPnlPp5tN2grAnRJezsD9U/i0wrYj2sbWXEaeZcxdqpkWpisGHM0eaCm9keeX3UlAQ5FyFUTUIdM5dMhyD9jROKG9rnDzQMjk9uqaazKq6pfoU5ScqzaDcq33CjWq1msf0rlXn3Z4oJTNqkIXmk9MHkLckuP/APTlWFZCYADUdyJliEPZ2XO6LQo6n65cEa+bC0ydnOxlJDflCqfq9ERgqKqsQtpqfmV1aQxoUfeJKmic1T6l+ZWJNUbfp6B0DmiNyE+wEX8WOICqqYwmSy+No5ypJXU58yXTNZRok4ORu76LRMRYhh6FU0FjVuFI17kyO+reiHx2vN0qoprJUXCKJM2kRBy7N06ozISvHz6jqCVUnIZlVE8dcySyVM1XrtbQMbQbpE0jn0CjUuEG901xA2Lk1wKgbIoTeKq7GZQQ6Q7lE49HGZTt057ZSolbaV81ptFhJpo7nyK7AjjzSYlaKabchzENoBI21Q1dUtcqk5fXFGTSMykk2S1Zm55nOlqhNLR6RQhTj7whjk/qNxANbaURVs7u9LnVvVJa65mpZOUpEWR6NQpP9IHtPLl4g8UVzaso+wdbsre0HRD80pf1MdgR67mb4vTkQIYTl6ExAEM1Lk4iMKFwqVk19rgNLjW7rJ8SUEqPzOIxdyl8bPm0yE60dkTMFpAEOrx3xxDSrGE1sZaVwydNZ7SZFGzaYoFg2ljkyp9N+qcpNWOQpCD1LoyjGdhwp9e9De/TW6Mrkug7qGnpjIUZeQ7T9MyB0xmSk0AGn6ruDcK4lhJZcTDueRN5jUDZq7Rcz9TQRl7dX8cc395MRmqKocRVtaem1zqQxvUfdRzS7c8xndLcyMSEO2J0SxCagc0YDMxPkBE69eIeuaaoazmJGkpmo0t3OHbCFXSs7ZA8SM3sIbOfbhFPZGzMV95XNl7DzmtabX1SfPipS6ntTTIrpvnPQonKQbkNygMXtgyrOW2+p9ncSeea1UEYJebDzUEktN2YmkfoEyFINPvbpV9SGNeX2sqSf6tRVbUsd3IWajVIuozRtGOrFKcpNM/QEG+0pEAIc4jcTlx7dYj6akFLPUyUBTZ5T5/OgSPm80nB0ye0NkYp7nV3Sc3thbi1c98yalr2qkmB3GoJODpyxLonZykWIb2BmUqZWtdG4KeINtahO00wPSKkkNMT1Z0fM5HPrQyN/dmg5dcyW2eezzU6tmsuNNGcu5lV/CNi6ZTn1UpND9CP8BqV5davk8dTKziU/wD+pytDGnKkt5kS/LOaDl09VEZrh2+xPwx2UxIm19ZWnVb+m3ruUTvzEb6Etlmm6/0XUROTUycS1+I4d6EY1v51fPBzXOGsn5m5v5l/Hfp6egoNtCEWPdpWVLYQ6WTr6oyVJUMtqiWnfzFBoVuR4cur/wAB9+rbf46p9S7y6TO/TClp0RmaYtqIaSRE7NEhYaRGpnanTmDJiXwDUOFG8r+/Vi6cuTOGqLWaPCqtX5EOkg4SOdM5iDNbnObhNaDnLi07WUL1Wm3/AOjSTVQ5Gmn/AHhftrKQEEH8MTctRmU/pjHfRVV1hKW53rmj02rDmZTQhpHbkzRzwGy6vxK1HU2BV9iMoRwSRVApKyKEzJlXK1dFekbuCFIt+8RmxKQBEGm6dxf3+t9I7kSy+re2acylTd3K5O1kaLwzmJifj3biMdjVoZo5oD0rb3vxDXewr3BVlc2TlN3LdP3cuXctWjdYr1Rp0XSKEMTSNshmJlgNWWWvfI7k2Akd55s7bt0VJMZ9Nz/oNlUCaLv+oxTBtXN0bsW6mV1bizQ52VTzhy4pmWqNUkosJWU2gQsYlJs7XXFe2tg3uvDTNhLcTK59XMZo7lkqMgRZKXJlO4PqqpEyaJFDlGZSeZIzyVMZw0IdNB+gk7IQ/T6ChNIRvykG5CrH4RK/5ggN+UD6Qqc7ks/AkG+mMYPfGlCX2Lh78z5v54FJD5v806kTmLmfT0dHT09PSGv7y43LcWUuMa2E5oavJ7O02CUxPCQSxu7JqJ/dOCjDlv8AtOUP/bH/APtj8yr/ALTydf8AtoTlCAjIZba/HbZG5tZs7fnb1RSFQzP8GxZ1PLSNDuT+pIcpzDYt1r60raSo6FpioJbNnDu4M5LI5aZmmkYiTkxiF0l4mOXMTo4bOyI6ZTdamXVuaRlcvURPcVSpWXnYIh+Wj6uNjT9F3DBqm+Ch4ZqGQl6ACP2JJS/Csxl7Giru0dayilGp1JpU010DviOPWiEW0SC/YkCAhFS13Lu2RuXQksrC/wDT96be3Bm5JASatEG5HMsmJ/xX4k5hlGKO+V7LdYi7YUFaiCEyLVbB+Q0mXTSgk5dmKcrdVRbpyETzQ/gGQlqAh9cC3mOO29OPboSXEi0rKZypE8wf0svTaTdi6RL0R0kIwjnh7Y+ldnFHP5xgWe4kLUzLzDm6ibHN+DI45jceaBG7gmgt7cRGYleAiFStM4xr/UbK7lRvk2tWhM2KTuVSFlJknxzkMToF3ax9HolOxtDLcK18bi1TVFY2Hvm0ZJ3CoE6Sizxr0CM2Yn6RwKyEkAABSQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaRvZiclFiLkUVS9b06drSlWQXTPVKin+jS9yXpEjEGtcdNTYZ6qw/wBQPKlqCkZvOzsI+dtZo7buH3Nf6GoHTEnawoikq/kK9L1xTkvnsrd9OzfIEVINY0lgzwwUJPkqopuzsoTmCCurorLqLO9RP6spFjmIQedoUjXextXVHWkwuX5riXTB+pbZdmpVRM+m5Ii4K1znU+R/xEr5liasLKqHNcRxdamzyTUNWIcj8h1T/wB0qPTnMNjP2Evm7NaWTRkg7aO0jIrNliEOQ5DdOQxDDSzbBDhUaVD55E7JSHm71CmrHbfNzH1EBorGdcKnLlSuwTuYziYNLOV1PiL1C5PpstUR/BmblXHzMbdE4NaAsU+8w6No5CqnaJCU3GR6BHZz+umOj06RRNqsKCoyv6YXoutKYl86kq5C6bB0gQ6PQjW8hwcYa6Wk05kdO2qlbJtUDNVi/Pq7g7hRup0xCuDHMcgYiMuJb/swKA7kUv4IT6bfkiXvRBgdS2DtPWFrZdZupaW5so6UpNUGkt5ucE0CNuhR/ClOU42AQhCEKmNrURJyXe5bQ4Qvxv6/DZZ1Y24bNuQ6i7ilZumQnqzmaHHt2utLQFlqWLRds5B5iyhNczrmbmtVx0an99Y5jjLzkIcmpqChG7AZXVIPsMtvKeZ1RLDzZNkuidjzWTmjTI4U2BrjBvWtMWIrS5+HC6E5a09UPnvdT+VHmKhW5JmzckIUh0zGEhKMwu2Dt5XRrj0ZbKVyqoI6Wg8QOr+D0+hPqaXSEH17oWJtFehFBvdCgZXPYtegSWXTORwiX1JVU9E4gRjxzVxTN81KLwwWwnLSoKnntStXT/zOUI4JKWiPTqqnKJtDX9rrAWdssVeNsLfSyRHdk1NZwnpquDl9SZZQ5jjYAuEoMXSupTVpMpBK57WS8WspfUGlK3D48cyLDVXB9BRUbfxf35tpSVgKvZeemUzKaVXJnUmk7Fq7I4VdLOkTo9CQvtjBJ9JJPUmUfcyOfyprMpc/tUZByzdJkVRWIZ2Nx0bhEw2W+qctZ0naWUM5uQ2mi5PqzjUT+qSKocxCCPupEm91OT22+GDDfai47p7KaQfTxgzrmOqGLoInPq3M6gyrGHQGCyg8P80UkVF0YnULticlOeY8Cc3KOPXdNHozlKJp1bR9K1/Tzmk60kDKcyh8X8MzdJ6ZDjWNPYOMNlJS+cy6mbUytmSes3Eufqau4OsduuTRVIVUxzHRDH01jFoLdSu7eBalLbzuOZrUNFoNYn9QcxOgVEdsP82q/ETci11o69l65GuH5F0vU8FI9A6m7ZwdoxJ/CGcTbnD+hMOdnHbxu08zaXoiTGOk21Q5zERSJ0CRTqDU+BKgpjJ7VzG69TtUyVTdqbr1bM9naIuc5m5P8Q9dMSUEXMdTZSkpbbnEIz6e2VWsl3/ct2ciLgSjHw62ommLj0rMqIrSVkmUkmzfUHjY6hyaZPdl0Ti7CJFB20JiMsJfmvFECLurvzZ+pJPgkt/AyzwA+NhcrpXFBfukrhvIwOjay3TVo49mfvOhcmE0qLo+nLeUrLaLpCWEl0lkyBWrNsmc5tTIX++YfDttZi2tnzTs9vKXLJ/PI+NMZlEi6qvNDk3X/CHMIxEfpn/2nEs/9sT8oOPUuxOZTTGUZthOKjmLWXS91RD1oRw6UIkkdbSdCSR7T0Ae5qd5FKf/AOt6Er8xyTHmtX8k09LUtS09RHqXUsZai9jFtLLqUUynqDE5lGx1FDpLI+5VTOU4CPmUZm0qnmHan5nJ5i2fMl60lsSOWpyKkP8AjBK+e/mWYfBVfqDBZvh0szO7dyu1ExodDzpSZyR8wlqDtw3IiqU5zENppnKcbEcoou0VW7gmqEUKchxcNRbyZu5OkHdSY8oH4yks7qST4eSpyd87aSqZT9gxqNy0/GElikdn+gkBbO11DWdpNCh7byTzJkjRVVdFtzWq46NQ+kfo1jmOPuzuQySp5O7p+pJU1mUrfJHQcs3SZFUViG/QMQwz19mIgXjt1gIoTD49nqVI0S7aKSz/AKCcy5Qh5i/cGJ/o+pOCn1Y5xrmkv+yHmHwV7/PBLKjMIOG2gZ2vUFJ2mlDOYKFMTmk51VTk0vW9UObUR9xnh7tAxtEpYdnSWp0OchiHlUH7jZ0ldW/G6erdOJ9D37G9RO3vBeUckII/4A/zrfn/ANzpiJUyCRSym5JL6bkbTUJfKmyTJojpnNoJJE0SE0zDH7f2noC1ys9XoSQRlylUTRWcTWMXaqsXTtTp1vwhzB+wr/uI2rG19XV/gZo5ssRrdypWExphyn0jOVvOimPgBYzStMSeiqYlFH0+01CVyVkkxZo+oRSJokEXrGFb38xZV/iG1IqkhoVAtC0wrGP4w5eiduP8RLYKjROOKhJ1cXC9W9N041O6mJWyExQRJ0Z1ItnBFzkHjw94orL15aCn5x6ItPS10wlbdCasH0zRbqslkyaJ9Iig30NLVhgzwwV3PlaoqSzsoUmK6umssgos01Y/qzEROUhwGnLMVHLb7Y7awvJQinN1HUhSRaYJNU/xL1+ZUhvwQxK7FjaExA5Q6YUPcNN6pK0KDbzIhGrjUT6sU5CicFH0XSVASJCmKLpyXyWVtPxLNigRIg+OlaW3yNzlryEp+HnyXlvmOeZc1q9G06bQ1LT1EMfTWtLTYHsOVmqkQrCk6LUXnbT8meTF2d2dsMCxvdWPDF/7ht+UNRLkYbXVo7f3HnFMT+sZFGYTGjZiSayVbmpVKLV2UxDacCJnKQ8drbz7Qr16YzIQVq6XUHcfKDz2j8RCjZxIZNTTY9EyqZqQLL3KihSGWP2M4nUNf3UsHZ+9jdshdShJfPeZPyZZTTScI+5VTOU42WoL4m5VhqpnEnZSm7MU3ImFSJ1nKzzs8g6BsijzWTUUlSJ9Bqo2Vi3uFJ7V40rE13UZD+ZksYTRN4cienqCSpDonVEhmuFTD/LpTIZLKraS+XtqbnKU/lpWh1UDpzFLpHBjlOU6w05fhs2fY+bAs3jUjhqvJp8mdFToyHIZouIhjb94MR1o7e2pmlePK2kL9qowV8zkWswRVO/VMToEkhD2dULPLfZJiZSqo2x2r6YHZTSLY8ejTKvOEDk+kS1k2DPC9IKmJWErs1IU5mmbTJsHM3If+63McyIxXKL7jyuvdyv+ZtQlrKcP2IK2VcWgkU7jVEolLqUy1u1m7F88I3WljhImicipDDT+GubI3pxmXWxAUp0dHMZM3pJg/wD0JgsU6BjnL8gNnEwp4e7r0xStUV5a+VzKb+YzDTeEUVbnW0W5PxuonLpjc9MUlTFDSJtTFHyBlJZQwJoNmbFAiSJA9Sx9UAAeiQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//2Q==" alt="Payment QR Code" style="width: 200px; height: 200px; object-fit: contain; display: block; margin: 0 auto; border: 1px solid #ddd;">

                                        <div style="margin-top: 1rem; text-align: center;">
                                            <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; color: black; font-weight: 500;">
                                                <input type="checkbox" id="upi-payment-confirm" style="width: 20px; height: 20px; accent-color: var(--primary-color);">
                                                <span>I have made the payment</span>
                                            </label>
                                        </div>
                                    </div>

                                    <label class="payment-option" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1);">
                                        <input type="radio" name="payment" value="COD" onchange="window.toggleQR(this.value)" style="width: 20px; height: 20px; accent-color: var(--primary-color);">
                                        <span style="font-size: 1.1rem;">Cash on Delivery (Cash/UPI)</span>
                                    </label>
                                </div>
                            </div>
                            `}
                            
                            <div class="cart-summary" style="margin-top: 1.5rem; background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 16px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 1.1rem; color: var(--text-gray);">
                                    <span>Item Total</span>
                                    <span>₹${itemTotal}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 1.1rem; color: var(--text-gray);">
                                    <span>Base Delivery Fee</span>
                                    <span style="${baseDeliveryFee === 0 ? 'color: #10b981;' : ''}">
                                        ${baseDeliveryFee === 0 ? 'FREE' : '₹' + baseDeliveryFee}
                                    </span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 1.1rem; color: var(--text-gray);">
                                    <span>Distance Surcharge (>3km)</span>
                                    <span style="${distanceSurcharge > 0 ? 'color: #fbbf24;' : ''}">
                                        ${distanceSurcharge > 0 ? '₹' + distanceSurcharge : '₹0'}
                                    </span>
                                </div>

                                ${window.appliedCoupon ? `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 1.1rem; color: ${discount > weekendSavings ? '#e11d48' : '#f59e0b'};">
                                    <span>Coupon (${window.appliedCoupon.code})</span>
                                    <span>${discount > weekendSavings ? '-₹' + (discount - weekendSavings) : '<span style="font-size:0.9rem">Conditions not met</span>'}</span>
                                </div>
                                ${couponError ? `<div style="color: #f59e0b; font-size: 0.9rem; margin-bottom: 1rem; text-align: right;">${couponError}</div>` : ''}
                                ` : ''}
                                ${weekendSavings > 0 ? `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 1.1rem; color: #10b981;">
                                    <span>Weekend Savings (Extra)</span>
                                    <span>-₹${weekendSavings}</span>
                                </div>
                                ` : ''}

                                ${baseDeliveryFee > 0 ? `
                                    <div style="margin-bottom: 1rem; text-align: center; font-size: 0.9rem; color: #FFA500;">
                                        Add items worth ₹${199 - itemTotal} more for <br><strong>FREE BASE DELIVERY</strong>
                                    </div>
                                ` : ''}

                                <div style="height: 1px; background: rgba(255,255,255,0.1); margin-bottom: 1rem;"></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 1.5rem;">
                                    <span>Total to Pay</span>
                                    <span style="font-weight: bold; color: var(--primary-color);">₹${finalTotal}</span>
                                </div>
                                ${state.user.name ?
                `<button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="placeOrder()">Place Order</button>` :
                `<button class="btn btn-primary" style="width: 100%; margin-top: 1rem; opacity: 0.5; cursor: not-allowed;" onclick="showToast('Please login to place order', '🔒')">Login Required to Order</button>`
            }
                            </div>
                        </div>
                    </div>
                `}
            </div >
        `;
    }

    // Removed dynamic generation to use user-provided static QR
    window.toggleQR = function (value) {
        const qr = document.getElementById('qr-container');
        if (qr) {
            qr.style.display = value === 'UPI' ? 'block' : 'none';
        }
    }

    // === Payment Verification Logic ===

    // Global Coupon State
    window.appliedCoupon = null;

    window.applyCoupon = function (code) {
        if (code === 'WELCOME50') {
            const couponData = { code: 'WELCOME50', amount: 50 };
            window.appliedCoupon = couponData;
            localStorage.setItem('appliedCoupon', JSON.stringify(couponData));

            // Force Alert for Visibility
            alert("🎉 Coupon Applied! ₹50 OFF");
            showToast("Coupon WELCOME50 Applied! ₹50 OFF", "🎉");

            // Update UI Immediately
            if (window.location.hash === '#cart') {
                renderCart();
            } else {
                if (state.cart.length === 0) {
                    setTimeout(() => {
                        const productsSection = document.getElementById('products-section') || document.getElementById('products');
                        if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                } else {
                    window.location.hash = '#cart';
                    router();
                }
            }
        } else {
            alert("Invalid Coupon Code");
            showToast("Invalid Coupon Code", "❌");
        }
    };


    // Helper: Haversine Distance Calculation (Simulated User Location)
    function getUserDistance() {
        // In a real app, we'd use navigator.geolocation
        // unique fixed random distance per session for consistency
        if (!state.user.distance) {
            // Check if we have coordinates from map interaction
            // For now, generate a random distance between 0.5km and 8.0km if undefined
            state.user.distance = (Math.random() * 7.5 + 0.5).toFixed(1);
        }
        return parseFloat(state.user.distance);
    }

    // Helper: Calculate Totals
    function getCartTotals() {
        const itemTotal = state.cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

        // --- Distance Logic ---
        const distance = getUserDistance();
        // Rule: Free Delivery > 199 is only valid up to 3km
        // Base Fee: 40 (waived if total >= 199)
        let baseDeliveryFee = itemTotal >= 199 ? 0 : 40;

        // Distance Surcharge: >3km = 10rs/km
        // E.g. 5km => (5-3)*10 = 20rs surcharge
        let distanceSurcharge = 0;
        if (distance > 3) {
            distanceSurcharge = Math.ceil(distance - 3) * 10;
        }

        const deliveryFee = baseDeliveryFee + distanceSurcharge;

        let discount = 0;
        let couponError = null;

        if (window.appliedCoupon && window.appliedCoupon.code === 'WELCOME50') {
            // Check 1: Min Order 300
            if (itemTotal < 300) {
                couponError = "Min order ₹300 for this coupon";
            }
            // Check 2: New User Check
            else if (state.user.orders && state.user.orders.length > 0) {
                couponError = "Valid for First Order Only";
            }
            else {
                discount = 50;
            }
        }

        // --- WEEKEND SALE LOGIC (SUNDAY ONLY) ---
        const isSunday = new Date().getDay() === 0;
        const weekendDiscountPct = (state.settings && state.settings.weekend_discount != null) ? state.settings.weekend_discount : 5;
        let weekendSavings = 0;

        if (isSunday && itemTotal > 0) {
            weekendSavings = Math.floor(itemTotal * (weekendDiscountPct / 100));
            discount += weekendSavings;
            // Note: We're adding it to total discount
        }

        // Ensure total doesn't go negative
        const total = Math.max(0, itemTotal + deliveryFee - discount);

        return { itemTotal, deliveryFee, baseDeliveryFee, distanceSurcharge, distance, discount, weekendSavings, finalTotal: total, couponError };
    }

    // --- Core Logic ---

    window.changeQty = function (id, delta) {
        const input = document.getElementById(`qty-${id}`);
        if (input) {
            let val = parseFloat(input.value) + delta;
            if (val < 0.1) val = 0.1;
            // Round to 2 decimals to avoid floating point errors
            input.value = Math.round(val * 100) / 100;
        }
    }

    // New Helper to update quantity directly from Cart
    window.updateCartItemQty = function (id, delta) {
        const item = state.cart.find(i => i.id === id);
        if (item) {
            let newQty = (item.qty || 1) + delta;
            if (newQty <= 0) {
                // If quantity goes to 0 or less, confirm removal
                if (confirm("Remove item from cart?")) {
                    window.removeAllFromCart(id);
                }
                return;
            }
            item.qty = Math.round(newQty * 100) / 100;
            updateCartUI();
            renderCart();
        }
    }

    window.addToCart = function (productId, targetPrice = null) {
        const product = state.products.find(p => p.id === productId);
        if (product) {
            if (product.in_stock === false) {
                showToast("This product is out of stock", "📦");
                return;
            }

            // Get Quantity
            const qtyInput = document.getElementById(`qty-${productId}`);
            let qty = qtyInput ? parseFloat(qtyInput.value) : 1;
            if (isNaN(qty) || qty <= 0) qty = 1;

            logActivity({ type: 'add_to_cart', details: `${product.name} (x${qty})` });

            // Check if item exists in cart
            const existingItem = state.cart.find(item => item.id === productId);

            if (existingItem) {
                // Update existing item quantity
                existingItem.qty = (existingItem.qty || 1) + qty;
                // Ensure float precision
                existingItem.qty = Math.round(existingItem.qty * 100) / 100;
            } else {
                // Add new item with specific quantity
                const finalProduct = targetPrice ? { ...product, price: targetPrice } : { ...product };
                finalProduct.qty = qty;
                state.cart.push(finalProduct);
            }

            updateCartUI();
            showToast(`Added ${qty} ${getPriceUnit(product)} ${product.name}`, "🍎");

            // Temporary feedback
            const btn = document.querySelector(`button[onclick *="addToCart(${productId})"]`);
            if (btn) {
                const oldText = btn.textContent;
                btn.textContent = `Added +${qty}`;
                setTimeout(() => btn.textContent = oldText, 1500);
            }

            // Reset quantity to 1 (optional, maybe keep it if user wants to add more?)
            // if (qtyInput) qtyInput.value = 1; 
        }
    }

    // NEW: Remove ALL items of a specific ID
    window.removeAllFromCart = function (id) {
        state.cart = state.cart.filter(item => item.id !== id);
        updateCartUI();
        if (window.location.hash === '#cart') renderCart();
        showToast("Item removed from cart", "🗑️");
    }

    // Ensure regular Remove works perfectly too (Now removes the line item)
    window.removeFromCart = function (index) {
        // With consolidated cart, index maps directly to item
        if (index >= 0 && index < state.cart.length) {
            state.cart.splice(index, 1);
            updateCartUI();
            if (window.location.hash === '#cart') renderCart();
        }
    }

    function updateCartUI() {
        // Count distinct items or total items? Let's show distinct count for clarity with fractional
        cartCount.textContent = state.cart.length;
        localStorage.setItem('savedCart', JSON.stringify(state.cart)); // Persist Cart
        cartCount.parentElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCount.parentElement.style.transform = 'scale(1)';
        }, 200);
    }

    // ... setupEventListeners ... 

    // Helper: Finalize Order (After verification or COD)
    async function finalizeOrder(name, phone, address, paymentMethod, totalAmount) {
        // Mock Success
        const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

        // Create order object
        const newOrder = {
            id: orderId,
            time: new Date().toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
            }),
            items: state.cart.map(item => `${item.name} (${item.qty || 1} ${getPriceUnit(item)})`).join(', '),
            total: totalAmount,
            delivery_status: 'Processing',
            payment_method: paymentMethod,
            payment_status: paymentMethod === 'UPI' ? 'Paid' : 'Pending',
            fullItems: [...state.cart], // Store for bill
            breakdown: getCartTotals()   // Store for bill
        };

        try {
            await fetch(`${API_BASE}/api/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: { name, phone, address },
                    cart: state.cart,
                    total: totalAmount,
                    payment: paymentMethod
                })
            });
        } catch (e) {
            console.error("Order logging failed", e);
        }

        // Save order to localStorage immediately
        const localStorageKey = `orderHistory_${phone}`;
        try {
            let existingOrders = [];
            const cachedOrders = localStorage.getItem(localStorageKey);
            if (cachedOrders) {
                existingOrders = JSON.parse(cachedOrders);
            }

            // Add new order at the beginning
            existingOrders.unshift(newOrder);

            // Save back to localStorage
            localStorage.setItem(localStorageKey, JSON.stringify(existingOrders));
        } catch (e) {
            console.error("Failed to save order to localStorage", e);
        }

        // CAPTURE BILL DATA
        const billBreakdown = getCartTotals();
        const billItems = [...state.cart]; // Clone current cart

        state.cart = []; // Clear cart
        updateCartUI();

        const mainContent = document.getElementById('app-main');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="container" style="padding-top: 8rem; text-align: center; max-width: 600px;">
                    <div style="font-size: 5rem; margin-bottom: 1rem;">🎉</div>
                    <h1 style="font-family: var(--font-serif); margin-bottom: 1.5rem;">Order Placed Successfully!</h1>
                    <p style="color: var(--text-gray); font-size: 1.2rem; margin-bottom: 2rem;">
                        Thank you <strong>${name}</strong>! Your order <strong>#${orderId}</strong> will be delivered soon.
                    </p>
                    <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 16px; margin-bottom: 2rem;">
                         <p style="margin-bottom: 0.5rem;">Total Paid: <strong style="color: var(--primary-color);">₹${totalAmount}</strong></p>
                        <p style="margin-bottom: 0.5rem;">Payment Mode: <strong>${paymentMethod}</strong></p>
                        <p>Delivery Agent: <strong>Ramesh (9810xxxxxx)</strong></p>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem;">
                         <button class="btn btn-primary" onclick="window.location.reload()">Continue Shopping</button>
                         <button class="btn btn-outline" style="border-color: #10b981; color: #10b981;" onclick='window.printInvoice(${JSON.stringify({ orderId, name, phone, address, paymentMethod, totalAmount, items: billItems, breakdown: billBreakdown }).replace(/'/g, "&apos;")})'>
                            📄 Download Bill
                         </button>
                    </div>
                </div>
            `;
        }
    }

    // --- REAL BILL (INVOICE) GENERATOR ---
    window.printInvoice = function (data) {
        const printWindow = window.open('', '_blank');
        const date = new Date().toLocaleString();

        const invoiceHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice - ${data.orderId}</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; padding: 40px; }
                    .invoice-box { max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { font-size: 24px; font-weight: bold; color: #10b981; }
                    .details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
                    .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .table th { background: #f8f9fa; text-align: left; padding: 12px; border-bottom: 2px solid #dee2e6; }
                    .table td { padding: 12px; border-bottom: 1px solid #dee2e6; }
                    .summary { margin-left: auto; width: 300px; }
                    .summary-row { display: flex; justify-content: space-between; padding: 5px 0; }
                    .total { font-size: 20px; font-weight: bold; color: #10b981; border-top: 2px solid #10b981; margin-top: 10px; padding-top: 10px; }
                    .footer { text-align: center; margin-top: 50px; color: #888; font-size: 12px; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="no-print" style="text-align:right; margin-bottom: 20px;">
                    <button onclick="window.print()" style="background:#10b981; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; font-weight:bold;">Print Bill</button>
                </div>
                <div class="invoice-box">
                    <div class="header">
                        <div class="logo">AJAY FRUIT MART</div>
                        <div style="text-align: right;">
                            <h2 style="margin:0;">INVOICE</h2>
                            <p style="margin:0; color:#666;">#${data.orderId}</p>
                            <p style="margin:0; color:#666; font-size:12px;">${date}</p>
                        </div>
                    </div>

                    <div class="details">
                        <div>
                            <strong>Billed To:</strong><br>
                            ${data.name}<br>
                            ${data.phone}<br>
                            ${data.address}
                        </div>
                        <div style="text-align: right;">
                            <strong>Merchant:</strong><br>
                            Ajay Fruit Mart<br>
                            Delhi, India<br>
                            GSTIN: 07AJAYF1234F1Z5
                        </div>
                    </div>

                    <table class="table">
                        <thead>
                            <tr>
                                <th>Item Description</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th style="text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.qty || 1} ${getPriceUnit(item)}</td>
                                    <td>₹${item.price}</td>
                                    <td style="text-align: right;">₹${Math.round(item.price * (item.qty || 1))}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>₹${data.breakdown.itemTotal}</span>
                        </div>
                        <div class="summary-row">
                            <span>Delivery Fee:</span>
                            <span>₹${data.breakdown.deliveryFee}</span>
                        </div>
                        ${data.breakdown.discount > 0 ? `
                        <div class="summary-row" style="color: #e11d48;">
                            <span>Total Discount:</span>
                            <span>-₹${data.breakdown.discount}</span>
                        </div>
                        ` : ''}
                        <div class="summary-row total">
                            <span>Grand Total:</span>
                            <span>₹${data.totalAmount}</span>
                        </div>
                        <div class="summary-row" style="margin-top:10px; font-size: 0.9rem;">
                            <span>Payment Mode:</span>
                            <span>${data.paymentMethod}</span>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Thank you for shopping with Ajay Fruit Mart!<br>For any issues, please contact us at help@ajayfruitmart.com</p>
                        <p style="font-size: 10px;">This is a computer-generated invoice.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
    }

    // Helper: Poll for Status
    let pollingInterval = null;
    function startPolling(reqId, name, phone, address, totalAmount) {
        if (pollingInterval) clearInterval(pollingInterval);

        // Create Modal if not exists
        if (!document.getElementById('pay-modal')) {
            const div = document.createElement('div');
            div.id = 'pay-modal';
            div.style.cssText = "display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center; flex-direction:column;";
            div.innerHTML = `
                <div style="background:#1a1a1a; padding:2rem; border-radius:16px; text-align:center; max-width:90%; color:white; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size:3rem; margin-bottom:1rem;">⏳</div>
                    <h2 style="margin-bottom:1rem; font-family:var(--font-serif);">Verifying Payment</h2>
                    <p style="color:#aaa; margin-bottom:2rem;">Please wait while the admin confirms your transaction.<br>Do not close this window.</p>
                    <div class="spinner" style="border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid var(--primary-color); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin:0 auto;"></div>
                </div>
                <style>@keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}</style>
            `;
            document.body.appendChild(div);
        } else {
            document.getElementById('pay-modal').style.display = 'flex';
        }

        pollingInterval = setInterval(async () => {
            try {
                const res = await fetch(`${API_BASE}/api/check-payment-status?req_id=${reqId}`);
                const data = await res.json();

                if (data.status === 'approved') {
                    clearInterval(pollingInterval);
                    document.getElementById('pay-modal').style.display = 'none';
                    finalizeOrder(name, phone, address, 'UPI', totalAmount);
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        }, 3000); // Poll every 3 seconds
    }

    window.placeOrder = async function () {
        const name = document.getElementById('c-name').value;
        const phone = document.getElementById('c-phone').value;
        const address = document.getElementById('c-address').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        // Update global user
        state.user.name = name;
        state.user.phone = phone;
        state.user.address = address;
        localStorage.setItem('fruitShopUser', JSON.stringify(state.user));

        if (!name || !phone || !address) {
            alert("Please fill in all delivery details!");
            return;
        }

        const { finalTotal } = getCartTotals();

        // Payment Flow
        if (paymentMethod === 'COD') {
            finalizeOrder(name, phone, address, paymentMethod, finalTotal);
        } else {
            // New Feature: Payment Gateway Simulation
            window.openPaymentGateway(finalTotal, () => {
                // After "Payment", proceed to verification (or simulated success)
                // Keeping verification flow for Admin approval context
                initiateVerification(name, phone, address, finalTotal);
            });
        }

    }

    async function initiateVerification(name, phone, address, amount) {
        // Create Verification Request
        try {
            const res = await fetch(`${API_BASE}/api/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: { name, phone, address },
                    amount: amount
                })
            });
            const data = await res.json();
            if (data.success) {
                startPolling(data.req_id, name, phone, address, amount);
            } else {
                alert("Failed to initiate verification. Please try again.");
            }
        } catch (e) {
            console.error("Payment Error:", e);
            alert("ERROR: " + e.name + " - " + e.message + "\n(Check terminal for server logs)");
        }
    }

    async function initiateVerification(name, phone, address, amount) {
        // Create Verification Request
        try {
            const res = await fetch(`${API_BASE}/api/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: { name, phone, address },
                    amount: amount
                })
            });
            const data = await res.json();
            if (data.success) {
                startPolling(data.req_id, name, phone, address, amount);
            } else {
                alert("Failed to initiate verification. Please try again.");
            }
        } catch (e) {
            console.error("Payment Error:", e);
            alert("ERROR: " + e.name + " - " + e.message + "\n(Check terminal for server logs)");
        }
    }

    // Remove from Cart
    window.removeFromCart = function (index) {
        const item = state.cart[index];
        state.cart.splice(index, 1);
        renderCart();
        updateCartUI();
        showToast(`Removed ${item.name}`, "🗑️");
    }

    function renderWishlist() {
        const wishlistItems = state.products.filter(p => state.wishlist.includes(p.id));
        const mainContent = document.getElementById('app-main');
        if (!mainContent) return;

        mainContent.innerHTML = `
        <div class="container" style="padding-top: 8rem; padding-bottom: 4rem;">
            <h1 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 2rem;">My Wishlist ❤️</h1>
                
                ${wishlistItems.length === 0 ? `
                    <div style="text-align: center; padding: 4rem; background: rgba(255,255,255,0.05); border-radius: 16px;">
                        <p style="color: var(--text-gray); font-size: 1.2rem; margin-bottom: 2rem;">Your wishlist is empty.</p>
                        <a href="#" class="btn btn-primary" onclick="window.location.hash=''">Discover Fruits</a>
                    </div>
                ` : `
                    <div class="product-grid">
                        ${renderProductGrid(wishlistItems)}
                    </div>
                `}
            </div>
        `;
    }

    window.editProfile = function () {
        window.location.hash = '#edit-profile';
    }

    function renderEditProfile() {
        const mainContent = document.getElementById('app-main');
        if (!mainContent) return;

        mainContent.innerHTML = `
            <div class="container" style="padding-top: 8rem; padding-bottom: 4rem; max-width: 600px;">
                <h1 style="font-family: var(--font-serif); margin-bottom: 2rem;">Edit Profile</h1>
                
                <div style="background: rgba(255,255,255,0.05); padding: 3rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05);">
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--primary-color); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Full Name</label>
                        <input type="text" id="edit-name" value="${state.user.name || ''}" placeholder="Name">
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--primary-color); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Phone Number</label>
                        <input type="tel" id="edit-phone" value="${state.user.phone || ''}" placeholder="Phone">
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--primary-color); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Email Address</label>
                        <input type="email" id="edit-email" value="${state.user.email || ''}" placeholder="Email">
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--primary-color); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Delivery Address</label>
                        <textarea id="edit-address" rows="4" placeholder="Address">${state.user.address || ''}</textarea>
                    </div>

                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button class="btn btn-outline" style="flex: 1;" onclick="window.location.hash='#profile'">Cancel</button>
                        <button class="btn btn-primary" style="flex: 1;" onclick="saveProfile()">Save Changes</button>
                    </div>
                </div>
            </div>
        `;
    }

    window.saveProfile = function () {
        const n = document.getElementById('edit-name').value;
        const p = document.getElementById('edit-phone').value;
        const a = document.getElementById('edit-address').value;
        const e = document.getElementById('edit-email').value;

        if (n && p && a) {
            state.user.name = n;
            state.user.phone = p;
            state.user.address = a;
            state.user.email = e;

            // Only update image if it's a default avatar
            if (!state.user.image || state.user.image.startsWith('https://ui-avatars.com')) {
                state.user.image = `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=FF8C00&color=fff`;
            }

            localStorage.setItem('fruitShopUser', JSON.stringify(state.user));
            showToast("Profile updated successfully!");
            window.location.hash = '#profile';
        } else {
            showToast("Required fields missing", "❌");
        }
    }

    window.uploadProfileImage = function (input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                state.user.image = e.target.result;
                localStorage.setItem('fruitShopUser', JSON.stringify(state.user));
                renderProfile();
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    async function renderProfile() {
        const mainContent = document.getElementById('app-main');
        if (!mainContent) return;

        // Fetch Orders AND Complaints for this user
        let userOrders = [];
        let userComplaints = [];

        if (state.user.phone) {
            // Try to load from localStorage first (for offline/network change scenarios)
            const localStorageKey = `orderHistory_${state.user.phone}`;
            const localComplaintsKey = `complaints_${state.user.phone}`;

            try {
                const cachedOrders = localStorage.getItem(localStorageKey);
                const cachedComplaints = localStorage.getItem(localComplaintsKey);

                if (cachedOrders) {
                    userOrders = JSON.parse(cachedOrders);
                }
                if (cachedComplaints) {
                    userComplaints = JSON.parse(cachedComplaints);
                }
            } catch (e) {
                console.error("Failed to load cached history", e);
            }

            // Try to fetch from server (to get latest updates)
            try {
                const [ordersRes, complaintsRes] = await Promise.all([
                    fetch(`${API_BASE}/api/orders?phone=${state.user.phone}`),
                    fetch(`${API_BASE}/api/complaint?phone=${state.user.phone}`)
                ]);

                const fetchedOrders = await ordersRes.json();
                const fetchedComplaints = await complaintsRes.json();

                // Merge Strategies:
                // 1. Keep all fetched orders (Server Truth)
                // 2. Add any local orders that are NOT in fetched orders (Offline created)
                const serverOrderIds = new Set(fetchedOrders.map(o => o.id));
                const localOnlyOrders = userOrders.filter(o => !serverOrderIds.has(o.id));

                // Combine and Sort
                userOrders = [...localOnlyOrders, ...fetchedOrders];

                // Sort by time (Newest first) - assuming simple parsing or just trust order
                // For simplicity, we trust the merge order (local on top usually) or re-sort if needed

                userComplaints = fetchedComplaints;

                // Save merged list to localStorage
                localStorage.setItem(localStorageKey, JSON.stringify(userOrders));
                localStorage.setItem(localComplaintsKey, JSON.stringify(fetchedComplaints));
            } catch (e) {
                console.error("Failed to fetch from server, using cached data", e);
            }
        }

        mainContent.innerHTML = `
        <div class="container" style="padding-top: 8rem; padding-bottom: 4rem; max-width: 900px;">
                <div class="profile-header" style="display: flex; gap: 2rem; align-items: center; background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 20px; margin-bottom: 2rem;">
                    
                    <div style="position: relative; width: 100px; height: 100px;">
                        <img src="${state.user.image || 'https://ui-avatars.com/api/?name=Guest&background=random'}" 
                             alt="Profile" 
                             style="width: 100%; height: 100%; border-radius: 50%; border: 3px solid var(--primary-color); object-fit: cover;">
                        
                        ${state.user.name ? `
                        <label for="profile-upload" style="position: absolute; bottom: 0; right: 0; background: var(--primary-color); color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid #0f172a;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                        </label>
                        <input type="file" id="profile-upload" accept="image/*" style="display: none;" onchange="uploadProfileImage(this)">
                        ` : ''}
                    </div>

                    <div>
                        <h1 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 0.5rem;">${state.user.name || 'Guest User'}</h1>
                        <p style="color: var(--text-gray); display: flex; align-items: center; gap: 0.5rem;">
                            ${state.user.email || 'No email provided'}
                        </p>
                        <p style="color: var(--text-gray); display: flex; align-items: center; gap: 0.5rem;">
                            ${state.user.phone || 'No phone provided'}
                        </p>
                        <p style="color: var(--text-gray); display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                            ${state.user.address || 'No address provided'}
                        </p>
                    </div>
                    <div style="margin-left: auto; display: flex; flex-direction: column; gap: 0.5rem;">
                         <button class="btn btn-outline" onclick="editProfile()">Edit Profile</button>
                         ${state.user.name
                ? '<button class="btn btn-outline" style="border-color: #ff4444; color: #ff4444;" onclick="logoutUser()">Logout</button>'
                : '<button class="btn btn-primary" onclick="loginUser()">Login</button>'
            }
                    </div>
                </div>

                <div class="profile-orders">
                    <h2 style="font-family: var(--font-serif); margin-bottom: 1.5rem;">Order History (${userOrders.length})</h2>
                    <div class="orders-list" style="display: flex; flex-direction: column; gap: 1rem;">
                        ${userOrders.length === 0 ? '<p style="color:gray">No orders found.</p>' :
                userOrders.map(order => {
                    const complaint = userComplaints.find(c => c.order_id === order.id);
                    let complaintHtml = '';

                    if (complaint) {
                        const isResolved = complaint.status === 'Resolved';
                        complaintHtml = `
                            <div style="margin-top:1rem; background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px; border-left: 3px solid ${isResolved ? '#4ade80' : '#fbbf24'};">
                                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                                    <strong style="font-size:0.9rem; color:#fff;">📢 Issue Reported: ${complaint.type}</strong>
                                    <span style="font-size:0.8rem; color:${isResolved ? '#4ade80' : '#fbbf24'}">${complaint.status}</span>
                                </div>
                                <p style="font-size:0.9rem; color:#ccc; margin-bottom:0.5rem;">"${complaint.desc}"</p>
                                ${isResolved && complaint.admin_reply ? `
                                    <div style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid rgba(255,255,255,0.1);">
                                        <strong style="color:var(--primary-color); font-size:0.85rem;">👨‍💼 Admin Response:</strong>
                                        <p style="font-size:0.9rem; color:#fff; margin-top:2px;">${complaint.admin_reply}</p>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }

                    return `
                            <div class="order-card" style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
                                    <div>
                                        <h3 style="font-size: 1.1rem; color: var(--primary-color); margin:0;">Order #${order.id.split('-')[1]}</h3>
                                        <p style="color: var(--text-gray); font-size: 0.8rem;">${order.time}</p>
                                    </div>
                                    <div style="text-align: right;">
                                        <p style="font-weight: bold; font-size: 1.1rem; margin:0;">₹${order.total}</p>
                                        <span style="font-size: 0.8rem; color:${order.delivery_status === 'Delivered' ? '#4ade80' : '#fbbf24'}">
                                            ${order.delivery_status || 'Processing'}
                                        </span>
                                    </div>
                                </div>
                                <p style="color: var(--text-gray); font-size: 0.9rem; margin-bottom:1.5rem;">${order.items}</p>
                                
                                <!-- Visual Status Tracker -->
                                <div style="display: flex; justify-content: space-between; position: relative; margin-bottom: 2rem; padding: 0 10px;">
                                    <div style="position: absolute; top: 12px; left: 10px; right: 10px; height: 3px; background: rgba(255,255,255,0.1); z-index: 1;"></div>
                                    <div style="position: absolute; top: 12px; left: 10px; width: ${order.delivery_status === 'Processing' ? '0%' :
                            order.delivery_status === 'Shipped' ? '33%' :
                                order.delivery_status === 'Out for Delivery' ? '66%' :
                                    order.delivery_status === 'Delivered' ? '100%' : '0%'
                        }; height: 3px; background: var(--primary-color); z-index: 2; transition: width 0.5s ease;"></div>
                                    
                                    ${['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, i) => {
                            const steps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
                            const currentIdx = steps.indexOf(order.delivery_status || 'Processing');
                            const isCompleted = i <= currentIdx;
                            const isActive = i === currentIdx;

                            return `
                                            <div style="position: relative; z-index: 3; text-align: center;">
                                                <div style="width: 25px; height: 25px; border-radius: 50%; background: ${isCompleted ? 'var(--primary-color)' : '#1e293b'}; border: 2px solid ${isCompleted ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; box-shadow: ${isCompleted ? '0 0 10px var(--primary-color)' : 'none'};">
                                                    ${isCompleted ? '✓' : ''}
                                                </div>
                                                <span style="font-size: 0.7rem; color: ${isCompleted ? '#fff' : '#64748b'}; font-weight: ${isActive ? '700' : '400'};">${step}</span>
                                            </div>
                                        `;
                        }).join('')}
                                </div>
                                
                                <div style="display:flex; gap:10px; border-top:1px solid rgba(255,255,255,0.1); padding-top:1rem; flex-wrap:wrap;">
                                    ${order.delivery_status === 'Delivered' ?
                            `<button class="btn btn-outline" style="padding:5px 15px; font-size:0.8rem;" onclick="openRatingModal('${order.items.replace(/'/g, "\\'")}')">⭐ Rate</button>` : ''}
                                    
                                    ${['Out for Delivery', 'Delivered', 'Cancelled'].includes(order.delivery_status) ? '' :
                            `<button class="btn btn-outline" style="padding:5px 15px; font-size:0.8rem; border-color:#cbd5e1; color:#cbd5e1;" onclick="cancelOrder('${order.id}')">❌ Cancel Order</button>`
                        }

                                    <button class="btn btn-primary" style="padding:5px 15px; font-size:0.8rem; background: var(--primary-color); border:none; color:black; font-weight:600;" onclick="startLiveTracking('${order.id}')">📍 Track</button>
                                    
                                    ${order.fullItems ? `<button class="btn btn-outline" style="padding:5px 15px; font-size:0.8rem; border-color:#10b981; color:#10b981;" onclick='window.printInvoice(${JSON.stringify({ orderId: order.id, name: state.user.name, phone: state.user.phone, address: state.user.address, paymentMethod: order.payment_method, totalAmount: order.total, items: order.fullItems, breakdown: order.breakdown }).replace(/'/g, "&apos;")})'>📜 Bill</button>` : ''}

                                    <button class="btn btn-outline" style="padding:5px 15px; font-size:0.8rem; border-color:#ef4444; color:#ef4444;" onclick="openComplaintModal('${order.id}')">⚠️ Help</button>
                                </div>
                                ${complaintHtml}
                            </div>
                        `}).join('')}
                    </div>
                </div>
            </div >
        `;
        initAnimations();
    }

    // --- FEEDBACK LOGIC ---
    window.openFeedbackModal = function () {
        document.getElementById('feedback-modal').classList.remove('hidden');
        setFeedbackRating(5);
    };

    window.closeFeedbackModal = function () {
        document.getElementById('feedback-modal').classList.add('hidden');
    };

    window.setFeedbackRating = function (n) {
        document.getElementById('feedback-rating').value = n;
        const stars = document.querySelectorAll('#feedback-modal .star-rating span');
        stars.forEach((s, index) => {
            s.style.color = index < n ? '#fbbf24' : '#ccc';
        });
    };

    window.submitFeedback = async function () {
        const rating = document.getElementById('feedback-rating').value;
        const comment = document.getElementById('feedback-comment').value;

        try {
            await fetch(`${API_BASE}/api/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating: rating,
                    comment: comment,
                    user: state.user.name || 'Anonymous'
                })
            });
            alert("Thank you for your feedback!");
            closeFeedbackModal();
        } catch (e) { console.error(e); }
    };


    // --- LIVE TRACKING LOGIC ---
    let map = null;
    let deliveryMarker = null;
    let routeInterval = null;

    window.openTrackingModal = function (orderId) {
        try {
            if (typeof L === 'undefined') {
                alert("Error: Leaflet (Map Library) is not loaded.");
                return;
            }

            const modal = document.getElementById('tracking-modal');
            if (!modal) {
                alert("Error: Tracking Modal element missing in HTML.");
                return;
            }

            document.getElementById('track-order-id').innerText = orderId;
            modal.classList.remove('hidden');
            modal.style.display = 'flex';

            // Initialize Map
            setTimeout(() => {
                try {
                    initMap();
                    if (map) map.invalidateSize();
                } catch (err) {
                    alert("Map Init Error: " + err.message);
                }
            }, 500);

        } catch (e) {
            alert("Tracking Error: " + e.message);
        }
    };

    window.closeTrackingModal = function () {
        const modal = document.getElementById('tracking-modal');
        modal.classList.add('hidden');
        modal.style.display = ''; // Clear inline style
        if (routeInterval) clearInterval(routeInterval);
    };

    function initMap() {
        if (map) {
            map.remove(); // Reset map if re-opening
        }

        // Coordinates (Simulated: Connaught Place, Delhi as Shop)
        const shopLoc = [28.6304, 77.2177];
        const userLoc = [28.6200 + (Math.random() * 0.02), 77.2100 + (Math.random() * 0.02)]; // Random nearby location

        map = L.map('map').setView(shopLoc, 13);

        // Use better map tiles with traffic layer simulation
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // Shop Marker with custom icon
        const shopIcon = L.divIcon({
            html: `<div style="background:#10b981; width:30px; height:30px; border-radius:50%; border:3px solid white; display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);">🏪</div>`,
            className: 'custom-div-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        L.marker(shopLoc, { icon: shopIcon }).addTo(map).bindPopup("<b>🏪 Ajay Fruit Mart</b><br>Shop Location");

        // User Marker with custom icon
        const userIcon = L.divIcon({
            html: `<div style="background:#ef4444; width:30px; height:30px; border-radius:50%; border:3px solid white; display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);">📍</div>`,
            className: 'custom-div-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        L.marker(userLoc, { icon: userIcon }).addTo(map).bindPopup("<b>📍 Your Location</b><br>Delivery Address");

        // Draw route line
        const routeLine = L.polyline([shopLoc, userLoc], {
            color: '#d946ef',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10',
            lineJoin: 'round'
        }).addTo(map);

        // Fit bounds to show entire route
        const bounds = L.latLngBounds([shopLoc, userLoc]);
        map.fitBounds(bounds, { padding: [80, 80] });

        // Current Delivery Person Location (Start at shop)
        let boyLoc = [...shopLoc];
        const boyIcon = L.divIcon({
            html: `<div style="font-size:32px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); animation: bounce 1s infinite;">🛵</div>`,
            className: 'scooter-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        deliveryMarker = L.marker(boyLoc, { icon: boyIcon }).addTo(map);

        // Add delivery person info popup
        deliveryMarker.bindPopup(`
            <div style="text-align:center; font-family: var(--font-sans);">
                <div style="font-size:2rem; margin-bottom:0.5rem;">🛵</div>
                <b>Rahul Kumar</b><br>
                <span style="color:#10b981;">● Online</span><br>
                <small>Delivery Partner</small>
            </div>
        `);

        // Calculate actual distance for realistic ETA
        const distance = map.distance(shopLoc, userLoc); // in meters
        const distanceKm = (distance / 1000).toFixed(2);
        const baseETA = Math.ceil((distance / 1000) * 3); // 3 minutes per km average

        // Animate Movement with realistic speed
        let progress = 0;
        const totalSteps = 150; // More steps for smoother animation
        const animationSpeed = 80; // milliseconds per step

        if (routeInterval) clearInterval(routeInterval);

        // Update delivery person info
        const deliveryPersonInfo = document.getElementById('delivery-person-info');
        if (deliveryPersonInfo) {
            deliveryPersonInfo.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 1rem;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                        👨‍🦱
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; font-size: 1.1rem;">Rahul Kumar</div>
                        <div style="color: var(--text-gray); font-size: 0.9rem;">Delivery Partner</div>
                        <div style="color: #10b981; font-size: 0.85rem; margin-top: 0.25rem;">● Online - ${distanceKm} km away</div>
                    </div>
                    <a href="tel:+919876543210" style="background: #10b981; color: white; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; font-size: 0.9rem;">📞 Call</a>
                </div>
            `;
        }

        routeInterval = setInterval(() => {
            progress += 1;

            if (progress > totalSteps) {
                clearInterval(routeInterval);
                // Order delivered
                document.getElementById('track-status-text').innerText = "✅ Delivered Successfully!";
                document.getElementById('track-eta').innerText = "0 mins";
                showToast("Order Delivered! 🎉", "✅");
                return;
            }

            // Calculate current position along the route
            const ratio = progress / totalSteps;
            const lat = shopLoc[0] + (userLoc[0] - shopLoc[0]) * ratio;
            const lng = shopLoc[1] + (userLoc[1] - shopLoc[1]) * ratio;

            deliveryMarker.setLatLng([lat, lng]);

            // Update traveled path (green line)
            const traveledPath = L.polyline([shopLoc, [lat, lng]], {
                color: '#10b981',
                weight: 4,
                opacity: 0.9,
                lineJoin: 'round'
            }).addTo(map);

            // Calculate remaining ETA
            const remainingRatio = 1 - ratio;
            const eta = Math.ceil(baseETA * remainingRatio);
            document.getElementById('track-eta').innerText = `${eta} mins`;

            // Update distance remaining
            const remainingDistance = (distanceKm * remainingRatio).toFixed(2);
            const distanceEl = document.getElementById('track-distance');
            if (distanceEl) {
                distanceEl.innerText = `${remainingDistance} km`;
            }

            // Dynamic status updates with realistic milestones
            const statusEl = document.getElementById('track-status-text');
            const timestampEl = document.getElementById('track-timestamp');
            const currentTime = new Date();

            if (progress < 5) {
                statusEl.innerText = "📦 Order picked up from store";
                if (timestampEl) timestampEl.innerText = currentTime.toLocaleTimeString();
            } else if (progress < 15) {
                statusEl.innerText = "🛵 Delivery partner started the journey";
                if (timestampEl) timestampEl.innerText = currentTime.toLocaleTimeString();
            } else if (progress < 40) {
                statusEl.innerText = "🚦 On the way to your location";
                if (timestampEl) timestampEl.innerText = currentTime.toLocaleTimeString();
            } else if (progress < 70) {
                statusEl.innerText = "🏃 Delivery partner is nearby";
                if (timestampEl) timestampEl.innerText = currentTime.toLocaleTimeString();
            } else if (progress < 90) {
                statusEl.innerText = "📍 Reaching your location soon";
                if (timestampEl) timestampEl.innerText = currentTime.toLocaleTimeString();
            } else {
                statusEl.innerText = "🚪 Arriving at your doorstep";
                if (timestampEl) timestampEl.innerText = currentTime.toLocaleTimeString();
            }

            // Update progress bar if exists
            const progressBar = document.getElementById('track-progress-bar');
            if (progressBar) {
                progressBar.style.width = `${(progress / totalSteps) * 100}%`;
            }

        }, animationSpeed);
    }

    // --- COMPLAINTS & RATINGS LOGIC ---
    window.openComplaintModal = function (orderId) {
        document.getElementById('complaint-order-id').value = orderId;
        document.getElementById('complaint-modal').classList.remove('hidden');
    };

    window.closeComplaintModal = function () {
        document.getElementById('complaint-modal').classList.add('hidden');
    };

    window.submitComplaint = async function () {
        const orderId = document.getElementById('complaint-order-id').value;
        const type = document.getElementById('complaint-type').value;
        const desc = document.getElementById('complaint-desc').value;

        if (!desc) return showToast("Please describe the issue", "⚠️");

        try {
            const res = await fetch(`${API_BASE}/api/complaint`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_id: orderId,
                    type: type,
                    description: desc,
                    user_phone: state.user.phone
                })
            });
            if (res.ok) {
                showToast("Complaint Submitted", "📫");
                closeComplaintModal();
                renderProfile();
            } else {
                showToast("Failed to submit", "❌");
            }
        } catch (e) { console.error(e); }
    };

    window.cancelOrder = async function (orderId) {
        if (!confirm("Are you sure you want to cancel this order?")) return;

        try {
            const res = await fetch(`${API_BASE}/api/cancel-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: orderId })
            });
            const data = await res.json();

            if (data.success) {
                showToast("Order cancelled successfully");
                renderProfile(); // Refresh list
            } else {
                showToast(data.message || "Cancellation failed", "❌");
            }
        } catch (e) { console.error(e); }
    };

    window.openRatingModal = function (productId) {
        document.getElementById('rating-product-id').value = productId;
        document.getElementById('rating-modal').classList.remove('hidden');
        setRating(5);
    };

    window.closeRatingModal = function () {
        document.getElementById('rating-modal').classList.add('hidden');
    };

    window.setRating = function (n) {
        document.getElementById('selected-rating').value = n;
        const stars = document.querySelectorAll('.star-rating span');
        stars.forEach((s, index) => {
            s.style.color = index < n ? '#fbbf24' : '#ccc';
        });
    };

    window.submitRating = async function () {
        const rating = document.getElementById('selected-rating').value;
        const prodId = document.getElementById('rating-product-id').value;

        try {
            const res = await fetch(`${API_BASE}/api/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: prodId, // Storing product name actually
                    rating: rating,
                    user: state.user.name || 'Anonymous'
                })
            });
            if (res.ok) {
                showToast("Thank you for your rating!", "⭐");
                closeRatingModal();
            }
        } catch (e) { console.error(e); }
    };

    // --- PAYMENT GATEWAY SIMULATION ---
    window.openPaymentGateway = function (amount, callback) {
        const div = document.createElement('div');
        div.id = 'pg-modal';
        div.style.cssText = "display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:11000; align-items:center; justify-content:center; backdrop-filter:blur(5px);";
        div.innerHTML = `
            <div style="background: white; width: 400px; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); font-family: sans-serif; color: #333;">
                <div style="background: #f8f9fa; padding: 1.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin:0; font-size: 1.2rem;">Secure Payment</h3>
                    <div style="font-weight: bold; color: #333;">₹${amount}</div>
                </div>
                <div style="padding: 2rem;">
                    <p style="margin-bottom: 1rem; color: #666; font-size: 0.9rem;">Choose Payment Method</p>
                    
                    <div class="pg-option" onclick="selectPgOption(this)" style="border: 1px solid #ddd; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; cursor: pointer; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5rem;">💳</span>
                        <div>
                            <div style="font-weight: 600;">Credit / Debit Card</div>
                            <div style="font-size: 0.8rem; color: #888;">Visa, Mastercard, RuPay</div>
                        </div>
                    </div>

                    <div class="pg-option" onclick="selectPgOption(this)" style="border: 1px solid #ddd; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; cursor: pointer; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5rem;">🏦</span>
                        <div>
                            <div style="font-weight: 600;">Net Banking</div>
                            <div style="font-size: 0.8rem; color: #888;">All Major Banks</div>
                        </div>
                    </div>
                    
                    <div class="pg-option selected" onclick="selectPgOption(this)" style="border: 2px solid #10b981; background: #ecfdf5; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; cursor: pointer; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5rem;">📱</span>
                        <div>
                            <div style="font-weight: 600;">UPI</div>
                            <div style="font-size: 0.8rem; color: #888;">GPay, PhonePe, Paytm</div>
                        </div>
                    </div>

                    <button onclick="document.getElementById('pg-modal').remove(); callback()" style="width: 100%; background: #10b981; color: white; border: none; padding: 1rem; border-radius: 8px; font-weight: bold; font-size: 1rem; cursor: pointer;">Pay Now</button>
                    <div style="text-align: center; margin-top: 1rem; font-size: 0.8rem; color: #aaa;">🔒 256-bit SSL Secured</div>
                </div>
            </div>
            <script>
                function selectPgOption(el) {
                    document.querySelectorAll('.pg-option').forEach(e => {
                        e.style.border = '1px solid #ddd';
                        e.style.background = 'white';
                    });
                    el.style.border = '2px solid #10b981';
                    el.style.background = '#ecfdf5';
                }
            <\/script>
        `;
        document.body.appendChild(div);
    }

    function renderHome() {
        const dragonFruits = state.products.filter(p => p.name.toLowerCase().includes('dragon'));
        const normalFruits = state.products.filter(p => p.category === 'Fruits' && !p.name.toLowerCase().includes('dragon'));
        const vegetables = state.products.filter(p => p.category === 'Vegetables');
        const mainContent = document.getElementById('app-main');
        if (!mainContent) return;

        console.log("RenderHome Settings:", state.settings);
        const weeklyPrice = state.settings && state.settings.sub_weekly_price ? state.settings.sub_weekly_price : 499;

        mainContent.innerHTML = `

        <section id="home" class="hero">
                <div class="hero-bg">
                    <img src="assets/home-bg.jpg?v=999" alt="Premium Fruits Market" class="hero-image" />
                    <div class="overlay"></div>
                </div>
                <div class="hero-content container">
                    <div style="display: flex; gap: 1rem; align-items: center; justify-content: center; margin-bottom: 1rem; flex-wrap: wrap;">
                        <span class="badge" style="background:linear-gradient(45deg, #FFD700, #FFA500); color:black; font-weight:800; box-shadow:0 0 15px rgba(255, 215, 0, 0.6);">⚡ 12 Minute Express Delivery</span>
                        <span class="badge" style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(5px);">🚚 Free Delivery > ₹199</span>
                        <span class="badge" style="background: #D32F2F; color: white;">🔥 Flat 5% OFF vs Market</span>
                    </div>
                    <h1>Taste the <br/><span class="text-gradient">Luxury of Nature</span></h1>
                    <p>Hand-picked exotic fruits delivered to your doorstep. Experience the vibrant flavors of the tropics.</p>
                    <div class="hero-buttons">
                        <a href="#fruits-section" class="btn btn-primary" onclick="window.location.hash=''; setTimeout(()=>document.getElementById('fruits-section').scrollIntoView(), 100)">Shop Fruits</a>
                        <a href="#vegetables-section" class="btn btn-outline" onclick="window.location.hash=''; setTimeout(()=>document.getElementById('vegetables-section').scrollIntoView(), 100)">Shop Veggies</a>
                        <button class="btn btn-outline" style="border: 1px solid #10b981; color: #10b981;" onclick="openFreshnessModal()">📷 AI Freshness</button>
                    </div>
                </div>
                </div>
            </section>

            <!-- INJECTED BANNERS SECTION FOR DYNAMIC RENDER -->
            <section class="banners-section container" style="margin-top: 2rem; margin-bottom: 2rem;">
              <!-- COUPON BANNER -->
              <a href="javascript:applyCoupon('WELCOME50')" class="offer-banner b4"
                  style="background: linear-gradient(135deg, #ec4899, #be123c); opacity: 1; text-decoration: none; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 50; border-radius: 20px; padding: 2rem; box-shadow: 0 10px 30px rgba(236, 72, 153, 0.3); min-width: 280px; min-height: 200px; color: white; margin-bottom: 1.5rem; width: 100%;">
                  <div class="banner-badge"
                    style="background: #e11d48; position: absolute; top: 20px; right: 20px; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
                    Special</div>
                  <div class="banner-content">
                    <h3 style="color: white; font-size: 1.8rem; margin: 0 0 10px 0; font-family: var(--font-heading);">First
                      Order?</h3>
                    <p style="color: rgba(255,255,255,0.9); margin: 0 0 15px 0;">Get ₹50 OFF Instantly</p>
                    <div
                      style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 8px; font-family: monospace; display: inline-block; margin-bottom: 15px;">
                      Code: WELCOME50</div>
                    <div class="btn btn-outline"
                      style="border: 1px solid white; color: white; padding: 8px 20px; display: inline-block; border-radius: 50px; font-weight: 600; text-transform: uppercase; font-size: 0.9rem;">
                      CLAIM NOW</div>
                  </div>
              </a>

              <div class="banners-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; overflow: visible;">
                
                <!-- Box 1 -->
                <div class="offer-banner b1 reveal" style="width: 100%; min-width: 0;">
                  <div class="banner-badge">Trending</div>
                  <div class="banner-content">
                    <h3>Exotic Mangoes</h3>
                    <p>Direct from Ratnagiri farms</p>
                    <button class="btn btn-outline" style="border-color:white; color:white; padding:8px 20px; border-radius:50px; text-transform:uppercase; font-size:0.85rem; font-weight:600;" onclick="filterProducts('mango')">EXPLORE</button>
                  </div>
                </div>

                <!-- Box 2 -->
                <div class="offer-banner b2 reveal" style="width: 100%; min-width: 0;">
                  <div class="banner-badge">Offer</div>
                  <div class="banner-content">
                    <h3>Weekend Sale</h3>
                    <p>Extra <span id="weekend-discount-display-app">5</span>% OFF on Seasonal Boxes</p>
                    <p style="font-size: 0.75rem; opacity: 0.8; margin-top: 5px;">(Sunday Only)</p>
                    <button class="btn btn-outline" style="border-color:white; color:white; padding:8px 20px; border-radius:50px; text-transform:uppercase; font-size:0.85rem; font-weight:600;" onclick="renderSalePage()">CLAIM NOW</button>
                  </div>
                </div>

                <!-- Box 3 -->
                <div class="offer-banner b3 reveal" style="width: 100%; min-width: 0;">
                  <div class="banner-badge">New Arrival</div>
                  <div class="banner-content">
                    <h3>Dragon Fruit</h3>
                    <p>Rich in Vitamin C & Fiber</p>
                    <button class="btn btn-outline" style="border-color:white; color:white; padding:8px 20px; border-radius:50px; text-transform:uppercase; font-size:0.85rem; font-weight:600;" onclick="window.location.hash='#product/102'">BUY NOW</button>
                  </div>
                </div>

              </div>
            </section>

            <!-- SUBSCRIPTION TEASER -->
            <section class="container" style="margin-top: 4rem; margin-bottom: 2rem;">
                <div class="reveal" style="background: linear-gradient(135deg,rgba(20, 20, 20, 0.8), rgba(30,30,30,0.8)); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 3rem; text-align: center; position: relative; overflow: hidden;">
                    <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: radial-gradient(circle at 50% 50%, rgba(217, 70, 239, 0.1), transparent 70%); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 2;">
                        <span style="background: #d946ef; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 1rem;">New Feature</span>
                        <h2 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 1rem;">Subscribe & Save 📦</h2>
                        <p style="color: #ccc; font-size: 1.2rem; max-width: 600px; margin: 0 auto 2rem;">Get your daily essentials or weekly fruit boxes delivered automatically. <br>Starting at just <span style="color: #fbbf24;">₹${weeklyPrice}/week</span>.</p>
                        <a href="#subscriptions" onclick="window.location.hash='#subscriptions'" class="btn btn-primary" style="background: #d946ef; border-color: #d946ef;">View Plans</a>
                    </div>
                </div>
            </section>

            <!-- RECOMMENDATIONS SECTION -->
            <section id="recommendations-section" class="container" style="margin-top: 4rem; display:none;">
                <div class="category-header reveal" style="margin-bottom: 2rem;">
                    <h2 style="font-size: 2rem; color: #d946ef;">Recommended For You ✨</h2>
                </div>
                <div id="rec-grid" class="product-grid"></div>
            </section>

            <section id="fruits-section" class="products container" style="padding-top: 4rem;">
                <div class="category-header reveal" style="margin-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
                    <h2 style="font-size: 2.5rem; color: var(--primary-color);">Fruits 🍎</h2>
                </div>

                <!-- Dragon Fruit Sub-Category -->
                <div class="subcategory reveal" style="margin-bottom: 4rem;">
                    <h3 style="font-size: 1.8rem; margin-bottom: 1.5rem; color: #FF1493;">Dragon Fruits (Exotic) 🐉</h3>
                    <div class="product-grid">
                        ${renderProductGrid(dragonFruits)}
                    </div>
                </div>

                <!-- Normal Fruit Sub-Category -->
                <div class="subcategory reveal">
                    <h3 style="font-size: 1.8rem; margin-bottom: 1.5rem; color: #FFA500;">Fresh Fruits 🍊</h3>
                    <div class="product-grid">
                        ${renderProductGrid(normalFruits)}
                    </div>
                </div>
            </section>


        <section id="vegetables-section" class="products container" style="padding-top: 4rem; padding-bottom: 4rem;">
            <div class="category-header reveal" style="margin-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
                <h2 style="font-size: 2.5rem; color: var(--secondary-color);">Vegetables 🥦</h2>
            </div>

            <div class="product-grid">
                ${renderProductGrid(vegetables)}
            </div>
        </section>
    `;
        setTimeout(loadRecommendations, 1000);
    }

    // Helper to determine unit
    function getPriceUnit(product) {
        const name = product.name.toLowerCase();
        if (name.includes('banana')) return 'Dozen';
        if (name.includes('kiwi') || name.includes('lemon') || name.includes('coconut')) return 'Pc';
        if (name.includes('strawberry')) return 'Box';
        return 'Kg'; // Default
    }

    // Helper to render just the grid string
    function renderProductGrid(products) {
        if (products.length === 0) return '<p style="text-align: center; grid-column: 1/-1; padding: 2rem; color: var(--text-gray);">No fruits found matching your search.</p>';
        return products.map((product, index) => {
            const isWishlisted = state.wishlist.includes(product.id);
            const unit = getPriceUnit(product);
            const delay = (index % 8) * 0.1; // Stagger effect
            const inStock = product.in_stock !== false;

            // AI DYNAMIC PRICING LOGIC
            const isDynamic = product.is_dynamic || false;
            let priceBadge = '';
            let priceColor = 'var(--primary-color)';

            if (isDynamic) {
                const orig = product.original_base_price || product.price;
                if (product.price < orig) {
                    priceBadge = '<span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; margin-left: 5px;">⚡ Price Drop</span>';
                    priceColor = '#10b981';
                } else if (product.price > orig) {
                    priceBadge = '<span style="background: #e11d48; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; margin-left: 5px;">⚡ High Demand</span>';
                    priceColor = '#e11d48';
                } else {
                    priceBadge = '<span style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; margin-left: 5px;">⚡ Live Price</span>';
                }
            }

            return `
            <div class="product-card reveal ${!inStock ? 'out-of-stock' : ''}" 
                 style="transition-delay: ${delay}s; ${!inStock ? 'filter: grayscale(0.5);' : ''}" 
                 onclick="window.location.hash='#product/${product.id}'">
                
                <div class="wishlist-btn-card ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </div>

                <div class="card-image" style="position:relative;">
                    <img src="${getSmartImage(product)}" alt="${product.name}" class="product-img" />
                    <div style="position:absolute; bottom:5px; left:5px;">${priceBadge}</div>
                    <span class="card-badge">${product.rating} ★</span>
                    ${!inStock ? `
                        <div style="position: absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:900; font-size:1.1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.8);">
                            OUT OF STOCK
                        </div>
                    ` : ''}
                </div>

            <div class="card-info">
                    <h3>${product.name}</h3>
                    <p class="price" style="font-size: 1.25rem; font-weight: bold; color: ${priceColor}; margin: 0.5rem 0 1rem 0;">
                        ${product.originalPrice ? `
                            <span style="font-size: 0.95rem; color: #888; text-decoration: line-through; margin-right: 0.5rem;">₹${product.originalPrice}</span>
                        ` : ''}
                        ₹${product.price} <span style="font-size: 0.9rem; font-weight: normal; color: var(--text-gray);">/ ${unit}</span>
                        ${product.originalPrice && !isDynamic ? `
                            <span style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem; font-weight: 600;">
                                ${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </span>
                        ` : ''}
                    </p>

                    ${inStock ? `
                    <div class="qty-selector" onclick="event.stopPropagation()">
                        <button class="qty-btn" onclick="changeQty(${product.id}, -1)">-</button>
                        <input type="number" class="qty-input" id="qty-${product.id}" value="1" min="0.1" step="0.1" onclick="event.stopPropagation()">
                        <button class="qty-btn" onclick="changeQty(${product.id}, 1)">+</button>
                    </div>
                    ` : ''}

                    <button class="btn-add" 
                        ${!inStock ? 'style="background:#4b5563; cursor:not-allowed;" disabled' : ''} 
                        onclick="event.stopPropagation(); ${inStock ? `addToCart(${product.id}, ${product.price})` : ''}">
                        ${inStock ? 'Add to Cart' : 'Unavailable'}
                    </button>
                    ${product.category === 'Seasonal' ? '<span class="season-tag">Seasonal</span>' : ''}
                </div>
            </div >
        `}).join('');
    }

    window.changeQty = function (id, delta) {
        const input = document.getElementById(`qty-${id}`);
        if (input) {
            let val = parseInt(input.value) + delta;
            if (val < 1) val = 1;
            input.value = val;
        }
    }

    // Global filter function
    window.handleSearch = function (query) {
        const suggestions = document.getElementById('search-suggestions');
        if (!query || query.length < 1) {
            suggestions.classList.add('hidden');
            return;
        }

        const term = query.toLowerCase();
        const matches = state.products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
        ).slice(0, 8); // Limit to 8 suggestions

        if (matches.length === 0) {
            suggestions.innerHTML = '<div style="padding:15px; color:#64748b; font-size:0.9rem;">No matches found</div>';
        } else {
            suggestions.innerHTML = matches.map(p => `
                <div class="suggestion-item" onclick="window.goToProduct(${p.id})">
                    <img src="${getSmartImage(p)}" alt="${p.name}">
                    <div>
                        <div class="name">${p.name}</div>
                        <div class="cat">${p.category}</div>
                    </div>
                </div>
            `).join('');
        }
        suggestions.classList.remove('hidden');
    }

    // Helper to navigate to product and close search
    window.goToProduct = function (id) {
        document.getElementById('search-suggestions').classList.add('hidden');
        window.location.hash = `#product/${id}`;
    }

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        const suggestions = document.getElementById('search-suggestions');
        const input = document.getElementById('search-input');
        if (suggestions && !suggestions.contains(e.target) && e.target !== input) {
            suggestions.classList.add('hidden');
        }
    });

    // Global filter function for full search results
    window.filterProducts = function (query) {
        try {
            let targetMain = document.getElementById('app-main');
            if (!targetMain) {
                console.warn("Main ID not found, falling back to tag selector");
                targetMain = document.querySelector('main');
            }
            if (!targetMain) {
                targetMain = document.body; // Absolute fallback
            }

            if (!query) {
                router();
                return;
            }

            const term = query.toLowerCase();
            const filtered = state.products.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));

            targetMain.innerHTML = `
                <div class="container" style="padding-top: 8rem; padding-bottom: 4rem;">
                    <h1 style="font-family: var(--font-serif); margin-bottom: 2rem;">Search Results for "<span style="color: var(--primary-color);">${query}</span>"</h1>
                    <div class="product-grid">
                        ${renderProductGrid(filtered)}
                    </div>
                </div >
        `;
        } catch (e) {
            console.error("Search Error:", e);
        }
    }

    window.toggleWishlist = function (id) {
        const index = state.wishlist.indexOf(id);
        if (index === -1) {
            state.wishlist.push(id);
        } else {
            state.wishlist.splice(index, 1);
        }

        // Re-render current view if it depends on wishlist state
        if (window.location.hash === '#wishlist') {
            renderWishlist();
        } else {
            // If on home, we can just update the specific button class to avoid full re-render flickering
            // But simpler to just re-render grid for consistency if we wanted, 
            // but to be performant let's just toggle class if found:
            const btn = document.querySelector(`.product - card[onclick *= "${id}"].wishlist - btn - card`);
            if (btn) btn.classList.toggle('active');
        }
    }

    async function renderProductDetails(product) {
        logActivity({ type: 'view_product', details: product.name });
        const mainContent = document.getElementById('app-main');
        if (!mainContent) return;

        // Fetch ratings for this product
        let reviews = [];
        try {
            const res = await fetch(`${API_BASE}/api/ratings`);
            const allRatings = await res.json();
            reviews = allRatings.filter(r => r.product_id == product.name).reverse();
        } catch (e) { console.error("Ratings fetch failed", e); }

        mainContent.innerHTML = `
        <div class="container pdp-container" style="padding-top: 8rem; padding-bottom: 4rem;">
                <button class="btn" onclick="history.back()" style="margin-bottom: 2rem; color: var(--text-gray);">← Back to Collection</button>
                <div class="pdp-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start;">
                    <div class="pdp-image" style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 20px; text-align: center;">
                        <img src="${getSmartImage(product)}" alt="${product.name}" style="width: 100%; height: 400px; object-fit: contain; border-radius: 12px;" />
                    </div>
                    <div class="pdp-info">
                        <span class="badge" style="margin-bottom: 1rem;">${product.category}</span>
                        <h1 style="font-size: 3rem; margin-bottom: 1rem; font-family: var(--font-serif);">${product.name}</h1>
                        <p class="price" style="font-size: 2rem; margin-bottom: 2rem;">
                            ${product.originalPrice ? `
                                <span style="font-size: 1.5rem; color: #888; text-decoration: line-through; margin-right: 1rem;">₹${product.originalPrice}</span>
                            ` : ''}
                            ₹${product.price} <span style="font-size: 1rem; color: var(--text-gray);">/ ${getPriceUnit(product)}</span>
                            ${product.originalPrice ? `
                                <span style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 6px 14px; border-radius: 6px; font-size: 1rem; margin-left: 1rem; font-weight: 600;">
                                    ${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                </span>
                            ` : ''}
                        </p>
                        
                        <div class="pdp-description" style="margin-bottom: 2rem; color: var(--text-gray); font-size: 1.1rem;">
                            <p>${product.description || 'Premium quality, hand-picked for you.'}</p>
                        </div>

                        <div class="pdp-actions" style="display: flex; gap: 1rem; align-items: center;">
                            ${product.in_stock !== false ? `
                            <div class="qty-selector" style="margin-bottom:0; flex: 0.4;">
                                <button class="qty-btn" onclick="changeQty(${product.id}, -1)">-</button>
                                <input type="number" class="qty-input" id="qty-${product.id}" value="1" min="0.1" step="0.1">
                                <button class="qty-btn" onclick="changeQty(${product.id}, 1)">+</button>
                            </div>
                            ` : ''}
                            <button class="btn btn-primary" 
                                ${product.in_stock === false ? 'style="background:#4b5563; cursor:not-allowed;" disabled' : ''} 
                                onclick="${product.in_stock === false ? '' : `addToCart(${product.id})`}" 
                                style="flex: 1; padding: 1rem;">
                                ${product.in_stock === false ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>
                        
                        <div class="pdp-specs" style="margin-top: 3rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Global Rating</span>
                                <span style="color:#fbbf24;">${product.rating} ★★★★★</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Delivery</span>
                                <span>Fast (2-4 Days)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reviews Section -->
                <div style="margin-top: 5rem;" class="reveals">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <h2 style="font-family: var(--font-serif); font-size: 2rem;">Customer Reviews (${reviews.length})</h2>
                        ${state.user.name ? `<button class="btn btn-outline" onclick="openRatingModal('${product.name.replace(/'/g, "\\'")}')">Write a Review</button>` : ''}
                    </div>

                    ${reviews.length === 0 ? `
                        <div style="background: rgba(255,255,255,0.03); padding: 3rem; border-radius: 20px; text-align: center; color: var(--text-gray);">
                            <p>No reviews yet for this product. Be the first to rate!</p>
                            ${!state.user.name ? `<button class="btn btn-primary" style="margin-top: 1rem;" onclick="loginUser()">Login to Review</button>` : ''}
                        </div>
                    ` : `
                        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                            ${reviews.map(r => `
                                <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <div style="width: 35px; height: 35px; border-radius: 50%; background: var(--primary-color); display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000;">
                                                ${r.user ? r.user.charAt(0) : 'U'}
                                            </div>
                                            <strong>${r.user || 'Verified Buyer'}</strong>
                                        </div>
                                        <span style="color: #fbbf24; font-size: 1.2rem;">${'★'.repeat(r.rating)}</span>
                                    </div>
                                    <p style="color: var(--text-gray); font-size: 0.95rem; margin-top: 0.5rem;">Freshness and quality was better than expected. Highly recommended!</p>
                                    <div style="color: #64748b; font-size: 0.8rem; margin-top: 1rem;">${r.time}</div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;

        if (window.innerWidth < 768) {
            const grid = document.querySelector('.pdp-grid');
            if (grid) grid.style.gridTemplateColumns = '1fr';
        }
        initAnimations();

        // Load AI Recommendations for this product
        loadSmartRecommendations(product);
    }

    // --- AI-BASED SMART RECOMMENDATION SYSTEM ---

    // Collaborative Filtering Engine
    const RecommendationEngine = {
        // Calculate similarity between two products based on co-purchase patterns
        calculateSimilarity(productA, productB, purchaseHistory) {
            let coOccurrence = 0;
            let productACount = 0;
            let productBCount = 0;

            purchaseHistory.forEach(order => {
                const hasA = order.items && order.items.includes(productA.name);
                const hasB = order.items && order.items.includes(productB.name);

                if (hasA) productACount++;
                if (hasB) productBCount++;
                if (hasA && hasB) coOccurrence++;
            });

            // Jaccard similarity coefficient
            if (productACount === 0 || productBCount === 0) return 0;
            return coOccurrence / (productACount + productBCount - coOccurrence);
        },

        // Get frequently bought together items
        getFrequentlyBoughtTogether(product, allProducts, purchaseHistory, limit = 3) {
            const similarities = allProducts
                .filter(p => p.id !== product.id && p.in_stock !== false)
                .map(p => ({
                    product: p,
                    score: this.calculateSimilarity(product, p, purchaseHistory)
                }))
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);

            return similarities;
        },

        // Get personalized recommendations based on user's purchase history
        getPersonalizedRecommendations(userHistory, allProducts, limit = 6) {
            if (!userHistory || userHistory.length === 0) {
                // Return trending/popular products for new users
                return allProducts
                    .filter(p => p.in_stock !== false && p.rating >= 4.5)
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, limit);
            }

            // Get all products user has purchased
            const purchasedNames = new Set();
            userHistory.forEach(order => {
                if (order.fullItems) {
                    order.fullItems.forEach(item => purchasedNames.add(item.name));
                }
            });

            // Calculate scores for products user hasn't bought
            const scores = {};
            allProducts.forEach(product => {
                if (purchasedNames.has(product.name) || product.in_stock === false) return;

                let score = 0;
                // Category match bonus
                userHistory.forEach(order => {
                    if (order.fullItems) {
                        order.fullItems.forEach(item => {
                            if (item.category === product.category) score += 2;
                            if (item.subCategory === product.subCategory) score += 3;
                            // Price range similarity
                            if (Math.abs(item.price - product.price) < 50) score += 1;
                        });
                    }
                });

                // Rating bonus
                score += product.rating || 0;

                scores[product.id] = score;
            });

            return allProducts
                .filter(p => scores[p.id] > 0)
                .sort((a, b) => scores[b.id] - scores[a.id])
                .slice(0, limit);
        }
    };

    // Load and display smart recommendations
    async function loadSmartRecommendations(currentProduct) {
        try {
            // Get all purchase history from server
            let allOrders = [];
            try {
                const res = await fetch(`${API_BASE}/api/all-orders`);
                allOrders = await res.json();
            } catch (e) {
                console.log('Using fallback recommendation data');
                allOrders = [];
            }

            // Get user's personal history
            let userOrders = [];
            if (state.user.phone) {
                try {
                    const userRes = await fetch(`${API_BASE}/api/orders?phone=${state.user.phone}`);
                    userOrders = await userRes.json();
                } catch (e) {
                    const localKey = `orderHistory_${state.user.phone}`;
                    const cached = localStorage.getItem(localKey);
                    if (cached) userOrders = JSON.parse(cached);
                }
            }

            // Calculate Frequently Bought Together
            let frequentlyBought = RecommendationEngine.getFrequentlyBoughtTogether(
                currentProduct,
                state.products,
                allOrders,
                3
            );

            // Fallback: If no collaborative filtering results, use category-based recommendations
            if (frequentlyBought.length === 0) {
                frequentlyBought = state.products
                    .filter(p =>
                        p.id !== currentProduct.id &&
                        p.in_stock !== false &&
                        (p.category === currentProduct.category || p.subCategory === currentProduct.subCategory)
                    )
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3)
                    .map(p => ({ product: p, score: 0.75 })); // Simulated 75% match
            }

            // Get personalized recommendations
            let personalizedRecs = RecommendationEngine.getPersonalizedRecommendations(
                userOrders,
                state.products,
                6
            );

            // Ensure we always have recommendations
            if (personalizedRecs.length === 0) {
                personalizedRecs = state.products
                    .filter(p => p.in_stock !== false && p.id !== currentProduct.id)
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 6);
            }

            // Render Frequently Bought Together section
            if (frequentlyBought.length > 0) {
                const fbtSection = document.createElement('div');
                fbtSection.className = 'recommendation-section reveal';
                fbtSection.style.cssText = 'margin-top: 5rem;';
                fbtSection.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <h2 style="font-family: var(--font-serif); font-size: 2rem;">
                            <span style="color: #d946ef;">🤖 AI Suggests:</span> Frequently Bought Together
                        </h2>
                        <span style="background: linear-gradient(135deg, #d946ef, #a855f7); padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                            ${Math.round(frequentlyBought[0].score * 100)}% Match
                        </span>
                    </div>
                    <div style="background: linear-gradient(135deg, rgba(217, 70, 239, 0.1), rgba(168, 85, 247, 0.05)); padding: 2rem; border-radius: 20px; border: 1px solid rgba(217, 70, 239, 0.2);">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                            ${frequentlyBought.map(item => `
                                <div class="fbt-card" style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 16px; text-align: center; cursor: pointer; transition: transform 0.3s;" onclick="window.location.hash='#product/${item.product.id}'">
                                    <img src="${getSmartImage(item.product)}" alt="${item.product.name}" style="width: 100%; height: 150px; object-fit: contain; margin-bottom: 1rem; border-radius: 12px;">
                                    <h4 style="font-size: 1rem; margin-bottom: 0.5rem;">${item.product.name}</h4>
                                    <p style="color: var(--primary-color); font-weight: bold; font-size: 1.2rem;">₹${item.product.price}</p>
                                    <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #a855f7;">
                                        ${Math.round(item.score * 100)}% buy together
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="margin-top: 2rem; text-align: center;">
                            <button class="btn btn-primary" style="background: linear-gradient(135deg, #d946ef, #a855f7); border: none;" onclick="addBundleToCart([${currentProduct.id}, ${frequentlyBought.map(i => i.product.id).join(', ')}])">
                                🛒 Add All to Cart (Save ₹${Math.round(frequentlyBought.reduce((sum, i) => sum + ((i.product.originalPrice || i.product.price) - i.product.price), 0))})
                            </button>
                        </div>
                    </div>
                `;

                const pdpContainer = document.querySelector('.pdp-container');
                if (pdpContainer) pdpContainer.appendChild(fbtSection);
            }

            // Render Personalized Recommendations
            if (personalizedRecs.length > 0) {
                const recSection = document.createElement('div');
                recSection.className = 'recommendation-section reveal';
                recSection.style.cssText = 'margin-top: 4rem;';
                recSection.innerHTML = `
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; margin-bottom: 2rem;">
                        ${state.user.name ? `<span style="color: #10b981;">✨ Recommended For You</span>` : '<span style="color: #fbbf24;">🔥 Trending Now</span>'}
                    </h2>
                    <div class="product-grid">
                        ${renderProductGrid(personalizedRecs)}
                    </div>
                `;

                const pdpContainer = document.querySelector('.pdp-container');
                if (pdpContainer) pdpContainer.appendChild(recSection);
            }

            initAnimations();

        } catch (e) {
            console.error('Recommendation engine error:', e);
        }
    }

    // Add bundle to cart
    window.addBundleToCart = function (productIds) {
        productIds.forEach(id => {
            const product = state.products.find(p => p.id === id);
            if (product && product.in_stock !== false) {
                const existingItem = state.cart.find(item => item.id === id);
                if (existingItem) {
                    existingItem.qty = (existingItem.qty || 1) + 1;
                } else {
                    state.cart.push({ ...product, qty: 1 });
                }
            }
        });

        updateCartUI();
        showToast(`Added ${productIds.length} items to cart! 🎉`, "✅");
    }


    // --- Core Logic ---

    // --- PAYMENT GATEWAY INTEGRATION ---
    window.openPaymentGateway = function (amount, onSuccess) {
        // Razorpay Options
        var options = {
            "key": "rzp_test_1DP5mmOlF5G5ag", // Enter the Key ID generated from the Dashboard
            "amount": amount * 100, // Amount is in currency subunits. 
            "currency": "INR",
            "name": "Ajay Fruit Mart",
            "description": "Fresh Fruits Order",
            "image": "https://cdn-icons-png.flaticon.com/512/3081/3081840.png", // Logo
            "handler": function (response) {
                // On Success
                console.log("Payment ID: " + response.razorpay_payment_id);
                // In a real app, you would verify signature here
                if (onSuccess) onSuccess(response.razorpay_payment_id);
            },
            "prefill": {
                "name": state.user.name || "",
                "email": state.user.email || "",
                "contact": state.user.phone || ""
            },
            "notes": {
                "address": state.user.address || ""
            },
            "theme": {
                "color": "#d946ef"
            },
            "modal": {
                "ondismiss": function () {
                    showToast("Payment Cancelled", "❌");
                }
            }
        };

        // Check if SDK loaded, if not, try to load it dynamically
        if (typeof Razorpay === 'undefined') {
            const script = document.createElement('script');
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                try {
                    var rzp1 = new Razorpay(options);
                    rzp1.on('payment.failed', function (response) { alert("Payment Failed: " + response.error.description); });
                    rzp1.open();
                } catch (e) { alert("Payment Error: " + e.message); }
            };
            script.onerror = () => {
                alert("Error: Razorpay SDK could not be loaded. Please check your internet connection.");
            };
            document.head.appendChild(script);
            return;
        }

        try {
            var rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp1.open();
        } catch (e) {
            console.error("Razorpay Error", e);
            alert("Payment Gateway Error: " + e.message);
        }
    }



    function setupEventListeners() {
        // Check Auth State for UI
        if (state.user.name) {
            setTimeout(() => {
                const loginBtn = document.getElementById('login-btn');
                if (loginBtn) loginBtn.style.display = 'none';
            }, 500); // Small delay to ensure DOM is ready
        }

        // Mobile Menu
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileBtn.classList.toggle('open');
            });
        }

        // Cart Button
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                window.location.hash = '#cart';
            });
        }

        window.addEventListener('resize', () => {
            // Re-render if necessary or handle CSS media queries
        });

        // Scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                header.style.background = 'rgba(15, 23, 42, 0.95)';
            } else {
                header.classList.remove('scrolled');
                header.style.background = 'rgba(15, 23, 42, 0.7)';
            }
        });
    }

    setupEventListeners();



    // --- RECOMMENDATION LOGIC ---
    async function loadRecommendations() {
        try {
            const res = await fetch(`${API_BASE}/api/recommendations`);
            const data = await res.json();
            if (data.success) {
                const recSection = document.getElementById('recommendations-section');
                const recGrid = document.getElementById('rec-grid');
                if (recSection && recGrid) {
                    recSection.style.display = 'block';
                    recGrid.innerHTML = renderProductGrid(data.foryou);
                }
            }
        } catch (e) { console.error("Rec Error", e); }
    }

    // --- SUBSCRIPTION LOGIC ---
    // --- SUBSCRIPTION LOGIC ---
    window.renderSubscriptionPage = async function () {
        const mainContent = document.getElementById('app-main');
        if (!mainContent) return;

        // Fetch Settings for Prices
        let weeklyPrice = 499;
        let dailyPrice = 1999;
        try {
            const res = await fetch(`${API_BASE}/api/settings`);
            const data = await res.json();
            if (data.sub_weekly_price) weeklyPrice = data.sub_weekly_price;
            if (data.sub_daily_price) dailyPrice = data.sub_daily_price;
        } catch (e) { console.log('Using default prices'); }

        mainContent.innerHTML = `
            <div class="container" style="padding-top: 8rem; padding-bottom: 4rem;">
                <h1 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 2rem; text-align: center;">Fruit Box Subscriptions 📦</h1>
                <p style="text-align: center; color: var(--text-gray); margin-bottom: 3rem;">Get fresh fruits delivered automatically to your doorstep.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                    <!-- Plan 1 -->
                    <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Weekly Wellness Box</h3>
                        <p style="color: #ccc; margin-bottom: 1.5rem;">7 varieties of seasonal fruits delivered every Monday.</p>
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary-color); margin-bottom: 1rem;">₹${weeklyPrice}<span style="font-size: 1rem; color: gray;">/week</span></div>
                        <ul style="text-align: left; margin-bottom: 2rem; color: #aaa; list-style: none;">
                            <li>✅ Free Delivery</li>
                            <li>✅ 10% Cheaper than retail</li>
                            <li>✅ Cancel Anytime</li>
                        </ul>
                        <button class="btn btn-primary" style="width: 100%;" onclick="subscribeToPlan('Weekly-Box', ${weeklyPrice})">Subscribe Now</button>
                    </div>

                    <!-- Plan 2 -->
                    <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05)); padding: 2rem; border-radius: 20px; border: 1px solid #10b981; text-align: center; position: relative;">
                        <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #10b981; color: black; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 0.8rem;">BEST VALUE</div>
                        <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Daily Essentials</h3>
                        <p style="color: #ccc; margin-bottom: 1.5rem;">Milk, Apples & Bananas delivered every morning.</p>
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary-color); margin-bottom: 1rem;">₹${dailyPrice}<span style="font-size: 1rem; color: gray;">/month</span></div>
                        <ul style="text-align: left; margin-bottom: 2rem; color: #aaa; list-style: none;">
                            <li>✅ Morning 7 AM Delivery</li>
                            <li>✅ Freshness Guarantee</li>
                            <li>✅ Pause anytime for vacations</li>
                        </ul>
                        <button class="btn btn-primary" style="width: 100%;" onclick="subscribeToPlan('Daily-Essentials', ${dailyPrice})">Subscribe Now</button>
                    </div>
                </div>
            </div>
        `;
    }

    window.subscribeToPlan = async function (plan, price) {
        if (!state.user.name) {
            alert("Please login to subscribe!");
            return;
        }
        if (!confirm(`Confirm subscription to ${plan} for ₹${price}?`)) return;

        try {
            const res = await fetch(`${API_BASE}/api/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: state.user.name, plan, price })
            });
            const data = await res.json();
            if (data.success) {
                showToast(`Subscribed! ID: ${data.sub_id}`, "🎉");
            }
        } catch (e) { console.error(e); }
    }

    // Hook into Router for Recommendations & Subscription Page
    const originalRouter = router; // preserving scope issue if any, but router is hoisting
    // We already have 'router' defined in scope usually. 
    // Let's modify renderHome to call loadRecommendations

    router(); // Load initial route with new logic potentially if we modified renderHome


    // --- AI CHAT LOGIC ---
    window.toggleAIChat = function () {
        const windowEl = document.getElementById('ai-chat-window');
        if (windowEl) windowEl.classList.toggle('active');
        if (windowEl && windowEl.classList.contains('active')) {
            setTimeout(() => document.getElementById('chat-input').focus(), 400);
        }
    };

    function scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.scrollTo({
                top: messagesContainer.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    window.aiQuickQuery = function (text) {
        const input = document.getElementById('chat-input');
        if (input) {
            input.value = text;
            window.sendAIMessage();
        }
    };

    window.sendAIMessage = async function (e, retryCount = 0) {
        if (e) e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input ? input.value.trim() : '';
        if (!text) return;

        // Add user message to UI only on first attempt
        if (retryCount === 0) {
            const messagesContainer = document.getElementById('chat-messages');
            const userMsg = document.createElement('div');
            userMsg.className = 'message user';
            userMsg.textContent = text;
            messagesContainer.appendChild(userMsg);
            if (input) input.value = '';
            scrollToBottom();
        }

        // Show typing indicator
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.style.display = 'block';
        scrollToBottom();

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

            const res = await fetch(`${API_BASE}/api/ai-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) throw new Error(`Server Error: ${res.status}`);

            const data = await res.json();

            // Hide typing indicator
            if (typing) typing.style.display = 'none';

            // Add AI response to UI
            const messagesContainer = document.getElementById('chat-messages');
            const aiMsg = document.createElement('div');
            aiMsg.className = 'message ai';
            aiMsg.textContent = data.response || "Sorry, I'm a bit overwhelmed with fruits right now! 🍎";
            messagesContainer.appendChild(aiMsg);
            scrollToBottom();

        } catch (err) {
            console.error(err);
            if (typing) typing.style.display = 'none';

            // Retry logic (up to 1 time) for network errors
            if (retryCount < 1 && (err.name === 'TypeError' || err.message.includes('Failed to fetch'))) {
                console.log("Retrying AI request...");
                setTimeout(() => window.sendAIMessage(null, retryCount + 1), 1000);
                return;
            }

            const messagesContainer = document.getElementById('chat-messages');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'message ai error';
            errorMsg.style.color = '#ef4444';
            errorMsg.innerHTML = `⚠️ <b>Connection Failed</b><br><span style="font-size:0.8em">Make sure the server is running (run_shop.bat).<br>Error: ${err.message}</span>`;
            messagesContainer.appendChild(errorMsg);
            scrollToBottom();
        }
    };

    // Check Server Connection
    fetch(`${API_BASE}/api/health`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log("Server Health:", data.message);
                const statusDot = document.querySelector('.chat-header .status');
                if (statusDot) {
                    statusDot.innerHTML = 'Online';
                    statusDot.style.color = '#4ade80';
                }
            }
        })
        .catch(err => {
            console.error("AI Server Error:", err);
            const statusDot = document.querySelector('.chat-header .status');
            if (statusDot) {
                statusDot.innerHTML = 'Offline (Check Server)';
                statusDot.style.color = '#ef4444';
            }
        });

});
