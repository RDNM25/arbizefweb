const EMAILJS_PUBLIC_KEY  = 'M2uWu8FnFuCYQt3C7';
const EMAILJS_SERVICE_ID  = 'service_68772k1';
const EMAILJS_TEMPLATE_ID = 'template_rue3jnp';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

function selectChip(element) {
    document.querySelectorAll('.subject-chips .chip')
            .forEach(c => c.classList.remove('active'));
    element.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('contactSend');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const name    = document.getElementById('f-name')?.value.trim();
        const email   = document.getElementById('f-email')?.value.trim();
        const message = document.getElementById('f-msg')?.value.trim();
        const subject = document.querySelector('.subject-chips .chip.active')?.textContent.trim() || 'General';
        const budget  = document.querySelector('input[name="budget"]:checked')?.value || 'Not specified';

        if (!name || !email || !message) {
            setBtn(btn, 'error', '⚠ FILL ALL FIELDS');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setBtn(btn, 'error', '⚠ INVALID EMAIL');
            return;
        }

        setBtn(btn, 'loading', '⏳ SENDING...');

        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                from_name:  name,
                from_email: email,
                subject:    subject,
                budget:     budget,
                message:    message,
            });

            setBtn(btn, 'success', '✔ MESSAGE SENT!');
            document.getElementById('f-name').value  = '';
            document.getElementById('f-email').value = '';
            document.getElementById('f-msg').value   = '';
            document.querySelector('input[name="budget"]:checked')
                ?.closest('label')?.querySelector('input') && 
                (document.querySelector('input[name="budget"]:checked').checked = false);

            setTimeout(() => setBtn(btn, 'idle'), 4000);

        } catch (err) {
            console.error('EmailJS error:', err);
            setBtn(btn, 'error', '✖ SEND FAILED — TRY AGAIN');
        }
    });
});

function setBtn(btn, state, label) {
    const defaults = {
        idle:    { html: '<i class="fa-solid fa-paper-plane"></i> SEND MESSAGE', bg: '', disabled: false },
        loading: { html: label,  bg: '#6d28d9', disabled: true  },
        success: { html: label,  bg: '#16a34a', disabled: true  },
        error:   { html: label,  bg: '#b45309', disabled: false },
    };
    const s = defaults[state];
    btn.innerHTML = s.html;
    btn.style.background = s.bg;
    btn.disabled = s.disabled;

    if (state === 'error') {
        setTimeout(() => setBtn(btn, 'idle'), 2500);
    }
}