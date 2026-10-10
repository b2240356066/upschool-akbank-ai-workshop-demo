# NexaCoach: Interview & Career Coach Agent

An intelligent, dual-engine career intelligence platform providing title-specific interview question simulation with STAR answer coaching alongside AI-driven training gap analysis and personalized curriculum roadmapping.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your selections in Phase 1, the following core specifications are confirmed:
> - **Bilingual Global Standard**: Seamless one-click toggling between Turkish and English with localized corporate & tech terminology.
> - **Comprehensive Interview Engine (Combines 1 & 2)**: Interviewer persona profiling by exact job title (e.g., Engineering Manager, VP of People, Lead Product Manager), structured question categorization (Technical, Behavioral, Situational, Cultural), STAR method response guides, evaluation rubrics, and interactive mock practice with instant AI critique.
> - **Career & Training Intelligence (Combines 1 & 3)**: Skill gap visual matrix, competency inventory with self-assessment, tailored next-step course syllabus, and official certification roadmap based on completed trainings provided by the user.

---

## 1. Overview & Core Concept

- **What It Does**: 
  - **Module A: Interview Persona Simulator**: Accepts the interviewer's exact title, seniority, target position, and company context. Deconstructs the interviewer's psychological evaluation goals, generates 8–12 highly probable questions categorized by type, provides sample high-impact STAR answers, warning signs (red flags), and an interactive response sandbox where users can type their answers to receive detailed scoring and coaching tips.
  - **Module B: Career Pathway & Training Advisor**: Analyzes the user's completed trainings, certifications, and course outlines. Extracts acquired hard and soft competencies, compares them against industry benchmarks for their target role, highlights critical skill gaps, and constructs an actionable, structured syllabus for their next training step including course curricula, practice projects, and credential recommendations.
- **Target Audience / Persona**: Professionals, job seekers, and career pivoters preparing for high-stakes interviews and seeking structured continuous professional development.
- **Key Value**: Replaces guesswork with executive-grade interview intelligence tailored to specific hiring decision-makers, and provides clear, personalized educational roadmaps.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Interviewer Question Simulator Flow**:
   - The user inputs the interviewer's title (e.g., "Engineering Manager", "Head of Talent Acquisition", "Chief Product Officer", "Senior System Architect"), optional target role, industry/company type, and interview stage.
   - Quick-preset chips allow 1-click loading of common interviewer roles (e.g., VP of Engineering, Senior HRBP, Director of Marketing, Tech Lead).
   - The agent analyzes the persona: Mindset, primary evaluation metrics, what impresses them vs. what raises red flags.
   - Questions are presented in clean, categorized accordions with:
     - Question & strategic rationale (Why they ask this).
     - Model answer structured with STAR (Situation, Task, Action, Result).
     - "Try Your Answer" interactive simulator: User submits their answer and receives immediate feedback on clarity, impact, STAR alignment, and score breakdown.
2. **Career & Training Advisor Flow**:
   - User enters past trainings/courses attended (via free-text notes, curriculum copy-paste, or preset templates like "Full-Stack Bootcamp", "Data Analytics Specialization", "Scrum Master & Agile Leadership").
   - User specifies their next target career milestone or role.
   - The advisor visualizes:
     - Acquired Skill Inventory (categorized with proficiency levels).
     - Skill Gap Matrix (what is missing for the target milestone).
     - Recommended Next Training Syllabus: Detailed 4-to-6 module learning plan, recommended real-world projects, top certifications, and free/paid resource recommendations.
3. **Bilingual Switcher**:
   - Seamless instant header switch between Turkish ("TR") and English ("EN") across all labels, generated responses, and coach feedback.

### Visual Identity & Theme
- **Aesthetic Direction**: Executive Career Intelligence Studio — sleek, high-clarity SaaS editorial aesthetic without generic AI gradients or floating pill badges.
- **Color Palette**:
  - Dominant Neutral: Crisp Slate canvas (`bg-slate-50` / `dark:bg-slate-950`) with refined structural white cards (`bg-white` / `dark:bg-slate-900`) and subtle hairline dividers (`border-slate-200` / `dark:border-slate-800`).
  - Brand Primary: Deep Indigo / Navy (`text-slate-900`, `bg-indigo-600`, `hover:bg-indigo-700`).
  - Functional Accents: Emerald (`#059669` / `text-emerald-700` for strengths & STAR action items), Amber (`#d97706` for gap alerts), Rose (`#dc2626` for interview red flags).
- **Typography & Hierarchy**:
  - Heading Display: `Plus Jakarta Sans` with bold weights and tight letter-spacing.
  - Body & UI: `Plus Jakarta Sans` / `DM Sans` with clean line heights.
  - Metrics & STAR labels: Tabular figures with `font-mono` where appropriate.
- **Zero-Pill Restraint**: Metadata rendered as clean unboxed text separated by subtle bullets (`·`) or slashes (`/`), avoiding colorful capsule badges.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Mode Focused Workspace**:
  - *Chosen Approach*: Two primary dedicated workspaces ("Interview Simulator" and "Career Pathway Advisor") switchable via a clean top-level segmented navigation bar, with shared profile context.
  - *Why*: Allows deep concentration on either interview preparation or education planning without cluttered screens, while maintaining shared career profile data.
- **Decision 2: Server-Side Gemini API with Structured Output**:
  - *Chosen Approach*: Express server backend using `@google/genai` with `gemini-3.8-flash` returning validated JSON schemas for questions, STAR breakdowns, rubrics, and curriculum roadmaps.
  - *Why*: Prevents API key exposure to the browser, guarantees consistent structured data for rich UI rendering, and provides fast, high-quality reasoning.
- **Decision 3: Local Storage Persistence & Preset Library**:
  - *Chosen Approach*: Client-side persistence of generated interview guides, saved answer evaluations, and completed training history in `localStorage`, accompanied by realistic pre-populated industry samples (Tech, Product, HR, Finance).
  - *Why*: Users can immediately test the platform without typing extensive backgrounds, and their custom generated interview guides remain accessible across reloads.

---

## 4. Technical Architecture & Data Strategy

### Technical Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT (React 19)                               │
│                                                                             │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────────┐  │
│  │   Top Bar Navigation    │  │  Global State (Language, Profile, Mode)  │  │
│  └────────────┬────────────┘  └────────────────────┬─────────────────────┘  │
│               │                                    │                        │
│               ▼                                    ▼                        │
│  ┌─────────────────────────┐         ┌───────────────────────────────────┐  │
│  │   Interview Simulator   │         │     Career & Training Advisor     │  │
│  │  - Interviewer Persona  │         │  - Completed Course Logs          │  │
│  │  - Categorized Q&A      │         │  - Skill Matrix & Gap Assessment  │  │
│  │  - STAR Guide & Rubrics │         │  - Next Training Syllabus         │  │
│  │  - Interactive Mock Box │         │  - Certification Roadmap          │  │
│  └────────────┬────────────┘         └─────────────────┬─────────────────┘  │
│               │                                        │                    │
│               └───────────────────┬────────────────────┘                    │
│                                   │                                         │
│                                   ▼                                         │
│                      Fetch API (/api/coach/...)                             │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │ HTTP JSON
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SERVER (Node / Express)                            │
│                                                                             │
│  ┌───────────────────────┐                 ┌─────────────────────────────┐  │
│  │  /api/interview-coach │                 │    /api/training-advisor    │  │
│  └───────────┬───────────┘                 └──────────────┬──────────────┘  │
│              │                                            │                 │
│              └────────────────────┬───────────────────────┘                 │
│                                   ▼                                         │
│                  Google GenAI Client (@google/genai)                        │
│                   Model: 'gemini-3.8-flash' (Server)                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State
- `InterviewerProfile`: `{ interviewerTitle, targetRole, companyType, seniorityLevel, interviewRound }`
- `InterviewGuide`: `{ interviewerSummary, coreMindset, questions: [{ id, category, question, rationale, starAnswer: { situation, task, action, result }, redFlags: [], evaluationCriteria: [] }] }`
- `AnswerEvaluation`: `{ score, clarityScore, starAlignmentScore, strengths: [], improvements: [], sampleRefinement }`
- `TrainingEntry`: `{ id, title, provider, completedDate, keyTopics: [], skillsAcquired: [] }`
- `CareerPathwayResult`: `{ currentCompetencies: [], skillGaps: [], recommendedNextTraining: { courseTitle, targetSkillLevel, learningDuration, syllabusModules: [{ weekOrModule, topic, outcomes }], recommendedProjects: [], certifications: [] } }`

### Key Interactive Components
1. `Navbar`: Wordmark, Workspace Mode Tab switcher (`Mülakat Simülatörü` / `Kariyer & Eğitim Danışmanı`), Language Toggle (`TR` / `EN`), Reset button.
2. `InterviewerForm`: Title input with auto-suggestions, company context, target role, and preset selectors.
3. `QuestionCard`: Expandable question breakdown with category filter, strategic rationale, STAR breakdown tabs, and interactive "Mock Practice" drawer.
4. `MockPracticeModal`: Real-time answer input with word counter and instant AI critique generator.
5. `TrainingInputForm`: Course itemizer with topic tagger and sample loader.
6. `SkillGapVisualizer`: Comparison grid of mastered skills vs. missing target competencies.
7. `NextSyllabusCard`: Modular curriculum breakdown with project blueprint and certification cards.
