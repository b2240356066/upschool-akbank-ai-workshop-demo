import React from 'react';
import { CheckCircle2, AlertOctagon, Layers, ArrowUpRight } from 'lucide-react';
import { CompetencyAudit, Language } from '../../types';
import { translations } from '../../locales/translations';

interface SkillGapMatrixProps {
  audit: CompetencyAudit;
  language: Language;
}

export const SkillGapMatrix: React.FC<SkillGapMatrixProps> = ({ audit, language }) => {
  const t = translations[language];

  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'kritik':
        return {
          badge: 'text-rose-700 bg-rose-50 border-rose-200',
          dot: 'text-rose-500',
          title: t.gapSeverityCritical,
        };
      case 'high':
      case 'yüksek':
        return {
          badge: 'text-amber-700 bg-amber-50 border-amber-200',
          dot: 'text-amber-500',
          title: t.gapSeverityHigh,
        };
      default:
        return {
          badge: 'text-blue-700 bg-blue-50 border-blue-200',
          dot: 'text-blue-500',
          title: t.gapSeverityMedium,
        };
    }
  };

  const getProficiencyStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case 'advanced':
      case 'ileri':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'intermediate':
      case 'orta':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs mb-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 md:p-8">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4" />
          <span>{t.competencyAuditTitle}</span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Mevcut Yetkinlik Dökümü & Boşluk Analizi
        </h3>

        {audit.summary && (
          <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed max-w-4xl">
            {audit.summary}
          </p>
        )}
      </div>

      {/* Two Column Grid: Verified Skills vs. Critical Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Column: Acquired Skills */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.acquiredSkillsTitle}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {audit.acquiredSkills?.length || 0} Yetkinlik
            </span>
          </div>

          <div className="space-y-3">
            {audit.acquiredSkills && audit.acquiredSkills.length > 0 ? (
              audit.acquiredSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {skill.name}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-sm border shrink-0 ${getProficiencyStyle(skill.proficiency)}`}>
                      {skill.proficiency}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span>{skill.category}</span>
                    {skill.evidence && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate italic text-slate-600">
                          {skill.evidence}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">Doğrulanmış yetkinlik bulunamadı.</p>
            )}
          </div>
        </div>

        {/* Right Column: Skill Gaps */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>{t.skillGapsTitle}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {audit.skillGaps?.length || 0} Kritik Eksik
            </span>
          </div>

          <div className="space-y-3">
            {audit.skillGaps && audit.skillGaps.length > 0 ? (
              audit.skillGaps.map((gap, idx) => {
                const style = getSeverityStyle(gap.severity);
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {gap.skill}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-sm border shrink-0 ${style.badge}`}>
                        {gap.severity}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-700 leading-relaxed">
                      <span className="font-semibold text-slate-900">{t.whyNeeded} </span>
                      {gap.whyNeeded}
                    </p>

                    {gap.gapType && (
                      <div className="mt-2 text-[11px] text-slate-400 font-medium">
                        Tür: {gap.gapType}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 italic">Eksik beceri tespit edilmedi.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
