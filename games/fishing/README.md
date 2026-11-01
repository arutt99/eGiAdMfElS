# Fishing

A roll-and-write dice game for a phone held in portrait: solo, or against a computer player. On a phone the two sheets are cut into three pages that each fit whole on the screen, no scrolling: **Boats** (the boat sheet plus the coin track), **Harbor** and **Wharf** (with the market); the header and dice dock are kept slim and float over the page edges so the sheets get as much room as possible. Swipe sideways or use the switcher at the top; wider screens such as tablets and landscape phones get the two whole sheets instead. Your dice sit in a bar at the bottom: tap one to pick it and the sheet jumps to where it can go. A gold dot on a tab means that page has somewhere to tap too. Against the AI, the **You | AI** toggle in the status strip flips between the two sheets. **Hold any area** of a sheet, or any die, for a card explaining what it does and what it's worth for you right now. Served as static files at `games/fishing/`; no build step, account or server.

## Look and feel

The bars are dark varnished wood with brass trim, the dice sit on a felt tray, and menus are parchment bottom sheets (swipe down, tap outside or press Escape to close; automatic turns pause while one is open). Headings use Alegreya (SIL Open Font License), bundled in `assets/fonts/`.

- **Status strip** under the tabs: score, coins with the distance to the next ★, round pips (fish mark the Fishing rounds) and, against the AI, its score (tap it to flip to the AI's sheet).
- **Sound and haptics**: synthesized with Web Audio (dice rattle, pencil, coins, horn, splash, strike, fanfare); haptics use `navigator.vibrate` on Android and the switch-checkbox tick on iOS 18+, felt only on your own taps. Both can be turned off in the pause menu (`fishing.prefs`).
- **Big moments**: a banner for each new round, Fishing, a ★ reached on the coin track, a license level, the King Crab license and a wharf building opening; fish and coins fill one by one; "+VP" floaters fly into the strip.
- **Decisions** (license or boat, King Crab bonus, oyster catch) appear as cards over the dice tray, each saying what it is worth right now.
- **Game over**: categories count up, then the solo rank badge (and how far the next rank is), "New best!" and confetti on a best score or a win against the AI.
- News about income and fishing appears briefly above the dock; the status line under the prompt stays put.
- **Opponents have a seat**: the Rival (a grumpy captain) or the AI (a tin skipper) sits at the left of the dock, fidgets while choosing, catches the die it takes as it flies over, and says what it did in a speech bubble. When the Rival strikes boxes on a page you are not looking at, **Show me** jumps there; struck boxes pulse for a moment. The AI's bubble offers **See its sheet**.
- **You | AI** toggle in the status strip shows both scores; switching turns the sheet over like a card, and the AI's sheet gets a red frame and tab.
- **Title screen** on every launch: the sheet's own Fishing logo, then Continue (with round, mode and score), New game and How to play.
- **Tour**: the first game starts a six-step tour of coach marks over the real screen: tap a die, tap where it goes (these two wait for you to do it), then the status strip, the page tabs, the opponent and hold-for-help. Automatic turns wait while a tip is up. Skip any time; replay it from the pause menu or How to play (`fishing.coach`).
- **How to play** is illustrated with pieces of the real sheets (a column with its glowing target, license cards, boats with fish, the coin track, the Casino, the score table) and the opponents' portraits.

## Play

Every round you pick a die, the game highlights where it can go, and you tap a section and the top open box is marked for you. Circled boxes trigger licenses (L), boat launches (B), your choice of either (?), or a private fishing trip (F). Then the leftover shared die is used too.

1. **Boat dice** – Shrimp, Cod, Lobster, Swordfish, Oyster or three coins.
2. **Income** – 1 coin plus Lobster license and Canning Co. bonuses (max 10).
3. **Fishing** – even rounds. Launched boats catch a fish each; oyster boats catch two or one plus a coin.
4. **Town dice** – Harbor (mark a harbor ship), Wharf (mark a building), Market (coins by fish caught); one boat die is always in the town pool.

Any die can be traded for a coin instead. Coins fill the track on the harbor sheet; a star on the track gives a star action (mark the top open box of any section). Wharf buildings switch on when their last box is marked. The final score panel on the boat sheet is kept live.

## Modes

- **Solo** (8 rounds, internal key `rival`): the solo game. Three boat dice / two town dice + one boat die. The Rival takes a die each phase and strikes the two lowest open boxes in that section (one for the shared die); Market dice strike your next coin-track star. Red **R** pins show where it is heading. It moves first in even rounds.
- **Vs AI** (10 rounds, key `ai`): a computer player with its own full sheet drafts from the same three dice: you each take one (you first in odd rounds, it first in even rounds), then both use the shared die. It never touches your sheet. The **You | AI** toggle in the status strip flips to its sheet and live score and back; the final screen compares both scores line by line. The AI is greedy: it tries every legal use of every die it can take on a copy of its sheet, resolves the follow-ups (stars, license-or-boat, oyster catches) the same way, and keeps the best projected value.
- **Free play** (10 rounds, key `open`): no opponent, one die fewer in each pool.

## Files

- `engine.mjs` – rules, dice flow, Rival behaviour, the AI player, scoring, save validation (no DOM).
- `layout.mjs` – pixel positions of every box, fish slot and tap area on the two sheet images, and the crops that make up each screen page.
- `info.mjs` – long-press help: the area under a point and its explanation for the current game.
- `app.mjs` – page building, rendering of marks over the sheets, status strip, dice bar, decision cards, news, bottom sheets, final score, saves, undo.
- `moments.mjs` – what changed between two states (marks, fish, launches, licenses, buildings, coins, stars, rounds), used to stage them (no DOM).
- `fx.mjs` – sound effects, haptics, banners, floaters, count-ups and confetti.
- `people.mjs` – the opponents' portraits (inline SVG) and what they say.
- `style.css`, `index.html`, `manifest.webmanifest`, `icon.svg`.
- `assets/sheet-*.webp`, `assets/dice/*.webp`, `assets/fonts/` – sheet art, transparent dice faces and the heading font.

Progress saves to local storage (`fishing.v1`) after every move; best scores per mode live under `fishing.best`. Undo steps back through your own moves within the current roll of the dice.

## Test

```sh
node --test tests/fishing.test.mjs
```
