export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface RegisterInput {
  roll_number: string;
  full_name: string;
  email: string;
  password: string;
  role?: 'student' | 'faculty';
  department?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SessionInput {
  mentor_id: string;
  skill_id: string;
  title: string;
  description?: string;
  scheduled_date: string;
}

export interface ReviewInput {
  session_id: string;
  rating: number;
  comment?: string;
}

export interface UserSkillInput {
  skill_id: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_of_experience: number;
}

export interface DashboardStats {
  total_skills: number;
  upcoming_sessions: number;
  completed_sessions: number;
  avg_rating: number;
  unread_notifications: number;
}

export interface TopMentor {
  user_id: string;
  roll_number: string;
  full_name: string;
  email: string;
  department: string | null;
  avg_rating: number;
  total_sessions: number;
  completed_sessions: number;
}
