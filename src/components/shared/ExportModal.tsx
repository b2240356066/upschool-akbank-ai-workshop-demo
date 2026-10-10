import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileText } from 'lucide-react';
import { InterviewSimulatorResponse, TrainingAdvisorResponse, Language } from '../../types';
import { translations } from '../../locales/translations';

interface ExportModalProps {
  interviewData: InterviewSimulatorResponse | null;
  trainingData: TrainingAdvisorResponse | null;
  activeTab: 'interview' | 'training';
  language: Language;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  interviewData,
  trainingData,
  activeTab,
  language,
  onClose,
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);

  // Generate markdown content
  const generateMarkdown = (): string => {
    if (activeTab === 'interview' && interviewData) {
      let md = `# NexaCoach Mülakat Simülasyon Raporu\n\n`;
      md += `## Mülakatçı Profili: ${interviewData.interviewerPersona.title}\n`;
      md += `${interviewData.interviewerPersona.roleSummary}\n\n`;
      md += `### Temel Yaklaşım / Mindset:\n${interviewData.interviewerPersona.coreMindset}\n\n`;
      md += `### Bu Unvanı Etkileyen Şeyler:\n`;
      interviewData.interviewerPersona.whatImpressesThem.forEach((item) => {
        md += `- ${item}\n`;
      });
      md += `\n### Kırmızı Çizgiler (Red Flags):\n`;
      interviewData.interviewerPersona.redFlags.forEach((item) => {
        md += `- ${item}\n`;
      });
      md += `\n---\n\n## Potansiyel Sorular & STAR Yanıtları\n\n`;
      interviewData.questions.forEach((q, idx) => {
        md += `### Soru ${idx + 1}: ${q.question} (${q.categoryLabel || q.category})\n`;
        md += `**Neden Soruluyor:** ${q.rationale}\n\n`;
        md += `**Öğrenci & Yeni Mezun İpucu:** ${q.studentTip}\n\n`;
        md += `**İdeal STAR Modeli:**\n`;
        md += `- **Situation:** ${q.idealStarAnswer.situation}\n`;
        md += `- **Task:** ${q.idealStarAnswer.task}\n`;
        md += `- **Action:** ${q.idealStarAnswer.action}\n`;
        md += `- **Result:** ${q.idealStarAnswer.result}\n`;
        md += `- **Key Takeaway:** ${q.idealStarAnswer.keyTakeaway}\n\n`;
      });
      return md;
    }

    if (activeTab === 'training' && trainingData) {
      let md = `# NexaCoach Kariyer & Eğitim Yol Haritası Raporu\n\n`;
      md += `## Mevcut Yetkinlik Özeti:\n${trainingData.competencyAudit.summary}\n\n`;
      md += `### Tespit Edilen Kritik Beceriler (Skill Gaps):\n`;
      trainingData.competencyAudit.skillGaps.forEach((g) => {
        md += `- **${g.skill}** (${g.severity}): ${g.whyNeeded}\n`;
      });
      md += `\n---\n\n## Önerilen Sonraki Eğitim: ${trainingData.recommendedNextTraining.courseTitle}\n`;
      md += `**Hedef:** ${trainingData.recommendedNextTraining.targetObjective}\n`;
      md += `**Süre:** ${trainingData.recommendedNextTraining.estimatedDuration} | **Seviye:** ${trainingData.recommendedNextTraining.difficultyLevel}\n\n`;
      md += `### Müfredat:\n`;
      trainingData.recommendedNextTraining.syllabusModules.forEach((m) => {
        md += `#### Modül ${m.moduleNumber}: ${m.title} (${m.duration})\n`;
        md += `Konular: ${m.coreTopics.join(', ')}\n`;
        md += `Uygulama: ${m.handsOnPractice}\n\n`;
      });
      if (trainingData.recommendedNextTraining.capstoneProject) {
        md += `### Bitirme Projesi (Capstone): ${trainingData.recommendedNextTraining.capstoneProject.title}\n`;
        md += `${trainingData.recommendedNextTraining.capstoneProject.description}\n`;
        md += `Teknolojiler: ${trainingData.recommendedNextTraining.capstoneProject.techStackOrTools.join(', ')}\n\n`;
      }
      return md;
    }

    return 'Veri bulunamadı.';
  };

  const markdownText = generateMarkdown();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {t.exportModalTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <textarea
            readOnly
            value={markdownText}
            rows={14}
            className="w-full p-4 font-mono text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-800 outline-hidden select-all"
          />
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printBtn}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.copiedToast}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.copyMarkdownBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
