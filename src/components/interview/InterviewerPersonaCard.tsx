import React from 'react';
import { Target, CheckCircle2, AlertTriangle, BarChart3, UserCheck } from 'lucide-react';
import { InterviewerPersona, Language } from '../../types';
import { translations } from '../../locales/translations';

interface InterviewerPersonaCardProps {
  persona: InterviewerPersona;
  language: Language;
}

export const InterviewerPersonaCard: React.FC<InterviewerPersonaCardProps> = ({
  persona,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs mb-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 md:p-8">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <UserCheck className="w-4 h-4" />
          <span>{t.personaAnalysisTitle}</span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span className="text-slate-300 font-normal">{persona.title}</span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          {persona.title}
        </h3>

        <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-4xl">
          {persona.roleSummary}
        </p>

        {persona.coreMindset && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-start gap-2 text-xs md:text-sm text-slate-400">
            <span className="font-semibold text-slate-200 shrink-0">Temel Yaklaşım / Mindset:</span>
            <span>{persona.coreMindset}</span>
          </div>
        )}
      </div>

      {/* 3-Column Strategy Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 p-6 md:p-8 gap-6 md:gap-0">
        {/* Column 1: What Impresses Them */}
        <div className="md:pr-6">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.whatImpressesTitle}</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {persona.whatImpressesThem.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Red Flags */}
        <div className="md:px-6">
          <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{t.redFlagsTitle}</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {persona.redFlags.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Evaluation Metrics */}
        <div className="md:pl-6">
          <div className="flex items-center gap-2 text-indigo-900 font-semibold text-sm mb-3">
            <BarChart3 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{t.evaluationMetricsTitle}</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {persona.evaluationMetrics.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
