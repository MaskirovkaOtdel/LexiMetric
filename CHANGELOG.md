# Changelog

All notable changes to **LexiMetric** (Community Edition) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-09-24

### Added
- **Multilingual Readability Engine (`src/core/multilingual.ts`)**:
  - Automatic language detection supporting English, Spanish (`es`), German (`de`), and French (`fr`) using a 2,500-character sample frequency density model.
  - Native **Spanish Readability**: Súñer Fernández-Huerta Reading Ease and Gutiérrez de Polini formula with authentic Spanish diphthong/triphthong syllabification.
  - Native **German Readability**: Wiener Sachtextformel (WSTF 1–4) calibrated for secondary and adult education text scoring.
  - Native **French Readability**: Flesch-Kandel readability index.
  - Seamlessly unified into `profileText()` and exported as `detectedLanguage` and `multilingualReadability`.
- **Embeddable Shadow-DOM Web Component (`src/embed/badge.ts`)**:
  - Zero-dependency `<leximetric-badge>` custom element with encapsulated shadow DOM styling.
  - Reactive attributes (`score`, `grade`, `theme`, `lang`) with dynamic live updates.
  - Server-Side Rendering (SSR) safe base fallback class for Node.js / headless runtimes.
  - Built-in `generateEmbedSnippet()` helper for one-click CMS or blog integration.
- **Interactive Web Studio Enhancements (`src/ui/App.tsx`)**:
  - Sample load buttons for Spanish (*Declaración Universal de Derechos Humanos*) and German (*Kritik der reinen Vernunft*).
  - Dedicated **Multilingual Readability Scorecard** displaying native formulas, difficulty levels, and target school grades.
  - **Embed Badge Modal** with interactive preview, theme selector (`dark`, `light`, `minimal`), and one-click code snippet copying.
  - **Print / PDF Scorecard Export** with dedicated `@media print` stylesheets.

### Performance
- Maintained **>1.91 Million words/second** throughput on full multilingual and syntactic profiling by isolating language detection sampling.
- Phonetic syllable counter operates at **>8.33 Million words/second**.

### Testing & Verification
- Added 14 new automated unit tests in `tests/multilingual.test.ts` and `tests/badge.test.ts`.
- **116 passed tests across 9 test suites** (100% pass rate).
- Production build verified with zero errors.
- Verified 100% green status across all 4 GitHub Actions CI matrix combinations (Ubuntu & Windows, Node 20.x & 22.x).

---

## [1.0.0] - 2026-09-13

### Added
- **Phonetic Syllable Counter (`src/core/syllables.ts`)**: Hybrid rule-based English phonotactic engine with closed-compound word decomposition, irregular suffix contractions, and an LRU cache.
- **Dale-Chall Readability & Familiar Word List (`src/core/daleChallWords.ts`)**: Authentic 3,000-word vocabulary with zero-dependency morphological stemmer.
- **8 Core Readability Indexes (`src/core/readability.ts`)**: Flesch Reading Ease, Flesch-Kincaid Grade, Gunning Fog, Coleman-Liau, SMOG, ARI, Dale-Chall Index, and Linsear Write, synthesized into an intelligent Consensus Grade.
- **Agent-Extracted Passive Voice & Bloat Detection (`src/core/linguistics.ts`)**: Inverts passive sentences to active voice with agent extraction; flags 70+ editorial bloat phrases with character spans.
- **Dynamic Read-Time Models (`src/core/readTime.ts`)**: Silent reading, audio narration, and teleprompter presets.
- **Interactive Web Studio (`src/ui/App.tsx`)**: Raw editing mode, visual inspection mode, and sentence cadence heatmap with one-click fixes.
- **Zero-Dependency CLI (`src/cli/index.ts`)**: Terminal output with colorized tags and JSON export.
