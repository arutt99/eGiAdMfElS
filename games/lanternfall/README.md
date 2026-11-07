# Lanternfall

A 3D storybook tower defense game. Build towers, send your hero, cast spells and keep the lantern lit.
It runs from `index.html`, which needs no install or internet connection.

## Playing on a phone

Lanternfall is played in landscape. Held upright, a phone shows a "turn sideways" screen and the battle pauses.

- **Tap** a tower card, then tap open ground to place a preview. Tap **✓ Build** (or the preview again) to build it, or **✕** to cancel.
- **Drag** to move the camera, **pinch** to zoom, and **twist two fingers** to rotate.
- **Hero:** tap the hero portrait, then tap the map to send them there.
- **Spells:** tap a spell, then tap the map to cast. On small screens the spell panel folds away with its book button.
- **Touch and hold** a tower card, spell, enemy or tech node to see what it does.

On computers the mouse and keyboard work as before. The interface switches to touch wording whenever the most recent input was a finger.

## Development

```bash
npm install
npm run build     # writes index.html and SoundTest.html
npm run typecheck
npm run balance   # plays every map and difficulty with a headless bot
npm run serve     # previews at http://localhost:4173
```

The source is in `src`. The simulation in `src/sim` runs without rendering, which lets the balance bot use the real game rules.
Touch input lives in `src/main.ts` (gestures, taps, the build preview) and `src/ui/touch.ts` (which input is in use).
The phone layout is the `max-height: 540px` section at the end of `src/ui/style.css`.

Open `SoundTest.html` to hear every sound effect, compare takes, and run a battle stress test. Sound designs are in `src/audio/sfx-recipes.ts`.
