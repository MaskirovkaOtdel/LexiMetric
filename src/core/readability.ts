export interface ReadabilityScores {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gunningFog: number;
  colemanLiauIndex: number;
  smogIndex: number;
  automatedReadabilityIndex: number;
  consensusGrade: number;
  difficultyLabel: string;
  targetAudience: string;
  gradeBand: string;
}

export interface ReadabilityInput {
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  polysyllableCount: number; // Words with >= 3 syllables
  characterCountWithoutSpaces: number;
}

/**
 * Calculates comprehensive readability indexes from token metrics.
 */
export function calculateReadability(input: ReadabilityInput): ReadabilityScores {
  const {
    wordCount,
    sentenceCount,
    syllableCount,
    polysyllableCount,
    characterCountWithoutSpaces
  } = input;

  if (wordCount === 0 || sentenceCount === 0) {
    return {
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
      gunningFog: 0,
      colemanLiauIndex: 0,
      smogIndex: 0,
      automatedReadabilityIndex: 0,
      consensusGrade: 0,
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
  // L = average letters per 100 words, S = average sentences per 100 words
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

  // Consensus Grade (Median or average of active grade levels)
  const validGrades = [
    fleschKincaidGrade,
    gunningFog,
    colemanLiauIndex,
    smogIndex,
    automatedReadabilityIndex
  ].filter(g => g > 0);

  const consensusGrade = validGrades.length > 0
    ? round(validGrades.reduce((a, b) => a + b, 0) / validGrades.length)
    : 0;

  const { difficultyLabel, targetAudience, gradeBand } = interpretScores(fleschReadingEase, consensusGrade);

  return {
    fleschReadingEase,
    fleschKincaidGrade,
    gunningFog,
    colemanLiauIndex,
    smogIndex,
    automatedReadabilityIndex,
    consensusGrade,
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
