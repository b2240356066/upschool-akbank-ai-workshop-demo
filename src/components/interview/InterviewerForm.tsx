import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Building2, UserCheck, Briefcase } from 'lucide-react';
import { CandidateLevel, Language, InterviewPreset } from '../../types';
import { translations } from '../../locales/translations';
import { interviewPresets } from '../../data/presets';

interface InterviewerFormProps {
  language: Language;
  onGenerate: (data: {
    interviewerTitle: string;
    targetRole: string;
    companyType: string;
    candidateLevel: CandidateLevel;
    interviewRound: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const InterviewerForm: React.FC<InterviewerFormProps> = ({
  language,
  onGenerate,
  isLoading,
}) => {
  const t = translations[language];

  const [interviewerTitle, setInterviewerTitle] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [companyType, setCompanyType] = useState('Teknoloji / SaaS Şirketi');
  const [candidateLevel, setCandidateLevel] = useState<CandidateLevel>('new_grad');
  const [interviewRound, setInterviewRound] = useState('İlk Aşama / HR & Hiring Manager');

  // Popular title suggestions for quick fill
  const popularTitles = [
    'Engineering Manager',
    'Senior HR Specialist',
    'Lead Product Manager',
    'Tech Lead',
    'Head of Data',
    'Software Team Lead',
  ];

  const handleApplyPreset = (preset: InterviewPreset) => {
    setInterviewerTitle(preset.interviewerTitle);
    setTargetRole(language === 'tr' ? preset.targetRole : preset.targetRoleEn);
    setCandidateLevel(preset.candidateLevel);
    setCompanyType(preset.companyType);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewerTitle.trim() || isLoading) return;
    onGenerate({
      interviewerTitle: interviewerTitle.trim(),
      targetRole: targetRole.trim(),
      companyType: companyType.trim(),
      candidateLevel,
      interviewRound,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs">
      <div className="max-w-3xl mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          {t.interviewHeroTitle}
        </h2>
        <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">
          {t.interviewHeroSubtitle}
        </p>
      </div>

      {/* Quick Presets for Students & New Grads */}
      <div className="mb-6 pt-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {t.quickPresetsTitle}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {interviewPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-xs group"
            >
              <span className="font-semibold text-slate-900 group-hover:text-indigo-600 block line-clamp-1">
                {language === 'tr' ? preset.title : preset.titleEn}
              </span>
              <span className="text-slate-500 line-clamp-1 mt-0.5 block">
                {language === 'tr' ? preset.targetRole : preset.targetRoleEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Main Input: Interviewer Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
            {t.interviewerTitleLabel} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={interviewerTitle}
              onChange={(e) => setInterviewerTitle(e.target.value)}
              placeholder={t.interviewerTitlePlaceholder}
              required
              className="w-full px-4 py-3 pl-10 text-sm md:text-base rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 font-medium placeholder:text-slate-400"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
          </div>

          {/* Quick title pills */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Hızlı Seçim:</span>
            {popularTitles.map((title) => (
              <button
                key={title}
                type="button"
                onClick={() => setInterviewerTitle(title)}
                className="hover:text-indigo-600 hover:underline transition-colors px-1 py-0.5"
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Column Grid: Target Role & Company Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              {t.targetRoleLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder={t.targetRolePlaceholder}
                className="w-full px-3.5 py-2.5 pl-9 text-sm rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 placeholder:text-slate-400"
              />
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              {t.companyTypeLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                placeholder={t.companyTypePlaceholder}
                className="w-full px-3.5 py-2.5 pl-9 text-sm rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 placeholder:text-slate-400"
              />
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Candidate Seniority & Interview Round */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              {t.candidateLevelLabel}
            </label>
            <div className="relative">
              <select
                value={candidateLevel}
                onChange={(e) => setCandidateLevel(e.target.value as CandidateLevel)}
                className="w-full px-3.5 py-2.5 pl-9 text-sm rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all bg-white text-slate-900"
              >
                <option value="university_student">{t.levelStudent}</option>
                <option value="new_grad">{t.levelNewGrad}</option>
                <option value="junior">{t.levelJunior}</option>
                <option value="intern">{t.levelIntern}</option>
              </select>
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              {t.interviewRoundLabel}
            </label>
            <select
              value={interviewRound}
              onChange={(e) => setInterviewRound(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all bg-white text-slate-900"
            >
              <option value="İlk Aşama / HR & Genel">{t.roundHr}</option>
              <option value="Teknik & Vaka Görüşmesi">{t.roundTechnical}</option>
              <option value="Son Aşama / Yönetici & Direktör">{t.roundDirector}</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading || !interviewerTitle.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.generatingQuestions}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.generateQuestionsBtn}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
