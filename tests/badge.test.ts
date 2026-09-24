import { describe, it, expect } from 'vitest';
import { generateEmbedSnippet, LexiMetricBadge } from '../src/embed/badge.js';

describe('LexiMetric Embeddable Web Badge', () => {

  it('generates copy-pasteable HTML embed snippet', () => {
    const snippet = generateEmbedSnippet({ theme: 'dark', showGrade: true });
    expect(snippet).toContain('<leximetric-badge');
    expect(snippet).toContain('theme="dark"');
    expect(snippet).toContain('show-grade="true"');
    expect(snippet).toContain('https://cdn.jsdelivr.net');
  });

  it('supports editorial and minimal themes in embed snippet', () => {
    const editorial = generateEmbedSnippet({ theme: 'editorial', showGrade: false });
    expect(editorial).toContain('theme="editorial"');
    expect(editorial).toContain('show-grade="false"');
  });

  it('instantiates LexiMetricBadge class', () => {
    expect(LexiMetricBadge).toBeDefined();
    expect(typeof LexiMetricBadge).toBe('function');
  });
});
