import React, { useState } from 'react';
import { Compass, Loader2, Sparkles, BookOpen, Target, GraduationCap } from 'lucide-react';
import { Language, TrainingPreset } from '../../types';
import { translations } from '../../locales/translations';
import { trainingPresets } from '../../data/presets';

interface TrainingInputFormProps {
  language: Language;
  onAnalyze: (data: {
    completedTrainings: string;
    targetRole: string;
    careerGoal: string;
    currentFieldOrMajor: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const TrainingInputForm: React.FC<TrainingInputFormProps> = ({
  language,
  onAnalyze,
  isLoading,
}) => {
  const t = translations[language];

  const [completedTrainings, setCompletedTrainings] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [currentFieldOrMajor, setCurrentFieldOrMajor] = useState('');
  const [careerGoal, setCareerGoal] = useState('');

  const handleApplyPreset = (preset: TrainingPreset) => {
    setCompletedTrainings(language === 'tr' ? preset.content : preset.contentEn);
    setTargetRole(language === 'tr' ? preset.targetRole : preset.targetRoleEn);
    setCurrentFieldOrMajor(preset.major);
    setCareerGoal(
      language === 'tr'
        ? `${preset.targetRole} pozisyonunda ilk işime kabul edilmek ve ilk 6 ayda bağımsız görevler üstlenebilmek.`
        : `Secure my first role as ${preset.targetRoleEn} and deliver production-grade work within my first 6 months.`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completedTrainings.trim() || isLoading) return;
    onAnalyze({
      completedTrainings: completedTrainings.trim(),
      targetRole: targetRole.trim(),
      careerGoal: careerGoal.trim(),
      currentFieldOrMajor: currentFieldOrMajor.trim(),
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs">
      <div className="max-w-3xl mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          {t.trainingHeroTitle}
        </h2>
        <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">
          {t.trainingHeroSubtitle}
        </p>
      </div>

      {/* Quick Presets for University Students & Graduates */}
      <div className="mb-6 pt-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {t.trainingPresetsTitle}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {trainingPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-xs group"
            >
              <span className="font-semibold text-slate-900 group-hover:text-indigo-600 block line-clamp-1">
                {language === 'tr' ? preset.label : preset.labelEn}
              </span>
              <span className="text-slate-500 line-clamp-1 mt-0.5 block">
                {language === 'tr' ? preset.targetRole : preset.targetRoleEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Core Input: Completed Coursework & Content */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
            {t.trainingInputLabel} <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={7}
            value={completedTrainings}
            onChange={(e) => setCompletedTrainings(e.target.value)}
            placeholder={t.trainingInputPlaceholder}
            required
            className="w-full p-4 text-xs md:text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 placeholder:text-slate-400 leading-relaxed font-normal"
          />
          <span className="text-xs text-slate-400 mt-1 block">
            İpucu: Kurs adları, tamamladığın haftalık konular, üniversite projeleri veya aldığın sertifikaları dilediğin gibi listeleyebilirsin.
          </span>
        </div>

        {/* 3-Column Context Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              {t.targetCareerLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder={t.targetCareerPlaceholder}
                className="w-full px-3.5 py-2.5 pl-9 text-xs md:text-sm rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 placeholder:text-slate-400"
              />
              <Target className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              {t.majorLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={currentFieldOrMajor}
                onChange={(e) => setCurrentFieldOrMajor(e.target.value)}
                placeholder={t.majorPlaceholder}
                className="w-full px-3.5 py-2.5 pl-9 text-xs md:text-sm rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 placeholder:text-slate-400"
              />
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              {t.careerGoalLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder={t.careerGoalPlaceholder}
                className="w-full px-3.5 py-2.5 pl-9 text-xs md:text-sm rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 placeholder:text-slate-400"
              />
              <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isLoading || !completedTrainings.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.analyzingTraining}</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4" />
                <span>{t.analyzeTrainingBtn}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
