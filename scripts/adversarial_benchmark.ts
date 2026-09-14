import { profileText } from '../src/core/linguistics.js';
import { countSyllables } from '../src/core/syllables.js';
import { isDaleChallFamiliar } from '../src/core/daleChallWords.js';

// Construct diverse, high-entropy vocabulary pool with irregulars, compounds, and inflections
const VOCABULARY_POOL = [
  'barefoot', 'firefly', 'somewhere', 'grapefruit', 'whiteboard', 'safeguard', 'watermelon',
  'daydream', 'bookkeeper', 'horseback', 'safely', 'management', 'likeness', 'hopeful',
  'hopeless', 'lifelike', 'statewide', 'peacetime', 'roadside', 'organized', 'customized',
  'capitalized', 'specialized', 'algorithm', 'epistemology', 'jurisprudence', 'phenomenological',
  'communication', 'elementary', 'hyperbole', 'catastrophe', 'apostrophe', 'comfortable',
  'interesting', 'temperature', 'vegetable', 'wednesday', 'rhythm', 'subtly', 'guacamole',
  'running', 'swimming', 'walking', 'jumping', 'happier', 'biggest', 'coolest', 'quickly',
  'easily', 'walked', 'stopped', 'planned', 'cried', 'baking', 'making', 'writing',
  'The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog', 'and', 'was',
  'reported', 'by', 'the', 'delegates', 'yesterday', 'in', 'order', 'to', 'facilitate',
  'a', 'large', 'number', 'of', 'editorial', 'modifications', 'due', 'to', 'the', 'fact', 'that',
  'at', 'this', 'point', 'in', 'time', 'we', 'are', 'compelled', 'to', 'examine', 'every', 'detail'
];

export function runAdversarialBenchmark() {
  console.log('\n=== Adversarial Throughput Stress Benchmark ===\n');

  // Generate 100,000 words of non-trivial, syntactically complex adversarial text
  const targetWords = 100000;
  const sentences: string[] = [];
  let currentWords = 0;
  let wordIdx = 0;

  while (currentWords < targetWords) {
    const sentenceLen = 10 + ((wordIdx * 7) % 35); // Varies between 10 and 44 words
    const sentenceWords: string[] = [];
    for (let i = 0; i < sentenceLen && currentWords < targetWords; i++) {
      // Intentionally introduce alternating casing and punctuation
      const baseWord = VOCABULARY_POOL[(wordIdx + i) % VOCABULARY_POOL.length];
      const decoratedWord = (i % 5 === 0)
        ? baseWord.toUpperCase()
        : (i % 7 === 0)
          ? baseWord.charAt(0).toUpperCase() + baseWord.slice(1)
          : baseWord;
      sentenceWords.push(decoratedWord);
      currentWords++;
    }
    // Form a sentence with varying punctuation
    const punct = (sentences.length % 4 === 0) ? '? ' : (sentences.length % 6 === 0) ? '! ' : '. ';
    sentences.push(sentenceWords.join(' ') + punct);
    wordIdx += sentenceLen;
  }

  const adversarialText = sentences.join('\n\n');
  const wordTokens = adversarialText.match(/[a-zA-Z0-9]+(?:'[a-zA-Z]+)?/g) || [];
  const actualWordCount = wordTokens.length;

  console.log(`Adversarial Corpus Size: ${actualWordCount.toLocaleString()} words (~${Math.round(adversarialText.length / 1024)} KB)`);
  console.log(`Sentences: ${sentences.length.toLocaleString()} sentences with dynamic cadence`);

  // 1. Adversarial Syllable Counting (Warm/Mixed Cache)
  const startSyllables = performance.now();
  let totalSyllables = 0;
  for (let i = 0; i < wordTokens.length; i++) {
    totalSyllables += countSyllables(wordTokens[i]);
  }
  const endSyllables = performance.now();
  const syllableDuration = endSyllables - startSyllables;
  const syllableThroughput = Math.round(actualWordCount / (syllableDuration / 1000));

  console.log(`\n[1] Syllable Engine Throughput:`);
  console.log(`    Duration:   ${syllableDuration.toFixed(2)} ms`);
  console.log(`    Throughput: ${syllableThroughput.toLocaleString()} words/sec`);

  // 2. Cold-Cache / Cache-Thrashing Syllable Benchmark (25,000 completely unique words)
  const uniqueWords: string[] = [];
  const prefixes = ['anti', 'dis', 'un', 'in', 'pre', 'post', 'sub', 'super', 'trans', 'inter'];
  const roots = ['struct', 'port', 'tract', 'dict', 'fact', 'fect', 'mit', 'miss', 'cord', 'ject'];
  const suffixes = ['tion', 'ment', 'able', 'ible', 'ness', 'less', 'ful', 'ly', 'ize', 'ized'];
  for (let p = 0; p < prefixes.length; p++) {
    for (let r = 0; r < roots.length; r++) {
      for (let s = 0; s < suffixes.length; s++) {
        for (let k = 0; k < 25; k++) {
          uniqueWords.push(`${prefixes[p]}${roots[r]}${suffixes[s]}${String.fromCharCode(97 + k)}`);
        }
      }
    }
  }
  const coldStart = performance.now();
  let coldSyllables = 0;
  for (let i = 0; i < uniqueWords.length; i++) {
    coldSyllables += countSyllables(uniqueWords[i]);
  }
  const coldDuration = performance.now() - coldStart;
  const coldThroughput = Math.round(uniqueWords.length / (coldDuration / 1000));

  console.log(`\n[2] Cold-Cache Thrashing Syllable Benchmark (25,000 Unique Synthetic Words):`);
  console.log(`    Unique Words: ${uniqueWords.length.toLocaleString()}`);
  console.log(`    Duration:     ${coldDuration.toFixed(2)} ms`);
  console.log(`    Throughput:   ${coldThroughput.toLocaleString()} words/sec`);

  // 3. Dale-Chall Lookup Throughput
  const startDc = performance.now();
  let familiarCount = 0;
  for (let i = 0; i < wordTokens.length; i++) {
    if (isDaleChallFamiliar(wordTokens[i])) familiarCount++;
  }
  const endDc = performance.now();
  const dcDuration = endDc - startDc;
  const dcThroughput = Math.round(actualWordCount / (dcDuration / 1000));

  console.log(`\n[3] Dale-Chall Morphological Lookup Throughput:`);
  console.log(`    Familiar:   ${familiarCount.toLocaleString()} / ${actualWordCount.toLocaleString()} words`);
  console.log(`    Duration:   ${dcDuration.toFixed(2)} ms`);
  console.log(`    Throughput: ${dcThroughput.toLocaleString()} words/sec`);

  // 4. Full Profiling Engine Under Adversarial Text Load
  const startProfile = performance.now();
  const profile = profileText(adversarialText);
  const endProfile = performance.now();
  const profileDuration = endProfile - startProfile;
  const profileThroughput = Math.round(actualWordCount / (profileDuration / 1000));

  console.log(`\n[4] Full Profiler Under Adversarial Text Load:`);
  console.log(`    Words Processed:     ${profile.wordCount.toLocaleString()}`);
  console.log(`    Syllables Counted:   ${profile.syllableCount.toLocaleString()}`);
  console.log(`    Difficult Words:     ${profile.difficultWordCount.toLocaleString()}`);
  console.log(`    Spans Detected:      ${profile.spans.length.toLocaleString()}`);
  console.log(`    Dale-Chall Index:    ${profile.readability.daleChallIndex}`);
  console.log(`    Consensus Grade:     ${profile.readability.consensusGrade} (${profile.readability.consensusConfidence})`);
  console.log(`    Duration:            ${profileDuration.toFixed(2)} ms`);
  console.log(`    Throughput:          ${profileThroughput.toLocaleString()} words/sec`);

  console.log('\n===============================================\n');

  return {
    syllableThroughput,
    coldThroughput,
    dcThroughput,
    profileThroughput,
    passedThreshold: profileThroughput > 900000
  };
}

runAdversarialBenchmark();
