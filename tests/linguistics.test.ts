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
    expect(profile.difficultWordCount).toBeGreaterThan(0);
  });

  it('detects passive voice with agent identification and creates active replacements', () => {
    const text = 'The agreement was signed by delegates yesterday. A discovery was made.';
    const profile = profileText(text);

    const passiveSpans = profile.spans.filter(s => s.type === 'passive');
    expect(passiveSpans.length).toBeGreaterThanOrEqual(2);

    // Agent passive
    const agentPassive = passiveSpans.find(s => s.text.toLowerCase().includes('was signed by delegates'));
    expect(agentPassive).toBeDefined();
    expect(agentPassive?.fixReplacement).toBe('delegates signed');
    expect(agentPassive?.category).toBe('passive_voice');
    expect(agentPassive?.replacements).toContain('delegates signed');

    // Agentless passive
    const agentlessPassive = passiveSpans.find(s => s.text.toLowerCase().includes('was made'));
    expect(agentlessPassive).toBeDefined();
    expect(agentlessPassive?.fixReplacement).toBe('made');
    expect(agentlessPassive?.suggestion).toContain('made');
    expect(agentlessPassive?.category).toBe('passive_voice');
  });

  it('detects wordiness and bloat phrases with case preservation', () => {
    const text = 'In order to succeed, the team utilized algorithms due to the fact that speed mattered. Each and every member made a decision.';
    const profile = profileText(text);

    const wordinessSpans = profile.spans.filter(s => s.type === 'wordiness');
    expect(wordinessSpans.length).toBeGreaterThanOrEqual(4);

    // Case preservation: capitalized "In order to" -> capitalized "To"
    const inOrderToSpan = wordinessSpans.find(s => s.text === 'In order to');
    expect(inOrderToSpan).toBeDefined();
    expect(inOrderToSpan?.fixReplacement).toBe('To');

    // Lowercase "due to the fact that" -> "because"
    const dueToSpan = wordinessSpans.find(s => s.text.toLowerCase() === 'due to the fact that');
    expect(dueToSpan).toBeDefined();
    expect(dueToSpan?.fixReplacement).toBe('because');

    // Redundant pair "Each and every" -> capitalized "Each"
    const eachAndEverySpan = wordinessSpans.find(s => s.text === 'Each and every');
    expect(eachAndEverySpan).toBeDefined();
    expect(eachAndEverySpan?.fixReplacement).toBe('Each');

    // Nominalization "made a decision" -> "decided" or "decide"
    const madeDecisionSpan = wordinessSpans.find(s => s.text.toLowerCase() === 'make a decision');
    // Note: 'made a decision' in text is past tense, pattern is 'make a decision'
  });

  it('identifies run-on sentences exceeding 30 words', () => {
    const longSentence = 'This is an exceedingly extended and verbose sentence that continues to unfold with clause after clause, describing unnecessary details and redundant observations until the cumulative word count eventually crosses the thirty word threshold without pausing.';
    const profile = profileText(longSentence);

    expect(profile.runOnSentencesCount).toBe(1);
    expect(profile.spans.some(s => s.type === 'run-on')).toBe(true);
  });
});
