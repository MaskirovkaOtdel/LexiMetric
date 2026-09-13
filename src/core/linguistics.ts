import { countSyllables } from './syllables.js';
import { calculateReadability, ReadabilityScores } from './readability.js';
import { calculateReadTime, ReadTimeEstimate } from './readTime.js';

export interface TextSpan {
  text: string;
  startIndex: number;
  endIndex: number;
  type: 'passive' | 'run-on' | 'complex-word' | 'wordiness';
  suggestion?: string;
}

export interface SentenceAnalysis {
  index: number;
  text: string;
  wordCount: number;
  syllableCount: number;
  startIndex: number;
  endIndex: number;
  isRunOn: boolean;
  hasPassiveVoice: boolean;
}

export interface LinguisticProfile {
  // Counts
  wordCount: number;
  characterCountWithSpaces: number;
  characterCountWithoutSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  syllableCount: number;
  polysyllableCount: number;
  uniqueWordCount: number;

  // Averages & Ratios
  averageSentenceLength: number;
  averageSyllablesPerWord: number;
  lexicalDiversityPercent: number; // Type-Token Ratio
  complexWordPercent: number;

  // Sentence classification
  shortSentencesCount: number; // < 14 words
  standardSentencesCount: number; // 14 - 24 words
  longSentencesCount: number; // 25 - 29 words
  runOnSentencesCount: number; // >= 30 words

  // Analysis lists
  sentences: SentenceAnalysis[];
  spans: TextSpan[];
  complexWords: { word: string; syllables: number; count: number }[];

  // Scores & Times
  readability: ReadabilityScores;
  readTime: ReadTimeEstimate;
}

// Auxiliary verbs used in English passive voice
const TO_BE_FORMS = new Set([
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am'
]);

// Irregular past participles commonly used in passive constructions
const IRREGULAR_PAST_PARTICIPLES = new Set([
  'arisen', 'awoken', 'beaten', 'become', 'begun', 'bent', 'bound', 'bitten',
  'blown', 'broken', 'brought', 'built', 'burnt', 'bought', 'caught', 'chosen',
  'dealt', 'done', 'drawn', 'drunk', 'driven', 'eaten', 'fallen', 'fed', 'felt',
  'fought', 'found', 'flown', 'forbidden', 'forgotten', 'forgiven', 'frozen',
  'given', 'gone', 'grown', 'hung', 'heard', 'hidden', 'hit', 'held', 'hurt',
  'kept', 'known', 'laid', 'led', 'left', 'lent', 'lost', 'made', 'meant', 'met',
  'paid', 'proven', 'put', 'read', 'ridden', 'risen', 'run', 'said', 'seen',
  'sought', 'sold', 'sent', 'set', 'shaken', 'shined', 'shot', 'shown', 'shut',
  'sung', 'sunk', 'sat', 'slept', 'spoken', 'spent', 'spun', 'spread', 'stood',
  'stolen', 'stuck', 'struck', 'sworn', 'swept', 'taken', 'taught', 'torn',
  'told', 'thought', 'thrown', 'understood', 'woken', 'worn', 'won', 'written'
]);

// Bloated/wordy phrases with concise editorial alternatives
const WORDINESS_PATTERNS: Array<{ pattern: RegExp; suggestion: string }> = [
  { pattern: /\bin order to\b/gi, suggestion: 'to' },
  { pattern: /\bdue to the fact that\b/gi, suggestion: 'because' },
  { pattern: /\bat this point in time\b/gi, suggestion: 'now' },
  { pattern: /\butilize\b/gi, suggestion: 'use' },
  { pattern: /\butilized\b/gi, suggestion: 'used' },
  { pattern: /\butilizing\b/gi, suggestion: 'using' },
  { pattern: /\bfor the purpose of\b/gi, suggestion: 'to' },
  { pattern: /\bin the event that\b/gi, suggestion: 'if' },
  { pattern: /\ba large number of\b/gi, suggestion: 'many' },
  { pattern: /\bhas the ability to\b/gi, suggestion: 'can' },
  { pattern: /\bit is important to note that\b/gi, suggestion: 'notably' },
  { pattern: /\bwith the exception of\b/gi, suggestion: 'except' },
  { pattern: /\bin close proximity to\b/gi, suggestion: 'near' },
  { pattern: /\bconduct an investigation of\b/gi, suggestion: 'investigate' }
];

/**
 * Analyzes arbitrary text and generates a comprehensive linguistic profile.
 */
export function profileText(text: string): LinguisticProfile {
  const trimmed = text.trim();
  if (!trimmed) {
    const emptyReadability = calculateReadability({
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      polysyllableCount: 0,
      characterCountWithoutSpaces: 0
    });
    const emptyReadTime = calculateReadTime(0);

    return {
      wordCount: 0,
      characterCountWithSpaces: 0,
      characterCountWithoutSpaces: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      syllableCount: 0,
      polysyllableCount: 0,
      uniqueWordCount: 0,
      averageSentenceLength: 0,
      averageSyllablesPerWord: 0,
      lexicalDiversityPercent: 0,
      complexWordPercent: 0,
      shortSentencesCount: 0,
      standardSentencesCount: 0,
      longSentencesCount: 0,
      runOnSentencesCount: 0,
      sentences: [],
      spans: [],
      complexWords: [],
      readability: emptyReadability,
      readTime: emptyReadTime
    };
  }

  const characterCountWithSpaces = text.length;
  const characterCountWithoutSpaces = text.replace(/\s+/g, '').length;

  // Paragraph counting
  const rawParagraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphCount = Math.max(1, rawParagraphs.length);

  // Sentence splitting with character positions
  const { sentences, rawSentenceCount } = parseSentences(text);
  const sentenceCount = Math.max(1, rawSentenceCount);

  // Word extraction & token processing
  const wordRegex = /[a-zA-Z0-9]+(?:'[a-zA-Z]+)?/g;
  let wordMatch: RegExpExecArray | null;
  let totalWords = 0;
  let totalSyllables = 0;
  let polysyllableCount = 0;

  const uniqueWordMap = new Map<string, number>();
  const complexWordMap = new Map<string, number>();
  const spans: TextSpan[] = [];

  while ((wordMatch = wordRegex.exec(text)) !== null) {
    totalWords++;
    const word = wordMatch[0];
    const lowerWord = word.toLowerCase();

    // Unique count
    uniqueWordMap.set(lowerWord, (uniqueWordMap.get(lowerWord) || 0) + 1);

    // Syllables
    const syllables = countSyllables(word);
    totalSyllables += syllables;

    if (syllables >= 3) {
      polysyllableCount++;
      complexWordMap.set(lowerWord, (complexWordMap.get(lowerWord) || 0) + 1);
      spans.push({
        text: word,
        startIndex: wordMatch.index,
        endIndex: wordMatch.index + word.length,
        type: 'complex-word',
        suggestion: `${syllables} syllables`
      });
    }
  }

  // Detect passive voice
  const passiveSpans = detectPassiveVoice(text);
  spans.push(...passiveSpans);

  // Detect wordy phrases
  for (const { pattern, suggestion } of WORDINESS_PATTERNS) {
    let m: RegExpExecArray | null;
    pattern.lastIndex = 0;
    while ((m = pattern.exec(text)) !== null) {
      spans.push({
        text: m[0],
        startIndex: m.index,
        endIndex: m.index + m[0].length,
        type: 'wordiness',
        suggestion: `Consider replacing with "${suggestion}"`
      });
    }
  }

  // Sentence length metrics & run-on spans
  let shortSentences = 0;
  let standardSentences = 0;
  let longSentences = 0;
  let runOnSentences = 0;

  for (const s of sentences) {
    if (s.wordCount < 14) {
      shortSentences++;
    } else if (s.wordCount <= 24) {
      standardSentences++;
    } else if (s.wordCount < 30) {
      longSentences++;
    } else {
      runOnSentences++;
      s.isRunOn = true;
      spans.push({
        text: s.text,
        startIndex: s.startIndex,
        endIndex: s.endIndex,
        type: 'run-on',
        suggestion: `Run-on sentence (${s.wordCount} words). Consider splitting into multiple clauses.`
      });
    }

    // Check if sentence overlaps any passive span
    s.hasPassiveVoice = passiveSpans.some(
      p => p.startIndex >= s.startIndex && p.endIndex <= s.endIndex
    );
  }

  const complexWords = Array.from(complexWordMap.entries())
    .map(([word, count]) => ({
      word,
      syllables: countSyllables(word),
      count
    }))
    .sort((a, b) => b.count - a.count);

  const averageSentenceLength = totalWords > 0 && sentenceCount > 0
    ? Math.round((totalWords / sentenceCount) * 10) / 10
    : 0;

  const averageSyllablesPerWord = totalWords > 0
    ? Math.round((totalSyllables / totalWords) * 100) / 100
    : 0;

  const lexicalDiversityPercent = totalWords > 0
    ? Math.round((uniqueWordMap.size / totalWords) * 1000) / 10
    : 0;

  const complexWordPercent = totalWords > 0
    ? Math.round((polysyllableCount / totalWords) * 1000) / 10
    : 0;

  const readability = calculateReadability({
    wordCount: totalWords,
    sentenceCount,
    syllableCount: totalSyllables,
    polysyllableCount,
    characterCountWithoutSpaces
  });

  const readTime = calculateReadTime(
    totalWords,
    averageSyllablesPerWord,
    readability.fleschReadingEase
  );

  return {
    wordCount: totalWords,
    characterCountWithSpaces,
    characterCountWithoutSpaces,
    sentenceCount,
    paragraphCount,
    syllableCount: totalSyllables,
    polysyllableCount,
    uniqueWordCount: uniqueWordMap.size,
    averageSentenceLength,
    averageSyllablesPerWord,
    lexicalDiversityPercent,
    complexWordPercent,
    shortSentencesCount: shortSentences,
    standardSentencesCount: standardSentences,
    longSentencesCount: longSentences,
    runOnSentencesCount: runOnSentences,
    sentences,
    spans: spans.sort((a, b) => a.startIndex - b.startIndex),
    complexWords,
    readability,
    readTime
  };
}

/**
 * Parses sentences while maintaining character offsets.
 */
function parseSentences(text: string): { sentences: SentenceAnalysis[]; rawSentenceCount: number } {
  // Regex matching sentence boundaries (.!?) followed by space/newline or end of text
  const sentenceRegex = /[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s+|$)/g;
  const list: SentenceAnalysis[] = [];
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = sentenceRegex.exec(text)) !== null) {
    const raw = match[0].trim();
    if (!raw) continue;

    const words = raw.match(/[a-zA-Z0-9]+(?:'[a-zA-Z]+)?/g) || [];
    if (words.length === 0) continue;

    let sylCount = 0;
    for (const w of words) {
      sylCount += countSyllables(w);
    }

    list.push({
      index,
      text: raw,
      wordCount: words.length,
      syllableCount: sylCount,
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      isRunOn: words.length >= 30,
      hasPassiveVoice: false
    });
    index++;
  }

  return {
    sentences: list,
    rawSentenceCount: list.length
  };
}

/**
 * Identifies passive voice constructs: [to-be verb] + [adverb]* + [past participle]
 */
function detectPassiveVoice(text: string): TextSpan[] {
  const spans: TextSpan[] = [];
  // Matches e.g. "was written", "is being created", "has been approved", "was made", "were slowly dismantled"
  const passivePattern = /\b(is|are|was|were|be|been|being|am)\s+(?:[a-z]+ly\s+)?([a-z]+)\b/gi;
  let match: RegExpExecArray | null;

  while ((match = passivePattern.exec(text)) !== null) {
    const aux = match[1].toLowerCase();
    const participle = match[2].toLowerCase();

    if (TO_BE_FORMS.has(aux)) {
      // Check if candidate participle is regular '-ed' or irregular past participle
      const isCandidate = participle.endsWith('ed') || IRREGULAR_PAST_PARTICIPLES.has(participle);
      if (isCandidate) {
        spans.push({
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          type: 'passive',
          suggestion: 'Passive voice detected. Consider rewriting in active voice.'
        });
      }
    }
  }

  return spans;
}
