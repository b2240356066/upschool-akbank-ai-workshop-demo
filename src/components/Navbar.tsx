import React from 'react';
import { Sparkles, Compass, HelpCircle, Globe, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

interface NavbarProps {
  activeTab: 'interview' | 'training';
  setActiveTab: (tab: 'interview' | 'training') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenHowItWorks: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenHowItWorks,
  onReset,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('interview')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-xs">
                N
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                  {t.brandName}
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:block leading-none">
                  {t.brandTagline}
                </span>
              </div>
            </button>
            <span className="hidden xl:inline-flex text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-2.5 py-1 ml-2">
              {t.targetAudienceBadge}
            </span>
          </div>

          {/* Zone 2: Navigation Links & Workspace Switcher */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('interview')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'interview'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.navInterview}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('training')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'training'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t.navTraining}</span>
            </button>

            <button
              type="button"
              onClick={onOpenHowItWorks}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>{t.navAbout}</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Utility Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage('tr')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'tr'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                TR
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={onReset}
              title={t.clearAllBtn}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
