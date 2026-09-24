import { describe, it, expect } from 'vitest';
import {
  detectLanguage,
  countSpanishSyllables,
  countGermanSyllables,
  countFrenchSyllables,
  calculateMultilingualReadability
} from '../src/core/multilingual.js';
import { profileText } from '../src/core/linguistics.js';

describe('Multilingual Readability & Language Identification Engine', () => {

  describe('Language Detection', () => {
    it('accurately identifies Spanish editorial text', () => {
      const text = 'Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.';
      const res = detectLanguage(text);
      expect(res.language).toBe('es');
      expect(res.languageName).toBe('Spanish');
      expect(res.confidence).toBeGreaterThan(0.5);
    });

    it('accurately identifies German technical and journalistic text', () => {
      const text = 'Die Bundesregierung hat einen Gesetzentwurf zur Förderung der erneuerbaren Energien beschlossen und die Maßnahmen im Kabinett ausführlich diskutiert.';
      const res = detectLanguage(text);
      expect(res.language).toBe('de');
      expect(res.languageName).toBe('German');
      expect(res.confidence).toBeGreaterThan(0.5);
    });

    it('accurately identifies French literary and news text', () => {
      const text = 'Aujourd’hui, maman est morte. Ou peut-être hier, je ne sais pas. J’ai reçu un télégramme de l’asile: Mère décédée. Enterrement demain. Sentiments distingués.';
      const res = detectLanguage(text);
      expect(res.language).toBe('fr');
      expect(res.languageName).toBe('French');
      expect(res.confidence).toBeGreaterThan(0.4);
    });

    it('accurately identifies Italian editorial text', () => {
      const text = 'La transizione ecologica e lo sviluppo sostenibile sono temi fondamentali per il futuro della nostra economia e delle generazioni future in Italia.';
      const res = detectLanguage(text);
      expect(res.language).toBe('it');
      expect(res.languageName).toBe('Italian');
      expect(res.confidence).toBeGreaterThan(0.5);
    });

    it('accurately identifies Portuguese text', () => {
      const text = 'O desenvolvimento sustentável e a preservação dos recursos naturais são essenciais para o futuro das próximas gerações em todo o mundo.';
      const res = detectLanguage(text);
      expect(res.language).toBe('pt');
      expect(res.languageName).toBe('Portuguese');
      expect(res.confidence).toBeGreaterThan(0.5);
    });

    it('accurately identifies English text', () => {
      const text = 'The quick brown fox jumps over the lazy dog while journalists investigate the breaking news across digital publishing networks.';
      const res = detectLanguage(text);
      expect(res.language).toBe('en');
      expect(res.languageName).toBe('English');
    });
  });

  describe('Language-Specific Phonetic Syllables', () => {
    it('computes Spanish syllables with diphthongs and hiatus correctly', () => {
      expect(countSpanishSyllables('sol')).toBe(1);
      expect(countSpanishSyllables('casa')).toBe(2);
      expect(countSpanishSyllables('ciudad')).toBe(2); // ciu-dad (diphthong iu)
      expect(countSpanishSyllables('hielo')).toBe(2);  // hie-lo (diphthong ie)
      expect(countSpanishSyllables('poeta')).toBe(3);  // po-e-ta (hiatus oe)
      expect(countSpanishSyllables('teatro')).toBe(3); // te-a-tro (hiatus ea)
      expect(countSpanishSyllables('universidad')).toBe(5);
    });

    it('computes German syllables with compound diphthongs and umlauts correctly', () => {
      expect(cleanSyl(countGermanSyllables('Haus'))).toBe(1);
      expect(cleanSyl(countGermanSyllables('Kaiser'))).toBe(2);
      expect(cleanSyl(countGermanSyllables('Bundesregierung'))).toBe(5);
      expect(cleanSyl(countGermanSyllables('Mädchen'))).toBe(2);
      expect(cleanSyl(countGermanSyllables('Entwicklung'))).toBe(3);
    });

    it('computes French syllables with silent terminal endings correctly', () => {
      expect(countFrenchSyllables('mer')).toBe(1);
      expect(countFrenchSyllables('maison')).toBe(2);
      expect(countFrenchSyllables('journaliste')).toBe(3); // jour-na-liste (silent e)
      expect(countFrenchSyllables('développement')).toBe(4);
    });
  });

  describe('Formulas & Metrics Calculation', () => {
    it('calculates Spanish Fernández-Huerta and Gutiérrez de Polini scores', () => {
      const res = calculateMultilingualReadability('es', {
        wordCount: 100,
        sentenceCount: 5,
        syllableCount: 180,
        characterCountWithoutSpaces: 450,
        polysyllableCount: 20
      });

      expect(res.language).toBe('es');
      expect(res.score).toBeGreaterThan(0);
      expect(res.score).toBeLessThanOrEqual(100);
      expect(res.secondaryLabel).toBe('Gutiérrez de Polini');
      expect(res.interpretation).toBeDefined();
    });

    it('calculates German Wiener Sachtextformel (WSTF)', () => {
      const res = calculateMultilingualReadability('de', {
        wordCount: 120,
        sentenceCount: 6,
        syllableCount: 240,
        characterCountWithoutSpaces: 700,
        polysyllableCount: 30,
        monosyllableCount: 50,
        longWordsCount: 40
      });

      expect(res.language).toBe('de');
      expect(res.score).toBeGreaterThan(1);
      expect(res.score).toBeLessThanOrEqual(15);
      expect(res.interpretation).toBeDefined();
    });

    it('calculates French Flesch-Kandel adaptation', () => {
      const res = calculateMultilingualReadability('fr', {
        wordCount: 150,
        sentenceCount: 8,
        syllableCount: 220,
        characterCountWithoutSpaces: 650,
        polysyllableCount: 25
      });

      expect(res.language).toBe('fr');
      expect(res.score).toBeGreaterThan(0);
      expect(res.score).toBeLessThanOrEqual(100);
      expect(res.secondaryLabel).toBe('Flesch-Kandel');
    });

    it('calculates Italian Indice Gulpease', () => {
      const res = calculateMultilingualReadability('it', {
        wordCount: 100,
        sentenceCount: 5,
        syllableCount: 200,
        characterCountWithoutSpaces: 480,
        polysyllableCount: 20
      });

      expect(res.language).toBe('it');
      expect(res.secondaryLabel).toBe('Indice Gulpease');
      expect(res.score).toBeGreaterThan(0);
      expect(res.score).toBeLessThanOrEqual(100);
      expect(res.gradeEquivalent).toBeDefined();
    });

    it('calculates Portuguese Flesch-Fernández PT', () => {
      const res = calculateMultilingualReadability('pt', {
        wordCount: 120,
        sentenceCount: 6,
        syllableCount: 220,
        characterCountWithoutSpaces: 550,
        polysyllableCount: 22
      });

      expect(res.language).toBe('pt');
      expect(res.secondaryLabel).toBe('Flesch-Fernández PT');
      expect(res.score).toBeGreaterThan(0);
      expect(res.score).toBeLessThanOrEqual(100);
      expect(res.gradeEquivalent).toBeDefined();
    });
  });

  describe('Integration with profileText()', () => {
    it('automatically attaches multilingual metadata when profiling Spanish text', () => {
      const spanishArticle = 'La inteligencia artificial está transformando la redacción periodística en todo el mundo. Los editores utilizan algoritmos para analizar la legibilidad de las noticias con gran precisión.';
      const profile = profileText(spanishArticle);

      expect(profile.detectedLanguage).toBeDefined();
      expect(profile.detectedLanguage?.language).toBe('es');
      expect(profile.multilingualReadability).toBeDefined();
      expect(profile.multilingualReadability?.language).toBe('es');
      expect(profile.multilingualReadability?.score).toBeGreaterThan(0);
    });

    it('automatically attaches multilingual metadata when profiling Italian text', () => {
      const italianArticle = 'La transizione ecologica rappresenta un obiettivo cruciale per lo sviluppo dell\'industria moderna. Molti ricercatori studiano soluzioni sostenibili per ridurre le emissioni.';
      const profile = profileText(italianArticle);

      expect(profile.detectedLanguage?.language).toBe('it');
      expect(profile.multilingualReadability?.language).toBe('it');
      expect(profile.multilingualReadability?.secondaryLabel).toBe('Indice Gulpease');
    });

    it('automatically attaches multilingual metadata when profiling Portuguese text', () => {
      const ptArticle = 'O desenvolvimento tecnológico proporciona grandes oportunidades para a educação e para o avanço da ciência em Portugal e no Brasil.';
      const profile = profileText(ptArticle);

      expect(profile.detectedLanguage?.language).toBe('pt');
      expect(profile.multilingualReadability?.language).toBe('pt');
      expect(profile.multilingualReadability?.secondaryLabel).toBe('Flesch-Fernández PT');
    });
  });
});

function cleanSyl(n: number): number {
  return n;
}
