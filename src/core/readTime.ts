export interface ReadTimeSpeedConfig {
  silentWpm: number;
  speakingWpm: number;
}

export interface ReadTimeEstimate {
  // Silent reading
  silentReadingSeconds: number;
  silentReadingMinutes: number;
  silentReadingFormatted: string;
  adjustedSilentWpm: number;

  // Spoken / Audio narration (Podcast / Teleprompter)
  speakingSeconds: number;
  speakingMinutes: number;
  speakingFormatted: string;

  // Preset breakdown
  presets: {
    slowReader: { wpm: number; formatted: string };
    averageReader: { wpm: number; formatted: string };
    fastReader: { wpm: number; formatted: string };
  };
}

const DEFAULT_SILENT_WPM = 225; // Median adult silent reading speed
const DEFAULT_SPEAKING_WPM = 140; // Standard audio narration / teleprompter speed

/**
 * Calculates dynamic reading and speaking time calibrated by text complexity.
 *
 * @param wordCount Total words in text
 * @param syllablesPerWord Average syllables per word
 * @param fleschReadingEase Flesch score (0-100)
 */
export function calculateReadTime(
  wordCount: number,
  syllablesPerWord: number = 1.4,
  fleschReadingEase: number = 60
): ReadTimeEstimate {
  if (wordCount <= 0) {
    return {
      silentReadingSeconds: 0,
      silentReadingMinutes: 0,
      silentReadingFormatted: '0 sec',
      adjustedSilentWpm: DEFAULT_SILENT_WPM,
      speakingSeconds: 0,
      speakingMinutes: 0,
      speakingFormatted: '0 sec',
      presets: {
        slowReader: { wpm: 170, formatted: '0 sec' },
        averageReader: { wpm: DEFAULT_SILENT_WPM, formatted: '0 sec' },
        fastReader: { wpm: 300, formatted: '0 sec' }
      }
    };
  }

  // Complexity modifier:
  // Baseline FRE is 60 (standard). For each 10 points above 60, speed increases ~3%.
  // For each 10 points below 60, speed decreases ~5%.
  const freDelta = fleschReadingEase - 60;
  const complexityFactor = freDelta >= 0
    ? 1 + (freDelta / 10) * 0.03
    : 1 + (freDelta / 10) * 0.05;

  // Syllable modifier: standard english is ~1.45 syllables/word
  const syllableFactor = 1.45 / Math.max(1.0, syllablesPerWord);

  const combinedFactor = Math.min(1.4, Math.max(0.65, complexityFactor * 0.7 + syllableFactor * 0.3));
  const adjustedSilentWpm = Math.round(DEFAULT_SILENT_WPM * combinedFactor);

  const silentSeconds = Math.round((wordCount / adjustedSilentWpm) * 60);
  const speakingSeconds = Math.round((wordCount / DEFAULT_SPEAKING_WPM) * 60);

  return {
    silentReadingSeconds: silentSeconds,
    silentReadingMinutes: Math.round((silentSeconds / 60) * 10) / 10,
    silentReadingFormatted: formatDuration(silentSeconds),
    adjustedSilentWpm,

    speakingSeconds,
    speakingMinutes: Math.round((speakingSeconds / 60) * 10) / 10,
    speakingFormatted: formatDuration(speakingSeconds),

    presets: {
      slowReader: {
        wpm: 170,
        formatted: formatDuration(Math.round((wordCount / 170) * 60))
      },
      averageReader: {
        wpm: adjustedSilentWpm,
        formatted: formatDuration(silentSeconds)
      },
      fastReader: {
        wpm: 300,
        formatted: formatDuration(Math.round((wordCount / 300) * 60))
      }
    }
  };
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 1) return '0 sec';
  if (totalSeconds < 60) return `${totalSeconds} sec`;

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }
  return `${minutes} min ${remainingSeconds}s`;
}
