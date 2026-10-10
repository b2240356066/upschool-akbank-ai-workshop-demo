import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Mic,
  MicOff,
  Square,
} from 'lucide-react';
import { InterviewQuestion, AnswerEvaluation, Language } from '../../types';
import { translations } from '../../locales/translations';

interface MockPracticeDrawerProps {
  question: InterviewQuestion | null;
  interviewerTitle: string;
  targetRole: string;
  language: Language;
  onClose: () => void;
}

// Global declaration for Web Speech API
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export const MockPracticeDrawer: React.FC<MockPracticeDrawerProps> = ({
  question,
  interviewerTitle,
  targetRole,
  language,
  onClose,
}) => {
  const t = translations[language];
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  if (!question) return null;

  const wordCount = candidateAnswer.trim() ? candidateAnswer.trim().split(/\s+/).length : 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
    };
  }, []);

  const stopRecordingCleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  // Start Voice-to-Text Recording
  const handleStartRecording = async () => {
    setErrorMsg('');
    setVoiceNotice(null);
    audioChunksRef.current = [];

    const customWindow = window as unknown as IWindow;
    const SpeechRecognitionClass =
      customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition;

    try {
      // 1. Request microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. Setup MediaRecorder as robust fallback / capture
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250);

      // 3. Start Timer
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      setIsRecording(true);

      // 4. If Web Speech API is supported, use it for real-time dictation
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;

        recognition.lang = language === 'tr' ? 'tr-TR' : 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;

        let baseText = candidateAnswer;
        if (baseText && !baseText.endsWith(' ') && !baseText.endsWith('\n')) {
          baseText += ' ';
        }

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          setCandidateAnswer((prev) => {
            // Append recognized text smoothly
            const cleanFinal = finalTranscript.trim();
            const cleanInterim = interimTranscript.trim();
            const textToAdd = [cleanFinal, cleanInterim].filter(Boolean).join(' ');

            if (!textToAdd) return prev;
            return (baseText + textToAdd).trim();
          });
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          if (event.error === 'not-allowed') {
            setErrorMsg(t.voiceErrorPermission);
            stopRecordingCleanup();
          }
        };

        recognition.start();
      } else {
        setVoiceNotice(
          language === 'tr'
            ? 'Tarayıcınızda canlı dikte yerine ses kaydı alınıyor; kaydı durdurduğunuzda yapay zeka metne dökecektir.'
            : 'Live speech recognition not directly supported; recording audio for AI transcription upon stop.'
        );
      }
    } catch (err: unknown) {
      console.error('Microphone error:', err);
      setErrorMsg(t.voiceErrorPermission);
      stopRecordingCleanup();
    }
  };

  // Stop Voice Recording
  const handleStopRecording = async () => {
    if (!isRecording) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    setIsRecording(false);

    // If candidate answer is still empty or very short, let's transcribe the recorded audio chunks via Gemini
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = async () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        // If Web Speech API already populated the answer, we don't need second transcription
        if (candidateAnswer.trim().length > 15) {
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorderRef.current?.mimeType || 'audio/webm',
        });

        if (audioBlob.size > 2000) {
          setIsTranscribing(true);
          try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              const base64Data = (reader.result as string).split(',')[1];
              const response = await fetch('/api/transcribe-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  audioBase64: base64Data,
                  mimeType: audioBlob.type || 'audio/webm',
                  language,
                }),
              });

              if (response.ok) {
                const resData = await response.json();
                if (resData.text) {
                  setCandidateAnswer((prev) => {
                    const separator = prev ? '\n' : '';
                    return prev + separator + resData.text;
                  });
                }
              }
              setIsTranscribing(false);
            };
          } catch (e) {
            console.error('Audio transcription error:', e);
            setIsTranscribing(false);
          }
        }
      };

      mediaRecorderRef.current.stop();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEvaluate = async () => {
    if (!candidateAnswer.trim() || isEvaluating) return;

    if (isRecording) {
      handleStopRecording();
    }

    setIsEvaluating(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/interview-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          interviewerTitle,
          targetRole,
          candidateAnswer: candidateAnswer.trim(),
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Değerlendirme servisinde bir hata oluştu.');
      }

      const data = await response.json();
      setEvaluation(data);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.mockModalTitle}</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-slate-600 font-normal">{interviewerTitle}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 line-clamp-1">
              "{question.question}"
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Subtitle instructions */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.mockModalSubtitle}
          </p>

          {/* Typing & Microphone Area */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                {t.yourAnswerLabel}
              </label>

              {/* Voice-to-Text Button Controls */}
              <div className="flex items-center gap-2">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    disabled={isEvaluating || isTranscribing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all cursor-pointer shadow-2xs"
                  >
                    <Mic className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t.voiceInputBtn}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-all cursor-pointer animate-pulse"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>{t.voiceStopBtn}</span>
                  </button>
                )}

                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  {wordCount} kelime
                </span>
              </div>
            </div>

            {/* Active Voice Recording Status Bar */}
            {isRecording && (
              <div className="mb-2.5 p-3 rounded-xl bg-rose-50/80 border border-rose-200 flex items-center justify-between text-xs text-rose-900 animate-in fade-in duration-150">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <span className="font-semibold">{t.voiceListening}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-rose-700 tabular-nums">
                    {formatTimer(recordingSeconds)}
                  </span>
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 underline"
                  >
                    {t.voiceStopBtn}
                  </button>
                </div>
              </div>
            )}

            {isTranscribing && (
              <div className="mb-2.5 p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center gap-2 text-xs text-indigo-900">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>{t.voiceTranscribing}</span>
              </div>
            )}

            {voiceNotice && (
              <div className="mb-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
                {voiceNotice}
              </div>
            )}

            <textarea
              rows={6}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder={t.yourAnswerPlaceholder}
              className={`w-full p-4 text-sm rounded-xl border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 placeholder:text-slate-400 font-normal leading-relaxed ${
                isRecording ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                if (isRecording) stopRecordingCleanup();
                setCandidateAnswer('');
                setEvaluation(null);
              }}
              disabled={isEvaluating}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetAnswerBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleEvaluate}
              disabled={isEvaluating || !candidateAnswer.trim() || candidateAnswer.trim().length < 15}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.evaluatingAnswer}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.evaluateAnswerBtn}</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100">
              {errorMsg}
            </div>
          )}

          {/* Evaluation Results Card */}
          {evaluation && (
            <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 p-6 space-y-6">
              {/* Score Hero */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    {t.scoreTitle}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                      {evaluation.overallScore}
                    </span>
                    <span className="text-sm text-slate-400 font-medium">/ 100</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50">
                    <span className="text-xs text-slate-500 block">{t.starClarityScore}</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      %{evaluation.clarityScore}
                    </span>
                  </div>
                  <div className="text-center px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50">
                    <span className="text-xs text-slate-500 block">{t.starRelevanceScore}</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      %{evaluation.relevanceScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* STAR Dimensions Breakdown */}
              {evaluation.starBreakdown && (
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5">
                    {t.starDimensionsTitle}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                      <span className="text-xs text-slate-500 block">Situation</span>
                      <span className="text-base font-bold text-slate-900 tabular-nums">
                        {evaluation.starBreakdown.situationScore}/100
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                      <span className="text-xs text-slate-500 block">Task</span>
                      <span className="text-base font-bold text-slate-900 tabular-nums">
                        {evaluation.starBreakdown.taskScore}/100
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                      <span className="text-xs text-slate-500 block">Action</span>
                      <span className="text-base font-bold text-slate-900 tabular-nums">
                        {evaluation.starBreakdown.actionScore}/100
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                      <span className="text-xs text-slate-500 block">Result</span>
                      <span className="text-base font-bold text-slate-900 tabular-nums">
                        {evaluation.starBreakdown.resultScore}/100
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t.strengthsTitle}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {evaluation.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-rose-100">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider mb-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>{t.improvementsTitle}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {evaluation.areasForImprovement.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Polished Rewrite */}
              {evaluation.improvedAnswer && (
                <div className="bg-indigo-50/60 p-5 rounded-xl border border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>{t.improvedAnswerTitle}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed font-normal whitespace-pre-line bg-white/70 p-3.5 rounded-lg border border-indigo-100/60">
                    {evaluation.improvedAnswer}
                  </p>
                </div>
              )}

              {/* Coach Verdict */}
              {evaluation.coachVerdict && (
                <div className="bg-slate-900 text-white p-4 rounded-xl text-xs sm:text-sm">
                  <span className="font-bold text-indigo-300 block mb-1">
                    {t.coachVerdictTitle}
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {evaluation.coachVerdict}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
