// =============================================================================
// Core types ported from BrogueCE Rogue.h
// =============================================================================

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const COLS = 100;
export const MESSAGE_LINES = 3;
export const ROWS = 31 + MESSAGE_LINES;
export const STAT_BAR_WIDTH = 20;
export const DCOLS = COLS - STAT_BAR_WIDTH - 1;
export const DROWS = ROWS - MESSAGE_LINES - 2;

export const NUMBER_TERRAIN_LAYERS = 4;
export const KEY_ID_MAXIMUM = 20;
export const MAX_WAYPOINT_COUNT = 40;
export const NUMBER_OF_STATUS_EFFECTS = 27;
export const MAX_PACK_ITEMS = 26;
export const FP_BASE = 16;
export const FP_FACTOR = 1 << FP_BASE; // 65536

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export enum RNGKind {
    RNG_SUBSTANTIVE = 0,
    RNG_COSMETIC = 1,
}

export enum DungeonLayer {
    NO_LAYER = -1,
    DUNGEON = 0,
    LIQUID = 1,
    GAS = 2,
    SURFACE = 3,
}

export enum EventType {
    KEYSTROKE = 0,
    MOUSE_UP,
    MOUSE_DOWN,
    RIGHT_MOUSE_DOWN,
    RIGHT_MOUSE_UP,
    MOUSE_ENTERED_CELL,
    RNG_CHECK,
    SAVED_GAME_LOADED,
    END_OF_RECORDING,
    EVENT_ERROR,
}

export enum Direction {
    NO_DIRECTION = -1,
    UP = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3,
    UPLEFT = 4,
    DOWNLEFT = 5,
    UPRIGHT = 6,
    DOWNRIGHT = 7,
}

export enum CreatureState {
    MONSTER_SLEEPING = 0,
    MONSTER_TRACKING_SCENT,
    MONSTER_WANDERING,
    MONSTER_FLEEING,
    MONSTER_ALLY,
}

export enum CreatureMode {
    MODE_NORMAL = 0,
    MODE_PERM_FLEEING,
}

export enum GameMode {
    GAME_MODE_NORMAL = 0,
    GAME_MODE_WIZARD,
    GAME_MODE_EASY,
}

export enum DisplayDetailValue {
    DV_UNLIT = 0,
    DV_LIT,
    DV_DARK,
}

export enum NGCommand {
    NG_NOTHING = 0,
    NG_FLYOUT_PLAY,
    NG_FLYOUT_VIEW,
    NG_FLYOUT_OPTIONS,
    NG_GAME_VARIANT,
    NG_GAME_MODE,
    NG_NEW_GAME,
    NG_NEW_GAME_WITH_SEED,
    NG_OPEN_GAME,
    NG_VIEW_RECORDING,
    NG_HIGH_SCORES,
    NG_GAME_STATS,
    NG_QUIT,
}

// ---------------------------------------------------------------------------
// Basic geometry types
// ---------------------------------------------------------------------------

/** A position within the dungeon grid. */
export interface Pos {
    x: number;
    y: number;
}

/** A position within the full terminal window. */
export interface WindowPos {
    windowX: number;
    windowY: number;
}

// ---------------------------------------------------------------------------
// Color and display
// ---------------------------------------------------------------------------

/**
 * Brogue color type.
 * Components are in a 0-100 scale (percent-based).
 * Rand values add randomness; colorDances means the color animates over time.
 */
export interface Color {
    red: number;
    green: number;
    blue: number;
    redRand: number;
    greenRand: number;
    blueRand: number;
    rand: number;
    colorDances: boolean;
}

export interface RandomRange {
    lowerBound: number;
    upperBound: number;
    clumpFactor: number;
}

/**
 * Keeps track of graphics so we only redraw if the cell has changed.
 * Mirrors the C `cellDisplayBuffer` struct.
 */
export interface CellDisplayBuffer {
    /** Display character (string for rendering convenience) */
    character: string;
    /** RGB foreground color components [r, g, b] in 0..100 range */
    foreColorComponents: [number, number, number];
    /** RGB background color components [r, g, b] in 0..100 range */
    backColorComponents: [number, number, number];
    /** Opacity 0..100 */
    opacity: number;
}

// ---------------------------------------------------------------------------
// Map cells
// ---------------------------------------------------------------------------

/**
 * Permanent cell -- persisted across level saves.
 * Mirrors the C `pcell` struct.
 */
export interface PCell {
    /** Terrain layers: indexed by DungeonLayer (DUNGEON, LIQUID, GAS, SURFACE) */
    layers: number[];  // length NUMBER_TERRAIN_LAYERS
    /** Non-terrain cell flags (bitfield) */
    flags: number;
    /** Quantity of gas in cell */
    volume: number;
    machineNumber: number;
    rememberedAppearance: CellDisplayBuffer;
    /** What category of item the player remembers lying there */
    rememberedItemCategory: number;
    /** What kind of item the player remembers lying there */
    rememberedItemKind: number;
    /** How many of the item the player remembers lying there */
    rememberedItemQuantity: number;
    /** Origin depth of remembered item */
    rememberedItemOriginDepth: number;
    /** What the player remembers as the terrain */
    rememberedTerrain: number;
    /** Map cell flags the player remembers */
    rememberedCellFlags: number;
    /** Terrain flags the player remembers */
    rememberedTerrainFlags: number;
    /** TM flags the player remembers */
    rememberedTMFlags: number;
    /** Number of times exposed to fire since last env update */
    exposedToFire: number;
}

/**
 * Transient cell -- not persisted between levels.
 * Mirrors the C `tcell` struct.
 */
export interface TCell {
    /** RGB lighting components */
    light: [number, number, number];
    /** Previous frame lighting for dirty-checking */
    oldLight: [number, number, number];
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export interface RogueEvent {
    eventType: EventType;
    param1: number;
    param2: number;
    controlKey: boolean;
    shiftKey: boolean;
}

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------

export interface KeyLocationProfile {
    loc: Pos;
    machine: number;
    disposableHere: boolean;
}

export interface Item {
    category: number;
    kind: number;
    flags: number;
    damage: RandomRange;
    armor: number;
    charges: number;
    enchant1: number;
    enchant2: number;
    timesEnchanted: number;
    vorpalEnemy: number;
    strengthRequired: number;
    quiverNumber: number;
    displayChar: number;
    foreColor: Color | null;
    inventoryColor: Color | null;
    quantity: number;
    inventoryLetter: string;
    inscription: string;
    loc: Pos;
    keyLoc: KeyLocationProfile[];  // length KEY_ID_MAXIMUM
    originDepth: number;
    spawnTurnNumber: number;
    /** Absolute turns last applied (length 3) */
    lastUsed: [number, number, number];
    nextItem: Item | null;
}

export interface ItemTable {
    name: string;
    flavor: string;
    callTitle: string;
    frequency: number;
    marketValue: number;
    strengthRequired: number;
    power: number;
    range: RandomRange;
    identified: boolean;
    called: boolean;
    magicPolarity: number;
    magicPolarityRevealed: boolean;
    description: string;
}

export interface MeteredItem {
    frequency: number;
    numberSpawned: number;
}

// ---------------------------------------------------------------------------
// Creatures
// ---------------------------------------------------------------------------

/**
 * Creature type / monster catalog entry.
 * Mirrors the C `creatureType` struct.
 */
export interface CreatureType {
    monsterID: number;
    monsterName: string;
    displayChar: number;
    foreColor: Color | null;
    maxHP: number;
    defense: number;
    accuracy: number;
    damage: RandomRange;
    turnsBetweenRegen: number;
    movementSpeed: number;
    attackSpeed: number;
    bloodType: number;
    intrinsicLightType: number;
    isLarge: boolean;
    DFChance: number;
    DFType: number;
    bolts: number[];  // up to 20
    flags: number;
    abilityFlags: number;
}

/**
 * An individual creature instance.
 * Mirrors the C `creature` struct.
 */
export interface Creature {
    info: CreatureType;
    loc: Pos;
    depth: number;
    currentHP: number;
    turnsUntilRegen: number;
    regenPerTurn: number;
    weaknessAmount: number;
    poisonAmount: number;
    creatureState: CreatureState;
    creatureMode: CreatureMode;

    mutationIndex: number;
    wasNegated: boolean;

    targetWaypointIndex: number;
    waypointAlreadyVisited: boolean[];  // length MAX_WAYPOINT_COUNT
    lastSeenPlayerAt: Pos;

    targetCorpseLoc: Pos;
    targetCorpseName: string;
    absorptionFlags: number;
    absorbBehavior: boolean;
    absorptionBolt: number;
    corpseAbsorptionCounter: number;
    mapToMe: number[][] | null;
    safetyMap: number[][] | null;
    ticksUntilTurn: number;

    movementSpeed: number;
    attackSpeed: number;

    previousHealthPoints: number;
    turnsSpentStationary: number;
    flashStrength: number;
    flashColor: Color;
    status: number[];           // length NUMBER_OF_STATUS_EFFECTS
    maxStatus: number[];        // length NUMBER_OF_STATUS_EFFECTS
    bookkeepingFlags: number;
    spawnDepth: number;
    machineHome: number;
    xpxp: number;
    newPowerCount: number;
    totalPowerCount: number;

    leader: Creature | null;
    carriedMonster: Creature | null;
    carriedItem: Item | null;
}

// ---------------------------------------------------------------------------
// Terrain
// ---------------------------------------------------------------------------

/** Floor tile type entry from the tile catalog. */
export interface FloorTileType {
    displayChar: number;
    foreColor: Color | null;
    backColor: Color | null;
    drawPriority: number;
    chanceToIgnite: number;
    fireType: number;
    discoverType: number;
    promoteType: number;
    promoteChance: number;
    glowLight: number;
    flags: number;
    mechFlags: number;
    description: string;
    flavorText: string;
}

// ---------------------------------------------------------------------------
// Dungeon features
// ---------------------------------------------------------------------------

export interface DungeonFeature {
    tile: number;
    layer: DungeonLayer;
    startProbability: number;
    probabilityDecrement: number;
    flags: number;
    description: string;
    lightFlare: number;
    flashColor: Color | null;
    effectRadius: number;
    propagationTerrain: number;
    subsequentDF: number;
    messageDisplayed: boolean;
}

// ---------------------------------------------------------------------------
// Machines / Blueprints
// ---------------------------------------------------------------------------

export interface MachineFeature {
    featureDF: number;
    terrain: number;
    layer: DungeonLayer;
    instanceCountRange: [number, number];
    minimumInstanceCount: number;
    itemCategory: number;
    itemKind: number;
    monsterID: number;
    personalSpace: number;
    hordeFlags: number;
    itemFlags: number;
    flags: number;
}

export interface Blueprint {
    name: string;
    depthRange: [number, number];
    roomSize: [number, number];
    frequency: number;
    featureCount: number;
    dungeonProfileType: number;
    flags: number;
    feature: MachineFeature[];  // up to 20
}

// ---------------------------------------------------------------------------
// Light
// ---------------------------------------------------------------------------

export interface LightSource {
    lightColor: Color | null;
    lightRadius: RandomRange;
    radialFadeToPercent: number;
    passThroughCreatures: boolean;
}

// ---------------------------------------------------------------------------
// Bolt
// ---------------------------------------------------------------------------

export interface Bolt {
    name: string;
    description: string;
    abilityDescription: string;
    theChar: number;
    foreColor: Color | null;
    backColor: Color | null;
    boltEffect: number;
    magnitude: number;
    pathDF: number;
    targetDF: number;
    forbiddenMonsterFlags: number;
    flags: number;
}

// ---------------------------------------------------------------------------
// Player character (the `rogue` global)
// ---------------------------------------------------------------------------

export interface PlayerCharacter {
    mode: GameMode;

    depthLevel: number;
    deepestLevel: number;
    disturbed: boolean;
    gameInProgress: boolean;
    gameHasEnded: boolean;
    highScoreSaved: boolean;
    blockCombatText: boolean;
    autoPlayingLevel: boolean;
    automationActive: boolean;
    justRested: boolean;
    justSearched: boolean;
    cautiousMode: boolean;
    receivedLevitationWarning: boolean;
    updatedSafetyMapThisTurn: boolean;
    updatedAllySafetyMapThisTurn: boolean;
    updatedMapToSafeTerrainThisTurn: boolean;
    updatedMapToShoreThisTurn: boolean;
    inWater: boolean;
    heardCombatThisTurn: boolean;
    creaturesWillFlashThisTurn: boolean;
    staleLoopMap: boolean;
    alreadyFell: boolean;
    eligibleToUseStairs: boolean;
    trueColorMode: boolean;
    hideSeed: boolean;
    displayStealthRangeMode: boolean;
    quit: boolean;

    seed: bigint;
    RNG: RNGKind;
    gold: number;
    goldGenerated: number;
    strength: number;
    monsterSpawnFuse: number;

    weapon: Item | null;
    armor: Item | null;
    ringLeft: Item | null;
    ringRight: Item | null;
    swappedIn: Item | null;
    swappedOut: Item | null;

    flareCount: number;
    flareCapacity: number;

    yendorWarden: Creature | null;

    minersLight: LightSource;
    minersLightRadius: number;  // fixpt
    ticksTillUpdateEnvironment: number;
    scentTurnNumber: number;
    playerTurnNumber: number;
    absoluteTurnNumber: number;
    milliseconds: number;
    xpxpThisTurn: number;
    stealthRange: number;

    previousPoisonPercent: number;

    upLoc: Pos;
    downLoc: Pos;

    cursorLoc: Pos;
    lastTarget: Creature | null;
    lastItemThrown: Item | null;
    rewardRoomsGenerated: number;
    machineNumber: number;
    sidebarLocationList: Pos[];

    mapToShore: number[][] | null;
    mapToSafeTerrain: number[][] | null;

    // recording info
    recording: boolean;
    playbackMode: boolean;
    patchVersion: number;
    versionString: string;
    currentTurnNumber: number;
    howManyTurns: number;
    howManyDepthChanges: number;
    playbackDelayPerTurn: number;
    playbackDelayThisTurn: number;
    playbackPaused: boolean;
    playbackFastForward: boolean;
    playbackOOS: boolean;
    playbackOmniscience: boolean;
    playbackBetweenTurns: boolean;
    nextAnnotationTurn: number;
    nextAnnotation: string;
    locationInAnnotationFile: number;
    gameExitStatusCode: number;

    // metered items
    foodSpawned: number;
    meteredItems: MeteredItem[];

    // ring bonuses
    clairvoyance: number;
    stealthBonus: number;
    regenerationBonus: number;
    lightMultiplier: number;
    awarenessBonus: number;
    transference: number;
    wisdomBonus: number;
    reaping: number;

    // feats
    featRecord: boolean[];

    // waypoints
    wpDistance: number[][][];  // [MAX_WAYPOINT_COUNT][][]
    wpCount: number;
    wpCoordinates: Pos[];     // length MAX_WAYPOINT_COUNT
    wpRefreshTicker: number;

    // cursor trail
    cursorPathIntensity: number;
    cursorMode: boolean;

    nextGame: NGCommand;
    nextGamePath: string;
    nextGameSeed: bigint;
    currentGamePath: string;
}

// ---------------------------------------------------------------------------
// Level data
// ---------------------------------------------------------------------------

export interface LevelData {
    visited: boolean;
    mapStorage: PCell[][];   // [DCOLS][DROWS]
    items: Item | null;
    monsters: Creature[];
    dormantMonsters: Creature[];
    scentMap: number[][] | null;
    levelSeed: bigint;
    upStairsLoc: Pos;
    downStairsLoc: Pos;
    playerExitedVia: Pos;
    awaySince: number;
}

// ---------------------------------------------------------------------------
// Horde and mutation types
// ---------------------------------------------------------------------------

export interface HordeType {
    leaderType: number;
    numberOfMemberTypes: number;
    memberType: number[];       // up to 5
    memberCount: RandomRange[];  // up to 5
    minLevel: number;
    maxLevel: number;
    frequency: number;
    spawnsIn: number;
    machine: number;
    flags: number;
}

export interface Mutation {
    title: string;
    textColor: Color | null;
    healthFactor: number;
    moveSpeedFactor: number;
    attackSpeedFactor: number;
    defenseFactor: number;
    damageFactor: number;
    DFChance: number;
    DFType: number;
    light: number;
    monsterFlags: number;
    monsterAbilityFlags: number;
    forbiddenFlags: number;
    forbiddenAbilityFlags: number;
    description: string;
    canBeNegated: boolean;
}

// ---------------------------------------------------------------------------
// High scores / run history
// ---------------------------------------------------------------------------

export interface RogueHighScoresEntry {
    score: number;
    date: string;
    description: string;
}

// ---------------------------------------------------------------------------
// Dungeon profile
// ---------------------------------------------------------------------------

export interface DungeonProfile {
    roomFrequencies: number[];  // length ROOM_TYPE_COUNT (8)
    corridorChance: number;
}

// ---------------------------------------------------------------------------
// Charm effect table
// ---------------------------------------------------------------------------

export interface CharmEffectTableEntry {
    kind: number;
    effectDurationBase: number;
    effectDurationIncrement: number;  // fixpt
    rechargeDelayDuration: number;
    rechargeDelayBase: number;
    rechargeDelayMinTurns: number;
    effectMagnitudeConstant: number;
    effectMagnitudeMultiplier: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const INVALID_POS: Pos = { x: -1, y: -1 };

export function posEq(a: Pos, b: Pos): boolean {
    return a.x === b.x && a.y === b.y;
}

export function isPosInMap(p: Pos): boolean {
    return p.x >= 0 && p.x < DCOLS && p.y >= 0 && p.y < DROWS;
}

export function mapToWindow(p: Pos): WindowPos {
    return {
        windowX: p.x + STAT_BAR_WIDTH + 1,
        windowY: p.y + MESSAGE_LINES,
    };
}

export function windowToMap(w: WindowPos): Pos {
    return {
        x: w.windowX - STAT_BAR_WIDTH - 1,
        y: w.windowY - MESSAGE_LINES,
    };
}

export function clamp(x: number, low: number, hi: number): number {
    return Math.min(hi, Math.max(x, low));
}
