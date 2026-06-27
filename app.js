

let API_BASE = localStorage.getItem('admin_api_base');
if (!API_BASE) {
    API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') ? 'http://127.0.0.1:5000' : '';
}

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
        user: {},
        deliveryType: 'DELIVERY'
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
        const loginMobile = document.querySelector('.login-mobile');
        if (loginMobile) loginMobile.style.display = 'none';

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
                                        onclick="${isSunday ? `addToCart('${p.id}', ${p.price})` : `alert('This sale price is only applicable on Sunday!')`}">
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
            const id = hash.split('/')[1];
            const product = state.products.find(p => String(p.id) === String(id));
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
        const upiID = "roy349647@oksbi";
        const name = "Ashish Roy";
        const upiLink = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&aid=uGICAgMD-ma3QIA`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
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
                                        <button onclick="updateCartItemQty('${item.id}', -0.1)" style="color: white; font-weight: bold; background: none; border: none; cursor: pointer;">-</button>
                                        <span style="font-weight: bold; min-width: 40px; text-align: center;">${item.qty || 1} ${getPriceUnit(item) === 'Kg' ? 'kg' : ''}</span>
                                        <button onclick="updateCartItemQty('${item.id}', 0.1)" style="color: white; font-weight: bold; background: none; border: none; cursor: pointer;">+</button>
                                    </div>
                                    <button onclick="removeAllFromCart('${item.id}')" style="color: #FF6B6B; font-weight: 500; margin-left: 10px; background: none; border: none; cursor: pointer;">Remove</button>
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
                                    <h3 style="font-family: var(--font-serif); margin-bottom: 1.5rem; color: var(--primary-color);">Order Details 🛒</h3>
                                    
                                    <!-- Order Mode Toggle -->
                                    <div class="form-group" style="margin-bottom: 1.5rem;">
                                        <label style="display: block; margin-bottom: 0.6rem; font-weight: 600; font-size: 0.95rem; color: var(--text-muted);">Choose Order Type</label>
                                        <div style="display: flex; gap: 0.8rem;">
                                            <button onclick="window.setDeliveryType('DELIVERY')" class="btn ${state.deliveryType === 'DELIVERY' ? 'btn-primary' : 'btn-outline'}" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: bold; font-size: 0.9rem; text-transform: none;">
                                                🚚 Home Delivery
                                            </button>
                                            <button onclick="window.setDeliveryType('TAKEAWAY')" class="btn ${state.deliveryType === 'TAKEAWAY' ? 'btn-primary' : 'btn-outline'}" style="flex: 1; padding: 10px; border-radius: 8px; font-weight: bold; font-size: 0.9rem; text-transform: none;">
                                                🛍️ Take Away
                                            </button>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label>Full Name</label>
                                        <input type="text" id="c-name" placeholder="Enter your name" value="${state.user.name || ''}" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label>Phone Number</label>
                                        <input type="tel" id="c-phone" placeholder="+91 98765 43210" value="${state.user.phone || ''}" readonly>
                                    </div>

                                    ${state.deliveryType === 'TAKEAWAY' ? `
                                        <div style="background: rgba(255,255,255,0.05); padding: 1.2rem; border-radius: 12px; border: 1px dashed var(--primary-color); margin-bottom: 1.5rem;">
                                            <p style="margin: 0 0 0.5rem 0; font-weight: bold; color: var(--primary-color); font-size: 0.95rem;">📍 Store Self-Pickup Address:</p>
                                            <p style="margin: 0; font-size: 0.9rem; color: var(--text-light); line-height: 1.4;">
                                                Ajay Fruit Mart Store,<br>
                                                Shop No. 12, Main Bazar,<br>
                                                Near Metro Station Gate 2, Delhi
                                            </p>
                                        </div>
                                    ` : `
                                        <div class="form-group">
                                            <label>Address</label>
                                            <textarea id="c-address" rows="3" placeholder="House No, Street, Locality">${state.user.address || ''}</textarea>
                                        </div>
                                        <div class="form-group">
                                            <label>City & Pincode</label>
                                            <div style="display: flex; gap: 1rem;">
                                                <input type="text" id="c-city" placeholder="City" value="Delhi">
                                                <input type="text" id="c-pincode" placeholder="Pincode">
                                            </div>
                                        </div>
                                    `}
                                    
                                    <div class="form-group" style="margin-top: 2rem;">
                                        <h3 style="font-family: var(--font-serif); margin-bottom: 1rem; color: var(--primary-color);">Payment Method 💳</h3>
                                        
                                        <div class="payment-options-grid" style="display: grid; grid-template-columns: 1fr; gap: 0.8rem; margin-bottom: 1.5rem;">
                                            <label class="payment-option-card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease;">
                                                <input type="radio" name="payment" value="UPI" checked onchange="window.toggleQR(this.value)" style="width: 20px; height: 20px; accent-color: var(--primary-color);">
                                                <span style="font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">📱 UPI (GPay / PhonePe / Paytm)</span>
                                            </label>

                                            <label class="payment-option-card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease;">
                                                <input type="radio" name="payment" value="CARD" onchange="window.toggleQR(this.value)" style="width: 20px; height: 20px; accent-color: var(--primary-color);">
                                                <span style="font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">💳 Debit / Credit Card (Secure Gateway)</span>
                                            </label>

                                            <label class="payment-option-card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease;">
                                                <input type="radio" name="payment" value="NETBANKING" onchange="window.toggleQR(this.value)" style="width: 20px; height: 20px; accent-color: var(--primary-color);">
                                                <span style="font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">🏦 Net Banking (SBI, HDFC, ICICI, AXIS)</span>
                                            </label>

                                            <label class="payment-option-card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease;">
                                                <input type="radio" name="payment" value="WALLET" onchange="window.toggleQR(this.value)" style="width: 20px; height: 20px; accent-color: var(--primary-color);">
                                                <span style="font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">👛 Mobile Wallets & PayLater</span>
                                            </label>

                                            <label class="payment-option-card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease;">
                                                <input type="radio" name="payment" value="COD" onchange="window.toggleQR(this.value)" style="width: 20px; height: 20px; accent-color: var(--primary-color);">
                                                <span style="font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">💵 Cash on Delivery (Cash/UPI)</span>
                                            </label>
                                        </div>

                                        <!-- QR Code Container -->
                                        <div id="qr-container" style="text-align: center; margin-bottom: 1.5rem; background: white; padding: 1.2rem; border-radius: 16px; width: fit-content; margin-left: auto; margin-right: auto; display: block; border: 1px solid #ddd; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); transition: all 0.3s ease;">
                                            <p style="color: black; font-weight: bold; margin-bottom: 0.8rem; display: block; font-size: 1.1rem;">Scan to Pay: ₹${finalTotal}</p>
                                            <img src="${window.generateUPIQR(finalTotal)}" alt="Payment QR Code" style="width: 200px; height: 200px; object-fit: contain; display: block; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
                                            <div style="margin-top: 1rem; text-align: center;">
                                                <label style="display: flex; align-items: center; justify-content: center; gap: 0.6rem; cursor: pointer; color: black; font-weight: 600;">
                                                    <input type="checkbox" id="upi-payment-confirm" style="width: 20px; height: 20px; accent-color: var(--primary-color);">
                                                    <span style="font-size: 0.95rem;">I have made the payment</span>
                                                </label>
                                            </div>
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

     // Delivery type selector helper
    window.setDeliveryType = function (type) {
        state.deliveryType = type;
        renderCart();
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
        let baseDeliveryFee = 0;
        let distanceSurcharge = 0;

        if (state.deliveryType !== 'TAKEAWAY') {
            baseDeliveryFee = itemTotal >= 199 ? 0 : 40;
            if (distance > 3) {
                distanceSurcharge = Math.ceil(distance - 3) * 10;
            }
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
        const item = state.cart.find(i => String(i.id) === String(id));
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
        const product = state.products.find(p => String(p.id) === String(productId));
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
            const existingItem = state.cart.find(item => String(item.id) === String(productId));

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
            const btn = document.querySelector(`button[onclick*="${productId}"]`);
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
        state.cart = state.cart.filter(item => String(item.id) !== String(id));
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
            delivery_type: state.deliveryType || 'DELIVERY',
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
                    payment: paymentMethod,
                    deliveryType: state.deliveryType || 'DELIVERY'
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

        const isTakeAway = newOrder.delivery_type === 'TAKEAWAY';
        const mainContent = document.getElementById('app-main');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="container" style="padding-top: 8rem; text-align: center; max-width: 600px;">
                    <div style="font-size: 5rem; margin-bottom: 1rem;">🎉</div>
                    <h1 style="font-family: var(--font-serif); margin-bottom: 1.5rem;">Order Placed Successfully!</h1>
                    <p style="color: var(--text-gray); font-size: 1.2rem; margin-bottom: 2rem;">
                        Thank you <strong>${name}</strong>! Your order <strong>#${orderId}</strong> ${isTakeAway ? 'will be ready for pickup soon' : 'will be delivered soon'}.
                    </p>
                    <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 16px; margin-bottom: 2rem;">
                         <p style="margin-bottom: 0.5rem;">Total Paid: <strong style="color: var(--primary-color);">₹${totalAmount}</strong></p>
                        <p style="margin-bottom: 0.5rem;">Payment Mode: <strong>${paymentMethod}</strong></p>
                        ${isTakeAway ? `
                            <p>Order Mode: <strong style="color: var(--primary-color);">🛍️ Take Away (Self Pickup)</strong></p>
                            <p>Pickup Location: <strong>Shop No. 12, Main Bazar, Delhi</strong></p>
                        ` : `
                            <p>Order Mode: <strong>🚚 Home Delivery</strong></p>
                            <p>Delivery Agent: <strong>Ramesh (9810xxxxxx)</strong></p>
                        `}
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
        const address = state.deliveryType === 'TAKEAWAY' 
            ? "Take Away (Self Pickup)" 
            : (document.getElementById('c-address')?.value || '');
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        // Update global user
        state.user.name = name;
        state.user.phone = phone;
        if (state.deliveryType !== 'TAKEAWAY') {
            state.user.address = address;
        }
        localStorage.setItem('fruitShopUser', JSON.stringify(state.user));

        if (!name || !phone || (state.deliveryType === 'DELIVERY' && !address)) {
            alert("Please fill in all delivery details!");
            return;
        }

        const { finalTotal } = getCartTotals();

        // Payment Flow
        if (paymentMethod === 'COD') {
            finalizeOrder(name, phone, address, paymentMethod, finalTotal);
        } else if (paymentMethod === 'UPI') {
            const confirmCheck = document.getElementById('upi-payment-confirm');
            if (!confirmCheck || !confirmCheck.checked) {
                alert("Please check the 'I have made the payment' box after scanning the QR code.");
                return;
            }
            initiateVerification(name, phone, address, finalTotal);
        } else {
            // New Feature: Payment Gateway Simulation for other online methods
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


    // Remove from Cart
    window.removeFromCart = function (index) {
        const item = state.cart[index];
        state.cart.splice(index, 1);
        renderCart();
        updateCartUI();
        showToast(`Removed ${item.name}`, "🗑️");
    }

    function renderWishlist() {
        const wishlistItems = state.products.filter(p => state.wishlist.some(item => String(item) === String(p.id)));
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
                const [ordersRes, complaintsRes, userRes] = await Promise.all([
                    fetch(`${API_BASE}/api/orders?phone=${state.user.phone}`),
                    fetch(`${API_BASE}/api/complaint?phone=${state.user.phone}`),
                    fetch(`${API_BASE}/api/user?phone=${state.user.phone}`)
                ]);

                const fetchedOrders = await ordersRes.json();
                const fetchedComplaints = await complaintsRes.json();
                const userData = await userRes.json();

                if (userData.found) {
                    state.user = { ...state.user, ...userData.user };
                    localStorage.setItem('fruitShopUser', JSON.stringify(state.user));
                }

                // Trust server orders as the source of truth to avoid duplicate fake local orders
                if (Array.isArray(fetchedOrders)) {
                    userOrders = fetchedOrders;
                }
                
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

                ${state.user.name ? `
                    <div class="profile-subscription" style="margin-bottom: 2rem;">
                        ${state.user.subscription && state.user.subscription.status === 'active' ? `
                            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.02)); padding: 2rem; border-radius: 20px; border: 1px solid #10b981; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h3 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 0.5rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">📦 Active Subscription</h3>
                                    <p style="margin: 0; font-size: 1.1rem; font-weight: bold; color: white;">Plan: ${state.user.subscription.plan}</p>
                                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-gray);">Started on: ${new Date(state.user.subscription.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <button class="btn btn-outline" style="border-color: #ff4444; color: #ff4444; padding: 10px 20px;" onclick="cancelSubscription()">Cancel Subscription</button>
                                </div>
                            </div>
                        ` : `
                            <div style="background: rgba(255,255,255,0.02); padding: 1.5rem 2rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h3 style="font-family: var(--font-serif); font-size: 1.1rem; margin: 0 0 0.2rem 0; color: var(--text-gray);">📦 Subscription Box</h3>
                                    <p style="margin: 0; font-size: 0.9rem; color: var(--text-gray);">Get fresh fruits delivered weekly or daily at discount prices.</p>
                                </div>
                                <div>
                                    <a href="#subscriptions" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.9rem; background: var(--primary-color);">Explore Plans</a>
                                </div>
                            </div>
                        `}
                    </div>
                ` : ''}

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
                                        <h3 style="font-size: 1.1rem; color: var(--primary-color); margin:0;">Order #${(order.id && order.id.includes('-')) ? order.id.split('-')[1] : (order.id || 'Unknown')}</h3>
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
    // --- PAYMENT GATEWAY SIMULATION ---
    window.openPaymentGateway = function (amount, callback) {
        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'pg-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 10, 12, 0.95);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(12px);
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #f3f4f6;
        `;

        modal.innerHTML = `
            <div style="background: #18181b; width: 440px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; padding: 2rem; position: relative;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h3 style="margin: 0; font-size: 1.4rem; font-weight: 700; color: #fff;">Secure Checkout</h3>
                        <span style="font-size: 0.8rem; color: #10b981; display: flex; align-items: center; gap: 4px; margin-top: 4px;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            PCI-DSS Compliant & Secured
                        </span>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 0.8rem; color: #a1a1aa; display: block;">Total Payable</span>
                        <span style="font-size: 1.5rem; font-weight: 800; color: var(--primary-color);">₹${amount}</span>
                    </div>
                </div>

                <!-- Step 1: Payment Method Selection -->
                <div id="pg-step-select" style="display: block;">
                    <p style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 1rem;">Select your preferred payment method:</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2rem;">
                        <button onclick="window.pgSetMethod('CARD')" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: white; display: flex; align-items: center; gap: 1rem; width: 100%; padding: 1.2rem; border-radius: 16px; cursor: pointer; text-align: left; transition: all 0.2s;">
                            <span style="font-size: 1.5rem;">💳</span>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 1rem;">Credit / Debit Card</div>
                                <div style="font-size: 0.8rem; color: #71717a;">Visa, Mastercard, RuPay, Maestro</div>
                            </div>
                            <span style="color: #71717a;">&rarr;</span>
                        </button>

                        <button onclick="window.pgSetMethod('NETBANKING')" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: white; display: flex; align-items: center; gap: 1rem; width: 100%; padding: 1.2rem; border-radius: 16px; cursor: pointer; text-align: left; transition: all 0.2s;">
                            <span style="font-size: 1.5rem;">🏦</span>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 1rem;">Net Banking</div>
                                <div style="font-size: 0.8rem; color: #71717a;">All popular Indian retail banks</div>
                            </div>
                            <span style="color: #71717a;">&rarr;</span>
                        </button>

                        <button onclick="window.pgSetMethod('WALLET')" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: white; display: flex; align-items: center; gap: 1rem; width: 100%; padding: 1.2rem; border-radius: 16px; cursor: pointer; text-align: left; transition: all 0.2s;">
                            <span style="font-size: 1.5rem;">👛</span>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 1rem;">Mobile Wallets</div>
                                <div style="font-size: 0.8rem; color: #71717a;">PhonePe, AmazonPay, Freecharge</div>
                            </div>
                            <span style="color: #71717a;">&rarr;</span>
                        </button>
                    </div>

                    <button onclick="document.getElementById('pg-modal').remove();" style="width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #a1a1aa; padding: 1rem; border-radius: 12px; font-weight: bold; cursor: pointer; transition: all 0.2s;">Cancel Payment</button>
                </div>

                <!-- Step 2a: Card Entry Details -->
                <div id="pg-step-card" style="display: none;">
                    <button onclick="window.pgGoBack()" style="background: none; border: none; color: #a1a1aa; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; padding: 0; font-size: 0.9rem;">
                        &larr; Back to options
                    </button>
                    <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #a1a1aa; margin-bottom: 0.4rem;">Card Number</label>
                            <input type="text" id="pg-card-number" placeholder="4532 7182 9381 2309" maxlength="19" oninput="window.formatCardNumber(this)" style="width: 100%; background: #27272a; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.8rem; color: white; font-size: 1.1rem; box-sizing: border-box;">
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 0.8rem; color: #a1a1aa; margin-bottom: 0.4rem;">Expiry (MM/YY)</label>
                                <input type="text" id="pg-card-expiry" placeholder="12/28" maxlength="5" oninput="window.formatExpiry(this)" style="width: 100%; background: #27272a; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.8rem; color: white; font-size: 1.1rem; text-align: center; box-sizing: border-box;">
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 0.8rem; color: #a1a1aa; margin-bottom: 0.4rem;">CVV</label>
                                <input type="password" id="pg-card-cvv" placeholder="•••" maxlength="3" style="width: 100%; background: #27272a; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.8rem; color: white; font-size: 1.1rem; text-align: center; box-sizing: border-box;">
                            </div>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; color: #a1a1aa; margin-bottom: 0.4rem;">Cardholder Name</label>
                            <input type="text" id="pg-card-name" placeholder="John Doe" style="width: 100%; background: #27272a; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.8rem; color: white; font-size: 1.1rem; text-transform: uppercase; box-sizing: border-box;">
                        </div>
                    </div>
                    <button onclick="window.pgStartProcess()" style="width: 100%; background: var(--primary-color); color: white; border: none; padding: 1.1rem; border-radius: 12px; font-weight: bold; font-size: 1.1rem; cursor: pointer;">Pay ₹${amount} Securely</button>
                </div>

                <!-- Step 2b: Netbanking Entry Details -->
                <div id="pg-step-netbanking" style="display: none;">
                    <button onclick="window.pgGoBack()" style="background: none; border: none; color: #a1a1aa; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; padding: 0; font-size: 0.9rem;">
                        &larr; Back to options
                    </button>
                    <p style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 1rem;">Select your bank:</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 2rem;">
                        <button onclick="window.pgSelectBank('SBI', event)" class="pg-bank-btn" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: white; padding: 0.8rem; border-radius: 10px; cursor: pointer; font-weight: 500;">SBI</button>
                        <button onclick="window.pgSelectBank('HDFC', event)" class="pg-bank-btn" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: white; padding: 0.8rem; border-radius: 10px; cursor: pointer; font-weight: 500;">HDFC Bank</button>
                        <button onclick="window.pgSelectBank('ICICI', event)" class="pg-bank-btn" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: white; padding: 0.8rem; border-radius: 10px; cursor: pointer; font-weight: 500;">ICICI Bank</button>
                        <button onclick="window.pgSelectBank('AXIS', event)" class="pg-bank-btn" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: white; padding: 0.8rem; border-radius: 10px; cursor: pointer; font-weight: 500;">Axis Bank</button>
                    </div>
                    <button id="pg-nb-pay-btn" onclick="window.pgStartProcess()" disabled style="width: 100%; background: var(--primary-color); opacity: 0.5; color: white; border: none; padding: 1.1rem; border-radius: 12px; font-weight: bold; font-size: 1.1rem; cursor: not-allowed;">Pay ₹${amount} Securely</button>
                </div>

                <!-- Step 2c: Wallets Entry Details -->
                <div id="pg-step-wallet" style="display: none;">
                    <button onclick="window.pgGoBack()" style="background: none; border: none; color: #a1a1aa; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; padding: 0; font-size: 0.9rem;">
                        &larr; Back to options
                    </button>
                    <p style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 1rem;">Select Wallet:</p>
                    <div style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2rem;">
                        <button onclick="window.pgSelectWallet('phonepe', event)" class="pg-wallet-btn" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: white; padding: 1rem; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 500; width: 100%; text-align: left;">
                            <span style="font-size: 1.2rem;">🟣</span> PhonePe Wallet
                        </button>
                        <button onclick="window.pgSelectWallet('amazon', event)" class="pg-wallet-btn" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: white; padding: 1rem; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 500; width: 100%; text-align: left;">
                            <span style="font-size: 1.2rem;">🟡</span> Amazon Pay
                        </button>
                    </div>
                    <button id="pg-w-pay-btn" onclick="window.pgStartProcess()" disabled style="width: 100%; background: var(--primary-color); opacity: 0.5; color: white; border: none; padding: 1.1rem; border-radius: 12px; font-weight: bold; font-size: 1.1rem; cursor: not-allowed;">Pay ₹${amount} Securely</button>
                </div>

                <!-- Step 3: SSL Connection & Integrity Processing Loading -->
                <div id="pg-step-loading" style="display: none; text-align: center; padding: 2rem 0;">
                    <div class="pg-spinner" style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.1); border-radius: 50%; border-top-color: var(--primary-color); animation: pgSpin 1s linear infinite; margin: 0 auto 1.5rem auto;"></div>
                    <h4 id="pg-loading-title" style="margin: 0 0 0.5rem 0; font-size: 1.2rem; color: #fff;">Connecting securely...</h4>
                    <p id="pg-loading-subtitle" style="margin: 0; color: #a1a1aa; font-size: 0.85rem;">256-bit SSL handshake in progress</p>
                </div>

                <!-- Step 4: OTP Verification -->
                <div id="pg-step-otp" style="display: none;">
                    <div style="text-align: center; margin-bottom: 1.5rem;">
                        <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">🔐</span>
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.2rem; color: #fff;">3D Secure verification</h4>
                        <p style="margin: 0; color: #a1a1aa; font-size: 0.85rem;">Enter the 6-digit OTP code sent to your phone</p>
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <input type="text" id="pg-otp-input" placeholder="Enter OTP (e.g. 123456)" maxlength="6" style="width: 100%; background: #27272a; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.9rem; color: white; font-size: 1.3rem; letter-spacing: 0.5rem; text-align: center; box-sizing: border-box;">
                        <div style="display: flex; justify-content: space-between; margin-top: 0.6rem; font-size: 0.8rem; color: #a1a1aa;">
                            <span>Verification code: <strong style="color: var(--primary-color);">123456</strong></span>
                            <span id="pg-otp-timer">Resend OTP in 30s</span>
                        </div>
                    </div>
                    <button onclick="window.pgSubmitOtp()" style="width: 100%; background: #10b981; color: white; border: none; padding: 1.1rem; border-radius: 12px; font-weight: bold; font-size: 1.1rem; cursor: pointer;">Verify & Complete Payment</button>
                </div>
            </div>
            
            <style>
                @keyframes pgSpin { to { transform: rotate(360deg); } }
                .pg-bank-btn.active, .pg-wallet-btn.active {
                    border: 2px solid var(--primary-color) !important;
                    background: rgba(217, 70, 239, 0.1) !important;
                }
            </style>
        `;

        document.body.appendChild(modal);

        // Core variables
        let selectedMethod = null;
        let selectedBank = null;
        let selectedWallet = null;

        window.pgSetMethod = function (method) {
            selectedMethod = method;
            document.getElementById('pg-step-select').style.display = 'none';
            if (method === 'CARD') {
                document.getElementById('pg-step-card').style.display = 'block';
            } else if (method === 'NETBANKING') {
                document.getElementById('pg-step-netbanking').style.display = 'block';
            } else if (method === 'WALLET') {
                document.getElementById('pg-step-wallet').style.display = 'block';
            }
        };

        window.pgGoBack = function () {
            document.getElementById('pg-step-card').style.display = 'none';
            document.getElementById('pg-step-netbanking').style.display = 'none';
            document.getElementById('pg-step-wallet').style.display = 'none';
            document.getElementById('pg-step-select').style.display = 'block';
        };

        window.formatCardNumber = function (input) {
            let val = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let matches = val.match(/\d{4,16}/g);
            let match = matches && matches[0] || '';
            let parts = [];
            for (let i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4));
            }
            if (parts.length > 0) {
                input.value = parts.join(' ');
            } else {
                input.value = val;
            }
        };

        window.formatExpiry = function (input) {
            let val = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            if (val.length >= 2) {
                input.value = val.substring(0, 2) + '/' + val.substring(2, 4);
            } else {
                input.value = val;
            }
        };

        window.pgSelectBank = function (bank, e) {
            selectedBank = bank;
            document.querySelectorAll('.pg-bank-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const payBtn = document.getElementById('pg-nb-pay-btn');
            payBtn.disabled = false;
            payBtn.style.opacity = '1';
            payBtn.style.cursor = 'pointer';
        };

        window.pgSelectWallet = function (wallet, e) {
            selectedWallet = wallet;
            document.querySelectorAll('.pg-wallet-btn').forEach(btn => btn.classList.remove('active'));
            let btn = e.target;
            if (btn.tagName !== 'BUTTON') btn = btn.closest('button');
            btn.classList.add('active');
            const payBtn = document.getElementById('pg-w-pay-btn');
            payBtn.disabled = false;
            payBtn.style.opacity = '1';
            payBtn.style.cursor = 'pointer';
        };

        window.pgStartProcess = function () {
            // Validation for card
            if (selectedMethod === 'CARD') {
                const num = document.getElementById('pg-card-number').value.trim();
                const exp = document.getElementById('pg-card-expiry').value.trim();
                const cvv = document.getElementById('pg-card-cvv').value.trim();
                const name = document.getElementById('pg-card-name').value.trim();
                if (num.length < 15 || exp.length < 5 || cvv.length < 3 || !name) {
                    alert("Please enter valid card details!");
                    return;
                }
            }

            // Show loading stages
            document.getElementById('pg-step-card').style.display = 'none';
            document.getElementById('pg-step-netbanking').style.display = 'none';
            document.getElementById('pg-step-wallet').style.display = 'none';
            document.getElementById('pg-step-loading').style.display = 'block';

            const stages = [
                { title: "Securing connection...", sub: "Performing SHA-256 SSL handshake" },
                { title: "Verifying credentials...", sub: "Authenticating token checksums" },
                { title: "Contacting card issuer...", sub: "Verifying merchant credentials and routing request" }
            ];

            let stageIdx = 0;
            const timer = setInterval(() => {
                stageIdx++;
                if (stageIdx < stages.length) {
                    document.getElementById('pg-loading-title').innerText = stages[stageIdx].title;
                    document.getElementById('pg-loading-subtitle').innerText = stages[stageIdx].sub;
                } else {
                    clearInterval(timer);
                    // Move to OTP stage
                    document.getElementById('pg-step-loading').style.display = 'none';
                    document.getElementById('pg-step-otp').style.display = 'block';
                    startOtpTimer();
                }
            }, 1200);
        };

        let otpCountdown = 30;
        let otpTimerInterval;
        function startOtpTimer() {
            otpTimerInterval = setInterval(() => {
                otpCountdown--;
                const timerSpan = document.getElementById('pg-otp-timer');
                if (timerSpan) {
                    if (otpCountdown > 0) {
                        timerSpan.innerText = `Resend OTP in ${otpCountdown}s`;
                    } else {
                        clearInterval(otpTimerInterval);
                        timerSpan.innerHTML = '<a href="#" onclick="window.pgStartProcess(); return false;" style="color: var(--primary-color); text-decoration: none; font-weight: bold;">Resend OTP</a>';
                    }
                }
            }, 1000);
        }

        window.pgSubmitOtp = function () {
            const otpVal = document.getElementById('pg-otp-input').value.trim();
            if (otpVal !== '123456') {
                alert("Incorrect verification code. Please enter '123456' to simulate a successful payment.");
                return;
            }

            clearInterval(otpTimerInterval);
            document.getElementById('pg-step-otp').style.display = 'none';
            document.getElementById('pg-step-loading').style.display = 'block';
            document.getElementById('pg-loading-title').innerText = "Processing payment...";
            document.getElementById('pg-loading-subtitle').innerText = "Finalizing secure transaction ledger";

            setTimeout(() => {
                // Success
                document.getElementById('pg-modal').remove();
                showToast("Payment Processed Successfully!🔒", "✅");
                if (callback) callback();
            }, 1500);
        };
    };

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
            const isWishlisted = state.wishlist.some(item => String(item) === String(product.id));
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
                
                <div class="wishlist-btn-card ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist('${product.id}')">
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
                        <button class="qty-btn" onclick="changeQty('${product.id}', -1)">-</button>
                        <input type="number" class="qty-input" id="qty-${product.id}" value="1" min="0.1" step="0.1" onclick="event.stopPropagation()">
                        <button class="qty-btn" onclick="changeQty('${product.id}', 1)">+</button>
                    </div>
                    ` : ''}

                    <button class="btn-add" 
                        ${!inStock ? 'style="background:#4b5563; cursor:not-allowed;" disabled' : ''} 
                        onclick="event.stopPropagation(); ${inStock ? `addToCart('${product.id}', ${product.price})` : ''}">
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
        window.closeMobileMenu(); // Close menu if search item clicked
    }

    // Mobile menu helper
    window.closeMobileMenu = function () {
        const navLinks = document.querySelector('.nav-links');
        const mobileBtn = document.querySelector('.mobile-toggle');
        if (navLinks) navLinks.classList.remove('active');
        if (mobileBtn) mobileBtn.classList.remove('open');
    }

    // Toggle search bar on mobile
    window.toggleMobileSearch = function () {
        const searchBar = document.querySelector('.search-bar');
        if (searchBar) {
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active')) {
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.focus();
            }
        }
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
        const index = state.wishlist.findIndex(item => String(item) === String(id));
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
                                <button class="qty-btn" onclick="changeQty('${product.id}', -1)">-</button>
                                <input type="number" class="qty-input" id="qty-${product.id}" value="1" min="0.1" step="0.1">
                                <button class="qty-btn" onclick="changeQty('${product.id}', 1)">+</button>
                            </div>
                            ` : ''}
                            <button class="btn btn-primary" 
                                ${product.in_stock === false ? 'style="background:#4b5563; cursor:not-allowed;" disabled' : ''} 
                                onclick="${product.in_stock === false ? '' : `addToCart('${product.id}')`}" 
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
            const product = state.products.find(p => String(p.id) === String(id));
            if (product && product.in_stock !== false) {
                const existingItem = state.cart.find(item => String(item.id) === String(id));
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




    function setupEventListeners() {
        // Check Auth State for UI
        if (state.user.name) {
            setTimeout(() => {
                const loginBtn = document.getElementById('login-btn');
                if (loginBtn) loginBtn.style.display = 'none';
                const loginMobile = document.querySelector('.login-mobile');
                if (loginMobile) loginMobile.style.display = 'none';
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
        
        // Show subscription payment modal with UPI QR
        const existingModal = document.getElementById('sub-pay-modal');
        if (existingModal) existingModal.remove();

        const upiID = "roy349647@oksbi";
        const upiLink = `upi://pay?pa=${upiID}&pn=${encodeURIComponent("Ajay Fruit Mart")}&am=${price}&cu=INR`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`;

        const modal = document.createElement('div');
        modal.id = 'sub-pay-modal';
        modal.style.cssText = "display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; align-items:center; justify-content:center;";
        modal.innerHTML = `
            <div style="background:#111827; padding:2rem; border-radius:20px; text-align:center; max-width:420px; width:90%; color:white; border: 1px solid rgba(16,185,129,0.3); box-shadow: 0 0 40px rgba(16,185,129,0.1);">
                <div style="font-size:2rem; margin-bottom:0.5rem;">📦</div>
                <h2 style="font-family:var(--font-serif); font-size:1.5rem; margin-bottom:0.3rem; color:#10b981;">Subscribe to ${plan}</h2>
                <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:1.5rem;">Pay ₹${price} via UPI to activate your subscription</p>

                <div style="background:#0f172a; border-radius:12px; padding:1rem; margin-bottom:1.5rem; border:1px solid rgba(255,255,255,0.08);">
                    <img src="${qrUrl}" alt="UPI QR" style="width:200px; height:200px; object-fit:contain; border-radius:8px; border:2px solid #10b981; display:block; margin:0 auto 0.8rem auto;">
                    <p style="color:#10b981; font-size:0.9rem; margin:0;">UPI ID: <strong>${upiID}</strong></p>
                    <p style="color:#94a3b8; font-size:0.8rem; margin:0.3rem 0 0 0;">Or scan with GPay / PhonePe / Paytm</p>
                </div>

                <div style="background:rgba(16,185,129,0.08); border-radius:10px; padding:0.8rem; margin-bottom:1.5rem; border:1px solid rgba(16,185,129,0.2); display:flex; align-items:center; gap:0.8rem;">
                    <input type="checkbox" id="sub-payment-confirm" style="width:18px; height:18px; accent-color:#10b981; flex-shrink:0; cursor:pointer;">
                    <label for="sub-payment-confirm" style="font-size:0.88rem; color:#d1fae5; text-align:left; cursor:pointer; line-height:1.4;">
                        I have paid ₹${price} to <strong>${upiID}</strong>
                    </label>
                </div>

                <div style="display:flex; gap:0.8rem;">
                    <button onclick="document.getElementById('sub-pay-modal').remove()" style="flex:1; padding:0.8rem; background:transparent; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:10px; cursor:pointer; font-size:0.95rem;">Cancel</button>
                    <button id="sub-confirm-btn" onclick="window.confirmSubPayment('${plan}', ${price})" style="flex:2; padding:0.8rem; background:#10b981; color:black; border:none; border-radius:10px; cursor:pointer; font-size:0.95rem; font-weight:700;">Confirm & Activate</button>
                </div>
                <p style="color:#64748b; font-size:0.78rem; margin-top:1rem;">⚠️ Your subscription will be activated after admin verifies your payment.</p>
            </div>
        `;
        document.body.appendChild(modal);
    };

    window.confirmSubPayment = async function (plan, price) {
        const checkbox = document.getElementById('sub-payment-confirm');
        if (!checkbox || !checkbox.checked) {
            alert("Please check the box confirming you have made the payment.");
            return;
        }

        const btn = document.getElementById('sub-confirm-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }

        try {
            const res = await fetch(`${API_BASE}/api/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: { name: state.user.name, phone: state.user.phone },
                    amount: price,
                    type: 'subscription',
                    metadata: { plan }
                })
            });
            const data = await res.json();
            if (!data.success) {
                alert("Failed to submit payment. Try again.");
                if (btn) { btn.disabled = false; btn.textContent = 'Confirm & Activate'; }
                return;
            }

            // Close QR modal, show waiting modal
            const modal = document.getElementById('sub-pay-modal');
            if (modal) modal.remove();

            // Show waiting modal
            const waitModal = document.createElement('div');
            waitModal.id = 'sub-wait-modal';
            waitModal.style.cssText = "display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; align-items:center; justify-content:center;";
            waitModal.innerHTML = `
                <div style="background:#111827; padding:2.5rem; border-radius:20px; text-align:center; max-width:380px; width:90%; color:white; border:1px solid rgba(16,185,129,0.3);">
                    <div style="font-size:3rem; margin-bottom:1rem;">⏳</div>
                    <h2 style="font-family:var(--font-serif); margin-bottom:0.8rem; color:#10b981;">Verifying Payment</h2>
                    <p style="color:#94a3b8; margin-bottom:2rem; font-size:0.9rem;">Waiting for admin to confirm your ₹${price} payment.<br>Please do not close this page.</p>
                    <div style="border:3px solid rgba(255,255,255,0.1); border-top:3px solid #10b981; border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite; margin:0 auto;"></div>
                    <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
                </div>
            `;
            document.body.appendChild(waitModal);

            // Poll for approval
            const reqId = data.req_id;
            let subPollInterval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`${API_BASE}/api/check-payment-status?req_id=${reqId}`);
                    const statusData = await statusRes.json();

                    if (statusData.status === 'approved') {
                        clearInterval(subPollInterval);
                        const wm = document.getElementById('sub-wait-modal');
                        if (wm) wm.remove();

                        // Fetch updated user to get subscription
                        try {
                            const userRes = await fetch(`${API_BASE}/api/user?phone=${state.user.phone}`);
                            const userData = await userRes.json();
                            if (userData.found) {
                                state.user = { ...state.user, ...userData.user };
                                localStorage.setItem('fruitShopUser', JSON.stringify(state.user));
                            }
                        } catch (e) {}

                        showToast(`🎉 Subscription Activated! Plan: ${plan}`, "📦");
                        window.location.hash = '#profile';
                    }
                } catch (e) {
                    console.error("Polling error", e);
                }
            }, 3000);

        } catch (e) {
            console.error(e);
            alert("Network error. Please try again.");
            if (btn) { btn.disabled = false; btn.textContent = 'Confirm & Activate'; }
        }
    };

    window.cancelSubscription = async function () {
        if (!state.user.name) return;
        if (!confirm("Are you sure you want to cancel your fruit box subscription?")) return;

        try {
            const res = await fetch(`${API_BASE}/api/subscribe/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: state.user.name })
            });
            const data = await res.json();
            if (data.success) {
                showToast("Subscription cancelled successfully", "📦");
                state.user.subscription = data.subscription;
                localStorage.setItem('fruitShopUser', JSON.stringify(state.user));
                renderProfile();
            } else {
                alert("Failed to cancel subscription: " + (data.error || "Unknown error"));
            }
        } catch (e) {
            console.error(e);
            alert("Error communicating with server.");
        }
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
