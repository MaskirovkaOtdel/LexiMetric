import React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import { countSyllables } from '../src/core/syllables.js';
import { calculateReadability } from '../src/core/readability.js';
import { isDaleChallFamiliar, DALE_CHALL_SET } from '../src/core/daleChallWords.js';
import { profileText } from '../src/core/linguistics.js';
import { calculateReadTime } from '../src/core/readTime.js';
import { PricingModal } from '../src/ui/components/PricingModal.tsx';

describe('Community Edition End-to-End Test Suite (R1, R2, R3)', () => {

  describe('R1: Deepened Algorithmic Linguistic Profiling', () => {

    it('R1.1: accurately counts syllables across irregular suffixes and compound decompositions', () => {
      // Compound words
      expect(countSyllables('firefly')).toBe(2);
      expect(countSyllables('barefoot')).toBe(2);
      expect(countSyllables('whiteboard')).toBe(2);
      expect(countSyllables('watermelon')).toBe(4);
      expect(countSyllables('grapefruit')).toBe(2);

      // Irregular suffixes
      expect(countSyllables('safely')).toBe(2);
      expect(countSyllables('management')).toBe(3);
      expect(countSyllables('completely')).toBe(3);
      expect(countSyllables('definitely')).toBe(4);
      expect(countSyllables('hopeless')).toBe(2);
      expect(countSyllables('statewide')).toBe(2);
    });

    it('R1.2: verifies Dale-Chall 3,000 familiar word list and morphological stemmer', () => {
      expect(DALE_CHALL_SET.size).toBeGreaterThanOrEqual(2900);

      // Root words
      expect(isDaleChallFamiliar('apple')).toBe(true);
      expect(isDaleChallFamiliar('water')).toBe(true);
      expect(isDaleChallFamiliar('school')).toBe(true);

      // Inflections
      expect(isDaleChallFamiliar('apples')).toBe(true);
      expect(isDaleChallFamiliar('watered')).toBe(true);
      expect(isDaleChallFamiliar('watering')).toBe(true);
      expect(isDaleChallFamiliar('jumped')).toBe(true);
      expect(isDaleChallFamiliar('jumping')).toBe(true);
      expect(isDaleChallFamiliar('happier')).toBe(true);
      expect(isDaleChallFamiliar('happiest')).toBe(true);
      expect(isDaleChallFamiliar('quickly')).toBe(true);

      // Unfamiliar / technical terms
      expect(isDaleChallFamiliar('epistemology')).toBe(false);
      expect(isDaleChallFamiliar('phenomenological')).toBe(false);
      expect(isDaleChallFamiliar('jurisprudence')).toBe(false);
    });

    it('R1.3: computes 8 readability formulas and consensus grade', () => {
      const stats = {
        wordCount: 150,
        sentenceCount: 10,
        syllableCount: 220,
        polysyllableCount: 20,
        characterCountWithoutSpaces: 750,
        difficultWordsCount: 25
      };

      const readability = calculateReadability(stats);

      expect(readability.fleschReadingEase).toBeGreaterThan(0);
      expect(readability.fleschKincaidGrade).toBeGreaterThan(0);
      expect(readability.gunningFog).toBeGreaterThan(0);
      expect(readability.colemanLiauIndex).toBeGreaterThan(0);
      expect(readability.smogIndex).toBeGreaterThan(0);
      expect(readability.automatedReadabilityIndex).toBeGreaterThan(0);
      expect(readability.daleChallIndex).toBeGreaterThan(0);
      expect(readability.linsearWrite).toBeGreaterThan(0);
      expect(readability.consensusGrade).toBeDefined();
      expect(readability.consensusConfidence).toBeDefined();
    });

    it('R1.4: detects passive voice with agent clause and provides active voice rewrites', () => {
      const text = 'The new software release was approved by the engineering director yesterday.';
      const profile = profileText(text);

      const passiveSpan = profile.spans.find(s => s.type === 'passive');
      expect(passiveSpan).toBeDefined();
      expect(passiveSpan?.text).toBe('was approved by the engineering director');
      expect(passiveSpan?.fixReplacement).toBe('the engineering director approved');
    });

    it('R1.5: flags wordiness with character spans and concrete replacement alternatives', () => {
      const text = 'In order to optimize throughput, we must act at this point in time.';
      const profile = profileText(text);

      const wordySpans = profile.spans.filter(s => s.type === 'wordiness');
      expect(wordySpans.length).toBeGreaterThanOrEqual(2);

      const inOrderTo = wordySpans.find(s => s.text.toLowerCase().includes('in order to'));
      expect(inOrderTo).toBeDefined();
      // Capitalized since it is at the start of sentence
      expect(inOrderTo?.fixReplacement).toBe('To');

      const atThisPoint = wordySpans.find(s => s.text.toLowerCase().includes('at this point in time'));
      expect(atThisPoint).toBeDefined();
      expect(atThisPoint?.fixReplacement).toBe('now');
    });
  });

  describe('R2: Interactive Editorial Workflow & Visual Profiling', () => {

    it('R2.1: simulates one-click replacement fix application preserving manuscript integrity', () => {
      const original = 'We need this in order to proceed due to the fact that testing matters.';
      const profile = profileText(original);

      // Sort spans by start index descending to apply multiple without offset invalidation
      const sortedSpans = [...profile.spans].filter(s => !!s.fixReplacement).sort((a, b) => b.startIndex - a.startIndex);
      let updated = original;

      for (const span of sortedSpans) {
        updated = updated.slice(0, span.startIndex) + span.fixReplacement + updated.slice(span.endIndex);
      }

      expect(updated).not.toContain('in order to');
      expect(updated).not.toContain('due to the fact that');
      expect(updated).toContain('to proceed');
      expect(updated).toContain('because testing matters');
    });

    it('R2.2: computes paragraph-level sentence cadence for heatmap visualization', () => {
      const text = 'Short punchy lead. This is an average length second sentence with normal rhythm and balanced cadence structure. Finally, we conclude with an intentionally lengthened, highly descriptive, and remarkably thorough concluding observation that illustrates complex rhythm in a single paragraph right now today. Furthermore, to demonstrate run on detection we have constructed a deliberately stretched sentence containing more than thirty words that goes on and on without necessary syntactic pauses or terminal punctuation until the threshold is passed.';
      const profile = profileText(text);

      expect(profile.sentences.length).toBe(4);
      expect(profile.shortSentencesCount).toBeGreaterThanOrEqual(1);
      expect(profile.standardSentencesCount).toBeGreaterThanOrEqual(1);
      expect(profile.longSentencesCount).toBeGreaterThanOrEqual(1);
      expect(profile.runOnSentencesCount).toBeGreaterThanOrEqual(1);
    });

    it('R2.3: computes reading velocity and audio duration models accurately', () => {
      const readTime = calculateReadTime(1000, 1.4); // 1000 words, 1.4 avg syllables

      expect(readTime.silentReadingSeconds).toBeGreaterThan(0);
      expect(readTime.silentReadingFormatted).toBeDefined();
      expect(readTime.speakingSeconds).toBeGreaterThan(0);
      expect(readTime.speakingFormatted).toBeDefined();
      expect(readTime.presets.slowReader.wpm).toBeLessThan(readTime.presets.fastReader.wpm);
      expect(readTime.adjustedSilentWpm).toBeGreaterThan(100);
    });
  });

  describe('R3: Commercial Plans & Community Upgrade Bridge (PricingModal)', () => {

    it('R3.1: renders all 4 commercial tiers (Community, Creator, Newsroom, Enterprise) with accurate pricing and allocations', () => {
      // Test when isOpen is false
      const closedHtml = renderToString(React.createElement(PricingModal, { isOpen: false, onClose: () => {} }));
      expect(closedHtml).toBe('');

      // Test when isOpen is true
      const html = renderToString(React.createElement(PricingModal, { isOpen: true, onClose: () => {} }));
      expect(html).toContain('Scale Your Newsroom &amp; Editorial Workflow');
      expect(html).toContain('License Delivery Email');

      // 1. Community ($0)
      expect(html).toContain('Community');
      expect(html).toContain('$0');
      expect(html).toContain('Current Active Plan');
      expect(html).toContain('6 Classic Readability Formulas');

      // 2. Pro Creator ($19)
      expect(html).toContain('Pro Creator');
      expect(html).toContain('$19');
      expect(html).toContain('Get Creator ($19)');
      expect(html).toContain('Automated Tone Rewrites');
      expect(html).toContain('Custom Stylebooks &amp; Rules');
      expect(html).toContain('1200x630 Social Card Generator');
      expect(html).toContain('WordPress Gutenberg Plugin');

      // 3. Pro Newsroom ($49)
      expect(html).toContain('Pro Newsroom');
      expect(html).toContain('$49');
      expect(html).toContain('Most Popular');
      expect(html).toContain('Subscribe Newsroom ($49/mo)');
      expect(html).toContain('Slack &amp; MS Teams Webhook Alerts');
      expect(html).toContain('Multi-Document Batch Profiler');
      expect(html).toContain('Headless REST API Access');
      expect(html).toContain('10 Team Seats &amp; Authorized Domains');

      // 4. Enterprise ($299)
      expect(html).toContain('Enterprise');
      expect(html).toContain('$299');
      expect(html).toContain('Deploy Enterprise ($299/mo)');
      expect(html).toContain('AI Copilot (Ollama / Gemini API)');
      expect(html).toContain('Unlimited Seats &amp; Domains');
      expect(html).toContain('Air-Gapped On-Premises Option');

      // Offline guarantee footer
      expect(html).toContain('Cryptographic offline license engine with zero telemetry phone-home requirements.');
      expect(html).toContain('billing@leximetric.io');
    });

    it('R3.2: validates custom license delivery email input, default state, and input updates', () => {
      let stateValue = 'subscriber@example.com';
      const mockSetEmail = vi.fn((val) => {
        stateValue = typeof val === 'function' ? val(stateValue) : val;
      });

      const internals = (React as any).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
      const prevDispatcher = internals.H;
      internals.H = {
        useState: (init: any) => [init, mockSetEmail]
      };

      try {
        const vnode = PricingModal({
          isOpen: true,
          onClose: () => {}
        });

        expect(vnode).not.toBeNull();
        // Inspect email delivery bar (vnode.props.children.props.children[1])
        const modalBody = vnode.props.children;
        const emailBar = modalBody.props.children[1];
        const emailInput = emailBar.props.children[1];

        expect(emailInput.type).toBe('input');
        expect(emailInput.props.type).toBe('email');
        expect(emailInput.props.value).toBe('subscriber@example.com');
        expect(emailInput.props.placeholder).toBe('subscriber@example.com');

        // Simulate typing custom newsroom domain email
        emailInput.props.onChange({ target: { value: 'editor@heraldpress.com' } });
        expect(mockSetEmail).toHaveBeenCalledWith('editor@heraldpress.com');
      } finally {
        internals.H = prevDispatcher;
      }
    });

    it('R3.3: handles checkout session dispatch to Fastify Pro server and fallback feedback cleanly', async () => {
      const mockOnSelectTier = vi.fn();
      const mockOnClose = vi.fn();
      let alertMsg = '';
      const originalAlert = globalThis.alert;
      const originalOpen = globalThis.window?.open;
      const originalFetch = globalThis.fetch;

      globalThis.alert = vi.fn((msg) => { alertMsg = String(msg); });
      (globalThis as any).window = globalThis.window || {};
      const mockWindowOpen = vi.fn();
      globalThis.window.open = mockWindowOpen;

      const emailInState = 'editorial@heraldpress.com';
      const internals = (React as any).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
      const prevDispatcher = internals.H;
      internals.H = {
        useState: () => [emailInState, vi.fn()]
      };

      try {
        // 1. Test successful Fastify Pro checkout session response
        let sentBody: any = null;
        globalThis.fetch = vi.fn(async (_url, options) => {
          sentBody = JSON.parse(options?.body as string);
          return {
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              sessionId: 'cs_stripe_newsroom_test',
              checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_stripe_newsroom_test'
            })
          } as any;
        });

        const vnodeSuccess = PricingModal({
          isOpen: true,
          onClose: mockOnClose,
          onSelectTier: mockOnSelectTier
        });

        // Trigger Newsroom checkout button
        const matrix = vnodeSuccess.props.children.props.children[2];
        const newsroomCard = matrix.props.children[2];
        const newsroomButton = newsroomCard.props.children[2];

        await newsroomButton.props.onClick();

        expect(mockOnSelectTier).toHaveBeenCalledWith('newsroom');
        expect(sentBody).toEqual({
          tier: 'newsroom',
          email: 'editorial@heraldpress.com',
          provider: 'stripe'
        });
        expect(mockWindowOpen).toHaveBeenCalledWith(
          'https://checkout.stripe.com/c/pay/cs_stripe_newsroom_test',
          '_blank'
        );

        // 2. Test fallback feedback when local Fastify Pro server is not running
        globalThis.fetch = vi.fn(async () => {
          throw new Error('Connection refused: Fastify server offline');
        });

        const vnodeFallback = PricingModal({
          isOpen: true,
          onClose: mockOnClose,
          onSelectTier: mockOnSelectTier
        });

        const creatorCard = matrix.props.children[1];
        const creatorButton = creatorCard.props.children[1];
        await creatorButton.props.onClick();

        expect(mockOnSelectTier).toHaveBeenCalledWith('creator');
        expect(alertMsg).toContain('Initiating secure checkout for LexiMetric Pro (CREATOR) for editorial@heraldpress.com');

        // 3. Test modal close button action
        const header = vnodeSuccess.props.children.props.children[0];
        const closeButton = header.props.children[1];
        closeButton.props.onClick();
        expect(mockOnClose).toHaveBeenCalled();

      } finally {
        globalThis.alert = originalAlert;
        if (originalOpen) globalThis.window.open = originalOpen;
        globalThis.fetch = originalFetch;
        internals.H = prevDispatcher;
      }
    });

    it('R3.4: validates custom license delivery email input format and blocks invalid emails before network dispatch', async () => {
      let alertMsg = '';
      const originalAlert = globalThis.alert;
      const originalFetch = globalThis.fetch;
      const mockFetch = vi.fn();
      globalThis.fetch = mockFetch;
      globalThis.alert = vi.fn((msg) => { alertMsg = String(msg); });

      const invalidEmail = 'not-a-valid-email';
      const internals = (React as any).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
      const prevDispatcher = internals.H;
      internals.H = {
        useState: () => [invalidEmail, vi.fn()]
      };

      try {
        const vnode = PricingModal({
          isOpen: true,
          onClose: () => {}
        });

        const matrix = vnode.props.children.props.children[2];
        const creatorCard = matrix.props.children[1];
        const creatorButton = creatorCard.props.children[1];

        await creatorButton.props.onClick();

        expect(alertMsg).toContain('Please provide a valid email address for license delivery.');
        expect(mockFetch).not.toHaveBeenCalled();
      } finally {
        globalThis.alert = originalAlert;
        globalThis.fetch = originalFetch;
        internals.H = prevDispatcher;
      }
    });
  });
});

