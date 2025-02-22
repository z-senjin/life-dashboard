// Auth Types
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

// Dashboard Types
export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  totalNotes: number;
  totalMeals: number;
  totalWorkouts: number;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

// Note Types
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Meal Types
export interface Meal {
  id: string;
  name: string;
  instructions: string;
  ingredients: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  userId: string;
}

// Workout Types
export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  date: string;
  userId: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}