export type ContentType = 'movie' | 'podcast' | 'interview' | 'reel' | 'live';

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  coverUrl: string;
  videoUrl: string;
  duration: string;
  year: number;
  genre: string[];
  rating: string;
  type: ContentType;
  channelName?: string;
  views?: string;
  isOriginal?: boolean;
}

export interface Category {
  id: string;
  title: string;
  movies: Movie[];
  type?: ContentType;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}