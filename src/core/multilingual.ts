/**
 * LexiMetric Multilingual Readability & Language Engine
 * Zero-dependency client-side international linguistic profiling
 */

export type SupportedLanguage = 'en' | 'es' | 'de' | 'fr' | 'it' | 'pt';

export interface LanguageDetectionResult {
  language: SupportedLanguage;
  confidence: number;
  languageName: string;
}

export interface MultilingualReadabilityResult {
  language: SupportedLanguage;
  languageName: string;
  score: number;
  interpretation: string;
  secondaryScore?: number;
  secondaryLabel?: string;
  gradeEquivalent: number;
}

// Characteristic stopwords for deterministic zero-dependency language identification
const STOPWORDS: Record<SupportedLanguage, Set<string>> = {
  es: new Set([
    'de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un', 'para',
    'con', 'no', 'una', 'su', 'al', 'lo', 'como', 'mas', 'pero', 'sus', 'le', 'ya', 'o',
    'este', 'si', 'porque', 'esta', 'son', 'entre', 'esta', 'cuando', 'muy', 'sin', 'sobre',
    'tambien', 'me', 'hasta', 'hay', 'donde', 'quien', 'desde', 'todos', 'nos', 'durante'
  ]),
  de: new Set([
    'der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des', 'auf', 'für',
    'ist', 'im', 'dem', 'nicht', 'ein', 'eine', 'als', 'auch', 'es', 'an', 'werden', 'aus',
    'er', 'hat', 'dass', 'sie', 'nach', 'wird', 'bei', 'einer', 'um', 'am', 'sind', 'noch',
    'wie', 'einem', 'über', 'einen', 'so', 'sie', 'war', 'haben', 'nur', 'oder', 'aber', 'vor'
  ]),
  fr: new Set([
    'de', 'la', 'le', 'et', 'les', 'des', 'en', 'un', 'du', 'une', 'que', 'est', 'pour', 'qui',
    'dans', 'a', 'par', 'plus', 'pas', 'au', 'sur', 'ne', 'se', 'avec', 'ce', 'il', 'sont',
    'ont', 'ses', 'mais', 'ou', 'comme', 'nous', 'sa', 'leur', 'cette', 'aux', 'aussi',
    'hier', 'demain', 'tout', 'tous', 'faire', 'tres', 'maman', 'mon', 'mes'
  ]),
  it: new Set([
    'di', 'la', 'il', 'che', 'in', 'un', 'una', 'per', 'con', 'del', 'della', 'non', 'da',
    'le', 'si', 'ed', 'ha', 'delle', 'dei', 'ma', 'sono', 'al', 'nel', 'come', 'anche',
    'era', 'questo', 'questa', 'piu', 'su', 'loro', 'se', 'ci', 'ad', 'dopo', 'gli', 'suo', 'sua'
  ]),
  pt: new Set([
    'de', 'que', 'do', 'da', 'em', 'um', 'para', 'com', 'nao', 'uma', 'os', 'no', 'se',
    'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem',
    'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'ha', 'nos', 'estao', 'eu', 'tambem'
  ]),
  en: new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on',
    'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we',
    'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their'
  ])
};

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Spanish',
  de: 'German',
  fr: 'French',
  it: 'Italian',
  pt: 'Portuguese'
};

/**
 * Detects the language of input text using statistical stopword density
 */
export function detectLanguage(text: string): LanguageDetectionResult {
  // Sample up to first 2,500 characters for instantaneous detection without large allocations
  const sample = text.length > 2500 ? text.slice(0, 2500) : text;
  const words = sample.toLowerCase().match(/\b[a-záéíóúüñäößàâçèêëîïôûùãõâêôçèéìòù]{2,}\b/gu) || [];
  if (words.length === 0) {
    return { language: 'en', confidence: 1, languageName: 'English' };
  }

  const scores: Record<SupportedLanguage, number> = { en: 0, es: 0, de: 0, fr: 0, it: 0, pt: 0 };

  for (const word of words) {
    for (const lang of (['es', 'de', 'fr', 'it', 'pt', 'en'] as SupportedLanguage[])) {
      if (STOPWORDS[lang].has(word)) {
        scores[lang]++;
      }
    }
    // High-precision diacritic hints
    if (/[áíóúñ¿¡]/.test(word)) scores.es += 2;
    if (/[äöüß]/.test(word)) scores.de += 2;
    if (/[œæ]/.test(word)) scores.fr += 2;
    if (/[ãõçâêô]/.test(word)) scores.pt += 2;
    if (/[àèéìòù]/.test(word)) { scores.it += 1; scores.fr += 1; }
  }

  let bestLang: SupportedLanguage = 'en';
  let maxScore = -1;

  for (const lang of (['en', 'es', 'de', 'fr', 'it', 'pt'] as SupportedLanguage[])) {
    if (scores[lang] > maxScore) {
      maxScore = scores[lang];
      bestLang = lang;
    }
  }

  const totalMatches = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalMatches > 0 ? Math.min(1, Math.round((maxScore / totalMatches) * 100) / 100) : 0.5;

  return {
    language: bestLang,
    confidence,
    languageName: LANGUAGE_NAMES[bestLang]
  };
}

/**
 * Counts syllables for Spanish words based on phonetic diphthong & hiatus rules
 */
export function countSpanishSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
  if (!clean) return 0;
  if (clean.length <= 2) return 1;

  // Spanish strong vowels: a, e, o. Weak vowels: i, u (and accented weak vowels í, ú act as strong)
  // Match vowel groups: diphthongs (strong+weak, weak+strong, weak+weak) form single syllable.
  // Hiatus (strong+strong or strong+accented weak) form separate syllables.
  const vowels = clean.match(/[aáeéoóiíuúü]+/g);
  if (!vowels) return 1;

  let syllables = 0;
  for (const v of vowels) {
    // If vowel group has length 1, it's 1 syllable
    if (v.length === 1) {
      syllables++;
    } else {
      // Analyze diphthongs vs hiatus
      const strongCount = (v.match(/[aáeéoóíú]/g) || []).length;
      if (strongCount > 1) {
        // Two strong vowels in sequence form a hiatus (e.g., 'ae', 'eo', 'aí')
        syllables += strongCount;
      } else {
        // Single diphthong or triphthong
        syllables += 1;
      }
    }
  }
  return Math.max(1, syllables);
}

/**
 * Counts syllables for German words based on vowel clusters and diphthongs
 */
export function countGermanSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-zäöüß]/g, '');
  if (!clean) return 0;
  if (clean.length <= 2) return 1;

  // German diphthongs/vowel clusters that count as single syllable: ei, ey, ai, ay, au, eu, äu, ie
  const normalized = clean
    .replace(/(ei|ey|ai|ay|au|eu|äu|ie)/g, 'V')
    .replace(/[aeiouäöüy]/g, 'V');

  const matches = normalized.match(/V+/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Counts syllables for French words with silent terminal e and liaison rules
 */
export function countFrenchSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-zàâçèêëîïôûùœæ]/g, '');
  if (!clean) return 0;
  if (clean.length <= 2) return 1;

  // French vowel groups: eau, au, ou, ai, ei, oi, eu
  let stripped = clean
    .replace(/(eau|au|ou|ai|ei|oi|eu|œu)/g, 'V')
    .replace(/[aeiouyàâèêëîïôûùœæ]/g, 'V');

  // Trailing silent 'e' or 'es' or 'ent' (in polysyllables)
  if (clean.length > 3 && /(e|es|ent)$/.test(clean) && !/[éèêë]/.test(clean.slice(-2))) {
    if (stripped.endsWith('V')) {
      stripped = stripped.slice(0, -1);
    }
  }

  const matches = stripped.match(/V+/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Counts syllables for Italian words
 */
export function countItalianSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-zàèéìòù]/g, '');
  if (!clean) return 0;
  if (clean.length <= 2) return 1;

  const vowels = clean.match(/[aàeèéiìoòóuù]+/g);
  if (!vowels) return 1;

  let syllables = 0;
  for (const v of vowels) {
    if (v.length === 1) {
      syllables++;
    } else {
      const strongCount = (v.match(/[aàeèéoòó]/g) || []).length;
      syllables += strongCount > 1 ? strongCount : 1;
    }
  }
  return Math.max(1, syllables);
}

/**
 * Counts syllables for Portuguese words
 */
export function countPortugueseSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-záéíóúãõâêôç]/g, '');
  if (!clean) return 0;
  if (clean.length <= 2) return 1;

  const vowels = clean.match(/[aáãâeéêiíoóõôuú]+/g);
  if (!vowels) return 1;

  let syllables = 0;
  for (const v of vowels) {
    if (v.length === 1) {
      syllables++;
    } else {
      const strongCount = (v.match(/[aáãâeéêoóõô]/g) || []).length;
      syllables += strongCount > 1 ? strongCount : 1;
    }
  }
  return Math.max(1, syllables);
}

/**
 * Dispatches syllable counting for supported languages
 */
export function countMultilingualSyllables(word: string, lang: SupportedLanguage): number {
  switch (lang) {
    case 'es': return countSpanishSyllables(word);
    case 'de': return countGermanSyllables(word);
    case 'fr': return countFrenchSyllables(word);
    case 'it': return countItalianSyllables(word);
    case 'pt': return countPortugueseSyllables(word);
    default: return countSpanishSyllables(word);
  }
}

export interface MultilingualMetricsInput {
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  characterCountWithoutSpaces: number;
  polysyllableCount: number; // >= 3 syllables
  monosyllableCount?: number;
  longWordsCount?: number; // >= 6 chars
}

/**
 * Calculates language-specific readability metrics
 */
export function calculateMultilingualReadability(
  lang: SupportedLanguage,
  metrics: MultilingualMetricsInput
): MultilingualReadabilityResult {
  const {
    wordCount,
    sentenceCount,
    syllableCount,
    characterCountWithoutSpaces,
    polysyllableCount
  } = metrics;

  if (wordCount === 0 || sentenceCount === 0) {
    return {
      language: lang,
      languageName: LANGUAGE_NAMES[lang],
      score: 0,
      interpretation: 'Insufficient text',
      gradeEquivalent: 0
    };
  }

  const asl = wordCount / sentenceCount;
  const asw = syllableCount / wordCount;
  const lettersPerWord = characterCountWithoutSpaces / wordCount;

  switch (lang) {
    case 'es': {
      // Fernández-Huerta: 206.84 - 0.60 * (Syllables/Words * 100) - 1.02 * ASL
      const sylPer100Words = asw * 100;
      const rawFH = 206.84 - (0.60 * sylPer100Words) - (1.02 * asl);
      const score = Math.round(Math.max(0, Math.min(100, rawFH)) * 10) / 10;

      // Gutiérrez de Polini: 95.2 - 9.7 * (Letters/Words) - 0.35 * ASL
      const rawGutierrez = 95.2 - (9.7 * lettersPerWord) - (0.35 * asl);
      const secondaryScore = Math.round(Math.max(0, Math.min(100, rawGutierrez)) * 10) / 10;

      let interpretation = 'Normal';
      let grade = 8;
      if (score >= 90) { interpretation = 'Muy fácil (4º Primaria)'; grade = 4; }
      else if (score >= 80) { interpretation = 'Fácil (5º Primaria)'; grade = 5; }
      else if (score >= 70) { interpretation = 'Bastante fácil (6º Primaria)'; grade = 6; }
      else if (score >= 60) { interpretation = 'Normal (ESO / Secundaria)'; grade = 8; }
      else if (score >= 50) { interpretation = 'Algo difícil (Bachillerato)'; grade = 11; }
      else if (score >= 30) { interpretation = 'Difícil (Universidad)'; grade = 14; }
      else { interpretation = 'Muy difícil (Especializado / Posgrado)'; grade = 16; }

      return {
        language: 'es',
        languageName: 'Spanish',
        score,
        interpretation,
        secondaryScore,
        secondaryLabel: 'Gutiérrez de Polini',
        gradeEquivalent: grade
      };
    }

    case 'de': {
      // Wiener Sachtextformel (WSTF 1):
      // WSTF = 0.1935 * MS + 0.1672 * SL + 0.1297 * IW - 0.0327 * ES - 0.875
      const ms = (polysyllableCount / wordCount) * 100; // % words >= 3 syllables
      const sl = asl; // sentence length
      const iw = ((metrics.longWordsCount ?? (polysyllableCount * 1.2)) / wordCount) * 100; // % words >= 6 letters
      const es = ((metrics.monosyllableCount ?? (wordCount - polysyllableCount)) / wordCount) * 100; // % 1-syllable words

      const rawWstf = 0.1935 * ms + 0.1672 * sl + 0.1297 * iw - 0.0327 * es - 0.875;
      const score = Math.round(Math.max(1, Math.min(15, rawWstf)) * 10) / 10;

      let interpretation = 'Mittelschwer (Realschule)';
      if (score <= 4) interpretation = 'Sehr leicht (Grundschule)';
      else if (score <= 6) interpretation = 'Leicht (Unterstufe)';
      else if (score <= 9) interpretation = 'Mittelschwer (Mittelstufe)';
      else if (score <= 12) interpretation = 'Schwer (Oberstufe)';
      else interpretation = 'Sehr schwer (Hochschule / Fachliteratur)';

      return {
        language: 'de',
        languageName: 'German',
        score,
        interpretation,
        secondaryScore: score,
        secondaryLabel: 'Wiener Sachtextformel',
        gradeEquivalent: Math.round(score)
      };
    }

    case 'fr': {
      // Flesch-Kandel: 207 - (1.015 * ASL) - (73.6 * ASW)
      const rawKandel = 207 - (1.015 * asl) - (73.6 * asw);
      const score = Math.round(Math.max(0, Math.min(100, rawKandel)) * 10) / 10;

      let interpretation = 'Standard';
      let grade = 8;
      if (score >= 80) { interpretation = 'Très facile'; grade = 5; }
      else if (score >= 60) { interpretation = 'Facile (Collège)'; grade = 7; }
      else if (score >= 50) { interpretation = 'Standard (Lycée)'; grade = 10; }
      else if (score >= 30) { interpretation = 'Difficile (Enseignement supérieur)'; grade = 13; }
      else { interpretation = 'Très difficile (Technique / Recherche)'; grade = 16; }

      return {
        language: 'fr',
        languageName: 'French',
        score,
        interpretation,
        secondaryScore: score,
        secondaryLabel: 'Flesch-Kandel',
        gradeEquivalent: grade
      };
    }

    case 'it': {
      // Indice Gulpease: 89 - 10 * (Letters / Words) + 300 * (Sentences / Words)
      const rawGulpease = 89 - (10 * lettersPerWord) + (300 * (1 / asl));
      const score = Math.round(Math.max(0, Math.min(100, rawGulpease)) * 10) / 10;

      let interpretation = 'Medio (Diploma superiore)';
      let grade = 12;
      if (score >= 80) { interpretation = 'Molto facile (Licenza elementare)'; grade = 5; }
      else if (score >= 60) { interpretation = 'Facile (Licenza media)'; grade = 8; }
      else if (score >= 40) { interpretation = 'Medio (Diploma superiore)'; grade = 12; }
      else { interpretation = 'Difficile (Laurea / Specializzato)'; grade = 16; }

      return {
        language: 'it',
        languageName: 'Italian',
        score,
        interpretation,
        secondaryScore: score,
        secondaryLabel: 'Indice Gulpease',
        gradeEquivalent: grade
      };
    }

    case 'pt': {
      // Flesch-Fernández PT: 248.835 - 1.015 * ASL - 84.6 * ASW
      const rawPt = 248.835 - (1.015 * asl) - (84.6 * asw);
      const score = Math.round(Math.max(0, Math.min(100, rawPt)) * 10) / 10;

      let interpretation = 'Médio / Padrão';
      let grade = 11;
      if (score >= 75) { interpretation = 'Muito fácil (Ensino Fundamental I)'; grade = 5; }
      else if (score >= 60) { interpretation = 'Fácil (Ensino Fundamental II)'; grade = 8; }
      else if (score >= 50) { interpretation = 'Médio / Padrão (Ensino Médio)'; grade = 11; }
      else if (score >= 30) { interpretation = 'Difícil (Ensino Superior)'; grade = 14; }
      else { interpretation = 'Muito difícil (Acadêmico / Pós-graduação)'; grade = 17; }

      return {
        language: 'pt',
        languageName: 'Portuguese',
        score,
        interpretation,
        secondaryScore: score,
        secondaryLabel: 'Flesch-Fernández PT',
        gradeEquivalent: grade
      };
    }

    default: {
      // English Flesch Reading Ease
      const rawFre = 206.835 - (1.015 * asl) - (84.6 * asw);
      const score = Math.round(Math.max(0, Math.min(100, rawFre)) * 10) / 10;
      return {
        language: 'en',
        languageName: 'English',
        score,
        interpretation: score >= 60 ? 'Plain English' : 'Technical / Difficult',
        secondaryScore: score,
        secondaryLabel: 'Flesch Reading Ease',
        gradeEquivalent: score >= 60 ? 8 : 12
      };
    }
  }
}
