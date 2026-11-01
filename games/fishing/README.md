# Fishing

A roll-and-write dice game for one player, built for a phone held in portrait. On a phone the two sheets are cut into three tall pages that fill the screen: **Boats** (the boat sheet plus the coin track), **Harbor** and **Wharf** (with the market). Swipe sideways or use the switcher at the top; wider screens such as tablets, landscape phones and small phones get the two whole sheets instead. Your dice sit in a bar at the bottom: tap one to pick it and the sheet jumps to where it can go. A gold dot on a tab means that page has somewhere to tap too. **Hold any area** of a sheet, or any die, for a card explaining what it does and what it's worth for you right now. Served as static files at `games/fishing/`; no build step, account or server.

## Play

Every round you pick a die, the game highlights where it can go, and you tap a section — the top open box is marked for you. Circled boxes trigger licenses (L), boat launches (B), your choice of either (?), or a private fishing trip (F). Then the leftover shared die is used too.

1. **Boat dice** – Shrimp, Cod, Lobster, Swordfish, Oyster or three coins.
2. **Income** – 1 coin plus Lobster license and Canning Co. bonuses (max 10).
3. **Fishing** – even rounds. Launched boats catch a fish each; oyster boats catch two or one plus a coin.
4. **Town dice** – Harbor (mark a harbor ship), Wharf (mark a building), Market (coins by fish caught); one boat die is always in the town pool.

Any die can be traded for a coin instead. Coins fill the track on the harbor sheet; a star on the track gives a star action (mark the top open box of any section). Wharf buildings switch on when their last box is marked. The final score panel on the boat sheet is kept live.

## Modes

- **Versus Rival** (8 rounds): three boat dice / two town dice + one boat die. A Rival takes a die each phase and strikes the two lowest open boxes in that section (one for the shared die); Market dice strike your next coin-track star. Red **R** pins show where it is heading. It moves first in even rounds.
- **Solo waters** (10 rounds): no Rival, one die fewer in each pool.

## Files

- `engine.mjs` – rules, dice flow, Rival behaviour, scoring, save validation (no DOM).
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
