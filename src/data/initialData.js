// Realistic initial data for DayFlow

const offsetDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const initialTasks = [
  // Today's tasks (Mix of completed & pending)
  {
    id: 'task-1',
    title: 'Complete Chapter 4: Data Structures & Trees',
    category: 'Study',
    date: offsetDate(0),
    time: '09:30',
    priority: 'High',
    completed: true,
    notes: 'Cover binary search trees, AVL rotations and solve 5 practice questions.',
    courseId: 'course-1'
  },
  {
    id: 'task-2',
    title: 'Client Sprint Retrospective & Demo Sync',
    category: 'Work',
    date: offsetDate(0),
    time: '11:00',
    priority: 'High',
    completed: true,
    notes: 'Walk through release v2.4 staging build and gather client feedback.',
  },
  {
    id: 'task-3',
    title: 'Review Organic Chemistry Reaction Mechanisms',
    category: 'Study',
    date: offsetDate(0),
    time: '14:00',
    priority: 'Medium',
    completed: false,
    notes: 'Focus on electrophilic addition and summarize notes on reaction pathways.',
    courseId: 'course-2'
  },
  {
    id: 'task-4',
    title: 'Draft Product Design Proposal for Q1 Launch',
    category: 'Work',
    date: offsetDate(0),
    time: '16:00',
    priority: 'High',
    completed: false,
    notes: 'Detail user personas, feature scopes, and wireframe links in Notion.',
  },
  {
    id: 'task-5',
    title: 'Evening 45-min HIIT & Strength Session',
    category: 'Personal',
    date: offsetDate(0),
    time: '18:30',
    priority: 'Low',
    completed: false,
    notes: 'Target core and upper body at gym.',
  },

  // Tomorrow's tasks
  {
    id: 'task-6',
    title: 'Calculus III: Vector Calculus & Green Theorem',
    category: 'Study',
    date: offsetDate(1),
    time: '10:00',
    priority: 'High',
    completed: false,
    notes: 'Read textbook section 14.3 to 14.5 and complete problem set 8.',
    courseId: 'course-3'
  },
  {
    id: 'task-7',
    title: 'Finalize Freelance Invoice & Timesheet Submissions',
    category: 'Work',
    date: offsetDate(1),
    time: '13:30',
    priority: 'Medium',
    completed: false,
    notes: 'Send November mid-month invoice to FinTech client.',
  },
  {
    id: 'task-8',
    title: 'Grocery Restock & Meal Prep for the Week',
    category: 'Personal',
    date: offsetDate(1),
    time: '17:00',
    priority: 'Low',
    completed: false,
    notes: 'Fresh greens, oats, protein powder, and olive oil.',
  },

  // Upcoming in 2-4 days
  {
    id: 'task-9',
    title: 'Algorithm Analysis Term Paper First Draft',
    category: 'Study',
    date: offsetDate(3),
    time: '15:00',
    priority: 'High',
    completed: false,
    notes: 'Submit paper to professor portal for peer review feedback.',
    courseId: 'course-1'
  },
  {
    id: 'task-10',
    title: 'Team Cross-Functional Architecture Workshop',
    category: 'Work',
    date: offsetDate(4),
    time: '11:00',
    priority: 'Medium',
    completed: false,
    notes: 'Evaluate microservices migration vs monolithic refactor.',
  },
  {
    id: 'task-11',
    title: 'Dentist Checkup & Annual Health Screening',
    category: 'Personal',
    date: offsetDate(5),
    time: '09:00',
    priority: 'Medium',
    completed: false,
    notes: 'Bring insurance card and medical history document.',
  },
  {
    id: 'task-12',
    title: 'Mock Exam: CS301 Comprehensive Revision',
    category: 'Study',
    date: offsetDate(6),
    time: '10:00',
    priority: 'High',
    completed: false,
    notes: 'Timed 3-hour practice exam in quiet room.',
    courseId: 'course-1'
  }
];

export const initialCourses = [
  {
    id: 'course-1',
    name: 'Computer Science: Algorithms & Data Structures',
    code: 'CS 301',
    category: 'Study',
    targetDate: offsetDate(25),
    color: '#2563EB', // Blue
    chapters: [
      { id: 'ch-101', title: 'Chapter 1: Asymptotic Analysis & Big-O Notation', status: 'Completed', needsRevision: false },
      { id: 'ch-102', title: 'Chapter 2: Divide and Conquer Algorithms', status: 'Completed', needsRevision: false },
      { id: 'ch-103', title: 'Chapter 3: Graph Traversal (BFS & DFS)', status: 'Completed', needsRevision: true },
      { id: 'ch-104', title: 'Chapter 4: Balanced Binary Search Trees (AVL/Red-Black)', status: 'In Progress', needsRevision: false },
      { id: 'ch-105', title: 'Chapter 5: Dynamic Programming Fundamentals', status: 'Not Started', needsRevision: false },
      { id: 'ch-106', title: 'Chapter 6: Greedy Algorithms & Huffman Coding', status: 'Not Started', needsRevision: false },
      { id: 'ch-107', title: 'Chapter 7: NP-Completeness & Approximation', status: 'Not Started', needsRevision: false },
    ]
  },
  {
    id: 'course-2',
    name: 'Applied Organic & Biochemistry',
    code: 'CHEM 204',
    category: 'Study',
    targetDate: offsetDate(32),
    color: '#0D9488', // Teal
    chapters: [
      { id: 'ch-201', title: 'Chapter 1: Stereochemistry & Molecular Chirality', status: 'Completed', needsRevision: false },
      { id: 'ch-202', title: 'Chapter 2: Nucleophilic Substitution (SN1/SN2)', status: 'Completed', needsRevision: true },
      { id: 'ch-203', title: 'Chapter 3: Elimination Reactions & Regiochemistry', status: 'In Progress', needsRevision: false },
      { id: 'ch-204', title: 'Chapter 4: Carbonyl Chemistry & Enolates', status: 'Not Started', needsRevision: false },
      { id: 'ch-205', title: 'Chapter 5: Enzyme Kinetics & Catalytic Mechanisms', status: 'Not Started', needsRevision: false },
    ]
  },
  {
    id: 'course-3',
    name: 'Multivariable Calculus & Differential Equations',
    code: 'MATH 220',
    category: 'Study',
    targetDate: offsetDate(18),
    color: '#7C3AED', // Violet
    chapters: [
      { id: 'ch-301', title: 'Chapter 1: Partial Derivatives & Gradient Vectors', status: 'Completed', needsRevision: false },
      { id: 'ch-302', title: 'Chapter 2: Multiple Integrals in Polar & Cylindrical Coordinates', status: 'Completed', needsRevision: false },
      { id: 'ch-303', title: 'Chapter 3: Vector Fields & Line Integrals', status: 'In Progress', needsRevision: true },
      { id: 'ch-304', title: 'Chapter 4: Green\'s Theorem & Stokes\' Theorem', status: 'Not Started', needsRevision: false },
      { id: 'ch-305', title: 'Chapter 5: Second-Order Linear Differential Equations', status: 'Not Started', needsRevision: false },
    ]
  },
  {
    id: 'course-4',
    name: 'Professional Full-Stack System Architecture',
    code: 'DEV 400',
    category: 'Work',
    targetDate: offsetDate(40),
    color: '#EA580C', // Amber-Orange
    chapters: [
      { id: 'ch-401', title: 'Module 1: Distributed Caching & Redis Strategies', status: 'Completed', needsRevision: false },
      { id: 'ch-402', title: 'Module 2: Event-Driven Systems & Kafka Streaming', status: 'In Progress', needsRevision: false },
      { id: 'ch-403', title: 'Module 3: Database Sharding & Index Optimization', status: 'Not Started', needsRevision: false },
      { id: 'ch-404', title: 'Module 4: Zero-Downtime Deployment & CI/CD Pipelines', status: 'Not Started', needsRevision: false },
    ]
  }
];

export const defaultSettings = {
  theme: 'light', // 'light' | 'dark' | 'system'
  weekStartDay: 'monday', // 'monday' | 'sunday'
  defaultCategory: 'Study', // 'Study' | 'Work' | 'Personal'
  dailyGoal: 6,
  focusDuration: 25, // 15, 25, 45, 60
  soundCelebration: true,
};

export const userProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@dayflow.app',
  role: 'Student', // 'Student' | 'Employee' | 'Freelancer' | 'Other'
  bio: 'Computer Science student & part-time developer aiming for daily deep focus and consistent milestone progress.',
  avatar: '', // Custom uploaded data URL if provided
  avatarPreset: 'tech', // 'tech' | 'student' | 'creative' | 'minimal' | 'athlete'
  streak: 5,
  dailyGoal: 6,
  dailyQuote: 'Consistency is the playground of mastery.'
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
