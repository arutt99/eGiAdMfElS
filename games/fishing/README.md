# Fishing

A roll-and-write dice game for a phone held in portrait — solo, or against a computer player. On a phone the two sheets are cut into three pages that each fit whole on the screen, no scrolling: **Boats** (the boat sheet plus the coin track), **Harbor** and **Wharf** (with the market); the header and dice dock are kept slim and float over the page edges so the sheets get as much room as possible. Swipe sideways or use the switcher at the top; wider screens such as tablets and landscape phones get the two whole sheets instead. Your dice sit in a bar at the bottom: tap one to pick it and the sheet jumps to where it can go. A gold dot on a tab means that page has somewhere to tap too. **Hold any area** of a sheet, or any die, for a card explaining what it does and what it's worth for you right now. Served as static files at `games/fishing/`; no build step, account or server.

## Play

Every round you pick a die, the game highlights where it can go, and you tap a section — the top open box is marked for you. Circled boxes trigger licenses (L), boat launches (B), your choice of either (?), or a private fishing trip (F). Then the leftover shared die is used too.

1. **Boat dice** – Shrimp, Cod, Lobster, Swordfish, Oyster or three coins.
2. **Income** – 1 coin plus Lobster license and Canning Co. bonuses (max 10).
3. **Fishing** – even rounds. Launched boats catch a fish each; oyster boats catch two or one plus a coin.
4. **Town dice** – Harbor (mark a harbor ship), Wharf (mark a building), Market (coins by fish caught); one boat die is always in the town pool.

Any die can be traded for a coin instead. Coins fill the track on the harbor sheet; a star on the track gives a star action (mark the top open box of any section). Wharf buildings switch on when their last box is marked. The final score panel on the boat sheet is kept live.

## Modes

- **Solo** (8 rounds, internal key `rival`): the solo game. Three boat dice / two town dice + one boat die. The Rival takes a die each phase and strikes the two lowest open boxes in that section (one for the shared die); Market dice strike your next coin-track star. Red **R** pins show where it is heading. It moves first in even rounds.
- **Vs AI** (10 rounds, key `ai`): a computer player with its own full sheet drafts from the same three dice — you each take one (you first in odd rounds, it first in even rounds), then both use the shared die. It never touches your sheet. The **AI sheet** button in the header flips to its sheet and live score and back; the final screen compares both scores line by line. The AI is greedy: it tries every legal use of every die it can take on a copy of its sheet, resolves the follow-ups (stars, license-or-boat, oyster catches) the same way, and keeps the best projected value.
- **Free play** (10 rounds, key `open`): no opponent, one die fewer in each pool.

## Files

- `engine.mjs` – rules, dice flow, Rival behaviour, the AI player, scoring, save validation (no DOM).
- `layout.mjs` – pixel positions of every box, fish slot and tap area on the two sheet images, and the crops that make up each screen page.
- `info.mjs` – long-press help: the area under a point and its explanation for the current game.
- `app.mjs` – page building, rendering of marks over the sheets, dice bar, prompts, menu, saves, undo.
- `style.css`, `index.html`, `manifest.webmanifest`, `icon.svg`.
- `assets/sheet-*.webp`, `assets/dice/*.webp` – sheet art and transparent dice faces.

Progress saves to local storage (`fishing.v1`) after every move; best scores per mode live under `fishing.best`. Undo steps back through your own moves within the current roll of the dice.

## Test

```sh
node --test tests/fishing.test.mjs
```
