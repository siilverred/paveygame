import type { CityTheme, CollectibleType, DestinationVibe, Obstacle, PlayerState, TinTinColor } from './types';

// Palette definitions matching Pavey Design System (Light / Bright aesthetic)
export const PALETTE = {
  brandNavy: '#0B1020',
  brandDeepBlue: '#172A8C',
  brandBlue: '#3B5BFF',
  brandLightBlue: '#EEF2FF',
  brandAccentCoral: '#F97316',
  brandAccentEmerald: '#10B981',
  brandAccentPurple: '#A855F7',
  brandGold: '#FBBF24',
  ink900: '#0B1020',
  ink800: '#1A1F2E',
  ink700: '#2A3142',
  ink500: '#697490',
  ink300: '#B7BECF',
  ink200: '#DDE2EC',
  ink100: '#EEF1F7',
  ink50: '#F6F8FC',
  roadLight: '#FFFFFF',
  roadBorder: '#3B5BFF',
  roadLaneDivider: 'rgba(59, 91, 255, 0.25)',
  roadLaneActive: 'rgba(59, 91, 255, 0.14)',
};

// Preload the official TinTin mascot vector image
const mascotImage: HTMLImageElement | null = typeof Image !== 'undefined' ? new Image() : null;
if (mascotImage) {
  mascotImage.src = '/mascot.svg';
}

const COLOR_TINTS: Record<
  TinTinColor,
  { primary: string; secondary: string; backpack: string; badge: string; filter: string }
> = {
  blue: {
    primary: '#3B5BFF',
    secondary: '#2746F0',
    backpack: '#F97316',
    badge: '#3B5BFF',
    filter: 'none',
  },
  coral: {
    primary: '#F97316',
    secondary: '#EA580C',
    backpack: '#3B5BFF',
    badge: '#F97316',
    filter: 'hue-rotate(155deg) saturate(1.4) brightness(1.05)',
  },
  emerald: {
    primary: '#10B981',
    secondary: '#059669',
    backpack: '#A855F7',
    badge: '#10B981',
    filter: 'hue-rotate(240deg) saturate(1.2) brightness(1.1)',
  },
  purple: {
    primary: '#A855F7',
    secondary: '#9333EA',
    backpack: '#FBBF24',
    badge: '#A855F7',
    filter: 'hue-rotate(310deg) saturate(1.3)',
  },
};

/**
 * Draw TinTin the Bear Mascot (Zoomed-in, Clear & Bold)
 */
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  x: number,
  y: number,
  runCycle: number,
  isInvincible: boolean,
  invincibleTimer: number
) {
  if (!player.isAlive) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OUT', 0, 4);
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.translate(x, y);

  // Invincibility blink
  if (isInvincible && Math.floor(invincibleTimer * 16) % 2 === 0) {
    ctx.globalAlpha = 0.45;
  }

  const tint = COLOR_TINTS[player.color] || COLOR_TINTS.blue;

  // ── 1. AI Invincibility Shield Bubble ──
  if (player.speedBoostTimer > 0 || (isInvincible && player.speedBoostTimer > 0)) {
    ctx.save();
    const shieldPulse = Math.sin(runCycle * 8) * 4;

    const shieldGrad = ctx.createRadialGradient(0, -8, 25, 0, -8, 56 + shieldPulse);
    shieldGrad.addColorStop(0, `${tint.primary}18`);
    shieldGrad.addColorStop(0.7, `${tint.primary}40`);
    shieldGrad.addColorStop(1, tint.primary);

    ctx.beginPath();
    ctx.arc(0, -8, 52 + shieldPulse, 0, Math.PI * 2);
    ctx.fillStyle = shieldGrad;
    ctx.fill();
    ctx.strokeStyle = tint.primary;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Orbiting AI Stars
    for (let s = 0; s < 3; s++) {
      const angle = runCycle * 5 + (s * Math.PI * 2) / 3;
      const sx = Math.cos(angle) * (56 + shieldPulse);
      const sy = -8 + Math.sin(angle) * (56 + shieldPulse);
      ctx.beginPath();
      ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = s === 0 ? '#FBBF24' : s === 1 ? '#38BDF8' : tint.primary;
      ctx.fill();
    }
    ctx.restore();
  }

  // ── 2. Ground Shadow ──
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 30, 26, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
  ctx.fill();
  ctx.restore();

  // ── 3. Player Identifier Tag Above Head (P1, P2, BOT 🤖) ──
  ctx.save();
  const tagY = -66;
  const tagText = player.isBot ? 'BOT 🤖' : player.name || 'P1';

  ctx.fillStyle = tint.primary;
  ctx.beginPath();
  ctx.roundRect(-26, tagY, 52, 22, 11);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tagText, 0, tagY + 11);
  ctx.restore();

  // ── 4. Running Dynamics ──
  const legPhase = Math.sin(runCycle * 14);
  const bounce = Math.abs(Math.sin(runCycle * 14)) * 4.5;
  const tilt = Math.sin(runCycle * 14) * 0.05;

  // Back Leg
  ctx.save();
  ctx.fillStyle = tint.secondary;
  ctx.beginPath();
  const backLegX = -6 - legPhase * 10;
  const backLegY = 8 - bounce;
  ctx.roundRect(backLegX, backLegY, 10, 22, 5);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(backLegX - legPhase * 3, backLegY + 16, 13, 7, 3.5);
  ctx.fill();
  ctx.restore();

  // Backpack on back
  ctx.save();
  ctx.fillStyle = tint.backpack;
  ctx.beginPath();
  ctx.roundRect(-24, -20 - bounce, 20, 30, 7);
  ctx.fill();
  ctx.fillStyle = '#FBBF24';
  ctx.beginPath();
  ctx.arc(-20, -3 - bounce, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ── 5. OFFICIAL TINTIN MASCOT ──
  ctx.save();
  ctx.translate(0, -14 - bounce);
  ctx.rotate(tilt);

  if (mascotImage && mascotImage.complete && mascotImage.naturalWidth > 0) {
    if (tint.filter && tint.filter !== 'none') {
      ctx.filter = tint.filter;
    }
    const mWidth = 66;
    const mHeight = 70;
    ctx.drawImage(mascotImage, -mWidth / 2, -mHeight / 2 - 3, mWidth, mHeight);
  } else {
    ctx.fillStyle = tint.primary;
    ctx.beginPath();
    ctx.arc(0, -8, 24, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Front Leg
  ctx.save();
  ctx.fillStyle = tint.secondary;
  ctx.beginPath();
  const frontLegX = 6 + legPhase * 10;
  const frontLegY = 8 - bounce;
  ctx.roundRect(frontLegX, frontLegY, 10, 22, 5);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(frontLegX + legPhase * 3, frontLegY + 16, 13, 7, 3.5);
  ctx.fill();
  ctx.restore();

  // Front Paw with Smartphone
  ctx.save();
  ctx.fillStyle = tint.primary;
  ctx.beginPath();
  const armX = 15;
  const armY = -8 - bounce;
  ctx.roundRect(armX, armY, 9, 16, 4.5);
  ctx.fill();
  ctx.fillStyle = '#0B1020';
  ctx.beginPath();
  ctx.roundRect(armX + 3, armY + 7, 7, 10, 2);
  ctx.fill();
  ctx.fillStyle = '#38BDF8';
  ctx.fillRect(armX + 4.5, armY + 8.5, 4, 7);
  ctx.restore();

  ctx.restore();
}

/**
 * Draw Lane Obstacles
 */
export function drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle, animTime: number) {
  ctx.save();
  ctx.translate(obs.x, 0);

  const baseY = obs.height - 4;

  if (obs.type === 'tourist_crowd') {
    // Tourist Group
    ctx.fillStyle = '#EC4899';
    ctx.beginPath();
    ctx.roundRect(-22, baseY - 44, 19, 34, 7);
    ctx.fill();
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(-12, baseY - 52, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.roundRect(-6, baseY - 48, 22, 38, 8);
    ctx.fill();
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(5, baseY - 58, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.ellipse(5, baseY - 66, 19, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(11, baseY - 38);
    ctx.lineTo(34, baseY - 68);
    ctx.stroke();

    ctx.fillStyle = '#8B5CF6';
    ctx.beginPath();
    ctx.roundRect(14, baseY - 42, 19, 32, 7);
    ctx.fill();
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(23, baseY - 50, 10, 0, Math.PI * 2);
    ctx.fill();
  } else if (obs.type === 'construction') {
    // Road Barrier
    drawTrafficCone(ctx, -20, baseY);

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(-10, baseY - 42, 50, 30, 7);
    ctx.fill();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#EA580C';
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-10, baseY - 42, 50, 30, 7);
    ctx.clip();
    for (let i = -24; i < 60; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, baseY - 44);
      ctx.lineTo(i + 11, baseY - 44);
      ctx.lineTo(i - 3, baseY - 8);
      ctx.lineTo(i - 14, baseY - 8);
      ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = '#334155';
    ctx.fillRect(-8, baseY - 10, 5, 10);
    ctx.fillRect(32, baseY - 10, 5, 10);

    drawTrafficCone(ctx, 44, baseY);
  } else if (obs.type === 'water_hazard') {
    // Water puddle
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(14, baseY, 38, 11, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.fill();
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    drawTrafficCone(ctx, 14, baseY + 2);
    ctx.restore();
  } else {
    // Luggage pile
    ctx.fillStyle = '#3B5BFF';
    ctx.beginPath();
    ctx.roundRect(-14, baseY - 32, 30, 24, 6);
    ctx.fill();
    ctx.fillStyle = '#1D4ED8';
    ctx.fillRect(-8, baseY - 38, 18, 6);

    ctx.fillStyle = '#F97316';
    ctx.beginPath();
    ctx.roundRect(8, baseY - 28, 28, 22, 6);
    ctx.fill();
  }

  ctx.restore();
}

function drawTrafficCone(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = '#F97316';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 7, y - 26);
  ctx.lineTo(x + 12, y - 26);
  ctx.lineTo(x + 19, y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(x + 3, y - 9);
  ctx.lineTo(x + 5.5, y - 18);
  ctx.lineTo(x + 13.5, y - 18);
  ctx.lineTo(x + 16, y - 9);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#C2410C';
  ctx.fillRect(x - 3, y - 3, 25, 5);
  ctx.restore();
}

/**
 * Draw Collectibles (Coins, Stars, Big Tourism Milestone Pins)
 */
export function drawCollectible(
  ctx: CanvasRenderingContext2D,
  col: {
    type: CollectibleType;
    vibe?: DestinationVibe;
    spotName?: string;
    spotIcon?: string;
    x: number;
    scale: number;
    rotation: number;
  },
  y: number,
  animTime: number
) {
  ctx.save();
  const floatY = y + Math.sin(animTime * 4 + col.x * 0.05) * 6;
  ctx.translate(col.x, floatY);
  ctx.scale(col.scale, col.scale);

  if (col.type === 'coin') {
    const spin = Math.cos(animTime * 5);
    ctx.save();
    ctx.scale(Math.abs(spin) < 0.1 ? 0.1 : spin, 1);

    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 1);
    ctx.restore();
  } else if (col.type === 'star') {
    ctx.save();
    ctx.rotate(animTime * 2.2);

    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
    ctx.fill();

    drawStar(ctx, 0, 0, 5, 20, 9, '#FACC15', '#EA580C');
    ctx.restore();
  } else if (col.type === 'destination') {
    const vibe = col.vibe || 'cultural';
    let color = '#3B5BFF';
    let iconSymbol = col.spotIcon || '🏛️';

    if (vibe === 'cafe') color = '#F97316';
    else if (vibe === 'nature') color = '#10B981';
    else if (vibe === 'cultural') color = '#A855F7';
    else if (vibe === 'balanced') color = '#0284C7';

    const pulse = 1 + Math.sin(animTime * 6) * 0.12;
    ctx.beginPath();
    ctx.arc(0, -10, 26 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = `${color}35`;
    ctx.fill();

    // Big Pin Body
    ctx.beginPath();
    ctx.arc(0, -10, 20, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-10, -2);
    ctx.lineTo(0, 14);
    ctx.lineTo(10, -2);
    ctx.fillStyle = color;
    ctx.fill();

    // Large Emoji Icon
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(iconSymbol, 0, -10);

    // High-contrast place name badge
    if (col.spotName) {
      ctx.save();
      const nameText = col.spotName;
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      const textWidth = ctx.measureText(nameText).width;

      ctx.fillStyle = '#0B1020';
      ctx.beginPath();
      ctx.roundRect(-textWidth / 2 - 12, -50, textWidth + 24, 24, 12);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(nameText, 0, -38);
      ctx.restore();
    }
  }

  ctx.restore();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  fillColor: string,
  strokeColor: string
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.stroke();
}

/**
 * Draw Parallax Backgrounds (Medan, Jakarta, Bandung)
 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cameraX: number,
  city: CityTheme,
  isIndoor: boolean,
  indoorTransitionPct: number,
  animTime: number,
  isStormy: boolean
) {
  ctx.save();

  // 1. SKY GRADIENT
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  if (isIndoor) {
    skyGrad.addColorStop(0, '#EEF2FF');
    skyGrad.addColorStop(0.5, '#E0E7FF');
    skyGrad.addColorStop(1, '#F3E8FF');
  } else if (isStormy) {
    skyGrad.addColorStop(0, '#1E293B');
    skyGrad.addColorStop(0.5, '#334155');
    skyGrad.addColorStop(1, '#475569');
  } else if (city === 'medan') {
    skyGrad.addColorStop(0, '#E0F2FE');
    skyGrad.addColorStop(0.5, '#F0F9FF');
    skyGrad.addColorStop(1, '#FEF3C7');
  } else if (city === 'bandung') {
    skyGrad.addColorStop(0, '#E0E7FF');
    skyGrad.addColorStop(0.5, '#F0FDF4');
    skyGrad.addColorStop(1, '#EDE9FE');
  } else {
    skyGrad.addColorStop(0, '#E0E7FF');
    skyGrad.addColorStop(0.5, '#EEF2FF');
    skyGrad.addColorStop(1, '#F8FAFC');
  }

  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. PARALLAX LAYER 1 — Fluffy Clouds (Speed 0.05)
  ctx.save();
  const cloudOffset = (cameraX * 0.05) % width;
  ctx.translate(-cloudOffset, 0);
  for (let rep = 0; rep < 2; rep++) {
    const rx = rep * width;
    ctx.fillStyle = isStormy ? 'rgba(71, 85, 105, 0.6)' : 'rgba(255, 255, 255, 0.8)';
    drawCloud(ctx, rx + 60, height * 0.12, 55);
    drawCloud(ctx, rx + width * 0.45, height * 0.08, 70);
    drawCloud(ctx, rx + width * 0.8, height * 0.15, 50);
  }
  ctx.restore();

  // 3. PARALLAX LAYER 2 — Distant Hills (Speed 0.12)
  ctx.save();
  const l1Offset = (cameraX * 0.12) % width;
  ctx.translate(-l1Offset, 0);

  for (let rep = 0; rep < 2; rep++) {
    const rx = rep * width;
    ctx.fillStyle = isStormy ? '#334155' : '#CBD5E1';

    if (city === 'medan') {
      ctx.beginPath();
      ctx.moveTo(rx, height * 0.42);
      ctx.lineTo(rx + width * 0.3, height * 0.25);
      ctx.lineTo(rx + width * 0.6, height * 0.30);
      ctx.lineTo(rx + width * 0.85, height * 0.22);
      ctx.lineTo(rx + width, height * 0.42);
      ctx.lineTo(rx + width, height);
      ctx.lineTo(rx, height);
      ctx.fill();
    } else if (city === 'bandung') {
      ctx.beginPath();
      ctx.moveTo(rx, height * 0.42);
      ctx.lineTo(rx + width * 0.2, height * 0.42);
      ctx.lineTo(rx + width * 0.4, height * 0.22);
      ctx.lineTo(rx + width * 0.6, height * 0.22);
      ctx.lineTo(rx + width * 0.8, height * 0.42);
      ctx.lineTo(rx + width, height * 0.42);
      ctx.lineTo(rx, height);
      ctx.fill();
    } else {
      for (let bx = 0; bx < width; bx += 70) {
        const bHeight = 70 + Math.sin(bx * 0.04) * 35;
        ctx.fillRect(rx + bx, height * 0.42 - bHeight, 55, bHeight + 100);
      }
    }
  }
  ctx.restore();

  // 4. PARALLAX LAYER 3 — City Landmarks (Speed 0.25)
  ctx.save();
  const l2Offset = (cameraX * 0.25) % width;
  ctx.translate(-l2Offset, 0);

  for (let rep = 0; rep < 2; rep++) {
    const rx = rep * width;
    ctx.fillStyle = isStormy ? '#475569' : '#94A3B8';

    if (city === 'medan') {
      drawMedanSkyline(ctx, rx, height * 0.43, width);
    } else if (city === 'bandung') {
      drawBandungSkyline(ctx, rx, height * 0.43, width);
    } else {
      drawJakartaSkyline(ctx, rx, height * 0.43, width, animTime);
    }
  }
  ctx.restore();

  // 5. INDOOR ATRIUM OVERLAY
  if (indoorTransitionPct > 0) {
    ctx.save();
    ctx.globalAlpha = indoorTransitionPct;

    const indoorGrad = ctx.createLinearGradient(0, 0, 0, height);
    indoorGrad.addColorStop(0, '#EEF2FF');
    indoorGrad.addColorStop(0.6, '#F8FAFC');
    indoorGrad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = indoorGrad;
    ctx.fillRect(0, 0, width, height * 0.45);

    for (let lx = 40; lx < width; lx += 90) {
      const lampX = (lx - (cameraX * 0.5) % 90 + width) % width;
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lampX, 0);
      ctx.lineTo(lampX, 48);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(lampX, 52, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#FDE68A';
      ctx.fill();

      const coneGrad = ctx.createRadialGradient(lampX, 52, 4, lampX, 52, 42);
      coneGrad.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
      coneGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.arc(lampX, 52, 42, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.arc(x, y, size * 0.35, 0, Math.PI * 2);
  ctx.arc(x + size * 0.3, y - size * 0.15, size * 0.4, 0, Math.PI * 2);
  ctx.arc(x + size * 0.65, y, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawMedanSkyline(ctx: CanvasRenderingContext2D, rx: number, groundY: number, width: number) {
  const mX = rx + width * 0.35;
  ctx.fillRect(mX - 25, groundY - 35, 50, 35);
  ctx.fillRect(mX - 10, groundY - 55, 20, 20);
  ctx.beginPath();
  ctx.arc(mX, groundY - 60, 12, 0, Math.PI, true);
  ctx.fill();

  const tX = rx + width * 0.75;
  ctx.fillRect(tX - 8, groundY - 70, 16, 70);
  ctx.fillRect(tX - 14, groundY - 80, 28, 12);
  ctx.beginPath();
  ctx.arc(tX, groundY - 84, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawBandungSkyline(ctx: CanvasRenderingContext2D, rx: number, groundY: number, width: number) {
  const sX = rx + width * 0.4;
  ctx.fillRect(sX - 35, groundY - 32, 70, 32);
  ctx.fillRect(sX - 12, groundY - 55, 24, 23);
  ctx.fillRect(sX - 3, groundY - 74, 6, 19);
  ctx.beginPath();
  ctx.arc(sX, groundY - 78, 5, 0, Math.PI * 2);
  ctx.fill();

  const pX = rx + width * 0.8;
  ctx.beginPath();
  ctx.moveTo(pX, groundY - 70);
  ctx.lineTo(pX - 30, groundY);
  ctx.lineTo(pX + 30, groundY);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = ctx.fillStyle;
  ctx.stroke();
}

function drawJakartaSkyline(ctx: CanvasRenderingContext2D, rx: number, groundY: number, width: number, animTime: number) {
  for (let bx = 0; bx < width; bx += 85) {
    const tx = rx + bx;
    const bHeight = 75 + ((bx * 53) % 65);
    ctx.fillRect(tx, groundY - bHeight, 60, bHeight);

    ctx.fillStyle = 'rgba(59, 91, 255, 0.35)';
    ctx.fillRect(tx + 6, groundY - bHeight + 8, 48, bHeight - 16);
    ctx.fillStyle = '#94A3B8';
  }

  const mX = rx + width * 0.3;
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(mX - 12, groundY - 32, 24, 32);
  ctx.fillRect(mX - 4, groundY - 85, 8, 53);
  ctx.fillStyle = Math.sin(animTime * 8) > 0 ? '#FBBF24' : '#F59E0B';
  ctx.beginPath();
  ctx.arc(mX, groundY - 90, 5.5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draw 3-Lane Track (Balanced Vertical Position)
 */
export function drawTrack(
  ctx: CanvasRenderingContext2D,
  width: number,
  roadY: number,
  roadHeight: number,
  cameraX: number,
  activeLaneP1: number,
  activeLaneP2: number | null,
  isIndoor: boolean
) {
  ctx.save();

  // Track Surface Base
  ctx.fillStyle = isIndoor ? '#FAF5FF' : '#FFFFFF';
  ctx.fillRect(0, roadY, width, roadHeight);

  // Top Curb Line (Brand Blue)
  ctx.fillStyle = '#3B5BFF';
  ctx.fillRect(0, roadY, width, 5);

  // Bottom Curb Line (Brand Blue Darker)
  ctx.fillStyle = '#2746F0';
  ctx.fillRect(0, roadY + roadHeight - 5, width, 5);

  const laneHeight = roadHeight / 3;

  // Active Lane Highlight Band for P1
  ctx.fillStyle = 'rgba(59, 91, 255, 0.14)';
  ctx.fillRect(0, roadY + activeLaneP1 * laneHeight, width, laneHeight);

  // Active Lane Highlight Band for P2
  if (activeLaneP2 !== null && activeLaneP2 !== activeLaneP1) {
    ctx.fillStyle = 'rgba(249, 115, 22, 0.14)';
    ctx.fillRect(0, roadY + activeLaneP2 * laneHeight, width, laneHeight);
  }

  // Lane Dividers (Dashed Blue Lines)
  const dashOffset = (cameraX * 1.0) % 40;
  ctx.strokeStyle = 'rgba(59, 91, 255, 0.28)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([22, 22]);
  ctx.lineDashOffset = -dashOffset;

  ctx.beginPath();
  ctx.moveTo(0, roadY + laneHeight);
  ctx.lineTo(width, roadY + laneHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, roadY + laneHeight * 2);
  ctx.lineTo(width, roadY + laneHeight * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw Decorative City Promenade Below the 3 Lanes
 */
export function drawPromenade(
  ctx: CanvasRenderingContext2D,
  width: number,
  promenadeY: number,
  promenadeHeight: number,
  cameraX: number,
  city: CityTheme,
  isIndoor: boolean
) {
  ctx.save();
  ctx.translate(0, promenadeY);

  // 1. Sidewalk Base Floor
  ctx.fillStyle = isIndoor ? '#F3E8FF' : '#EEF2FF';
  ctx.fillRect(0, 0, width, promenadeHeight);

  // 2. Green Grass Curb Strip
  ctx.fillStyle = isIndoor ? '#C084FC' : '#10B981';
  ctx.fillRect(0, 0, width, 7);

  // 3. Tile Dividers
  const tileOffset = (cameraX * 0.8) % 60;
  ctx.strokeStyle = isIndoor ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 91, 255, 0.15)';
  ctx.lineWidth = 1.5;
  for (let tx = -tileOffset; tx < width + 60; tx += 60) {
    ctx.beginPath();
    ctx.moveTo(tx, 7);
    ctx.lineTo(tx, promenadeHeight);
    ctx.stroke();
  }

  // 4. Parallax Decorative Items (Potted Plants & Street Lamps)
  const itemOffset = (cameraX * 0.8) % 180;
  for (let ix = -itemOffset; ix < width + 180; ix += 180) {
    // Potted Tropical Plant
    ctx.fillStyle = '#EA580C';
    ctx.beginPath();
    ctx.roundRect(ix + 35, 12, 16, 12, 3);
    ctx.fill();

    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(ix + 43, 9, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(ix + 40, 6, 6, 0, Math.PI * 2);
    ctx.arc(ix + 46, 6, 6, 0, Math.PI * 2);
    ctx.fill();

    // Flowers
    ctx.fillStyle = '#F43F5E';
    ctx.beginPath();
    ctx.arc(ix + 43, 6, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Street Lamp
    ctx.fillStyle = '#334155';
    ctx.fillRect(ix + 120, 8, 3.5, 26);
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(ix + 122, 8, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.beginPath();
    ctx.arc(ix + 122, 8, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Pavey Brand Tag
  ctx.fillStyle = 'rgba(59, 91, 255, 0.35)';
  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`📍 PAVEY • ${city.toUpperCase()}`, width - 14, promenadeHeight - 8);

  ctx.restore();
}
