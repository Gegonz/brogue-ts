// =============================================================================
// enums.ts
// Ported from BrogueCE Rogue.h
// =============================================================================

// Helper: Fl(N) = 1 << N (used for bitfield enums)
function Fl(n: number): number {
    return 1 << n;
}

// =============================================================================
// Game variant
// =============================================================================

export enum GameVariant {
    VARIANT_BROGUE,
    VARIANT_RAPID_BROGUE,
    VARIANT_BULLET_BROGUE,
    NUMBER_VARIANTS,
}

// =============================================================================
// Display glyphs
// =============================================================================

export enum DisplayGlyph {
    G_UP_ARROW = 128,
    G_DOWN_ARROW,
    G_POTION,
    G_GRASS,
    G_WALL,
    G_DEMON,
    G_OPEN_DOOR,
    G_GOLD,
    G_CLOSED_DOOR,
    G_RUBBLE,
    G_KEY,
    G_BOG,
    G_CHAIN_TOP_LEFT,
    G_CHAIN_BOTTOM_RIGHT,
    G_CHAIN_TOP_RIGHT,
    G_CHAIN_BOTTOM_LEFT,
    G_CHAIN_TOP,
    G_CHAIN_BOTTOM,
    G_CHAIN_LEFT,
    G_CHAIN_RIGHT,
    G_FOOD,
    G_UP_STAIRS,
    G_VENT,
    G_DOWN_STAIRS,
    G_PLAYER,
    G_BOG_MONSTER,
    G_CENTAUR,
    G_DRAGON,
    G_FLAMEDANCER,
    G_GOLEM,
    G_TENTACLE_HORROR,
    G_IFRIT,
    G_JELLY,
    G_KRAKEN,
    G_LICH,
    G_NAGA,
    G_OGRE,
    G_PHANTOM,
    G_REVENANT,
    G_SALAMANDER,
    G_TROLL,
    G_UNDERWORM,
    G_VAMPIRE,
    G_WRAITH,
    G_ZOMBIE,
    G_ARMOR,
    G_STAFF,
    G_WEB,
    G_MOUND,
    G_BLOAT,
    G_CENTIPEDE,
    G_DAR_BLADEMASTER,
    G_EEL,
    G_FURY,
    G_GOBLIN,
    G_IMP,
    G_JACKAL,
    G_KOBOLD,
    G_MONKEY,
    G_PIXIE,
    G_RAT,
    G_SPIDER,
    G_TOAD,
    G_BAT,
    G_WISP,
    G_PHOENIX,
    G_ALTAR,
    G_LIQUID,
    G_FLOOR,
    G_CHASM,
    G_TRAP,
    G_FIRE,
    G_FOLIAGE,
    G_AMULET,
    G_SCROLL,
    G_RING,
    G_WEAPON,
    G_TURRET,
    G_TOTEM,
    G_GOOD_MAGIC,
    G_BAD_MAGIC,
    G_DOORWAY,
    G_CHARM,
    G_WALL_TOP,
    G_DAR_PRIESTESS,
    G_DAR_BATTLEMAGE,
    G_GOBLIN_MAGIC,
    G_GOBLIN_CHIEFTAN,
    G_OGRE_MAGIC,
    G_GUARDIAN,
    G_WINGED_GUARDIAN,
    G_EGG,
    G_WARDEN,
    G_DEWAR,
    G_ANCIENT_SPIRIT,
    G_LEVER,
    G_LEVER_PULLED,
    G_BLOODWORT_STALK,
    G_FLOOR_ALT,
    G_UNICORN,
    G_GEM,
    G_WAND,
    G_GRANITE,
    G_CARPET,
    G_CLOSED_IRON_DOOR,
    G_OPEN_IRON_DOOR,
    G_TORCH,
    G_CRYSTAL,
    G_PORTCULLIS,
    G_BARRICADE,
    G_STATUE,
    G_CRACKED_STATUE,
    G_CLOSED_CAGE,
    G_OPEN_CAGE,
    G_PEDESTAL,
    G_CLOSED_COFFIN,
    G_OPEN_COFFIN,
    G_MAGIC_GLYPH,
    G_BRIDGE,
    G_BONES,
    G_ELECTRIC_CRYSTAL,
    G_ASHES,
    G_BEDROLL,
    G_BLOODWORT_POD,
    G_VINE,
    G_NET,
    G_LICHEN,
    G_PIPES,
    G_SAC_ALTAR,
    G_ORB_ALTAR,
    G_LEFT_TRIANGLE,
}

// =============================================================================
// Graphics modes
// =============================================================================

export enum GraphicsMode {
    TEXT_GRAPHICS,
    TILES_GRAPHICS,
    HYBRID_GRAPHICS,
}

// =============================================================================
// Event types
// =============================================================================

export enum EventType {
    KEYSTROKE,
    MOUSE_UP,
    MOUSE_DOWN,
    RIGHT_MOUSE_DOWN,
    RIGHT_MOUSE_UP,
    MOUSE_ENTERED_CELL,
    RNG_CHECK,
    SAVED_GAME_LOADED,
    END_OF_RECORDING,
    EVENT_ERROR,
    NUMBER_OF_EVENT_TYPES,
}

// =============================================================================
// Notification event types
// =============================================================================

export enum NotificationEventType {
    GAMEOVER_QUIT,
    GAMEOVER_DEATH,
    GAMEOVER_VICTORY,
    GAMEOVER_SUPERVICTORY,
    GAMEOVER_RECORDING,
}

// =============================================================================
// RNGs
// =============================================================================

export enum RNG {
    RNG_SUBSTANTIVE,
    RNG_COSMETIC,
    NUMBER_OF_RNGS,
}

// =============================================================================
// Display detail values
// =============================================================================

export enum DisplayDetailValue {
    DV_UNLIT = 0,
    DV_LIT,
    DV_DARK,
}

// =============================================================================
// Directions
// =============================================================================

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
    DIRECTION_COUNT = 8,
}

// =============================================================================
// Text entry types
// =============================================================================

export enum TextEntryType {
    TEXT_INPUT_NORMAL = 0,
    TEXT_INPUT_FILENAME,
    TEXT_INPUT_NUMBERS,
    TEXT_INPUT_TYPES,
}

// =============================================================================
// Tile types
// =============================================================================

export enum TileType {
    NOTHING = 0,
    GRANITE,
    FLOOR,
    FLOOR_FLOODABLE,
    CARPET,
    MARBLE_FLOOR,
    WALL,
    DOOR,
    OPEN_DOOR,
    SECRET_DOOR,
    LOCKED_DOOR,
    OPEN_IRON_DOOR_INERT,
    DOWN_STAIRS,
    UP_STAIRS,
    DUNGEON_EXIT,
    DUNGEON_PORTAL,
    TORCH_WALL,
    CRYSTAL_WALL,
    PORTCULLIS_CLOSED,
    PORTCULLIS_DORMANT,
    WOODEN_BARRICADE,
    PILOT_LIGHT_DORMANT,
    PILOT_LIGHT,
    HAUNTED_TORCH_DORMANT,
    HAUNTED_TORCH_TRANSITIONING,
    HAUNTED_TORCH,
    WALL_LEVER_HIDDEN,
    WALL_LEVER,
    WALL_LEVER_PULLED,
    WALL_LEVER_HIDDEN_DORMANT,
    STATUE_INERT,
    STATUE_DORMANT,
    STATUE_CRACKING,
    STATUE_INSTACRACK,
    PORTAL,
    TURRET_DORMANT,
    WALL_MONSTER_DORMANT,
    DARK_FLOOR_DORMANT,
    DARK_FLOOR_DARKENING,
    DARK_FLOOR,
    MACHINE_TRIGGER_FLOOR,
    ALTAR_INERT,
    ALTAR_KEYHOLE,
    ALTAR_CAGE_OPEN,
    ALTAR_CAGE_CLOSED,
    ALTAR_SWITCH,
    ALTAR_SWITCH_RETRACTING,
    ALTAR_CAGE_RETRACTABLE,
    PEDESTAL,
    MONSTER_CAGE_OPEN,
    MONSTER_CAGE_CLOSED,
    COFFIN_CLOSED,
    COFFIN_OPEN,

    GAS_TRAP_POISON_HIDDEN,
    GAS_TRAP_POISON,
    TRAP_DOOR_HIDDEN,
    TRAP_DOOR,
    GAS_TRAP_PARALYSIS_HIDDEN,
    GAS_TRAP_PARALYSIS,
    MACHINE_PARALYSIS_VENT_HIDDEN,
    MACHINE_PARALYSIS_VENT,
    GAS_TRAP_CONFUSION_HIDDEN,
    GAS_TRAP_CONFUSION,
    FLAMETHROWER_HIDDEN,
    FLAMETHROWER,
    FLOOD_TRAP_HIDDEN,
    FLOOD_TRAP,
    NET_TRAP_HIDDEN,
    NET_TRAP,
    ALARM_TRAP_HIDDEN,
    ALARM_TRAP,
    MACHINE_POISON_GAS_VENT_HIDDEN,
    MACHINE_POISON_GAS_VENT_DORMANT,
    MACHINE_POISON_GAS_VENT,
    MACHINE_METHANE_VENT_HIDDEN,
    MACHINE_METHANE_VENT_DORMANT,
    MACHINE_METHANE_VENT,
    STEAM_VENT,
    MACHINE_PRESSURE_PLATE,
    MACHINE_PRESSURE_PLATE_USED,
    MACHINE_GLYPH,
    MACHINE_GLYPH_INACTIVE,
    DEWAR_CAUSTIC_GAS,
    DEWAR_CONFUSION_GAS,
    DEWAR_PARALYSIS_GAS,
    DEWAR_METHANE_GAS,

    DEEP_WATER,
    SHALLOW_WATER,
    MUD,
    CHASM,
    CHASM_EDGE,
    MACHINE_COLLAPSE_EDGE_DORMANT,
    MACHINE_COLLAPSE_EDGE_SPREADING,
    LAVA,
    LAVA_RETRACTABLE,
    LAVA_RETRACTING,
    SUNLIGHT_POOL,
    DARKNESS_PATCH,
    ACTIVE_BRIMSTONE,
    INERT_BRIMSTONE,
    OBSIDIAN,
    BRIDGE,
    BRIDGE_FALLING,
    BRIDGE_EDGE,
    STONE_BRIDGE,
    MACHINE_FLOOD_WATER_DORMANT,
    MACHINE_FLOOD_WATER_SPREADING,
    MACHINE_MUD_DORMANT,
    ICE_DEEP,
    ICE_DEEP_MELT,
    ICE_SHALLOW,
    ICE_SHALLOW_MELT,

    HOLE,
    HOLE_GLOW,
    HOLE_EDGE,
    FLOOD_WATER_DEEP,
    FLOOD_WATER_SHALLOW,
    GRASS,
    DEAD_GRASS,
    GRAY_FUNGUS,
    LUMINESCENT_FUNGUS,
    LICHEN,
    HAY,
    RED_BLOOD,
    GREEN_BLOOD,
    PURPLE_BLOOD,
    ACID_SPLATTER,
    VOMIT,
    URINE,
    UNICORN_POOP,
    WORM_BLOOD,
    ASH,
    BURNED_CARPET,
    PUDDLE,
    BONES,
    RUBBLE,
    JUNK,
    BROKEN_GLASS,
    ECTOPLASM,
    EMBERS,
    SPIDERWEB,
    NETTING,
    FOLIAGE,
    DEAD_FOLIAGE,
    TRAMPLED_FOLIAGE,
    FUNGUS_FOREST,
    TRAMPLED_FUNGUS_FOREST,
    FORCEFIELD,
    FORCEFIELD_MELT,
    SACRED_GLYPH,
    MANACLE_TL,
    MANACLE_BR,
    MANACLE_TR,
    MANACLE_BL,
    MANACLE_T,
    MANACLE_B,
    MANACLE_L,
    MANACLE_R,
    PORTAL_LIGHT,
    GUARDIAN_GLOW,

    PLAIN_FIRE,
    BRIMSTONE_FIRE,
    FLAMEDANCER_FIRE,
    GAS_FIRE,
    GAS_EXPLOSION,
    DART_EXPLOSION,
    ITEM_FIRE,
    CREATURE_FIRE,

    POISON_GAS,
    CONFUSION_GAS,
    ROT_GAS,
    STENCH_SMOKE_GAS,
    PARALYSIS_GAS,
    METHANE_GAS,
    STEAM,
    DARKNESS_CLOUD,
    HEALING_CLOUD,

    BLOODFLOWER_STALK,
    BLOODFLOWER_POD,

    HAVEN_BEDROLL,

    DEEP_WATER_ALGAE_WELL,
    DEEP_WATER_ALGAE_1,
    DEEP_WATER_ALGAE_2,

    ANCIENT_SPIRIT_VINES,
    ANCIENT_SPIRIT_GRASS,

    AMULET_SWITCH,

    COMMUTATION_ALTAR,
    COMMUTATION_ALTAR_INERT,
    PIPE_GLOWING,
    PIPE_INERT,

    RESURRECTION_ALTAR,
    RESURRECTION_ALTAR_INERT,
    MACHINE_TRIGGER_FLOOR_REPEATING,

    SACRIFICE_ALTAR_DORMANT,
    SACRIFICE_ALTAR,
    SACRIFICE_LAVA,
    SACRIFICE_CAGE_DORMANT,
    DEMONIC_STATUE,

    STATUE_INERT_DOORWAY,
    STATUE_DORMANT_DOORWAY,

    CHASM_WITH_HIDDEN_BRIDGE,
    CHASM_WITH_HIDDEN_BRIDGE_ACTIVE,
    MACHINE_CHASM_EDGE,

    RAT_TRAP_WALL_DORMANT,
    RAT_TRAP_WALL_CRACKING,

    ELECTRIC_CRYSTAL_OFF,
    ELECTRIC_CRYSTAL_ON,
    TURRET_LEVER,

    WORM_TUNNEL_MARKER_DORMANT,
    WORM_TUNNEL_MARKER_ACTIVE,
    WORM_TUNNEL_OUTER_WALL,

    BRAZIER,

    MUD_FLOOR,
    MUD_WALL,
    MUD_DOORWAY,

    NUMBER_TILETYPES,
}

// =============================================================================
// Light types
// =============================================================================

export enum LightType {
    NO_LIGHT,
    MINERS_LIGHT,
    BURNING_CREATURE_LIGHT,
    WISP_LIGHT,
    SALAMANDER_LIGHT,
    IMP_LIGHT,
    PIXIE_LIGHT,
    LICH_LIGHT,
    FLAMEDANCER_LIGHT,
    SENTINEL_LIGHT,
    UNICORN_LIGHT,
    IFRIT_LIGHT,
    PHOENIX_LIGHT,
    PHOENIX_EGG_LIGHT,
    YENDOR_LIGHT,
    SPECTRAL_BLADE_LIGHT,
    SPECTRAL_IMAGE_LIGHT,
    SPARK_TURRET_LIGHT,
    EXPLOSIVE_BLOAT_LIGHT,
    BOLT_LIGHT_SOURCE,
    TELEPATHY_LIGHT,
    SACRIFICE_MARK_LIGHT,

    SCROLL_PROTECTION_LIGHT,
    SCROLL_ENCHANTMENT_LIGHT,
    POTION_STRENGTH_LIGHT,
    EMPOWERMENT_LIGHT,
    GENERIC_FLASH_LIGHT,
    FALLEN_TORCH_FLASH_LIGHT,
    SUMMONING_FLASH_LIGHT,
    EXPLOSION_FLARE_LIGHT,
    QUIETUS_FLARE_LIGHT,
    SLAYING_FLARE_LIGHT,
    CHARGE_FLASH_LIGHT,

    TORCH_LIGHT,
    LAVA_LIGHT,
    SUN_LIGHT,
    DARKNESS_PATCH_LIGHT,
    FUNGUS_LIGHT,
    FUNGUS_FOREST_LIGHT,
    LUMINESCENT_ALGAE_BLUE_LIGHT,
    LUMINESCENT_ALGAE_GREEN_LIGHT,
    ECTOPLASM_LIGHT,
    UNICORN_POOP_LIGHT,
    EMBER_LIGHT,
    FIRE_LIGHT,
    BRIMSTONE_FIRE_LIGHT,
    EXPLOSION_LIGHT,
    INCENDIARY_DART_LIGHT,
    PORTAL_ACTIVATE_LIGHT,
    CONFUSION_GAS_LIGHT,
    DARKNESS_CLOUD_LIGHT,
    FORCEFIELD_LIGHT,
    CRYSTAL_WALL_LIGHT,
    CANDLE_LIGHT,
    HAUNTED_TORCH_LIGHT,
    GLYPH_LIGHT_DIM,
    GLYPH_LIGHT_BRIGHT,
    SACRED_GLYPH_LIGHT,
    DESCENT_LIGHT,
    DEMONIC_STATUE_LIGHT,
    NUMBER_LIGHT_KINDS,
}

// =============================================================================
// Item categories (bitfield)
// =============================================================================

export const FOOD                   = Fl(0);
export const WEAPON                 = Fl(1);
export const ARMOR                  = Fl(2);
export const POTION                 = Fl(3);
export const SCROLL                 = Fl(4);
export const STAFF                  = Fl(5);
export const WAND                   = Fl(6);
export const RING                   = Fl(7);
export const CHARM                  = Fl(8);
export const GOLD                   = Fl(9);
export const AMULET                 = Fl(10);
export const GEM                    = Fl(11);
export const KEY                    = Fl(12);

export const HAS_INTRINSIC_POLARITY = POTION | SCROLL | RING | WAND | STAFF;
export const CAN_BE_DETECTED        = WEAPON | ARMOR | POTION | SCROLL | RING | CHARM | WAND | STAFF | AMULET;
export const CAN_BE_ENCHANTED       = WEAPON | ARMOR | RING | CHARM | WAND | STAFF;
export const PRENAMED_CATEGORY      = FOOD | GOLD | AMULET | GEM | KEY;
export const NEVER_IDENTIFIABLE     = FOOD | CHARM | GOLD | AMULET | GEM | KEY;
export const CAN_BE_SWAPPED         = WEAPON | ARMOR | STAFF | CHARM | RING;
export const ALL_ITEMS              = FOOD | POTION | WEAPON | ARMOR | STAFF | WAND | SCROLL | RING | CHARM | GOLD | AMULET | GEM | KEY;

// =============================================================================
// Key kinds
// =============================================================================

export enum KeyKind {
    KEY_DOOR,
    KEY_CAGE,
    KEY_PORTAL,
    NUMBER_KEY_TYPES,
}

// =============================================================================
// Food kinds
// =============================================================================

export enum FoodKind {
    RATION,
    FRUIT,
    NUMBER_FOOD_KINDS,
}

// =============================================================================
// Potion kinds
// =============================================================================

export enum PotionKind {
    POTION_LIFE,
    POTION_STRENGTH,
    POTION_TELEPATHY,
    POTION_LEVITATION,
    POTION_DETECT_MAGIC,
    POTION_HASTE_SELF,
    POTION_FIRE_IMMUNITY,
    POTION_INVISIBILITY,
    POTION_POISON,
    POTION_PARALYSIS,
    POTION_HALLUCINATION,
    POTION_CONFUSION,
    POTION_INCINERATION,
    POTION_DARKNESS,
    POTION_DESCENT,
    POTION_LICHEN,
}

// =============================================================================
// Weapon kinds
// =============================================================================

export enum WeaponKind {
    DAGGER,
    SWORD,
    BROADSWORD,
    WHIP,
    RAPIER,
    FLAIL,
    MACE,
    HAMMER,
    SPEAR,
    PIKE,
    AXE,
    WAR_AXE,
    DART,
    INCENDIARY_DART,
    JAVELIN,
    NUMBER_WEAPON_KINDS,
}

// =============================================================================
// Weapon enchants (runics)
// =============================================================================

export enum WeaponEnchant {
    W_SPEED,
    W_QUIETUS,
    W_PARALYSIS,
    W_MULTIPLICITY,
    W_SLOWING,
    W_CONFUSION,
    W_FORCE,
    W_SLAYING,
    W_MERCY,
    NUMBER_GOOD_WEAPON_ENCHANT_KINDS = W_MERCY,
    W_PLENTY,
    NUMBER_WEAPON_RUNIC_KINDS,
}

// =============================================================================
// Armor kinds
// =============================================================================

export enum ArmorKind {
    LEATHER_ARMOR,
    SCALE_MAIL,
    CHAIN_MAIL,
    BANDED_MAIL,
    SPLINT_MAIL,
    PLATE_MAIL,
    NUMBER_ARMOR_KINDS,
}

// =============================================================================
// Armor enchants (runics)
// =============================================================================

export enum ArmorEnchant {
    A_MULTIPLICITY,
    A_MUTUALITY,
    A_ABSORPTION,
    A_REPRISAL,
    A_IMMUNITY,
    A_REFLECTION,
    A_RESPIRATION,
    A_DAMPENING,
    A_BURDEN,
    NUMBER_GOOD_ARMOR_ENCHANT_KINDS = A_BURDEN,
    A_VULNERABILITY,
    A_IMMOLATION,
    NUMBER_ARMOR_ENCHANT_KINDS,
}

// =============================================================================
// Wand kinds
// =============================================================================

export enum WandKind {
    WAND_TELEPORT,
    WAND_SLOW,
    WAND_POLYMORPH,
    WAND_NEGATION,
    WAND_DOMINATION,
    WAND_BECKONING,
    WAND_PLENTY,
    WAND_INVISIBILITY,
    WAND_EMPOWERMENT,
}

// =============================================================================
// Staff kinds
// =============================================================================

export enum StaffKind {
    STAFF_LIGHTNING,
    STAFF_FIRE,
    STAFF_POISON,
    STAFF_TUNNELING,
    STAFF_BLINKING,
    STAFF_ENTRANCEMENT,
    STAFF_OBSTRUCTION,
    STAFF_DISCORD,
    STAFF_CONJURATION,
    STAFF_HEALING,
    NUMBER_GOOD_STAFF_KINDS = STAFF_HEALING,
    STAFF_HASTE,
    STAFF_PROTECTION,
    NUMBER_STAFF_KINDS,
}

// =============================================================================
// Bolt types
// =============================================================================

export enum BoltType {
    BOLT_NONE = 0,
    BOLT_TELEPORT,
    BOLT_SLOW,
    BOLT_POLYMORPH,
    BOLT_NEGATION,
    BOLT_DOMINATION,
    BOLT_BECKONING,
    BOLT_PLENTY,
    BOLT_INVISIBILITY,
    BOLT_EMPOWERMENT,
    BOLT_LIGHTNING,
    BOLT_FIRE,
    BOLT_POISON,
    BOLT_TUNNELING,
    BOLT_BLINKING,
    BOLT_ENTRANCEMENT,
    BOLT_OBSTRUCTION,
    BOLT_DISCORD,
    BOLT_CONJURATION,
    BOLT_HEALING,
    BOLT_HASTE,
    BOLT_SLOW_2,
    BOLT_SHIELDING,
    BOLT_SPIDERWEB,
    BOLT_SPARK,
    BOLT_DRAGONFIRE,
    BOLT_DISTANCE_ATTACK,
    BOLT_POISON_DART,
    BOLT_ANCIENT_SPIRIT_VINES,
    BOLT_WHIP,
}

// =============================================================================
// Ring kinds
// =============================================================================

export enum RingKind {
    RING_CLAIRVOYANCE,
    RING_STEALTH,
    RING_REGENERATION,
    RING_TRANSFERENCE,
    RING_LIGHT,
    RING_AWARENESS,
    RING_WISDOM,
    RING_REAPING,
    NUMBER_RING_KINDS,
}

// =============================================================================
// Charm kinds
// =============================================================================

export enum CharmKind {
    CHARM_HEALTH,
    CHARM_PROTECTION,
    CHARM_HASTE,
    CHARM_FIRE_IMMUNITY,
    CHARM_INVISIBILITY,
    CHARM_TELEPATHY,
    CHARM_LEVITATION,
    CHARM_SHATTERING,
    CHARM_GUARDIAN,
    CHARM_TELEPORTATION,
    CHARM_RECHARGING,
    CHARM_NEGATION,
}

// =============================================================================
// Scroll kinds
// =============================================================================

export enum ScrollKind {
    SCROLL_ENCHANTING,
    SCROLL_IDENTIFY,
    SCROLL_TELEPORT,
    SCROLL_REMOVE_CURSE,
    SCROLL_RECHARGING,
    SCROLL_PROTECT_ARMOR,
    SCROLL_PROTECT_WEAPON,
    SCROLL_SANCTUARY,
    SCROLL_MAGIC_MAPPING,
    SCROLL_NEGATION,
    SCROLL_SHATTERING,
    SCROLL_DISCORD,
    SCROLL_AGGRAVATE_MONSTER,
    SCROLL_SUMMON_MONSTER,
}

// =============================================================================
// Monster types
// =============================================================================

export enum MonsterType {
    MK_YOU,
    MK_RAT,
    MK_KOBOLD,
    MK_JACKAL,
    MK_EEL,
    MK_MONKEY,
    MK_BLOAT,
    MK_PIT_BLOAT,
    MK_GOBLIN,
    MK_GOBLIN_CONJURER,
    MK_GOBLIN_MYSTIC,
    MK_GOBLIN_TOTEM,
    MK_PINK_JELLY,
    MK_TOAD,
    MK_VAMPIRE_BAT,
    MK_ARROW_TURRET,
    MK_ACID_MOUND,
    MK_CENTIPEDE,
    MK_OGRE,
    MK_BOG_MONSTER,
    MK_OGRE_TOTEM,
    MK_SPIDER,
    MK_SPARK_TURRET,
    MK_WILL_O_THE_WISP,
    MK_WRAITH,
    MK_ZOMBIE,
    MK_TROLL,
    MK_OGRE_SHAMAN,
    MK_NAGA,
    MK_SALAMANDER,
    MK_EXPLOSIVE_BLOAT,
    MK_DAR_BLADEMASTER,
    MK_DAR_PRIESTESS,
    MK_DAR_BATTLEMAGE,
    MK_ACID_JELLY,
    MK_CENTAUR,
    MK_UNDERWORM,
    MK_SENTINEL,
    MK_DART_TURRET,
    MK_KRAKEN,
    MK_LICH,
    MK_PHYLACTERY,
    MK_PIXIE,
    MK_PHANTOM,
    MK_FLAME_TURRET,
    MK_IMP,
    MK_FURY,
    MK_REVENANT,
    MK_TENTACLE_HORROR,
    MK_GOLEM,
    MK_DRAGON,

    MK_GOBLIN_CHIEFTAN,
    MK_BLACK_JELLY,
    MK_VAMPIRE,
    MK_FLAMEDANCER,

    MK_SPECTRAL_BLADE,
    MK_SPECTRAL_IMAGE,
    MK_GUARDIAN,
    MK_WINGED_GUARDIAN,
    MK_CHARM_GUARDIAN,
    MK_WARDEN_OF_YENDOR,
    MK_ELDRITCH_TOTEM,
    MK_MIRRORED_TOTEM,

    MK_UNICORN,
    MK_IFRIT,
    MK_PHOENIX,
    MK_PHOENIX_EGG,
    MK_ANCIENT_SPIRIT,

    NUMBER_MONSTER_KINDS,
}

// =============================================================================
// Dungeon layers
// =============================================================================

export enum DungeonLayer {
    NO_LAYER = -1,
    DUNGEON = 0,
    LIQUID,
    GAS,
    SURFACE,
    NUMBER_TERRAIN_LAYERS,
}

// =============================================================================
// Tile flags (bitfield)
// =============================================================================

export const DISCOVERED                  = Fl(0);
export const VISIBLE                     = Fl(1);
export const HAS_PLAYER                  = Fl(2);
export const HAS_MONSTER                 = Fl(3);
export const HAS_DORMANT_MONSTER         = Fl(4);
export const HAS_ITEM                    = Fl(5);
export const IN_FIELD_OF_VIEW            = Fl(6);
export const WAS_VISIBLE                 = Fl(7);
export const HAS_STAIRS                  = Fl(8);
export const SEARCHED_FROM_HERE          = Fl(9);
export const IS_IN_SHADOW                = Fl(10);
export const MAGIC_MAPPED                = Fl(11);
export const ITEM_DETECTED               = Fl(12);
export const CLAIRVOYANT_VISIBLE         = Fl(13);
export const WAS_CLAIRVOYANT_VISIBLE     = Fl(14);
export const CLAIRVOYANT_DARKENED        = Fl(15);
export const CAUGHT_FIRE_THIS_TURN       = Fl(16);
export const PRESSURE_PLATE_DEPRESSED    = Fl(17);
export const STABLE_MEMORY               = Fl(18);
export const KNOWN_TO_BE_TRAP_FREE       = Fl(19);
export const IS_IN_PATH                  = Fl(20);
export const IN_LOOP                     = Fl(21);
export const IS_CHOKEPOINT               = Fl(22);
export const IS_GATE_SITE                = Fl(23);
export const IS_IN_ROOM_MACHINE          = Fl(24);
export const IS_IN_AREA_MACHINE          = Fl(25);
export const IS_POWERED                  = Fl(26);
export const IMPREGNABLE                 = Fl(27);
export const TERRAIN_COLORS_DANCING      = Fl(28);
export const TELEPATHIC_VISIBLE          = Fl(29);
export const WAS_TELEPATHIC_VISIBLE      = Fl(30);

export const IS_IN_MACHINE              = IS_IN_ROOM_MACHINE | IS_IN_AREA_MACHINE;

export const PERMANENT_TILE_FLAGS       = DISCOVERED | MAGIC_MAPPED | ITEM_DETECTED | HAS_ITEM | HAS_DORMANT_MONSTER
                                        | HAS_MONSTER | HAS_STAIRS | SEARCHED_FROM_HERE | PRESSURE_PLATE_DEPRESSED
                                        | STABLE_MEMORY | KNOWN_TO_BE_TRAP_FREE | IN_LOOP
                                        | IS_CHOKEPOINT | IS_GATE_SITE | IS_IN_MACHINE | IMPREGNABLE;

export const ANY_KIND_OF_VISIBLE        = VISIBLE | CLAIRVOYANT_VISIBLE | TELEPATHIC_VISIBLE;

// =============================================================================
// Terrain flags (bitfield)
// =============================================================================

export const T_OBSTRUCTS_PASSABILITY         = Fl(0);
export const T_OBSTRUCTS_VISION              = Fl(1);
export const T_OBSTRUCTS_ITEMS               = Fl(2);
export const T_OBSTRUCTS_SURFACE_EFFECTS     = Fl(3);
export const T_OBSTRUCTS_GAS                 = Fl(4);
export const T_OBSTRUCTS_DIAGONAL_MOVEMENT   = Fl(5);
export const T_SPONTANEOUSLY_IGNITES         = Fl(6);
export const T_AUTO_DESCENT                  = Fl(7);
export const T_LAVA_INSTA_DEATH              = Fl(8);
export const T_CAUSES_POISON                 = Fl(9);
export const T_IS_FLAMMABLE                  = Fl(10);
export const T_IS_FIRE                       = Fl(11);
export const T_ENTANGLES                     = Fl(12);
export const T_IS_DEEP_WATER                 = Fl(13);
export const T_CAUSES_DAMAGE                 = Fl(14);
export const T_CAUSES_NAUSEA                 = Fl(15);
export const T_CAUSES_PARALYSIS              = Fl(16);
export const T_CAUSES_CONFUSION              = Fl(17);
export const T_CAUSES_HEALING                = Fl(18);
export const T_IS_DF_TRAP                    = Fl(19);
export const T_CAUSES_EXPLOSIVE_DAMAGE       = Fl(20);
export const T_SACRED                        = Fl(21);

export const T_OBSTRUCTS_SCENT              = T_OBSTRUCTS_PASSABILITY | T_OBSTRUCTS_VISION | T_AUTO_DESCENT | T_LAVA_INSTA_DEATH | T_IS_DEEP_WATER | T_SPONTANEOUSLY_IGNITES;
export const T_PATHING_BLOCKER              = T_OBSTRUCTS_PASSABILITY | T_AUTO_DESCENT | T_IS_DF_TRAP | T_LAVA_INSTA_DEATH | T_IS_DEEP_WATER | T_IS_FIRE | T_SPONTANEOUSLY_IGNITES;
export const T_DIVIDES_LEVEL                = T_OBSTRUCTS_PASSABILITY | T_AUTO_DESCENT | T_IS_DF_TRAP | T_LAVA_INSTA_DEATH | T_IS_DEEP_WATER;
export const T_LAKE_PATHING_BLOCKER         = T_AUTO_DESCENT | T_LAVA_INSTA_DEATH | T_IS_DEEP_WATER | T_SPONTANEOUSLY_IGNITES;
export const T_WAYPOINT_BLOCKER             = T_OBSTRUCTS_PASSABILITY | T_AUTO_DESCENT | T_IS_DF_TRAP | T_LAVA_INSTA_DEATH | T_IS_DEEP_WATER | T_SPONTANEOUSLY_IGNITES;
export const T_MOVES_ITEMS                  = T_IS_DEEP_WATER | T_LAVA_INSTA_DEATH;
export const T_CAN_BE_BRIDGED               = T_AUTO_DESCENT;
export const T_OBSTRUCTS_EVERYTHING         = T_OBSTRUCTS_PASSABILITY | T_OBSTRUCTS_VISION | T_OBSTRUCTS_ITEMS | T_OBSTRUCTS_GAS | T_OBSTRUCTS_SURFACE_EFFECTS | T_OBSTRUCTS_DIAGONAL_MOVEMENT;
export const T_HARMFUL_TERRAIN              = T_CAUSES_POISON | T_IS_FIRE | T_CAUSES_DAMAGE | T_CAUSES_PARALYSIS | T_CAUSES_CONFUSION | T_CAUSES_EXPLOSIVE_DAMAGE;
export const T_RESPIRATION_IMMUNITIES       = T_CAUSES_DAMAGE | T_CAUSES_CONFUSION | T_CAUSES_PARALYSIS | T_CAUSES_NAUSEA;

// =============================================================================
// Terrain mechanical flags (bitfield)
// =============================================================================

export const TM_IS_SECRET                        = Fl(0);
export const TM_PROMOTES_WITH_KEY                = Fl(1);
export const TM_PROMOTES_WITHOUT_KEY             = Fl(2);
export const TM_PROMOTES_ON_CREATURE             = Fl(3);
export const TM_PROMOTES_ON_ITEM                 = Fl(4);
export const TM_PROMOTES_ON_ITEM_PICKUP          = Fl(5);
export const TM_PROMOTES_ON_PLAYER_ENTRY         = Fl(6);
export const TM_PROMOTES_ON_SACRIFICE_ENTRY      = Fl(7);
export const TM_PROMOTES_ON_ELECTRICITY          = Fl(8);
export const TM_ALLOWS_SUBMERGING                = Fl(9);
export const TM_IS_WIRED                         = Fl(10);
export const TM_IS_CIRCUIT_BREAKER               = Fl(11);
export const TM_GAS_DISSIPATES                   = Fl(12);
export const TM_GAS_DISSIPATES_QUICKLY           = Fl(13);
export const TM_EXTINGUISHES_FIRE                = Fl(14);
export const TM_VANISHES_UPON_PROMOTION          = Fl(15);
export const TM_REFLECTS_BOLTS                   = Fl(16);
export const TM_STAND_IN_TILE                    = Fl(17);
export const TM_LIST_IN_SIDEBAR                  = Fl(18);
export const TM_VISUALLY_DISTINCT                = Fl(19);
export const TM_BRIGHT_MEMORY                    = Fl(20);
export const TM_EXPLOSIVE_PROMOTE                = Fl(21);
export const TM_CONNECTS_LEVEL                   = Fl(22);
export const TM_INTERRUPT_EXPLORATION_WHEN_SEEN  = Fl(23);
export const TM_INVERT_WHEN_HIGHLIGHTED          = Fl(24);
export const TM_SWAP_ENCHANTS_ACTIVATION         = Fl(25);

export const TM_PROMOTES_ON_STEP                 = TM_PROMOTES_ON_CREATURE | TM_PROMOTES_ON_ITEM;

// =============================================================================
// Item flags (bitfield)
// =============================================================================

export const ITEM_IDENTIFIED         = Fl(0);
export const ITEM_EQUIPPED           = Fl(1);
export const ITEM_CURSED             = Fl(2);
export const ITEM_PROTECTED          = Fl(3);
// Fl(4) unused
export const ITEM_RUNIC              = Fl(5);
export const ITEM_RUNIC_HINTED       = Fl(6);
export const ITEM_RUNIC_IDENTIFIED   = Fl(7);
export const ITEM_CAN_BE_IDENTIFIED  = Fl(8);
export const ITEM_PREPLACED          = Fl(9);
export const ITEM_FLAMMABLE          = Fl(10);
export const ITEM_MAGIC_DETECTED     = Fl(11);
export const ITEM_MAX_CHARGES_KNOWN  = Fl(12);
export const ITEM_IS_KEY             = Fl(13);
export const ITEM_ATTACKS_STAGGER    = Fl(14);
export const ITEM_ATTACKS_EXTEND     = Fl(15);
export const ITEM_ATTACKS_QUICKLY    = Fl(16);
export const ITEM_ATTACKS_PENETRATE  = Fl(17);
export const ITEM_ATTACKS_ALL_ADJACENT = Fl(18);
export const ITEM_LUNGE_ATTACKS      = Fl(19);
export const ITEM_SNEAK_ATTACK_BONUS = Fl(20);
export const ITEM_PASS_ATTACKS       = Fl(21);
export const ITEM_KIND_AUTO_ID       = Fl(22);
export const ITEM_PLAYER_AVOIDS      = Fl(23);

// =============================================================================
// Dungeon feature flags (bitfield)
// =============================================================================

export const DFF_EVACUATE_CREATURES_FIRST    = Fl(0);
export const DFF_SUBSEQ_EVERYWHERE           = Fl(1);
export const DFF_TREAT_AS_BLOCKING           = Fl(2);
export const DFF_PERMIT_BLOCKING             = Fl(3);
export const DFF_ACTIVATE_DORMANT_MONSTER    = Fl(4);
export const DFF_CLEAR_OTHER_TERRAIN         = Fl(5);
export const DFF_BLOCKED_BY_OTHER_LAYERS     = Fl(6);
export const DFF_SUPERPRIORITY               = Fl(7);
export const DFF_AGGRAVATES_MONSTERS         = Fl(8);
export const DFF_RESURRECT_ALLY              = Fl(9);
export const DFF_CLEAR_LOWER_PRIORITY_TERRAIN = Fl(10);

// =============================================================================
// Status effects
// =============================================================================

export enum StatusEffect {
    STATUS_SEARCHING = 0,
    STATUS_DONNING,
    STATUS_WEAKENED,
    STATUS_TELEPATHIC,
    STATUS_HALLUCINATING,
    STATUS_LEVITATING,
    STATUS_SLOWED,
    STATUS_HASTED,
    STATUS_CONFUSED,
    STATUS_BURNING,
    STATUS_PARALYZED,
    STATUS_POISONED,
    STATUS_STUCK,
    STATUS_NAUSEOUS,
    STATUS_DISCORDANT,
    STATUS_IMMUNE_TO_FIRE,
    STATUS_EXPLOSION_IMMUNITY,
    STATUS_NUTRITION,
    STATUS_ENTERS_LEVEL_IN,
    STATUS_ENRAGED,
    STATUS_MAGICAL_FEAR,
    STATUS_ENTRANCED,
    STATUS_DARKNESS,
    STATUS_LIFESPAN_REMAINING,
    STATUS_SHIELDED,
    STATUS_INVISIBLE,
    STATUS_AGGRAVATING,
    NUMBER_OF_STATUS_EFFECTS,
}

// =============================================================================
// Horde flags (bitfield)
// =============================================================================

export const HORDE_DIES_ON_LEADER_DEATH      = Fl(0);
export const HORDE_IS_SUMMONED               = Fl(1);
export const HORDE_SUMMONED_AT_DISTANCE      = Fl(2);
export const HORDE_LEADER_CAPTIVE            = Fl(3);
export const HORDE_NO_PERIODIC_SPAWN         = Fl(4);
export const HORDE_ALLIED_WITH_PLAYER        = Fl(5);
export const HORDE_MACHINE_BOSS              = Fl(6);
export const HORDE_MACHINE_WATER_MONSTER     = Fl(7);
export const HORDE_MACHINE_CAPTIVE           = Fl(8);
export const HORDE_MACHINE_STATUE            = Fl(9);
export const HORDE_MACHINE_TURRET            = Fl(10);
export const HORDE_MACHINE_MUD               = Fl(11);
export const HORDE_MACHINE_KENNEL            = Fl(12);
export const HORDE_VAMPIRE_FODDER            = Fl(13);
export const HORDE_MACHINE_LEGENDARY_ALLY    = Fl(14);
export const HORDE_NEVER_OOD                 = Fl(15);
export const HORDE_MACHINE_THIEF             = Fl(16);
export const HORDE_MACHINE_GOBLIN_WARREN     = Fl(17);
export const HORDE_SACRIFICE_TARGET          = Fl(18);

export const HORDE_MACHINE_ONLY              = HORDE_MACHINE_BOSS | HORDE_MACHINE_WATER_MONSTER
                                             | HORDE_MACHINE_CAPTIVE | HORDE_MACHINE_STATUE
                                             | HORDE_MACHINE_TURRET | HORDE_MACHINE_MUD
                                             | HORDE_MACHINE_KENNEL | HORDE_VAMPIRE_FODDER
                                             | HORDE_MACHINE_LEGENDARY_ALLY | HORDE_MACHINE_THIEF
                                             | HORDE_MACHINE_GOBLIN_WARREN
                                             | HORDE_SACRIFICE_TARGET;

// =============================================================================
// Monster behavior flags (bitfield)
// =============================================================================

export const MONST_INVISIBLE                 = Fl(0);
export const MONST_INANIMATE                 = Fl(1);
export const MONST_IMMOBILE                  = Fl(2);
export const MONST_CARRY_ITEM_100            = Fl(3);
export const MONST_CARRY_ITEM_25             = Fl(4);
export const MONST_ALWAYS_HUNTING            = Fl(5);
export const MONST_FLEES_NEAR_DEATH          = Fl(6);
export const MONST_ATTACKABLE_THRU_WALLS     = Fl(7);
export const MONST_DEFEND_DEGRADE_WEAPON     = Fl(8);
export const MONST_IMMUNE_TO_WEAPONS         = Fl(9);
export const MONST_FLIES                     = Fl(10);
export const MONST_FLITS                     = Fl(11);
export const MONST_IMMUNE_TO_FIRE            = Fl(12);
export const MONST_CAST_SPELLS_SLOWLY        = Fl(13);
export const MONST_IMMUNE_TO_WEBS            = Fl(14);
export const MONST_REFLECT_50                = Fl(15);
export const MONST_NEVER_SLEEPS              = Fl(16);
export const MONST_FIERY                     = Fl(17);
export const MONST_INVULNERABLE              = Fl(18);
export const MONST_IMMUNE_TO_WATER           = Fl(19);
export const MONST_RESTRICTED_TO_LIQUID      = Fl(20);
export const MONST_SUBMERGES                 = Fl(21);
export const MONST_MAINTAINS_DISTANCE        = Fl(22);
export const MONST_WILL_NOT_USE_STAIRS       = Fl(23);
export const MONST_DIES_IF_NEGATED           = Fl(24);
export const MONST_MALE                      = Fl(25);
export const MONST_FEMALE                    = Fl(26);
export const MONST_NOT_LISTED_IN_SIDEBAR     = Fl(27);
export const MONST_GETS_TURN_ON_ACTIVATION   = Fl(28);
export const MONST_ALWAYS_USE_ABILITY        = Fl(29);
export const MONST_NO_POLYMORPH              = Fl(30);

export const NEGATABLE_TRAITS               = MONST_INVISIBLE | MONST_DEFEND_DEGRADE_WEAPON | MONST_IMMUNE_TO_WEAPONS | MONST_FLIES
                                            | MONST_FLITS | MONST_IMMUNE_TO_FIRE | MONST_REFLECT_50 | MONST_FIERY | MONST_MAINTAINS_DISTANCE;
export const MONST_TURRET                   = MONST_IMMUNE_TO_WEBS | MONST_NEVER_SLEEPS | MONST_IMMOBILE | MONST_INANIMATE
                                            | MONST_ATTACKABLE_THRU_WALLS | MONST_WILL_NOT_USE_STAIRS;
export const LEARNABLE_BEHAVIORS            = MONST_INVISIBLE | MONST_FLIES | MONST_IMMUNE_TO_FIRE | MONST_REFLECT_50;
export const MONST_NEVER_VORPAL_ENEMY       = MONST_INANIMATE | MONST_INVULNERABLE | MONST_IMMOBILE | MONST_RESTRICTED_TO_LIQUID | MONST_GETS_TURN_ON_ACTIVATION | MONST_MAINTAINS_DISTANCE;
export const MONST_NEVER_MUTATED            = MONST_INVISIBLE | MONST_INANIMATE | MONST_IMMOBILE | MONST_INVULNERABLE;

// =============================================================================
// Monster ability flags (bitfield)
// =============================================================================

export const MA_HIT_HALLUCINATE              = Fl(0);
export const MA_HIT_STEAL_FLEE               = Fl(1);
export const MA_HIT_BURN                     = Fl(2);
export const MA_ENTER_SUMMONS                = Fl(3);
export const MA_HIT_DEGRADE_ARMOR            = Fl(4);
export const MA_CAST_SUMMON                  = Fl(5);
export const MA_SEIZES                       = Fl(6);
export const MA_POISONS                      = Fl(7);
export const MA_DF_ON_DEATH                  = Fl(8);
export const MA_CLONE_SELF_ON_DEFEND         = Fl(9);
export const MA_KAMIKAZE                     = Fl(10);
export const MA_TRANSFERENCE                 = Fl(11);
export const MA_CAUSES_WEAKNESS              = Fl(12);
export const MA_ATTACKS_PENETRATE            = Fl(13);
export const MA_ATTACKS_ALL_ADJACENT         = Fl(14);
export const MA_ATTACKS_EXTEND               = Fl(15);
export const MA_ATTACKS_STAGGER              = Fl(16);
export const MA_AVOID_CORRIDORS              = Fl(17);
export const MA_REFLECT_100                  = Fl(18);

export const SPECIAL_HIT                    = MA_HIT_HALLUCINATE | MA_HIT_STEAL_FLEE | MA_HIT_DEGRADE_ARMOR | MA_POISONS
                                            | MA_TRANSFERENCE | MA_CAUSES_WEAKNESS | MA_HIT_BURN | MA_ATTACKS_STAGGER;
export const LEARNABLE_ABILITIES            = MA_TRANSFERENCE | MA_CAUSES_WEAKNESS;
export const MA_NON_NEGATABLE_ABILITIES     = MA_ATTACKS_PENETRATE | MA_ATTACKS_ALL_ADJACENT | MA_ATTACKS_EXTEND | MA_ATTACKS_STAGGER;
export const MA_NEVER_VORPAL_ENEMY          = MA_KAMIKAZE;
export const MA_NEVER_MUTATED               = MA_KAMIKAZE;

// =============================================================================
// Monster bookkeeping flags (bitfield)
// =============================================================================

export const MB_WAS_VISIBLE              = Fl(0);
export const MB_TELEPATHICALLY_REVEALED  = Fl(1);
export const MB_PREPLACED                = Fl(2);
export const MB_APPROACHING_UPSTAIRS     = Fl(3);
export const MB_APPROACHING_DOWNSTAIRS   = Fl(4);
export const MB_APPROACHING_PIT          = Fl(5);
export const MB_LEADER                   = Fl(6);
export const MB_FOLLOWER                 = Fl(7);
export const MB_CAPTIVE                  = Fl(8);
export const MB_SEIZED                   = Fl(9);
export const MB_SEIZING                  = Fl(10);
export const MB_SUBMERGED                = Fl(11);
export const MB_JUST_SUMMONED            = Fl(12);
export const MB_WILL_FLASH               = Fl(13);
export const MB_BOUND_TO_LEADER          = Fl(14);
export const MB_MARKED_FOR_SACRIFICE     = Fl(15);
export const MB_ABSORBING                = Fl(16);
export const MB_DOES_NOT_TRACK_LEADER    = Fl(17);
export const MB_IS_FALLING               = Fl(18);
export const MB_IS_DYING                 = Fl(19);
export const MB_GIVEN_UP_ON_SCENT        = Fl(20);
export const MB_IS_DORMANT               = Fl(21);
export const MB_WEAPON_AUTO_ID           = Fl(22);
export const MB_ALREADY_SEEN             = Fl(23);
export const MB_ADMINISTRATIVE_DEATH     = Fl(24);
export const MB_HAS_DIED                 = Fl(25);
export const MB_DOES_NOT_RESURRECT       = Fl(26);

// =============================================================================
// Dungeon feature types
// =============================================================================

export enum DungeonFeatureType {
    DF_GRANITE_COLUMN = 1,
    DF_CRYSTAL_WALL,
    DF_LUMINESCENT_FUNGUS,
    DF_GRASS,
    DF_DEAD_GRASS,
    DF_BONES,
    DF_RUBBLE,
    DF_FOLIAGE,
    DF_FUNGUS_FOREST,
    DF_DEAD_FOLIAGE,

    DF_SUNLIGHT,
    DF_DARKNESS,

    DF_SHOW_DOOR,
    DF_SHOW_POISON_GAS_TRAP,
    DF_SHOW_PARALYSIS_GAS_TRAP,
    DF_SHOW_TRAPDOOR_HALO,
    DF_SHOW_TRAPDOOR,
    DF_SHOW_CONFUSION_GAS_TRAP,
    DF_SHOW_FLAMETHROWER_TRAP,
    DF_SHOW_FLOOD_TRAP,
    DF_SHOW_NET_TRAP,
    DF_SHOW_ALARM_TRAP,

    DF_RED_BLOOD,
    DF_GREEN_BLOOD,
    DF_PURPLE_BLOOD,
    DF_WORM_BLOOD,
    DF_ACID_BLOOD,
    DF_ASH_BLOOD,
    DF_EMBER_BLOOD,
    DF_ECTOPLASM_BLOOD,
    DF_RUBBLE_BLOOD,
    DF_ROT_GAS_BLOOD,

    DF_VOMIT,
    DF_BLOAT_DEATH,
    DF_BLOAT_EXPLOSION,
    DF_BLOOD_EXPLOSION,
    DF_FLAMEDANCER_CORONA,

    DF_MUTATION_EXPLOSION,
    DF_MUTATION_LICHEN,

    DF_REPEL_CREATURES,
    DF_ROT_GAS_PUFF,
    DF_STEAM_PUFF,
    DF_STEAM_ACCUMULATION,
    DF_METHANE_GAS_PUFF,
    DF_SALAMANDER_FLAME,
    DF_URINE,
    DF_UNICORN_POOP,
    DF_PUDDLE,
    DF_ASH,
    DF_ECTOPLASM_DROPLET,
    DF_FORCEFIELD,
    DF_FORCEFIELD_MELT,
    DF_SACRED_GLYPHS,
    DF_LICHEN_GROW,
    DF_TUNNELIZE,
    DF_SHATTERING_SPELL,

    DF_WEB_SMALL,
    DF_WEB_LARGE,

    DF_ANCIENT_SPIRIT_VINES,
    DF_ANCIENT_SPIRIT_GRASS,

    DF_TRAMPLED_FOLIAGE,
    DF_SMALL_DEAD_GRASS,
    DF_FOLIAGE_REGROW,
    DF_TRAMPLED_FUNGUS_FOREST,
    DF_FUNGUS_FOREST_REGROW,

    DF_ACTIVE_BRIMSTONE,
    DF_INERT_BRIMSTONE,

    DF_BLOODFLOWER_PODS_GROW_INITIAL,
    DF_BLOODFLOWER_PODS_GROW,
    DF_BLOODFLOWER_POD_BURST,

    DF_DEWAR_CAUSTIC,
    DF_DEWAR_CONFUSION,
    DF_DEWAR_PARALYSIS,
    DF_DEWAR_METHANE,
    DF_DEWAR_GLASS,
    DF_CARPET_AREA,

    DF_BUILD_ALGAE_WELL,
    DF_ALGAE_1,
    DF_ALGAE_2,
    DF_ALGAE_REVERT,

    DF_OPEN_DOOR,
    DF_CLOSED_DOOR,
    DF_OPEN_IRON_DOOR_INERT,
    DF_ITEM_CAGE_OPEN,
    DF_ITEM_CAGE_CLOSE,
    DF_ALTAR_INERT,
    DF_ALTAR_RETRACT,
    DF_PORTAL_ACTIVATE,
    DF_INACTIVE_GLYPH,
    DF_ACTIVE_GLYPH,
    DF_SILENT_GLYPH_GLOW,
    DF_GUARDIAN_STEP,
    DF_MIRROR_TOTEM_STEP,
    DF_GLYPH_CIRCLE,
    DF_REVEAL_LEVER,
    DF_PULL_LEVER,
    DF_CREATE_LEVER,

    DF_BRIDGE_FALL_PREP,
    DF_BRIDGE_FALL,

    DF_PLAIN_FIRE,
    DF_GAS_FIRE,
    DF_EXPLOSION_FIRE,
    DF_DART_EXPLOSION,
    DF_BRIMSTONE_FIRE,
    DF_BRIDGE_FIRE,
    DF_FLAMETHROWER,
    DF_EMBERS,
    DF_EMBERS_PATCH,
    DF_OBSIDIAN,
    DF_ITEM_FIRE,
    DF_CREATURE_FIRE,

    DF_FLOOD,
    DF_FLOOD_2,
    DF_FLOOD_DRAIN,
    DF_HOLE_2,
    DF_HOLE_DRAIN,

    DF_DEEP_WATER_FREEZE,
    DF_ALGAE_1_FREEZE,
    DF_ALGAE_2_FREEZE,
    DF_DEEP_WATER_MELTING,
    DF_DEEP_WATER_THAW,
    DF_SHALLOW_WATER_FREEZE,
    DF_SHALLOW_WATER_MELTING,
    DF_SHALLOW_WATER_THAW,

    DF_POISON_GAS_CLOUD,
    DF_CONFUSION_GAS_TRAP_CLOUD,
    DF_NET,
    DF_AGGRAVATE_TRAP,
    DF_METHANE_GAS_ARMAGEDDON,

    DF_POISON_GAS_CLOUD_POTION,
    DF_PARALYSIS_GAS_CLOUD_POTION,
    DF_CONFUSION_GAS_CLOUD_POTION,
    DF_INCINERATION_POTION,
    DF_DARKNESS_POTION,
    DF_HOLE_POTION,
    DF_LICHEN_PLANTED,

    DF_ARMOR_IMMOLATION,
    DF_STAFF_HOLE,
    DF_STAFF_HOLE_EDGE,

    DF_ALTAR_COMMUTE,
    DF_MAGIC_PIPING,
    DF_INERT_PIPE,

    DF_ALTAR_RESURRECT,
    DF_MACHINE_FLOOR_TRIGGER_REPEATING,

    DF_SACRIFICE_ALTAR,
    DF_SACRIFICE_COMPLETE,
    DF_SACRIFICE_CAGE_ACTIVE,

    DF_COFFIN_BURSTS,
    DF_COFFIN_BURNS,
    DF_TRIGGER_AREA,

    DF_CAGE_DISAPPEARS,
    DF_MEDIUM_HOLE,
    DF_MEDIUM_LAVA_POND,
    DF_MACHINE_PRESSURE_PLATE_USED,

    DF_WALL_CRACK,

    DF_WOODEN_BARRICADE_BURN,

    DF_SURROUND_WOODEN_BARRICADE,

    DF_SPREADABLE_WATER,
    DF_SHALLOW_WATER,
    DF_WATER_SPREADS,
    DF_SPREADABLE_WATER_POOL,
    DF_SPREADABLE_DEEP_WATER_POOL,

    DF_SPREADABLE_COLLAPSE,
    DF_COLLAPSE,
    DF_COLLAPSE_SPREADS,
    DF_ADD_MACHINE_COLLAPSE_EDGE_DORMANT,

    DF_BRIDGE_ACTIVATE,
    DF_BRIDGE_ACTIVATE_ANNOUNCE,
    DF_BRIDGE_APPEARS,
    DF_ADD_DORMANT_CHASM_HALO,

    DF_LAVA_RETRACTABLE,
    DF_RETRACTING_LAVA,
    DF_OBSIDIAN_WITH_STEAM,

    DF_SHOW_POISON_GAS_VENT,
    DF_POISON_GAS_VENT_OPEN,
    DF_ACTIVATE_PORTCULLIS,
    DF_OPEN_PORTCULLIS,
    DF_VENT_SPEW_POISON_GAS,

    DF_SHOW_METHANE_VENT,
    DF_METHANE_VENT_OPEN,
    DF_VENT_SPEW_METHANE,
    DF_PILOT_LIGHT,

    DF_DISCOVER_PARALYSIS_VENT,
    DF_PARALYSIS_VENT_SPEW,
    DF_REVEAL_PARALYSIS_VENT_SILENTLY,

    DF_AMBIENT_BLOOD,

    DF_CRACKING_STATUE,
    DF_STATUE_SHATTER,

    DF_TURRET_EMERGE,

    DF_WORM_TUNNEL_MARKER_DORMANT,
    DF_WORM_TUNNEL_MARKER_ACTIVE,
    DF_GRANITE_CRUMBLES,
    DF_WALL_OPEN,

    DF_DARKENING_FLOOR,
    DF_DARK_FLOOR,
    DF_HAUNTED_TORCH_TRANSITION,
    DF_HAUNTED_TORCH,

    DF_MUD_DORMANT,
    DF_MUD_ACTIVATE,

    DF_ELECTRIC_CRYSTAL_ON,
    DF_TURRET_LEVER,

    DF_SHALLOW_WATER_POOL,
    DF_DEEP_WATER_POOL,

    DF_SWAMP_WATER,
    DF_SWAMP,
    DF_SWAMP_MUD,

    DF_HAY,
    DF_JUNK,

    DF_REMNANT,
    DF_REMNANT_ASH,

    DF_CHASM_HOLE,
    DF_CATWALK_BRIDGE,

    DF_LAKE_CELL,
    DF_LAKE_HALO,

    DF_WALL_SHATTER,

    DF_MONSTER_CAGE_OPENS,

    DF_STENCH_BURN,
    DF_STENCH_SMOLDER,

    NUMBER_DUNGEON_FEATURES,
}

// =============================================================================
// Dungeon profile types
// =============================================================================

export enum DungeonProfileType {
    DP_BASIC,
    DP_BASIC_FIRST_ROOM,
    DP_GOBLIN_WARREN,
    DP_SENTINEL_SANCTUARY,
    NUMBER_DUNGEON_PROFILES,
}

// =============================================================================
// Bolt effects
// =============================================================================

export enum BoltEffect {
    BE_NONE,
    BE_ATTACK,
    BE_TELEPORT,
    BE_SLOW,
    BE_POLYMORPH,
    BE_NEGATION,
    BE_DOMINATION,
    BE_BECKONING,
    BE_PLENTY,
    BE_INVISIBILITY,
    BE_EMPOWERMENT,
    BE_DAMAGE,
    BE_POISON,
    BE_TUNNELING,
    BE_BLINKING,
    BE_ENTRANCEMENT,
    BE_OBSTRUCTION,
    BE_DISCORD,
    BE_CONJURATION,
    BE_HEALING,
    BE_HASTE,
    BE_SHIELDING,
}

// =============================================================================
// Bolt flags (bitfield)
// =============================================================================

export const BF_PASSES_THRU_CREATURES        = Fl(0);
export const BF_HALTS_BEFORE_OBSTRUCTION     = Fl(1);
export const BF_TARGET_ALLIES                = Fl(2);
export const BF_TARGET_ENEMIES               = Fl(3);
export const BF_FIERY                        = Fl(4);
// Fl(5) unused
export const BF_NEVER_REFLECTS               = Fl(6);
export const BF_NOT_LEARNABLE                = Fl(7);
export const BF_NOT_NEGATABLE                = Fl(8);
export const BF_ELECTRIC                     = Fl(9);
export const BF_DISPLAY_CHAR_ALONG_LENGTH    = Fl(10);

// =============================================================================
// Creature states
// =============================================================================

export enum CreatureState {
    MONSTER_SLEEPING,
    MONSTER_TRACKING_SCENT,
    MONSTER_WANDERING,
    MONSTER_FLEEING,
    MONSTER_ALLY,
}

// =============================================================================
// Creature modes
// =============================================================================

export enum CreatureMode {
    MODE_NORMAL,
    MODE_PERM_FLEEING,
}

// =============================================================================
// NG Commands (new game menu)
// =============================================================================

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

// =============================================================================
// Feat types
// =============================================================================

export enum FeatType {
    FEAT_PURE_MAGE = 0,
    FEAT_PURE_WARRIOR,
    FEAT_COMPANION,
    FEAT_SPECIALIST,
    FEAT_JELLYMANCER,
    FEAT_DRAGONSLAYER,
    FEAT_PALADIN,
    FEAT_TONE,
}

// =============================================================================
// Exit status
// =============================================================================

export enum ExitStatus {
    EXIT_STATUS_SUCCESS,
    EXIT_STATUS_FAILURE_RECORDING_WRONG_VERSION,
    EXIT_STATUS_FAILURE_RECORDING_OOS,
    EXIT_STATUS_FAILURE_PLATFORM_ERROR,
}

// =============================================================================
// Game mode
// =============================================================================

export enum GameMode {
    GAME_MODE_NORMAL,
    GAME_MODE_WIZARD,
    GAME_MODE_EASY,
}

// =============================================================================
// Machine feature flags (bitfield)
// =============================================================================

export const MF_GENERATE_ITEM                = Fl(0);
export const MF_OUTSOURCE_ITEM_TO_MACHINE    = Fl(1);
export const MF_BUILD_VESTIBULE              = Fl(2);
export const MF_ADOPT_ITEM                   = Fl(3);
export const MF_NO_THROWING_WEAPONS          = Fl(4);
export const MF_GENERATE_HORDE               = Fl(5);
export const MF_BUILD_AT_ORIGIN              = Fl(6);
// Fl(7) unused
export const MF_PERMIT_BLOCKING              = Fl(8);
export const MF_TREAT_AS_BLOCKING            = Fl(9);
export const MF_NEAR_ORIGIN                  = Fl(10);
export const MF_FAR_FROM_ORIGIN              = Fl(11);
export const MF_MONSTER_TAKE_ITEM            = Fl(12);
export const MF_MONSTER_SLEEPING             = Fl(13);
export const MF_MONSTER_FLEEING              = Fl(14);
export const MF_EVERYWHERE                   = Fl(15);
export const MF_ALTERNATIVE                  = Fl(16);
export const MF_ALTERNATIVE_2                = Fl(17);
export const MF_REQUIRE_GOOD_RUNIC           = Fl(18);
export const MF_MONSTERS_DORMANT             = Fl(19);
export const MF_REQUIRE_HEAVY_WEAPON         = Fl(20);
export const MF_BUILD_IN_WALLS               = Fl(21);
export const MF_BUILD_ANYWHERE_ON_LEVEL      = Fl(22);
export const MF_REPEAT_UNTIL_NO_PROGRESS     = Fl(23);
export const MF_IMPREGNABLE                  = Fl(24);
export const MF_IN_VIEW_OF_ORIGIN            = Fl(25);
export const MF_IN_PASSABLE_VIEW_OF_ORIGIN   = Fl(26);
export const MF_NOT_IN_HALLWAY               = Fl(27);
export const MF_NOT_ON_LEVEL_PERIMETER       = Fl(28);
export const MF_SKELETON_KEY                 = Fl(29);
export const MF_KEY_DISPOSABLE               = Fl(30);

// =============================================================================
// Blueprint flags (bitfield)
// =============================================================================

export const BP_ADOPT_ITEM                   = Fl(0);
export const BP_VESTIBULE                    = Fl(1);
export const BP_PURGE_PATHING_BLOCKERS       = Fl(2);
export const BP_PURGE_INTERIOR               = Fl(3);
export const BP_PURGE_LIQUIDS                = Fl(4);
export const BP_SURROUND_WITH_WALLS          = Fl(5);
export const BP_IMPREGNABLE                  = Fl(6);
export const BP_REWARD                       = Fl(7);
export const BP_OPEN_INTERIOR                = Fl(8);
export const BP_MAXIMIZE_INTERIOR            = Fl(9);
export const BP_ROOM                         = Fl(10);
export const BP_TREAT_AS_BLOCKING            = Fl(11);
export const BP_REQUIRE_BLOCKING             = Fl(12);
export const BP_NO_INTERIOR_FLAG             = Fl(13);
export const BP_REDESIGN_INTERIOR            = Fl(14);

// =============================================================================
// Machine types
// =============================================================================

export enum MachineType {
    // Reward rooms
    MT_REWARD_MULTI_LIBRARY = 1,
    MT_REWARD_MONO_LIBRARY,
    MT_REWARD_CONSUMABLES,
    MT_REWARD_PEDESTALS_PERMANENT,
    MT_REWARD_PEDESTALS_CONSUMABLE,
    MT_REWARD_COMMUTATION_ALTARS,
    MT_REWARD_RESURRECTION_ALTAR,
    MT_REWARD_ADOPTED_ITEM,
    MT_REWARD_DUNGEON,
    MT_REWARD_KENNEL,
    MT_REWARD_VAMPIRE_LAIR,
    MT_REWARD_ASTRAL_PORTAL,
    MT_REWARD_GOBLIN_WARREN,
    MT_REWARD_SENTINEL_SANCTUARY,

    // Amulet holder
    MT_AMULET_AREA,

    // Door guard machines
    MT_LOCKED_DOOR_VESTIBULE,
    MT_SECRET_DOOR_VESTIBULE,
    MT_SECRET_LEVER_VESTIBULE,
    MT_FLAMMABLE_BARRICADE_VESTIBULE,
    MT_STATUE_SHATTERING_VESTIBULE,
    MT_STATUE_MONSTER_VESTIBULE,
    MT_THROWING_TUTORIAL_VESTIBULE,
    MT_PIT_TRAPS_VESTIBULE,
    MT_BECKONING_OBSTACLE_VESTIBULE,
    MT_GUARDIAN_VESTIBULE,

    // Key guard machines
    MT_KEY_REWARD_LIBRARY,
    MT_KEY_SECRET_ROOM,
    MT_KEY_THROWING_TUTORIAL_AREA,
    MT_KEY_RAT_TRAP_ROOM,
    MT_KEY_FIRE_TRANSPORTATION_ROOM,
    MT_KEY_FLOOD_TRAP_ROOM,
    MT_KEY_FIRE_TRAP_ROOM,
    MT_KEY_THIEF_AREA,
    MT_KEY_COLLAPSING_FLOOR_AREA,
    MT_KEY_PIT_TRAP_ROOM,
    MT_KEY_LEVITATION_ROOM,
    MT_KEY_WEB_CLIMBING_ROOM,
    MT_KEY_LAVA_MOAT_ROOM,
    MT_KEY_LAVA_MOAT_AREA,
    MT_KEY_POISON_GAS_TRAP_ROOM,
    MT_KEY_EXPLOSIVE_TRAP_ROOM,
    MT_KEY_BURNING_TRAP_ROOM,
    MT_KEY_STATUARY_TRAP_AREA,
    MT_KEY_GUARDIAN_WATER_PUZZLE_ROOM,
    MT_KEY_GUARDIAN_GAUNTLET_ROOM,
    MT_KEY_GUARDIAN_CORRIDOR_ROOM,
    MT_KEY_SACRIFICE_ROOM,
    MT_KEY_SUMMONING_CIRCLE_ROOM,
    MT_KEY_BECKONING_OBSTACLE_ROOM,
    MT_KEY_WORM_TRAP_AREA,
    MT_KEY_MUD_TRAP_ROOM,
    MT_KEY_ELECTRIC_CRYSTALS_ROOM,
    MT_KEY_ZOMBIE_TRAP_ROOM,
    MT_KEY_PHANTOM_TRAP_ROOM,
    MT_KEY_WORM_TUNNEL_ROOM,
    MT_KEY_TURRET_TRAP_ROOM,
    MT_KEY_BOSS_ROOM,

    // Thematic machines
    MT_BLOODFLOWER_AREA,
    MT_SHRINE_AREA,
    MT_IDYLL_AREA,
    MT_SWAMP_AREA,
    MT_CAMP_AREA,
    MT_REMNANT_AREA,
    MT_DISMAL_AREA,
    MT_BRIDGE_TURRET_AREA,
    MT_LAKE_PATH_TURRET_AREA,
    MT_PARALYSIS_TRAP_AREA,
    MT_PARALYSIS_TRAP_HIDDEN_AREA,
    MT_TRICK_STATUE_AREA,
    MT_WORM_AREA,
    MT_SENTINEL_AREA,

    // Variant-specific machines
    MT_REWARD_HEAVY_OR_RUNIC_WEAPON,
}

// =============================================================================
// Button draw states
// =============================================================================

export enum ButtonDrawState {
    BUTTON_NORMAL = 0,
    BUTTON_HOVER,
    BUTTON_PRESSED,
}

// =============================================================================
// Button flags (bitfield)
// =============================================================================

export const B_DRAW                  = Fl(0);
export const B_ENABLED               = Fl(1);
export const B_GRADIENT              = Fl(2);
export const B_HOVER_ENABLED         = Fl(3);
export const B_WIDE_CLICK_AREA       = Fl(4);
export const B_KEYPRESS_HIGHLIGHT    = Fl(5);

// =============================================================================
// Message flags (bitfield)
// =============================================================================

export const REQUIRE_ACKNOWLEDGMENT  = Fl(0);
export const REFRESH_SIDEBAR         = Fl(1);
export const FOLDABLE                = Fl(2);

// =============================================================================
// Auto-target mode
// =============================================================================

export enum AutoTargetMode {
    AUTOTARGET_MODE_NONE,
    AUTOTARGET_MODE_USE_STAFF_OR_WAND,
    AUTOTARGET_MODE_THROW,
    AUTOTARGET_MODE_EXPLORE,
}
