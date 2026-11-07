# Lanternfall

A 3D storybook tower defense game. To play, double-click `Lanternfall.html`. It needs no install or internet connection.

## Development

```bash
npm install
npm run build     # writes Lanternfall.html and SoundTest.html
npm run typecheck
npm run balance   # plays every map and difficulty with a headless bot
```

The source is in `src`. The simulation in `src/sim` runs without rendering, which lets the balance bot use the real game rules.

Open `SoundTest.html` to hear every sound effect, compare takes, and run a battle stress test. Sound designs are in `src/audio/sfx-recipes.ts`.
