# LexiMetric

<div align="center">

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Build](https://img.shields.io/badge/Build-Passing-emerald)
![Tests](https://img.shields.io/badge/Tests-100%25_Passing-emerald)
![Throughput](https://img.shields.io/badge/Throughput-~1M_words%2Fsec-indigo)
![Dependencies](https://img.shields.io/badge/Dependencies-Zero-purple)

**Zero-dependency, high-throughput client-side linguistic profiler, readability suite, and dynamic read-time calculator.**

[Live Web Studio](#quick-start) • [Library Usage](#npm-library-usage) • [CLI Runner](#cli-usage) • [Performance Benchmarks](#performance-benchmarks)

</div>

---

## Overview

**LexiMetric** is an open-source linguistic profiling engine designed for modern media portals, digital newsrooms, and copywriters. Built with zero external runtime dependencies, it calculates readability indexes, dynamic silent and podcast read-times, sentence length cadences, passive voice, and wordiness diagnostics at **~1,000,000 words per second**.

It runs seamlessly across **Node.js**, modern **browsers**, and inside background **Web Workers** for non-blocking analysis of large editorial manuscripts.

---

## Key Capabilities

- ⚡ **Algorithmic Syllable Counter**: Fast phonetic parser handling diphthongs, silent endings, syllabic consonants, and irregular exceptions (>9M words/sec).
- 📊 **6-Index Readability Battery**:
  - **Flesch Reading Ease (FRE)**
  - **Flesch-Kincaid Grade Level (FKGL)**
  - **Gunning Fog Index**
  - **Coleman-Liau Index**
  - **SMOG Index**
  - **Automated Readability Index (ARI)**
  - **Consensus Grade & Target Audience Interpretation**
- ⏱️ **Dynamic Velocity & Read-Time**:
  - Silent reading speed dynamically calibrated against syntactic complexity and syllable density.
  - Spoken narration duration calibrated for audiobooks, podcasts, and teleprompters (140 WPM).
  - Reader variations (Slow, Average, Fast reader profiles).
- 🔍 **Deep Editorial Diagnostics**:
  - Passive voice detection (`[to-be] + [participle]`) with exact character offsets.
  - Sentence length cadence with run-on detection ($\ge 30$ words).
  - Type-Token Ratio (TTR) lexical diversity.
  - Bloat / wordiness pattern matching with concise editorial replacements.
- 🎨 **Dual Experience**:
  - **Interactive Web Studio**: Raw editor + Annotated visual inspection mode with hover tooltips and Markdown report exports.
  - **Zero-Dependency CLI**: Formatted ANSI reports and machine-readable `--json` exports.

---

## NPM Library Usage

You can use LexiMetric directly in any TypeScript or JavaScript project:

```bash
npm install leximetric
```

```typescript
import { profileText, countSyllables, calculateReadability, calculateReadTime } from 'leximetric';

// 1. Complete text profiling
const text = "The global transition toward renewable energy accelerated significantly this quarter.";
const profile = profileText(text);

console.log(`Word Count: ${profile.wordCount}`);
console.log(`Silent Read Time: ${profile.readTime.silentReadingFormatted}`);
console.log(`Flesch Reading Ease: ${profile.readability.fleschReadingEase}/100`);
console.log(`Consensus Grade: ${profile.readability.gradeBand} (${profile.readability.targetAudience})`);
console.log(`Passive Voice Spans: ${profile.spans.filter(s => s.type === 'passive').length}`);

// 2. Direct syllable counting
console.log(countSyllables('extraordinary')); // 5
console.log(countSyllables('algorithm'));     // 4

// 3. Standalone readability calculations
const scores = calculateReadability({
  wordCount: 100,
  sentenceCount: 5,
  syllableCount: 150,
  polysyllableCount: 20,
  characterCountWithoutSpaces: 450
});
console.log(scores.fleschKincaidGrade); // Grade ~9.9
```

---

## CLI Usage

LexiMetric includes a standalone CLI runner:

```bash
# Analyze text directly
leximetric --text "The quick brown fox jumps over the lazy dog."

# Analyze a file
leximetric article.md

# Pipe via standard input
cat draft.txt | leximetric

# Output JSON for CI/CD or automation scripts
leximetric article.md --json
```

### CLI Terminal Output Sample

```
========================================================
  LEXIMETRIC EDITORIAL LINGUISTIC REPORT
========================================================

[ ESTIMATED READ & AUDIO TIMES ]
  Silent Reading:      42 sec (calibrated at 238 WPM)
  Podcast / Speech:    1 min 12s (narration @ 140 WPM)
  Reader Variations:   Slow: 1 min 2s | Fast: 35 sec

[ READABILITY INDEXES ]
  Flesch Reading Ease: 64.2 / 100 (Plain English / Conversational)
  Consensus Grade:     Grade 8-9 (Mass Media & Consumer Web)
  Flesch-Kincaid:      Grade 8.4
  Gunning Fog Index:   9.8
  Coleman-Liau Index:  10.2
  SMOG Index:          8.6
  Automated Read (ARI):8.1

[ TEXT & SYNTACTIC PROFILE ]
  Words:               168
  Unique Words:        114 (Lexical Diversity: 67.9%)
  Sentences:           12 (Avg Length: 14 words)
  Paragraphs:          3
  Syllables:           245 (Avg: 1.46 per word)
  Complex (3+ syl):    22 (13.1%)

[ EDITORIAL DIAGNOSTICS ]
  Passive Voice Spans: 2
  Run-on Sentences:    0 (>= 30 words)
  Wordiness Flags:     1
========================================================
```

---

## Performance Benchmarks

Benchmarks measured on a 90,000-word test manuscript (Node.js v25 on standard x86-64 hardware):

| Engine Component | Throughput | Latency (90k words) |
| :--- | :---: | :---: |
| **Phonetic Syllable Counter** | **~9,200,000 words/sec** | 9.77 ms |
| **Full Linguistic Profiler** (Syllables + 6 Indexes + Diagnostics) | **~950,000 words/sec** | 94.67 ms |

Run benchmarks locally:
```bash
npm run benchmark
```

---

## Quick Start (Web Studio)

1. Clone and install dependencies:
   ```bash
   git clone https://github.com/your-username/LexiMetric.git
   cd LexiMetric
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

4. Run test suites:
   ```bash
   npm test
   ```

5. Build production bundle:
   ```bash
   npm run build
   ```

---

## Community vs. Pro Edition

| Feature | Community Edition (`LexiMetric`) | Pro Edition (`LexiMetric - Pro`) |
| :--- | :---: | :---: |
| Algorithmic Syllable & Readability Engine | ✅ | ✅ |
| Dynamic Read & Narration Velocity | ✅ | ✅ |
| Passive Voice & Run-On Highlighting | ✅ | ✅ |
| Raw & Annotated View Modes | ✅ | ✅ |
| Zero-Dependency CLI & Web Studio | ✅ | ✅ |
| **5-Dimension Tone Radar** | ❌ | ✅ |
| **Automated Tone Rewrite Suggestions** | ❌ | ✅ |
| **Headline Click-Worthiness & SERP Previews** | ❌ | ✅ |
| **A/B Headline Variant Comparison** | ❌ | ✅ |
| **WordPress Gutenberg Sidebar Plugin** | ❌ | ✅ |
| **Enterprise Fastify REST API Server** | ❌ | ✅ |
| **Multi-Article Batch Auditing & CSV Export** | ❌ | ✅ |

---

## Contributing

Contributions are welcome! Please check our [Contributing Guide](./CONTRIBUTING.md) for details on setting up tests, PR guidelines, and code standards.

---

## License

[MIT](./LICENSE) © 2026 LexiMetric Contributors.
