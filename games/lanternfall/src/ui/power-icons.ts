// Spell and hero power icons, drawn like the rest of the game: dark ink outlines over shaded, lit-from-above fills.
// The gradients they share live once in the page (POWER_ICON_DEFS) so every copy of an icon stays cheap.

const INKC = '#22141f';
/** Outline drawn under the fill, so the visible line sits outside the shape like the 3D outline pass. */
const INK = `stroke="${INKC}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke"`;
const INK_THIN = `stroke="${INKC}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke"`;
const g = (id: string) => `url(#lfi-${id})`;

const f = (n: number) => +n.toFixed(2);
function starPath(cx: number, cy: number, R: number, r: number, rot = 0, n = 5) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = rot - Math.PI / 2 + (i * Math.PI) / n;
    const rad = i % 2 ? r : R;
    pts.push(`${f(cx + Math.cos(a) * rad)} ${f(cy + Math.sin(a) * rad)}`);
  }
  return `M${pts.join('L')}Z`;
}
/** A small four-point sparkle. */
const sparkle = (x: number, y: number, s: number, fill = '#fff6d4') =>
  `<path d="${starPath(x, y, s, s * 0.32, 0, 4)}" fill="${fill}" ${INK_THIN}/>`;
/** A thick line drawn twice: ink first, then color. */
const line2 = (d: string, color: string, w = 3.6) =>
  `<path d="${d}" fill="none" stroke="${INKC}" stroke-width="${w + 3.2}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const svg = (body: string) => `<svg viewBox="0 0 48 48" aria-hidden="true">${body}</svg>`;

function rays(cx: number, cy: number, r0: number, r1: number, n: number, half: number, rot = 0) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    d += `M${f(cx + Math.cos(a - half) * r0)} ${f(cy + Math.sin(a - half) * r0)}L${f(cx + Math.cos(a) * r1)} ${f(cy + Math.sin(a) * r1)}L${f(cx + Math.cos(a + half) * r0)} ${f(cy + Math.sin(a + half) * r0)}Z`;
  }
  return d;
}

function snowflake() {
  let arms = '';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const c = Math.cos(a), s = Math.sin(a);
    const P = (r: number, da = 0, len = 0) => `${f(24 + c * r + Math.cos(a + da) * len)} ${f(24 + s * r + Math.sin(a + da) * len)}`;
    arms += `M${P(5)}L${P(18.5)}M${P(11)}L${P(11, 0.9, 6.5)}M${P(11)}L${P(11, -0.9, 6.5)}`;
  }
  let tips = '';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    tips += `<path d="${starPath(24 + Math.cos(a) * 19.5, 24 + Math.sin(a) * 19.5, 3.2, 1.6, a + Math.PI / 2, 2)}" fill="#f4feff" ${INK_THIN}/>`;
  }
  return `${line2(arms, g('ice'), 3.4)}${tips}
    <path d="${starPath(24, 24, 7.5, 6.5, 0, 3)}" fill="${g('ice')}" ${INK}/>
    <circle cx="24" cy="24" r="2.4" fill="#ffffff"/>`;
}

function arrow(x: number, y: number, len: number) {
  const tip = y + len;
  return `${line2(`M${x} ${y + 2}L${x} ${tip - 6}`, '#d29a5e', 2.8)}
    <path d="M${x - 4.6} ${y - 2}L${x} ${y + 3.5}L${x} ${y + 10}L${x - 4.6} ${y + 5}Z" fill="${g('leaf')}" ${INK_THIN}/>
    <path d="M${x + 4.6} ${y - 2}L${x} ${y + 3.5}L${x} ${y + 10}L${x + 4.6} ${y + 5}Z" fill="#cdf59a" ${INK_THIN}/>
    <path d="M${x - 5} ${tip - 9}L${x + 5} ${tip - 9}L${x} ${tip}Z" fill="${g('steel')}" ${INK_THIN}/>`;
}

const lantern = (s: number, cx: number, cy: number) => `<g transform="translate(${cx} ${cy}) scale(${s})">
    <circle cx="0" cy="-12.5" r="2.6" fill="none" stroke="${INKC}" stroke-width="3.4"/><circle cx="0" cy="-12.5" r="2.6" fill="none" stroke="#ffd36b" stroke-width="1.4"/>
    <rect x="-5.6" y="-6.5" width="11.2" height="13" rx="2.2" fill="${g('lamp')}" ${INK}/>
    <path d="M0 4.2C-2.6 2.6-2.8-0.6 0-4.4C2.8-0.6 2.6 2.6 0 4.2Z" fill="#fffbe6"/>
    <path d="M-2.8-6.5V6.5M2.8-6.5V6.5" stroke="#9a6418" stroke-width="1.3"/>
    <path d="M-7.6-6.5H7.6L4.6-10.6H-4.6Z" fill="${g('goldbb')}" ${INK}/>
    <path d="M-7.6 6.5H7.6L5.6 10.4H-5.6Z" fill="${g('goldbb')}" ${INK}/>
  </g>`;

export const POWER_ICONS: Record<string, string> = {
  starfall: svg(`
    <path d="M9 25C20 17 32 9 45 3C40 15 31 26 23 39Z" fill="${g('fire')}" ${INK}/>
    <path d="M14 27C23 20 32 13 41 8C37 17 30 25 23 34Z" fill="#ffd970" opacity=".9"/>
    <path d="M30 13L42 5M33 20L40 13" stroke="#fff3c4" stroke-width="1.8" stroke-linecap="round"/>
    <path d="${starPath(17, 31, 12.5, 5.6, -0.25)}" fill="${g('gold')}" ${INK}/>
    <path d="${starPath(17, 31, 6.4, 2.9, -0.25)}" fill="#fff6d0" opacity=".75"/>
    ${sparkle(38, 27, 3.6)}${sparkle(29, 6, 2.8)}`),

  winter: svg(snowflake()),

  guards: svg(`
    <path d="M24 4L40 9.5V22C40 33 32.5 40.5 24 44.5C15.5 40.5 8 33 8 22V9.5Z" fill="${g('steel')}" ${INK}/>
    <path d="M24 8.5L36 12.6V22C36 30.6 30.6 36.6 24 40C17.4 36.6 12 30.6 12 22V12.6Z" fill="none" stroke="#ffd36b" stroke-width="2"/>
    <path d="M24 8.5L36 12.6V22C36 30.6 30.6 36.6 24 40Z" fill="#0b1a3a" opacity=".2"/>
    <path d="M12.5 13.5L20 11C16 15 14.5 20 14.5 26C13 24 12.5 20 12.5 13.5Z" fill="#ffffff" opacity=".35"/>
    ${lantern(0.92, 24, 25)}`),

  hex: svg(`
    <circle cx="24" cy="24" r="20" fill="${g('hexglow')}"/>
    ${line2('M24 7.5A16.5 16.5 0 1 1 23.9 7.5', g('violet'), 3)}
    ${line2('M24 11L35.3 30.5H12.7ZM24 37L12.7 17.5H35.3Z', '#e6c4ff', 1.8)}
    <circle cx="24" cy="24" r="6.4" fill="${g('orb')}" ${INK}/>
    <path d="M22 18.5L25.5 22.5L22.5 25L26 29.5" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    ${sparkle(24, 7.5, 3, '#f4e2ff')}${sparkle(38.3, 32.2, 3, '#f4e2ff')}${sparkle(9.7, 32.2, 3, '#f4e2ff')}`),

  rally: svg(`
    ${line2('M38 4.5Q44 7 45.5 13M40.5 1.5Q48 6 48 16', '#ffe9a8', 1.8)}
    <path d="M6 37C17 36.5 27 29.5 30.5 13L41.5 18.5C36.5 35.5 22 43.5 7 42.5Z" fill="${g('gold')}" ${INK}/>
    <path d="M14.5 35.5L16.5 41.8M22.5 32L25.6 38.4" stroke="#8a5212" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M9 38.5C18 38 26 32.5 30.5 19" fill="none" stroke="#fff4c8" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
    <ellipse cx="36" cy="15.8" rx="5.8" ry="7.4" transform="rotate(27 36 15.8)" fill="#ffcf5a" ${INK}/>
    <ellipse cx="36.4" cy="15.6" rx="3.4" ry="4.8" transform="rotate(27 36.4 15.6)" fill="#6b3a10"/>
    <rect x="2.5" y="36.5" width="5.5" height="6.5" rx="1.6" fill="#c98a2c" ${INK_THIN}/>
    <path d="M17 41.5Q19 45 16 47.5L21 47Q22.5 43.5 21 40.5Z" fill="${g('red')}" ${INK_THIN}/>`),

  rift: svg(`
    <circle cx="24" cy="25" r="19" fill="${g('riftglow')}"/>
    ${line2('M38 13C29 4 11 9 10 23C9 35 24 41 32 33C38 26 33 17 25 18C19 19 18 26 23 28', g('violet'), 4.2)}
    <path d="M38 13C29 4 11 9 10 23" fill="none" stroke="#e2d8ff" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>
    <path d="M33.5 8.5L44 10.5L39 19.5Z" fill="#c9b8ff" ${INK}/>
    <circle cx="24" cy="25" r="3" fill="#f6f0ff" ${INK_THIN}/>`),

  golden: svg(`
    <path d="M16 10H32C32 18 26.2 21 26.2 24C26.2 27 32 30 32 38H16C16 30 21.8 27 21.8 24C21.8 21 16 18 16 10Z" fill="#dff2ff" fill-opacity=".45" ${INK}/>
    <path d="M18.6 14H29.4C28.8 18 25 20.6 24 22.4C23 20.6 19.2 18 18.6 14Z" fill="${g('gold')}"/>
    <path d="M17.6 37C18 31.5 22 30.2 24 29C26 30.2 30 31.5 30.4 37Z" fill="${g('gold')}"/>
    <path d="M24 22V31" stroke="#ffd36b" stroke-width="1.5"/>
    <path d="M18.4 12.5C18.6 17 21 19.5 22 21" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>
    <rect x="12.5" y="9" width="3.2" height="30" rx="1.2" fill="#a86a1c" ${INK_THIN}/><rect x="32.3" y="9" width="3.2" height="30" rx="1.2" fill="#a86a1c" ${INK_THIN}/>
    <rect x="10" y="4.5" width="28" height="5.5" rx="2" fill="${g('gold')}" ${INK}/>
    <rect x="10" y="38" width="28" height="5.5" rx="2" fill="${g('gold')}" ${INK}/>
    ${sparkle(41.5, 21, 3.4)}${sparkle(6.5, 28, 2.6)}`),

  sunbreak: svg(`
    <path d="${rays(24, 24, 11, 22.5, 8, 0.24)}" fill="${g('fire')}" ${INK}/>
    <path d="${rays(24, 24, 11, 17.5, 8, 0.2, Math.PI / 8)}" fill="${g('gold')}" ${INK}/>
    <circle cx="24" cy="24" r="10.5" fill="${g('sun')}" ${INK}/>
    <path d="M17.5 21A7.5 7.5 0 0 1 24 16.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".85"/>`),

  ward: svg(`
    <circle cx="24" cy="24" r="20" fill="${g('warm')}"/>
    ${line2('M24 4.5A19.5 19.5 0 1 1 23.9 4.5', '#ffcf6b', 2.2)}
    ${lantern(1.18, 24, 26)}
    <path d="M38 33V39M35 36H41M8 14V19M5.5 16.5H10.5" stroke="${INKC}" stroke-width="4.6" stroke-linecap="round"/>
    <path d="M38 33V39M35 36H41M8 14V19M5.5 16.5H10.5" stroke="#d6ffb8" stroke-width="2" stroke-linecap="round"/>`),

  phoenix: svg(`
    <path d="M24 27C18 22 10 20 3 9C6 21 8 27 14 31C10.5 31.5 8 31 5 29.5C9 36 16 38.5 22 36.5Z" fill="${g('fire')}" ${INK}/>
    <path d="M24 27C30 22 38 20 45 9C42 21 40 27 34 31C37.5 31.5 40 31 43 29.5C39 36 32 38.5 26 36.5Z" fill="${g('fire')}" ${INK}/>
    <path d="M8 15C11 22 15 26 21 29M40 15C37 22 33 26 27 29" fill="none" stroke="#ffe58a" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M24 36C21 40 21.5 43.5 18.5 46.5C23 45.5 24 43 24 41C24 43 25 45.5 29.5 46.5C26.5 43.5 27 40 24 36Z" fill="${g('fire')}" ${INK}/>
    <path d="M24 17C28 22 28.5 30 24 40C19.5 30 20 22 24 17Z" fill="${g('gold')}" ${INK}/>
    <circle cx="24" cy="15" r="3.8" fill="${g('gold')}" ${INK}/>
    <path d="M22.5 11.8C21.5 8.5 22.5 6 24 4C24.5 7 26.5 8 25.6 11.8Z" fill="#ff8a2e" ${INK_THIN}/>
    <circle cx="25.1" cy="14.6" r="0.9" fill="${INKC}"/>`),

  arrowrain: svg(`
    <g transform="rotate(16 24 24)">${arrow(11, 3, 32)}${arrow(24, 9, 34)}${arrow(37, 1, 32)}</g>
    <path d="M6 44H17M26 45.5H34M39 43H44" stroke="#c8ff8a" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>`),

  huntersmark: svg(`
    ${line2('M24 9A15 15 0 1 1 23.9 9', g('leaf'), 3.4)}
    ${line2('M24 2.5V12M24 36V45.5M2.5 24H12M36 24H45.5', g('leaf'), 3.2)}
    <path d="M24 15.5L32.5 24L24 32.5L15.5 24Z" fill="${g('red')}" ${INK}/>
    <path d="M24 18.6L21 21.8" stroke="#ffd8d0" stroke-width="1.6" stroke-linecap="round"/>`),

  deadeye: svg(`
    <circle cx="21" cy="27" r="17.5" fill="#f6ecd6" ${INK}/>
    <circle cx="21" cy="27" r="12.8" fill="${g('red')}" ${INK_THIN}/>
    <circle cx="21" cy="27" r="8.2" fill="#f6ecd6" ${INK_THIN}/>
    <circle cx="21" cy="27" r="3.8" fill="#e8463a" ${INK_THIN}/>
    <path d="M10 18A14 14 0 0 1 17 11.5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>
    ${line2('M22 26L41 7', '#c89058', 2.2)}
    <path d="M38 4L42.5 2.5L41.5 7L45.5 6L44 10.5L40 11.5Z" fill="${g('leaf')}" ${INK_THIN}/>
    <path d="M15 22L18 24M27 21L24.5 23.5M16 32.5L18.5 30" stroke="#fff6d4" stroke-width="1.6" stroke-linecap="round"/>`),

  earthshatter: svg(`
    <path d="M2 32L13 28.5L21 31.5L30 27L46 31.5V45H2Z" fill="${g('stone')}" ${INK}/>
    <path d="M21 31.5L19 37L23.5 39L20.5 45H27.5L28 38.5L24.5 36.5L27 30.2Z" fill="${g('flame')}" ${INK_THIN}/>
    <path d="M7 36L12 34M33 36L39 37.5M10 41.5L15 40.5" stroke="#4a524a" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M9 15L14.5 12.5L17.5 17L14 21.5L8.5 20Z" fill="${g('stone')}" ${INK}/>
    <path d="M31 9L37.5 7.5L40 13L35 16.5L30.5 14Z" fill="${g('stone')}" ${INK}/>
    <path d="M21 4L25 3.5L26.5 7.5L23 9.5L20 7.5Z" fill="${g('stone')}" ${INK_THIN}/>
    <path d="M13 25L11 23M24 24V20M35 23.5L37.5 21" stroke="#ffd36b" stroke-width="2" stroke-linecap="round"/>`),

  stonewall: svg(`
    <path d="M7 5H15V9H20V5H28V9H33V5H41V29L24 44.5L7 29Z" fill="${g('stone')}" ${INK}/>
    <path d="M7 18H41M7 28H41M19 9V18M30 9V18M14 18V28M25 18V28M35 18V28M20 28V38M29 28V38" stroke="#4a564c" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M9 11.5H17M22 20.5H29" stroke="#eef2ea" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>
    <path d="M6 6.5C8 3.5 13 3.5 15.5 6.5C14 8.5 9 9 6 6.5ZM32.5 6.5C35 3.5 40 3.5 42 6.5C39.5 9 35 8.5 32.5 6.5Z" fill="${g('moss')}" ${INK_THIN}/>
    <path d="M36.5 28C39.5 27 41.5 28.5 41.5 30.5L38 33.5C36 32.5 35 30 36.5 28Z" fill="${g('moss')}" ${INK_THIN}/>`),

  avalanche: svg(`
    <path d="M1.5 40L18 11L25 21L30.5 15L46.5 40Z" fill="${g('stone')}" ${INK}/>
    <path d="M18 11L13.2 19.5L17 18L19.8 21L22.8 17.2ZM30.5 15L27.5 19.8L30.5 19L33 21L34.4 19.8Z" fill="#f6fbff" ${INK_THIN}/>
    <circle cx="9" cy="23" r="4" fill="#dfe6ee" opacity=".7"/><circle cx="5" cy="27" r="3" fill="#dfe6ee" opacity=".6"/>
    <path d="M5.5 35.5L11 32L16 34.5L16 40.5L10 43L5 40.5Z" fill="${g('boulder')}" ${INK}/>
    <path d="M17 39L22 36L27 38.5L26.5 44L21 45.5L17 43.5Z" fill="${g('boulder')}" ${INK}/>
    <path d="M30 35L37 31.5L43.5 35L43 42L36.5 45.5L30.5 42.5Z" fill="${g('boulder')}" ${INK}/>
    <path d="M33 35L37 33M8 37L11 35.2" stroke="#e8ece4" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>`),
};

const lin = (id: string, stops: [number, string][], y1 = 4, y2 = 44) =>
  `<linearGradient id="lfi-${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${y1}" x2="0" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const rad = (id: string, stops: [number, string, number?][], cx = 24, cy = 24, r = 20) =>
  `<radialGradient id="lfi-${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;

const linBox = (id: string, stops: [number, string][]) =>
  `<linearGradient id="lfi-${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;

/** Shared gradients. Kept in an invisible but rendered SVG, because Chrome skips gradients defined under display:none. */
export const POWER_ICON_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  ${lin('gold', [[0, '#fff2bc'], [0.45, '#ffc94a'], [1, '#c97a16']])}
  ${lin('fire', [[0, '#ffe98f'], [0.5, '#ff9a2e'], [1, '#d4401c']])}
  ${lin('ice', [[0, '#f4feff'], [0.5, '#9fe6ff'], [1, '#4f9fe0']])}
  ${lin('steel', [[0, '#cfe6ff'], [0.5, '#6fa6e8'], [1, '#2c5aa4']])}
  ${lin('violet', [[0, '#e4d6ff'], [0.5, '#a07cff'], [1, '#5434b8']])}
  ${lin('leaf', [[0, '#edffc8'], [0.5, '#9fe86a'], [1, '#4a9430']])}
  ${lin('red', [[0, '#ffb8aa'], [0.5, '#ff6a5a'], [1, '#b42e28']])}
  ${lin('stone', [[0, '#e4e9de'], [0.5, '#a3ad9e'], [1, '#5c675c']])}
  ${lin('boulder', [[0, '#c4ccbf'], [1, '#5f6a62']], 30, 46)}
  ${lin('moss', [[0, '#c8f08a'], [1, '#4a8a34']], 2, 34)}
  ${linBox('goldbb', [[0, '#fff2bc'], [0.45, '#ffc94a'], [1, '#c97a16']])}
  <radialGradient id="lfi-lamp" cx=".5" cy=".6" r=".65"><stop offset="0" stop-color="#fffbe6"/><stop offset=".45" stop-color="#ffd25a"/><stop offset="1" stop-color="#ff8a24"/></radialGradient>
  ${rad('flame', [[0, '#fffbe6'], [0.45, '#ffd25a'], [1, '#ff8a24']], 24, 30, 16)}
  ${rad('sun', [[0, '#ffffff'], [0.35, '#fff1a8'], [0.8, '#ffc23a'], [1, '#ff9a2e']], 22, 21, 12)}
  ${rad('orb', [[0, '#ffffff'], [0.4, '#e2b4ff'], [1, '#8a3ed8']], 23, 22, 8)}
  ${rad('hexglow', [[0, '#c76bff', 0.55], [1, '#c76bff', 0]])}
  ${rad('riftglow', [[0, '#8a6bff', 0.6], [1, '#8a6bff', 0]], 24, 25, 19)}
  ${rad('warm', [[0, '#ffc86b', 0.5], [1, '#ffc86b', 0]])}
</defs></svg>`;
