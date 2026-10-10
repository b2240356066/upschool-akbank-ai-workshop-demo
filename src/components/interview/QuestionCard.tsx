import React, { useState } from 'react';
import {
  HelpCircle,
  Lightbulb,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Sparkles,
  Award,
} from 'lucide-react';
import { InterviewQuestion, Language } from '../../types';
import { translations } from '../../locales/translations';

interface QuestionCardProps {
  question: InterviewQuestion;
  index: number;
  language: Language;
  onOpenPractice: (q: InterviewQuestion) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  language,
  onOpenPractice,
}) => {
  const t = translations[language];
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyQuestion = () => {
    navigator.clipboard.writeText(question.question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'technical':
        return 'text-blue-700 bg-blue-50 border-blue-100';
      case 'behavioral':
        return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'situational':
        return 'text-amber-700 bg-amber-50 border-amber-100';
      case 'motivation_culture':
        return 'text-purple-700 bg-purple-50 border-purple-100';
      case 'case_study':
        return 'text-indigo-700 bg-indigo-50 border-indigo-100';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all">
      {/* Question Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
          {/* Metadata without pills */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className={`px-2.5 py-0.5 rounded-sm border ${getCategoryColor(question.category)}`}>
              {question.categoryLabel || question.category}
            </span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-slate-500 font-mono tabular-nums">#{index + 1}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyQuestion}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              title={t.copyQuestionBtn}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">{t.copiedToast}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.copyQuestionBtn}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Toggle details"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* The Question Text */}
        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          "{question.question}"
        </h4>

        {/* Strategic Rationale */}
        {question.rationale && (
          <div className="mt-3 flex items-start gap-2 text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">{t.whyTheyAsk} </span>
              <span>{question.rationale}</span>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Details Section */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-5 bg-white">
          {/* STAR Model Answer Card */}
          {question.idealStarAnswer && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t.starModelAnswer}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm">
                {/* Situation */}
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5 text-xs uppercase tracking-wide text-indigo-950">
                    {t.starS}
                  </span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50/50 p-2.5 rounded-md border border-slate-100">
                    {question.idealStarAnswer.situation}
                  </p>
                </div>

                {/* Task */}
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5 text-xs uppercase tracking-wide text-indigo-950">
                    {t.starT}
                  </span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50/50 p-2.5 rounded-md border border-slate-100">
                    {question.idealStarAnswer.task}
                  </p>
                </div>

                {/* Action */}
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5 text-xs uppercase tracking-wide text-indigo-950">
                    {t.starA}
                  </span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50/50 p-2.5 rounded-md border border-slate-100">
                    {question.idealStarAnswer.action}
                  </p>
                </div>

                {/* Result */}
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5 text-xs uppercase tracking-wide text-indigo-950">
                    {t.starR}
                  </span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50/50 p-2.5 rounded-md border border-slate-100">
                    {question.idealStarAnswer.result}
                  </p>
                </div>

                {/* Key Takeaway */}
                {question.idealStarAnswer.keyTakeaway && (
                  <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-indigo-900 bg-indigo-50/60 p-3 rounded-lg border border-indigo-100">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{t.keyTakeaway} </span>
                      <span>{question.idealStarAnswer.keyTakeaway}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Student & New Grad Practical Tip */}
          {question.studentTip && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-amber-900 font-bold mb-1.5">
                <GraduationCap className="w-4 h-4 text-amber-700" />
                <span>{t.studentTipTitle}</span>
              </div>
              <p className="text-amber-950 leading-relaxed">
                {question.studentTip}
              </p>
            </div>
          )}

          {/* Evaluation Rubric preview */}
          {question.rubric && question.rubric.length > 0 && (
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700 block mb-1.5">
                Mülakat Değerlendirme Kriterleri:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {question.rubric.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                    <span className="text-slate-700 truncate">{r.criteria}</span>
                    <span className="font-mono text-slate-500 font-medium shrink-0 ml-2">{r.weight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Action: Practice Answer Simulator Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => onOpenPractice(question)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{t.tryYourAnswerBtn}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
