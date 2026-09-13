#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { profileText } from '../core/linguistics.js';

interface CliArgs {
  filePath?: string;
  inlineText?: string;
  jsonOutput: boolean;
  showHelp: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    jsonOutput: false,
    showHelp: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      result.showHelp = true;
    } else if (arg === '--json' || arg === '-j') {
      result.jsonOutput = true;
    } else if (arg === '--file' || arg === '-f') {
      result.filePath = args[++i];
    } else if (arg === '--text' || arg === '-t') {
      result.inlineText = args[++i];
    } else if (!arg.startsWith('-') && !result.filePath && !result.inlineText) {
      result.filePath = arg;
    }
  }

  return result;
}

function printHelp() {
  console.log(`
\x1b[1m\x1b[36m=== LexiMetric CLI ===\x1b[0m
Editorial Read-Time & Linguistic Profiler

\x1b[1mUSAGE:\x1b[0m
  leximetric [options]
  leximetric <file-path>
  cat article.txt | leximetric

\x1b[1mOPTIONS:\x1b[0m
  -f, --file <path>       Analyze text from a file
  -t, --text <string>     Analyze text passed directly as a string
  -j, --json              Output machine-readable JSON format
  -h, --help              Display this help message

\x1b[1mEXAMPLES:\x1b[0m
  leximetric --text "The quick brown fox jumps over the lazy dog."
  leximetric article.md --json
`);
}

async function readInput(cliArgs: CliArgs): Promise<string> {
  if (cliArgs.inlineText) {
    return cliArgs.inlineText;
  }

  if (cliArgs.filePath) {
    const resolved = path.resolve(process.cwd(), cliArgs.filePath);
    if (!fs.existsSync(resolved)) {
      console.error(`\x1b[31mError: File not found: ${resolved}\x1b[0m`);
      process.exit(1);
    }
    return fs.readFileSync(resolved, 'utf-8');
  }

  // Check stdin
  if (!process.stdin.isTTY) {
    return new Promise((resolve) => {
      let data = '';
      process.stdin.setEncoding('utf-8');
      process.stdin.on('data', chunk => { data += chunk; });
      process.stdin.on('end', () => { resolve(data); });
    });
  }

  printHelp();
  process.exit(0);
}

async function main() {
  const cliArgs = parseArgs();

  if (cliArgs.showHelp) {
    printHelp();
    process.exit(0);
  }

  const text = await readInput(cliArgs);
  if (!text || !text.trim()) {
    console.error('\x1b[33mWarning: Input text is empty.\x1b[0m');
    process.exit(0);
  }

  const profile = profileText(text);

  if (cliArgs.jsonOutput) {
    console.log(JSON.stringify(profile, null, 2));
    return;
  }

  // Formatted Terminal Output
  const r = profile.readability;
  const t = profile.readTime;

  console.log(`
\x1b[1m\x1b[36m========================================================\x1b[0m
\x1b[1m\x1b[37m  LEXIMETRIC EDITORIAL LINGUISTIC REPORT\x1b[0m
\x1b[1m\x1b[36m========================================================\x1b[0m

\x1b[1m\x1b[33m[ ESTIMATED READ & AUDIO TIMES ]\x1b[0m
  Silent Reading:      \x1b[1m\x1b[32m${t.silentReadingFormatted}\x1b[0m (calibrated at ${t.adjustedSilentWpm} WPM)
  Podcast / Speech:    \x1b[1m\x1b[34m${t.speakingFormatted}\x1b[0m (narration @ 140 WPM)
  Reader Variations:   Slow: ${t.presets.slowReader.formatted} | Fast: ${t.presets.fastReader.formatted}

\x1b[1m\x1b[33m[ READABILITY INDEXES ]\x1b[0m
  Flesch Reading Ease: \x1b[1m\x1b[35m${r.fleschReadingEase} / 100\x1b[0m (${r.difficultyLabel})
  Consensus Grade:     \x1b[1m\x1b[32m${r.gradeBand}\x1b[0m (${r.targetAudience})
  Flesch-Kincaid:      Grade ${r.fleschKincaidGrade}
  Gunning Fog Index:   ${r.gunningFog}
  Coleman-Liau Index:  ${r.colemanLiauIndex}
  SMOG Index:          ${r.smogIndex}
  Automated Read (ARI):${r.automatedReadabilityIndex}

\x1b[1m\x1b[33m[ TEXT & SYNTACTIC PROFILE ]\x1b[0m
  Words:               ${profile.wordCount}
  Unique Words:        ${profile.uniqueWordCount} (Lexical Diversity: ${profile.lexicalDiversityPercent}%)
  Sentences:           ${profile.sentenceCount} (Avg Length: ${profile.averageSentenceLength} words)
  Paragraphs:          ${profile.paragraphCount}
  Syllables:           ${profile.syllableCount} (Avg: ${profile.averageSyllablesPerWord} per word)
  Complex (3+ syl):    ${profile.polysyllableCount} (${profile.complexWordPercent}%)

\x1b[1m\x1b[33m[ EDITORIAL DIAGNOSTICS ]\x1b[0m
  Passive Voice Spans: ${profile.spans.filter(s => s.type === 'passive').length}
  Run-on Sentences:    ${profile.runOnSentencesCount} (>= 30 words)
  Wordiness Flags:     ${profile.spans.filter(s => s.type === 'wordiness').length}
\x1b[1m\x1b[36m========================================================\x1b[0m
`);
}

main().catch((err) => {
  console.error('CLI Fatal Error:', err);
  process.exit(1);
});
