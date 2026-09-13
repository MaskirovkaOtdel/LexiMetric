# Contributing to LexiMetric

Thank you for your interest in contributing to **LexiMetric**! We welcome contributions from the community—whether it's fixing edge cases in syllable phonetics, refining readability metrics, optimizing performance, or improving documentation.

---

## Development Workflow

### 1. Prerequisites

- Node.js 20+ (recommended 22+)
- npm 10+

### 2. Clone and Install

```bash
git clone https://github.com/your-username/LexiMetric.git
cd LexiMetric
npm install
```

### 3. Local Development

To launch the interactive web studio:
```bash
npm run dev
```

To run the CLI locally:
```bash
npm run cli -- --text "Testing the linguistic engine."
```

### 4. Running Tests

We enforce unit tests for any algorithmic modifications (e.g. syllable counter, readability formulas):
```bash
npm test
```

### 5. Production Build Verification

Before submitting a pull request, ensure the build passes cleanly:
```bash
npm run build
```

---

## Code Style & Architectural Directives

- **Zero Speculative Code**: Keep implementations focused, lean, and strictly typed.
- **Phonetic Accuracy**: When adjusting English syllable counts, add regression tests in `tests/syllables.test.ts`.
- **Zero-Dependency Core**: The core linguistic engine (`src/core/`) must remain free of heavy external dependencies to ensure fast client-side and Web Worker execution.

---

## Submitting Pull Requests

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. Commit your changes with clear, descriptive commit messages.
3. Verify that all tests pass (`npm test`) and the project builds (`npm run build`).
4. Push to your branch and open a Pull Request.

---

## License

By contributing to LexiMetric, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
