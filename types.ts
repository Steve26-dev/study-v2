export enum TabType {
  SUMMARY = 'summary', // 급분바 (Brief)
  DETAIL = 'detail',   // 필족 (Detailed)
  SLIDES = 'slides',   // 슬라이드 (Visuals)
  QUESTIONS = 'questions' // 문족 (Questions)
}

export interface Topic {
  id: string;
  title: string;
  subject: string;
  professor: string;
  lastStudied: string;
  masteryLevel: number; // 0-100
  tags: string[];
}

export interface SRItem {
  id: string;
  topicId: string;
  title: string;
  dueDate: string; // ISO Date
  status: 'new' | 'due' | 'future';
  priority: 'high' | 'medium' | 'low';
}

export interface QuestionAttempt {
  id: string;
  date: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}