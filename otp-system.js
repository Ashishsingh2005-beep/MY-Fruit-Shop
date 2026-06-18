// === OTP VERIFICATION SYSTEM ===

// Update processSignUp to use OTP
const originalProcessSignUp = window.processSignUp;
window.processSignUp = async function () {
    const name = document.getElementById('signup-name').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const address = document.getElementById('signup-address').value.trim();

    if (!name || !phone || !address) {
        showToast("Please fill in Name, Phone, and Address", "⚠️");
        return;
    }

    // Validate phone number
    if (phone.length !== 10 || !phone.match(/^\d{10}$/)) {
        showToast("Please enter a valid 10-digit phone number", "⚠️");
        return;
    }

    try {
        // Send OTP
        const response = await fetch(`${API_BASE}/api/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, address })
        });

        const result = await response.json();
        if (result.success) {
            // Store user data temporarily
            window.tempUserData = { name, email, phone, address };

            // Show OTP verification screen
            showOTPVerification(phone, result.otp); // result.otp only for development
            showToast("OTP sent to your phone!", "📱");
        } else {
            showToast(result.message || "Failed to send OTP", "❌");
        }
    } catch (e) {
        console.error("OTP send error:", e);
        showToast("Connection error. Please try again.", "❌");
    }
}

// New OTP Verification Function
window.showOTPVerification = function (phone, devOTP) {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('signin-form').classList.add('hidden');

    // Create OTP verification UI if doesn't exist
    let otpForm = document.getElementById('otp-form');
    if (!otpForm) {
        otpForm = document.createElement('div');
        otpForm.id = 'otp-form';
        otpForm.className = 'login-form';
        document.getElementById('login-modal').querySelector('.login-modal-content').appendChild(otpForm);
    }

    otpForm.innerHTML = `
        <h2 style="margin-bottom: 1rem; font-family: var(--font-serif);">Verify OTP</h2>
        <p style="color: var(--text-gray); margin-bottom: 1.5rem;">
            Enter the 6-digit OTP sent to <strong>${phone}</strong>
        </p>
        ${devOTP ? `<p style="background: #fbbf24; color: #000; padding: 0.5rem; border-radius: 8px; margin-bottom: 1rem; font-weight: 600;">DEV MODE: Your OTP is ${devOTP}</p>` : ''}
        <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem;">
            <input type="text" id="otp-1" maxlength="1" class="otp-input" style="width: 50px; height: 50px; text-align: center; font-size: 1.5rem; border: 2px solid #333; border-radius: 8px; background: #111; color: white;">
            <input type="text" id="otp-2" maxlength="1" class="otp-input" style="width: 50px; height: 50px; text-align: center; font-size: 1.5rem; border: 2px solid #333; border-radius: 8px; background: #111; color: white;">
            <input type="text" id="otp-3" maxlength="1" class="otp-input" style="width: 50px; height: 50px; text-align: center; font-size: 1.5rem; border: 2px solid #333; border-radius: 8px; background: #111; color: white;">
            <input type="text" id="otp-4" maxlength="1" class="otp-input" style="width: 50px; height: 50px; text-align: center; font-size: 1.5rem; border: 2px solid #333; border-radius: 8px; background: #111; color: white;">
            <input type="text" id="otp-5" maxlength="1" class="otp-input" style="width: 50px; height: 50px; text-align: center; font-size: 1.5rem; border: 2px solid #333; border-radius: 8px; background: #111; color: white;">
            <input type="text" id="otp-6" maxlength="1" class="otp-input" style="width: 50px; height: 50px; text-align: center; font-size: 1.5rem; border: 2px solid #333; border-radius: 8px; background: #111; color: white;">
        </div>
        <button class="btn btn-primary" onclick="verifyOTP()" style="width: 100%; margin-bottom: 1rem;">Verify OTP</button>
        <button class="btn btn-outline" onclick="resendOTP()" style="width: 100%;">Resend OTP</button>
        <button class="btn" onclick="backToSignup()" style="width: 100%; margin-top: 0.5rem; background: transparent; border: none; color: var(--text-gray);">← Back</button>
    `;

    otpForm.classList.remove('hidden');

    // Auto-focus and auto-advance OTP inputs
    setTimeout(() => {
        const inputs = document.querySelectorAll('.otp-input');
        inputs[0].focus();

        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < 5) {
                    inputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    }, 100);
}

window.verifyOTP = async function () {
    const otp = Array.from({ length: 6 }, (_, i) => document.getElementById(`otp-${i + 1}`).value).join('');

    if (otp.length !== 6) {
        showToast("Please enter complete OTP", "⚠️");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: window.tempUserData.phone,
                otp: otp
            })
        });

        const result = await response.json();
        if (result.success) {
            state.user = {
                name: result.user.name,
                email: result.user.email || 'No email provided',
                phone: result.user.phone,
                address: result.user.address,
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(result.user.name)}&background=random`
            };
            finishLogin();
            showToast("Login successful! 🎉", "✅");
        } else {
            showToast(result.message || "Invalid OTP", "❌");
        }
    } catch (e) {
        console.error("OTP verification error:", e);
        showToast("Verification failed. Please try again.", "❌");
    }
}

window.resendOTP = async function () {
    if (!window.tempUserData) return;

    try {
        const response = await fetch(`${API_BASE}/api/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(window.tempUserData)
        });

        const result = await response.json();
        if (result.success) {
            showToast("OTP resent successfully!", "📱");
            // Update dev OTP display if exists
            const devOTPDisplay = document.querySelector('#otp-form p[style*="fbbf24"]');
            if (devOTPDisplay && result.otp) {
                devOTPDisplay.textContent = `DEV MODE: Your OTP is ${result.otp}`;
            }
        }
    } catch (e) {
        showToast("Failed to resend OTP", "❌");
    }
}

window.backToSignup = function () {
    document.getElementById('otp-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
}

console.log("✅ OTP Verification System Loaded");
