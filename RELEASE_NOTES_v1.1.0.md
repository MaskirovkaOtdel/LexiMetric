# LexiMetric v1.1.0 Release Notes
### "The Multilingual Intelligence, Newsroom Style Guide & AI Copilot Release"
**Release Date:** September 24, 2026  
**License:** MIT (Community Edition) / Commercial (Enterprise Pro)  
**GitHub Repository:** [MaskirovkaOtdel/LexiMetric](https://github.com/MaskirovkaOtdel/LexiMetric)

---

## 🌟 Highlights & Overview

LexiMetric v1.1.0 delivers major algorithmic expansions, newsroom compliance tooling, dynamic social asset generation, and pluggable AI transformation across both the **Public Community Edition** and **Enterprise Pro Edition**.

With **375 passed automated tests** (100% pass rate) and benchmark throughput exceeding **1.9 Million words/second**, this release brings industrial-grade editorial intelligence to individual authors, global newsrooms, and programmatic publishing pipelines.

---

## 🚀 What's New in LexiMetric (Community Edition)

### 1. Zero-Dependency Multilingual Readability Suite
LexiMetric now natively understands and scores non-English European languages with authentic regional linguistic models:
- **Language Detection**: Fast sample frequency density classifier detecting English, Spanish (`es`), German (`de`), and French (`fr`) in <0.05ms without adding external dependencies.
- **Spanish Readability**:
  - *Súñer Fernández-Huerta Reading Ease*: Calibrated for modern Spanish publications.
  - *Gutiérrez de Polini Formula*: Designed for secondary education readability.
  - *Phonotactic Syllabification*: Native handling of Spanish strong/weak vowel hiatuses, diphthongs, and triphthongs.
- **German Wiener Sachtextformel (WSTF 1–4)**:
  - Supports WSTF formulas 1 through 4, providing school grade equivalents from grade 4 through university level.
  - Correctly evaluates multi-syllabic German compound nouns (*Donaudampfschifffahrt*).
- **French Flesch-Kandel**:
  - Calibrated index adapted for French journalistic syntax and syllable counts.

```typescript
import { profileText } from 'leximetric';

const profile = profileText('La ciencia de datos permite interpretar fenómenos complejos con rigor matemático.');
console.log(profile.detectedLanguage); // 'es'
console.log(profile.multilingualReadability?.fernandezHuerta); // 72.4 (Estilo Estándar)
```

### 2. Embeddable Shadow-DOM Web Component (`<leximetric-badge>`)
Easily embed a zero-dependency, isolated readability score widget into any blog, documentation portal, or CMS:
- Uses encapsulated Shadow DOM styles to guarantee zero CSS collisions with host websites.
- SSR-safe fallback when imported inside Node.js or static-site generators.
- Reactive attributes (`score`, `grade`, `theme`, `lang`).

```html
<!-- One-line HTML integration -->
<script type="module" src="https://cdn.jsdelivr.net/npm/leximetric@1.1.0/dist/badge.js"></script>
<leximetric-badge score="78" grade="8" theme="dark"></leximetric-badge>
```

### 3. Web Studio Print & Scorecard Export
- Export clean, high-resolution PDF and print scorecards directly from the Web Studio.
- Dedicated `@media print` stylesheet removing navigation chrome and formatting publication metrics into an executive summary.

---

## 🏢 What's New in LexiMetric Pro (Enterprise Edition)

### 1. Enterprise Newsroom Style Guide & Rulebook Engine
Audit manuscripts against respected media standards or custom house stylebooks in real-time:
- **Built-in Presets**:
  - **AP Stylebook**: Prohibits Oxford comma, enforces 25-word lede budget, spells out numbers under 10, enforces headline Title Case.
  - **The Economist**: Sentence case headlines, stricter corporate cliché filters, compact sentences.
  - **Academic Standard**: Requires Oxford comma, expanded lede budgets, formal terminology enforcement.
  - **Tech & Digital Newsroom**: Digital scannability optimizations.
- **Banned Clichés & Jargon Audit**: Flags 50+ overused corporate clichés (`synergy`, `circle back`, `move the needle`, `deep dive`, `touch base`) with context-aware editorial replacements.
- **Interactive Fixes**: 1-click surgical replacement in the Web Studio and a **"Fix All Auto-Fixable"** bulk cleanup button.

### 2. Dynamic 1200×630 OpenGraph Social Card Generator
*Synergy Bridge to Project #2 (Media-Tech Suite)*:
- Programmatically renders branded, pixel-accurate 1200×630 OpenGraph cards for Twitter/X, LinkedIn, and Facebook feeds.
- Available in vector SVG and base64 Data URL format with zero canvas dependencies.
- **3 Editorial Themes**:
  - `breaking-news`: High-urgency Alert Crimson & Amber gradient with kicker badge.
  - `editorial-feature`: Midnight & Gold Atlantic/New Yorker magazine aesthetic.
  - `data-insight`: Deep Indigo & Emerald Financial Times data visualization styling.

### 3. Pluggable AI Editorial Copilot Adapter
A modular copilot architecture allowing newsrooms to choose between deterministic local rules or frontier LLMs:
- **Deterministic Heuristic**: Offline, zero external dependencies, zero latency, rulebook-compliant.
- **Local Ollama (Llama 3)**: Private on-premise execution on `localhost:11434` with zero cloud API billing and automatic heuristic fallback.
- **Google Gemini 1.5 Flash**: Cloud multimodal reasoning for complex stylistic rewrites.
- **Interactive Diff Studio**: Side-by-side comparison of original vs. revised text with 1-click manuscript adoption.

### 4. Extended Enterprise Fastify REST API
Three new high-throughput production endpoints:
```bash
# 1. Audit style guide compliance
curl -X POST http://localhost:3000/api/v1/styleguide/audit \
  -H "Content-Type: application/json" \
  -d '{"text": "We need to circle back and leverage this game changer.", "styleGuide": "ap_stylebook"}'

# 2. Generate 1200x630 social card
curl -X POST http://localhost:3000/api/v1/social-card \
  -H "Content-Type: application/json" \
  -d '{"title": "Global Energy Transition Surpasses Fossil Fuel Outlays", "theme": "data-insight"}'

# 3. AI Copilot rewrite
curl -X POST http://localhost:3000/api/v1/copilot/rewrite \
  -H "Content-Type: application/json" \
  -d '{"originalText": "The decision was made by the team.", "targetTone": "journalistic", "provider": "heuristic"}'
```

---

## ⚡ Performance & Benchmarks

Audited on a 90,000-word corpus (~722 KB of raw text):

| Metric | Result | Benchmark Target | Margin |
| :--- | :--- | :--- | :--- |
| **Phonetic Syllable Counter** | **8.67 Million words/sec** | >5.0M words/sec | **+73.4%** |
| **Dale-Chall Morphological Stemmer** | **10.85 Million lookups/sec** | >5.0M words/sec | **+117.0%** |
| **Full Profiler (Core + Readability + Multilingual)** | **1.91 Million words/sec** | >900k words/sec | **+112.2%** |
| **Style Guide Rule Evaluation** | **<2.1 milliseconds** | <10ms | **Instant** |
| **Social Card SVG Generation** | **<0.8 milliseconds** | <5ms | **Sub-millisecond** |

---

## 🧪 Verification & CI/CD Status

- **Automated Tests**:
  - Community Edition: **116 passed** / 116 tests across 9 test suites.
  - Pro Edition: **259 passed** / 259 tests across 18 test suites.
  - Combined Total: **375 passed tests (100% pass rate)**.
- **GitHub Actions CI**:
  - Ubuntu & Windows environments across Node.js 20.x and 22.x matrix passed with 100% success ([Run #35990584720](https://github.com/MaskirovkaOtdel/LexiMetric/actions/runs/35990584720)).
- **Build Status**:
  - Zero TypeScript compile errors (`tsc`).
  - Zero Vite bundling warnings.

---

## 📦 Installation & Upgrade

### Community Edition
```bash
# Install via npm
npm install leximetric@1.1.0

# Run via npx CLI
npx leximetric "Under preliminary terms, conglomerates will be required to disclose dataset provenance."

# Import in Web / ESM
import { profileText } from 'leximetric';
```

### Pro Edition
```bash
# Clone or navigate to Pro workspace
cd "LexiMetric - Pro"

# Install dependencies & run test suite
npm install
npm test

# Launch Web Studio
npm run dev

# Launch Fastify REST Server
npm run server
```

---

*LexiMetric &copy; 2026 MaskirovkaOtdel / AntiGravity Media-Tech. All rights reserved.*
