(function () {
    const saved = localStorage.getItem('arbisef-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
    const html = document.documentElement;
    const next = (html.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('arbisef-theme', next);
    updateThemeIcon(next);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcon(document.documentElement.getAttribute('data-theme') || 'light');
});

window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

function showsidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function hidesidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.body.style.overflow = '';
}
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const menuButton = document.querySelector('.menubutton');
    const sidebarClose = document.querySelector('.sidebar-close');
    if (sidebar.classList.contains('open') && 
        !sidebar.contains(e.target) && 
        !menuButton.contains(e.target) && 
        !sidebarClose.contains(e.target)) {
        hidesidebar();
    }
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.querySelectorAll('.team-card').forEach(card => {
    card.querySelectorAll('.bar div').forEach(bar => {
        bar.dataset.target = bar.style.width;
        bar.style.width = '0';
    });
});
const teamObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.querySelectorAll('.bar div').forEach(bar => {
                    bar.style.width = bar.dataset.target;
                });
            }, 100);
            teamObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
document.querySelectorAll('.team-card').forEach(card => teamObserver.observe(card));

const serviceCards = document.querySelectorAll('.service-card');
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
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

(function () {
    const btn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > window.innerHeight * 0.6);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

(function () {
    function initTicker() {
        const ticker = document.getElementById('ticker');
        if (!ticker) return;

        const originalHTML = ticker.innerHTML;

        const measurer = document.createElement('div');
        measurer.style.cssText = `
            position: absolute;
            visibility: hidden;
            display: flex;
            gap: 32px;
            white-space: nowrap;
            font-family: var(--font-display);
            font-size: 0.45rem;
            letter-spacing: 0.1em;
            pointer-events: none;
        `;
        measurer.innerHTML = originalHTML;
        document.body.appendChild(measurer);

        const singleWidth = measurer.scrollWidth + 32;
        document.body.removeChild(measurer);

        ticker.innerHTML = originalHTML + originalHTML + originalHTML;

        let position = 0;
        let rafId;
        let running = false;

        function step() {
            position -= 0.6;
            if (position <= -singleWidth) {
                position += singleWidth;
            }
            ticker.style.transform = `translateX(${position}px)`;
            rafId = requestAnimationFrame(step);
        }

        function start() {
            if (!running) {
                running = true;
                rafId = requestAnimationFrame(step);
            }
        }

        function stop() {
            running = false;
            cancelAnimationFrame(rafId);
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) start();
                else stop();
            });
        }, { threshold: 0.01 });

        observer.observe(ticker.parentElement);
    }

    if (document.fonts) {
        document.fonts.ready.then(initTicker);
    } else {
        window.addEventListener('load', initTicker);
    }
})();