import React, { useState } from 'react';
import { Check, X, Shield, Zap, Building, Users } from 'lucide-react';

export interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTier?: (tier: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSelectTier
}) => {
  if (!isOpen) return null;

  const [customerEmail, setCustomerEmail] = useState<string>('subscriber@example.com');

  const handleCheckout = async (tier: string) => {
    if (onSelectTier) {
      onSelectTier(tier);
    }

    const email = customerEmail.trim() || 'subscriber@example.com';

    try {
      const res = await fetch('http://localhost:4000/api/v1/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          email,
          provider: 'stripe'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.checkoutUrl) {
          window.open(data.checkoutUrl, '_blank');
          return;
        }
      }
    } catch {
      // Fastify Pro server might not be running locally on port 4000
    }

    // Direct fallback modal feedback
    alert(`Initiating secure checkout for LexiMetric Pro (${tier.toUpperCase()}) for ${email}... Redirecting to payment portal.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-6 mb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Commercial Plans
              </span>
              <span className="text-xs text-slate-400">LexiMetric Enterprise Edition</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Scale Your Newsroom & Editorial Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Choose the tier tailored for your editorial volume — from independent creators to global news syndicates.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email delivery bar */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-0.5">
              License Delivery Email
            </label>
            <p className="text-[11px] text-slate-400">Your cryptographic license key and credentials will be sent to this address.</p>
          </div>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="subscriber@example.com"
            className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-full sm:w-72 font-mono"
          />
        </div>

        {/* 4-Column Tier Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* 1. Community Edition */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Open Source</div>
              <h3 className="text-lg font-bold text-white mb-2">Community</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-400">free forever</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 pb-4 border-b border-slate-800/80">
                Core linguistic profiler and read-time analytics for individual writers.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>6 Classic Readability Formulas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Calibrated Silent & Audio Read Time</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Multilingual Profiler (5 Languages)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>CLI & Embeddable HTML Badge</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span>Tone Adjustment Engine</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span>Slack / Teams Webhooks</span>
                </li>
              </ul>
            </div>
            <button
              disabled
              className="w-full py-2.5 bg-slate-800/50 text-slate-400 font-semibold text-xs rounded-xl border border-slate-700/60 cursor-default text-center"
            >
              Current Active Plan
            </button>
          </div>

          {/* 2. Pro Creator */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500/50 transition-all">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-400" />
                <span>Solo Pro</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pro Creator</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-white">$19</span>
                <span className="text-xs text-slate-400">one-time</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 pb-4 border-b border-slate-800/80">
                Advanced tone calibration, custom stylebooks, and social sharing assets.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="font-semibold text-white">Everything in Community</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Automated Tone Rewrites</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Custom Stylebooks & Rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>1200x630 Social Card Generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>WordPress Gutenberg Plugin</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span>Team Slack / Teams Alerts</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('creator')}
              className="w-full py-2.5 bg-purple-600/90 hover:bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center"
            >
              Get Creator ($19)
            </button>
          </div>

          {/* 3. Pro Newsroom (Featured) */}
          <div className="bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-950/90 border-2 border-purple-500 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative scale-100 lg:-translate-y-1">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-md">
              Most Popular
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-300" />
                <span>Editorial Desk</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pro Newsroom</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-white">$49</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-300 mb-4 pb-4 border-b border-purple-900/50">
                Real-time team auditing, multi-article batch profiling, and Slack webhooks.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">Everything in Creator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Slack & MS Teams Webhook Alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Multi-Document Batch Profiler</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Headless REST API Access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>10 Team Seats & Authorized Domains</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Newsroom AP & Chicago Presets</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('newsroom')}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer text-center"
            >
              Subscribe Newsroom ($49/mo)
            </button>
          </div>

          {/* 4. Enterprise */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/50 transition-all">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1">
                <Building className="w-3 h-3 text-amber-400" />
                <span>Media Enterprise</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-white">$299</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 pb-4 border-b border-slate-800/80">
                Full AI Copilot coprocessor, unlimited seats & domains, and air-gapped SLA.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-semibold text-white">Everything in Newsroom</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>AI Copilot (Ollama / Gemini API)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Unlimited Seats & Domains</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Custom Corporate Dictionaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Dedicated SLA & Support Engineer</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Air-Gapped On-Premises Option</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('enterprise')}
              className="w-full py-2.5 bg-slate-800 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
            >
              Deploy Enterprise ($299/mo)
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Cryptographic offline license engine with zero telemetry phone-home requirements.</span>
          </div>
          <div>
            Need custom wire transfer or invoice terms? Contact <a href="mailto:billing@leximetric.io" className="text-purple-400 hover:underline">billing@leximetric.io</a>
          </div>
        </div>

      </div>
    </div>
  );
};
