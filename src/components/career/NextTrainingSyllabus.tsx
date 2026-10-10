import React from 'react';
import {
  Compass,
  Clock,
  Award,
  BookOpen,
  Code2,
  FolderGit2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { RecommendedNextTraining, Language } from '../../types';
import { translations } from '../../locales/translations';

interface NextTrainingSyllabusProps {
  training: RecommendedNextTraining;
  language: Language;
}

export const NextTrainingSyllabus: React.FC<NextTrainingSyllabusProps> = ({
  training,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-8">
      {/* Hero Recommendation Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          <span>{t.recommendedNextStepTitle}</span>
        </div>

        <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
          {training.courseTitle}
        </h3>

        <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed max-w-4xl">
          {training.targetObjective}
        </p>

        {/* Meta Stats Row */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs sm:text-sm">
          {training.estimatedDuration && (
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-900">{t.courseDuration}</span>
              <span className="font-mono tabular-nums">{training.estimatedDuration}</span>
            </div>
          )}

          {training.difficultyLevel && (
            <div className="flex items-center gap-2 text-slate-700">
              <Award className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold text-slate-900">{t.courseLevel}</span>
              <span>{training.difficultyLevel}</span>
            </div>
          )}
        </div>
      </div>

      {/* Module-by-Module Curriculum Syllabus */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>{t.syllabusTitle}</span>
          </div>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            {training.syllabusModules?.length || 0} Modül
          </span>
        </div>

        <div className="space-y-4">
          {training.syllabusModules && training.syllabusModules.map((mod, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 font-mono bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-sm">
                    Modül #{mod.moduleNumber || idx + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {mod.title}
                  </h4>
                </div>
                {mod.duration && (
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {mod.duration}
                  </span>
                )}
              </div>

              {/* Core topics */}
              {mod.coreTopics && mod.coreTopics.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-semibold text-slate-600 block mb-1.5">
                    Öğrenilecek Başlıklar:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {mod.coreTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hands-on practice */}
              {mod.handsOnPractice && (
                <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-start gap-2 text-xs sm:text-sm text-slate-800 bg-white/70 p-3 rounded-lg border border-slate-100">
                  <Code2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-900">{t.handsOnLab} </span>
                    <span>{mod.handsOnPractice}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hero Capstone Project Blueprint */}
      {training.capstoneProject && (
        <div className="bg-slate-900 text-white rounded-xl p-6 md:p-8 shadow-md">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <FolderGit2 className="w-4 h-4" />
            <span>{t.capstoneTitle}</span>
          </div>

          <h4 className="text-xl font-bold text-white tracking-tight">
            {training.capstoneProject.title}
          </h4>

          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            {training.capstoneProject.description}
          </p>

          {/* Tech Stack */}
          {training.capstoneProject.techStackOrTools && training.capstoneProject.techStackOrTools.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                {t.techStack}
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {training.capstoneProject.techStackOrTools.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-indigo-200 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interview Pitch */}
          {training.capstoneProject.portfolioPitch && (
            <div className="mt-5 p-4 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-xs sm:text-sm text-indigo-200">
              <div className="flex items-center gap-2 text-indigo-300 font-bold mb-1">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>{t.pitchTitle}</span>
              </div>
              <p className="leading-relaxed">
                "{training.capstoneProject.portfolioPitch}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Certifications & Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Certifications */}
        {training.recommendedCertifications && training.recommendedCertifications.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base mb-4">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>{t.certificationsTitle}</span>
            </div>

            <div className="space-y-3">
              {training.recommendedCertifications.map((cert, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900">{cert.name}</span>
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-100 shrink-0">
                      {cert.issuer}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{cert.relevance}</p>
                  {cert.prepEffort && (
                    <span className="mt-2 block text-[11px] text-slate-400 font-mono">
                      Hazırlık Eforu: {cert.prepEffort}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Curated Platforms */}
        {training.curatedPlatforms && training.curatedPlatforms.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base mb-4">
              <ExternalLink className="w-4 h-4 text-indigo-600" />
              <span>{t.platformsTitle}</span>
            </div>

            <div className="space-y-3">
              {training.curatedPlatforms.map((plat, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900">{plat.platformName}</span>
                    <span className="text-xs font-medium text-slate-500">{plat.isFreeOrPaid}</span>
                  </div>
                  {plat.suggestedCourseKeywords && plat.suggestedCourseKeywords.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {plat.suggestedCourseKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 bg-white border border-slate-200 rounded-sm text-slate-600"
                        >
                          "{kw}"
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
