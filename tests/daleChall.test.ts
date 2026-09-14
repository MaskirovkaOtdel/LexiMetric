import { describe, it, expect } from 'vitest';
import { DALE_CHALL_SET, isDaleChallFamiliar } from '../src/core/daleChallWords.js';

describe('Dale-Chall Familiar Words', () => {
  it('exports a comprehensive word set with approximately 3000 words', () => {
    expect(DALE_CHALL_SET.size).toBeGreaterThan(2800);
    expect(DALE_CHALL_SET.size).toBeLessThan(3500);
  });

  it('recognizes basic familiar root words', () => {
    expect(isDaleChallFamiliar('apple')).toBe(true);
    expect(isDaleChallFamiliar('banana')).toBe(true);
    expect(isDaleChallFamiliar('elephant')).toBe(true);
    expect(isDaleChallFamiliar('yesterday')).toBe(true);
    expect(isDaleChallFamiliar('family')).toBe(true);
    expect(isDaleChallFamiliar('hospital')).toBe(true);
    expect(isDaleChallFamiliar('understand')).toBe(true);
  });

  it('recognizes difficult/unfamiliar words', () => {
    expect(isDaleChallFamiliar('algorithm')).toBe(false);
    expect(isDaleChallFamiliar('epistemology')).toBe(false);
    expect(isDaleChallFamiliar('quantum')).toBe(false);
    expect(isDaleChallFamiliar('jurisprudence')).toBe(false);
    expect(isDaleChallFamiliar('phenomenological')).toBe(false);
  });

  it('supports case-insensitivity', () => {
    expect(isDaleChallFamiliar('Apple')).toBe(true);
    expect(isDaleChallFamiliar('HOSPITAL')).toBe(true);
    expect(isDaleChallFamiliar('yEsTeRdAy')).toBe(true);
  });

  it('handles regular inflections (plurals, past tense, progressive, adverbs)', () => {
    // Plurals (-s, -es, -ies)
    expect(isDaleChallFamiliar('bananas')).toBe(true);
    expect(isDaleChallFamiliar('boxes')).toBe(true);
    expect(isDaleChallFamiliar('cherries')).toBe(true);

    // Past tense (-ed, -ied, doubled consonant)
    expect(isDaleChallFamiliar('walked')).toBe(true);
    expect(isDaleChallFamiliar('cried')).toBe(true);
    expect(isDaleChallFamiliar('stopped')).toBe(true);

    // Progressive (-ing, doubled consonant)
    expect(isDaleChallFamiliar('running')).toBe(true);
    expect(isDaleChallFamiliar('baking')).toBe(true);
    expect(isDaleChallFamiliar('swimming')).toBe(true);

    // Adverbs (-ly, -ily)
    expect(isDaleChallFamiliar('quickly')).toBe(true);
    expect(isDaleChallFamiliar('happily')).toBe(true);
  });
});
