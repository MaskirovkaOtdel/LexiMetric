import { describe, it, expect } from 'vitest';
import { countSyllables } from '../src/core/syllables.js';

describe('Syllable Counter', () => {
  it('handles monosyllabic words accurately', () => {
    expect(countSyllables('the')).toBe(1);
    expect(countSyllables('quick')).toBe(1);
    expect(countSyllables('brown')).toBe(1);
    expect(countSyllables('fox')).toBe(1);
    expect(countSyllables('dog')).toBe(1);
    expect(countSyllables('make')).toBe(1);
    expect(countSyllables('late')).toBe(1);
    expect(countSyllables('jumped')).toBe(1);
  });

  it('handles regular polysyllabic words', () => {
    expect(countSyllables('hello')).toBe(2);
    expect(countSyllables('water')).toBe(2);
    expect(countSyllables('table')).toBe(2);
    expect(countSyllables('bottle')).toBe(2);
    expect(countSyllables('wanted')).toBe(2);
    expect(countSyllables('computer')).toBe(3);
    expect(countSyllables('algorithm')).toBe(4);
    expect(countSyllables('editorial')).toBe(5);
    expect(countSyllables('communication')).toBe(5);
  });

  it('handles irregular and borrowed words', () => {
    expect(countSyllables('recipe')).toBe(3);
    expect(countSyllables('simile')).toBe(3);
    expect(countSyllables('hyperbole')).toBe(4);
    expect(countSyllables('business')).toBe(2);
    expect(countSyllables('wednesday')).toBe(2);
    expect(countSyllables('rhythm')).toBe(2);
    expect(countSyllables('queue')).toBe(1);
    expect(countSyllables('element')).toBe(3);
  });

  it('handles irregular suffixes without internal silent e overcounting', () => {
    // -ely
    expect(countSyllables('safely')).toBe(2);
    expect(countSyllables('nicely')).toBe(2);
    // -ment
    expect(countSyllables('management')).toBe(3);
    expect(countSyllables('movement')).toBe(2);
    expect(countSyllables('statement')).toBe(2);
    // -ness
    expect(countSyllables('likeness')).toBe(2);
    expect(countSyllables('closeness')).toBe(2);
    // -ful
    expect(countSyllables('peaceful')).toBe(2);
    expect(countSyllables('careful')).toBe(2);
    expect(countSyllables('hopeful')).toBe(2);
    // -less
    expect(countSyllables('timeless')).toBe(2);
    expect(countSyllables('hopeless')).toBe(2);
    // -like
    expect(countSyllables('lifelike')).toBe(2);
    // -wide
    expect(countSyllables('statewide')).toBe(2);
    // -time
    expect(countSyllables('peacetime')).toBe(2);
    // -side
    expect(countSyllables('roadside')).toBe(2);
    expect(countSyllables('lakeside')).toBe(2);
    // -ized
    expect(countSyllables('customized')).toBe(3);
  });

  it('handles closed compound word decomposition accurately', () => {
    expect(countSyllables('firefly')).toBe(2);
    expect(countSyllables('barefoot')).toBe(2);
    expect(countSyllables('somewhere')).toBe(2);
    expect(countSyllables('grapefruit')).toBe(2);
    expect(countSyllables('whiteboard')).toBe(2);
    expect(countSyllables('timepiece')).toBe(2);
    expect(countSyllables('wastebasket')).toBe(3);
    expect(countSyllables('safeguard')).toBe(2);
  });

  it('handles empty and edge-case tokens', () => {
    expect(countSyllables('')).toBe(0);
    expect(countSyllables('   ')).toBe(0);
    expect(countSyllables('---')).toBe(0);
    expect(countSyllables('a')).toBe(1);
    expect(countSyllables('I')).toBe(1);
  });
});
