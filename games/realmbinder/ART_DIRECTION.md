# Realmbinder art direction

## Approved reference

[Hollow Oak Owl](assets/card-art/SC-006.png) is the template for the set. The [rabbit study](assets/card-art/style-reference.png) establishes the desired balance of setting and open space. These are art references, not mandates to repeat their subjects or compositions.

## Visual language

Warm, inviting woodland storybook illustration with confident, dark, gently irregular ink outlines, hand-painted shapes and subtle paper grain. Use a restrained palette of warm cream, ochre, moss, umber and rust. Other factions can introduce their own colors while retaining the muted, natural character. Magic is a small accent, not a field of effects.

Each image should have one unmistakable focal subject derived from the actual card name and subject in `data.mjs`. Show just enough context to tell its story: a partial branch, a few plants, an object or a faint atmospheric wash. Leave generous quiet space. Hollow Oak Owl balances an owl and its hollow with a few leaves and flowers; it is the benchmark for detail and density. Avoid crowded panoramas, repeating the same composition across the set, heavy lighting effects and tiny details that vanish at card size. Creatures, people, realms, relics and spells should remain true to their card identities and faction lore.

Create standalone illustrations with no embedded card name, rules, border, logo or other typography; the app supplies these. Check each at the small size used in the binder as well as in the detail view. Keep the complete focal subject visible in the card art window.

## App environment

Extend the same visual language to the interface: woodland colors, warm parchment, worn wood, understated botanical accents and clear readable controls. The interface should frame the collection without competing with it. Preserve rarity, foil and gilded cues, contrast, responsive layout and existing gameplay.

## Asset status and integration

All 130 cards in The Sundered Crown have individual illustrations. The app loads optimized WebP assets in `assets/card-art/`, keyed by the stable card IDs in `data.mjs`. Full-resolution PNGs for the 125 new cards are in `assets/card-art/originals/`; the five earlier PNGs remain alongside the card assets. The approved owl and rabbit reference PNGs remain here. `artFor` in `art.mjs` selects the card images and retains procedural art for non-card subjects such as the shopkeeper. Keep card IDs and saved collection data stable, and verify art in binder, shop, packs, shelf and detail views.
