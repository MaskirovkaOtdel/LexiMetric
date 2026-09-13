import { describe, it, expect } from 'vitest';
import { profileText } from '../src/core/linguistics.js';

describe('Linguistic Profiler', () => {
  it('profiles arbitrary text completely', () => {
    const text = 'The quick brown fox jumps over the lazy dog. It was an extraordinary day.';
    const profile = profileText(text);

    expect(profile.wordCount).toBe(14);
    expect(profile.sentenceCount).toBe(2);
    expect(profile.uniqueWordCount).toBeGreaterThan(10);
    expect(profile.syllableCount).toBeGreaterThan(15);
    expect(profile.readability.fleschReadingEase).toBeGreaterThan(50);
  });

  it('detects passive voice constructions', () => {
    const text = 'The manuscript was written by the lead author. A discovery was made yesterday.';
    const profile = profileText(text);

    const passiveSpans = profile.spans.filter(s => s.type === 'passive');
    expect(passiveSpans.length).toBeGreaterThanOrEqual(2);
    expect(passiveSpans.some(s => s.text.toLowerCase().includes('was written'))).toBe(true);
    expect(passiveSpans.some(s => s.text.toLowerCase().includes('was made'))).toBe(true);
  });

  it('detects wordiness and bloat phrases', () => {
    const text = 'In order to succeed, the team utilized advanced algorithms due to the fact that speed mattered.';
    const profile = profileText(text);

    const wordinessSpans = profile.spans.filter(s => s.type === 'wordiness');
    expect(wordinessSpans.length).toBeGreaterThanOrEqual(2);
    expect(wordinessSpans.some(s => s.text.toLowerCase().includes('in order to'))).toBe(true);
    expect(wordinessSpans.some(s => s.text.toLowerCase().includes('utilized'))).toBe(true);
  });

  it('identifies run-on sentences exceeding 30 words', () => {
    const longSentence = 'This is an exceedingly extended and verbose sentence that continues to unfold with clause after clause, describing unnecessary details and redundant observations until the cumulative word count eventually crosses the thirty word threshold without pausing.';
    const profile = profileText(longSentence);

    expect(profile.runOnSentencesCount).toBe(1);
    expect(profile.spans.some(s => s.type === 'run-on')).toBe(true);
  });
});
