// =============================================================================
// RNG -- exact port of BrogueCE's JSF (Jenkins Small Fast) RNG from Math.c
// =============================================================================

import { clamp } from "../shared/types.ts";
import type { RandomRange } from "../shared/types.ts";

// ---------------------------------------------------------------------------
// Internal JSF state
// ---------------------------------------------------------------------------

interface RanCtx {
    a: number; // uint32
    b: number; // uint32
    c: number; // uint32
    d: number; // uint32
}

/** Rotate left on 32-bit unsigned integer. */
function rot(x: number, k: number): number {
    return ((x << k) | (x >>> (32 - k))) >>> 0;
}

/**
 * Core JSF random value generator -- exact port of ranval().
 * All arithmetic forced to uint32 with `>>> 0`.
 */
function ranval(x: RanCtx): number {
    const e = (x.a - rot(x.b, 27)) >>> 0;
    x.a = (x.b ^ rot(x.c, 17)) >>> 0;
    x.b = (x.c + x.d) >>> 0;
    x.c = (x.d + e) >>> 0;
    x.d = (e + x.a) >>> 0;
    return x.d;
}

/**
 * Seed initialization -- exact port of raninit().
 * Accepts a 64-bit seed as a bigint and splits it across c and d.
 *
 * C original:
 *   x->a = 0xf1ea5eed;
 *   x->b = x->c = x->d = (u4)seed;
 *   x->c ^= (u4)(seed >> 32);
 *   for (i=0; i<20; ++i) ranval(x);
 */
function raninit(x: RanCtx, seed: bigint): void {
    const lo = Number(seed & 0xFFFFFFFFn) >>> 0;
    const hi = Number((seed >> 32n) & 0xFFFFFFFFn) >>> 0;

    x.a = 0xf1ea5eed >>> 0;
    x.b = lo;
    x.c = (lo ^ hi) >>> 0;
    x.d = lo;

    for (let i = 0; i < 20; i++) {
        ranval(x);
    }
}

/**
 * Unbiased random number in [0, n) -- exact port of range().
 * Uses rejection sampling to avoid modulo bias.
 *
 * C original:
 *   div = RAND_MAX_COMBO / n;
 *   do { r = ranval(&RNGState[RNG]) / div; } while (r >= n);
 */
function unbiasedRange(n: number, state: RanCtx): number {
    const RAND_MAX_COMBO = 0xFFFFFFFF;
    const div = Math.floor(RAND_MAX_COMBO / n);
    let r: number;
    do {
        r = Math.floor(ranval(state) / div);
    } while (r >= n);
    return r;
}

// ---------------------------------------------------------------------------
// Fixed-point helpers
// ---------------------------------------------------------------------------

const FP_BASE = 16;
const FP_FACTOR = 1 << FP_BASE; // 65536

/** Round a fixed-point number to the nearest integer (matching fp_round). */
export function fpRound(x: number): number {
    const div = Math.trunc(x / FP_FACTOR);
    const rem = x % FP_FACTOR;
    const sign = x >= 0 ? 1 : -1;

    if (rem >= FP_FACTOR / 2 || rem <= -(FP_FACTOR / 2)) {
        return div + sign;
    } else {
        return div;
    }
}

// ---------------------------------------------------------------------------
// RNG class
// ---------------------------------------------------------------------------

export const enum RNGType {
    RNG_SUBSTANTIVE = 0,
    RNG_COSMETIC = 1,
}

/**
 * Encapsulates BrogueCE's dual-RNG system.
 *
 * - `RNG_SUBSTANTIVE` is used for all game-logic randomness (must stay in sync
 *   for replays / seeded runs).
 * - `RNG_COSMETIC` is used for visual-only randomness (color dances, etc.)
 *   and may diverge without affecting gameplay.
 */
export class RNG {
    readonly seed: bigint;
    private states: [RanCtx, RanCtx];
    private currentRNG: RNGType = RNGType.RNG_SUBSTANTIVE;
    randomNumbersGenerated = 0;

    constructor(seed?: bigint) {
        if (seed === undefined || seed === 0n) {
            seed = BigInt(Date.now()) - 1352700000n;
        }
        this.seed = seed;
        this.states = [
            { a: 0, b: 0, c: 0, d: 0 },
            { a: 0, b: 0, c: 0, d: 0 },
        ];
        raninit(this.states[RNGType.RNG_SUBSTANTIVE], seed);
        raninit(this.states[RNGType.RNG_COSMETIC], seed);
    }

    /** Get the current RNG context. */
    private ctx(): RanCtx {
        return this.states[this.currentRNG];
    }

    /** Set which RNG to use. */
    setRNG(rng: RNGType): void {
        this.currentRNG = rng;
    }

    /** Get which RNG is currently active. */
    getRNG(): RNGType {
        return this.currentRNG;
    }

    /**
     * Switch to cosmetic RNG. Returns the previous RNG type so it can be
     * restored with `setRNG()`.
     */
    assureCosmeticRNG(): RNGType {
        const old = this.currentRNG;
        this.currentRNG = RNGType.RNG_COSMETIC;
        return old;
    }

    // -----------------------------------------------------------------
    // Core random number generation
    // -----------------------------------------------------------------

    /**
     * Return a uniformly distributed random integer in [lowerBound, upperBound] (inclusive).
     * Exact port of rand_range().
     */
    range(lowerBound: number, upperBound: number): number {
        if (upperBound <= lowerBound) {
            return lowerBound;
        }
        if (this.currentRNG === RNGType.RNG_SUBSTANTIVE) {
            this.randomNumbersGenerated++;
        }
        const interval = upperBound - lowerBound + 1;
        return lowerBound + unbiasedRange(interval, this.ctx());
    }

    /**
     * Return a 64-bit random value as a bigint.
     * Exact port of rand_64bits().
     */
    rand64(): bigint {
        if (this.currentRNG === RNGType.RNG_SUBSTANTIVE) {
            this.randomNumbersGenerated++;
        }
        const hi = BigInt(ranval(this.ctx()));
        const lo = BigInt(ranval(this.ctx()));
        return (hi << 32n) | lo;
    }

    // -----------------------------------------------------------------
    // Derived random helpers
    // -----------------------------------------------------------------

    /**
     * Clumped random range -- exact port of randClumpedRange().
     *
     * Rolls multiple dice to produce a distribution that clusters toward the
     * middle of [lowerBound, upperBound]. The clumpFactor controls how many
     * dice are rolled.
     *
     * C original:
     *   numSides = (upperBound - lowerBound) / clumpFactor;
     *   for (i=0; i < (upperBound - lowerBound) % clumpFactor; i++)
     *       total += rand_range(0, numSides + 1);
     *   for (; i < clumpFactor; i++)
     *       total += rand_range(0, numSides);
     *   return total + lowerBound;
     */
    clumpedRange(lowerBound: number, upperBound: number, clumpFactor: number): number {
        if (upperBound <= lowerBound) {
            return lowerBound;
        }
        if (clumpFactor <= 1) {
            return this.range(lowerBound, upperBound);
        }

        let total = 0;
        const spread = upperBound - lowerBound;
        const numSides = Math.floor(spread / clumpFactor);
        const remainder = spread % clumpFactor;

        let i = 0;
        for (; i < remainder; i++) {
            total += this.range(0, numSides + 1);
        }
        for (; i < clumpFactor; i++) {
            total += this.range(0, numSides);
        }

        return total + lowerBound;
    }

    /** Convenience: roll from a RandomRange struct. Exact port of randClump(). */
    randClump(theRange: RandomRange): number {
        return this.clumpedRange(
            theRange.lowerBound,
            theRange.upperBound,
            theRange.clumpFactor,
        );
    }

    /**
     * Test a random roll against a percentage chance (0-100).
     * Returns true if the roll succeeds.
     * Exact port of rand_percent().
     */
    percent(probability: number): boolean {
        return this.range(0, 99) < clamp(probability, 0, 100);
    }

    /**
     * Fisher-Yates shuffle -- exact port of shuffleList().
     * Shuffles the array in place.
     *
     * C original iterates i from 0 to listLength-2, swapping list[i] with
     * list[rand_range(i, listLength-1)].
     */
    shuffle<T>(list: T[]): void {
        for (let i = 0; i < list.length - 1; i++) {
            const r = this.range(i, list.length - 1);
            if (i !== r) {
                const buf = list[r]!;
                list[r] = list[i]!;
                list[i] = buf;
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Standalone utility (no RNG state needed)
// ---------------------------------------------------------------------------

/** Fill an array with sequential integers 0..listLength-1. Exact port of fillSequentialList(). */
export function fillSequentialList(list: number[], listLength: number): void {
    for (let i = 0; i < listLength; i++) {
        list[i] = i;
    }
}
