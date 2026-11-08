# Lanternfall

A 3D storybook tower defense game. Build towers, send your hero, cast spells and keep the lantern lit.
It runs from `index.html`, which needs no install or internet connection.

## Playing on a phone

Lanternfall is played in landscape. Held upright, a phone shows a "turn sideways" screen and the battle pauses.

- **Tap** a tower card, then tap open ground to place a preview. Tap **✓ Build** (or the preview again) to build it, or **✕** to cancel.
- **Drag** to move the camera, **pinch** to zoom, and **twist two fingers** to rotate. The **Fit battlefield** button (top right, or Home on a keyboard) brings back the whole map.
- **Hero:** tap the hero portrait, then tap the map to send them there.
- **Spells:** tap a spell, then tap the map to cast. On small screens the spell panel folds away with its book button.
- **Touch and hold** a tower card, spell, enemy or tech node to open its card. It stays open after you lift your finger, and closes with its **×** or your next touch anywhere else.
- **Tower panel:** on phones, a selected tower's panel shows its upgrade choices, prices, targeting and sell without scrolling. The spells move into a strip beside it so they stay in reach, and the tower cards return when the panel closes. The **ⓘ** button shows the full descriptions and current stats.

Hero powers and spells are at least 44 pixels across on touch screens.

On computers the mouse and keyboard work as before. The interface switches to touch wording whenever the most recent input was a finger.

## Saved battles

A battle is saved between waves, and again the moment each wave is called. If the page reloads or closes mid-battle, the title screen offers **Resume Battle**, which picks up from the start of the wave that was in progress. Leaving a battle, winning or losing clears the save.

Changing the art style in Settings reloads the game, so during a battle the switch waits until you return to the map.

If the browser resets the graphics (low memory or a driver restart), the battle pauses behind a notice and continues from the pause menu once the picture is back. If it doesn't come back, the notice's reload button resumes the battle.

## Demo mode

**Demo Mode** on the title screen reloads the game with `?demo` in the address. It plays from a separate save with every map cleared and the whole Tech Tree bought, so every tower, spell and hero is ready. Your real save is untouched, and **Leave Demo Mode** goes back to it.

In demo mode, Endless Night lets you pick any map and the wave to start at. Skipped waves pay out roughly the gold and hero experience they would have earned, and the battle waits for you to call the first wave. The cheat menu (`` ` `` or the pause menu) can add more gold.

## Development

```bash
npm install
npm run build     # writes index.html and SoundTest.html
npm run typecheck
npm test          # simulation tests (damage bonuses, statistics, Endless rewards, saved battles)
npm run balance   # plays every map and difficulty with a headless bot
npm run serve     # previews at http://localhost:4173
```

The source is in `src`. The simulation in `src/sim` runs without rendering, which lets the balance bot use the real game rules.
Touch input lives in `src/main.ts` (gestures, taps, the build preview) and `src/ui/touch.ts` (which input is in use).
The phone layout is the `max-height: 540px` section at the end of `src/ui/style.css`. On other screens `UI.layoutTowerBar` keeps the tower cards clear of the hero and spell panels: it shifts the bar between them, closes up the cards, or raises the bar above them on tablets held upright.

`tests/lanternfall.browser.cjs` at the repository root checks HUD hit-testing at tablet, laptop and phone sizes, compact HUD overlaps, touch target sizes, the phone tower panel, long-press cards, Fit battlefield, the map rail, graphics context loss, resuming after a reload and the art style switch. Run it with `npm run build && npm run serve` going, from the repository root: `node tests/lanternfall.browser.cjs`.

Open `SoundTest.html` to hear every sound effect, compare takes, and run a battle stress test. Sound designs are in `src/audio/sfx-recipes.ts`.
