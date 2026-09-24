/**
 * LexiMetric WebExtension Content Script
 * Attaches real-time read-time telemetry pill to active textarea and editor fields
 */

import { profileText } from '../core/linguistics.js';

(function initLexiMetricPill() {
  if (document.getElementById('leximetric-pill')) return;

  const pill = document.createElement('div');
  pill.id = 'leximetric-pill';
  Object.assign(pill.style, {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    padding: '6px 12px',
    backgroundColor: '#0f172a',
    color: '#38bdf8',
    border: '1px solid #0284c7',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: '999999',
    display: 'none',
    alignItems: 'center',
    gap: '6px',
    pointerEvents: 'none',
    transition: 'all 0.2s ease'
  });

  document.body.appendChild(pill);

  let debounceTimer: any = null;

  function updatePill(text: string) {
    if (!text || text.trim().length < 5) {
      pill.style.display = 'none';
      return;
    }
    const prof = profileText(text);
    pill.textContent = `⚡ ${prof.readTime.silentReadingFormatted} • Flesch ${prof.readability.fleschReadingEase}`;
    pill.style.display = 'flex';
  }

  document.addEventListener('input', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      let text = '';
      if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) {
        text = target.value;
      } else if (target.isContentEditable) {
        text = target.innerText;
      }
      updatePill(text);
    }, 300);
  });
})();
