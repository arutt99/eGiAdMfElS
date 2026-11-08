# Realmbinder

A digital trading-card collection in an original high-fantasy world: open booster packs, fill a binder, show off your best pulls on a shelf, and buy and sell at a shop whose stock changes over time. Served as static files at `games/realmbinder/`, with a prebuilt 3D opener and no account or application server. Progress is saved in the browser (`realmbinder.save.v1`).

## Set 1: The Sundered Crown

130 cards across six factions plus a handful of unaligned legends:

| Faction | Who | Look |
|---|---|---|
| Sylvan Courts | elves of Aelwood | forests, moonlight, fireflies |
| Deephold | dwarves of the Kharuun Deeps | peaks, forges, embers |
| Westmarch | human knights and rangers | castles, fields, banners |
| Ashen Horde | orcs and goblins | red skies, spikes, smoke |
| Starward Conclave | wizards | floating spires, starlight |
| Hearthfolk | small folk of Bramblebury | rolling hills, round doors |

Rarities: 60 Common, 36 Uncommon, 20 Rare, 10 Legendary, 4 Mythic.

A pack holds 6 commons, 3 uncommons and a rare slot (Rare 85%, Legendary 12.5%, Mythic 2.5%). In 30% of packs a foil of any rarity replaces a common. A Legendary or Mythic can come **Gilded**, a gold alternate frame worth four times a plain copy.

Every copy you own is its own object, with a condition (Mint, Near Mint, Excellent, Lightly Played), a print number out of its print run, and foil/gilded flags. Two copies of the same card can be worth very different amounts.

## Art

The approved visual direction and reference are in [ART_DIRECTION.md](ART_DIRECTION.md). All 130 cards use individual illustrated assets. The shopkeeper and other non-card subjects use procedural SVG (`art.mjs`). Procedural subjects come from the `subject` codes in `data.mjs`:

- `hero:<race>:<gear>`: a portrait (elf, dwarf, human, orc, goblin, mage, halfling) with a weapon or item. Skin, hair, clothing, pose and scale vary. Rares get capes, Legendaries get crowns.
- `beast:<shape>`: wolf, stag, owl, eagle, horse, ram, bear, troll, golem, treant, dragon, plus variants.
- `realm:<landmark>`: tower, gate, tree, bridge, hall, village, forge, camp, peak, lake, citadel.
- `relic:<object>`: sword, crown, chalice, amulet, tome, gem and more, on a pedestal.
- `spell:<style>`: a sigil in fire, frost, light, shadow, nature, storm, rune or earth.

## Economy

- You start with 1,000 gold and 3 packs. A stipend of 30 gold an hour builds up (up to 360). Tap the green chip to collect it.
- **The Copper Kettle** restocks every 4 hours. Each delivery has 8–16 packs at 110–135g, sometimes a 12-pack booster box at 15% off, and a glass case of 6 singles at market price plus 25%.
- Market prices drift smoothly day to day. Each card also has its own collector demand. **Market watch** shows the day's biggest movers.
- Marta buys cards at 45% of market. **Sell spare copies** sells extra Common, Uncommon and Rare copies but always keeps your best copy of each card and anything on your shelf. Legendary and Mythic cards are sold one at a time, with a confirmation.
- Balance check (in the tests): an average pack is worth more than its price on the market, but selling a whole pack back to the shop returns less than a pack costs, so there is no infinite gold loop.

Add `?ff=6` to the URL to move the clock six hours ahead, which is handy for seeing a restock or price drift.

## Files

- `data.mjs`: the card list, factions, rarities and flavor text.
- `engine.mjs`: packs, copies, prices, the shop, selling, the stipend, the shelf and save validation (no DOM; tested in `tests/realmbinder.test.mjs`).
- `art.mjs`: the procedural card art.
- `app.mjs`, `style.css`, `index.html`: the UI (Shop, Packs, Binder, Shelf, the pack opener and card detail).

## Next ideas

Bot collectors who trade and bid, scheduled set releases with sets going out of print, more shops with their own personalities, grading, and achievements.


## Interface overhaul

The collector’s table, Copper Kettle, binder, display room, card frames, booster wrappers, inspector and pull summary share a cozy walnut, parchment and lamplight design, with forest-green foil packs. Desktop navigation sits above the collection; phone navigation remains within thumb reach.

- Cards establish their own sizing container. Artwork fits within its 4:3 window without cropping, distortion or flex shrink; names wrap within a fixed header, and full flavor text is also available in the inspector.
- The approved illustrated assets are shared by DOM cards and the Three.js opener. Procedural non-card art is embedded as an SVG image so repeated scenes never share gradient IDs with hidden cards or overlays.
- Packs and cards remain still at rest. A deliberate tear and flip replace idle wobble and geometric hover tilt. Reduced-motion preferences disable transitions.
- Opener timers are cancelled on close, restart and Reveal all. Rapid input cannot consume extra packs or advance through an unfinished flip. A committed pack’s ten cards are saved before its animation starts.
- Card details stay interactive above the pull summary. Dialogs lock background interaction, contain keyboard focus and support Escape. Reveal controls work with touch, mouse and keyboard.
- The binder supports search, faction, ownership and rarity filters. The display picker includes the entire collection, sorted by value.
- Existing `realmbinder.save.v1` collections and the set/economy remain compatible. The prebuilt opener is included, so the game still serves as static files.

### Verification

Serve the repository root on localhost, then run:

```sh
node --test tests/realmbinder.test.mjs
node tests/realmbinder.browser.cjs
```

The browser suite needs Playwright and Chromium. Set `PLAYWRIGHT_MODULE` to an installed Playwright package and `CHROMIUM_PATH` to a Chromium executable when they are outside the normal paths. `REALMBINDER_URL` can override the default `http://127.0.0.1:4173/games/realmbinder/` URL.

Browser coverage includes pack cancellation, complete keyboard reveals, rapid Reveal all, inspector actions above the summary, shop purchases, binder filters, shelf changes, save/reload compatibility, all 130 cards’ frame bounds, and desktop/320px/390px/landscape layouts. QA screenshots are written to the ignored `tmp/realmbinder-qa/` directory.


## Three.js pack opening

The opener lazily loads a self-contained Three.js 0.187.0 bundle only when needed. No CDN or remote artwork service is required.

- A sculpted foil pouch has pinched edges, crimped seals, deterministic creases, front/back print, an irregular tear line and physically lit reflective materials.
- Pull across the top seam with touch or mouse, or use **Break the seal**. The strip separates, the sleeve drops away and the card stack emerges.
- Rounded cards have cardstock edges, matching printed backs, full card art and view-dependent foil/gilded materials. One click turns the entire deck face-up. Each subsequent click on the deck slides the top card aside and reveals the next card already face-up; there is no separate flip per card. A quiet paper flick accompanies each reveal, without rarity chimes.
- Drag a revealed card slightly to inspect it under the light. Bounds come from the stationary stage; moving a card never changes its input reference.
- Rendering stops at rest. Pixel density is capped at 2. Each closed/skipped/restarted opener disposes its renderer, geometries, materials, textures, environment map, observers and event handlers.
- Reduced-motion preferences and unavailable WebGL use the simple opener. **Simple view / 3D view** remembers a manual preference. If graphics are lost after commitment, the ten saved cards are shown in the pull summary.

### Building the 3D bundle

```sh
cd games/realmbinder
npm ci
npm run build
```

Edit `src/opener-3d.mjs` and `src/print-textures.mjs`, then rebuild the committed `opener-3d.mjs`. The build also includes the Three.js MIT license in `licenses/three.txt`.

`tests/realmbinder-3d.browser.cjs` exercises GPU rendering, complete ten-card reveals, drag opening and inspection, skip cancellation, graphics-context loss, disposal and simple-mode preference. It captures screenshots and `tmp/realmbinder-qa/pack-opening-3d.webm`. It requires Playwright’s FFmpeg installation for recording; the ordinary browser regression suite does not require FFmpeg.
