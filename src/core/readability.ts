export interface ReadabilityScores {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gunningFog: number;
  colemanLiauIndex: number;
  smogIndex: number;
  automatedReadabilityIndex: number;
  daleChallIndex: number;
  linsearWrite: number;
  consensusGrade: number;
  consensusConfidence: 'high' | 'moderate' | 'low';
  gradeRange: { min: number; max: number };
  readingLevel: string;
  difficultyLabel: string;
  targetAudience: string;
  gradeBand: string;
}

export type ReadabilityMetrics = ReadabilityScores;

export interface ReadabilityInput {
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  polysyllableCount: number; // Words with >= 3 syllables
  characterCountWithoutSpaces: number;
  difficultWordsCount?: number; // Dale-Chall unfamiliar words
}

/**
 * Calculates comprehensive readability indexes from token metrics.
 */
export function calculateReadability(input: ReadabilityInput): ReadabilityScores;
export function calculateReadability(
  words: number,
  sentences: number,
  syllables: number,
  complexWords: number,
  polysyllableCount: number,
  letters: number,
  difficultWordsCount?: number
): ReadabilityScores;
export function calculateReadability(
  inputOrWords: ReadabilityInput | number,
  sentencesArg?: number,
  syllablesArg?: number,
  complexWordsArg?: number,
  polysyllableCountArg?: number,
  lettersArg?: number,
  difficultWordsCountArg?: number
): ReadabilityScores {
  let wordCount: number;
  let sentenceCount: number;
  let syllableCount: number;
  let polysyllableCount: number;
  let characterCountWithoutSpaces: number;
  let difficultWordsCount: number | undefined;

  if (typeof inputOrWords === 'number') {
    wordCount = inputOrWords;
    sentenceCount = sentencesArg ?? 0;
    syllableCount = syllablesArg ?? 0;
    polysyllableCount = polysyllableCountArg ?? complexWordsArg ?? 0;
    characterCountWithoutSpaces = lettersArg ?? 0;
    difficultWordsCount = difficultWordsCountArg;
  } else {
    wordCount = inputOrWords.wordCount;
    sentenceCount = inputOrWords.sentenceCount;
    syllableCount = inputOrWords.syllableCount;
    polysyllableCount = inputOrWords.polysyllableCount;
    characterCountWithoutSpaces = inputOrWords.characterCountWithoutSpaces;
    difficultWordsCount = inputOrWords.difficultWordsCount;
  }

  if (wordCount === 0 || sentenceCount === 0) {
    return {
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
      gunningFog: 0,
      colemanLiauIndex: 0,
      smogIndex: 0,
      automatedReadabilityIndex: 0,
      daleChallIndex: 0,
      linsearWrite: 0,
      consensusGrade: 0,
      consensusConfidence: 'low',
      gradeRange: { min: 0, max: 0 },
      readingLevel: 'No content',
      difficultyLabel: 'No content',
      targetAudience: 'N/A',
      gradeBand: 'N/A'
    };
  }

  const words = Math.max(1, wordCount);
  const sentences = Math.max(1, sentenceCount);
  const syllables = Math.max(1, syllableCount);
  const letters = Math.max(1, characterCountWithoutSpaces);

  // Average Sentence Length (ASL)
  const asl = words / sentences;
  // Average Syllables per Word (ASW)
  const asw = syllables / words;

  // 1. Flesch Reading Ease
  // 206.835 - 1.015 * ASL - 84.6 * ASW
  const rawFre = 206.835 - (1.015 * asl) - (84.6 * asw);
  const fleschReadingEase = round(Math.min(100, Math.max(0, rawFre)));

  // 2. Flesch-Kincaid Grade Level
  // 0.39 * ASL + 11.8 * ASW - 15.59
  const rawFkgl = (0.39 * asl) + (11.8 * asw) - 15.59;
  const fleschKincaidGrade = round(Math.max(0, rawFkgl));

  // 3. Gunning Fog Index
  // 0.4 * [ (words / sentences) + 100 * (complexWords / words) ]
  const percentComplex = (polysyllableCount / words) * 100;
  const rawFog = 0.4 * (asl + percentComplex);
  const gunningFog = round(Math.max(0, rawFog));

  // 4. Coleman-Liau Index
  // 0.0588 * L - 0.296 * S - 15.8
  const L = (letters / words) * 100;
  const S = (sentences / words) * 100;
  const rawColeman = (0.0588 * L) - (0.296 * S) - 15.8;
  const colemanLiauIndex = round(Math.max(0, rawColeman));

  // 5. SMOG Index
  // 1.0430 * sqrt(polysyllables * (30 / sentences)) + 3.1291
  const smogSentenceFactor = 30 / sentences;
  const rawSmog = 1.0430 * Math.sqrt(polysyllableCount * smogSentenceFactor) + 3.1291;
  const smogIndex = round(isNaN(rawSmog) ? 0 : Math.max(0, rawSmog));

  // 6. Automated Readability Index (ARI)
  // 4.71 * (characters / words) + 0.5 * (words / sentences) - 21.43
  const rawAri = 4.71 * (letters / words) + 0.5 * asl - 21.43;
  const automatedReadabilityIndex = round(Math.max(0, rawAri));

  // 7. Authentic Dale-Chall Readability Formula (Grade adjusted)
  const difficultWords = difficultWordsCount !== undefined ? difficultWordsCount : polysyllableCount;
  const difficultWordsPercent = (difficultWords / words) * 100;
  let rawDaleChall = 0.1579 * difficultWordsPercent + 0.0496 * asl;
  if (difficultWordsPercent > 5) {
    rawDaleChall += 3.6365;
  }
  const daleChallIndex = round(Math.max(0, rawDaleChall));

  // 8. Linsear Write Formula
  const rawLinsear = (asl + 3 * (polysyllableCount / sentences)) / 2;
  const linsearWrite = round(Math.max(0, rawLinsear));

  // Consensus Grade (Including Dale-Chall with trimmed mean & agreement confidence)
  const validGrades = [
    fleschKincaidGrade,
    gunningFog,
    colemanLiauIndex,
    smogIndex,
    automatedReadabilityIndex,
    linsearWrite,
    daleChallIndex
  ].filter(g => g > 0);

  let consensusGrade = 0;
  let consensusConfidence: 'high' | 'moderate' | 'low' = 'low';
  let gradeRange = { min: 0, max: 0 };

  if (validGrades.length > 0) {
    const sorted = [...validGrades].sort((a, b) => a - b);
    const min = round(sorted[0]);
    const max = round(sorted[sorted.length - 1]);
    gradeRange = { min, max };

    // Consensus Grade (trimmed mean when >= 5 scores to remove single-metric distortion)
    if (sorted.length >= 5) {
      const trimmed = sorted.slice(1, -1);
      consensusGrade = round(trimmed.reduce((a, b) => a + b, 0) / trimmed.length);
    } else {
      consensusGrade = round(sorted.reduce((a, b) => a + b, 0) / sorted.length);
    }

    const spread = max - min;
    if (validGrades.length >= 4) {
      if (spread <= 3.5) {
        consensusConfidence = 'high';
      } else if (spread <= 6.5) {
        consensusConfidence = 'moderate';
      } else {
        consensusConfidence = 'low';
      }
    } else if (validGrades.length >= 2) {
      if (spread <= 3.0) {
        consensusConfidence = 'moderate';
      } else {
        consensusConfidence = 'low';
      }
    } else {
      consensusConfidence = 'low';
    }
  }

  const { difficultyLabel, targetAudience, gradeBand } = interpretScores(fleschReadingEase, consensusGrade);

  return {
    fleschReadingEase,
    fleschKincaidGrade,
    gunningFog,
    colemanLiauIndex,
    smogIndex,
    automatedReadabilityIndex,
    daleChallIndex,
    linsearWrite,
    consensusGrade,
    consensusConfidence,
    gradeRange,
    readingLevel: difficultyLabel,
    difficultyLabel,
    targetAudience,
    gradeBand
  };
}

function interpretScores(fre: number, grade: number) {
  let difficultyLabel = 'Standard';
  let targetAudience = 'General Public (Ages 13-15)';
  let gradeBand = 'Grade 8-9';

  if (fre >= 90) {
    difficultyLabel = 'Very Easy';
    targetAudience = 'Young Readers & ESL (Ages 10-11)';
    gradeBand = 'Grade 5';
  } else if (fre >= 80) {
    difficultyLabel = 'Easy';
    targetAudience = 'Casual Readers (Ages 11-12)';
    gradeBand = 'Grade 6';
  } else if (fre >= 70) {
    difficultyLabel = 'Fairly Easy';
    targetAudience = 'Middle School (Ages 12-13)';
    gradeBand = 'Grade 7';
  } else if (fre >= 60) {
    difficultyLabel = 'Plain English / Conversational';
    targetAudience = 'Mass Media & Consumer Web (Ages 13-15)';
    gradeBand = 'Grade 8-9';
  } else if (fre >= 50) {
    difficultyLabel = 'Fairly Difficult';
    targetAudience = 'High School Students (Ages 15-18)';
    gradeBand = 'Grade 10-12';
  } else if (fre >= 30) {
    difficultyLabel = 'Difficult';
    targetAudience = 'Undergraduates & Trade Journals';
    gradeBand = 'College Undergrad';
  } else {
    difficultyLabel = 'Very Technical / Academic';
    targetAudience = 'Subject Matter Experts & Graduate Researchers';
    gradeBand = 'Post-Graduate';
  }

  // Adjust grade band if consensus grade diverges sharply
  if (grade > 0 && Math.abs(grade - 8) > 3) {
    gradeBand = `Grade ~${Math.round(grade)}`;
  }

  return { difficultyLabel, targetAudience, gradeBand };
}

function round(val: number): number {
  return Math.round(val * 10) / 10;
}
