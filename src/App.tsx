import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { InterviewerForm } from './components/interview/InterviewerForm';
import { InterviewerPersonaCard } from './components/interview/InterviewerPersonaCard';
import { QuestionCard } from './components/interview/QuestionCard';
import { MockPracticeDrawer } from './components/interview/MockPracticeDrawer';
import { TrainingInputForm } from './components/career/TrainingInputForm';
import { SkillGapMatrix } from './components/career/SkillGapMatrix';
import { NextTrainingSyllabus } from './components/career/NextTrainingSyllabus';
import { HowItWorksModal } from './components/shared/HowItWorksModal';
import { ExportModal } from './components/shared/ExportModal';
import {
  Language,
  CandidateLevel,
  InterviewSimulatorResponse,
  TrainingAdvisorResponse,
  InterviewQuestion,
} from './types';
import { translations } from './locales/translations';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('nexacoach_lang') as Language) || 'tr';
  });

  const [activeTab, setActiveTab] = useState<'interview' | 'training'>(() => {
    return (localStorage.getItem('nexacoach_tab') as 'interview' | 'training') || 'interview';
  });

  const t = translations[language];

  // Interview state
  const [interviewData, setInterviewData] = useState<InterviewSimulatorResponse | null>(() => {
    const saved = localStorage.getItem('nexacoach_interview_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeInterviewerTitle, setActiveInterviewerTitle] = useState(() => {
    return localStorage.getItem('nexacoach_interview_title') || '';
  });
  const [activeTargetRole, setActiveTargetRole] = useState(() => {
    return localStorage.getItem('nexacoach_target_role') || '';
  });
  const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedQuestionForPractice, setSelectedQuestionForPractice] = useState<InterviewQuestion | null>(null);

  // Training state
  const [trainingData, setTrainingData] = useState<TrainingAdvisorResponse | null>(() => {
    const saved = localStorage.getItem('nexacoach_training_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAnalyzingTraining, setIsAnalyzingTraining] = useState(false);

  // Modals & UI alerts
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Persist language & tab
  useEffect(() => {
    localStorage.setItem('nexacoach_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('nexacoach_tab', activeTab);
  }, [activeTab]);

  // Persist generated interview & training data
  useEffect(() => {
    if (interviewData) {
      localStorage.setItem('nexacoach_interview_data', JSON.stringify(interviewData));
    }
  }, [interviewData]);

  useEffect(() => {
    if (trainingData) {
      localStorage.setItem('nexacoach_training_data', JSON.stringify(trainingData));
    }
  }, [trainingData]);

  // Handle Interview Generation
  const handleGenerateInterview = async (data: {
    interviewerTitle: string;
    targetRole: string;
    companyType: string;
    candidateLevel: CandidateLevel;
    interviewRound: string;
  }) => {
    setIsGeneratingInterview(true);
    setErrorBanner(null);
    setActiveInterviewerTitle(data.interviewerTitle);
    setActiveTargetRole(data.targetRole);
    localStorage.setItem('nexacoach_interview_title', data.interviewerTitle);
    localStorage.setItem('nexacoach_target_role', data.targetRole);

    try {
      const response = await fetch('/api/interview-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          language,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || 'Mülakat simülasyonu üretilemedi.');
      }

      const result = await response.json();
      setInterviewData(result);
      setCategoryFilter('all');
    } catch (err: unknown) {
      const error = err as Error;
      setErrorBanner(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGeneratingInterview(false);
    }
  };

  // Handle Training Analysis
  const handleAnalyzeTraining = async (data: {
    completedTrainings: string;
    targetRole: string;
    careerGoal: string;
    currentFieldOrMajor: string;
  }) => {
    setIsAnalyzingTraining(true);
    setErrorBanner(null);

    try {
      const response = await fetch('/api/training-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          language,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || 'Eğitim analizi yapılamadı.');
      }

      const result = await response.json();
      setTrainingData(result);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorBanner(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsAnalyzingTraining(false);
    }
  };

  // Reset all state
  const handleReset = () => {
    if (window.confirm(language === 'tr' ? 'Tüm veriler sıfırlansın mı?' : 'Reset all generated data?')) {
      setInterviewData(null);
      setTrainingData(null);
      setActiveInterviewerTitle('');
      setActiveTargetRole('');
      setErrorBanner(null);
      localStorage.removeItem('nexacoach_interview_data');
      localStorage.removeItem('nexacoach_training_data');
      localStorage.removeItem('nexacoach_interview_title');
      localStorage.removeItem('nexacoach_target_role');
    }
  };

  // Filter questions
  const filteredQuestions = interviewData?.questions?.filter((q) => {
    if (categoryFilter === 'all') return true;
    return q.category === categoryFilter;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Bar (3-zone contract compliant) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onReset={handleReset}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error notification banner */}
        {errorBanner && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Hata Oluştu:</span>
              <span>{errorBanner}</span>
            </div>
            <button
              onClick={() => setErrorBanner(null)}
              className="text-rose-500 hover:text-rose-800 text-xs font-semibold"
            >
              Kapat
            </button>
          </div>
        )}

        {/* WORKSPACE TAB 1: Interview Simulator */}
        {activeTab === 'interview' && (
          <div className="space-y-8">
            {/* Input Form Card */}
            <InterviewerForm
              language={language}
              onGenerate={handleGenerateInterview}
              isLoading={isGeneratingInterview}
            />

            {/* Generated Results View */}
            {interviewData && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Action Bar: Export & Stats */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {interviewData.interviewerPersona.title} için {interviewData.questions.length} Soru Hazırlandı
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsExportModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.exportReportBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Interviewer Persona Card */}
                <InterviewerPersonaCard
                  persona={interviewData.interviewerPersona}
                  language={language}
                />

                {/* Filterable Question List Section */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {t.questionsFoundTitle}
                    </h3>

                    {/* Segmented Category Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setCategoryFilter('all')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                          categoryFilter === 'all'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t.filterAll}
                      </button>

                      <button
                        type="button"
                        onClick={() => setCategoryFilter('behavioral')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                          categoryFilter === 'behavioral'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t.filterBehavioral}
                      </button>

                      <button
                        type="button"
                        onClick={() => setCategoryFilter('technical')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                          categoryFilter === 'technical'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t.filterTechnical}
                      </button>

                      <button
                        type="button"
                        onClick={() => setCategoryFilter('situational')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                          categoryFilter === 'situational'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t.filterSituational}
                      </button>

                      <button
                        type="button"
                        onClick={() => setCategoryFilter('motivation_culture')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                          categoryFilter === 'motivation_culture'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t.filterCulture}
                      </button>
                    </div>
                  </div>

                  {/* Question Cards List */}
                  <div className="space-y-4">
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((q, idx) => (
                        <QuestionCard
                          key={q.id || idx}
                          question={q}
                          index={idx}
                          language={language}
                          onOpenPractice={(question) => setSelectedQuestionForPractice(question)}
                        />
                      ))
                    ) : (
                      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
                        Bu filtre için soru bulunamadı.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WORKSPACE TAB 2: Career & Training Advisor */}
        {activeTab === 'training' && (
          <div className="space-y-8">
            {/* Input Form Card */}
            <TrainingInputForm
              language={language}
              onAnalyze={handleAnalyzeTraining}
              isLoading={isAnalyzingTraining}
            />

            {/* Generated Training Pathway Results */}
            {trainingData && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Action Bar: Export */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Yetkinlik Dökümü ve Önerilen Müfredat Hazırlandı</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsExportModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.exportReportBtn}</span>
                    </button>
                  </div>
                </div>

                {/* 1. Skill Gap & Competency Matrix */}
                <SkillGapMatrix
                  audit={trainingData.competencyAudit}
                  language={language}
                />

                {/* 2. Recommended Next Step Course & Syllabus */}
                <NextTrainingSyllabus
                  training={trainingData.recommendedNextTraining}
                  language={language}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Interactive Mock Practice Modal */}
      {selectedQuestionForPractice && (
        <MockPracticeDrawer
          question={selectedQuestionForPractice}
          interviewerTitle={activeInterviewerTitle || 'Interviewer'}
          targetRole={activeTargetRole || 'Candidate'}
          language={language}
          onClose={() => setSelectedQuestionForPractice(null)}
        />
      )}

      {/* How It Works Modal */}
      {isHowItWorksOpen && (
        <HowItWorksModal
          language={language}
          onClose={() => setIsHowItWorksOpen(false)}
        />
      )}

      {/* Export / Copy Modal */}
      {isExportModalOpen && (
        <ExportModal
          interviewData={interviewData}
          trainingData={trainingData}
          activeTab={activeTab}
          language={language}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">NexaCoach</span> · Üniversite Öğrencileri, Yeni Mezunlar ve İş Arayanlar İçin Kariyer Zekası
          </div>
          <div>
            Powered by Google Gemini 3.8
          </div>
        </div>
      </footer>
    </div>
  );
}
