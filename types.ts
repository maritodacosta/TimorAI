
export interface ProjectFile {
  name: string;
  type: 'html' | 'css' | 'js' | 'json';
  content: string;
}

export interface SiteConfig {
  files: ProjectFile[];
  description: string;
  timestamp: number;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type Language = 'id' | 'tet' | 'en' | 'pt';

export type UserTier = 'free' | 'premium';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  tier: UserTier;
  role: UserRole;
  avatar?: string;
  joinedAt?: number;
  buildsUsed?: number;
  lastBuildReset?: number;
  githubConnected?: boolean;
  githubToken?: string; // Field baru untuk menyimpan token akses GitHub
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  files: ProjectFile[];
  createdAt: number;
  updatedAt: number;
}
