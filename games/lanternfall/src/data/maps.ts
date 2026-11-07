export type BiomeId = 'meadow' | 'forest' | 'marsh' | 'frost' | 'desert' | 'volcano';

export interface MapDef {
  id: string;
  index: number;
  name: string;
  subtitle: string;
  story: string;
  biome: BiomeId;
  seed: number;
  /** Half extents of the buildable play area. */
  halfW: number;
  halfH: number;
  /** Control points for each road, spawn first and lantern last. */
  paths: [number, number][][];
  startGold: number;
  hpScale: number;
  /** Multiplies enemy health on Hard only, to keep each map's Hard mode in line with its place in the campaign. */
  hardHp?: number;
  /** Wave script. Groups: <count><code>[*][@path]. `*` marks elites. */
  waves: string[];
}

export const MAPS: MapDef[] = [
  {
    id: 'aldergreen', index: 0, name: 'Aldergreen', subtitle: 'The Last Warm Evening',
    story: 'The Gloam has crept past the old border stones. Light the lantern and hold the meadow road.',
    biome: 'meadow', seed: 11, halfW: 44, halfH: 26, startGold: 300, hpScale: 1.15, hardHp: 1.24,
    paths: [[[-46, -14], [-30, -18], [-20, -6], [-28, 8], [-16, 17], [-2, 8], [2, -8], [14, -17], [26, -8], [20, 8], [32, 16], [41, 6]]],
    waves: [
      '6g',
      '10g',
      '6g 4w',
      '8g 3b',
      '12g 5w',
      '5m',
      '6b 8g',
      '8w 8m',
      '10g 6b 6w',
      '2i 12g',
      '8b 8m 8w',
      '3i* 6b 16g',
    ],
  },
  {
    id: 'whisperwood', index: 1, name: 'Whisperwood', subtitle: 'Where the Fireflies Gather',
    story: 'Under the old trees the road twists and the clearings are few. Choose your ground with care.',
    biome: 'forest', seed: 23, halfW: 44, halfH: 26, startGold: 320, hpScale: 1.35, hardHp: 1.24,
    paths: [[[42, -24], [32, -10], [18, -18], [6, -8], [18, 4], [32, 12], [22, 22], [6, 16], [-6, 4], [-18, 14], [-32, 18], [-36, 2], [-26, -8], [-33, -19]]],
    waves: [
      '8g',
      '6g 3b',
      '6m 6g',
      '3s 8g',
      '8w 4b',
      '5s 6m',
      '2i 10g',
      '2p 8g 3s',
      '6b 8w 3v',
      '3p 8m',
      '3i 3s 4v',
      '10b 5p',
      '3i* 2r 8m 10w',
      '4s* 3v* 4p 3i',
    ],
  },
  {
    id: 'mirefen', index: 2, name: 'Mirefen', subtitle: 'Two Roads Through the Drowned Land',
    story: 'Mist hides two causeways through the bog. Shamans of the mire keep their broods alive. Silence them.',
    biome: 'marsh', seed: 37, halfW: 44, halfH: 26, startGold: 420, hpScale: 1.15, hardHp: 0.74,
    paths: [
      [[-46, -20], [-30, -12], [-18, -20], [-6, -12], [-10, 2], [4, 6], [18, 2], [28, 8], [39, 2]],
      [[-46, 20], [-30, 12], [-18, 20], [-4, 20], [8, 16], [18, 2], [28, 8], [39, 2]],
    ],
    waves: [
      '6g@0 6g@1',
      '4b@0 8g@1',
      '1h@0 6g@0 6w@1',
      '8m 4b@1',
      '2p@0 2h@1 6g@1',
      '5s@0 5s@1',
      '2i@0 1h@0 2l@1 6w@1',
      '8m 3a',
      '4p@0 5b@1 2r@1',
      '4i@0 2h@0 4i@1 2h@1',
      '6a 10w',
      '5s@0 4b@0 3l@1 3p@1 2h@1',
      '1y@0 14g@1',
      '4i 2r 2l 4h 8m',
      '1y*@0 1c*@1 6p@1 10w@0',
    ],
  },
  {
    id: 'frostpeak', index: 3, name: 'Frostpeak Pass', subtitle: 'The Road Above the Clouds',
    story: 'The pass is the only way south. Ironhusks march through the snow, and gargoyles ride the wind above.',
    biome: 'frost', seed: 53, halfW: 44, halfH: 26, startGold: 520, hpScale: 1.14, hardHp: 0.82,
    paths: [
      [[-20, -28], [-14, -14], [-28, -6], [-36, 8], [-22, 18], [-6, 12], [2, 0], [14, 6], [24, 18], [37, 12], [39, -2]],
      [[28, -28], [20, -18], [32, -10], [18, -4], [14, 6], [24, 18], [37, 12], [39, -2]],
    ],
    waves: [
      '8g@0 5w@1',
      '4b@0 4b@1',
      '8m 6g@0',
      '2a 8w@1',
      '3s@0 2i@1',
      '3p@0 2h@0 8g@1',
      '2a 4q 4m',
      '3i@0 4s@1 2h@1',
      '5b@0 3r@0 6g@1',
      '4p 5q 4m',
      '1x@1 8w@0',
      '6a 3s@0 4f@0 3h@0',
      '1c@0 1x@1 6b@1',
      '4i 3r 3h 3a 4q',
      '5p@0 5s@1 5v@1',
      '1x* 1j 6a 6f 8w',
    ],
  },
  {
    id: 'amberdune', index: 4, name: 'Amberdune', subtitle: 'City of Fallen Sundials',
    story: 'A long road loops through the ruins of a sun-worshipping city. Time and sand favor no one.',
    biome: 'desert', seed: 71, halfW: 44, halfH: 26, startGold: 520, hpScale: 1.14, hardHp: 0.72,
    paths: [
      [[-46, 8], [-32, 18], [-16, 12], [-10, -4], [-24, -12], [-36, -18], [-14, -22], [8, -18], [12, -2], [2, 10], [10, 20], [28, 18], [34, 4], [24, -8], [34, -18], [41, -10]],
    ],
    waves: [
      '12g 6w',
      '6b 8w',
      '10m 3s',
      '4i 8g',
      '16w 3a',
      '4p 2h 8b',
      '4s 4f 2i',
      '1z 10g',
      '4a 5q 14w',
      '6i 3h',
      '4p 6f 5s',
      '2z 10m',
      '10i 6b 4h',
      '8a 5q 8f 12w',
      '1c 1z 5s 6f',
      '6p 5i 6f 3r 4h',
      '1z* 1j* 1c* 10a',
      '2z* 2c* 1j* 8s 8f 24w',
    ],
  },
  {
    id: 'cinderforge', index: 5, name: 'Cinderforge', subtitle: 'The Heart of the Gloam',
    story: 'Three roads climb the burning caldera to the First Lantern. Hold here, and the long night ends.',
    biome: 'volcano', seed: 97, halfW: 44, halfH: 26, startGold: 640, hpScale: 0.74, hardHp: 0.8,
    paths: [
      [[-46, -16], [-30, -20], [-22, -6], [-32, 6], [-18, 12], [-6, 4], [4, 0]],
      [[-46, 22], [-28, 20], [-12, 22], [2, 14], [4, 0]],
      [[34, -28], [28, -14], [12, -20], [-4, -16], [-6, -6], [4, 0]],
    ].map((road) => [...road, [14, 8], [28, 4], [38, 10]] as [number, number][]),
    waves: [
      '6g@0 6g@1 6g@2',
      '4b@0 6w@1 4b@2',
      '10m 4s@1',
      '3i@0 2r@0 6w@2',
      '4a 4p@1',
      '2h@0 4s@0 2h@2 4s@2',
      '1k@1 10g@0 10g@2',
      '5a 5q 10w@1',
      '4i@0 4f@0 4i@2 4f@2 3h@1',
      '4p@0 3l@0 4v@1 5s@1 4f@2 4p@2',
      '1c@0 1y@2 8b@1',
      '12a 14m',
      '6i@1 4r@1 4h@1 12w@0',
      '5s@0 5f@0 4v@1 6s@1 5s@2 5f@2',
      '1j 1z@0 6b@2',
      '4p 3l 4f 4h',
      '6a 6q 5i 3r',
      '1k@0 1c@0 1x@2 1c@2 10s@1',
      '5i* 5r 4h 20w',
      '1k*@0 1c*@1 1z*@2 8a 6f 16w',
    ],
  },
];

export interface EndlessInfo { minCleared: number }
export const ENDLESS_UNLOCK_AFTER = 1;
