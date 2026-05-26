(function () {
    /* ── Inject overlay HTML ── */
    const overlay = document.createElement('div');
    overlay.id = 'arbisef-loader';
    overlay.innerHTML = `
        <div id="loader-grid"></div>
        <div id="loader-orb-1"></div>
        <div id="loader-orb-2"></div>
        <div id="loader-scanlines"></div>
        <canvas id="loader-canvas"></canvas>
        <div id="loader-brand">Arbisef.tech</div>
        <div id="loader-tag">// LOADING_SCENE.BLEND</div>
        <div id="loader-track"><div id="loader-fill"></div></div>
        <div id="loader-status" id="loader-status">&#9612; PLEASE WAIT...</div>
    `;
    document.body.insertBefore(overlay, document.body.firstChild);

    const canvas   = document.getElementById('loader-canvas');
    const ctx      = canvas.getContext('2d');
    const fillEl   = document.getElementById('loader-fill');
    const statusEl = document.getElementById('loader-status');

    const W = Math.min(360, window.innerWidth - 40);
    const H = 80;
    canvas.width  = W;
    canvas.height = H;

    const SPEED_LOADING  = 1.1;   
    const SPEED_DASH     = 5.5;   

    const GHOST_COLORS = ['#ff0000', '#ffb8ff', '#00ffff', '#ffb852'];
    const GHOST_GAP    = 28;
    const PAC_LEAD     = 32;
    const PAC_Y        = H / 2;
    const DOT_SPACING  = 22;
    const DOT_START    = 28;
    const DOT_COUNT    = Math.floor((W - DOT_START) / DOT_SPACING);

    let pacX       = -16;
    let speed      = SPEED_LOADING;
    let mouthAngle = 0;
    let mouthDir   = 1;
    let frame      = 0;
    let rafId;
    let pageLoaded = false;
    let finishing  = false;   

    const dots = Array.from({ length: DOT_COUNT }, (_, i) => ({
        x: DOT_START + i * DOT_SPACING,
        eaten: false,
        alpha: 1,
        scale: 1,
    }));

    function resetDots() {
        dots.forEach(d => { d.eaten = false; d.alpha = 1; d.scale = 1; });
    }

    function drawPacman(x, y, mouth) {
        const r     = 13;
        const start = (mouth * Math.PI) / 180;
        const end   = ((360 - mouth) * Math.PI) / 180;
        ctx.save();
        ctx.shadowColor = finishing ? 'rgba(251,191,36,0.7)' : 'rgba(251,191,36,0.35)';
        ctx.shadowBlur  = finishing ? 18 : 10;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, r, start, end);
        ctx.closePath();
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
        ctx.restore();
        ctx.beginPath();
        ctx.arc(x, y - 5, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#07090f';
        ctx.fill();
    }

    function drawGhost(x, y, color, phase, t) {
        const r     = 11;
        const bodyH = 13;
        const segs  = 3;
        const segW  = (r * 2) / segs;

        ctx.save();
        ctx.shadowColor = color + '55';
        ctx.shadowBlur  = 7;

        ctx.beginPath();
        ctx.arc(x, y - bodyH / 2 + 2, r, Math.PI, 0, false);
        ctx.lineTo(x + r, y + bodyH / 2);

        for (let s = 0; s <= segs; s++) {
            const sx  = x + r - s * segW;
            const amp = 3.5;
            const sy  = y + bodyH / 2 + Math.sin(t * 4 + phase + s * Math.PI) * amp;
            if (s === 0) {
                ctx.lineTo(sx, sy);
            } else {
                ctx.quadraticCurveTo(
                    sx + segW / 2,
                    y + bodyH / 2 + Math.sin(t * 4 + phase + (s - 0.5) * Math.PI) * amp * 1.6,
                    sx, sy
                );
            }
        }
        ctx.lineTo(x - r, y - bodyH / 2 + 2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();

        for (const ex of [x - 4, x + 4]) {
            ctx.beginPath();
            ctx.arc(ex, y - bodyH / 2 + 1, 3.2, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ex + 1, y - bodyH / 2 + 2, 1.6, 0, Math.PI * 2);
            ctx.fillStyle = '#0000cc';
            ctx.fill();
        }
    }

    function drawDot(d) {
        if (d.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = d.alpha;
        ctx.shadowColor = 'rgba(255,255,255,0.4)';
        ctx.shadowBlur  = 4;
        ctx.beginPath();
        ctx.arc(d.x, PAC_Y, 3.5 * d.scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fill();
        ctx.restore();
    }

    function tick() {
        frame++;
        const t = frame / 60;

        const targetSpeed = finishing ? SPEED_DASH : SPEED_LOADING;
        speed += (targetSpeed - speed) * 0.08;

        ctx.clearRect(0, 0, W, H);

        dots.forEach(d => {
            if (d.eaten && d.alpha > 0) {
                d.alpha  = Math.max(0, d.alpha - 0.08);
                d.scale += 0.07;
            }
            drawDot(d);
        });

        pacX += speed;

        if (pacX > W + 20) {
            if (finishing) {
                doHide();
                return;
            }
            pacX = -16;
            resetDots();
        }

        if (pageLoaded && !finishing) {
            finishing = true;
            statusEl.textContent = '\u258c LAUNCHING...';
        }

        dots.forEach(d => {
            if (!d.eaten && Math.abs(pacX - d.x) < 12) d.eaten = true;
        });

        mouthAngle += mouthDir * 5;
        if (mouthAngle >= 35) mouthDir = -1;
        if (mouthAngle <= 0)  mouthDir =  1;

        for (let i = GHOST_COLORS.length - 1; i >= 0; i--) {
            drawGhost(pacX - PAC_LEAD - i * GHOST_GAP, PAC_Y, GHOST_COLORS[i], i * 0.9, t);
        }

        drawPacman(pacX, PAC_Y, mouthAngle);

        const pct = Math.max(0, Math.min(100, (pacX / W) * 100));
        fillEl.style.width = pct + '%';

        rafId = requestAnimationFrame(tick);
    }

    function doHide() {
        cancelAnimationFrame(rafId);
        overlay.classList.add('hidden');
        overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    }

    tick();

    function onPageLoad() {
        pageLoaded = true;
    }

    if (document.readyState === 'complete') {
        onPageLoad();
    } else {
        window.addEventListener('load', onPageLoad);
    }
})();
