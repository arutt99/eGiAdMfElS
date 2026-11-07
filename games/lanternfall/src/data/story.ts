// The campaign's narration: prologue, chapter openings and closings, ending, and credits.

export interface StoryScene {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  lines: string[];
}

export const PROLOGUE: StoryScene = {
  eyebrow: 'Prologue',
  title: 'The Long Dark',
  lines: [
    'Before the kingdoms had names, the First Lantern was lit, and its light was carried from village to village.',
    'For an age, the lanterns held back the Gloam: a living dusk that eats the light and walks on whatever it finds in the dark.',
    'Now the lanterns are going out, one valley at a time, and only one Warden still answers when they call.',
    'Her name is Ember. She has a sword, a little gold, and a road to hold.',
  ],
};

export const CHAPTERS: Record<string, { opening: string[]; closing: string }> = {
  aldergreen: {
    opening: [
      'The border stones fell quiet three nights ago. Tonight, the shadows beyond them started to move.',
      'Aldergreen has never needed defending. Its people are only now learning what the old lantern is for.',
    ],
    closing: 'At dawn the bells of Aldergreen ring for the first time in a week. Far off, deep in the Whisperwood, a second lantern gutters.',
  },
  whisperwood: {
    opening: [
      'Nothing grows straight in the Whisperwood, and neither does the road.',
      'The fireflies have gathered around the forest lantern, as if they know how little light is left.',
    ],
    closing: 'The fireflies scatter back into the trees. Among the fallen Gloam, Ember finds tracks leading south, into the drowned land.',
  },
  mirefen: {
    opening: [
      'Shamans walk the Mirefen now, mending what should stay broken.',
      'Two causeways cross the bog, and the Gloam has learned to use them both. It is learning.',
    ],
    closing: 'The last shaman sinks without a sound. Its staff is carved from pass-stone, quarried high in the Frostpeak mountains.',
  },
  frostpeak: {
    opening: [
      'The pass was sealed for a hundred winters. Something very large has opened it from the other side.',
      'Empty armor marches through the snow. Above the clouds, stone wings turn on the wind.',
    ],
    closing: 'The pass stands open and the way south is clear. Below the clouds lies a desert, and a city that once kept the oldest lantern of all.',
  },
  amberdune: {
    opening: [
      'Amberdune worshipped the sun until the sun stopped answering. Its sundials still cast shadows, though they all point the wrong way.',
      'Every one of those shadows points toward the caldera in the east.',
    ],
    closing: 'The sands settle over the ruined city. In the east, the sky is burning, and Ember knows at last where the Gloam was born.',
  },
  cinderforge: {
    opening: [
      'This is where the first light was made, and where the dark came to answer it.',
      'Three roads climb the caldera to the First Lantern. Everything the Gloam has left is on them.',
    ],
    closing: 'The First Lantern burns bright over the caldera, and the Gloam retreats.',
  },
};

export const EPILOGUE: StoryScene = {
  eyebrow: 'Epilogue',
  title: 'The Morning',
  lines: [
    'The last of the Gloam broke against the caldera wall and came apart like smoke.',
    'One by one, across six lands, the lanterns caught again, passed from hand to hand down every road that Ember had held.',
    'She stayed until the First Lantern burned steady. Then she trimmed its wick, picked up her sword, and started the long walk home.',
    'Dusk still comes, as it always will. But now, when it falls, someone lights a lantern.',
  ],
};

export const CREDITS: { heading: string; names: string[] }[] = [
  { heading: 'Created by', names: ['arutt99'] },
  { heading: 'Built with', names: ['Claude Code'] },
  { heading: 'Rendering', names: ['three.js'] },
  { heading: 'Typefaces', names: ['Fraunces', 'Alegreya Sans'] },
  { heading: 'Tools', names: ['TypeScript', 'esbuild'] },
];
