import { User, Task, Note, Meal, Workout } from './types';

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// User Storage
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

export const createUser = (email: string, password: string, name: string): User => {
  const users = getUsers();
  const newUser: User = { id: generateId(), email, password, name };
  localStorage.setItem('users', JSON.stringify([...users, newUser]));
  return newUser;
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

// Session Management
export const setCurrentUser = (user: User) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

// Tasks Storage
export const getTasks = (userId: string): Task[] => {
  return JSON.parse(localStorage.getItem(`tasks_${userId}`) || '[]');
};

export const createTask = (userId: string, task: Omit<Task, 'id' | 'userId' | 'createdAt'>): Task => {
  const tasks = getTasks(userId);
  const newTask: Task = {
    ...task,
    id: generateId(),
    userId,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(`tasks_${userId}`, JSON.stringify([...tasks, newTask]));
  return newTask;
};

// Notes Storage
export const getNotes = (userId: string): Note[] => {
  return JSON.parse(localStorage.getItem(`notes_${userId}`) || '[]');
};

export const createNote = (userId: string, note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Note => {
  const notes = getNotes(userId);
  const now = new Date().toISOString();
  const newNote: Note = {
    ...note,
    id: generateId(),
    userId,
    createdAt: now,
    updatedAt: now,
  };
  localStorage.setItem(`notes_${userId}`, JSON.stringify([...notes, newNote]));
  return newNote;
};

// Meals Storage
export const getMeals = (userId: string): Meal[] => {
  return JSON.parse(localStorage.getItem(`meals_${userId}`) || '[]');
};

export const createMeal = (userId: string, meal: Omit<Meal, 'id' | 'userId'>): Meal => {
  const meals = getMeals(userId);
  const newMeal: Meal = {
    ...meal,
    id: generateId(),
    userId,
  };
  localStorage.setItem(`meals_${userId}`, JSON.stringify([...meals, newMeal]));
  return newMeal;
};

// Workouts Storage
export const getWorkouts = (userId: string): Workout[] => {
  return JSON.parse(localStorage.getItem(`workouts_${userId}`) || '[]');
};

export const createWorkout = (userId: string, workout: Omit<Workout, 'id' | 'userId'>): Workout => {
  const workouts = getWorkouts(userId);
  const newWorkout: Workout = {
    ...workout,
    id: generateId(),
    userId,
  };
  localStorage.setItem(`workouts_${userId}`, JSON.stringify([...workouts, newWorkout]));
  return newWorkout;
};