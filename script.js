/* ============================================
   3RD MONTHSARY — AURORA VIOLET & ROSE-GOLD JS
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    createWelcomeStars();
    initWelcomeCanvas();
    createFloatingParticles();
    initScrollAnimations();
    startCounter();
});

/**
 * Enter the main site from welcome screen
 */
function enterSite() {
    const welcomeScreen = document.getElementById('welcome');
    const mainContent = document.getElementById('mainContent');
    const musicControl = document.getElementById('musicControl');
    const bgMusic = document.getElementById('bgMusic');

    welcomeScreen.classList.add('hidden');

    setTimeout(() => {
        mainContent.classList.add('visible');
    }, 500);

    musicControl.classList.add('visible');

    bgMusic.volume = 0.5;
    bgMusic.currentTime = 35; // Start at 35 seconds
    bgMusic.play().then(() => {
        document.getElementById('musicBtn').classList.add('playing');
    }).catch(e => console.log('Music autoplay prevented:', e));

    // Burst of particles on enter
    setTimeout(() => {
        for (let i = 0; i < 25; i++) {
            setTimeout(() => createParticle(), i * 70);
        }
    }, 600);
}

/**
 * Toggle background music
 */
function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');

    if (bgMusic.paused) {
        bgMusic.play();
        musicBtn.textContent = '🎵';
        musicBtn.classList.remove('muted');
        musicBtn.classList.add('playing');
    } else {
        bgMusic.pause();
        musicBtn.textContent = '🔇';
        musicBtn.classList.add('muted');
        musicBtn.classList.remove('playing');
    }
}

/**
 * Live counter since January 3, 2026
 */
function startCounter() {
    const startDate = new Date('2026-01-03T00:00:00+08:00');

    function update() {
        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('counterDays');
        const hoursEl = document.getElementById('counterHours');
        const minutesEl = document.getElementById('counterMinutes');
        const secondsEl = document.getElementById('counterSeconds');

        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = hours;
        if (minutesEl) minutesEl.textContent = minutes;
        if (secondsEl) secondsEl.textContent = seconds;
    }

    update();
    setInterval(update, 1000);
}

/**
 * Create stars on the welcome screen background
 */
function createWelcomeStars() {
    const container = document.querySelector('.welcome-stars');
    if (!container) return;

    for (let i = 0; i < 70; i++) {
        const star = document.createElement('div');
        star.classList.add('welcome-star');
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        const size = (Math.random() * 2.5 + 1) + 'px';
        star.style.width = size;
        star.style.height = size;
        star.style.animationDuration = (Math.random() * 4 + 2) + 's';
        star.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(star);
    }
}

/**
 * Canvas particle system for welcome screen
 */
function initWelcomeCanvas() {
    const canvas = document.getElementById('welcomeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.fadeDir = 1;

            // Random colors: purple, rose, gold
            const colors = [
                { r: 167, g: 139, b: 250 },  // purple-light
                { r: 251, g: 113, b: 133 },  // rose-light
                { r: 232, g: 168, b: 124 },  // rose-gold
                { r: 251, g: 191, b: 36 },   // gold
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            this.opacity += this.fadeSpeed * this.fadeDir;
            if (this.opacity >= 0.6) this.fadeDir = -1;
            if (this.opacity <= 0.05) this.fadeDir = 1;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(167, 139, 250, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawLines();

        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Stop animation when welcome screen is hidden
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
            if (m.target.classList.contains('hidden')) {
                setTimeout(() => cancelAnimationFrame(animationId), 2000);
            }
        });
    });

    const welcome = document.getElementById('welcome');
    if (welcome) {
        observer.observe(welcome, { attributes: true, attributeFilter: ['class'] });
    }
}

/**
 * Floating particles (replacing falling stars)
 */
function createFloatingParticles() {
    setInterval(() => {
        const container = document.getElementById('heartsContainer');
        if (container && container.children.length < 8) {
            createParticle();
        }
    }, 2500);

    // Initial particles
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createParticle(), i * 800);
    }
}

function createParticle() {
    const container = document.getElementById('heartsContainer');
    if (!container) return;

    const particle = document.createElement('div');
    particle.classList.add('floating-particle');

    const shapes = [
        // Purple sparkle
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#a78bfa" opacity="0.7"/></svg>`,
        // Rose-gold sparkle
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#e8a87c" opacity="0.6"/></svg>`,
        // Small heart
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="#f43f5e" opacity="0.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
        // Rose petal
        `<svg width="12" height="16" viewBox="0 0 12 16" fill="none"><ellipse cx="6" cy="9" rx="5" ry="7" fill="#fb7185" opacity="0.4"/></svg>`,
        // Tiny gold star
        `<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#fbbf24" opacity="0.5"/></svg>`,
        // Rose-gold circle
        `<svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" fill="#f5c6aa" opacity="0.4"/></svg>`,
    ];

    particle.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];

    const size = Math.random() * 0.6 + 0.7;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.transform = `scale(${size})`;
    particle.style.animationDuration = (Math.random() * 7 + 6) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';

    container.appendChild(particle);

    setTimeout(() => particle.remove(), 15000);
}

/**
 * Scroll animations with stagger
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll(
        '.letter-section, .reasons-section, .timeline-section, .promise-section'
    );
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        observer.observe(section);
    });

    const items = document.querySelectorAll(
        '.reason-card, .timeline-item'
    );
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`;
        observer.observe(item);
    });
}



// Console message
console.log('💜 Happy 3rd Monthsary — Three months of forever! 💜');
