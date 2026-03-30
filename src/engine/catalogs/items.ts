// Item catalog tables ported from BrogueCE v1.15.1
// Source: src/brogue/Globals.c and src/variants/GlobalsBrogue.c

export interface ItemTableEntry {
  name: string;
  frequency: number;
  marketValue: number;
  strengthRequired: number;
  power: number;
  range: { lowerBound: number; upperBound: number; clumpFactor: number };
  magicPolarity: number; // 1 = good, -1 = bad, 0 = neutral
  description: string;
}

// Globals.c line 1577
export const foodTable: ItemTableEntry[] = [
  { name: "ration of food", frequency: 3, marketValue: 25, strengthRequired: 0, power: 1800, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 0, description: "A ration of food." },
  { name: "mango", frequency: 1, marketValue: 15, strengthRequired: 0, power: 1550, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 0, description: "An odd fruit to be found so deep beneath the surface of the earth, but only slightly less filling than a ration of food." },
];

// Globals.c line 1582
export const weaponTable: ItemTableEntry[] = [
  { name: "dagger", frequency: 10, marketValue: 190, strengthRequired: 12, power: 0, range: { lowerBound: 3, upperBound: 4, clumpFactor: 1 }, magicPolarity: 0, description: "A simple iron dagger with a well-worn wooden handle." },
  { name: "sword", frequency: 10, marketValue: 440, strengthRequired: 14, power: 0, range: { lowerBound: 7, upperBound: 9, clumpFactor: 1 }, magicPolarity: 0, description: "The razor-sharp length of steel blade shines reassuringly." },
  { name: "broadsword", frequency: 10, marketValue: 990, strengthRequired: 19, power: 0, range: { lowerBound: 14, upperBound: 22, clumpFactor: 1 }, magicPolarity: 0, description: "This towering blade inflicts heavy damage by investing its heft into every cut." },
  { name: "whip", frequency: 10, marketValue: 440, strengthRequired: 14, power: 0, range: { lowerBound: 3, upperBound: 5, clumpFactor: 1 }, magicPolarity: 0, description: "The lash from this coil of braided leather can tear bark from trees, and it will reach opponents up to five spaces away." },
  { name: "rapier", frequency: 10, marketValue: 440, strengthRequired: 15, power: 0, range: { lowerBound: 3, upperBound: 5, clumpFactor: 1 }, magicPolarity: 0, description: "This blade is thin and flexible, designed for deft and rapid maneuvers." },
  { name: "flail", frequency: 10, marketValue: 440, strengthRequired: 17, power: 0, range: { lowerBound: 9, upperBound: 15, clumpFactor: 1 }, magicPolarity: 0, description: "This spiked iron ball can be whirled at the end of its chain in synchronicity with your movement." },
  { name: "mace", frequency: 10, marketValue: 660, strengthRequired: 16, power: 0, range: { lowerBound: 16, upperBound: 20, clumpFactor: 1 }, magicPolarity: 0, description: "The iron flanges at the head of this weapon inflict substantial damage with every weighty blow." },
  { name: "war hammer", frequency: 10, marketValue: 1100, strengthRequired: 20, power: 0, range: { lowerBound: 25, upperBound: 35, clumpFactor: 1 }, magicPolarity: 0, description: "Few creatures can withstand the crushing blow of this towering mass of lead and steel." },
  { name: "spear", frequency: 10, marketValue: 330, strengthRequired: 13, power: 0, range: { lowerBound: 4, upperBound: 5, clumpFactor: 1 }, magicPolarity: 0, description: "A slender wooden rod tipped with sharpened iron." },
  { name: "war pike", frequency: 10, marketValue: 880, strengthRequired: 18, power: 0, range: { lowerBound: 11, upperBound: 15, clumpFactor: 1 }, magicPolarity: 0, description: "A long steel pole ending in a razor-sharp point." },
  { name: "axe", frequency: 10, marketValue: 550, strengthRequired: 15, power: 0, range: { lowerBound: 7, upperBound: 9, clumpFactor: 1 }, magicPolarity: 0, description: "The blunt iron edge on this axe glints in the darkness." },
  { name: "war axe", frequency: 10, marketValue: 990, strengthRequired: 19, power: 0, range: { lowerBound: 12, upperBound: 17, clumpFactor: 1 }, magicPolarity: 0, description: "The enormous steel head of this war axe puts considerable heft behind each stroke." },
  { name: "dart", frequency: 0, marketValue: 15, strengthRequired: 10, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: 0, description: "These simple metal spikes are weighted to fly true and sting their prey with a flick of the wrist." },
  { name: "incendiary dart", frequency: 10, marketValue: 25, strengthRequired: 12, power: 0, range: { lowerBound: 1, upperBound: 2, clumpFactor: 1 }, magicPolarity: 0, description: "The barbed spike on each of these darts is designed to stick to its target while the compounds strapped to its length explode into flame." },
  { name: "javelin", frequency: 10, marketValue: 40, strengthRequired: 15, power: 0, range: { lowerBound: 3, upperBound: 11, clumpFactor: 3 }, magicPolarity: 0, description: "This length of metal is weighted to keep the spike at its tip foremost as it sails through the air." },
];

// Globals.c line 1605
export const armorTable: ItemTableEntry[] = [
  { name: "leather armor", frequency: 10, marketValue: 250, strengthRequired: 10, power: 0, range: { lowerBound: 30, upperBound: 30, clumpFactor: 0 }, magicPolarity: 0, description: "This lightweight armor offers basic protection." },
  { name: "scale mail", frequency: 10, marketValue: 350, strengthRequired: 12, power: 0, range: { lowerBound: 40, upperBound: 40, clumpFactor: 0 }, magicPolarity: 0, description: "Bronze scales cover the surface of treated leather, offering greater protection than plain leather with minimal additional weight." },
  { name: "chain mail", frequency: 10, marketValue: 500, strengthRequired: 13, power: 0, range: { lowerBound: 50, upperBound: 50, clumpFactor: 0 }, magicPolarity: 0, description: "Interlocking metal links make for a tough but flexible suit of armor." },
  { name: "banded mail", frequency: 10, marketValue: 800, strengthRequired: 15, power: 0, range: { lowerBound: 70, upperBound: 70, clumpFactor: 0 }, magicPolarity: 0, description: "Overlapping strips of metal horizontally encircle a chain mail base, offering an additional layer of protection at the cost of greater weight." },
  { name: "splint mail", frequency: 10, marketValue: 1000, strengthRequired: 17, power: 0, range: { lowerBound: 90, upperBound: 90, clumpFactor: 0 }, magicPolarity: 0, description: "Thick plates of metal are embedded into a chain mail base, providing the wearer with substantial protection." },
  { name: "plate armor", frequency: 10, marketValue: 1300, strengthRequired: 19, power: 0, range: { lowerBound: 110, upperBound: 110, clumpFactor: 0 }, magicPolarity: 0, description: "Enormous plates of metal are joined together into a suit that provides unmatched protection to any adventurer strong enough to bear its staggering weight." },
];

// GlobalsBrogue.c line 665
export const potionTable: ItemTableEntry[] = [
  { name: "life", frequency: 0, marketValue: 500, strengthRequired: 0, power: 0, range: { lowerBound: 10, upperBound: 10, clumpFactor: 0 }, magicPolarity: 1, description: "A swirling elixir that will instantly heal you, cure you of ailments, and permanently increase your maximum health." },
  { name: "strength", frequency: 0, marketValue: 400, strengthRequired: 0, power: 0, range: { lowerBound: 1, upperBound: 1, clumpFactor: 0 }, magicPolarity: 1, description: "This powerful medicine will course through your muscles, permanently increasing your strength by one point." },
  { name: "telepathy", frequency: 20, marketValue: 350, strengthRequired: 0, power: 0, range: { lowerBound: 300, upperBound: 300, clumpFactor: 0 }, magicPolarity: 1, description: "This mysterious liquid will attune your mind to the psychic signature of distant creatures." },
  { name: "levitation", frequency: 15, marketValue: 250, strengthRequired: 0, power: 0, range: { lowerBound: 100, upperBound: 100, clumpFactor: 0 }, magicPolarity: 1, description: "This curious liquid will cause you to hover in the air, able to drift effortlessly over lava, water, chasms and traps." },
  { name: "detect magic", frequency: 20, marketValue: 500, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 1, description: "This mysterious brew will sensitize your mind to the radiance of magic." },
  { name: "speed", frequency: 10, marketValue: 500, strengthRequired: 0, power: 0, range: { lowerBound: 25, upperBound: 25, clumpFactor: 0 }, magicPolarity: 1, description: "Quaffing the contents of this flask will enable you to move at blinding speed for several minutes." },
  { name: "fire immunity", frequency: 15, marketValue: 500, strengthRequired: 0, power: 0, range: { lowerBound: 150, upperBound: 150, clumpFactor: 0 }, magicPolarity: 1, description: "This potion will render you impervious to heat and permit you to wander through fire and lava and ignore otherwise deadly bolts of flame." },
  { name: "invisibility", frequency: 15, marketValue: 400, strengthRequired: 0, power: 0, range: { lowerBound: 75, upperBound: 75, clumpFactor: 0 }, magicPolarity: 1, description: "Drinking this potion will render you temporarily invisible." },
  { name: "caustic gas", frequency: 15, marketValue: 200, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: -1, description: "Uncorking or shattering this pressurized glass will cause its contents to explode into a deadly cloud of caustic purple gas." },
  { name: "paralysis", frequency: 10, marketValue: 250, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: -1, description: "Upon exposure to open air, the liquid in this flask will vaporize into a numbing pink haze." },
  { name: "hallucination", frequency: 10, marketValue: 500, strengthRequired: 0, power: 0, range: { lowerBound: 300, upperBound: 300, clumpFactor: 0 }, magicPolarity: -1, description: "This flask contains a vicious and long-lasting hallucinogen." },
  { name: "confusion", frequency: 15, marketValue: 450, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: -1, description: "This unstable chemical will quickly vaporize into a glittering cloud upon contact with open air." },
  { name: "incineration", frequency: 15, marketValue: 500, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: -1, description: "This flask contains an unstable compound which will burst violently into flame upon exposure to open air." },
  { name: "darkness", frequency: 7, marketValue: 150, strengthRequired: 0, power: 0, range: { lowerBound: 400, upperBound: 400, clumpFactor: 0 }, magicPolarity: -1, description: "Drinking this potion will plunge you into darkness." },
  { name: "descent", frequency: 15, marketValue: 500, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: -1, description: "When this flask is uncorked by hand or shattered by being thrown, the fog that seeps out will temporarily cause the ground in the vicinity to vanish." },
  { name: "creeping death", frequency: 7, marketValue: 450, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: -1, description: "When the cork is popped or the flask is thrown, tiny spores will spill across the ground and begin to grow a deadly lichen." },
];

// GlobalsBrogue.c line 684
export const scrollTable: ItemTableEntry[] = [
  { name: "enchanting", frequency: 0, marketValue: 550, strengthRequired: 0, power: 1, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 1, description: "This ancient enchanting sorcery will imbue a single item with a powerful and permanent magical charge." },
  { name: "identify", frequency: 30, marketValue: 300, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 1, description: "This scrying magic will permanently reveal all of the secrets of a single item." },
  { name: "teleportation", frequency: 10, marketValue: 500, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 1, description: "This escape spell will instantly relocate you to a random location on the dungeon level." },
  { name: "remove curse", frequency: 15, marketValue: 150, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 1, description: "This redemption spell will instantly strip from the reader's weapon, armor, rings and carried items any evil enchantments." },
  { name: "recharging", frequency: 12, marketValue: 375, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 1, description: "The power bound up in this parchment will instantly recharge all of your staffs and charms." },
  { name: "protect armor", frequency: 10, marketValue: 400, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 1, description: "This ceremonial shielding magic will permanently proof your armor against degradation by acid." },
  { name: "protect weapon", frequency: 10, marketValue: 400, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 1, description: "This ceremonial shielding magic will permanently proof your weapon against degradation by acid." },
  { name: "sanctuary", frequency: 10, marketValue: 500, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 1, description: "This protection rite will imbue the area with powerful warding glyphs, when released over plain ground." },
  { name: "magic mapping", frequency: 12, marketValue: 500, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 1, description: "This powerful scouting magic will etch a purple-hued image of crystal clarity into your memory." },
  { name: "negation", frequency: 8, marketValue: 400, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 1, description: "When this powerful anti-magic is released, all creatures and all items lying on the ground within your field of view will be stripped of magic." },
  { name: "shattering", frequency: 8, marketValue: 500, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 1, description: "This strange incantation will alter the physical structure of nearby stone, causing it to evaporate into the air." },
  { name: "discord", frequency: 8, marketValue: 400, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: 1, description: "This scroll will unleash a powerful blast of mind magic." },
  { name: "aggravate monsters", frequency: 15, marketValue: 50, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: -1, description: "This scroll will unleash a piercing shriek that will awaken all monsters and alert them to the reader's location." },
  { name: "summon monsters", frequency: 10, marketValue: 50, strengthRequired: 0, power: 0, range: { lowerBound: 0, upperBound: 0, clumpFactor: 0 }, magicPolarity: -1, description: "This summoning incantation will call out to creatures in other planes of existence." },
];

// Globals.c line 1641
export const staffTable: ItemTableEntry[] = [
  { name: "lightning", frequency: 15, marketValue: 1300, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: 1, description: "This staff conjures forth deadly arcs of electricity to damage any number of creatures in a straight line." },
  { name: "firebolt", frequency: 15, marketValue: 1300, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: 1, description: "This staff unleashes bursts of magical fire." },
  { name: "poison", frequency: 10, marketValue: 1200, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: 1, description: "The vile blast of this twisted staff will imbue its target with a deadly venom." },
  { name: "tunneling", frequency: 10, marketValue: 1000, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: 1, description: "Bursts of magic from this staff will pass harmlessly through creatures but will reduce most obstructions to rubble." },
  { name: "blinking", frequency: 11, marketValue: 1200, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: 1, description: "This staff will allow you to teleport in the chosen direction." },
  { name: "entrancement", frequency: 6, marketValue: 1000, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: 1, description: "This staff will send creatures into a temporary trance, causing them to mindlessly mirror your movements." },
  { name: "obstruction", frequency: 10, marketValue: 1000, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: 1, description: "This staff will conjure a mass of impenetrable green crystal." },
  { name: "discord", frequency: 10, marketValue: 1000, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: 1, description: "This staff will alter the perception of a creature and cause it to lash out indiscriminately." },
  { name: "conjuration", frequency: 8, marketValue: 1000, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: 1, description: "A flick of this staff will summon a number of phantom blades to fight on your behalf." },
  { name: "healing", frequency: 5, marketValue: 1100, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: -1, description: "This staff will heal any creature, friend or foe." },
  { name: "haste", frequency: 5, marketValue: 900, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: -1, description: "This staff will temporarily double the speed of any creature, friend or foe." },
  { name: "protection", frequency: 5, marketValue: 900, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: -1, description: "This staff will bathe a creature in a protective light that will absorb all damage until it is depleted." },
];

// Globals.c line 1656
export const ringTable: ItemTableEntry[] = [
  { name: "clairvoyance", frequency: 1, marketValue: 900, strengthRequired: 0, power: 0, range: { lowerBound: 1, upperBound: 3, clumpFactor: 1 }, magicPolarity: 1, description: "This ring of eldritch scrying will permit you to see through nearby walls and doors." },
  { name: "stealth", frequency: 1, marketValue: 800, strengthRequired: 0, power: 0, range: { lowerBound: 1, upperBound: 3, clumpFactor: 1 }, magicPolarity: 1, description: "This ring of silent passage will reduce your stealth range, making enemies less likely to notice you." },
  { name: "regeneration", frequency: 1, marketValue: 750, strengthRequired: 0, power: 0, range: { lowerBound: 1, upperBound: 3, clumpFactor: 1 }, magicPolarity: 1, description: "This ring of sacred life will allow you to recover lost health at an accelerated rate." },
  { name: "transference", frequency: 1, marketValue: 750, strengthRequired: 0, power: 0, range: { lowerBound: 1, upperBound: 3, clumpFactor: 1 }, magicPolarity: 1, description: "This ring of blood magic will heal you in proportion to the damage you inflict on others." },
  { name: "light", frequency: 1, marketValue: 600, strengthRequired: 0, power: 0, range: { lowerBound: 1, upperBound: 3, clumpFactor: 1 }, magicPolarity: 1, description: "This ring of preternatural vision will allow you to see farther in the dimming light of the deeper dungeon levels." },
  { name: "awareness", frequency: 1, marketValue: 700, strengthRequired: 0, power: 0, range: { lowerBound: 1, upperBound: 3, clumpFactor: 1 }, magicPolarity: 1, description: "This ring of effortless vigilance will enable you to notice traps, secret doors and hidden levers more often." },
  { name: "wisdom", frequency: 1, marketValue: 700, strengthRequired: 0, power: 0, range: { lowerBound: 1, upperBound: 3, clumpFactor: 1 }, magicPolarity: 1, description: "This ring of arcane power will cause your staffs to recharge at an accelerated rate." },
  { name: "reaping", frequency: 1, marketValue: 700, strengthRequired: 0, power: 0, range: { lowerBound: 1, upperBound: 3, clumpFactor: 1 }, magicPolarity: 1, description: "This ring of blood magic will recharge your staffs and charms every time you hit an enemy." },
];

// GlobalsBrogue.c line 701
export const wandTable: ItemTableEntry[] = [
  { name: "teleportation", frequency: 3, marketValue: 800, strengthRequired: 0, power: 0, range: { lowerBound: 3, upperBound: 5, clumpFactor: 1 }, magicPolarity: 1, description: "This wand will teleport a creature to a random place on the level." },
  { name: "slowness", frequency: 3, marketValue: 800, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 5, clumpFactor: 1 }, magicPolarity: 1, description: "This wand will cause a creature to move at half its ordinary speed for 30 turns." },
  { name: "polymorphism", frequency: 3, marketValue: 700, strengthRequired: 0, power: 0, range: { lowerBound: 3, upperBound: 5, clumpFactor: 1 }, magicPolarity: 1, description: "This mischievous magic will transform a creature into another creature at random." },
  { name: "negation", frequency: 3, marketValue: 550, strengthRequired: 0, power: 0, range: { lowerBound: 4, upperBound: 6, clumpFactor: 1 }, magicPolarity: 1, description: "This powerful anti-magic will strip a creature of a host of magical traits." },
  { name: "domination", frequency: 1, marketValue: 1000, strengthRequired: 0, power: 0, range: { lowerBound: 1, upperBound: 2, clumpFactor: 1 }, magicPolarity: 1, description: "This wand can forever bind an enemy to the caster's will, turning it into a steadfast ally." },
  { name: "beckoning", frequency: 3, marketValue: 500, strengthRequired: 0, power: 0, range: { lowerBound: 2, upperBound: 4, clumpFactor: 1 }, magicPolarity: 1, description: "The force of this wand will draw the targeted creature into direct proximity." },
  { name: "plenty", frequency: 2, marketValue: 700, strengthRequired: 0, power: 0, range: { lowerBound: 1, upperBound: 2, clumpFactor: 1 }, magicPolarity: -1, description: "The creature at the other end of this mischievous bit of cloning magic, friend or foe, will be beside itself -- literally!" },
  { name: "invisibility", frequency: 3, marketValue: 100, strengthRequired: 0, power: 0, range: { lowerBound: 3, upperBound: 5, clumpFactor: 1 }, magicPolarity: -1, description: "This wand will render a creature temporarily invisible to the naked eye." },
  { name: "empowerment", frequency: 1, marketValue: 100, strengthRequired: 0, power: 0, range: { lowerBound: 1, upperBound: 1, clumpFactor: 1 }, magicPolarity: -1, description: "This sacred magic will permanently improve the mind and body of any monster it hits." },
];

// Globals.c line 1614
export const weaponRunicNames: string[] = [
  "speed",
  "quietus",
  "paralysis",
  "multiplicity",
  "slowing",
  "confusion",
  "force",
  "slaying",
  "mercy",
  "plenty",
];

// Globals.c line 1627
export const armorRunicNames: string[] = [
  "multiplicity",
  "mutuality",
  "absorption",
  "reprisal",
  "immunity",
  "reflection",
  "respiration",
  "dampening",
  "burden",
  "vulnerability",
  "immolation",
];
