import React from 'react';
import { X, CheckCircle, HelpCircle, Target, BookOpen, Sparkles } from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../locales/translations';

interface HowItWorksModalProps {
  language: Language;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  language,
  onClose,
}) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {t.navAbout}
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
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          <div>
            <h4 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              1. Mülakatçı Unvanının Psikolojisi (Persona Deconstruction)
            </h4>
            <p>
              Bir adayı mülakat eden İşe Alım Uzmanı (HR) ile bir Yazılım Mühendisliği Müdürü (Engineering Manager) veya Ürün Lideri (Lead PM) bambaşka kriterlere bakar. İK kültürel uyuma ve öğrenme hızına odaklanırken, mühendislik lideri problem çözme metodolojisine ve hata anında nasıl davrandığına odaklanır. NexaCoach, girilen unvanın zihin haritasını çıkararak onun sorabileceği soruları önceden simüle eder.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              2. STAR Metodolojisi & Yeni Mezun Avantajı
            </h4>
            <p>
              Ticari iş tecrübenizin olmaması bir engel değildir. NexaCoach; bitirme projelerinizi, öğrenci kulübü liderliklerinizi, stajlarınızı ve açık kaynak katkılarınızı <strong>STAR (Situation, Task, Action, Result)</strong> formatında yapılandırarak karar vericilere profesyonel bir hikaye anlatmanızı sağlar.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              3. Eğitim Boşluk Analizi & Bir Sonraki Adım
            </h4>
            <p>
              Rastgele kurslar almak yerine, tamamladığınız eğitimleri sisteme girin. Yapay zeka, hedeflediğiniz pozisyon için sektörde talep edilen yetkinliklerle geçmişinizi karşılaştırır, kritik boşlukları (skill gaps) tespit eder ve doğrudan sizi işe kabul ettirecek bir sonraki müfredatı, mini projeleri ve sertifikaları listeler.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
