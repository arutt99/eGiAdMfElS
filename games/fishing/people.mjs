// The opponents: portraits, names and what they say when they move. Strings only, no DOM.
import { label } from './engine.mjs';

// A grumpy old captain with a pipe.
const RIVAL = `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#8a2318"/><circle cx="32" cy="32" r="29" fill="#a52d1f"/>
<circle cx="32" cy="37" r="15" fill="#f1c7a0"/>
<path d="M16.5 37c0 12.5 7 19.5 15.5 19.5S47.5 49.5 47.5 37c-3 5-8.5 7-15.5 7s-12.5-2-15.5-7z" fill="#ece6d8"/>
<path d="M22.5 31.5l7.5 2.4M41.5 31.5 34 33.9" stroke="#3a2410" stroke-width="2.6" stroke-linecap="round"/>
<circle cx="26.6" cy="36" r="1.9" fill="#2a1a0c"/><circle cx="37.4" cy="36" r="1.9" fill="#2a1a0c"/>
<circle cx="32" cy="40" r="2.8" fill="#de9f7a"/>
<path d="M27.5 46.2q4.5 2.2 9-1.2" stroke="#7a3b22" stroke-width="2.1" fill="none" stroke-linecap="round"/>
<path d="M12.5 26c2.2-9.5 10.4-14.5 19.5-14.5S49.3 16.5 51.5 26z" fill="#1d2a3a"/>
<rect x="11" y="24" width="42" height="6.5" rx="3.2" fill="#0f1823"/><path d="M13 27.2h38" stroke="#e2b04a" stroke-width="1.6"/>
<path d="M28.5 18.5h7l-3.5 4z" fill="#e2b04a"/>
<path d="M37.5 46.5h7.5v-4.5h4.5v6.3a3.2 3.2 0 0 1-3.2 3.2h-8.8z" fill="#5a3518"/><path d="M47 41c1-2 3-2 2-5" stroke="#cfd8dc" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/>
</svg>`;

// A tin skipper in a sailor cap.
const AI = `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#163f5a"/><circle cx="32" cy="32" r="29" fill="#1f5577"/>
<path d="M32 10v6" stroke="#cfe8f5" stroke-width="2.2"/><circle cx="32" cy="8.5" r="3.2" fill="#ffd23f"/>
<rect x="11" y="29" width="4.5" height="11" rx="2.2" fill="#9fb0bb"/><rect x="48.5" y="29" width="4.5" height="11" rx="2.2" fill="#9fb0bb"/>
<rect x="15" y="19" width="34" height="33" rx="9.5" fill="#d5dee5"/><rect x="15" y="44" width="34" height="8" rx="4" fill="#b9c6cf"/>
<rect x="19" y="27" width="26" height="12.5" rx="6.2" fill="#14273a"/>
<circle class="eye" cx="26" cy="33.2" r="3.1" fill="#5fe0ff"/><circle class="eye" cx="38" cy="33.2" r="3.1" fill="#5fe0ff"/>
<rect x="25" y="43" width="14" height="3" rx="1.5" fill="#7d8e9a"/>
<path d="M16.5 22c3-6.5 9.3-8.5 15.5-8.5S44.5 15.5 47.5 22z" fill="#fff"/><rect x="15.5" y="20" width="33" height="4.4" rx="2.2" fill="#2a4a8a"/>
</svg>`;

export const OPPONENT = {
  rival: { name: 'Rival', face: RIVAL },
  ai: { name: 'AI', face: AI },
};

const pick = list => list[Math.floor(Math.random() * list.length)];
const RIVAL_TAKE = ['Ha! That {die} is mine.', "I'll have the {die}, thanks.", 'Mine! The {die}.', 'Too slow! {die} for me.', 'The {die}? Don\'t mind if I do.'];
const RIVAL_SHARED = ['Leftovers? I\'ll use that {die}.', 'Shared {die}… I\'ll make it count.', 'Even the scraps hurt you.'];
const RIVAL_NONE = ['Bah. Nothing left to spoil.', 'Hmph. You got lucky.'];
const AI_TAKE = ['Calculating… {die} it is.', 'Optimal pick: {die}.', 'Taking the {die}.', 'The {die} scores best for me.'];
const AI_SHARED = ['Shared {die}: put to use.', 'Processing the shared {die}.'];

// What the opponent says about a Rival or AI move event from the engine.
export function rivalLine(e) {
  const die = label(e.face);
  if (!e.hits.length) return pick(RIVAL_NONE);
  return pick(e.shared ? RIVAL_SHARED : RIVAL_TAKE).replace('{die}', die);
}
export function aiLine(e) {
  return pick(e.shared ? AI_SHARED : AI_TAKE).replace('{die}', label(e.face));
}
