// types/index.d.ts

interface Interview {
  id: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  level: string;
  questions: string[];
  finalized: boolean;
  coverImage?: string;
  createdAt: string;
}

interface Feedback {
  id: string;
  interviewId: string;
  userId: string;
  totalScore: number;
  categoryScores: {
    name: string;
    score: number;
    comment: string;
  }[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  interviewId: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: {
    role: string;
    content: string;
  }[];
  feedbackId?: string;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface InterviewCardProps {
  interview: Interview;
}

interface TechIconProps {
  techstack: string[];
}
