export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface Review {
  id: string;
  text: string;
  source: 'vk' | 'mos.ru' | 'telegram' | 'portal'; // In a real app, this might be linked to fileId
  fileId: string; // New: links review to a specific uploaded file
  sentiment: Sentiment;
  confidence: number;
  date: string;
}

export interface KPI {
  totalReviews: number;
  nps: number;
  npsDelta: number; // e.g., +2 or -5
  avgConfidence: number;
}

export interface KeywordData {
  name: string;
  count: number;
  sentiment: 'positive' | 'negative';
  relatedWord: string; // Context word
  aiContext: string; // Specific insight for this keyword
}

export interface DataFile {
  id: string;
  name: string;
  uploadDate: string;
  rowCount: number;
}

export interface AnalysisProject {
  id: string;
  title: string;
  description: string;
  kpi: KPI;
  reviews: Review[];
  keywords: KeywordData[];
  aiInsights: string[]; // General global insights
  files: DataFile[];
}
