
// Tracking System Isolated Logic
console.log("Tracking System Loaded");

// Dynamic Leaflet Loader (Fallback)
function loadLeaflet(callback) {
    if (typeof L !== 'undefined') {
        callback();
        return;
    }

    console.log("Loading Leaflet dynamically...");
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    var script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = callback;
    script.onerror = function () {
        alert("Failed to load Map Library. Check connection.");
    };
    document.head.appendChild(script);
}

// Global Tracking Variables
window.trackMap = null;
window.trackMarker = null;
window.trackInterval = null;

// RENAMED FUNCTION TO AVOID CONFLICTS
window.startLiveTracking = function (orderId) {
    console.log("Starting Live Tracking for:", orderId);

    // 1. Show Modal INSTANTLY (UX Fix)
    const modal = document.getElementById('tracking-modal');
    if (!modal) {
        alert("System Error: Tracking modal not found.");
        return;
    }
    document.getElementById('track-order-id').innerText = orderId;
    modal.classList.remove('hidden');
    modal.style.display = 'flex';

    // Show Loading Text in Map container temporarily
    const mapDiv = document.getElementById('map');
    if (mapDiv) mapDiv.innerHTML = '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#666;">📡 Locating your device...</div>';

    // 2. ASK FOR GPS (with Timeout)
    const startMap = (realLoc) => {
        // Clear loading text
        if (mapDiv) mapDiv.innerHTML = '';
        loadLeaflet(() => setTimeout(() => initTrackingMap(realLoc), 100));
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success
            function (position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                console.log("GPS Found:", userLat, userLng);
                startMap([userLat, userLng]);
            },
            // Error/Denied/Timeout
            function (error) {
                console.warn("GPS Fail:", error.message);
                // Fallback silently without annoying alert
                startMap(null);
            },
            { timeout: 7000, enableHighAccuracy: true } // 7s Timeout
        );
    } else {
        startMap(null);
    }
};

// Removed old showTrackingMap helper as logic is now inline above
window.closeLiveTracking = function () {
    const modal = document.getElementById('tracking-modal');
    modal.classList.add('hidden');
    modal.style.display = '';
    if (window.trackInterval) clearInterval(window.trackInterval);
};

function initTrackingMap(realUserLoc) {
    console.log("Initializing Map...");
    if (window.trackMap) {
        window.trackMap.remove();
    }

    // Shop Location: Rawta More, Jaffarpur
    const shopLoc = [28.59728, 76.91555];

    // User Location: Real GPS or Defaults
    // Default fallback slightly offset from shop if GPS fails
    let userLoc = realUserLoc || [28.5920, 76.9120];

    window.trackMap = L.map('map').setView(shopLoc, 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CARTO',
        maxZoom: 19
    }).addTo(window.trackMap);

    // Markers
    L.marker(shopLoc).addTo(window.trackMap).bindPopup("Shop (Rawta More)").openPopup();

    // User Marker (Different Color)
    const userIcon = L.divIcon({
        html: '<div style="background:blue; width:15px; height:15px; border-radius:50%; border:2px solid white; box-shadow:0 0 10px blue;"></div>',
        className: 'user-marker',
        iconSize: [20, 20]
    });
    L.marker(userLoc, { icon: userIcon }).addTo(window.trackMap).bindPopup(realUserLoc ? "Your Location" : "Delivery Location");

    // Fit Bounds
    const bounds = L.latLngBounds([shopLoc, userLoc]);
    window.trackMap.fitBounds(bounds, { padding: [80, 80] });

    // Delivery Animation
    const boyIcon = L.divIcon({
        html: '<div style="font-size:30px;">🛵</div>',
        className: 'scooter-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    window.trackMarker = L.marker(shopLoc, { icon: boyIcon }).addTo(window.trackMap);

    let progress = 0;
    if (window.trackInterval) clearInterval(window.trackInterval);

    window.trackInterval = setInterval(() => {
        progress += 1;
        if (progress > 100) progress = 0;

        const lat = shopLoc[0] + (userLoc[0] - shopLoc[0]) * (progress / 100);
        const lng = shopLoc[1] + (userLoc[1] - shopLoc[1]) * (progress / 100);

        window.trackMarker.setLatLng([lat, lng]);

        // Update ETA Display
        const eta = Math.ceil(20 * (1 - (progress / 100)));
        const etaEl = document.getElementById('track-eta');
        if (etaEl) etaEl.innerText = eta + " mins";

    }, 100);

    // Fix Grey Map
    setTimeout(() => {
        window.trackMap.invalidateSize();
    }, 500);
}
