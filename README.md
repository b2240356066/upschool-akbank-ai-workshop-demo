# NexaCoach

**AI-powered interview and career coach for university students, new graduates, and junior job seekers.**

NexaCoach was built as a demo for the Upschool x Akbank AI Workshop. It uses the Google Gemini API to help candidates prepare for interviews and plan their next learning steps. Output is available in **Turkish** and **English**.

## Features

### 1. Interview Simulator
Enter the title of the person who will interview you (for example *Engineering Manager* or *HR Business Partner*) and optionally your target role, company type, and interview round. NexaCoach returns:

- **Interviewer persona**: what they care about, their mindset, what impresses them, red flags, and evaluation metrics
- **6-8 realistic questions** across behavioral, technical, situational, culture/motivation, and case-study categories
- For each question: why it is asked, an **ideal STAR answer**, a tip tailored to students and new grads, and a scoring rubric

### 2. Answer Evaluation
Write (or speak) a practice answer and get structured feedback:

- Overall score plus STAR breakdown (Situation, Task, Action, Result), clarity, and relevance
- Strengths, areas for improvement, and the single most important missing element
- Tone and delivery feedback, an action checklist, and detected red flags
- A polished **rewritten STAR answer** based on your own story

### 3. Training and Career Advisor
Describe the courses, bootcamps, and certifications you have completed and your target role. You get:

- A **competency audit**: skills you have, with proficiency levels, and skill gaps ranked by severity
- A recommended next course with a module-by-module syllabus and hands-on practice
- A **capstone project** idea with a portfolio pitch
- Suggested certifications and learning platforms

### 4. Voice Answers
Record your answer and have it transcribed with Gemini, so you can practice speaking out loud.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS 4, Motion, Lucide React |
| Backend | Node.js, Express, TypeScript (run with `tsx`) |
| AI | Google Gemini via the `@google/genai` SDK |

In development, Express serves the API and mounts Vite as middleware, so one command runs both the frontend and the backend.

## Getting Started

### Prerequisites
- Node.js 18 or newer
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

```bash
git clone https://github.com/b2240356066/upschool-akbank-ai-workshop-demo.git
cd upschool-akbank-ai-workshop-demo
npm install
```

### Configuration

Copy the example environment file and add your key:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Required. Your Google Gemini API key. |
| `APP_URL` | URL where the app is hosted. Injected automatically on AI Studio / Cloud Run. |
| `PORT` | Optional. Server port (default `3000`). |

> Never commit your real `.env` file. It is already listed in `.gitignore`.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
NODE_ENV=production npm start
```

## Available Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Starts the Express server with Vite in middleware mode |
| `npm start` | Starts the server (set `NODE_ENV=production` to serve `dist/`) |
| `npm run build` | Builds the frontend with Vite |
| `npm run preview` | Previews the production build |
| `npm run lint` | Type-checks the project with `tsc --noEmit` |
| `npm run clean` | Removes `dist` and `server.js` |

## API Reference

All endpoints accept and return JSON. The optional `language` field is `"tr"` (default) or `"en"`.

| Method | Endpoint | Description | Required fields |
|--------|----------|-------------|-----------------|
| GET | `/api/health` | Health check; reports whether an API key is set | none |
| POST | `/api/interview-simulator` | Generates interviewer persona and questions with STAR answers | `interviewerTitle` |
| POST | `/api/interview-evaluate` | Scores and improves a practice answer | `question`, `candidateAnswer` |
| POST | `/api/training-advisor` | Audits completed trainings and recommends a learning path | `completedTrainings` |
| POST | `/api/transcribe-audio` | Transcribes a base64-encoded audio recording | `audioBase64` |

**Optional fields**
- `/api/interview-simulator`: `targetRole`, `companyType`, `candidateLevel`, `interviewRound`, `language`
- `/api/interview-evaluate`: `interviewerTitle`, `targetRole`, `language`
- `/api/training-advisor`: `targetRole`, `careerGoal`, `currentFieldOrMajor`, `language`
- `/api/transcribe-audio`: `mimeType` (default `audio/webm`), `language`

**Example**

```bash
curl -X POST http://localhost:3000/api/interview-simulator \
  -H "Content-Type: application/json" \
  -d '{
    "interviewerTitle": "Engineering Manager",
    "targetRole": "Junior Software Engineer",
    "language": "en"
  }'
```

## Project Structure

```
.
├── src/             # React frontend
├── server.ts        # Express server and Gemini API endpoints
├── index.html       # App entry point
├── vite.config.ts   # Vite configuration
├── tsconfig.json    # TypeScript configuration
├── metadata.json    # AI Studio app metadata
├── .env.example     # Environment variable template
└── package.json
```

## Acknowledgements

Created during the Upschool x Akbank AI Workshop and generated from the Google AI Studio repository template.
