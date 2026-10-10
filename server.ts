import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', hasKey: Boolean(apiKey) });
});

// 1. Interview Simulator Endpoint
app.post('/api/interview-simulator', async (req, res) => {
  try {
    const {
      interviewerTitle,
      targetRole,
      companyType = 'Tech / Corporate',
      candidateLevel = 'university_student',
      interviewRound = 'İlk Görüşme / HR & Manager',
      language = 'tr',
    } = req.body;

    if (!interviewerTitle) {
      return res.status(400).json({ error: 'Interviewer title is required' });
    }

    const isTr = language === 'tr';

    const systemInstruction = `You are NexaCoach, an elite executive hiring consultant and interview coach specializing in helping university students, new graduates (yeni mezunlar), and junior job seekers ace high-stakes interviews.
Your job is to deeply deconstruct what an interviewer with the title "${interviewerTitle}" truly cares about, how they assess junior/new-grad talent, what traps they set, and how candidates can showcase potential even with limited commercial experience.

Produce a comprehensive, structured JSON response in the language specified (${isTr ? 'Turkish' : 'English'}).
The output MUST be valid JSON conforming strictly to this format:
{
  "interviewerPersona": {
    "title": string,
    "roleSummary": string (What this specific interviewer cares about most when interviewing students/new grads),
    "coreMindset": string (Their primary psychology, e.g. risk minimization, culture fit, fast learner potential, technical depth),
    "whatImpressesThem": string[] (3-4 specific behaviors/traits that win their vote),
    "redFlags": string[] (3-4 deal-breakers for this specific interviewer title),
    "evaluationMetrics": string[] (3-4 exact criteria they grade on, e.g. "Problem-solving process", "Curiosity & Grit", "Team communication")
  },
  "questions": [
    {
      "id": string (e.g. "q-1"),
      "category": "technical" | "behavioral" | "situational" | "motivation_culture" | "case_study",
      "categoryLabel": string (Clean display label, e.g. "Davranışsal Soru" / "Behavioral"),
      "question": string (Exact wording this interviewer would use),
      "rationale": string (Behind-the-scenes: Why does someone with this title ask this question?),
      "idealStarAnswer": {
        "situation": string (Context/project setting suitable for student/intern/graduate),
        "task": string (The objective/challenge),
        "action": string (Specific actions taken, tools used, decision making),
        "result": string (Measurable or qualitative positive outcome and lessons learned),
        "keyTakeaway": string (High-impact summary punchline for the candidate)
      },
      "studentTip": string (Special coaching advice for university students/new grads: how to leverage coursework, clubs, capstone projects, or internships if they don't have full-time years of experience),
      "rubric": [
        { "criteria": string, "weight": string }
      ]
    }
  ]
}
Generate at least 6-8 diverse, realistic, and penetrating questions spanning Behavioral, Technical, Situational, and Culture/Motivation categories.`;

    const prompt = `Candidate Background:
- Candidate Level: ${candidateLevel} (e.g., University Student / New Graduate / Junior Job Seeker)
- Interviewer Title: ${interviewerTitle}
- Target Role: ${targetRole || 'Not specified (infer most typical target role for this interviewer)'}
- Company Context: ${companyType}
- Interview Stage: ${interviewRound}
- Language: ${isTr ? 'Turkish (Türkçe)' : 'English'}

Provide an in-depth persona analysis and realistic interview questions with STAR answers and student-focused coaching advice.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error in /api/interview-simulator:', error);
    return res.status(500).json({
      error: 'Failed to simulate interview questions',
      message: error?.message || 'Internal Server Error',
    });
  }
});

// 2. Interactive Mock Answer Evaluation Endpoint
app.post('/api/interview-evaluate', async (req, res) => {
  try {
    const {
      question,
      interviewerTitle,
      targetRole,
      candidateAnswer,
      language = 'tr',
    } = req.body;

    if (!question || !candidateAnswer) {
      return res.status(400).json({ error: 'Question and candidateAnswer are required' });
    }

    const isTr = language === 'tr';

    const systemInstruction = `You are a strict yet encouraging senior interview coach reviewing a candidate's practice answer.
The candidate is a university student or new graduate interviewing with an interviewer holding the title "${interviewerTitle || 'Hiring Manager'}".

Analyze their answer and provide objective scores (out of 100) and actionable coaching feedback.
The response must be valid JSON matching this schema:
{
  "overallScore": number (1-100),
  "starBreakdown": {
    "situationScore": number (1-100),
    "taskScore": number (1-100),
    "actionScore": number (1-100),
    "resultScore": number (1-100)
  },
  "clarityScore": number (1-100),
  "relevanceScore": number (1-100),
  "strengths": string[] (2-3 concrete things they did well),
  "areasForImprovement": string[] (2-3 specific gaps or weak points to fix),
  "improvedAnswer": string (A polished, executive-ready STAR answer rewritten using the candidate's core story to maximize impact),
  "coachVerdict": string (2-3 sentences summarizing the interviewer's perspective)
}
Write all text in ${isTr ? 'Turkish' : 'English'}.`;

    const prompt = `Question: "${question}"
Interviewer Title: "${interviewerTitle || 'Interviewer'}"
Target Role: "${targetRole || 'Junior / Entry-Level Position'}"

Candidate's Answer:
"""
${candidateAnswer}
"""

Evaluate this answer now with constructive critique and a rewritten STAR model answer.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error in /api/interview-evaluate:', error);
    return res.status(500).json({
      error: 'Failed to evaluate answer',
      message: error?.message || 'Internal Server Error',
    });
  }
});

// 3. Career & Training Pathway Advisor Endpoint
app.post('/api/training-advisor', async (req, res) => {
  try {
    const {
      completedTrainings,
      targetRole,
      careerGoal,
      currentFieldOrMajor,
      language = 'tr',
    } = req.body;

    if (!completedTrainings || (Array.isArray(completedTrainings) && completedTrainings.length === 0)) {
      return res.status(400).json({ error: 'Completed trainings input is required' });
    }

    const isTr = language === 'tr';

    const systemInstruction = `You are NexaCoach's Chief Learning & Career Strategist.
Your goal is to inspect the university courses, bootcamps, online certifications, and self-taught trainings a candidate has completed.
Identify their current solid competencies, expose the critical gaps preventing them from getting hired in their target role ("${targetRole || 'Desired Career Path'}"), and design an optimal, step-by-step next educational syllabus and certification roadmap.

The output MUST be valid JSON adhering strictly to this schema:
{
  "competencyAudit": {
    "summary": string (Overview of their current standing, praising what they've built so far),
    "acquiredSkills": [
      {
        "name": string,
        "category": "Technical" | "Methodology" | "Soft Skill" | "Tools",
        "proficiency": "Beginner" | "Intermediate" | "Advanced",
        "evidence": string (Which completed course or project this skill stems from)
      }
    ],
    "skillGaps": [
      {
        "skill": string,
        "severity": "Critical" | "High" | "Medium",
        "whyNeeded": string (Why hiring managers require this for the target role),
        "gapType": "Practical Application" | "Missing Tool" | "Architecture/Concept" | "Industry Standard"
      }
    ]
  },
  "recommendedNextTraining": {
    "courseTitle": string (Compelling, precise title of the exact training they should take next),
    "targetObjective": string (What they will be capable of building after this course),
    "estimatedDuration": string (e.g. "4-6 Hafta / Weeks (Haftada 8-10 saat)"),
    "difficultyLevel": "Orta Seviye (Intermediate)" | "İleri Seviye (Advanced)" | "Köprü Eğitimi (Bridge)",
    "syllabusModules": [
      {
        "moduleNumber": number,
        "title": string,
        "duration": string,
        "coreTopics": string[],
        "handsOnPractice": string (Concrete mini-project or code lab for this module)
      }
    ],
    "capstoneProject": {
      "title": string,
      "description": string,
      "techStackOrTools": string[],
      "portfolioPitch": string (How to talk about this project in an interview to prove seniority)
    },
    "recommendedCertifications": [
      {
        "name": string,
        "issuer": string (e.g. AWS, Google Cloud, Meta, Scrum.org, Microsoft),
        "relevance": string,
        "prepEffort": string
      }
    ],
    "curatedPlatforms": [
      {
        "platformName": string (e.g. Coursera, BTK Akademi, Udemy, freeCodeCamp, edX, Patika.dev),
        "suggestedCourseKeywords": string[],
        "isFreeOrPaid": string
      }
    ]
  }
}
Generate comprehensive, realistic, and highly practical data in ${isTr ? 'Turkish' : 'English'}.`;

    const prompt = `Student / Candidate Background:
- Current Field/University Major: ${currentFieldOrMajor || 'Student / Recent Graduate'}
- Completed Trainings / Course Content Provided:
"""
${typeof completedTrainings === 'string' ? completedTrainings : JSON.stringify(completedTrainings, null, 2)}
"""
- Target Desired Role: ${targetRole || 'Not specified'}
- Long-term Career Goal: ${careerGoal || 'Land first high-impact job and grow sustainably'}
- Language: ${isTr ? 'Turkish' : 'English'}

Perform a rigorous competency audit and output the precise next-step training syllabus and portfolio project blueprint.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error in /api/training-advisor:', error);
    return res.status(500).json({
      error: 'Failed to analyze training pathway',
      message: error?.message || 'Internal Server Error',
    });
  }
});

// 4. Audio Transcription Endpoint (Gemini 3.5 Transcribe)
app.post('/api/transcribe-audio', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', language = 'tr' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    const isTr = language === 'tr';
    const audioPart = {
      inlineData: {
        mimeType: mimeType,
        data: audioBase64,
      },
    };

    const promptText = isTr
      ? 'Bu Türkçe mülakat cevabı ses kaydını tam ve harfi harfine metne dönüştür. Başka hiçbir açıklama yapma, sadece adayın söylediği konuşma metnini döndür.'
      : 'Transcribe this interview answer audio verbatim. Return only the spoken text with no additional introductory or concluding remarks.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: { parts: [audioPart, { text: promptText }] },
    });

    const transcribedText = response.text?.trim() || '';
    return res.json({ text: transcribedText });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error in /api/transcribe-audio:', error);
    return res.status(500).json({
      error: 'Failed to transcribe audio',
      message: error?.message || 'Internal Server Error',
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NexaCoach server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
