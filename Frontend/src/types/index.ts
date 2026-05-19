// Course types
export interface Course {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  slug: string;
  average_rating?: number;
  total_ratings?: number;
}

// Teacher returned inside course detail
export interface Teacher {
  id: number;
  name: string;
}

// Lesson as returned by GET /courses/{slug}
export interface Lesson {
  id: number;
  name: string;
  description: string;
  slug: string;
}

// Class as returned by GET /classes/{class_id}
export interface Class {
  id: number;
  title: string;
  description: string;
  video: string;
  duration: number;
  slug: string;
}

// Course Detail type — matches GET /courses/{slug} API response
export interface CourseDetail extends Course {
  teachers: Teacher[];
  classes: Lesson[];
  rating_distribution?: Record<string, number>;
}

// Progress types
export interface Progress {
  progress: number; // seconds
  user_id: number;
}

// Quiz types
export interface QuizOption {
  id: number;
  answer: string;
  correct: boolean;
}

export interface Quiz {
  id: number;
  question: string;
  options: QuizOption[];
}

// Favorite types
export interface FavoriteToggle {
  course_id: number;
}
