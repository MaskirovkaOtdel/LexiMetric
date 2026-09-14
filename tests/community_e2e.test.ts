import { describe, it, expect } from 'vitest';
import { countSyllables } from '../src/core/syllables.js';
import { calculateReadability } from '../src/core/readability.js';
import { isDaleChallFamiliar, DALE_CHALL_SET } from '../src/core/daleChallWords.js';
import { profileText } from '../src/core/linguistics.js';
import { calculateReadTime } from '../src/core/readTime.js';

describe('Community Edition End-to-End Test Suite (R1 & R2)', () => {

  describe('R1: Deepened Algorithmic Linguistic Profiling', () => {

    it('R1.1: accurately counts syllables across irregular suffixes and compound decompositions', () => {
      // Compound words
      expect(countSyllables('firefly')).toBe(2);
      expect(countSyllables('barefoot')).toBe(2);
      expect(countSyllables('whiteboard')).toBe(2);
      expect(countSyllables('watermelon')).toBe(4);
      expect(countSyllables('grapefruit')).toBe(2);

      // Irregular suffixes
      expect(countSyllables('safely')).toBe(2);
      expect(countSyllables('management')).toBe(3);
      expect(countSyllables('completely')).toBe(3);
      expect(countSyllables('definitely')).toBe(4);
      expect(countSyllables('hopeless')).toBe(2);
      expect(countSyllables('statewide')).toBe(2);
    });

    it('R1.2: verifies Dale-Chall 3,000 familiar word list and morphological stemmer', () => {
      expect(DALE_CHALL_SET.size).toBeGreaterThanOrEqual(2900);

      // Root words
      expect(isDaleChallFamiliar('apple')).toBe(true);
      expect(isDaleChallFamiliar('water')).toBe(true);
      expect(isDaleChallFamiliar('school')).toBe(true);

      // Inflections
      expect(isDaleChallFamiliar('apples')).toBe(true);
      expect(isDaleChallFamiliar('watered')).toBe(true);
      expect(isDaleChallFamiliar('watering')).toBe(true);
      expect(isDaleChallFamiliar('jumped')).toBe(true);
      expect(isDaleChallFamiliar('jumping')).toBe(true);
      expect(isDaleChallFamiliar('happier')).toBe(true);
      expect(isDaleChallFamiliar('happiest')).toBe(true);
      expect(isDaleChallFamiliar('quickly')).toBe(true);

      // Unfamiliar / technical terms
      expect(isDaleChallFamiliar('epistemology')).toBe(false);
      expect(isDaleChallFamiliar('phenomenological')).toBe(false);
      expect(isDaleChallFamiliar('jurisprudence')).toBe(false);
    });

    it('R1.3: computes 8 readability formulas and consensus grade', () => {
      const stats = {
        wordCount: 150,
        sentenceCount: 10,
        syllableCount: 220,
        polysyllableCount: 20,
        characterCountWithoutSpaces: 750,
        difficultWordsCount: 25
      };

      const readability = calculateReadability(stats);

      expect(readability.fleschReadingEase).toBeGreaterThan(0);
      expect(readability.fleschKincaidGrade).toBeGreaterThan(0);
      expect(readability.gunningFog).toBeGreaterThan(0);
      expect(readability.colemanLiauIndex).toBeGreaterThan(0);
      expect(readability.smogIndex).toBeGreaterThan(0);
      expect(readability.automatedReadabilityIndex).toBeGreaterThan(0);
      expect(readability.daleChallIndex).toBeGreaterThan(0);
      expect(readability.linsearWrite).toBeGreaterThan(0);
      expect(readability.consensusGrade).toBeDefined();
      expect(readability.consensusConfidence).toBeDefined();
    });

    it('R1.4: detects passive voice with agent clause and provides active voice rewrites', () => {
      const text = 'The new software release was approved by the engineering director yesterday.';
      const profile = profileText(text);

      const passiveSpan = profile.spans.find(s => s.type === 'passive');
      expect(passiveSpan).toBeDefined();
      expect(passiveSpan?.text).toBe('was approved by the engineering director');
      expect(passiveSpan?.fixReplacement).toBe('the engineering director approved');
    });

    it('R1.5: flags wordiness with character spans and concrete replacement alternatives', () => {
      const text = 'In order to optimize throughput, we must act at this point in time.';
      const profile = profileText(text);

      const wordySpans = profile.spans.filter(s => s.type === 'wordiness');
      expect(wordySpans.length).toBeGreaterThanOrEqual(2);

      const inOrderTo = wordySpans.find(s => s.text.toLowerCase().includes('in order to'));
      expect(inOrderTo).toBeDefined();
      // Capitalized since it is at the start of sentence
      expect(inOrderTo?.fixReplacement).toBe('To');

      const atThisPoint = wordySpans.find(s => s.text.toLowerCase().includes('at this point in time'));
      expect(atThisPoint).toBeDefined();
      expect(atThisPoint?.fixReplacement).toBe('now');
    });
  });

  describe('R2: Interactive Editorial Workflow & Visual Profiling', () => {

    it('R2.1: simulates one-click replacement fix application preserving manuscript integrity', () => {
      const original = 'We need this in order to proceed due to the fact that testing matters.';
      const profile = profileText(original);

      // Sort spans by start index descending to apply multiple without offset invalidation
      const sortedSpans = [...profile.spans].filter(s => !!s.fixReplacement).sort((a, b) => b.startIndex - a.startIndex);
      let updated = original;

      for (const span of sortedSpans) {
        updated = updated.slice(0, span.startIndex) + span.fixReplacement + updated.slice(span.endIndex);
      }

      expect(updated).not.toContain('in order to');
      expect(updated).not.toContain('due to the fact that');
      expect(updated).toContain('to proceed');
      expect(updated).toContain('because testing matters');
    });

    it('R2.2: computes paragraph-level sentence cadence for heatmap visualization', () => {
      const text = 'Short punchy lead. This is an average length second sentence with normal rhythm and balanced cadence structure. Finally, we conclude with an intentionally lengthened, highly descriptive, and remarkably thorough concluding observation that illustrates complex rhythm in a single paragraph right now today. Furthermore, to demonstrate run on detection we have constructed a deliberately stretched sentence containing more than thirty words that goes on and on without necessary syntactic pauses or terminal punctuation until the threshold is passed.';
      const profile = profileText(text);

      expect(profile.sentences.length).toBe(4);
      expect(profile.shortSentencesCount).toBeGreaterThanOrEqual(1);
      expect(profile.standardSentencesCount).toBeGreaterThanOrEqual(1);
      expect(profile.longSentencesCount).toBeGreaterThanOrEqual(1);
      expect(profile.runOnSentencesCount).toBeGreaterThanOrEqual(1);
    });

    it('R2.3: computes reading velocity and audio duration models accurately', () => {
      const readTime = calculateReadTime(1000, 1.4); // 1000 words, 1.4 avg syllables

      expect(readTime.silentReadingSeconds).toBeGreaterThan(0);
      expect(readTime.silentReadingFormatted).toBeDefined();
      expect(readTime.speakingSeconds).toBeGreaterThan(0);
      expect(readTime.speakingFormatted).toBeDefined();
      expect(readTime.presets.slowReader.wpm).toBeLessThan(readTime.presets.fastReader.wpm);
      expect(readTime.adjustedSilentWpm).toBeGreaterThan(100);
    });
  });
});
