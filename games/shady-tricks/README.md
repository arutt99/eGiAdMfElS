# Shady Tricks

A wicked trick-taker for you and three AI opponents: Silas (The Schemer), Morgana (The Duchess)
and Crispin (The Fool).

## Rules

- 50 cards: four colours of −3 to 9 (no 0), plus two Jesters worth 0 and 10. Twelve each; two are
  set aside unseen.
- The first coloured card sets the lead. Follow it if you can. Jesters can always be played and
  never set the lead.
- Of the lead-colour cards and Jesters, the **second-highest** takes the trick (or the only one, if
  there is just one). The taker keeps their card plus every off-colour card; the rest are discarded.
- A card matching a number already in your tableau cancels it, and both leave.
- After 12 tricks, tableaus are added to totals (never below 0). The lowest unique total leads next.
- When anyone ends a round over 40, the game ends. Highest total at or below 40 wins; leaders who tie
  knock each other out.

## Files

- `engine.mjs`: the rules and the bots. Pure functions over a JSON-safe state; tested in
  `tests/shady-tricks.test.mjs`.
- `app.mjs`: rendering, the fanned hand (tap to pick and preview, tap again or flick up to play),
  card motion (FLIP from hand or seat to the trick, then into the taker's tableau), the turn loop,
  the round summary, the Rules / Scores / Log / Settings sheet, the walkthrough and saves.
- `fx.mjs`: sound, haptics, banners, floaters, count-ups and confetti (adapted from Slap's).
- `style.css`: layout for phones (including iPhone SE and landscape) and iPad.

## Saved data

`localStorage` keys: `shady.v1` (game in progress), `shady.prefs` (settings), `shady.stats`
(games played, wins, best finish), `shady.tour` (walkthrough seen).
