/**
 * LexiMetric WebExtension Popup Controller
 */

import { profileText } from '../core/linguistics.js';

document.addEventListener('DOMContentLoaded', () => {
  const inspectBtn = document.getElementById('inspectBtn') as HTMLButtonElement | null;
  const statusEl = document.getElementById('status') as HTMLElement | null;
  const readTimeEl = document.getElementById('readTime') as HTMLElement | null;
  const fleschEl = document.getElementById('fleschScore') as HTMLElement | null;
  const wordCountEl = document.getElementById('wordCount') as HTMLElement | null;
  const gradeLevelEl = document.getElementById('gradeLevel') as HTMLElement | null;

  if (!inspectBtn) return;

  inspectBtn.addEventListener('click', async () => {
    if (typeof (window as any).chrome === 'undefined' || !(window as any).chrome.tabs) {
      if (statusEl) statusEl.textContent = 'Chrome Extension runtime not detected.';
      return;
    }

    try {
      const [tab] = await (window as any).chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;

      const results = await (window as any).chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const selection = window.getSelection()?.toString();
          if (selection && selection.trim().length > 10) return selection;
          const article = document.querySelector('article') || document.querySelector('main') || document.body;
          return article ? article.innerText : '';
        }
      });

      const extractedText = results?.[0]?.result || '';
      if (!extractedText.trim()) {
        if (statusEl) statusEl.textContent = 'No text found on active page.';
        return;
      }

      const profile = profileText(extractedText);
      if (readTimeEl) readTimeEl.textContent = profile.readTime.silentReadingFormatted;
      if (fleschEl) fleschEl.textContent = `${profile.readability.fleschReadingEase}`;
      if (wordCountEl) wordCountEl.textContent = `${profile.wordCount}`;
      if (gradeLevelEl) gradeLevelEl.textContent = `Gr. ${profile.readability.consensusGrade}`;
      if (statusEl) statusEl.textContent = `Analyzed ${profile.wordCount} words in ${profile.readTime.silentReadingFormatted}.`;
    } catch (err: any) {
      if (statusEl) statusEl.textContent = `Error: ${err?.message || 'Inspection failed'}`;
    }
  });
});
