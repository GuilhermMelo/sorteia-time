/**
 * Gerador de assets do M&M Sorteia Time.
 *
 * Monta o logo (caricatura de camisa de futebol + bola clássica) como SVG
 * vetorial e rasteriza para os PNGs usados pelo app (ícone, adaptive-icon,
 * splash e o recorte transparente da home).
 *
 * Uso:  node scripts/gen-assets.mjs
 *
 * A geometria da bola é calculada por trigonometria para o padrão de gomos
 * ficar simétrico; a camisa é um path cartoon com contorno grosso. As cores
 * seguem a paleta oficial do manifesto (seção 2.2).
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dirname, '..', 'assets');
mkdirSync(ASSETS, { recursive: true });

// ---- Paleta oficial (seção 2.2) ----
const C = {
  pitch: '#0A0C10',
  verde: '#34E389',
  teal: '#1FB5B2',
  azul: '#2E6FE4',
  chalk: '#F2F2F0',
  ink: '#0A1016', // contorno cartoon (bem escuro)
  ball: '#111820', // preto dos gomos
};

const rad = (deg) => (deg * Math.PI) / 180;

/** Vértices de um polígono regular de `n` lados, girado `rot` graus. */
function poly(cx, cy, r, n, rot = -90) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = rad(rot + (360 / n) * i);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}
const pts2path = (pts) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') + ' Z';

/**
 * Bola de futebol clássica preta e branca no ponto (bx,by), raio R.
 * Pentágono central + 5 gomos na borda + costuras radiais; o padrão inteiro
 * gira `spin` graus (sensação de "rolando"), mas o círculo continua círculo.
 */
function bola(bx, by, R, spin = -14, idSuffix = '') {
  const clip = `ballclip${idSuffix}`;
  const central = poly(bx, by, R * 0.34, 5, -90);
  // costuras: do vértice do pentágono central para fora (radial)
  const seams = central
    .map(([x, y]) => {
      const ang = Math.atan2(y - by, x - bx);
      const ex = bx + Math.cos(ang) * R * 1.05;
      const ey = by + Math.sin(ang) * R * 1.05;
      return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(
        1
      )}" />`;
    })
    .join('');
  // gomos pretos parciais na borda, entre as costuras (ângulos +36° do centro)
  const edge = [];
  for (let i = 0; i < 5; i++) {
    const a = rad(-90 + 36 + 72 * i);
    const gx = bx + Math.cos(a) * R * 0.86;
    const gy = by + Math.sin(a) * R * 0.86;
    edge.push(pts2path(poly(gx, gy, R * 0.28, 5, (-90 + 36 + 72 * i) + 180)));
  }
  return `
  <defs>
    <clipPath id="${clip}"><circle cx="${bx}" cy="${by}" r="${R}"/></clipPath>
  </defs>
  <circle cx="${bx}" cy="${by}" r="${R}" fill="${C.chalk}"/>
  <g clip-path="url(#${clip})">
    <g transform="rotate(${spin} ${bx} ${by})">
      <g stroke="${C.ball}" stroke-width="${R * 0.09}" stroke-linecap="round">${seams}</g>
      ${edge.map((d) => `<path d="${d}" fill="${C.ball}"/>`).join('')}
      <path d="${pts2path(central)}" fill="${C.ball}"/>
    </g>
  </g>
  <circle cx="${bx}" cy="${by}" r="${R}" fill="none" stroke="${C.ink}" stroke-width="${R * 0.11}"/>`;
}

/**
 * Caricatura de camisa de futebol com gradiente verde(embaixo)->azul(cima),
 * contorno cartoon grosso e gola em V tonal. `gid` = id único do gradiente.
 */
function camisa(gid) {
  // contorno externo da camisa (ombros, mangas curtas, corpo trapezoidal)
  const d = `
    M 452 250 Q 512 244 572 250
    L 634 234 Q 702 234 726 253
    L 788 302 Q 815 344 800 375
    L 694 408 Q 689 408 692 435
    L 716 782 Q 719 805 695 809
    L 329 809 Q 305 805 308 782
    L 332 435 Q 335 408 330 408
    L 224 375 Q 209 344 236 302
    L 298 253 Q 322 234 390 234
    L 452 250 Z`;
  // gola em V (recorte tonal, mais escuro que o tecido)
  const gola = `M 452 250 Q 512 268 572 250 L 545 250 Q 512 372 479 250 Z`;
  const y0 = 234, y1 = 809;
  return `
  <defs>
    <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="512" y1="${y0}" x2="512" y2="${y1}">
      <stop offset="0" stop-color="${C.azul}"/>
      <stop offset="0.52" stop-color="${C.teal}"/>
      <stop offset="1" stop-color="${C.verde}"/>
    </linearGradient>
  </defs>
  <path d="${d}" fill="url(#${gid})" stroke="${C.ink}" stroke-width="20" stroke-linejoin="round"/>
  <!-- sombra tonal lateral pra dar volume -->
  <path d="${d}" fill="#000000" opacity="0.10"
        transform="translate(9 6) scale(0.985)" style="transform-origin:512px 520px"/>
  <path d="${gola}" fill="#000000" opacity="0.22" stroke="${C.ink}" stroke-width="9" stroke-linejoin="round"/>`;
}

/** Grupo camisa+bola centrado, escalável. */
function marca(scale = 1, dx = 0, dy = 0) {
  // bola no canto inferior direito da camisa
  const ball = bola(690, 720, 168, -14);
  return `<g transform="translate(${dx} ${dy}) translate(512 512) scale(${scale}) translate(-512 -512)">
    ${camisa('jersey' + Math.round(scale * 100))}
    ${ball}
  </g>`;
}

/** Faíscas de movimento (verdes esq/baixo, azuis dir/topo). Posições fixas. */
function faiscas() {
  const spk = [
    [150, 760, 34, C.verde, 18], [110, 640, 22, C.verde, -30], [220, 850, 26, C.verde, 40],
    [95, 500, 18, C.verde, 5], [300, 900, 20, C.verde, -15], [180, 560, 14, C.teal, 60],
    [860, 240, 34, C.azul, 18], [910, 360, 22, C.azul, -30], [800, 150, 26, C.azul, 40],
    [930, 520, 18, C.azul, 5], [720, 120, 20, C.azul, -15], [850, 460, 14, C.teal, 60],
    [512, 90, 16, C.azul, 25], [512, 940, 16, C.verde, -25],
  ];
  return spk
    .map(([x, y, len, col, ang]) => {
      const r = rad(ang);
      const x2 = x + Math.cos(r) * len, y2 = y + Math.sin(r) * len;
      return `<line x1="${x}" y1="${y}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(
        1
      )}" stroke="${col}" stroke-width="9" stroke-linecap="round" opacity="0.75"/>`;
    })
    .join('');
}

// ---- SVG 1: recorte transparente (camisa + bola) ----
const svgRecorte = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  ${marca(1)}
</svg>`;

// ---- SVG 2: ícone com fundo (véu gradiente + faíscas) ----
const svgIcone = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="veu" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="${C.verde}" stop-opacity="0.16"/>
      <stop offset="0.55" stop-color="${C.teal}" stop-opacity="0.06"/>
      <stop offset="1" stop-color="${C.azul}" stop-opacity="0.13"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="${C.pitch}"/>
  <rect width="1024" height="1024" fill="url(#veu)"/>
  ${faiscas()}
  ${marca(0.92)}
</svg>`;

// ---- SVG 3: foreground do adaptive icon (menor, dentro da safe zone) ----
const svgAdaptive = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  ${marca(0.66, 0, 8)}
</svg>`;

writeFileSync(join(ASSETS, 'logo-racha.svg'), svgRecorte);

const jobs = [
  { svg: svgRecorte, out: 'logo-racha-recorte.png', size: 1024 },
  { svg: svgIcone, out: 'logo-racha-1024.png', size: 1024 },
  { svg: svgIcone, out: 'icon.png', size: 1024 },
  { svg: svgAdaptive, out: 'android-icon-foreground.png', size: 1024 },
  { svg: svgRecorte, out: 'splash-icon.png', size: 1024 },
  { svg: svgIcone, out: 'favicon.png', size: 48 },
];

for (const j of jobs) {
  await sharp(Buffer.from(j.svg)).resize(j.size, j.size).png().toFile(join(ASSETS, j.out));
  console.log('✓', j.out, `(${j.size}px)`);
}
console.log('\nAssets gerados em assets/. Fonte vetorial: assets/logo-racha.svg');
