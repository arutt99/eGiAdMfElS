// Realmbinder set data. Set 1: The Sundered Crown (130 cards).
// Each card: [rarity, kind, name, art subject]. Subjects pick the procedural art:
//   hero:<race>:<gear>   beast:<shape>   realm:<landmark>   relic:<object>   spell:<style>

export const RARITIES = Object.freeze({
  C: { key: 'C', name: 'Common', rank: 0, base: 4, color: '#b9b2a2' },
  U: { key: 'U', name: 'Uncommon', rank: 1, base: 12, color: '#7fc7a0' },
  R: { key: 'R', name: 'Rare', rank: 2, base: 55, color: '#6fa8ff' },
  L: { key: 'L', name: 'Legendary', rank: 3, base: 240, color: '#f3c75d' },
  M: { key: 'M', name: 'Mythic', rank: 4, base: 1000, color: '#ff6f91' },
});

export const KINDS = Object.freeze({
  hero: 'Hero', beast: 'Beast', realm: 'Realm', relic: 'Relic', spell: 'Spell',
});

export const FACTIONS = Object.freeze({
  sylvan: { key: 'sylvan', name: 'Sylvan Courts', short: 'Sylvan', home: 'Aelwood' },
  deephold: { key: 'deephold', name: 'Deephold', short: 'Deephold', home: 'the Kharuun Deeps' },
  westmarch: { key: 'westmarch', name: 'Westmarch', short: 'Westmarch', home: 'the Marches' },
  horde: { key: 'horde', name: 'Ashen Horde', short: 'Horde', home: 'the Ashlands' },
  conclave: { key: 'conclave', name: 'Starward Conclave', short: 'Conclave', home: 'the Spires' },
  hearth: { key: 'hearth', name: 'Hearthfolk', short: 'Hearthfolk', home: 'Bramblebury' },
  wilds: { key: 'wilds', name: 'Unbound', short: 'Unbound', home: 'the Wide World' },
});

const LIST = {
  sylvan: [
    ['C', 'hero:elf:bow', 'Glade Sentry'],
    ['C', 'hero:elf:dagger', 'Leafwhisper Scout'],
    ['C', 'hero:elf:bow', 'Moonbow Archer'],
    ['C', 'hero:elf:staff', 'Thornveil Warden'],
    ['C', 'beast:stag', 'Silverwood Stag'],
    ['C', 'beast:owl', 'Hollow Oak Owl'],
    ['C', 'realm:tree', 'Mistfen Hollow'],
    ['C', 'spell:nature', 'Blessing of Dew'],
    ['C', 'relic:amulet', 'Elderleaf Brooch'],
    ['C', 'realm:lake', 'Starlit Mere'],
    ['U', 'hero:elf:staff', 'Aelindra, Leafsinger'],
    ['U', 'hero:elf:sword', 'Ithilor, Bladedancer'],
    ['U', 'beast:treant', 'Thornback Treant'],
    ['U', 'realm:bridge', "Wardens' Crossing"],
    ['U', 'relic:bow', 'Bow of Falling Stars'],
    ['U', 'spell:frost', 'Veil of Mists'],
    ['R', 'hero:elf:bow', 'Lady Nyrael, Moon Warden', 'The moon has one keeper. She has never missed.'],
    ['R', 'realm:tree', 'The Eventide Tree', 'Its leaves hold the light of every sunset since the world was young.'],
    ['R', 'spell:light', 'Song of the First Spring', 'Sung once each thousand years, and the frost forgets its way.'],
    ['L', 'hero:elf:staff', 'Queen Elaswen of Aelwood', '"We do not rule the forest. We remember it, so that it may remember us."'],
  ],
  deephold: [
    ['C', 'hero:dwarf:hammer', 'Deepdelver Miner'],
    ['C', 'hero:dwarf:shield', 'Ironhold Shieldbearer'],
    ['C', 'hero:dwarf:axe', 'Ale-Hall Brawler'],
    ['C', 'hero:dwarf:lantern', 'Tunnel Lamplighter'],
    ['C', 'beast:ram', 'Mountain Ram'],
    ['C', 'beast:golem', 'Stone Sentinel'],
    ['C', 'realm:peak', 'Grey Peak Pass'],
    ['C', 'spell:earth', 'Hammerfall'],
    ['C', 'relic:chalice', 'Runed Tankard'],
    ['C', 'realm:hall', 'The Lantern Deep'],
    ['U', 'hero:dwarf:axe', 'Brannoc Stonebeard'],
    ['U', 'hero:dwarf:hammer', 'Thrana, Runesmith'],
    ['U', 'realm:forge', 'The Cinderforge'],
    ['U', 'beast:golem', 'Oathstone Golem'],
    ['U', 'spell:rune', 'Rune of Warding'],
    ['U', 'relic:horn', "Ancestor's Warhorn"],
    ['R', 'hero:dwarf:axe', 'Thane Durgrim the Unbowed', 'Seven sieges. Seven victories. One very dented helmet.'],
    ['R', 'realm:gate', 'Gates of Kharuun', 'Carved from a single stone, and opened only twice in recorded memory.'],
    ['R', 'relic:gem', 'Heartstone of the Deep', 'Miners say it beats, slow as a mountain, once every hundred years.'],
    ['L', 'hero:dwarf:hammer', 'High King Ostmund Ironcrown', '"Gold is soft. Iron is honest. Stone is forever. Choose your friends likewise."'],
  ],
  westmarch: [
    ['C', 'hero:human:spear', 'Westmarch Pikeman'],
    ['C', 'hero:human:sword', 'Road Warden'],
    ['C', 'hero:human:bow', 'Marsh Ranger'],
    ['C', 'hero:human:lantern', 'Hedge Witch'],
    ['C', 'beast:horse', 'Marcher Destrier'],
    ['C', 'beast:eagle', 'Hawk of the Marches'],
    ['C', 'realm:tower', 'Tollgate Keep'],
    ['C', 'realm:village', 'Millbrook Village'],
    ['C', 'spell:light', 'Rallying Cry'],
    ['C', 'relic:shield', "Squire's Shield"],
    ['U', 'hero:human:sword', 'Sir Cedric of the Dawn'],
    ['U', 'hero:human:spear', 'Rowena, Captain of the Wall'],
    ['U', 'realm:tower', 'Watchtower of Edrin'],
    ['U', 'beast:griffin', 'Royal Griffin'],
    ['U', 'relic:sword', 'Oathkeeper Blade'],
    ['U', 'spell:light', 'Shieldwall'],
    ['R', 'hero:human:sword', 'Lord Commander Aldric Vane', 'He has buried more friends than most men have met. He still stands the first watch.'],
    ['R', 'realm:citadel', 'The Sunken Citadel', 'When the tide is low, its bells still ring for a king who never came home.'],
    ['R', 'relic:crown', 'Crown of the Marches', 'Light as a promise. Heavy as one, too.'],
    ['L', 'hero:human:sword', 'Isolde, the Last Queen', '"Let them call it a lost cause. I have won every one I ever fought."'],
  ],
  horde: [
    ['C', 'hero:orc:axe', 'Horde Raider'],
    ['C', 'hero:goblin:dagger', 'Goblin Skulker'],
    ['C', 'hero:goblin:spear', 'Bonepicker'],
    ['C', 'hero:orc:hammer', 'Ashland Brute'],
    ['C', 'beast:wolf', 'Ash Warg'],
    ['C', 'beast:crow', 'Carrion Crow'],
    ['C', 'realm:camp', 'The Burning Fields'],
    ['C', 'spell:fire', 'Smoke and Cinders'],
    ['C', 'relic:staff', 'Iron Skull Totem'],
    ['C', 'realm:peak', 'Cinderjaw Rocks'],
    ['U', 'hero:orc:staff', 'Skarn Bonecaller'],
    ['U', 'hero:orc:axe', 'Grokk the Pitfighter'],
    ['U', 'beast:troll', 'Hill Troll'],
    ['U', 'realm:camp', 'Warcamp of the Red Hand'],
    ['U', 'spell:shadow', 'Cursed Ember'],
    ['U', 'relic:axe', "Warchief's Cleaver"],
    ['R', 'hero:orc:spear', 'Vraska, Warg Mother', 'Her pack is two hundred strong, and every one of them would die for her. Most already have.'],
    ['R', 'beast:wyvern', 'Ashmaw Wyvern', 'It does not hunt. It simply flies over, and later it comes back to eat.'],
    ['R', 'realm:gate', 'The Burning Gate', 'No one built it. It was simply there one morning, and it was already on fire.'],
    ['L', 'hero:orc:axe', 'Mogrot, Warlord of Ash', '"The world is a cold, grey thing. I mean to warm it."'],
  ],
  conclave: [
    ['C', 'hero:mage:staff', 'Conclave Initiate'],
    ['C', 'hero:mage:tome', 'Star Reader'],
    ['C', 'hero:mage:staff', 'Ember Adept'],
    ['C', 'beast:wisp', 'Wandering Wisp'],
    ['C', 'realm:tower', 'Hall of Lenses'],
    ['C', 'spell:storm', 'Arcane Bolt'],
    ['C', 'spell:light', 'Spark of Insight'],
    ['C', 'relic:tome', "Apprentice's Tome"],
    ['C', 'relic:gem', 'Crystal Focus'],
    ['C', 'realm:citadel', 'The Floating Library'],
    ['U', 'hero:mage:staff', 'Meridan the Stormcaller'],
    ['U', 'hero:mage:tome', 'Selvara of the Ninth Seal'],
    ['U', 'beast:elemental', 'Storm Elemental'],
    ['U', 'realm:lake', 'The Starwell'],
    ['U', 'spell:frost', 'Chains of Frost'],
    ['U', 'relic:gem', 'Orb of Far Seeing'],
    ['R', 'hero:mage:staff', 'Archmage Ozric Venn', 'He has read every book in the Conclave, including several that have not been written yet.'],
    ['R', 'realm:tower', 'The Sky Observatory', 'From its roof you can count every star. It takes four hundred years.'],
    ['R', 'relic:tome', 'Tome of Unwritten Names', 'Each page holds a name that will one day be famous. Some are yours.'],
    ['L', 'hero:mage:staff', 'Thalassar, the Star-Eyed', '"I have seen how this ends. Do not worry. You are wonderful in it."'],
  ],
  hearth: [
    ['C', 'hero:halfling:none', 'Burrow Lookout'],
    ['C', 'hero:halfling:pipe', 'Pipeleaf Farmer'],
    ['C', 'hero:halfling:dagger', 'Pantry Thief'],
    ['C', 'hero:halfling:lantern', 'Lantern Carrier'],
    ['C', 'beast:badger', 'Hedge Badger'],
    ['C', 'beast:horse', 'Stout Pony'],
    ['C', 'realm:village', 'Bramblebury Hollow'],
    ['C', 'spell:nature', 'Second Breakfast'],
    ['C', 'relic:amulet', 'Lucky Acorn'],
    ['C', 'realm:lake', 'Old Mill Pond'],
    ['U', 'hero:halfling:dagger', 'Tamsin Thistlewick'],
    ['U', 'hero:halfling:pipe', 'Old Barnaby, Storyteller'],
    ['U', 'realm:village', 'The Round Door Inn'],
    ['U', 'relic:chalice', 'Kettle of Plenty'],
    ['U', 'spell:nature', 'Hidden Paths'],
    ['U', 'realm:bridge', 'Brandle Ford'],
    ['R', 'hero:halfling:lantern', 'Rosalind Fairbarrow, Mapkeeper', 'She has mapped every road in the realm, and three that lead somewhere else.'],
    ['R', 'relic:tome', 'The Map of Elsewhere', 'Fold it right and you are already there. Fold it wrong and you are already late.'],
    ['R', 'spell:light', 'Feast of Lanterns', 'One night a year, every window in Bramblebury is left open for whoever is lost.'],
    ['L', 'hero:halfling:sword', 'Wendel Greenhill, the Unlikely', '"I only went out for mushrooms. Then there was a dragon, and, well. You know how it is."'],
  ],
  wilds: [
    ['R', 'hero:human:lantern', 'The Wandering Merchant', 'Everything has a price. Fortunately, she accepts stories.'],
    ['R', 'realm:village', 'The Crossroads Inn', 'Every road in the realm passes its door eventually. So does every rumour.'],
    ['L', 'beast:wolf', 'Frostfang, the White Wolf', 'When winter walks the high passes, it walks on four legs.'],
    ['L', 'beast:phoenix', 'Emberwing Phoenix', 'It has died nine hundred times. It has never once been late.'],
    ['L', 'realm:citadel', 'The Drowned Throne', 'The king who sat here bargained with the sea. The sea has a long memory.'],
    ['L', 'relic:gem', 'Eye of the Long Night', 'Look into it and it looks back, and it remembers your face.'],
    ['M', 'beast:dragon', 'Valdrak, the World-Ender', 'The old songs call him a story told to frighten children. The children were right.'],
    ['M', 'relic:crown', 'The Sundered Crown', 'Broken in two at the end of the First Age. Whoever joins it again will rule all that the sky touches.'],
    ['M', 'hero:mage:staff', 'Aurelion, First of Stars', 'Before the sun, there was a light. Before the light, there was him.'],
    ['M', 'beast:treant', 'Sylvaris, Heart of the Wood', 'The oldest tree in the world is not a tree at all. It is simply very patient.'],
  ],
};

// Flavor text for commons and uncommons, picked by card number.
const FLAVOR = {
  sylvan: [
    'In Aelwood, even the silence has a song.',
    'The elves count time in rings, not years.',
    'Step lightly. The forest is listening.',
    'Moonlight is a road, if you know how to walk it.',
    'An arrow, a whisper, and then nothing at all.',
    'The oldest trees remember your grandmother’s grandmother.',
  ],
  deephold: [
    'Deeper. Always deeper. That is where the good stone sleeps.',
    'A dwarf’s word is carved, never spoken.',
    'The mountain does not forgive. It does, however, provide.',
    'Every hall in Kharuun has a hearth, and every hearth has a song.',
    'Measure twice. Strike once. Then strike again, to be sure.',
    'Under the mountain, the lamps never go out.',
  ],
  westmarch: [
    'For the Marches, and for the morning.',
    'The road is long, but the inns are good.',
    'Hold the line. The dawn always comes.',
    'In Westmarch, every farmer keeps a sword above the door.',
    'Kings come and go. The wall remains.',
    'A banner is only cloth until someone carries it.',
  ],
  horde: [
    'The Horde does not march. It spreads.',
    'Ash on the wind means the drums are near.',
    'Strength is the only law the Ashlands keep.',
    'They do not burn the fields. They simply forget to stop.',
    'Count the fires on the hills. Then run.',
    'Every goblin is a coward. Ten goblins are an army.',
  ],
  conclave: [
    'Knowledge is a lantern. Some rooms should stay dark.',
    'The stars are not far. They are simply patient.',
    'Read carefully. Some books read you back.',
    'In the Spires, every question costs a little starlight.',
    'Power is easy. Precision is the art.',
    'The Conclave keeps nine seals. Do not ask about the tenth.',
  ],
  hearth: [
    'No adventure was ever improved by skipping lunch.',
    'The best maps in Bramblebury are drawn on napkins.',
    'Small feet. Big hearts. Bigger pantries.',
    'A warm kettle has ended more wars than any sword.',
    'Nothing ever happens in Bramblebury, and everyone likes it that way.',
    'Always pack a spare handkerchief. And a spare pie.',
  ],
};

export const SET = Object.freeze({ code: 'SC', name: 'The Sundered Crown', number: 1, size: 130 });

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function build() {
  const cards = [];
  let num = 0;
  for (const [faction, rows] of Object.entries(LIST)) {
    for (const [rarity, subject, name, flavor] of rows) {
      num++;
      const [kindKey] = subject.split(':');
      const h = hashStr(name);
      const rank = RARITIES[rarity].rank;
      const cost = Math.min(9, 1 + (h % 3) + rank + (kindKey === 'realm' ? 1 : 0));
      const might = kindKey === 'hero' || kindKey === 'beast'
        ? Math.min(15, 1 + rank * 2 + ((h >>> 3) % 4) + (kindKey === 'beast' ? 1 : 0))
        : null;
      const pool = FLAVOR[faction];
      cards.push(Object.freeze({
        id: `${SET.code}-${String(num).padStart(3, '0')}`,
        num,
        name,
        faction,
        rarity,
        kind: kindKey,
        subject,
        cost,
        might,
        flavor: flavor || (pool ? pool[h % pool.length] : ''),
        pop: 0.65 + ((h >>> 7) % 1000) / 1000 * 1.1, // collector demand, 0.65..1.75
      }));
    }
  }
  return Object.freeze(cards);
}

export const CARDS = build();
export const CARD_BY_ID = Object.freeze(Object.fromEntries(CARDS.map(c => [c.id, c])));
export const byRarity = r => CARDS.filter(c => c.rarity === r);
