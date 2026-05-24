// =============================================
//   NAV SCROLL
// =============================================
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

// =============================================
//   SIDEBAR
// =============================================
function showsidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function hidesidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.body.style.overflow = '';
}

// Close sidebar on outside click
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target)) {
        hidesidebar();
    }
});

// =============================================
//   SMOOTH SCROLL TO SECTION
// =============================================
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// =============================================
//   CUSTOM CURSOR
// =============================================
const cursor = document.getElementById('cursor');
if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let mx = -100, my = -100;
    let cx = -100, cy = -100;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
    });

    // Smooth lerp cursor
    function animateCursor() {
        cx += (mx - cx) * 0.18;
        cy += (my - cy) * 0.18;
        cursor.style.left = cx + 'px';
        cursor.style.top  = cy + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Scale on hover of interactive elements
    document.querySelectorAll('a, button, .service-card, .team-card, .arcade-input').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(3)';
            cursor.style.opacity = '0.5';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.opacity = '1';
        });
    });
}

// =============================================
//   REVEAL ON SCROLL
// =============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// =============================================
//   TEAM SKILL BARS ANIMATION
// =============================================
const teamObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Animate bars
            entry.target.querySelectorAll('.bar div').forEach(bar => {
                const w = bar.style.width || bar.getAttribute('style')?.match(/width:\s*(\S+)/)?.[1];
                if (w) bar.style.setProperty('--target-width', w);
                bar.style.width = w; // trigger
            });
            teamObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.team-card').forEach(card => {
    // Store bar widths before zeroing
    card.querySelectorAll('.bar div').forEach(bar => {
        const target = bar.style.width;
        bar.dataset.target = target;
        bar.style.width = '0';
    });
    teamObserver.observe(card);
});

// Animate bars when team card becomes visible
const teamMutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        if (mutation.target.classList.contains('visible')) {
            mutation.target.querySelectorAll('.bar div').forEach(bar => {
                setTimeout(() => {
                    bar.style.width = bar.dataset.target;
                }, 100);
            });
        }
    });
});

document.querySelectorAll('.team-card').forEach(card => {
    teamMutationObserver.observe(card, { attributes: true, attributeFilter: ['class'] });
});

// =============================================
//   STAGGER SERVICE CARDS ON SCROLL
// =============================================
const serviceCards = document.querySelectorAll('.service-card');
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const delay = Array.from(serviceCards).indexOf(entry.target) * 80;
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, delay);
            staggerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.25s ease, box-shadow 0.25s ease';
    staggerObserver.observe(card);
});

// =============================================
//   CONTACT FORM — PIXEL SEND FEEDBACK
// =============================================
const sendBtn = document.querySelector('.send-btn');
if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        const nameInput  = document.querySelector('.arcade-input[type="text"]');
        const emailInput = document.querySelector('.arcade-input[type="email"]');
        const textarea   = document.querySelector('.arcade-input[rows]');

        if (!nameInput?.value.trim() || !emailInput?.value.trim() || !textarea?.value.trim()) {
            sendBtn.textContent = '⚠ FILL ALL FIELDS';
            sendBtn.style.background = '#b45309';
            setTimeout(() => {
                sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> SEND MESSAGE';
                sendBtn.style.background = '';
            }, 2000);
            return;
        }

        sendBtn.innerHTML = '✔ MESSAGE SENT!';
        sendBtn.style.background = '#16a34a';
        sendBtn.disabled = true;

        setTimeout(() => {
            sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> SEND MESSAGE';
            sendBtn.style.background = '';
            sendBtn.disabled = false;
            nameInput.value = '';
            emailInput.value = '';
            textarea.value = '';
        }, 3000);
    });
}

// =============================================
//   NAV LINK ACTIVE STATE ON SCROLL
// =============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.style.color = link.getAttribute('href') === `#${id}`
                    ? 'var(--purple-light)'
                    : '';
            });
        }
    });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => activeObserver.observe(s));
