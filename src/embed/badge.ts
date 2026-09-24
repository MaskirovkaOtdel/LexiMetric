/**
 * LexiMetric Embeddable Web Component (<leximetric-badge>)
 * Zero-dependency, lightweight (<3KB) shadow-DOM badge for publication article headers.
 */

import { profileText } from '../core/linguistics.js';

export interface BadgeOptions {
  theme?: 'dark' | 'light' | 'editorial' | 'minimal';
  showGrade?: boolean;
  showWords?: boolean;
  wpm?: number;
}

const BaseElement = typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as unknown as typeof HTMLElement);

export class LexiMetricBadge extends BaseElement {
  static get observedAttributes() {
    return ['text', 'words', 'readtime', 'theme', 'show-grade', 'show-words'];
  }

  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const rawText = this.getAttribute('text') || '';
    const explicitWords = this.getAttribute('words');
    const explicitReadTime = this.getAttribute('readtime');
    const theme = (this.getAttribute('theme') || 'dark') as 'dark' | 'light' | 'editorial' | 'minimal';
    const showGrade = this.getAttribute('show-grade') !== 'false';
    const showWords = this.getAttribute('show-words') !== 'false';

    let wordCount = explicitWords ? parseInt(explicitWords, 10) : 0;
    let readTimeFormatted = explicitReadTime || '1 min read';
    let gradeLabel = 'Grade 8';
    let difficultyColor = '#10b981'; // Green

    if (rawText.trim().length > 0) {
      const profile = profileText(rawText);
      wordCount = profile.wordCount;
      readTimeFormatted = profile.readTime.silentReadingFormatted;
      gradeLabel = `Grade ${profile.readability.consensusGrade}`;

      const fre = profile.readability.fleschReadingEase;
      if (fre >= 70) difficultyColor = '#10b981'; // Easy / Green
      else if (fre >= 50) difficultyColor = '#f59e0b'; // Medium / Amber
      else difficultyColor = '#ef4444'; // Hard / Red
    }

    // Styles per theme
    const isLight = theme === 'light';
    const isMinimal = theme === 'minimal';
    const isEditorial = theme === 'editorial';

    const bgColor = isMinimal ? 'transparent' : isLight ? '#f8fafc' : isEditorial ? '#fffbeb' : '#0f172a';
    const textColor = isLight ? '#1e293b' : isEditorial ? '#78350f' : isMinimal ? '#64748b' : '#f1f5f9';
    const borderColor = isMinimal ? 'transparent' : isLight ? '#e2e8f0' : isEditorial ? '#fde68a' : '#1e293b';

    this.shadow.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .badge-container {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: ${bgColor};
          color: ${textColor};
          border: 1px solid ${borderColor};
          padding: ${isMinimal ? '2px 0' : '4px 10px'};
          border-radius: 9999px;
          font-size: 12px;
          line-height: 1.4;
          box-sizing: border-box;
          font-weight: 500;
        }
        .icon {
          display: inline-flex;
          align-items: center;
          opacity: 0.8;
        }
        .read-time {
          font-weight: 600;
        }
        .divider {
          opacity: 0.3;
        }
        .grade-pill {
          display: inline-flex;
          align-items: center;
          background: ${difficultyColor}22;
          color: ${difficultyColor};
          padding: 1px 6px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }
        .word-count {
          opacity: 0.75;
          font-size: 11px;
        }
      </style>
      <div class="badge-container">
        <span class="icon">⏱️</span>
        <span class="read-time">${readTimeFormatted}</span>
        ${showGrade ? `
          <span class="divider">•</span>
          <span class="grade-pill">${gradeLabel}</span>
        ` : ''}
        ${showWords && wordCount > 0 ? `
          <span class="divider">•</span>
          <span class="word-count">${wordCount.toLocaleString()} words</span>
        ` : ''}
      </div>
    `;
  }
}

// Auto-register custom element if running in browser window
if (typeof window !== 'undefined' && typeof customElements !== 'undefined') {
  if (!customElements.get('leximetric-badge')) {
    customElements.define('leximetric-badge', LexiMetricBadge);
  }
}

/**
 * Generates copy-pasteable script and HTML embed tags for publishers
 */
export function generateEmbedSnippet(options: {
  textSnippet?: string;
  theme?: string;
  showGrade?: boolean;
}): string {
  const theme = options.theme || 'dark';
  const showGrade = options.showGrade !== false;

  return `<!-- LexiMetric Live Editorial Badge -->
<script type="module" src="https://cdn.jsdelivr.net/npm/leximetric@1.1.0/dist/badge.js"></script>
<leximetric-badge
  theme="${theme}"
  show-grade="${showGrade}"
  text="Paste article content or excerpt here..."
></leximetric-badge>`;
}
