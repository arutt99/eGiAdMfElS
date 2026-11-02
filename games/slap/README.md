# Slap!

A push-your-luck card game for you and four AI opponents.

## Rules

- 90 cards: eleven each of 1 to 5, seven each of 6 to 10.
- Your turn starts by banking the cards you left exposed last turn into your Loot.
- Draw at least one card. Once three or more cards are in front of you, drawing a value you already
  have is a **bust**: every exposed card goes to the Lost pile.
- Draw a value another player has exposed and you may **steal** all of their cards of that value.
- **Keep** ends your turn. Kept cards stay exposed, and can be stolen, until your next turn.
- When the deck runs out, everyone banks what's in front of them. Richest Loot wins.

## Files

- `engine.mjs`: the rules and the bots. Pure functions over a JSON-safe state; tested in
  `tests/slap.test.mjs`.
- `app.mjs`: rendering, card animations (every card is FLIP-animated between deck, pile, seats,
  Loot and the Lost pile), the turn loop, the Rules / Log / Settings sheet, the walkthrough and saves.
- `fx.mjs`: sound, haptics, banners, floaters, count-ups and confetti (adapted from Fishing's).
- `style.css`: layout for phones (including short screens and landscape) and iPad.

## Saved data

`localStorage` keys: `slap.v1` (game in progress), `slap.prefs` (settings), `slap.stats`
(wins, games played, best Loot), `slap.tour` (walkthrough seen).
