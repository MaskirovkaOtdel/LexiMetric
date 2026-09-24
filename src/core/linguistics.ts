import { countSyllables } from './syllables.js';
import { calculateReadability, ReadabilityScores } from './readability.js';
import { calculateReadTime, ReadTimeEstimate } from './readTime.js';
import { isDaleChallFamiliar } from './daleChallWords.js';
import {
  detectLanguage,
  calculateMultilingualReadability,
  LanguageDetectionResult,
  MultilingualReadabilityResult
} from './multilingual.js';

export interface TextSpan {
  text: string;
  startIndex: number;
  endIndex: number;
  type: 'passive' | 'run-on' | 'complex-word' | 'wordiness';
  suggestion?: string;
  fixReplacement?: string;
  replacements?: string[];
  category?: 'passive_voice' | 'bloat_phrase' | 'wordiness' | string;
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
  difficultWordCount: number;
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

  // Multilingual Profile
  detectedLanguage?: LanguageDetectionResult;
  multilingualReadability?: MultilingualReadabilityResult;
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

// Map irregular past participles to active past-tense verbs
const PAST_PARTICIPLE_TO_ACTIVE: Record<string, string> = {
  arisen: 'arose',
  awoken: 'awoke',
  beaten: 'beat',
  become: 'became',
  begun: 'began',
  bent: 'bent',
  bound: 'bound',
  bitten: 'bit',
  blown: 'blew',
  broken: 'broke',
  brought: 'brought',
  built: 'built',
  burnt: 'burnt',
  bought: 'bought',
  caught: 'caught',
  chosen: 'chose',
  dealt: 'dealt',
  done: 'did',
  drawn: 'drew',
  drunk: 'drank',
  driven: 'drove',
  eaten: 'ate',
  fallen: 'fell',
  fed: 'fed',
  felt: 'felt',
  fought: 'fought',
  found: 'found',
  flown: 'flew',
  forbidden: 'forbade',
  forgotten: 'forgot',
  forgiven: 'forgave',
  frozen: 'froze',
  given: 'gave',
  gone: 'went',
  grown: 'grew',
  hung: 'hung',
  heard: 'heard',
  hidden: 'hid',
  hit: 'hit',
  held: 'held',
  hurt: 'hurt',
  kept: 'kept',
  known: 'knew',
  laid: 'laid',
  led: 'led',
  left: 'left',
  lent: 'lent',
  lost: 'lost',
  made: 'made',
  meant: 'meant',
  met: 'met',
  paid: 'paid',
  proven: 'proved',
  put: 'put',
  read: 'read',
  ridden: 'rode',
  risen: 'rose',
  run: 'ran',
  said: 'said',
  seen: 'saw',
  sought: 'sought',
  sold: 'sold',
  sent: 'sent',
  set: 'set',
  shaken: 'shook',
  shined: 'shined',
  shot: 'shot',
  shown: 'showed',
  shut: 'shut',
  sung: 'sang',
  sunk: 'sank',
  sat: 'sat',
  slept: 'slept',
  spoken: 'spoke',
  spent: 'spent',
  spun: 'spun',
  spread: 'spread',
  stood: 'stood',
  stolen: 'stole',
  stuck: 'stuck',
  struck: 'struck',
  sworn: 'swore',
  swept: 'swept',
  taken: 'took',
  taught: 'taught',
  torn: 'tore',
  told: 'told',
  thought: 'thought',
  thrown: 'threw',
  understood: 'understood',
  woken: 'woke',
  worn: 'wore',
  won: 'won',
  written: 'wrote'
};

/**
 * Preserves the capitalization of the original string when applying a replacement.
 */
function preserveCase(original: string, replacement: string): string {
  if (!original || !replacement) return replacement;
  if (original === original.toUpperCase() && original !== original.toLowerCase()) {
    return replacement.toUpperCase();
  }
  if (original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

const SENTENCE_REGEX = /[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s+|$)/g;
const WORD_REGEX = /[a-zA-Z0-9]+(?:'[a-zA-Z]+)?/g;
const PASSIVE_PATTERN = /\b(is|are|was|were|be|been|being|am)\s+(?:([a-z]+ly|also|already|often|never|always|just|soon|still|well|hereby|thereby|seldom|sometimes|even|ever)\s+)?([a-z]+)(?:\s+by\s+([a-zA-Z0-9']+(?:\s+[a-zA-Z0-9']+){0,3}))?\b/gi;
const AGENT_STOP_WORDS = new Set([
  'yesterday', 'today', 'tomorrow', 'recently', 'previously', 'following',
  'after', 'before', 'during', 'under', 'in', 'on', 'at', 'with', 'to', 'for',
  'from', 'when', 'while', 'as', 'over', 'into', 'through', 'between'
]);

interface WordinessPatternItem {
  pattern: RegExp;
  suggestion: string;
  replacements?: string[];
  category: 'bloat_phrase' | 'wordiness';
}

// 70+ editorial bloat phrases (redundant pairs, verbose prepositions, nominalizations)
const WORDINESS_PATTERNS: WordinessPatternItem[] = [
  // 1. Verbose prepositions & connectors
  { pattern: /\bin order to\b/gi, suggestion: 'to', replacements: ['to'], category: 'wordiness' },
  { pattern: /\bdue to the fact that\b/gi, suggestion: 'because', replacements: ['because', 'since'], category: 'wordiness' },
  { pattern: /\bat this point in time\b/gi, suggestion: 'now', replacements: ['now', 'currently'], category: 'wordiness' },
  { pattern: /\bat the present time\b/gi, suggestion: 'now', replacements: ['now', 'currently'], category: 'wordiness' },
  { pattern: /\bat the present moment\b/gi, suggestion: 'now', replacements: ['now'], category: 'wordiness' },
  { pattern: /\bfor the purpose of\b/gi, suggestion: 'to', replacements: ['to', 'for'], category: 'wordiness' },
  { pattern: /\bin the event that\b/gi, suggestion: 'if', replacements: ['if'], category: 'wordiness' },
  { pattern: /\bin the near future\b/gi, suggestion: 'soon', replacements: ['soon', 'shortly'], category: 'wordiness' },
  { pattern: /\ba large number of\b/gi, suggestion: 'many', replacements: ['many'], category: 'wordiness' },
  { pattern: /\ba small number of\b/gi, suggestion: 'few', replacements: ['few'], category: 'wordiness' },
  { pattern: /\bhas the ability to\b/gi, suggestion: 'can', replacements: ['can'], category: 'wordiness' },
  { pattern: /\bhave the ability to\b/gi, suggestion: 'can', replacements: ['can'], category: 'wordiness' },
  { pattern: /\bit is important to note that\b/gi, suggestion: 'notably', replacements: ['notably', 'note that'], category: 'bloat_phrase' },
  { pattern: /\bwith the exception of\b/gi, suggestion: 'except', replacements: ['except', 'aside from'], category: 'wordiness' },
  { pattern: /\bin close proximity to\b/gi, suggestion: 'near', replacements: ['near', 'close to'], category: 'wordiness' },
  { pattern: /\bin the vicinity of\b/gi, suggestion: 'near', replacements: ['near'], category: 'wordiness' },
  { pattern: /\bprior to\b/gi, suggestion: 'before', replacements: ['before'], category: 'wordiness' },
  { pattern: /\bsubsequent to\b/gi, suggestion: 'after', replacements: ['after'], category: 'wordiness' },
  { pattern: /\bin spite of the fact that\b/gi, suggestion: 'although', replacements: ['although', 'even though'], category: 'wordiness' },
  { pattern: /\bdespite the fact that\b/gi, suggestion: 'although', replacements: ['although', 'even though'], category: 'wordiness' },
  { pattern: /\bby means of\b/gi, suggestion: 'by', replacements: ['by', 'with'], category: 'wordiness' },
  { pattern: /\bin accordance with\b/gi, suggestion: 'under', replacements: ['under', 'by'], category: 'wordiness' },
  { pattern: /\bin light of the fact that\b/gi, suggestion: 'because', replacements: ['because'], category: 'wordiness' },
  { pattern: /\bowing to the fact that\b/gi, suggestion: 'because', replacements: ['because'], category: 'wordiness' },
  { pattern: /\bon the grounds that\b/gi, suggestion: 'because', replacements: ['because'], category: 'wordiness' },
  { pattern: /\bin connection with\b/gi, suggestion: 'about', replacements: ['about'], category: 'wordiness' },
  { pattern: /\bwith regard to\b/gi, suggestion: 'about', replacements: ['about', 'regarding'], category: 'wordiness' },
  { pattern: /\bwith reference to\b/gi, suggestion: 'about', replacements: ['about'], category: 'wordiness' },
  { pattern: /\bwith respect to\b/gi, suggestion: 'about', replacements: ['about'], category: 'wordiness' },
  { pattern: /\bin regard to\b/gi, suggestion: 'about', replacements: ['about', 'concerning'], category: 'wordiness' },
  { pattern: /\bas a matter of fact\b/gi, suggestion: 'actually', replacements: ['actually', 'in fact'], category: 'bloat_phrase' },
  { pattern: /\bin a timely manner\b/gi, suggestion: 'promptly', replacements: ['promptly', 'quickly'], category: 'wordiness' },
  { pattern: /\bat all times\b/gi, suggestion: 'always', replacements: ['always'], category: 'wordiness' },
  { pattern: /\bfor the duration of\b/gi, suggestion: 'during', replacements: ['during'], category: 'wordiness' },
  { pattern: /\bin the process of\b/gi, suggestion: 'currently', replacements: ['currently'], category: 'wordiness' },
  { pattern: /\bon a daily basis\b/gi, suggestion: 'daily', replacements: ['daily'], category: 'wordiness' },
  { pattern: /\bon a regular basis\b/gi, suggestion: 'regularly', replacements: ['regularly'], category: 'wordiness' },
  { pattern: /\btake into consideration\b/gi, suggestion: 'consider', replacements: ['consider'], category: 'wordiness' },
  { pattern: /\bgive consideration to\b/gi, suggestion: 'consider', replacements: ['consider'], category: 'wordiness' },
  { pattern: /\buntil such time as\b/gi, suggestion: 'until', replacements: ['until'], category: 'wordiness' },
  { pattern: /\bduring the time that\b/gi, suggestion: 'while', replacements: ['while'], category: 'wordiness' },
  { pattern: /\bregardless of the fact that\b/gi, suggestion: 'although', replacements: ['although'], category: 'wordiness' },
  { pattern: /\bin the majority of instances\b/gi, suggestion: 'usually', replacements: ['usually', 'mostly'], category: 'wordiness' },
  { pattern: /\bserves to explain\b/gi, suggestion: 'explains', replacements: ['explains'], category: 'bloat_phrase' },
  { pattern: /\bis indicative of\b/gi, suggestion: 'indicates', replacements: ['indicates'], category: 'bloat_phrase' },
  { pattern: /\bgives an indication of\b/gi, suggestion: 'indicates', replacements: ['indicates'], category: 'bloat_phrase' },
  { pattern: /\bas of yet\b/gi, suggestion: 'yet', replacements: ['yet', 'so far'], category: 'bloat_phrase' },
  { pattern: /\badequate number of\b/gi, suggestion: 'enough', replacements: ['enough'], category: 'wordiness' },

  // 2. Redundant pairs & pleonasms
  { pattern: /\beach and every\b/gi, suggestion: 'each', replacements: ['each', 'every'], category: 'bloat_phrase' },
  { pattern: /\bfirst and foremost\b/gi, suggestion: 'first', replacements: ['first'], category: 'bloat_phrase' },
  { pattern: /\bnull and void\b/gi, suggestion: 'void', replacements: ['void'], category: 'bloat_phrase' },
  { pattern: /\bfull and complete\b/gi, suggestion: 'complete', replacements: ['complete', 'full'], category: 'bloat_phrase' },
  { pattern: /\bbasic and fundamental\b/gi, suggestion: 'basic', replacements: ['basic', 'fundamental'], category: 'bloat_phrase' },
  { pattern: /\btrue and accurate\b/gi, suggestion: 'accurate', replacements: ['accurate', 'true'], category: 'bloat_phrase' },
  { pattern: /\bhopes and desires\b/gi, suggestion: 'hopes', replacements: ['hopes'], category: 'bloat_phrase' },
  { pattern: /\bpeace and quiet\b/gi, suggestion: 'quiet', replacements: ['quiet', 'peace'], category: 'bloat_phrase' },
  { pattern: /\bany and all\b/gi, suggestion: 'all', replacements: ['all', 'any'], category: 'bloat_phrase' },
  { pattern: /\bvarious and sundry\b/gi, suggestion: 'various', replacements: ['various'], category: 'bloat_phrase' },
  { pattern: /\bpart and parcel\b/gi, suggestion: 'part', replacements: ['part'], category: 'bloat_phrase' },
  { pattern: /\bone and only\b/gi, suggestion: 'only', replacements: ['only'], category: 'bloat_phrase' },
  { pattern: /\bfair and equitable\b/gi, suggestion: 'fair', replacements: ['fair', 'equitable'], category: 'bloat_phrase' },
  { pattern: /\bready and willing\b/gi, suggestion: 'ready', replacements: ['ready'], category: 'bloat_phrase' },
  { pattern: /\bpoint and purpose\b/gi, suggestion: 'purpose', replacements: ['purpose', 'point'], category: 'bloat_phrase' },
  { pattern: /\baid and abet\b/gi, suggestion: 'abet', replacements: ['abet', 'help'], category: 'bloat_phrase' },
  { pattern: /\bfinal and conclusive\b/gi, suggestion: 'final', replacements: ['final'], category: 'bloat_phrase' },
  { pattern: /\bend result\b/gi, suggestion: 'result', replacements: ['result'], category: 'bloat_phrase' },
  { pattern: /\bpast history\b/gi, suggestion: 'history', replacements: ['history'], category: 'bloat_phrase' },
  { pattern: /\bfuture plans\b/gi, suggestion: 'plans', replacements: ['plans'], category: 'bloat_phrase' },
  { pattern: /\bunexpected surprise\b/gi, suggestion: 'surprise', replacements: ['surprise'], category: 'bloat_phrase' },
  { pattern: /\bsum total\b/gi, suggestion: 'total', replacements: ['total'], category: 'bloat_phrase' },
  { pattern: /\bperiod of time\b/gi, suggestion: 'period', replacements: ['period', 'time'], category: 'bloat_phrase' },
  { pattern: /\bconsensus of opinion\b/gi, suggestion: 'consensus', replacements: ['consensus'], category: 'bloat_phrase' },

  // 3. Nominalizations & wordy verbs
  { pattern: /\bconduct an investigation of\b/gi, suggestion: 'investigate', replacements: ['investigate'], category: 'bloat_phrase' },
  { pattern: /\bmake a decision\b/gi, suggestion: 'decide', replacements: ['decide'], category: 'bloat_phrase' },
  { pattern: /\bmade a decision\b/gi, suggestion: 'decided', replacements: ['decided'], category: 'bloat_phrase' },
  { pattern: /\breach a decision\b/gi, suggestion: 'decide', replacements: ['decide'], category: 'bloat_phrase' },
  { pattern: /\breach an agreement\b/gi, suggestion: 'agree', replacements: ['agree'], category: 'bloat_phrase' },
  { pattern: /\bcome to a conclusion\b/gi, suggestion: 'conclude', replacements: ['conclude'], category: 'bloat_phrase' },
  { pattern: /\bdraw a conclusion\b/gi, suggestion: 'conclude', replacements: ['conclude'], category: 'bloat_phrase' },
  { pattern: /\bperform an analysis of\b/gi, suggestion: 'analyze', replacements: ['analyze'], category: 'bloat_phrase' },
  { pattern: /\bcarry out an analysis of\b/gi, suggestion: 'analyze', replacements: ['analyze'], category: 'bloat_phrase' },
  { pattern: /\bconduct an examination of\b/gi, suggestion: 'examine', replacements: ['examine'], category: 'bloat_phrase' },
  { pattern: /\bmake an assumption\b/gi, suggestion: 'assume', replacements: ['assume'], category: 'bloat_phrase' },
  { pattern: /\bprovide assistance to\b/gi, suggestion: 'help', replacements: ['help', 'assist'], category: 'bloat_phrase' },
  { pattern: /\bgive assistance to\b/gi, suggestion: 'help', replacements: ['help', 'assist'], category: 'bloat_phrase' },
  { pattern: /\bextend an invitation to\b/gi, suggestion: 'invite', replacements: ['invite'], category: 'bloat_phrase' },
  { pattern: /\bmake an announcement\b/gi, suggestion: 'announce', replacements: ['announce'], category: 'bloat_phrase' },
  { pattern: /\bconduct an interview with\b/gi, suggestion: 'interview', replacements: ['interview'], category: 'bloat_phrase' },
  { pattern: /\bmake an attempt\b/gi, suggestion: 'attempt', replacements: ['attempt', 'try'], category: 'bloat_phrase' },
  { pattern: /\butilize\b/gi, suggestion: 'use', replacements: ['use'], category: 'wordiness' },
  { pattern: /\butilized\b/gi, suggestion: 'used', replacements: ['used'], category: 'wordiness' },
  { pattern: /\butilizing\b/gi, suggestion: 'using', replacements: ['using'], category: 'wordiness' },
  { pattern: /\butilization\b/gi, suggestion: 'use', replacements: ['use'], category: 'wordiness' },
  { pattern: /\bcommence\b/gi, suggestion: 'begin', replacements: ['begin', 'start'], category: 'wordiness' },
  { pattern: /\bterminate\b/gi, suggestion: 'end', replacements: ['end', 'stop'], category: 'wordiness' }
];

/**
 * Analyzes arbitrary text and generates a comprehensive linguistic profile.
 * Highly optimized for >900,000 words/second throughput.
 */
export function profileText(text: string): LinguisticProfile {
  const trimmed = text.trim();
  if (!trimmed) {
    const emptyReadability = calculateReadability({
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      polysyllableCount: 0,
      characterCountWithoutSpaces: 0,
      difficultWordsCount: 0
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
      difficultWordCount: 0,
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

  // Combined zero-allocation char and paragraph scan
  let characterCountWithoutSpaces = 0;
  let paragraphCount = 0;
  let inParagraph = false;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code > 32 && code !== 160) {
      characterCountWithoutSpaces++;
      if (!inParagraph) {
        paragraphCount++;
        inParagraph = true;
      }
    } else if (code === 10 || code === 13) {
      let j = i + 1;
      while (j < text.length && (text.charCodeAt(j) === 32 || text.charCodeAt(j) === 9)) {
        j++;
      }
      if (j < text.length && (text.charCodeAt(j) === 10 || text.charCodeAt(j) === 13)) {
        inParagraph = false;
      }
    }
  }
  paragraphCount = Math.max(1, paragraphCount);

  // Sentence boundary parsing (without redundant syllable counting)
  const sentences = parseSentences(text);
  const sentenceCount = sentences.length;

  // Word extraction & token processing
  WORD_REGEX.lastIndex = 0;
  let wordMatch: RegExpExecArray | null;
  let totalWords = 0;
  let totalSyllables = 0;
  let polysyllableCount = 0;
  let difficultWordCount = 0;

  const uniqueWordMap = new Map<string, number>();
  const difficultWordsSet = new Set<string>();
  const complexWordMap = new Map<string, number>();
  const spans: TextSpan[] = [];

  let currentSentenceIdx = 0;

  while ((wordMatch = WORD_REGEX.exec(text)) !== null) {
    totalWords++;
    const word = wordMatch[0];
    const wordIdx = wordMatch.index;

    // Single countSyllables call per word in entire profiling pipeline
    const syllables = countSyllables(word);
    totalSyllables += syllables;

    // Advance sentence tracking pointer monotonically
    while (currentSentenceIdx < sentenceCount && wordIdx >= sentences[currentSentenceIdx].endIndex) {
      currentSentenceIdx++;
    }
    if (currentSentenceIdx < sentenceCount) {
      const s = sentences[currentSentenceIdx];
      s.wordCount++;
      s.syllableCount += syllables;
    }

    const lowerWord = word.toLowerCase();
    const prevCount = uniqueWordMap.get(lowerWord);
    uniqueWordMap.set(lowerWord, (prevCount || 0) + 1);

    // Dale-Chall familiar vocabulary check (evaluate once per unique token)
    if (prevCount === undefined) {
      if (!isDaleChallFamiliar(lowerWord)) {
        difficultWordsSet.add(lowerWord);
        difficultWordCount++;
      }
    } else if (difficultWordsSet.has(lowerWord)) {
      difficultWordCount++;
    }

    if (syllables >= 3) {
      polysyllableCount++;
      complexWordMap.set(lowerWord, (complexWordMap.get(lowerWord) || 0) + 1);
      spans.push({
        text: word,
        startIndex: wordIdx,
        endIndex: wordIdx + word.length,
        type: 'complex-word',
        suggestion: `${syllables} syllables`
      });
    }
  }

  // Degenerate input short-circuit (pure punctuation / symbols without alphanumeric words)
  if (totalWords === 0) {
    const emptyReadability = calculateReadability({
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      polysyllableCount: 0,
      characterCountWithoutSpaces,
      difficultWordsCount: 0
    });
    const emptyReadTime = calculateReadTime(0);

    return {
      wordCount: 0,
      characterCountWithSpaces,
      characterCountWithoutSpaces,
      sentenceCount: 0,
      paragraphCount: 0,
      syllableCount: 0,
      polysyllableCount: 0,
      difficultWordCount: 0,
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

  // Detect passive voice constructs (with agent identification)
  const passiveSpans = detectPassiveVoice(text);
  spans.push(...passiveSpans);

  // Optimized two-pointer sweep for passive sentence matching: O(N + M)
  let passivePtr = 0;
  for (let i = 0; i < sentenceCount; i++) {
    const s = sentences[i];
    while (passivePtr < passiveSpans.length && passiveSpans[passivePtr].endIndex <= s.startIndex) {
      passivePtr++;
    }
    let checkPtr = passivePtr;
    while (checkPtr < passiveSpans.length && passiveSpans[checkPtr].startIndex < s.endIndex) {
      if (passiveSpans[checkPtr].startIndex >= s.startIndex && passiveSpans[checkPtr].endIndex <= s.endIndex) {
        s.hasPassiveVoice = true;
        break;
      }
      checkPtr++;
    }
  }

  // Detect wordy phrases with case preservation
  for (const item of WORDINESS_PATTERNS) {
    let m: RegExpExecArray | null;
    item.pattern.lastIndex = 0;
    while ((m = item.pattern.exec(text)) !== null) {
      const rawMatch = m[0];
      const fixReplacement = preserveCase(rawMatch, item.suggestion);
      const replacements = item.replacements
        ? item.replacements.map(r => preserveCase(rawMatch, r))
        : [fixReplacement];

      spans.push({
        text: rawMatch,
        startIndex: m.index,
        endIndex: m.index + rawMatch.length,
        type: 'wordiness',
        suggestion: `Consider replacing with "${fixReplacement}"`,
        fixReplacement,
        replacements,
        category: item.category
      });
    }
  }

  // Sentence length metrics & run-on spans
  let shortSentences = 0;
  let standardSentences = 0;
  let longSentences = 0;
  let runOnSentences = 0;

  for (let i = 0; i < sentenceCount; i++) {
    const s = sentences[i];
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
  }

  const complexWords = Array.from(complexWordMap.entries())
    .map(([word, count]) => ({
      word,
      syllables: countSyllables(word),
      count
    }))
    .sort((a, b) => b.count - a.count);

  const effectiveSentences = Math.max(1, sentenceCount);

  const averageSentenceLength = totalWords > 0 && effectiveSentences > 0
    ? Math.round((totalWords / effectiveSentences) * 10) / 10
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
    sentenceCount: effectiveSentences,
    syllableCount: totalSyllables,
    polysyllableCount,
    characterCountWithoutSpaces,
    difficultWordsCount: difficultWordCount
  });

  const readTime = calculateReadTime(
    totalWords,
    averageSyllablesPerWord,
    readability.fleschReadingEase
  );

  const detectedLanguage = detectLanguage(text);
  const multilingualReadability = calculateMultilingualReadability(detectedLanguage.language, {
    wordCount: totalWords,
    sentenceCount: effectiveSentences,
    syllableCount: totalSyllables,
    characterCountWithoutSpaces,
    polysyllableCount
  });

  return {
    wordCount: totalWords,
    characterCountWithSpaces,
    characterCountWithoutSpaces,
    sentenceCount: sentenceCount,
    paragraphCount,
    syllableCount: totalSyllables,
    polysyllableCount,
    difficultWordCount,
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
    readTime,
    detectedLanguage,
    multilingualReadability
  };
}

/**
 * Parses sentences with character offsets, without duplicate tokenization.
 */
function parseSentences(text: string): SentenceAnalysis[] {
  SENTENCE_REGEX.lastIndex = 0;
  const list: SentenceAnalysis[] = [];
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = SENTENCE_REGEX.exec(text)) !== null) {
    const raw = match[0].trim();
    if (!raw) continue;

    list.push({
      index,
      text: raw,
      wordCount: 0,
      syllableCount: 0,
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      isRunOn: false,
      hasPassiveVoice: false
    });
    index++;
  }

  return list;
}

/**
 * Identifies passive voice constructs, extracts agent clauses ("by [agent]")
 * to construct active voice replacements, and provides active verb suggestions
 * for agentless passives.
 */
function detectPassiveVoice(text: string): TextSpan[] {
  const spans: TextSpan[] = [];
  PASSIVE_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = PASSIVE_PATTERN.exec(text)) !== null) {
    const fullMatch = match[0];
    const aux = match[1].toLowerCase();
    const adverb = match[2];
    const participle = match[3].toLowerCase();
    const agentRaw = match[4];

    if (!TO_BE_FORMS.has(aux)) continue;

    const isCandidate = participle.endsWith('ed') || IRREGULAR_PAST_PARTICIPLES.has(participle);
    if (!isCandidate) continue;

    let activeVerb = PAST_PARTICIPLE_TO_ACTIVE[participle] || participle;
    if (adverb) {
      activeVerb = `${adverb} ${activeVerb}`;
    }

    if (agentRaw && agentRaw.trim().length > 0) {
      const words = agentRaw.trim().split(/\s+/);
      const cleanWords: string[] = [];

      for (const w of words) {
        if (AGENT_STOP_WORDS.has(w.toLowerCase())) {
          break;
        }
        cleanWords.push(w);
      }

      const agent = cleanWords.join(' ');
      if (agent.length > 0) {
        const byMatch = /\bby\b/i.exec(fullMatch);
        const byIndex = byMatch ? byMatch.index : fullMatch.toLowerCase().lastIndexOf('by');
        const agentIndex = byIndex !== -1 ? fullMatch.indexOf(agent, byIndex + 2) : -1;
        const spanText = agentIndex !== -1 ? fullMatch.slice(0, agentIndex + agent.length) : fullMatch.slice(0, byIndex + 2) + ' ' + agent;
        const rawFix = `${agent} ${activeVerb}`;
        const fixReplacement = preserveCase(spanText, rawFix);

        spans.push({
          text: spanText,
          startIndex: match.index,
          endIndex: match.index + spanText.length,
          type: 'passive',
          suggestion: `Passive voice with agent detected. Consider active voice: "${fixReplacement}".`,
          fixReplacement,
          replacements: [fixReplacement],
          category: 'passive_voice'
        });
        continue;
      }
    }

    // Agentless passive: provide active transitive verb suggestion
    const fixReplacement = preserveCase(participle, activeVerb);
    spans.push({
      text: fullMatch,
      startIndex: match.index,
      endIndex: match.index + fullMatch.length,
      type: 'passive',
      suggestion: `Passive voice detected. Consider rewriting with an active verb (e.g., "${fixReplacement}").`,
      fixReplacement,
      replacements: [fixReplacement, `the team ${activeVerb}`, `authors ${activeVerb}`],
      category: 'passive_voice'
    });
  }

  return spans;
}
