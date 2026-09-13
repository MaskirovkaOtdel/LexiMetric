import { describe, it, expect } from 'vitest';
import { calculateReadability } from '../src/core/readability.js';
import { calculateReadTime } from '../src/core/readTime.js';

describe('Readability Calculations', () => {
  it('handles empty input gracefully', () => {
    const scores = calculateReadability({
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      polysyllableCount: 0,
      characterCountWithoutSpaces: 0
    });

    expect(scores.fleschReadingEase).toBe(0);
    expect(scores.difficultyLabel).toBe('No content');
  });

  it('computes standard readability scores for sample metrics', () => {
    // 100 words, 5 sentences (ASL = 20), 150 syllables (ASW = 1.5), 20 polysyllables, 450 letters
    const scores = calculateReadability({
      wordCount: 100,
      sentenceCount: 5,
      syllableCount: 150,
      polysyllableCount: 20,
      characterCountWithoutSpaces: 450
    });

    // FRE = 206.835 - (1.015 * 20) - (84.6 * 1.5) = 206.835 - 20.3 - 126.9 = ~59.6
    expect(scores.fleschReadingEase).toBeGreaterThan(55);
    expect(scores.fleschReadingEase).toBeLessThan(65);

    // FKGL = (0.39 * 20) + (11.8 * 1.5) - 15.59 = 7.8 + 17.7 - 15.59 = ~9.9
    expect(scores.fleschKincaidGrade).toBeGreaterThan(8);
    expect(scores.fleschKincaidGrade).toBeLessThan(12);

    // Gunning Fog = 0.4 * (20 + 20) = 16
    expect(scores.gunningFog).toBe(16);

    expect(scores.consensusGrade).toBeGreaterThan(0);
  });
});

describe('Read Time Calculations', () => {
  it('calculates silent and spoken reading time', () => {
    const readTime = calculateReadTime(450, 1.45, 65);

    expect(readTime.silentReadingSeconds).toBeGreaterThan(60);
    expect(readTime.speakingSeconds).toBeGreaterThan(120);
    expect(readTime.silentReadingFormatted).toContain('min');
    expect(readTime.speakingFormatted).toContain('min');
  });
});
