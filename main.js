document.addEventListener('DOMContentLoaded', () => {
    // --- 3D TILT EFFECT FOR HERO IMAGE ---
    const heroSection = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');

    if (heroSection && heroImage) {
        heroSection.addEventListener('mousemove', (e) => {
            const { offsetWidth: width, offsetHeight: height } = heroSection;
            const { clientX: x, clientY: y } = e;

            // Calculate rotation based on cursor position (0 center)
            const xVal = (x / width - 0.5) * 20; // Max rotation X deg
            const yVal = (y / height - 0.5) * 20; // Max rotation Y deg

            // Apply 3D Transform
            // RotateX follows Y axis movement (up/down tilts image up/down)
            // RotateY follows X axis movement (left/right tilts image left/right)
            // Note: RotateX needs inverted Y to feel natural (mouse up -> image looks up)
            heroImage.style.transform = `
                perspective(1000px) 
                rotateX(${-yVal}deg) 
                rotateY(${xVal}deg)
                scale3d(1.05, 1.05, 1.05)
            `;
        });

        // Reset on mouse leave
        heroSection.addEventListener('mouseleave', () => {
            heroImage.style.transform = `
                perspective(1000px) 
                rotateX(0deg) 
                rotateY(0deg) 
                scale3d(1, 1, 1)
            `;
        });
    }

    // Initialize Scroll Animations
    setupScrollReveal();
});

function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
