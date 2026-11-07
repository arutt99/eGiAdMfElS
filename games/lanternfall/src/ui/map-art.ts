// Small painted silhouettes for the map cards, one for each land.
import type { BiomeId } from '../data/maps';

const SCENES: Record<BiomeId, string> = {
  meadow: `
    <path fill="#8fc56a" d="M0 62 C30 44 58 50 88 60 S150 50 180 58 V92 H0Z"/>
    <path fill="#5f9c4c" d="M0 74 C40 62 84 66 118 76 S164 70 180 74 V92 H0Z"/>
    <g fill="#3f7a3d"><circle cx="30" cy="56" r="10"/><circle cx="44" cy="60" r="8"/><circle cx="142" cy="54" r="11"/></g>
    <g fill="#5b3a26"><rect x="28.500" y="62" width="3" height="10"/><rect x="140.500" y="61" width="3" height="11"/></g>
    <path fill="#c7663a" d="M86 48 L97 37 L108 48Z"/><rect x="89" y="48" width="16" height="14" fill="#efe0bd"/>`,
  forest: `
    <path fill="#284f3d" d="M0 66 C50 56 120 58 180 64 V92 H0Z"/>
    <g fill="#1d3f33"><path d="M22 72 L36 26 L50 72Z"/><path d="M58 76 L76 16 L94 76Z"/><path d="M120 76 L140 22 L160 76Z"/></g>
    <g fill="#143029"><path d="M2 84 L16 44 L30 84Z"/><path d="M92 86 L108 40 L124 86Z"/><path d="M150 86 L166 46 L182 86Z"/></g>
    <g fill="#ffe58a"><circle cx="52" cy="44" r="1.700"/><circle cx="104" cy="30" r="1.400"/><circle cx="130" cy="58" r="1.700"/><circle cx="82" cy="60" r="1.300"/></g>`,
  marsh: `
    <rect y="58" width="180" height="34" fill="#3d6a64"/>
    <g stroke="#7fb2a4" stroke-width="1.500" opacity=".6"><path d="M8 68h34M62 76h46M122 66h40M26 84h30M118 84h38"/></g>
    <path fill="#2f4f3e" d="M0 60 C34 50 66 54 92 60 S150 52 180 60 V66 C130 62 60 66 0 64Z"/>
    <g stroke="#23392d" stroke-width="2" fill="none"><path d="M30 80 V46M38 84 V54M46 78 V44M136 82 V48M144 78 V54"/></g>
    <g fill="#5e4632"><ellipse cx="30" cy="44" rx="2.500" ry="6"/><ellipse cx="46" cy="42" rx="2.500" ry="6"/><ellipse cx="136" cy="46" rx="2.500" ry="6"/></g>`,
  frost: `
    <path fill="#8fa8c4" d="M0 72 L40 30 L70 60 L104 18 L146 62 L166 44 L180 58 V92 H0Z"/>
    <path fill="#f2f7ff" d="M40 30 L52 43 L44 40 L36 46 L30 41Z"/>
    <path fill="#f2f7ff" d="M104 18 L120 35 L109 31 L101 38 L92 32Z"/>
    <path fill="#d9e6f4" d="M0 78 C50 68 110 72 180 76 V92 H0Z"/>`,
  desert: `
    <circle cx="136" cy="30" r="15" fill="#ffe2a0"/>
    <path fill="#c98f4d" d="M0 58 C40 42 76 50 104 60 S160 50 180 54 V92 H0Z"/>
    <path fill="#a86f38" d="M0 76 C50 60 110 72 180 68 V92 H0Z"/>
    <path fill="#6e4426" d="M60 62 L66 24 L72 62Z"/>
    <path fill="#6e4426" d="M88 66 h26 l-4 -8 h-18Z"/>`,
  volcano: `
    <path fill="#3a1d1d" d="M0 80 L56 40 L74 26 L88 26 L106 42 L180 80 V92 H0Z"/>
    <path fill="#ff8a3c" d="M74 26 L88 26 L84 44 L90 58 L78 74 L80 52 L72 40Z"/>
    <path fill="#ffd36b" d="M78 26 L84 26 L81 40Z"/>
    <path fill="#241014" d="M0 86 C50 76 120 80 180 84 V92 H0Z"/>
    <g fill="#5b4040" opacity=".7"><circle cx="82" cy="16" r="6"/><circle cx="92" cy="9" r="4"/></g>`,
};

export const mapArt = (biome: BiomeId) =>
  `<svg class="map-art" viewBox="0 0 180 92" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${SCENES[biome]}</svg>`;

export const LOCK_ICON = '<svg class="m-lock" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3z"/></svg>';
