// Tracking System Logic - Real-time Leaflet Integration
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
window.currentTrackingOrderId = null;

// Start Live Tracking
window.startLiveTracking = function (orderId) {
    console.log("Starting Live Tracking for:", orderId);
    window.currentTrackingOrderId = orderId;

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

window.closeLiveTracking = function () {
    const modal = document.getElementById('tracking-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = '';
    }
    if (window.trackInterval) clearInterval(window.trackInterval);
};

function initTrackingMap(realUserLoc) {
    console.log("Initializing Map for Order:", window.currentTrackingOrderId);
    if (window.trackMap) {
        window.trackMap.remove();
    }

    // Shop Location: Rawta More, Jaffarpur
    const shopLoc = [28.59728, 76.91555];

    // User Location: Real GPS or Defaults
    let userLoc = realUserLoc || [28.5920, 76.9120];

    window.trackMap = L.map('map').setView(shopLoc, 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CARTO',
        maxZoom: 19
    }).addTo(window.trackMap);

    // Markers
    L.marker(shopLoc).addTo(window.trackMap).bindPopup("Shop (Rawta More)").openPopup();

    // User Marker
    const userIcon = L.divIcon({
        html: '<div style="background:#e11d48; width:15px; height:15px; border-radius:50%; border:2px solid white; box-shadow:0 0 10px #e11d48;"></div>',
        className: 'user-marker',
        iconSize: [20, 20]
    });
    L.marker(userLoc, { icon: userIcon }).addTo(window.trackMap).bindPopup(realUserLoc ? "Your Location" : "Delivery Location");

    // Fit Bounds
    const bounds = L.latLngBounds([shopLoc, userLoc]);
    window.trackMap.fitBounds(bounds, { padding: [80, 80] });

    // Delivery Rider Marker
    const boyIcon = L.divIcon({
        html: '<div style="font-size:30px; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));">🛵</div>',
        className: 'scooter-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    window.trackMarker = L.marker(shopLoc, { icon: boyIcon }).addTo(window.trackMap);

    // Route line from shop to current location
    let routeLine = L.polyline([shopLoc], { color: '#10b981', dashArray: '5, 10', weight: 4 }).addTo(window.trackMap);

    const API_BASE = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
        ? 'http://127.0.0.1:5000'
        : window.location.origin;

    const orderId = window.currentTrackingOrderId;

    const pollTracking = async () => {
        if (!orderId) return;
        try {
            const res = await fetch(`${API_BASE}/api/order/${orderId}/tracking`);
            const data = await res.json();
            if (data.success && data.trackingCoords && data.trackingCoords.length > 0) {
                const coords = data.trackingCoords;
                const latest = coords[coords.length - 1];
                const currentPos = [latest.lat, latest.lng];

                // Update Rider Marker Position
                window.trackMarker.setLatLng(currentPos);

                // Draw route line
                const pathPoints = [shopLoc, ...coords.map(c => [c.lat, c.lng])];
                routeLine.setLatLngs(pathPoints);

                // Update ETA display
                const distanceToUser = L.latLng(currentPos).distanceTo(L.latLng(userLoc)); // in meters
                const etaMins = Math.max(2, Math.ceil(distanceToUser / 300)); // proxy speed
                const etaEl = document.getElementById('track-eta');
                if (etaEl) etaEl.innerText = etaMins + " mins";
            } else {
                // Mock slide animation if no database coords yet
                const mockProgress = Math.min(100, Math.floor((Date.now() % 120000) / 1200));
                const lat = shopLoc[0] + (userLoc[0] - shopLoc[0]) * (mockProgress / 100);
                const lng = shopLoc[1] + (userLoc[1] - shopLoc[1]) * (mockProgress / 100);
                window.trackMarker.setLatLng([lat, lng]);
                routeLine.setLatLngs([shopLoc, [lat, lng]]);

                const etaEl = document.getElementById('track-eta');
                if (etaEl) etaEl.innerText = Math.ceil(20 * (1 - (mockProgress / 100))) + " mins";
            }
        } catch (e) {
            console.error("Tracking poll fail", e);
        }
    };

    if (window.trackInterval) clearInterval(window.trackInterval);
    pollTracking(); // run immediately
    window.trackInterval = setInterval(pollTracking, 5000); // Poll every 5s

    // Fix Grey Map rendering
    setTimeout(() => {
        window.trackMap.invalidateSize();
    }, 500);
}
