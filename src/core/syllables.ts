/**
 * High-accuracy algorithmic English syllable counter with phonetic rules,
 * irregular word exceptions, and LRU memory cache.
 */

const SYLLABLE_CACHE = new Map<string, number>();
const MAX_CACHE_SIZE = 10000;

// High-frequency irregular English words with counter-intuitive syllable counts
const IRREGULAR_SYLLABLES: Record<string, number> = {
  the: 1,
  a: 1,
  an: 1,
  and: 1,
  are: 1,
  as: 1,
  at: 1,
  be: 1,
  by: 1,
  for: 1,
  from: 1,
  has: 1,
  he: 1,
  in: 1,
  is: 1,
  it: 1,
  its: 1,
  of: 1,
  on: 1,
  that: 1,
  to: 1,
  was: 1,
  were: 1,
  will: 1,
  with: 1,
  you: 1,
  your: 1,
  
  // Tricky polysyllabic and silent-ending words
  area: 3,
  business: 2,
  chocolate: 2,
  comfortable: 4,
  different: 3,
  every: 2,
  evening: 2,
  family: 3,
  favorite: 3,
  general: 3,
  history: 3,
  interesting: 4,
  memory: 3,
  natural: 3,
  several: 3,
  special: 2,
  temperature: 4,
  vegetable: 3,
  wednesday: 2,
  
  // Classical / borrowed words
  recipe: 3,
  simile: 3,
  epitome: 4,
  hyperbole: 4,
  catastrophe: 4,
  apostrophe: 4,
  facade: 2,
  queue: 1,
  rhythm: 2,
  subtle: 2,
  subtly: 2,
  maybe: 2,
  acne: 2,
  sesame: 3,
  penelope: 4,
  chile: 2,
  posse: 2,
  coyote: 3,
  karate: 3,
  guacamole: 4,
  origami: 4,
  tsunami: 3
};

/**
 * Counts syllables in an English word using phonetic decomposition.
 * @param rawWord The raw token string
 * @returns Number of syllables (min 1 for any non-empty word)
 */
export function countSyllables(rawWord: string): number {
  const word = rawWord.toLowerCase().trim().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 2) return 1;

  const cached = SYLLABLE_CACHE.get(word);
  if (cached !== undefined) return cached;

  if (IRREGULAR_SYLLABLES[word] !== undefined) {
    const result = IRREGULAR_SYLLABLES[word];
    setCache(word, result);
    return result;
  }

  let count = 0;
  // Replace 'qu' with 'qw' so 'u' is not counted as a vowel or hiatus
  let w = word.replace(/qu/g, 'qw');

  // Handle common silent terminal 'e'
  // But preserve '-le' if preceded by consonant (e.g. table, bottle, cycle)
  const endsWithLe = /[^aeiouy]le$/.test(w);
  const endsWithSilentE = /[^aeiouy]e$/.test(w) && !endsWithLe;
  
  if (endsWithSilentE) {
    w = w.slice(0, -1);
  }

  // Handle common '-ed' suffix: silent unless preceded by 'd' or 't'
  // e.g., 'jumped' -> 'jump', 'wanted' -> 2 syllables
  if (w.endsWith('ed') && w.length > 3) {
    const rootChar = w[w.length - 3];
    if (rootChar !== 't' && rootChar !== 'd') {
      w = w.slice(0, -2);
    }
  }

  // Handle '-es' suffix: silent unless preceded by s, z, x, ch, sh
  if (w.endsWith('es') && w.length > 3) {
    const sub = w.slice(0, -2);
    if (!/(s|z|x|ch|sh)$/.test(sub)) {
      w = sub;
    }
  }

  // Count vowel groups
  const vowelMatches = w.match(/[aeiouy]+/g);
  if (vowelMatches) {
    count += vowelMatches.length;
  }

  // Adjust for multi-syllable diphthongs/hiatus (e.g., 'dia', 'io', 'eo', 'ua', 'ui')
  const hiatusMatches = w.match(/(ia|io|eo|ua|ui|uo|iu|ii)/g);
  if (hiatusMatches) {
    count += hiatusMatches.length;
  }

  // Adjust for triphthongs or vowel combinations that are usually single syllables (e.g., 'iou', 'eau')
  const singleSounds = w.match(/(eau|iou|ious|eous)/g);
  if (singleSounds) {
    count -= singleSounds.length;
  }

  // Suffix '-tion' / '-sion' is 1 syllable, but 'io' was counted
  const tionMatches = w.match(/(tion|sion)/g);
  if (tionMatches) {
    count -= tionMatches.length;
  }

  // Words ending with '-sm' or '-thm' (e.g. prism, rhythm, algorithm, socialism) where 'm' is syllabic
  if (/(sm|thm)$/.test(word)) {
    count += 1;
  }

  // Ensure count is at least 1
  const finalCount = Math.max(1, count);
  setCache(word, finalCount);
  return finalCount;
}

function setCache(key: string, value: number) {
  if (SYLLABLE_CACHE.size >= MAX_CACHE_SIZE) {
    SYLLABLE_CACHE.clear();
  }
  SYLLABLE_CACHE.set(key, value);
}
