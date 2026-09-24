import { describe, it, expect } from 'vitest';
import {
  stripMarkdown,
  profileMarkdownSections,
  analyzeMarkdownDocument
} from '../src/core/markdown.js';

describe('Markdown & Section Profiling Engine', () => {

  const SAMPLE_MD = `---
title: "Autonomous Agent Architectures"
author: "Research Team"
category: "AI"
---

# Introduction

Autonomous agents represent a paradigm shift in distributed systems engineering. Developers are creating resilient workflows capable of continuous execution without manual interventions.

## Theoretical Foundations

In order to assess cognitive architectures, we examine reinforcement learning and multi-agent coordination. Prior benchmarks indicate significant throughput gains across modern LLM orchestrators.

### Empirical Validation

Empirical proof over assumptions is required before marking work complete. Tests must pass with zero defects.
`;

  it('strips YAML frontmatter cleanly and extracts key-value pairs', () => {
    const { cleanText, frontmatter } = stripMarkdown(SAMPLE_MD);
    expect(frontmatter).toBeDefined();
    expect(frontmatter?.title).toBe('Autonomous Agent Architectures');
    expect(frontmatter?.author).toBe('Research Team');
    expect(frontmatter?.category).toBe('AI');
    expect(cleanText).not.toContain('---');
    expect(cleanText).not.toContain('category: "AI"');
  });

  it('strips Markdown formatting such as code blocks, links, and bold text', () => {
    const formatted = `Here is [a link](https://example.com) and **bold text** with \`inline code\` and a blockquote:
> This is a quote.
\`\`\`ts
const x = 10;
\`\`\`
`;
    const { cleanText } = stripMarkdown(formatted);
    expect(cleanText).toContain('Here is a link and bold text with inline code and a blockquote:');
    expect(cleanText).toContain('This is a quote.');
    expect(cleanText).not.toContain('https://example.com');
    expect(cleanText).not.toContain('```');
    expect(cleanText).not.toContain('const x = 10;');
  });

  it('deconstructs markdown into sections by ATX headings and profiles each section', () => {
    const sections = profileMarkdownSections(SAMPLE_MD);
    expect(sections.length).toBe(3);

    expect(sections[0].heading).toBe('Introduction');
    expect(sections[0].level).toBe(1);
    expect(sections[0].wordCount).toBeGreaterThan(15);
    expect(sections[0].readingEase).toBeGreaterThanOrEqual(0);
    expect(sections[0].readTimeFormatted).toBeDefined();

    expect(sections[1].heading).toBe('Theoretical Foundations');
    expect(sections[1].level).toBe(2);

    expect(sections[2].heading).toBe('Empirical Validation');
    expect(sections[2].level).toBe(3);
  });

  it('analyzes entire markdown document with combined parse result', () => {
    const res = analyzeMarkdownDocument(SAMPLE_MD);
    expect(res.cleanText).toBeDefined();
    expect(res.frontmatter?.title).toBe('Autonomous Agent Architectures');
    expect(res.sections.length).toBe(3);
    expect(res.overallProfile.wordCount).toBeGreaterThan(50);
  });
});
