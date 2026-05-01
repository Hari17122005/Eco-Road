export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  photoURL?: string;
  location?: string;
  bio?: string;
}

export interface WasteAnalysis {
  id?: string;
  userId: string;
  textileType: string;
  amount: number;
  processingForm: string;
  roadType: string;
  recommendedPercentage: number;
  suitabilityRating: string;
  durabilityImprovement: string;
  createdAt: string;
}

export interface RoadEvaluation {
  id?: string;
  userId: string;
  imageUrl: string;
  condition: 'Good' | 'Moderate' | 'Poor';
  damagePercentage: number;
  detectedIssues: string[];
  suggestions: string;
  createdAt: string;
}

export interface EducationalContent {
  id?: string;
  title: string;
  category: 'research' | 'learning';
  content: string;
  authorId: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
