/**
 * Room Canvas Renderer — 1:1 port of the original HTML canvas animation.
 * All light effects, furniture, grids, window, and lamp logic preserved.
 */

export interface RenderState {
    currentT: number;
    targetT: number;
    slideP: number[];
    W: number;
    H: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerpRGB = (a: number[], b: number[], t: number) => [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t))
];
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const col = (r: number, g: number, b: number, a = 1) => `rgba(${r},${g},${b},${a})`;

export function renderRoom(
    ctx: CanvasRenderingContext2D,
    s: RenderState,
    lampOn: boolean,
    errorFlash = 0   // 0 = off, 0..1 = red intensity
) {
    const { currentT: t, slideP, W, H } = s;
    if (!W || !H) return;

    ctx.clearRect(0, 0, W, H);

    const vpX = W * 0.5;
    const vpY = H * 0.34;
    const fwW = W * 0.28;
    const fwH = H * 0.30;
    const fwL = vpX - fwW / 2;
    const fwR = vpX + fwW / 2;
    const fwT = vpY - fwH * 0.40;
    const fwB = vpY + fwH * 0.60;
    const rL = 0, rR = W, rT = 0, rB = H;

    const warmTint = (r: number, g: number, b: number, a: number) => {
        if (!lampOn) return `rgba(${r},${g},${b},${a})`;
        return `rgba(${Math.min(255, r + 18)},${Math.min(255, g + 10)},${Math.max(0, b - 8)},${a})`;
    };
    const objA = (n: number) => clamp(slideP[n], 0, 1);
    const objDY = (n: number) => (1 - (1 - Math.pow(1 - clamp(slideP[n], 0, 1), 3))) * -28;
    const persp = (xOff: number, zFrac: number, yFrac: number, dy = 0): [number, number] => {
        const scale = 1 / (1 - zFrac * 0.85);
        return [vpX + xOff * scale, lerp(lerp(fwT, fwB, yFrac), lerp(rT, rB, yFrac), zFrac) + dy];
    };

    // ── ROOM SHELL ──
    const farWall = lerpRGB([25, 23, 21], [68, 64, 58], t);
    const ceilCol = lerpRGB([18, 17, 15], [45, 42, 38], t);
    const floorCol = lerpRGB([16, 15, 13], [36, 33, 29], t);
    const lwCol = lerpRGB([20, 18, 16], [50, 47, 42], t);
    const rwCol = lerpRGB([20, 18, 16], [44, 41, 37], t);

    // Far Wall
    ctx.fillStyle = rgba(farWall, 1);
    ctx.fillRect(fwL, fwT, fwW, fwH);

    // Ceiling
    ctx.beginPath();
    ctx.moveTo(rL, rT); ctx.lineTo(rR, rT); ctx.lineTo(fwR, fwT); ctx.lineTo(fwL, fwT);
    ctx.closePath();
    const cG = ctx.createLinearGradient(0, rT, 0, fwT);
    cG.addColorStop(0, rgba(lerpRGB(ceilCol, [5, 4, 3], 0.7), 1));
    cG.addColorStop(1, rgba(ceilCol, 1));
    ctx.fillStyle = cG; ctx.fill();

    // Floor
    ctx.beginPath();
    ctx.moveTo(rL, rB); ctx.lineTo(rR, rB); ctx.lineTo(fwR, fwB); ctx.lineTo(fwL, fwB);
    ctx.closePath();
    const fG = ctx.createLinearGradient(0, rB, 0, fwB);
    fG.addColorStop(0, rgba(lerpRGB(floorCol, [5, 4, 3], 0.7), 1));
    fG.addColorStop(1, rgba(floorCol, 1));
    ctx.fillStyle = fG; ctx.fill();

    // Left Wall
    ctx.beginPath();
    ctx.moveTo(rL, rT); ctx.lineTo(rL, rB); ctx.lineTo(fwL, fwB); ctx.lineTo(fwL, fwT);
    ctx.closePath();
    const lwG = ctx.createLinearGradient(rL, 0, fwL, 0);
    lwG.addColorStop(0, rgba(lerpRGB(lwCol, [5, 4, 3], 0.7), 1));
    lwG.addColorStop(1, rgba(lwCol, 1));
    ctx.fillStyle = lwG; ctx.fill();

    // Right Wall
    ctx.beginPath();
    ctx.moveTo(rR, rT); ctx.lineTo(rR, rB); ctx.lineTo(fwR, fwB); ctx.lineTo(fwR, fwT);
    ctx.closePath();
    const rwG = ctx.createLinearGradient(rR, 0, fwR, 0);
    rwG.addColorStop(0, rgba(lerpRGB(rwCol, [5, 4, 3], 0.7), 1));
    rwG.addColorStop(1, rgba(rwCol, 1));
    ctx.fillStyle = rwG; ctx.fill();

    // Edge lines
    const eA = clamp(0.06 + t * 0.16, 0, 0.26);
    ctx.strokeStyle = col(255, 255, 255, eA); ctx.lineWidth = 0.6;
    [[rL, rT, fwL, fwT], [rR, rT, fwR, fwT], [rL, rB, fwL, fwB], [rR, rB, fwR, fwB]].forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });
    ctx.strokeStyle = col(255, 255, 255, eA * 0.5); ctx.lineWidth = 0.4;
    ctx.strokeRect(fwL, fwT, fwW, fwH);

    // ── FLOOR GRID ──
    {
        const gA = clamp(0.03 + t * 0.09, 0, 0.13);
        ctx.strokeStyle = col(255, 255, 255, gA); ctx.lineWidth = 0.35;
        for (let i = 1; i <= 5; i++) {
            const f = i / 6, y = lerp(fwB, rB, f);
            const xL = lerp(fwL, rL, f), xR = lerp(fwR, rR, f);
            ctx.beginPath(); ctx.moveTo(xL, y); ctx.lineTo(xR, y); ctx.stroke();
        }
        for (let i = 1; i <= 6; i++) {
            const f = i / 7, xFW = lerp(fwL, fwR, f);
            const slope = (xFW - vpX) / (fwB - vpY);
            const xBot = vpX + slope * (rB - vpY);
            ctx.beginPath(); ctx.moveTo(xFW, fwB); ctx.lineTo(xBot, rB); ctx.stroke();
        }
    }

    // ── CEILING GRID ──
    {
        const gA = clamp(0.02 + t * 0.06, 0, 0.09);
        ctx.strokeStyle = col(255, 255, 255, gA); ctx.lineWidth = 0.3;
        for (let i = 1; i <= 3; i++) {
            const f = i / 4, y = lerp(fwT, rT, f);
            const xL = lerp(fwL, rL, f), xR = lerp(fwR, rR, f);
            ctx.beginPath(); ctx.moveTo(xL, y); ctx.lineTo(xR, y); ctx.stroke();
        }
        for (let i = 1; i <= 4; i++) {
            const f = i / 5, xFW = lerp(fwL, fwR, f);
            const slope = (xFW - vpX) / (fwT - vpY);
            const xTop = vpX + slope * (rT - vpY);
            ctx.beginPath(); ctx.moveTo(xFW, fwT); ctx.lineTo(xTop, rT); ctx.stroke();
        }
    }

    // ── WINDOW ──
    {
        const wA = clamp(0.10 + t * 0.9, 0, 1);
        const wX = fwL + fwW * 0.15, wY = fwT + fwH * 0.07;
        const wW = fwW * 0.70, wH = fwH * 0.58;
        const spread = Math.max(wW, wH) * 3.5;
        const wGl = ctx.createRadialGradient(wX + wW / 2, wY + wH / 2, 0, wX + wW / 2, wY + wH / 2, spread);
        wGl.addColorStop(0, col(155, 175, 210, wA * 0.10));
        wGl.addColorStop(0.5, col(130, 150, 185, wA * 0.04));
        wGl.addColorStop(1, col(100, 120, 160, 0));
        ctx.fillStyle = wGl;
        ctx.fillRect(fwL - spread * 0.4, fwT - spread * 0.3, fwW + spread * 0.8, fwH + spread * 0.6);
        ctx.fillStyle = col(145, 170, 210, wA * 0.07); ctx.fillRect(wX, wY, wW, wH);
        ctx.strokeStyle = col(210, 210, 210, wA * 0.22); ctx.lineWidth = 1; ctx.strokeRect(wX, wY, wW, wH);
        // Mullions — vertical
        ctx.strokeStyle = col(190, 190, 190, wA * 0.16); ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(wX + wW * 0.5, wY + 1); ctx.lineTo(wX + wW * 0.5, wY + wH - 1); ctx.stroke();
        // Mullions — horizontal
        ctx.beginPath(); ctx.moveTo(wX + 1, wY + wH * 0.44); ctx.lineTo(wX + wW - 1, wY + wH * 0.44); ctx.stroke();
        // Light shaft on floor
        if (t > 0.08) {
            const sa = clamp((t - 0.08) / 0.5, 0, 1) * 0.04;
            ctx.save(); ctx.beginPath();
            ctx.moveTo(wX + wW * 0.05, wY + wH); ctx.lineTo(wX + wW * 0.95, wY + wH);
            ctx.lineTo(vpX + wW * 1.6, rB); ctx.lineTo(vpX - wW * 1.6, rB); ctx.closePath();
            const sG = ctx.createLinearGradient(0, fwB, 0, rB);
            sG.addColorStop(0, col(150, 175, 215, sa)); sG.addColorStop(1, col(150, 175, 215, 0));
            ctx.fillStyle = sG; ctx.fill(); ctx.restore();
        }
    }

    // ── OBJECT 4: ARTWORK (far wall) ──
    {
        const a = objA(4), dy = objDY(4);
        if (a > 0) {
            const pX = fwL + fwW * 0.56, pY = fwT + fwH * 0.06 + dy;
            const pW = fwW * 0.30, pH = fwH * 0.48, pd = 3;
            ctx.fillStyle = `rgba(65,58,50,${a * 0.96})`; ctx.fillRect(pX, pY, pW, pH);
            ctx.fillStyle = `rgba(18,16,14,${a * 0.98})`; ctx.fillRect(pX + pd, pY + pd, pW - pd * 2, pH - pd * 2);
            const ax = pX + pd + 4, ay = pY + pd + 4, aw = pW - pd * 2 - 8, ah = pH - pd * 2 - 8;
            ctx.strokeStyle = `rgba(135,128,118,${a * 0.25})`; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(ax + 2, ay + ah * 0.65); ctx.lineTo(ax + aw - 2, ay + ah * 0.65); ctx.stroke();
            ctx.strokeStyle = `rgba(138,130,120,${a * 0.28})`; ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(ax + aw * 0.20, ay + ah * 0.97); ctx.lineTo(ax + aw * 0.20, ay + ah * 0.52);
            ctx.arc(ax + aw * 0.50, ay + ah * 0.52, aw * 0.30, Math.PI, 0, false);
            ctx.lineTo(ax + aw * 0.80, ay + ah * 0.97); ctx.stroke();
            ctx.strokeStyle = `rgba(115,128,148,${a * 0.18})`; ctx.lineWidth = 0.4;
            ctx.beginPath(); ctx.rect(ax + aw * 0.36, ay + ah * 0.22, aw * 0.28, ah * 0.24); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(ax + aw * 0.50, ay + ah * 0.22); ctx.lineTo(ax + aw * 0.50, ay + ah * 0.46);
            ctx.moveTo(ax + aw * 0.36, ay + ah * 0.34); ctx.lineTo(ax + aw * 0.64, ay + ah * 0.34); ctx.stroke();
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.09})`; ctx.lineWidth = 0.5; ctx.strokeRect(pX, pY, pW, pH);
        }
    }

    // ── CEILING LAMP ──
    const lampX = vpX, lampY = lerp(rT, fwT, 0.20);
    {
        ctx.strokeStyle = col(255, 255, 255, lampOn ? 0.25 : 0.10); ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(lampX, rT + 2); ctx.lineTo(lampX, lampY - 8); ctx.stroke();
        // Shade trapezoid
        ctx.beginPath();
        ctx.moveTo(lampX - 8, lampY + 2); ctx.lineTo(lampX - 16, lampY + 20);
        ctx.lineTo(lampX + 16, lampY + 20); ctx.lineTo(lampX + 8, lampY + 2);
        ctx.closePath();
        ctx.fillStyle = errorFlash > 0
            ? col(255, lerp(248, 80, errorFlash), lerp(228, 80, errorFlash), 0.75)
            : (lampOn ? col(255, 248, 228, 0.75) : col(175, 170, 162, 0.20));
        ctx.fill();
        ctx.strokeStyle = errorFlash > 0
            ? col(255, lerp(235, 60, errorFlash), lerp(170, 60, errorFlash), 0.55)
            : (lampOn ? col(255, 235, 170, 0.55) : col(255, 255, 255, 0.12));
        ctx.lineWidth = 0.6; ctx.stroke();
        // Shade top ellipse
        ctx.beginPath(); ctx.ellipse(lampX, lampY + 2, 8, 2.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = lampOn ? col(255, 248, 228, 0.70) : col(195, 190, 184, 0.18);
        if (errorFlash > 0) ctx.fillStyle = col(255, lerp(248, 50, errorFlash), lerp(228, 50, errorFlash), 0.70);
        ctx.fill();

        if (lampOn || errorFlash > 0) {
            // Tight bloom
            const eF = errorFlash;
            const bloom = ctx.createRadialGradient(lampX, lampY + 12, 0, lampX, lampY + 12, 85);
            bloom.addColorStop(0, col(255, lerp(242, 60, eF), lerp(175, 60, eF), 0.52));
            bloom.addColorStop(0.20, col(255, lerp(225, 50, eF), lerp(135, 50, eF), 0.24));
            bloom.addColorStop(0.55, col(lerp(248, 255, eF), lerp(205, 60, eF), lerp(95, 40, eF), 0.08));
            bloom.addColorStop(1, col(lerp(238, 220, eF), lerp(185, 40, eF), lerp(65, 30, eF), 0));
            ctx.fillStyle = bloom; ctx.fillRect(lampX - 85, lampY - 65, 170, 175);

            // Light cone
            const tipX = lampX, tipY = lampY + 20;
            const fanL = rL - W * 0.15, fanR = rR + W * 0.15, fanY = rB + H * 0.8;
            ctx.save(); ctx.beginPath();
            ctx.moveTo(tipX - 16, tipY); ctx.lineTo(fanL, fanY);
            ctx.lineTo(fanR, fanY); ctx.lineTo(tipX + 16, tipY); ctx.closePath();
            const cR2 = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, H * 0.95);
            cR2.addColorStop(0, col(255, lerp(230, 40, eF), lerp(140, 30, eF), 0.28));
            cR2.addColorStop(0.08, col(252, lerp(220, 35, eF), lerp(125, 25, eF), 0.22));
            cR2.addColorStop(0.22, col(248, lerp(210, 30, eF), lerp(105, 20, eF), 0.14));
            cR2.addColorStop(0.42, col(240, lerp(196, 25, eF), lerp(85, 15, eF), 0.07));
            cR2.addColorStop(0.62, col(230, lerp(180, 20, eF), lerp(65, 10, eF), 0.025));
            cR2.addColorStop(0.82, col(215, lerp(164, 15, eF), lerp(48, 8, eF), 0.005));
            cR2.addColorStop(1, col(200, lerp(150, 10, eF), lerp(38, 5, eF), 0));
            ctx.fillStyle = cR2; ctx.fill(); ctx.restore();

            // Ambient fill
            const amb = ctx.createRadialGradient(lampX, vpY, 0, lampX, vpY, W * 0.90);
            amb.addColorStop(0, col(255, lerp(218, 40, eF), lerp(112, 25, eF), 0.11));
            amb.addColorStop(0.5, col(248, lerp(205, 30, eF), lerp(90, 20, eF), 0.05));
            amb.addColorStop(1, col(235, lerp(185, 20, eF), lerp(68, 10, eF), 0));
            ctx.fillStyle = amb; ctx.fillRect(0, 0, W, H);

            // Floor pool
            const pool = ctx.createRadialGradient(lampX, rB * 0.85, 0, lampX, rB * 0.85, W * 0.72);
            pool.addColorStop(0, col(255, lerp(222, 40, eF), lerp(118, 25, eF), 0.17));
            pool.addColorStop(0.35, col(246, lerp(204, 30, eF), lerp(90, 18, eF), 0.08));
            pool.addColorStop(0.65, col(232, lerp(184, 20, eF), lerp(68, 10, eF), 0.025));
            pool.addColorStop(1, col(210, lerp(162, 15, eF), lerp(50, 5, eF), 0));
            ctx.fillStyle = pool; ctx.fillRect(0, 0, W, H);

            // Ceiling bounce
            const ceil = ctx.createRadialGradient(lampX, rT, 0, lampX, rT, W * 0.60);
            ceil.addColorStop(0, col(255, lerp(228, 40, eF), lerp(132, 25, eF), 0.13));
            ceil.addColorStop(0.6, col(245, lerp(208, 30, eF), lerp(96, 15, eF), 0.04));
            ceil.addColorStop(1, col(235, lerp(188, 20, eF), lerp(74, 10, eF), 0));
            ctx.fillStyle = ceil; ctx.fillRect(0, rT, W, fwT);

            // Left wall warm wash
            const lww = ctx.createLinearGradient(rL, 0, fwL, 0);
            lww.addColorStop(0, col(255, lerp(200, 30, eF), lerp(82, 15, eF), 0));
            lww.addColorStop(1, col(255, lerp(200, 30, eF), lerp(82, 15, eF), 0.09));
            ctx.fillStyle = lww; ctx.fillRect(rL, rT, fwL, rB - rT);

            // Right wall warm wash
            const rww = ctx.createLinearGradient(rR, 0, fwR, 0);
            rww.addColorStop(0, col(255, lerp(200, 30, eF), lerp(82, 15, eF), 0));
            rww.addColorStop(1, col(255, lerp(200, 30, eF), lerp(82, 15, eF), 0.09));
            ctx.fillStyle = rww; ctx.fillRect(fwR, rT, rR - fwR, rB - rT);
        }
    }

    // ── OBJECT 1: RUG ──
    {
        const a = objA(1), dy = objDY(1);
        if (a > 0) {
            const z1 = 0.05, z2 = 0.60;
            const hw1 = fwW * 0.54, hw2 = W * 0.30;
            const y1 = lerp(fwB, rB, z1) + dy, y2 = lerp(fwB, rB, z2) + dy;
            const x1L = vpX - hw1, x1R = vpX + hw1, x2L = vpX - hw2, x2R = vpX + hw2;
            ctx.beginPath(); ctx.moveTo(x1L, y1); ctx.lineTo(x1R, y1); ctx.lineTo(x2R, y2); ctx.lineTo(x2L, y2); ctx.closePath();
            ctx.fillStyle = `rgba(44,38,32,${a * 0.50})`; ctx.fill();
            ctx.beginPath(); ctx.moveTo(x1L + 4, y1 + 2); ctx.lineTo(x1R - 4, y1 + 2); ctx.lineTo(x2R - 7, y2 - 3); ctx.lineTo(x2L + 7, y2 - 3); ctx.closePath();
            ctx.strokeStyle = `rgba(175,155,125,${a * 0.13})`; ctx.lineWidth = 0.7; ctx.stroke();
            const mx = (x2L + x2R) / 2, my = lerp(y1, y2, 0.55), ds = 15;
            ctx.strokeStyle = `rgba(155,135,112,${a * 0.09})`; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(mx, my - ds); ctx.lineTo(mx + ds * 0.5, my); ctx.lineTo(mx, my + ds); ctx.lineTo(mx - ds * 0.5, my); ctx.closePath(); ctx.stroke();
        }
    }

    // ── OBJECT 2: SOFA ──
    {
        const a = objA(2), dy = objDY(2);
        if (a > 0) {
            const sz = 0.22, sdep = 0.20, xL = -fwW * 0.44, xR = fwW * 0.18;
            const [BLx, BLy] = persp(xL, sz, 0.63, dy), [BRx, BRy] = persp(xR, sz, 0.63, dy);
            const [FLx, FLy] = persp(xL, sz + sdep, 0.63, dy), [FRx, FRy] = persp(xR, sz + sdep, 0.63, dy);
            const [FLbx, FLby] = persp(xL, sz + sdep, 0.77, dy), [FRbx, FRby] = persp(xR, sz + sdep, 0.77, dy);
            const [BLtx, BLty] = persp(xL, sz, 0.42, dy), [BRtx, BRty] = persp(xR, sz, 0.42, dy);
            const [ARtx, ARty] = persp(xR, sz, 0.50, dy), [ARbx, ARby] = persp(xR, sz + sdep, 0.50, dy);

            // Ground shadow
            const shG = ctx.createLinearGradient(0, FLby - 2, 0, FLby + 12);
            shG.addColorStop(0, `rgba(0,0,0,${a * 0.28})`); shG.addColorStop(1, `rgba(0,0,0,0)`);
            ctx.fillStyle = shG;
            ctx.beginPath(); ctx.ellipse((FLbx + FRbx) / 2, FLby + 3, (FRbx - FLbx) * 0.52, 5, 0, 0, Math.PI * 2); ctx.fill();

            // Seat front
            ctx.beginPath();
            ctx.moveTo(FLx, FLy); ctx.lineTo(FRx, FRy); ctx.lineTo(FRbx, FRby);
            ctx.bezierCurveTo(FRbx - 4, FRby + 2, FLbx + 4, FLby + 2, FLbx, FLby); ctx.closePath();
            const sfG = ctx.createLinearGradient(0, FLy, 0, FLby);
            sfG.addColorStop(0, warmTint(48, 43, 37, a * 0.95)); sfG.addColorStop(1, warmTint(32, 28, 24, a * 0.95));
            ctx.fillStyle = sfG; ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.03})`; ctx.lineWidth = 0.3; ctx.stroke();

            // Seat top
            ctx.beginPath();
            ctx.moveTo(BLx, BLy);
            ctx.bezierCurveTo(lerp(BLx, BRx, 0.3), BLy - 2, lerp(BLx, BRx, 0.7), BRy - 2, BRx, BRy);
            ctx.lineTo(FRx, FRy);
            ctx.bezierCurveTo(lerp(FRx, FLx, 0.3), FRy + 1, lerp(FRx, FLx, 0.7), FLy + 1, FLx, FLy); ctx.closePath();
            const stG = ctx.createLinearGradient(0, BLy, 0, FLy);
            stG.addColorStop(0, warmTint(82, 75, 65, a * 0.96));
            stG.addColorStop(0.5, warmTint(76, 70, 60, a * 0.96));
            stG.addColorStop(1, warmTint(68, 62, 54, a * 0.96));
            ctx.fillStyle = stG; ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.07})`; ctx.lineWidth = 0.5; ctx.stroke();

            // Backrest
            ctx.beginPath();
            ctx.moveTo(BLtx + 2, BLty + 3);
            ctx.bezierCurveTo(lerp(BLtx, BRtx, 0.3), BLty - 1, lerp(BLtx, BRtx, 0.7), BRty - 1, BRtx - 2, BRty + 3);
            ctx.lineTo(BRx, BRy); ctx.lineTo(BLx, BLy); ctx.closePath();
            const brG = ctx.createLinearGradient(0, BLty, 0, BLy);
            brG.addColorStop(0, warmTint(58, 52, 45, a * 0.96));
            brG.addColorStop(0.6, warmTint(66, 60, 52, a * 0.96));
            brG.addColorStop(1, warmTint(72, 66, 58, a * 0.96));
            ctx.fillStyle = brG; ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.05})`; ctx.lineWidth = 0.4; ctx.stroke();

            // Right armrest
            ctx.beginPath();
            ctx.moveTo(ARtx, ARty); ctx.bezierCurveTo(ARtx + 3, ARty - 2, ARbx + 3, ARby - 1, ARbx, ARby);
            ctx.lineTo(FRx, FRy); ctx.lineTo(BRx, BRy); ctx.closePath();
            ctx.fillStyle = warmTint(70, 64, 55, a * 0.90); ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.04})`; ctx.lineWidth = 0.3; ctx.stroke();

            // Cushions
            for (let i = 0; i < 2; i++) {
                const f0 = i * 0.5 + 0.03, f1 = (i + 1) * 0.5 - 0.03, lift = 3;
                const cBLx = lerp(BLx, BRx, f0), cBLy = lerp(BLy, BRy, f0);
                const cBRx = lerp(BLx, BRx, f1), cBRy = lerp(BLy, BRy, f1);
                const cFLx = lerp(FLx, FRx, f0), cFLy = lerp(FLy, FRy, f0);
                const cFRx = lerp(FLx, FRx, f1), cFRy = lerp(FLy, FRy, f1);
                ctx.beginPath();
                ctx.moveTo(cBLx, cBLy - lift);
                ctx.bezierCurveTo(lerp(cBLx, cBRx, 0.4), cBLy - lift - 2, lerp(cBLx, cBRx, 0.6), cBRy - lift - 2, cBRx, cBRy - lift);
                ctx.lineTo(cFRx, cFRy - lift);
                ctx.bezierCurveTo(lerp(cFRx, cFLx, 0.4), cFRy - lift + 1, lerp(cFRx, cFLx, 0.6), cFLy - lift + 1, cFLx, cFLy - lift);
                ctx.closePath();
                ctx.fillStyle = warmTint(88, 82, 72, a * 0.80); ctx.fill();
                ctx.strokeStyle = `rgba(255,255,255,${a * 0.06})`; ctx.lineWidth = 0.4; ctx.stroke();
            }
        }
    }

    // ── OBJECT 3: COFFEE TABLE ──
    {
        const a = objA(3), dy = objDY(3);
        if (a > 0) {
            const tz = 0.46, tdep = 0.09, thw = fwW * 0.32;
            const [TLx, TLy] = persp(-thw, tz, 0.72, dy);
            const [TRx, TRy] = persp(thw, tz, 0.72, dy);
            const [FLx, FLy] = persp(-thw, tz + tdep, 0.72, dy);
            const [FRx, FRy] = persp(thw, tz + tdep, 0.72, dy);
            const legH = 0.05;
            const [FLbx, FLby] = persp(-thw, tz + tdep, 0.72 + legH, dy);
            const [FRbx, FRby] = persp(thw, tz + tdep, 0.72 + legH, dy);

            // Table top
            ctx.beginPath();
            ctx.moveTo(TLx, TLy); ctx.lineTo(TRx, TRy); ctx.lineTo(FRx, FRy); ctx.lineTo(FLx, FLy); ctx.closePath();
            const ttG = ctx.createLinearGradient(0, TLy, 0, FLy);
            ttG.addColorStop(0, warmTint(100, 92, 80, a * 0.96)); ttG.addColorStop(1, warmTint(80, 73, 62, a * 0.96));
            ctx.fillStyle = ttG; ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.08})`; ctx.lineWidth = 0.5; ctx.stroke();

            // Front apron
            ctx.beginPath();
            ctx.moveTo(FLx, FLy); ctx.lineTo(FRx, FRy); ctx.lineTo(FRbx, FRby); ctx.lineTo(FLbx, FLby); ctx.closePath();
            ctx.fillStyle = warmTint(42, 37, 31, a * 0.95); ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.03})`; ctx.lineWidth = 0.3; ctx.stroke();

            // Objects on table
            const tCX = (TLx + TRx + FLx + FRx) / 4, tCY = (TLy + TRy + FLy + FRy) / 4;
            // Open book
            const bW = 22, bH = 15;
            ctx.save(); ctx.translate(tCX - 7, tCY + 1); ctx.rotate(-0.05);
            ctx.fillStyle = `rgba(195,188,175,${a * 0.88})`; ctx.fillRect(-bW / 2, -bH / 2, bW / 2, bH);
            ctx.fillStyle = `rgba(185,178,165,${a * 0.88})`; ctx.fillRect(0, -bH / 2, bW / 2, bH);
            ctx.strokeStyle = `rgba(60,55,48,${a * 0.90})`; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(0, -bH / 2); ctx.lineTo(0, bH / 2); ctx.stroke();
            ctx.strokeStyle = `rgba(140,130,118,${a * 0.28})`; ctx.lineWidth = 0.5;
            ctx.strokeRect(-bW / 2, -bH / 2, bW, bH);
            ctx.restore();
            // Cup
            const cX = tCX + 14, cY = tCY - 2, cRad = 4, cHt = 12;
            ctx.fillStyle = `rgba(88,82,72,${a * 0.92})`; ctx.fillRect(cX - cRad, cY - cHt, cRad * 2, cHt);
            ctx.beginPath(); ctx.ellipse(cX, cY - cHt, cRad, 1.8, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(110,104,94,${a * 0.88})`; ctx.fill();
            ctx.beginPath(); ctx.ellipse(cX, cY, cRad, 1.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(62,57,50,${a * 0.88})`; ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.06})`; ctx.lineWidth = 0.4; ctx.stroke();
        }
    }

    // ── OBJECT 5: FLOOR LAMP ──
    {
        const a = objA(5), dy = objDY(5);
        if (a > 0) {
            const [lPx, lPy_base] = persp(fwW * 0.40, 0.14, 0.96, dy);
            const lPy_top = lPy_base - H * 0.28;
            const sW = 20, sH = 20;
            // Pole
            ctx.strokeStyle = `rgba(118,112,104,${a * 0.70})`; ctx.lineWidth = 1.3;
            ctx.beginPath(); ctx.moveTo(lPx, lPy_base - 2); ctx.lineTo(lPx, lPy_top + 12); ctx.stroke();
            // Shade
            ctx.beginPath();
            ctx.moveTo(lPx - sW * 0.55, lPy_top + sH); ctx.lineTo(lPx - sW * 0.85, lPy_top + 5);
            ctx.lineTo(lPx + sW * 0.85, lPy_top + 5); ctx.lineTo(lPx + sW * 0.55, lPy_top + sH);
            ctx.closePath();
            ctx.fillStyle = warmTint(86, 80, 70, a * 0.92); ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.07})`; ctx.lineWidth = 0.5; ctx.stroke();
            // Top rim
            ctx.beginPath(); ctx.ellipse(lPx, lPy_top + 5, sW * 0.85, 3.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(78,73,64,${a * 0.90})`; ctx.fill();
            // Bottom rim
            ctx.beginPath(); ctx.ellipse(lPx, lPy_top + sH, sW * 0.55, 2.5, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.06})`; ctx.lineWidth = 0.4; ctx.stroke();
            // Glow
            const glowA = lampOn ? a * 0.22 : a * 0.06, glowR = lampOn ? 38 : 20;
            const glG = ctx.createRadialGradient(lPx, lPy_top + sH * 0.5, 0, lPx, lPy_top + sH * 0.5, glowR);
            glG.addColorStop(0, lampOn ? `rgba(255,215,110,${glowA})` : `rgba(175,170,162,${glowA})`);
            glG.addColorStop(1, `rgba(0,0,0,0)`);
            ctx.fillStyle = glG; ctx.fillRect(lPx - glowR, lPy_top, glowR * 2, sH * 2);
            // Base
            ctx.beginPath(); ctx.ellipse(lPx, lPy_base - 2, 7, 2.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(50,46,40,${a * 0.85})`; ctx.fill();
        }
    }

    // ── OBJECT 6: SHELF + BOOKS ──
    {
        const a = objA(6), dy = objDY(6);
        if (a > 0) {
            const shZfar = 0.10, shZnear = 0.28;
            const shXfar = lerp(fwR, rR, shZfar), shXnear = lerp(fwR, rR, shZnear);
            const wallYfrac = 0.38;
            const shYfar = lerp(fwT + (fwB - fwT) * wallYfrac, rT + (rB - rT) * wallYfrac, shZfar) + dy;
            const shYnear = lerp(fwT + (fwB - fwT) * wallYfrac, rT + (rB - rT) * wallYfrac, shZnear) + dy;
            const shThick = 5;
            // Top surface
            ctx.beginPath();
            ctx.moveTo(shXfar, shYfar); ctx.lineTo(shXnear, shYnear);
            ctx.lineTo(shXnear, shYnear + shThick); ctx.lineTo(shXfar, shYfar + shThick); ctx.closePath();
            ctx.fillStyle = warmTint(65, 60, 52, a * 0.92); ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.08})`; ctx.lineWidth = 0.4; ctx.stroke();
            // Bottom face
            ctx.beginPath();
            ctx.moveTo(shXfar, shYfar + shThick); ctx.lineTo(shXnear, shYnear + shThick);
            ctx.lineTo(shXnear, shYnear + shThick + 3); ctx.lineTo(shXfar, shYfar + shThick + 3); ctx.closePath();
            ctx.fillStyle = `rgba(38,35,30,${a * 0.88})`; ctx.fill();
            // Books
            const slope = (shYnear - shYfar) / (shXnear - shXfar);
            let bxCur = shXfar + (shXnear - shXfar) * 0.06;
            const books: [number, number, number[]][] = [[7, 20, [72, 65, 56]], [9, 24, [84, 76, 65]], [6, 18, [58, 53, 46]], [8, 22, [94, 86, 74]]];
            books.forEach(([bw, bh, bc]) => {
                const byBase = shYfar + slope * (bxCur - shXfar);
                ctx.fillStyle = `rgba(${bc[0]},${bc[1]},${bc[2]},${a * 0.92})`; ctx.fillRect(bxCur, byBase - bh, bw, bh);
                ctx.strokeStyle = `rgba(255,255,255,${a * 0.05})`; ctx.lineWidth = 0.3; ctx.strokeRect(bxCur, byBase - bh, bw, bh);
                ctx.strokeStyle = `rgba(255,255,255,${a * 0.08})`; ctx.lineWidth = 0.3;
                ctx.beginPath(); ctx.moveTo(bxCur + 1.5, byBase - bh); ctx.lineTo(bxCur + 1.5, byBase); ctx.stroke();
                bxCur += bw + 2;
            });
            // Orb
            const oX = bxCur + 5, oY = shYfar + slope * (bxCur + 5 - shXfar) - 5.5;
            const oG = ctx.createRadialGradient(oX - 1.5, oY - 1.5, 1, oX, oY, 5.5);
            oG.addColorStop(0, `rgba(165,160,150,${a * 0.92})`);
            oG.addColorStop(0.6, `rgba(100,96,88,${a * 0.92})`);
            oG.addColorStop(1, `rgba(55,52,46,${a * 0.92})`);
            ctx.beginPath(); ctx.arc(oX, oY, 5.5, 0, Math.PI * 2);
            ctx.fillStyle = oG; ctx.fill();
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.06})`; ctx.lineWidth = 0.3; ctx.stroke();
        }
    }

    // ── VIGNETTE ──
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.12, W / 2, H / 2, H * 0.92);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.58)');
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
}
