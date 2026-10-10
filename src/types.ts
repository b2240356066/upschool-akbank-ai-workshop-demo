export type Language = 'tr' | 'en';

export type CandidateLevel =
  | 'university_student'
  | 'new_grad'
  | 'junior'
  | 'intern';

export interface InterviewerPersona {
  title: string;
  roleSummary: string;
  coreMindset: string;
  whatImpressesThem: string[];
  redFlags: string[];
  evaluationMetrics: string[];
}

export interface StarAnswer {
  situation: string;
  task: string;
  action: string;
  result: string;
  keyTakeaway: string;
}

export interface RubricItem {
  criteria: string;
  weight: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'technical' | 'behavioral' | 'situational' | 'motivation_culture' | 'case_study';
  categoryLabel: string;
  question: string;
  rationale: string;
  idealStarAnswer: StarAnswer;
  studentTip: string;
  rubric: RubricItem[];
}

export interface InterviewSimulatorResponse {
  interviewerPersona: InterviewerPersona;
  questions: InterviewQuestion[];
}

export interface AnswerEvaluation {
  overallScore: number;
  starBreakdown: {
    situationScore: number;
    taskScore: number;
    actionScore: number;
    resultScore: number;
  };
  clarityScore: number;
  relevanceScore: number;
  strengths: string[];
  areasForImprovement: string[];
  keyMissingElement?: string;
  toneAndDelivery?: string;
  actionableChecklist?: string[];
  detectedRedFlags?: string[];
  improvedAnswer: string;
  coachVerdict: string;
}

export interface AcquiredSkill {
  name: string;
  category: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  evidence: string;
}

export interface SkillGap {
  skill: string;
  severity: 'Critical' | 'High' | 'Medium';
  whyNeeded: string;
  gapType: string;
}

export interface CompetencyAudit {
  summary: string;
  acquiredSkills: AcquiredSkill[];
  skillGaps: SkillGap[];
}

export interface SyllabusModule {
  moduleNumber: number;
  title: string;
  duration: string;
  coreTopics: string[];
  handsOnPractice: string;
}

export interface CapstoneProject {
  title: string;
  description: string;
  techStackOrTools: string[];
  portfolioPitch: string;
}

export interface CertificationRecommendation {
  name: string;
  issuer: string;
  relevance: string;
  prepEffort: string;
}

export interface CuratedPlatform {
  platformName: string;
  suggestedCourseKeywords: string[];
  isFreeOrPaid: string;
}

export interface RecommendedNextTraining {
  courseTitle: string;
  targetObjective: string;
  estimatedDuration: string;
  difficultyLevel: string;
  syllabusModules: SyllabusModule[];
  capstoneProject: CapstoneProject;
  recommendedCertifications: CertificationRecommendation[];
  curatedPlatforms: CuratedPlatform[];
}

export interface TrainingAdvisorResponse {
  competencyAudit: CompetencyAudit;
  recommendedNextTraining: RecommendedNextTraining;
}

export interface InterviewPreset {
  id: string;
  title: string;
  titleEn: string;
  interviewerTitle: string;
  targetRole: string;
  targetRoleEn: string;
  candidateLevel: CandidateLevel;
  companyType: string;
  description: string;
  descriptionEn: string;
}

export interface TrainingPreset {
  id: string;
  label: string;
  labelEn: string;
  major: string;
  targetRole: string;
  targetRoleEn: string;
  content: string;
  contentEn: string;
}
