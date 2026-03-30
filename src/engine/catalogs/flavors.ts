// Item flavor text — unidentified appearances for potions, scrolls, staves, rings, wands.
// Ported from BrogueCE Globals.c itemColorsRef, itemWoodsRef, itemGemsRef, itemMetalsRef, titlePhonemes.
// Shuffled per game seed so each run has different unidentified names.

export const potionColors = [
  "crimson", "scarlet", "orange", "yellow", "green", "blue", "indigo", "violet",
  "puce", "mauve", "burgundy", "turquoise", "aquamarine", "gray", "pink",
  "white", "lavender", "tan", "brown", "cyan", "black",
];

export const scrollPhonemes = [
  "glorp", "snarg", "gana", "flin", "herba", "pora", "nuglo", "greep",
  "nur", "lofa", "poder", "nidge", "pus", "wooz", "flem", "bloto",
  "porta", "ermah", "gerd", "nurt", "flurx",
];

export const staffWoods = [
  "teak", "oak", "redwood", "rowan", "willow", "mahogany", "pinewood", "maple",
  "bamboo", "ironwood", "pearwood", "birch", "cherry", "eucalyptus", "walnut",
  "cedar", "rosewood", "yew", "sandalwood", "hickory", "hemlock",
];

export const wandMetals = [
  "bronze", "steel", "brass", "pewter", "nickel", "copper", "aluminum",
  "tungsten", "titanium", "cobalt", "chromium", "silver",
];

export const ringGems = [
  "diamond", "opal", "garnet", "ruby", "amethyst", "topaz", "onyx",
  "tourmaline", "sapphire", "obsidian", "malachite", "aquamarine",
  "emerald", "jade", "alexandrite", "agate", "bloodstone", "jasper",
];

/**
 * Shuffled flavor arrays for the current game.
 * Call shuffleFlavors() at game start with the RNG to randomize.
 */
export let shuffledPotionColors: string[] = [...potionColors];
export let shuffledScrollTitles: string[] = [];
export let shuffledStaffWoods: string[] = [...staffWoods];
export let shuffledWandMetals: string[] = [...wandMetals];
export let shuffledRingGems: string[] = [...ringGems];

/**
 * Generate scroll titles from phoneme combinations.
 */
function generateScrollTitles(rng: { range: (a: number, b: number) => number }): string[] {
  const titles: string[] = [];
  for (let i = 0; i < 14; i++) {
    const numWords = rng.range(1, 3);
    const words: string[] = [];
    for (let w = 0; w < numWords; w++) {
      const phoneme1 = scrollPhonemes[rng.range(0, scrollPhonemes.length - 1)]!;
      const phoneme2 = scrollPhonemes[rng.range(0, scrollPhonemes.length - 1)]!;
      words.push((phoneme1 + phoneme2).toUpperCase());
    }
    titles.push(words.join(" "));
  }
  return titles;
}

/**
 * Fisher-Yates shuffle an array in place using the game RNG.
 */
function shuffleArray(arr: string[], rng: { range: (a: number, b: number) => number }): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rng.range(0, i);
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
}

/**
 * Shuffle all item flavors for a new game.
 * Must be called with the cosmetic RNG at game start.
 */
export function shuffleFlavors(rng: { range: (a: number, b: number) => number }): void {
  shuffledPotionColors = [...potionColors];
  shuffleArray(shuffledPotionColors, rng);

  shuffledScrollTitles = generateScrollTitles(rng);

  shuffledStaffWoods = [...staffWoods];
  shuffleArray(shuffledStaffWoods, rng);

  shuffledWandMetals = [...wandMetals];
  shuffleArray(shuffledWandMetals, rng);

  shuffledRingGems = [...ringGems];
  shuffleArray(shuffledRingGems, rng);
}

/**
 * Get the unidentified name for an item.
 */
export function unidentifiedItemName(category: number, kind: number): string {
  // Category enum values: FOOD=0, POTION=1, SCROLL=2, WEAPON=3, ARMOR=4, STAFF=5, WAND=6, RING=7
  switch (category) {
    case 1: // POTION
      return `a ${shuffledPotionColors[kind % shuffledPotionColors.length]} potion`;
    case 2: // SCROLL
      return `a scroll titled "${shuffledScrollTitles[kind % shuffledScrollTitles.length] ?? "UNKNOWN"}"`;
    case 5: // STAFF
      return `a ${shuffledStaffWoods[kind % shuffledStaffWoods.length]} staff`;
    case 6: // WAND
      return `a ${shuffledWandMetals[kind % shuffledWandMetals.length]} wand`;
    case 7: // RING
      return `a ${shuffledRingGems[kind % shuffledRingGems.length]} ring`;
    default:
      return "an unknown item";
  }
}
