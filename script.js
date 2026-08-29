/* ============================================================
   AKENO BOT — script.js
   Particles · Navbar · Stats Counter · Scroll Reveal ·
   Command Filter · Lightning · Hamburger
   ============================================================ */

'use strict';

/* ===== PARTICLES ===== */
(function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const COLORS = [
        'rgba(155,48,255,0.7)',
        'rgba(192,57,43,0.6)',
        'rgba(255,107,157,0.5)',
        'rgba(192,132,252,0.5)',
        'rgba(212,175,55,0.4)',
    ];
    const COUNT = 40;

    for (let i = 0; i < COUNT; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');

        const size   = Math.random() * 4 + 1;          // 1–5px
        const color  = COLORS[Math.floor(Math.random() * COLORS.length)];
        const left   = Math.random() * 100;             // % from left
        const dur    = Math.random() * 20 + 15;         // 15–35s
        const delay  = Math.random() * 20;              // 0–20s stagger

        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            animation-duration: ${dur}s;
            animation-delay: -${delay}s;
            box-shadow: 0 0 ${size * 3}px ${color};
        `;
        container.appendChild(p);
    }
})();

/* ===== RANDOM LIGHTNING FLASH ===== */
(function initLightning() {
    const overlay = document.getElementById('lightning');
    if (!overlay) return;

    function flash() {
        overlay.style.transition = 'opacity 0.05s';
        overlay.style.opacity    = '0.25';
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.4s';
            overlay.style.opacity    = '0';
        }, 80);

        // random double-flash
        if (Math.random() > 0.5) {
            setTimeout(() => {
                overlay.style.transition = 'opacity 0.05s';
                overlay.style.opacity    = '0.15';
                setTimeout(() => {
                    overlay.style.transition = 'opacity 0.4s';
                    overlay.style.opacity    = '0';
                }, 60);
            }, 180);
        }

        // schedule next flash (8–25s)
        setTimeout(flash, Math.random() * 17000 + 8000);
    }

    setTimeout(flash, 4000);
})();

/* ===== NAVBAR SCROLL EFFECT + HAMBURGER ===== */
(function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.querySelector('.nav-links');

    // scroll class
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // hamburger toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            // animate hamburger → X
            const spans = hamburger.querySelectorAll('span');
            hamburger.classList.toggle('active');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity   = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity   = '';
                spans[2].style.transform = '';
            }
        });

        // close on nav-link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.querySelectorAll('span').forEach(s => {
                    s.style.transform = '';
                    s.style.opacity   = '';
                });
            });
        });
    }
})();

/* ===== SMOOTH SCROLL for all anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 70; // navbar height
            const top    = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ===== STATS COUNTER ===== */
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function animateCounter(el) {
        const target   = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start    = performance.now();

        function step(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value    = Math.floor(easeOut(progress) * target);

            // Format with + suffix and thousands separator
            el.textContent = value.toLocaleString('tr-TR') + (progress < 1 ? '' : '+');
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString('tr-TR') + '+';
        }
        requestAnimationFrame(step);
    }

    // trigger when hero comes into view
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(animateCounter);
                observer.disconnect();
            }
        });
    }, { threshold: 0.4 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) observer.observe(heroStats);
})();

/* ===== SCROLL REVEAL for feature cards ===== */
(function initReveal() {
    const cards = document.querySelectorAll('.feature-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay, 10));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    cards.forEach(card => observer.observe(card));
})();

/* ===== COMMAND FILTER ===== */
(function initCommandFilter() {
    const buttons  = document.querySelectorAll('.filter-btn');
    const commands = document.querySelectorAll('.command-card');
    if (!buttons.length || !commands.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // update active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            commands.forEach(card => {
                const category = card.dataset.category;
                const show     = filter === 'all' || category === filter;

                if (show) {
                    card.classList.remove('hidden');
                    // small entrance animation
                    card.style.animation = 'none';
                    requestAnimationFrame(() => {
                        card.style.animation = '';
                        card.style.opacity   = '0';
                        card.style.transform = 'translateY(12px)';
                        requestAnimationFrame(() => {
                            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            card.style.opacity    = '1';
                            card.style.transform  = 'translateY(0)';
                        });
                    });
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
})();

/* ===== ACTIVE NAV LINK on scroll ===== */
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active-link'));
                const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active-link');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
})();

/* ===== CARD TILT effect on hover (hero cards) ===== */
(function initCardTilt() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect   = card.getBoundingClientRect();
            const x      = e.clientX - rect.left;
            const y      = e.clientY - rect.top;
            const cx     = rect.width  / 2;
            const cy     = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -12;
            const rotateY = ((x - cx) / cx) *  12;

            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`;
            card.style.zIndex    = '10';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.zIndex    = '';
        });
    });
})();

/* ===== CURSOR GLOW TRAIL ===== */
(function initCursorGlow() {
    // only on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const glow = document.createElement('div');
    glow.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(155,48,255,0.07) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        transition: left 0.12s ease, top 0.12s ease;
        will-change: left, top;
    `;
    document.body.appendChild(glow);

    window.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
    }, { passive: true });
})();

/* ===== CONSOLE GREETING ===== */
console.log(
    '%c⚡ AKENO BOT %c— gothic card game bot',
    'color: #9b30ff; font-size: 1.2rem; font-weight: bold;',
    'color: #c084fc; font-size: 0.9rem;'
);
