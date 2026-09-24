/**
 * LexiMetric Markdown & Structural Section Readability Engine
 * Zero-dependency parser providing AST-like section profiling and syntax stripping
 */

import { profileText, LinguisticProfile } from './linguistics.js';

export interface MarkdownSectionProfile {
  heading: string;
  level: number;
  wordCount: number;
  sentenceCount: number;
  readingEase: number;
  difficultyLabel: string;
  readTimeFormatted: string;
  cleanContent: string;
}

export interface MarkdownParseResult {
  cleanText: string;
  frontmatter?: Record<string, string>;
  sections: MarkdownSectionProfile[];
  overallProfile: LinguisticProfile;
}

/**
 * Strips YAML frontmatter, ATX headers, code blocks, and markdown markup
 */
export function stripMarkdown(markdown: string): { cleanText: string; frontmatter?: Record<string, string> } {
  let text = markdown;
  let frontmatter: Record<string, string> | undefined;

  // 1. Extract YAML frontmatter
  const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (fmMatch) {
    frontmatter = {};
    const lines = fmMatch[1].split(/\r?\n/);
    for (const line of lines) {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (key) frontmatter[key] = val;
      }
    }
    text = text.slice(fmMatch[0].length);
  }

  // 2. Remove fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, '');

  // 3. Remove inline code
  text = text.replace(/`([^`]+)`/g, '$1');

  // 4. Remove images: ![alt](url) -> ""
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '');

  // 5. Replace links: [anchor](url) -> anchor
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

  // 6. Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // 7. Remove ATX heading markers
  text = text.replace(/^#{1,6}\s+/gm, '');

  // 8. Remove blockquotes
  text = text.replace(/^>\s+/gm, '');

  // 9. Remove unordered and ordered list markers
  text = text.replace(/^\s*[-*+]\s+/gm, '');
  text = text.replace(/^\s*\d+\.\s+/gm, '');

  // 10. Remove bold / italic / strikethrough delimiters
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  text = text.replace(/~~(.*?)~~/g, '$1');

  // 11. Normalize excess blank lines
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return { cleanText: text, frontmatter };
}

/**
 * Parses markdown into structured sections and computes isolated linguistic metrics for each
 */
export function profileMarkdownSections(markdown: string): MarkdownSectionProfile[] {
  // Strip frontmatter first if present
  const fmMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const content = fmMatch ? markdown.slice(fmMatch[0].length) : markdown;

  const lines = content.split(/\r?\n/);
  const sections: Array<{ heading: string; level: number; lines: string[] }> = [];

  let currentHeading = 'Introduction / Preamble';
  let currentLevel = 1;
  let currentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (currentLines.length > 0 || currentHeading !== 'Introduction / Preamble') {
        sections.push({
          heading: currentHeading,
          level: currentLevel,
          lines: currentLines
        });
      }
      currentLevel = headingMatch[1].length;
      currentHeading = headingMatch[2].replace(/[*_`]/g, '').trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  // Push last section
  if (currentLines.length > 0 || sections.length === 0) {
    sections.push({
      heading: currentHeading,
      level: currentLevel,
      lines: currentLines
    });
  }

  // Profile each section
  return sections
    .map(sec => {
      const rawText = sec.lines.join('\n');
      const { cleanText } = stripMarkdown(rawText);
      const prof = profileText(cleanText);

      return {
        heading: sec.heading,
        level: sec.level,
        wordCount: prof.wordCount,
        sentenceCount: prof.sentenceCount,
        readingEase: prof.readability.fleschReadingEase,
        difficultyLabel: prof.readability.difficultyLabel,
        readTimeFormatted: prof.readTime.silentReadingFormatted,
        cleanContent: cleanText
      };
    })
    .filter(sec => sec.wordCount > 0 || sec.heading !== 'Introduction / Preamble');
}

/**
 * Full markdown document audit returning stripped text, frontmatter, section profiles, and global profile
 */
export function analyzeMarkdownDocument(markdown: string): MarkdownParseResult {
  const { cleanText, frontmatter } = stripMarkdown(markdown);
  const sections = profileMarkdownSections(markdown);
  const overallProfile = profileText(cleanText);

  return {
    cleanText,
    frontmatter,
    sections,
    overallProfile
  };
}
