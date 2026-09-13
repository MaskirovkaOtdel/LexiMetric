import { profileText } from '../src/core/linguistics.js';
import { countSyllables } from '../src/core/syllables.js';

const SAMPLE_PARAGRAPH = `The rapid global expansion of digital publishing technologies has revolutionized contemporary journalism. Editorial rooms must balance high publication velocity with uncompromising prose standards. To achieve this equilibrium, modern content management systems utilize real-time algorithmic linguistic profiling. Complex sentences are systematically evaluated for syntactic density, while passive voice formulations and run-on structures are flagged to maintain maximum reader comprehension.`;

function runBenchmark() {
  console.log('\x1b[1m\x1b[36m=== LexiMetric Performance Benchmark ===\x1b[0m\n');

  // Build 100,000 word corpus
  const repetitions = 1500;
  let largeCorpus = '';
  for (let i = 0; i < repetitions; i++) {
    largeCorpus += SAMPLE_PARAGRAPH + '\n\n';
  }

  const words = largeCorpus.match(/[a-zA-Z0-9]+(?:'[a-zA-Z]+)?/g) || [];
  const wordCount = words.length;

  console.log(`Corpus Size: \x1b[1m${wordCount.toLocaleString()} words\x1b[0m (~${Math.round(largeCorpus.length / 1024)} KB of raw text)\n`);

  // 1. Syllable counter benchmark
  const startSyllables = performance.now();
  let totalSyllables = 0;
  for (let i = 0; i < words.length; i++) {
    totalSyllables += countSyllables(words[i]);
  }
  const endSyllables = performance.now();
  const syllableDurationMs = endSyllables - startSyllables;
  const syllableWordsPerSec = Math.round((wordCount / (syllableDurationMs / 1000)));

  console.log(`[1] Syllable Counter Engine:`);
  console.log(`    Total Syllables Computed: ${totalSyllables.toLocaleString()}`);
  console.log(`    Duration:                 ${syllableDurationMs.toFixed(2)} ms`);
  console.log(`    Throughput:               \x1b[1m\x1b[32m${syllableWordsPerSec.toLocaleString()} words/sec\x1b[0m\n`);

  // 2. Full Linguistic & Readability Profiling benchmark
  const startProfile = performance.now();
  const profile = profileText(largeCorpus);
  const endProfile = performance.now();
  const profileDurationMs = endProfile - startProfile;
  const profileWordsPerSec = Math.round((wordCount / (profileDurationMs / 1000)));

  console.log(`[2] Full Linguistic Profiler (Syllables + 6 Readability Formulas + Passive + Spans):`);
  console.log(`    Sentences Processed:      ${profile.sentenceCount.toLocaleString()}`);
  console.log(`    Reading Ease:             ${profile.readability.fleschReadingEase} (${profile.readability.difficultyLabel})`);
  console.log(`    Silent Read Time:         ${profile.readTime.silentReadingFormatted}`);
  console.log(`    Duration:                 ${profileDurationMs.toFixed(2)} ms`);
  console.log(`    Throughput:               \x1b[1m\x1b[32m${profileWordsPerSec.toLocaleString()} words/sec\x1b[0m\n`);

  console.log('\x1b[1m\x1b[36m=========================================\x1b[0m');
}

runBenchmark();
