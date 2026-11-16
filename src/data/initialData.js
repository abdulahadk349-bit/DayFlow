// Initial data and configuration definitions for DayFlow

export const initialTasks = [];

export const initialCourses = [];

// Identifiable demo records for selective migration (preserving user-created data)
export const DEMO_TASK_IDS = new Set([
  'task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6',
  'task-7', 'task-8', 'task-9', 'task-10', 'task-11', 'task-12'
]);

export const DEMO_TASK_TITLES = new Set([
  'Complete Chapter 4: Data Structures & Trees',
  'Client Sprint Retrospective & Demo Sync',
  'Review Organic Chemistry Reaction Mechanisms',
  'Draft Product Design Proposal for Q1 Launch',
  'Evening 45-min HIIT & Strength Session',
  'Calculus III: Vector Calculus & Green Theorem',
  'Finalize Freelance Invoice & Timesheet Submissions',
  'Grocery Restock & Meal Prep for the Week',
  'Algorithm Analysis Term Paper First Draft',
  'Team Cross-Functional Architecture Workshop',
  'Dentist Checkup & Annual Health Screening',
  'Mock Exam: CS301 Comprehensive Revision'
]);

export const DEMO_COURSE_IDS = new Set([
  'course-1', 'course-2', 'course-3', 'course-4'
]);

export const DEMO_COURSE_CODES = new Set([
  'CS 301', 'CHEM 204', 'MATH 220', 'DEV 400'
]);

export const defaultSettings = {
  theme: 'light', // 'light' | 'dark' | 'system'
  weekStartDay: 'monday', // 'monday' | 'sunday'
  defaultCategory: 'Study', // 'Study' | 'Work' | 'Personal'
  dailyGoal: 6,
  focusDuration: 25, // 15, 25, 45, 60
  soundCelebration: true,
};

export const userProfile = {
  name: '',
  email: '',
  role: 'Student', // 'Student' | 'Employee' | 'Freelancer' | 'Other'
  bio: '',
  avatar: '', // Custom uploaded data URL if provided
  avatarPreset: 'tech', // 'tech' | 'student' | 'creative' | 'minimal' | 'athlete'
  streak: 0,
  dailyGoal: 6,
  dailyQuote: '',
};

export const defaultTimerSettings = {
  focusDuration: 25, // 1 to 180 min
  shortBreakDuration: 5, // 1 to 60 min
  longBreakDuration: 15, // 1 to 120 min
  sessionsBeforeLongBreak: 4, // 1 to 12
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
  activePreset: '25/5',
};

export const standardPresets = [
  { id: '25/5', name: '25/5 Classic', focus: 25, shortBreak: 5, longBreak: 15, sessions: 4 },
  { id: '45/10', name: '45/10 Deep Flow', focus: 45, shortBreak: 10, longBreak: 20, sessions: 3 },
  { id: '50/10', name: '50/10 Academic Sprint', focus: 50, shortBreak: 10, longBreak: 25, sessions: 4 },
  { id: '60/15', name: '60/15 Power Hour', focus: 60, shortBreak: 15, longBreak: 30, sessions: 2 },
];
