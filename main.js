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

const sendBtn = document.querySelector('.send-btn');
if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        const name  = document.querySelector('.arcade-input[type="text"]')?.value.trim();
        const email = document.querySelector('.arcade-input[type="email"]')?.value.trim();
        const msg   = document.querySelector('textarea.arcade-input')?.value.trim();

        if (!name || !email || !msg) {
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
            document.querySelector('.arcade-input[type="text"]').value = '';
            document.querySelector('.arcade-input[type="email"]').value = '';
            document.querySelector('textarea.arcade-input').value = '';
        }, 3000);
    });
}

(function () {
    const btn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > window.innerHeight * 0.6);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();