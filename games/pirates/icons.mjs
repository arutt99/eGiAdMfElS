const paths = {
  anchor: '<circle cx="32" cy="12" r="6"/><path d="M32 18v36M20 26h24M10 36c0 13 9 20 22 20s22-7 22-20M10 36l-4 9m4-9 9 4m35-4 4 9m-4-9-9 4"/>',
  hook: '<path d="M22 8h20v10H22zM26 18v19a12 12 0 1 0 24 0v-9l-9 11M31 7V3m6 4V3"/><path d="M21 24h20"/>',
  cannon: '<path d="m12 34 34-17 7 15-34 16zM45 15l8-4 9 20-9 4M12 34l-5 3 6 15 7-4M14 52h39"/><circle cx="33" cy="46" r="10"/><circle cx="33" cy="46" r="3"/><path d="m5 22 7 2m5-14 3 7M32 6v6"/>',
  key: '<circle cx="23" cy="21" r="13"/><circle cx="23" cy="21" r="5"/><path d="m32 31 23 23 5-5-6-6-5 5m-7-14-5 5M16 8l7-5 7 5"/>',
  chest: '<path d="M8 29v25h48V29M7 29v-9c0-8 50-8 50 0v9zM17 16v13m30-13v13M16 30v24m32-24v24M8 39h20m9 0h19"/><path d="M28 32h9v13h-9z"/><circle cx="32.5" cy="38" r="1"/>',
  map: '<path d="m7 12 16-5 18 7 16-5v43l-16 5-18-7-16 5zM23 7v15m0 23v5m18-36v17m0 16v10"/><path d="M16 37c1-15 11 1 18-9s13-11 16-5" stroke-dasharray="2 5"/><path d="m43 37 10 10m0-10L43 47"/>',
  oracle: '<path d="M4 32S15 15 32 15s28 17 28 17-11 17-28 17S4 32 4 32z"/><circle cx="32" cy="32" r="10"/><circle cx="32" cy="32" r="3"/><path d="M32 4v5m-18 1 3 5m33-5-3 5M32 55v5m-18-6 3-5m33 5-3-5"/>',
  sword: '<path d="m24 39 7-19L58 5 43 32l-18 8M24 40 52 12M16 34l17 17M14 37l15 15M20 44 9 55M5 52l7 7M33 51l5-5m-22-12 5-5"/>',
  kraken: '<path d="M20 29v-9a12 12 0 0 1 24 0v9M20 27c-8 0-9 7-5 14s-5 17-9 9M44 27c8 0 9 7 5 14s5 17 9 9M25 31c-7 7 4 14-2 22s-14 2-10-3M39 31c7 7-4 14 2 22s14 2 10-3M30 36v14c0 9-7 10-7 6M34 36v14c0 9 7 10 7 6"/><circle cx="27" cy="23" r="2"/><circle cx="37" cy="23" r="2"/>',
  mermaid: '<path d="M36 8c-8-7-19 2-13 10l6 5-5 13c-3 8 7 11 14 8l-2 7-14 4 6-10-12 3c-2 9 1 15 9 13 15-4 22-13 18-23l-6-13c8-8 7-17-1-17zM29 23h8M24 36l17-1M36 8c-2 9 3 11 7 13M16 15l-5 3m4 7-6 1"/>',
  ship: '<path d="M6 44h52L47 56H18zM32 5v39M28 10C18 21 16 31 13 37h15zM37 15v23h18C49 26 44 20 37 15zM6 61c7-4 12 4 19 0s12 4 19 0 11 3 15 0M32 6h15l-5 5H32"/>',
  compass: '<circle cx="32" cy="32" r="25"/><path d="m42 20-6 16-16 8 8-17zM32 2v9m0 42v9M2 32h9m42 0h9"/>',
};
export function icon(name, cls = '') { return `<svg class="icon ${cls}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.ship}</svg>`; }
