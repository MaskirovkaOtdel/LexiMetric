# LexiMetric v1.2.0 Release Notes
### "The Italian, Portuguese, Markdown Profiling & WebExtension Release"
**Release Date:** September 25, 2026  
**License:** MIT (Community Edition)  
**GitHub Repository:** [MaskirovkaOtdel/LexiMetric](https://github.com/MaskirovkaOtdel/LexiMetric)

---

## 🌟 Highlights & Overview

LexiMetric v1.2.0 expands our zero-dependency linguistic profiler with expanded Romance language coverage, comprehensive structured Markdown section profiling, and a browser WebExtension integration scaffold.

With **126 automated unit tests passing** (100% pass rate) and benchmark throughput exceeding **1.7 Million words/second**, this release brings native readability scoring to Italian and Portuguese content while enabling document structure-aware editorial auditing.

---

## 🚀 What's New in LexiMetric v1.2.0

### 1. Native Italian & Portuguese Readability Engines
Building on the Spanish, German, and French support introduced in v1.1.0, LexiMetric now natively understands and computes readability for Italian and Portuguese:

- **Italian Indice Gulpease (`it`)**:
  - Calibrated against standard Italian educational levels: Licenza elementare (grade 5), Licenza media (grade 8), Diploma superiore (grade 12), and Laurea (grade 16).
  - Implementation: `89 - 10 * (Letters / Words) + 300 * (Sentences / Words)`.
  - Native Italian syllabification engine handling Italian hiatuses, accents, and strong vowels.

- **Portuguese Flesch-Fernández PT (`pt`)**:
  - Calibrated for Brazilian and European Portuguese texts across educational bands (Ensino Fundamental I through Pós-graduação).
  - Implementation: `248.835 - 1.015 * ASL - 84.6 * ASW`.
  - Syllabification engine handling nasal vowels (`ã`, `õ`), diphthongs, and acute/circumflex accents.

- **Fast Statistical Language Detection**:
  - Automatically identifies Italian and Portuguese with high confidence (>0.5) from initial character sample distributions without external neural network or dictionary overhead.

```typescript
import { profileText } from 'leximetric';

const italianText = 'La transizione ecologica rappresenta un obiettivo cruciale per lo sviluppo sostenibile.';
const profile = profileText(italianText);

console.log(profile.detectedLanguage?.languageName); // "Italian"
console.log(profile.multilingualReadability?.secondaryLabel); // "Indice Gulpease"
console.log(profile.multilingualReadability?.interpretation); // "Medio (Diploma superiore)"
```

### 2. Structured Markdown Section Profiling (`src/core/markdown.ts`)
Modern web content is authored in Markdown. LexiMetric v1.2.0 introduces structural document decomposition:
- **Heading-Level AST Parser**: Breaks long-form documents into sections by `H1`–`H6` headings.
- **Per-Section Readability**: Measures word count, silent read time, Flesch Reading Ease, and run-on sentences for each subsection.
- **Editorial Heatmap**: Enables editors to pinpoint dense or difficult subsections within lengthy guides, technical papers, or books.

```typescript
import { profileMarkdownDocument } from 'leximetric';

const sections = profileMarkdownDocument(markdownContent);
sections.forEach(sec => {
  console.log(`${sec.heading} (Level ${sec.level}): Grade ${sec.profile.readability.consensusGrade}`);
});
```

### 3. WebExtension Browser Extension Scaffold (`src/extension/`)
- Chrome & Firefox Manifest V3 compliant extension scaffold.
- One-click popup inspecting active browser tabs.
- Content script extracting readable manuscript text and computing real-time word count, silent read time, and consensus grade.

### 4. Interactive Web Studio Enhancements (`src/ui/App.tsx`)
- Sample texts for Italian and Portuguese added to the Web Studio.
- Dedicated scorecards for Indice Gulpease and Flesch-Fernández PT.
- Markdown viewer mode displaying section-by-section breakdown.

---

## ⚡ Performance Benchmarks

All benchmarks executed on Node v20/22 runtime:
- **Phonetic Syllable Counter Engine**: **>7.1 Million words/second**
- **Full Linguistic Profiler**: **>1.7 Million words/second** (Syllables + 8 Readability Formulas + Multilingual + Passive Voice + Sentence Spans)

---

## 🧪 Verification Record

- **Test Suite**: 10 passed test files, **126 passed tests** (100% pass rate).
- **TypeScript**: Strict typechecking verified (`tsc --noEmit`).
- **Production Bundle**: Clean Vite build.
