# Pirates

A complete card game for one human and Captain Rook. Landscape fills the screen with a single unscrolled table: an oversized haul in the middle, the deck at one side, and both banks fanned out as hands. Portrait keeps a compact stacked layout. Served as static files at `games/pirates/`; no build step, account, API, externally hosted assets, or server is required. The root game shelf links here.

## Play

Draw different suits, resolve every ability, and collect before repeating a suit. The highest card of each suit in your bank scores. The game ends after the turn that draws the last card. Ties use total banked cards, then a shared victory.

The base deck has 60 cards: six cards in each of ten suits. Mermaids run from 4 to 9; other suits run from 2 to 7. The lowest of each suit starts in a shuffled discard pile. Both banks begin empty and the starting player is random.

All ten abilities are implemented, including mandatory bank choices, chained abilities, Anchor protection, Key and Chest bonuses, Oracle reveals, and the Kraken counting cards from every source. Hook and Sword choices are resolved by dragging a highlighted card from either hand anywhere onto the table; a Cannon fires on any long swipe to the right, or onto the rail down the right edge. The deck itself is clicked to draw, and a finished turn hands the table to the next captain on its own. Oracle reveals only the next card. Protected Key and Chest cards collected via Anchor also earn the bonus. Bonus cards enter the bank directly without triggering abilities. The built-in guide explains every suit and edge case.

The bot follows the same action reducer as the human. It evaluates scoring gains, Cannon damage, safe ability targets, protection, bonuses, and how far it trails near the end. Its draw estimates use public card-counting information. Hidden draw order never affects its choice; Oracle permits looking at the next card.

## Files

- `engine.mjs`: rules, legal actions, scoring, bot decisions, save validation.
- `app.mjs`: touch interface, dialogs, automatic saves, bot pacing.
- `icons.mjs`, `style.css`, `table.css`: suit UI, base controls, and responsive painted tabletop styling.
- `assets/pirate-table.webp`: bundled pirate artwork (288 KiB); see `assets/ARTWORK.md` for generation details.
- `assets/cards/`: ten reusable suit illustrations plus the illustrated deck back; see `assets/ARTWORK.md` for the art direction and generation details.
- `manifest.webmanifest`, `icon.svg`: home-screen metadata and icon.

Progress is stored under `pirates.v1` in local storage after each move. Resume restores pending choices and bot turns. If storage is unavailable, the game remains playable and explains that the tab must stay open. A new voyage requires confirmation while a game is in progress.

## Run locally

From the repository root:

```sh
python -m http.server 4173
```

Open `http://localhost:4173/games/pirates/`.

## Verification

```sh
node --test tests/pirates.test.mjs
node tests/pirates.browser.cjs
```

The engine tests cover setup, all abilities, forced busts, chains, final turns, scoring, ties, save validation, hidden-information boundaries, and 500 seeded complete matches with card conservation checked after every move.

The browser suite requires Playwright and Chromium. Set `PLAYWRIGHT_MODULE` to an existing Playwright package directory and `CHROMIUM_PATH` to an existing Chromium executable if they are not installed in their default locations. Optionally set `PIRATES_URL` to a deployed URL. It plays a complete game through the visible controls, checks save/resume, dialogs, restarts, unavailable storage, and layouts from 320 to 1280 pixels. Screenshots are written to the ignored `tmp/pirates-qa/` directory.

GitHub Pages serves the repository root from `main`. Publish these static files together; all asset links are relative and work under the repository subpath.
