import React, { useState, useMemo, useRef } from 'react';
import {
  Clock,
  Mic,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle,
  FileText,
  Copy,
  Upload,
  RefreshCw,
  Sparkles,
  BarChart2,
  Sliders,
  Download,
  Eye,
  Edit3,
  Globe,
  Code,
  Printer
} from 'lucide-react';
import { profileText, LinguisticProfile } from '../core/linguistics.js';
import { generateEmbedSnippet } from '../embed/badge.js';
import { analyzeMarkdownDocument } from '../core/markdown.js';

const SAMPLE_TEXTS = {
  journalism: `The global transition toward renewable energy accelerated significantly this quarter as investments in solar photovoltaic infrastructure surpassed fossil fuel expenditures for the first time in modern history. 

Energy ministers from thirty-four countries convened in Geneva on Wednesday to finalize a binding agreement concerning cross-border grid synchronization. Although several regulatory bottlenecks remain unresolved, preliminary audits indicate that decentralization has improved grid resilience against severe meteorological phenomena.

The agreement was signed by delegates following forty-eight hours of continuous deliberation. In order to maximize efficiency, grid operators will utilize advanced algorithmic load-balancing to distribute surplus power across regional transmission corridors.`,

  academic: `In this investigation, empirical evidence is presented to evaluate the cognitive paradigms governing human-computer interaction within asynchronous collaborative environments. Due to the fact that prior research failed to isolate confounding demographic variables, an orthogonal randomized factorial methodology was utilized.

The subsequent statistical analysis revealed statistically significant variance in task completion latency across experimental cohorts. It is important to note that participants exhibited heightened susceptibility to cognitive fatigue when presented with excessive typographic density. Consequently, future interface architectures must prioritize minimalist layout taxonomies to mitigate extraneous cognitive overhead.`,

  conversational: `Building a newsletter audience in 2026 is less about algorithmic tricks and more about genuine voice. Readers are tired of generic summaries and automated listicles. They want honest stories, raw opinions, and practical takeaways they can put to work immediately.

If you write with clarity and respect your reader's time, people will stick around. Keep your sentences crisp, trim every extra word, and treat your inbox like a direct conversation with a friend.`,

  spanish: `La transición global hacia las energías renovables se aceleró significativamente este año. Los ministros de energía se reunieron para consolidar acuerdos vinculantes sobre la descarbonización de la economía industrial.

Los informes preliminares demuestran que las tecnologías sostenibles han mejorado la resiliencia climática y fomentado el crecimiento económico regional con gran éxito.`,

  german: `Die nachhaltige Umgestaltung der europäischen Energielandschaft schreitet mit bemerkenswerter Dynamik voran. Ingenieure und Wissenschaftler entwickeln innovative Speichertechnologien für erneuerbare Energien.

Experten betonen, dass eine zügige Modernisierung der Infrastruktur entscheidend für die langfristige Stabilität der Stromnetze ist.`,

  italian: `La transizione ecologica e l'innovazione tecnologica rappresentano una svolta fondamentale per l'economia contemporanea. Ricercatori e istituzioni collaborano per promuovere modelli di sviluppo sostenibile in tutta la penisola italiana.

Gli investimenti nelle fonti rinnovabili hanno registrato una crescita costante, consentendo una riduzione significativa delle emissioni inquinanti nei principali centri urbani.`,

  portuguese: `O avanço da inteligência artificial e a transformação digital estão revolucionando o panorama editorial e científico. Especialistas e pesquisadores em Lisboa e São Paulo destacam a importância de diretrizes éticas claras para garantir a transparência dos algoritmos.

Com a modernização contínua das plataformas de comunicação, as publicações digitais ampliam o acesso ao conhecimento com grande velocidade e eficiência.`
};

export const App: React.FC = () => {
  const [text, setText] = useState<string>(SAMPLE_TEXTS.journalism);
  const [viewMode, setViewMode] = useState<'editor' | 'annotated'>('editor');
  const [activeFilter, setActiveFilter] = useState<'all' | 'passive' | 'run-on' | 'complex-word' | 'wordiness'>('all');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [showBadgeModal, setShowBadgeModal] = useState<boolean>(false);
  const [badgeTheme, setBadgeTheme] = useState<'dark' | 'light' | 'editorial' | 'minimal'>('dark');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile: LinguisticProfile = useMemo(() => {
    return profileText(text);
  }, [text]);

  const markdownDoc = useMemo(() => {
    return analyzeMarkdownDocument(text);
  }, [text]);

  const filteredSpans = useMemo(() => {
    if (activeFilter === 'all') return profile.spans;
    return profile.spans.filter(s => s.type === activeFilter);
  }, [profile.spans, activeFilter]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleApplyFix = (span: { startIndex: number; endIndex: number; fixReplacement?: string }) => {
    if (!span.fixReplacement) return;
    const before = text.substring(0, span.startIndex);
    const after = text.substring(span.endIndex);
    setText(before + span.fixReplacement + after);
  };

  const handleDownloadMarkdownReport = () => {
    const r = profile.readability;
    const t = profile.readTime;
    const md = `# LexiMetric Editorial Assessment Report

Generated on: ${new Date().toISOString()}

---

## 1. Executive Summary

- **Total Word Count**: ${profile.wordCount}
- **Silent Reading Time**: ${t.silentReadingFormatted} (calibrated @ ${t.adjustedSilentWpm} WPM)
- **Speech / Podcast Narration**: ${t.speakingFormatted} (@ 140 WPM)
- **Flesch Reading Ease**: ${r.fleschReadingEase} / 100 (${r.difficultyLabel})
- **Consensus Grade Level**: ${r.gradeBand} (${r.targetAudience})

---

## 2. Readability Battery

| Metric | Score | Target / Reference |
| :--- | :---: | :--- |
| **Flesch Reading Ease** | ${r.fleschReadingEase} | 60-70 = Standard Plain English |
| **Flesch-Kincaid Grade** | Grade ${r.fleschKincaidGrade} | 8th-9th grade for consumer media |
| **Gunning Fog Index** | ${r.gunningFog} | < 12 ideal for public communication |
| **Coleman-Liau Index** | ${r.colemanLiauIndex} | Higher for academic / dense vocabulary |
| **SMOG Index** | ${r.smogIndex} | Extrapolated polysyllable benchmark |
| **Automated Readability (ARI)** | ${r.automatedReadabilityIndex} | Character & word length ratio |

---

## 3. Syntactic & Lexical Breakdown

- **Unique Words**: ${profile.uniqueWordCount} (Lexical Diversity TTR: ${profile.lexicalDiversityPercent}%)
- **Average Sentence Length**: ${profile.averageSentenceLength} words
- **Average Syllables per Word**: ${profile.averageSyllablesPerWord}
- **Complex Words (3+ syllables)**: ${profile.polysyllableCount} (${profile.complexWordPercent}%)
- **Run-on Sentences (>= 30 words)**: ${profile.runOnSentencesCount}
- **Passive Voice Formulations**: ${profile.spans.filter(s => s.type === 'passive').length}
- **Wordiness / Bloat Flags**: ${profile.spans.filter(s => s.type === 'wordiness').length}

---

## 4. Flagged Diagnostics

${profile.spans.map((s, i) => `${i + 1}. **[${s.type.toUpperCase()}]** "${s.text}" — *${s.suggestion || 'Review phrasing'}*`).join('\n')}

---
*Report generated automatically by LexiMetric Community Edition.*
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leximetric-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setText(content);
      }
    };
    reader.readAsText(file);
  };

  // Score color helper
  const getFreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    if (score >= 45) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  // Render text with interactive highlighted spans
  const renderAnnotatedText = () => {
    if (!text.trim()) {
      return <div className="text-slate-500 italic p-4">No text entered.</div>;
    }

    // Sort spans by startIndex
    const sorted = [...profile.spans].sort((a, b) => a.startIndex - b.startIndex);
    const elements: React.ReactNode[] = [];
    let lastIdx = 0;

    sorted.forEach((span, i) => {
      if (span.startIndex < lastIdx) return; // Skip overlapping spans for clean rendering

      // Text before span
      if (span.startIndex > lastIdx) {
        elements.push(
          <span key={`text_${lastIdx}`}>
            {text.substring(lastIdx, span.startIndex)}
          </span>
        );
      }

      // Span element
      const highlightClasses =
        span.type === 'passive' ? 'bg-amber-500/20 text-amber-200 border-b-2 border-amber-500' :
        span.type === 'run-on' ? 'bg-rose-500/20 text-rose-200 border-b-2 border-rose-500' :
        span.type === 'wordiness' ? 'bg-purple-500/20 text-purple-200 border-b-2 border-purple-500' :
        'bg-cyan-500/20 text-cyan-200 border-b-2 border-cyan-500';

      elements.push(
        <span
          key={`span_${i}_${span.startIndex}`}
          className={`px-1 py-0.5 rounded transition-all cursor-help relative group ${highlightClasses}`}
          title={`${span.type.toUpperCase()}: ${span.suggestion || ''}`}
        >
          {text.substring(span.startIndex, span.endIndex)}
          <span className="hidden group-hover:block absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2.5 py-1 text-[11px] font-sans font-medium text-white bg-slate-900 border border-slate-700 rounded-lg shadow-xl whitespace-nowrap">
            <span className="font-bold text-indigo-400 uppercase text-[9px] mr-1">[{span.type}]</span>
            {span.suggestion}
          </span>
        </span>
      );

      lastIdx = span.endIndex;
    });

    if (lastIdx < text.length) {
      elements.push(
        <span key={`text_end`}>
          {text.substring(lastIdx)}
        </span>
      );
    }

    return (
      <div className="w-full flex-1 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans overflow-y-auto min-h-[300px] max-h-[500px]">
        {elements}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  LexiMetric
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Community Edition
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 rounded-full">
                  ⚡ ~1M words/sec
                </span>
              </div>
              <p className="text-xs text-slate-400">Editorial Read-Time & Linguistic Profiler</p>
            </div>
          </div>

          {/* Quick presets & action bar */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
              <span className="text-slate-400 px-2 font-medium">Presets:</span>
              <button
                onClick={() => setText(SAMPLE_TEXTS.journalism)}
                className="px-2.5 py-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Journalism
              </button>
              <button
                onClick={() => setText(SAMPLE_TEXTS.academic)}
                className="px-2.5 py-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Academic
              </button>
              <button
                onClick={() => setText(SAMPLE_TEXTS.conversational)}
                className="px-2.5 py-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Blog
              </button>
              <button
                onClick={() => setText(SAMPLE_TEXTS.spanish)}
                className="px-2.5 py-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Español
              </button>
              <button
                onClick={() => setText(SAMPLE_TEXTS.german)}
                className="px-2.5 py-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Deutsch
              </button>
              <button
                onClick={() => setText(SAMPLE_TEXTS.italian)}
                className="px-2.5 py-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Italiano
              </button>
              <button
                onClick={() => setText(SAMPLE_TEXTS.portuguese)}
                className="px-2.5 py-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Português
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700/80 transition-all"
              title="Upload text or markdown file"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload</span>
            </button>

            <button
              onClick={() => setShowBadgeModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-200 bg-amber-900/30 hover:bg-amber-900/50 rounded-lg border border-amber-700/50 transition-all"
              title="Get Embeddable Article Badge"
            >
              <Code className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Badge</span>
            </button>

            <button
              onClick={handleDownloadMarkdownReport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-200 bg-indigo-900/40 hover:bg-indigo-900/60 rounded-lg border border-indigo-700/50 transition-all"
              title="Download Markdown Editorial Report"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Report (.md)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700/80 transition-all"
              title="Print Editorial Scorecard"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700/80 transition-all"
              title="Copy JSON metrics to clipboard"
            >
              {copySuccess ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copySuccess ? 'Copied' : 'JSON'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Editor & Diagnostics (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Editor Container */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col flex-1 min-h-[460px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-slate-200">Editorial Manuscript</span>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setViewMode('editor')}
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md transition-all ${
                      viewMode === 'editor'
                        ? 'bg-indigo-600 text-white font-medium shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Raw</span>
                  </button>
                  <button
                    onClick={() => setViewMode('annotated')}
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md transition-all ${
                      viewMode === 'annotated'
                        ? 'bg-indigo-600 text-white font-medium shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Annotated</span>
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-3">
                <span><strong className="text-slate-200">{profile.wordCount}</strong> words</span>
                <span>•</span>
                <span><strong className="text-slate-200">{profile.characterCountWithSpaces}</strong> chars</span>
                <span>•</span>
                <span><strong className="text-slate-200">{profile.sentenceCount}</strong> sentences</span>
                <button
                  onClick={() => setText('')}
                  className="hover:text-rose-400 transition-colors ml-2"
                  title="Clear text"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Textarea or Annotated Overlay */}
            {viewMode === 'editor' ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type editorial text here to analyze read-time, syllable density, passive voice, and readability..."
                className="w-full flex-1 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y min-h-[300px] leading-relaxed font-sans"
              />
            ) : (
              renderAnnotatedText()
            )}

            {/* Diagnostic Filters Toolbar */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                  <Sliders className="w-3 h-3" /> Diagnostics:
                </span>
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                    activeFilter === 'all'
                      ? 'bg-indigo-600 text-white font-medium shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({profile.spans.length})
                </button>
                <button
                  onClick={() => setActiveFilter('passive')}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                    activeFilter === 'passive'
                      ? 'bg-amber-600 text-white font-medium shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Passive ({profile.spans.filter(s => s.type === 'passive').length})
                </button>
                <button
                  onClick={() => setActiveFilter('run-on')}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                    activeFilter === 'run-on'
                      ? 'bg-rose-600 text-white font-medium shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Run-ons ({profile.runOnSentencesCount})
                </button>
                <button
                  onClick={() => setActiveFilter('wordiness')}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                    activeFilter === 'wordiness'
                      ? 'bg-purple-600 text-white font-medium shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Wordiness ({profile.spans.filter(s => s.type === 'wordiness').length})
                </button>
                <button
                  onClick={() => setActiveFilter('complex-word')}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                    activeFilter === 'complex-word'
                      ? 'bg-cyan-600 text-white font-medium shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  3+ Syllables ({profile.polysyllableCount})
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostic Issues List */}
          {filteredSpans.length > 0 && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Flagged Linguistic Spans ({filteredSpans.length})
                </span>
                <span className="text-[11px] text-slate-500">Click a span to review recommendation</span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {filteredSpans.slice(0, 15).map((span, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded uppercase ${
                          span.type === 'passive' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          span.type === 'run-on' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          span.type === 'wordiness' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                          'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          {span.type}
                        </span>
                        <span className="font-mono text-slate-200">"{span.text.length > 50 ? span.text.substring(0, 50) + '...' : span.text}"</span>
                      </div>
                      {span.suggestion && (
                        <p className="text-slate-400 text-[11px]">{span.suggestion}</p>
                      )}
                    </div>
                    {span.fixReplacement && (
                      <button
                        onClick={() => handleApplyFix(span)}
                        className="px-2 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-[10px] font-semibold transition-all shrink-0 cursor-pointer"
                        title={`Replace with "${span.fixReplacement}"`}
                      >
                        Replace → "{span.fixReplacement}"
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Analytics & Gauges (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* 1. Estimated Read & Audio Time Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-200">Read & Audio Velocity</span>
              </div>
              <span className="text-[11px] text-slate-400">Dynamic Complexity WPM</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Silent Reading */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Silent Reading</span>
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {profile.readTime.silentReadingFormatted}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Calibrated @ <strong className="text-slate-300">{profile.readTime.adjustedSilentWpm}</strong> WPM
                </p>
              </div>

              {/* Spoken / Narration */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Mic className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Podcast / Audio</span>
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {profile.readTime.speakingFormatted}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Voiceover @ <strong className="text-slate-300">140</strong> WPM
                </p>
              </div>
            </div>

            {/* Reader Variation Chips */}
            <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
              <span className="text-slate-400">Reader Profiles:</span>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Slow: {profile.readTime.presets.slowReader.formatted}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Fast: {profile.readTime.presets.fastReader.formatted}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Readability Scorecard */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-slate-200">Readability Consensus</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                {profile.readability.gradeBand}
              </span>
            </div>

            {/* Main Score Hero */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/70 border border-slate-800 mb-4">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Flesch Reading Ease</div>
                <div className="text-3xl font-extrabold text-white tracking-tight">
                  {profile.readability.fleschReadingEase} <span className="text-sm font-medium text-slate-500">/ 100</span>
                </div>
                <div className="text-xs font-medium text-slate-300 mt-1">
                  {profile.readability.difficultyLabel}
                </div>
              </div>
              <div className={`px-4 py-2 rounded-xl border text-center font-bold text-sm ${getFreColor(profile.readability.fleschReadingEase)}`}>
                <div>{profile.readability.targetAudience}</div>
              </div>
            </div>

            {/* Readability Indexes Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-center justify-between">
                <span className="text-slate-400">Flesch-Kincaid</span>
                <span className="font-semibold text-slate-200">Grade {profile.readability.fleschKincaidGrade}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-center justify-between">
                <span className="text-slate-400">Gunning Fog</span>
                <span className="font-semibold text-slate-200">{profile.readability.gunningFog}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-center justify-between">
                <span className="text-slate-400">Coleman-Liau</span>
                <span className="font-semibold text-slate-200">{profile.readability.colemanLiauIndex}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-center justify-between">
                <span className="text-slate-400">SMOG Index</span>
                <span className="font-semibold text-slate-200">{profile.readability.smogIndex}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-center justify-between">
                <span className="text-slate-400">Dale-Chall</span>
                <span className="font-semibold text-slate-200">{profile.readability.daleChallIndex}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-center justify-between">
                <span className="text-slate-400">Linsear Write</span>
                <span className="font-semibold text-slate-200">{profile.readability.linsearWrite}</span>
              </div>
              <div className="col-span-2 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-center justify-between">
                <span className="text-slate-400">Automated Readability Index (ARI)</span>
                <span className="font-semibold text-slate-200">{profile.readability.automatedReadabilityIndex}</span>
              </div>
            </div>

            {/* Multilingual Extension Card */}
            {profile.multilingualReadability && profile.detectedLanguage && profile.detectedLanguage.language !== 'en' && (
              <div className="mt-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-700/50">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{profile.detectedLanguage.languageName} Readability ({profile.multilingualReadability.secondaryLabel || 'Index'})</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 font-mono">
                    {profile.detectedLanguage.language.toUpperCase()} • {Math.round(profile.detectedLanguage.confidence * 100)}%
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-lg font-bold text-white tracking-tight">
                    {profile.multilingualReadability.score}
                    <span className="text-xs font-normal text-slate-400 ml-1.5">({profile.multilingualReadability.interpretation})</span>
                  </div>
                  <div className="text-xs font-semibold text-indigo-300 bg-indigo-900/40 px-2 py-0.5 rounded">
                    Grade ~{profile.multilingualReadability.gradeEquivalent}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Syntactic & Lexical Metrics */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-slate-200">Linguistic Profile</span>
              </div>
              <span className="text-[11px] text-slate-400">Syllables & Structure</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-lg font-bold text-white">{profile.averageSentenceLength}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Avg Sentence</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-lg font-bold text-white">{profile.averageSyllablesPerWord}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Syl / Word</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-lg font-bold text-white">{profile.lexicalDiversityPercent}%</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Diversity (TTR)</div>
              </div>
            </div>

            {/* Sentence Length Heatmap */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Sentence Cadence ({profile.sentences.length} sentences)</span>
                <span className="text-[11px]">{profile.runOnSentencesCount} run-ons</span>
              </div>
              <div className="flex items-end gap-1 h-12 bg-slate-950/70 p-2 rounded-xl border border-slate-800 overflow-x-auto">
                {profile.sentences.slice(0, 30).map((s, idx) => {
                  const heightPercent = Math.min(100, Math.max(15, (s.wordCount / 35) * 100));
                  const isRunOn = s.wordCount >= 30;
                  const isLong = s.wordCount >= 25 && s.wordCount < 30;
                  return (
                    <div
                      key={idx}
                      style={{ height: `${heightPercent}%` }}
                      title={`Sentence #${idx + 1}: ${s.wordCount} words ${isRunOn ? '(Run-on)' : ''}`}
                      className={`w-3 rounded-t transition-all cursor-pointer ${
                        isRunOn ? 'bg-rose-500 hover:bg-rose-400' :
                        isLong ? 'bg-amber-500 hover:bg-amber-400' :
                        'bg-indigo-500 hover:bg-indigo-400'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Markdown Section Breakdown (when document contains multiple sections) */}
          {markdownDoc.sections.length > 1 && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-slate-200">
                    Markdown Section Breakdown ({markdownDoc.sections.length})
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Structured Readability</span>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {markdownDoc.sections.map((sec, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-xs">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                        H{sec.level}
                      </span>
                      <span className="font-medium text-slate-200 truncate">{sec.heading}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-400 shrink-0 text-[11px]">
                      <span>{sec.wordCount}w</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-200">Flesch {sec.readingEase}</span>
                      <span>•</span>
                      <span className="text-slate-400">{sec.readTimeFormatted}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        LexiMetric Community Edition • Client-Side Algorithmic Profiler • AntiGravity Media-Tech
      </footer>

      {/* Embed Badge Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Embed Article Badge</h3>
              </div>
              <button
                onClick={() => setShowBadgeModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Embed a live, zero-dependency editorial badge directly on your publication's article header.
            </p>

            {/* Theme Selector */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-400 font-medium">Theme:</span>
              {(['dark', 'light', 'editorial', 'minimal'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setBadgeTheme(t)}
                  className={`px-2.5 py-1 text-xs rounded-lg capitalize transition-all ${
                    badgeTheme === t ? 'bg-amber-600 text-white font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Live Preview */}
            <div className="mb-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 mb-2 font-mono uppercase tracking-wider">Live Preview</div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  badgeTheme === 'light' ? 'bg-slate-100 text-slate-800 border border-slate-300' :
                  badgeTheme === 'editorial' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                  badgeTheme === 'minimal' ? 'text-slate-400' :
                  'bg-slate-900 text-slate-100 border border-slate-800'
                }`}
              >
                <span>⏱️</span>
                <span className="font-semibold">{profile.readTime.silentReadingFormatted}</span>
                <span>•</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                  Grade {profile.readability.consensusGrade}
                </span>
                <span>•</span>
                <span className="opacity-75">{profile.wordCount} words</span>
              </div>
            </div>

            {/* Snippet Output */}
            <div className="relative mb-4">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 font-mono overflow-x-auto">
                {generateEmbedSnippet({ theme: badgeTheme, showGrade: true })}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateEmbedSnippet({ theme: badgeTheme, showGrade: true }));
                  alert('Embed code copied to clipboard!');
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Embed Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
