# Clans artwork

Source art supplied by the game's author. These are composite sheets: each file holds several pieces, which will be cut out (and converted to WebP) as the game is built.

| File | Size | Contents |
| --- | --- | --- |
| `main-board.png` | 1254×1254 | Main map: six regions (volcano, forest, coast, sacred grove, plains, mountains) with marker slots, 0–50 score track around the edge, party-size scoring table. |
| `clans-owl-rabbit-redpanda-bear.png` | 1254×1254 | Ally card fronts (2×2): Owl Summoners, Rabbit Scientists, Red Panda Sages, Bear Stonewards. |
| `clans-raccoon-koi-tiger-monkey.png` | 1254×1254 | Ally card fronts (2×2): Raccoon Merchants, Koi Sea Spirits, Tiger Samurai, Monkey Nomads. |
| `clans-dog-fox-deer-raven.png` | 1254×1254 | Ally card fronts (2×2): Dog Townsfolk, Fox Ninjas, Deer Wind Knights, Raven Wizards. |
| `sheet-dragons-setup-reference.png` | 1448×1086 | 3 dragon cards, ally card back, dragon card back, 12 clan setup cards, player reference card. |
| `sheet-koi-board-monkey-boards.png` | 1448×1086 | Koi track board with milestones at 10/20/30/40/45, Koi scoring reference, 6 Monkey settlement boards (one per player colour). |
| `sheet-tokens-markers.png` | 1448×1086 | Prestige tokens (10/7/5/3/2/1, three of each), Fox tie-breaker tokens 1–6, 14 Raccoon coins, double-sided Bear token, control markers in 6 player colours. |

## Known issues in the art

- `main-board.png` shows the title "ETHNOS". It needs to be replaced or covered with the game's own title before shipping.
- Koi track numbers are out of order: 4, 18, 23, 27, 28, 33, 37, 38 and 43 are missing; 26, 32 and 42 appear twice; 25 comes after 26. Render the numbers as live text over a cleaned track, or regenerate the board.
- Main board score track: 9 is missing from the top row, and the left edge (49 down to 33) repeats numbers already on the bottom row (31–50). The track can't be followed as printed; draw the numbers as live text.
- Card name banners are blank; the name/value text is meant to be drawn live.
