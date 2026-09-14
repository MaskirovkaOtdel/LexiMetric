import { describe, it, expect } from 'vitest';
import { countSyllables } from '../src/core/syllables.js';
import { isDaleChallFamiliar, DALE_CHALL_SET } from '../src/core/daleChallWords.js';
import { calculateReadability } from '../src/core/readability.js';
import { profileText } from '../src/core/linguistics.js';

describe('Adversarial Challenge M1: Phonetic Syllable Counter', () => {
  describe('Mandatory Compound Words', () => {
    const compoundCases: [string, number][] = [
      ['barefoot', 2],
      ['firefly', 2],
      ['somewhere', 2],
      ['grapefruit', 2],
      ['whiteboard', 2],
      ['safeguard', 2],
      ['watermelon', 4],
      ['daydream', 2],
      ['bookkeeper', 3],
      ['horseback', 2],
    ];

    for (const [word, expected] of compoundCases) {
      it(`accurately counts syllables for compound word: "${word}" -> ${expected}`, () => {
        expect(countSyllables(word)).toBe(expected);
      });
    }

    it('handles capitalization and surrounding whitespace on compound words', () => {
      expect(countSyllables('  BAREFOOT  ')).toBe(2);
      expect(countSyllables('FireFly')).toBe(2);
      expect(countSyllables('waTeRmeLon')).toBe(4);
      expect(countSyllables('BOOKKEEPER')).toBe(3);
    });

    it('handles expanded compound vocabulary', () => {
      expect(countSyllables('caregiver')).toBe(3);
      expect(countSyllables('wastebasket')).toBe(3);
      expect(countSyllables('timepiece')).toBe(2);
      expect(countSyllables('lakeshore')).toBe(2);
      expect(countSyllables('crossroad')).toBe(2);
      expect(countSyllables('bluebird')).toBe(2);
      expect(countSyllables('pipeline')).toBe(2);
      expect(countSyllables('homesick')).toBe(2);
      expect(countSyllables('spacewalk')).toBe(2);
      expect(countSyllables('blackboard')).toBe(2);
      expect(countSyllables('widespread')).toBe(2);
    });
  });

  describe('Mandatory Suffix Contractions', () => {
    const suffixCases: [string, number][] = [
      ['safely', 2],
      ['management', 3],
      ['likeness', 2],
      ['hopeful', 2],
      ['hopeless', 2],
      ['lifelike', 2],
      ['statewide', 2],
      ['peacetime', 2],
      ['roadside', 2],
      ['organized', 3],
    ];

    for (const [word, expected] of suffixCases) {
      it(`accurately counts syllables for suffix contraction: "${word}" -> ${expected}`, () => {
        expect(countSyllables(word)).toBe(expected);
      });
    }

    it('handles expanded irregular suffix patterns', () => {
      // -ely
      expect(countSyllables('nicely')).toBe(2);
      expect(countSyllables('lately')).toBe(2);
      expect(countSyllables('bravely')).toBe(2);
      expect(countSyllables('extremely')).toBe(3);
      // -ment
      expect(countSyllables('movement')).toBe(2);
      expect(countSyllables('statement')).toBe(2);
      expect(countSyllables('advancement')).toBe(3);
      // -ness
      expect(countSyllables('closeness')).toBe(2);
      expect(countSyllables('politeness')).toBe(3);
      // -ful
      expect(countSyllables('peaceful')).toBe(2);
      expect(countSyllables('tasteful')).toBe(2);
      expect(countSyllables('shameful')).toBe(2);
      // -less
      expect(countSyllables('nameless')).toBe(2);
      expect(countSyllables('priceless')).toBe(2);
      expect(countSyllables('shapeless')).toBe(2);
      // -like
      expect(countSyllables('warlike')).toBe(2);
      // -wide
      expect(countSyllables('nationwide')).toBe(3);
      expect(countSyllables('countrywide')).toBe(3);
      // -time
      expect(countSyllables('lifetime')).toBe(2);
      expect(countSyllables('daytime')).toBe(2);
      expect(countSyllables('bedtime')).toBe(2);
      // -side
      expect(countSyllables('bedside')).toBe(2);
      expect(countSyllables('inside')).toBe(2);
      expect(countSyllables('outside')).toBe(2);
      // -ized
      expect(countSyllables('customized')).toBe(3);
      expect(countSyllables('capitalized')).toBe(4);
      expect(countSyllables('specialized')).toBe(3);
      expect(countSyllables('sized')).toBe(1);
    });
  });
});

describe('Adversarial Challenge M1: Dale-Chall Vocabulary Lookup', () => {
  describe('Plural Variations (-s, -es, -ies)', () => {
    it('matches regular plurals formed with -s', () => {
      expect(isDaleChallFamiliar('apples')).toBe(true);
      expect(isDaleChallFamiliar('bananas')).toBe(true);
      expect(isDaleChallFamiliar('elephants')).toBe(true);
      expect(isDaleChallFamiliar('monkeys')).toBe(true);
      expect(isDaleChallFamiliar('chairs')).toBe(true);
    });

    it('matches plurals ending in -es', () => {
      expect(isDaleChallFamiliar('boxes')).toBe(true);
      expect(isDaleChallFamiliar('dishes')).toBe(true);
      expect(isDaleChallFamiliar('churches')).toBe(true);
      expect(isDaleChallFamiliar('branches')).toBe(true);
      expect(isDaleChallFamiliar('foxes')).toBe(true);
      expect(isDaleChallFamiliar('buses')).toBe(true);
      expect(isDaleChallFamiliar('glasses')).toBe(true);
    });

    it('matches plurals ending in -ies from -y stems', () => {
      expect(isDaleChallFamiliar('cherries')).toBe(true);
      expect(isDaleChallFamiliar('berries')).toBe(true);
      expect(isDaleChallFamiliar('babies')).toBe(true);
      expect(isDaleChallFamiliar('cities')).toBe(true);
      expect(isDaleChallFamiliar('countries')).toBe(true);
      expect(isDaleChallFamiliar('stories')).toBe(true);
    });

    it('matches silent-e stems with -s', () => {
      expect(isDaleChallFamiliar('houses')).toBe(true);
      expect(isDaleChallFamiliar('horses')).toBe(true);
      expect(isDaleChallFamiliar('bridges')).toBe(true);
      expect(isDaleChallFamiliar('faces')).toBe(true);
    });

    it('matches regular possessives formed with apostrophe-s', () => {
      expect(isDaleChallFamiliar("dog's")).toBe(true);
      expect(isDaleChallFamiliar("mother's")).toBe(true);
      expect(isDaleChallFamiliar("boy's")).toBe(true);
      expect(isDaleChallFamiliar("children's")).toBe(true);
    });
  });

  describe('Past Tense Variations (-ed, -d, -ied, doubled consonants)', () => {
    it('matches regular past tense with -ed', () => {
      expect(isDaleChallFamiliar('walked')).toBe(true);
      expect(isDaleChallFamiliar('climbed')).toBe(true);
      expect(isDaleChallFamiliar('jumped')).toBe(true);
      expect(isDaleChallFamiliar('counted')).toBe(true);
      expect(isDaleChallFamiliar('passed')).toBe(true);
    });

    it('matches silent-e verbs with -d', () => {
      expect(isDaleChallFamiliar('baked')).toBe(true);
      expect(isDaleChallFamiliar('cared')).toBe(true);
      expect(isDaleChallFamiliar('closed')).toBe(true);
      expect(isDaleChallFamiliar('decided')).toBe(true);
      expect(isDaleChallFamiliar('danced')).toBe(true);
      expect(isDaleChallFamiliar('saved')).toBe(true);
    });

    it('matches -ied verbs from -y stems', () => {
      expect(isDaleChallFamiliar('cried')).toBe(true);
      expect(isDaleChallFamiliar('dried')).toBe(true);
      expect(isDaleChallFamiliar('hurried')).toBe(true);
      expect(isDaleChallFamiliar('buried')).toBe(true);
    });

    it('matches doubled consonant past tense verbs', () => {
      expect(isDaleChallFamiliar('stopped')).toBe(true);
      expect(isDaleChallFamiliar('dropped')).toBe(true);
      expect(isDaleChallFamiliar('planned')).toBe(true);
      expect(isDaleChallFamiliar('begged')).toBe(true);
      expect(isDaleChallFamiliar('clapped')).toBe(true);
      expect(isDaleChallFamiliar('stepped')).toBe(true);
    });
  });

  describe('Progressive Variations (-ing, -ying, silent-e drops, doubled consonants)', () => {
    it('matches regular -ing progressive forms', () => {
      expect(isDaleChallFamiliar('walking')).toBe(true);
      expect(isDaleChallFamiliar('jumping')).toBe(true);
      expect(isDaleChallFamiliar('counting')).toBe(true);
      expect(isDaleChallFamiliar('asking')).toBe(true);
    });

    it('matches silent-e drop with -ing', () => {
      expect(isDaleChallFamiliar('making')).toBe(true);
      expect(isDaleChallFamiliar('baking')).toBe(true);
      expect(isDaleChallFamiliar('caring')).toBe(true);
      expect(isDaleChallFamiliar('driving')).toBe(true);
      expect(isDaleChallFamiliar('writing')).toBe(true);
      expect(isDaleChallFamiliar('giving')).toBe(true);
      expect(isDaleChallFamiliar('closing')).toBe(true);
    });

    it('matches -ie to -ying progressive forms', () => {
      expect(isDaleChallFamiliar('lying')).toBe(true);
      expect(isDaleChallFamiliar('dying')).toBe(true);
      expect(isDaleChallFamiliar('tying')).toBe(true);
    });

    it('matches doubled consonant progressive forms', () => {
      expect(isDaleChallFamiliar('running')).toBe(true);
      expect(isDaleChallFamiliar('swimming')).toBe(true);
      expect(isDaleChallFamiliar('sitting')).toBe(true);
      expect(isDaleChallFamiliar('digging')).toBe(true);
      expect(isDaleChallFamiliar('cutting')).toBe(true);
      expect(isDaleChallFamiliar('dropping')).toBe(true);
    });
  });

  describe('Comparative and Superlative Variations (-er, -est, -ier, -iest)', () => {
    it('matches regular comparative -er', () => {
      expect(isDaleChallFamiliar('cooler')).toBe(true);
      expect(isDaleChallFamiliar('cleaner')).toBe(true);
      expect(isDaleChallFamiliar('sweeter')).toBe(true);
    });

    it('matches silent-e comparative -r', () => {
      expect(isDaleChallFamiliar('closer')).toBe(true);
      expect(isDaleChallFamiliar('wider')).toBe(true);
      expect(isDaleChallFamiliar('nicer')).toBe(true);
      expect(isDaleChallFamiliar('braver')).toBe(true);
      expect(isDaleChallFamiliar('cuter')).toBe(true);
    });

    it('matches -y to -ier comparative', () => {
      expect(isDaleChallFamiliar('happier')).toBe(true);
      expect(isDaleChallFamiliar('busier')).toBe(true);
      expect(isDaleChallFamiliar('heavier')).toBe(true);
      expect(isDaleChallFamiliar('easier')).toBe(true);
    });

    it('matches doubled consonant comparative -er', () => {
      expect(isDaleChallFamiliar('bigger')).toBe(true);
      expect(isDaleChallFamiliar('fatter')).toBe(true);
      expect(isDaleChallFamiliar('hotter')).toBe(true);
      expect(isDaleChallFamiliar('sadder')).toBe(true);
    });

    it('matches regular superlative -est', () => {
      expect(isDaleChallFamiliar('coolest')).toBe(true);
      expect(isDaleChallFamiliar('cleanest')).toBe(true);
      expect(isDaleChallFamiliar('sweetest')).toBe(true);
    });

    it('matches silent-e superlative -st', () => {
      expect(isDaleChallFamiliar('closest')).toBe(true);
      expect(isDaleChallFamiliar('widest')).toBe(true);
      expect(isDaleChallFamiliar('nicest')).toBe(true);
      expect(isDaleChallFamiliar('bravest')).toBe(true);
    });

    it('matches -y to -iest superlative', () => {
      expect(isDaleChallFamiliar('happiest')).toBe(true);
      expect(isDaleChallFamiliar('busiest')).toBe(true);
      expect(isDaleChallFamiliar('heaviest')).toBe(true);
      expect(isDaleChallFamiliar('easiest')).toBe(true);
    });

    it('matches doubled consonant superlative -est', () => {
      expect(isDaleChallFamiliar('biggest')).toBe(true);
      expect(isDaleChallFamiliar('fattest')).toBe(true);
      expect(isDaleChallFamiliar('hottest')).toBe(true);
      expect(isDaleChallFamiliar('saddest')).toBe(true);
    });
  });

  describe('Capitalization Variations', () => {
    it('handles ALL-CAPS words across all inflection categories', () => {
      expect(isDaleChallFamiliar('APPLE')).toBe(true);
      expect(isDaleChallFamiliar('BANANAS')).toBe(true);
      expect(isDaleChallFamiliar('WALKED')).toBe(true);
      expect(isDaleChallFamiliar('SWIMMING')).toBe(true);
      expect(isDaleChallFamiliar('BIGGER')).toBe(true);
      expect(isDaleChallFamiliar('HAPPIEST')).toBe(true);
      expect(isDaleChallFamiliar('ALGORITHM')).toBe(false);
    });

    it('handles TitleCase words', () => {
      expect(isDaleChallFamiliar('Elephant')).toBe(true);
      expect(isDaleChallFamiliar('Yesterday')).toBe(true);
      expect(isDaleChallFamiliar('Running')).toBe(true);
      expect(isDaleChallFamiliar('Epistemology')).toBe(false);
    });

    it('handles erratic / alternating casing', () => {
      expect(isDaleChallFamiliar('aPpLe')).toBe(true);
      expect(isDaleChallFamiliar('bAnAnAs')).toBe(true);
      expect(isDaleChallFamiliar('sToPpEd')).toBe(true);
      expect(isDaleChallFamiliar('rUnNiNg')).toBe(true);
    });
  });

  describe('Adverb Variations (-ly, -ily)', () => {
    it('matches regular adverbs ending in -ly', () => {
      expect(isDaleChallFamiliar('badly')).toBe(true);
      expect(isDaleChallFamiliar('clearly')).toBe(true);
      expect(isDaleChallFamiliar('deeply')).toBe(true);
      expect(isDaleChallFamiliar('quickly')).toBe(true);
      expect(isDaleChallFamiliar('sweetly')).toBe(true);
    });

    it('matches adverbs ending in -ily from -y adjectives', () => {
      expect(isDaleChallFamiliar('easily')).toBe(true);
      expect(isDaleChallFamiliar('happily')).toBe(true);
      expect(isDaleChallFamiliar('heavily')).toBe(true);
      expect(isDaleChallFamiliar('busily')).toBe(true);
    });
  });

  describe('Authentic Dale-Chall Formula & Edge Cases', () => {
    it('computes correct Dale-Chall formula with difficult word threshold (> 5%)', () => {
      // 100 words, 5 sentences, 10 difficult words (10%)
      // score = 0.1579 * 10 + 0.0496 * 20 + 3.6365 = 1.579 + 0.992 + 3.6365 = 6.2075 -> 6.2
      const res = calculateReadability({
        wordCount: 100,
        sentenceCount: 5,
        syllableCount: 140,
        polysyllableCount: 8,
        characterCountWithoutSpaces: 450,
        difficultWordsCount: 10
      });
      expect(res.daleChallIndex).toBe(6.2);
    });

    it('omits 3.6365 constant when difficult word percentage <= 5%', () => {
      // 100 words, 5 sentences, 4 difficult words (4%)
      // score = 0.1579 * 4 + 0.0496 * 20 = 0.6316 + 0.992 = 1.6236 -> 1.6
      const res = calculateReadability({
        wordCount: 100,
        sentenceCount: 5,
        syllableCount: 120,
        polysyllableCount: 2,
        characterCountWithoutSpaces: 400,
        difficultWordsCount: 4
      });
      expect(res.daleChallIndex).toBe(1.6);
    });

    it('handles zero difficult words gracefully', () => {
      const res = calculateReadability({
        wordCount: 100,
        sentenceCount: 10,
        syllableCount: 110,
        polysyllableCount: 0,
        characterCountWithoutSpaces: 350,
        difficultWordsCount: 0
      });
      // 0.1579 * 0 + 0.0496 * 10 = 0.496 -> 0.5
      expect(res.daleChallIndex).toBe(0.5);
    });
  });

  describe('Adversarial Throughput Verification', () => {
    it('sustains >900,000 words/second under syntactically dense adversarial load', () => {
      const corpus = `The rapid global expansion of digital publishing technologies has revolutionized contemporary journalism. `.repeat(1000);
      // Warm-up JIT compiler
      profileText(corpus.slice(0, 1000));

      // Measure best of 3 runs to avoid thread context-switch jitter during parallel test execution
      let minDuration = Infinity;
      let lastProfile = profileText(corpus);
      for (let run = 0; run < 3; run++) {
        const start = performance.now();
        lastProfile = profileText(corpus);
        const dur = performance.now() - start;
        if (dur < minDuration) minDuration = dur;
      }
      const throughput = Math.round(lastProfile.wordCount / (minDuration / 1000));
      expect(lastProfile.wordCount).toBeGreaterThan(10000);
      const minThroughput = process.env.CI ? 250000 : 900000;
      expect(throughput).toBeGreaterThan(minThroughput);
    });
  });
});
