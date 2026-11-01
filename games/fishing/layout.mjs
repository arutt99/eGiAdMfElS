// Pixel positions on the two sheet images (natural image coordinates).
import { TYPES } from './engine.mjs';

export const SHEETS = {
  boats: { src: 'assets/sheet-boats.webp', w: 1100, h: 1429 },
  harbor: { src: 'assets/sheet-harbor.webp', w: 1122, h: 1402 },
};

const COL_X = { shrimp: 102, cod: 314, lobster: 511.5, swordfish: 718.5, oyster: 921.5 };
const COL_DY = { shrimp: 1.5, cod: 0, lobster: 0, swordfish: -1, oyster: -1 };
const COL_Y = [124.5, 151, 177.5, 203.5, 227.5, 251.5, 275, 298.5, 322, 346, 369, 392.5];
const COL_ROUND = new Set([1, 2, 4, 6, 8, 11]);

const cell = (x, y, round, r = 11) => ({ x, y, r, round });

export const CELLS = {
  ...Object.fromEntries(TYPES.map(t => [t, COL_Y.map((y, i) => cell(COL_X[t], y + COL_DY[t], COL_ROUND.has(i), 10)) ])),
  crab: [154.5, 184, 213, 242, 271, 300, 329, 358, 388, 417.5, 447].map((y, i) => cell(54, y, [4, 6, 8, 10].includes(i), 12)),
  club: [134, 163, 193, 221, 250.5, 281, 309.5, 339].map((y, i) => cell(218.5, y, [1, 4, 7].includes(i), 12)),
  research: [536.5, 565.5, 595.5].map((y, i) => cell(257, y, i !== 1, 12)),
  barge: [771, 799.5, 829].map((y, i) => cell(238, y, i === 2, 12)),
  canoe: [988, 1016.5, 1046].map((y, i) => cell(255.5, y, i !== 1, 12)),
  casino: [[682, 514], [682, 544]].map(([x, y]) => cell(x, y, true, 11)),
  bank: [[946, 519.5], [1000, 519.5], [1056, 519.5]].map(([x, y]) => cell(x, y, true, 17)),
  buffet: [[595.5, 685], [595.5, 712], [595.5, 740]].map(([x, y]) => cell(x, y, true, 12)),
  salvage: [cell(945, 688, false, 11)],
  pub: [[608.5, 874.5], [646.5, 874.5], [608.5, 902], [646.5, 902]].map(([x, y]) => cell(x, y, false, 12)),
  bait: [cell(888, 877.5, true, 14)],
  smoke: [cell(712.5, 1072, true, 12)],
  canning: [cell(1040, 1034, true, 12)],
};

export const SECTION_SHEET = Object.fromEntries(Object.keys(CELLS).map(k => [k, TYPES.includes(k) ? 'boats' : 'harbor']));

// Tap areas: [x0, y0, x1, y1]
export const HIT = {
  shrimp: [48, 106, 246, 408], cod: [262, 106, 446, 408], lobster: [462, 106, 650, 408],
  swordfish: [664, 106, 856, 408], oyster: [868, 106, 1056, 408],
  crab: [22, 132, 168, 462], club: [192, 112, 540, 410], research: [205, 468, 545, 655],
  barge: [205, 700, 545, 878], canoe: [205, 925, 545, 1125],
  casino: [572, 452, 818, 612], bank: [832, 452, 1106, 612], buffet: [568, 620, 842, 818],
  salvage: [846, 620, 1104, 812], pub: [570, 816, 818, 978], bait: [846, 816, 1104, 978],
  smoke: [570, 980, 818, 1142], canning: [846, 980, 1104, 1142],
};

// Where the rival's token pin sits for each section.
export const PIN = {
  shrimp: [228, 112], cod: [430, 112], lobster: [632, 112], swordfish: [840, 112], oyster: [1040, 112],
  crab: [165, 150], club: [520, 125], research: [530, 485], barge: [530, 712], canoe: [530, 940],
  casino: [800, 470], bank: [1088, 470], buffet: [808, 640], salvage: [1086, 640], pub: [800, 835],
  bait: [1086, 835], smoke: [800, 998], canning: [1086, 998],
};

export const LICENSE = {
  circles: Object.fromEntries(TYPES.map((t, i) => [t, [422, 523, 632].map(y => [[62, 275.5, 476, 678, 879][i], y])])),
  cards: [[410, 498], [500, 612], [620, 734]],
};

const B = (list) => list.map(([x, y]) => ({ x, y }));
const rowFish = (xs, ys, shift = []) => ys.map((y, r) => xs.map(x => ({ x: x + (shift[r] || 0), y })));
const OY = [[921, 785], [947, 785], [972.5, 785], [918, 810], [945.5, 810], [972, 810], [1015.5, 785], [1041.5, 785], [1015, 812], [1041, 812]];

export const SHIP = {
  shrimp: { marks: B([[70.5, 768.5], [71.5, 878.5], [71.5, 990.5]]), fish: rowFish([107, 142, 178], [811, 921, 1033]), box: [50, 180, 'boats'] },
  cod: { marks: B([[281.5, 768.5], [282.5, 878], [283.5, 989.5]]), fish: rowFish([307, 337, 367, 397], [811.5, 922.5, 1034.5], [0, 0, 1]), box: [262, 166, 'boats'] },
  lobster: { marks: B([[486.5, 769.5], [488.5, 880], [488.5, 991.5]]), fish: rowFish([521, 551, 582, 613], [811, 921.5, 1034.5], [0, 3, 2]), box: [468, 175, 'boats'] },
  swordfish: { marks: B([[692, 769], [693, 878.5], [693, 990.5]]), fish: rowFish([726, 755, 784, 813], [809.5, 920.5, 1032.5]), box: [672, 175, 'boats'] },
  oyster: { marks: B([[888.5, 769], [888.5, 880.5], [889.5, 991.5]]), fish: [0, 111.5, 223].map(dy => OY.map(([x, y]) => ({ x, y: y + dy }))), box: [868, 198, 'boats'] },
  crab: { marks: B([[50, 862], [50, 965], [50, 1065]]), fish: rowFish([65.5, 98.5, 130, 161.5], [904.5, 1010.5, 1112.5]), box: [26, 270, 'harbor'] },
  research: { marks: B([[358, 480.5], [358.5, 583]]), fish: [[], []], box: [336, 206, 'harbor'] },
  barge: { marks: B([[341.5, 733]]), fish: [[348, 384.5, 422, 459.5, 495.5].map(x => ({ x, y: 785 })).concat([348, 384.5, 422, 459.5, 495.5].map(x => ({ x, y: 809.5 })))], box: [318, 228, 'harbor'] },
  canoe: { marks: B([[340.5, 977.5], [340.5, 1053]]), fish: rowFish([380, 413, 445, 478], [1009.5, 1088.5]), box: [326, 190, 'harbor'] },
};
export const SHIP_H = { shrimp: [-24, 70], cod: [-24, 70], lobster: [-24, 70], swordfish: [-24, 70], oyster: [-24, 70], crab: [-22, 66], research: [-22, 74], barge: [-26, 120], canoe: [-22, 58] };

export const KC = { circle: [30, 482], card: [36, 470, 196, 826], bonus: { building: [52.5, 598], fish: [52.5, 641.5], license: [52.5, 691.5], coins: [52.5, 735.5] } };
export const HEX = { x: 817, ys: [646.5, 684.5, 722.5, 760, 797.5] };
export const SALVAGE_STARS = [[1061, 684], [1061.5, 716], [1061, 747]];
export const MARKET_ROWS = [[40, 330], [30, 296], [20, 262], [12, 228], [5, 196], [0, 163]];
export const MARKET_X = [738, 902];

export const COIN_X = [49.5, 98.5, 154, 202, 253.5, 311, 361.5, 413.5, 471.5, 525, 580, 631.5, 681.5, 728.5, 775.5, 822, 872, 929.5, 979, 1024, 1074];
export const COIN_Y = [1215, 1247, 1279, 1311.5, 1344];
export const coinPos = i => ({ x: COIN_X[i % 21], y: COIN_Y[Math.floor(i / 21)] });

export const TRACK = {
  x: [420.5, 456.5, 492.5, 530, 567, 603.5, 640, 676.5, 713, 749],
  round: 1148, boat: 1180, income: 1213, fishing: 1243.5, town: 1275,
  score: { x: 1024, ys: [1145, 1181, 1216, 1252, 1290, 1330] },
};

// ---------- screen pages ----------
// A page is a stack of crops from the two sheet images, each scaled to the page width.
// Phones get three tall pages that fill a portrait screen; wider screens get the two whole sheets.
const PAGE_GAP = 18;
export const PAGE_SETS = {
  phone: [
    { id: 'boats', label: 'Boats', icon: 'cod', panels: [{ sheet: 'boats', crop: [0, 0, 1100, 1378] }, { sheet: 'harbor', crop: [0, 1146, 1122, 1368] }] },
    // the cover hides the top edge of the Coins sign, which sits on the coin-track panel instead
    { id: 'harbor', label: 'Harbor', icon: 'harbor', panels: [{ sheet: 'harbor', crop: [0, 0, 557, 1160], cover: [392, 1145, 557, 1160, '#f2d98c'] }] },
    { id: 'wharf', label: 'Wharf', icon: 'wharf', panels: [{ sheet: 'harbor', crop: [548, 0, 1122, 1148] }] },
  ],
  wide: [
    { id: 'boats', label: 'Boats', icon: 'cod', panels: [{ sheet: 'boats', crop: [0, 0, 1100, 1429] }] },
    { id: 'harbor', label: 'Harbor', icon: 'harbor', panels: [{ sheet: 'harbor', crop: [0, 0, 1122, 1402] }] },
  ],
};

// Page size in page units, and where each panel sits in it.
export function composePage(page) {
  const w = page.panels[0].crop[2] - page.panels[0].crop[0];
  let y = 0;
  const panels = page.panels.map((p, i) => {
    const [x0, y0, x1, y1] = p.crop, k = w / (x1 - x0), h = (y1 - y0) * k;
    if (i) y += PAGE_GAP;
    const out = { ...p, k, top: y, height: h };
    y += h;
    return out;
  });
  return { ...page, w, h: y, panels };
}

// The page of a set that shows a given point of a sheet (first match wins).
export function pageAt(set, sheet, x, y) {
  return set.find(pg => pg.panels.some(p => p.sheet === sheet && x >= p.crop[0] && x <= p.crop[2] && y >= p.crop[1] && y <= p.crop[3])) || null;
}
