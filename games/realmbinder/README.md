# Realmbinder

A digital trading-card collection in an original high-fantasy world: open booster packs, fill a binder, show off your best pulls on a shelf, and buy and sell at a shop whose stock changes over time. Served as static files at `games/realmbinder/`, with no build step, account or server. Progress is saved in the browser (`realmbinder.save.v1`).

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

All art is procedural SVG (`art.mjs`), seeded by the card, so the same card always draws the same picture. Each scene has a time of day, a faction palette, layered ridges, a faction landscape, the subject, particles and a vignette. Subjects come from the card's `subject` code in `data.mjs`:

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
