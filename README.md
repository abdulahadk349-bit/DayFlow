# DayFlow — Universal Productivity & Syllabus Planner

DayFlow is a modern, responsive productivity application tailored for students, professionals, and freelancers to organize tasks, manage time blocks, track study curriculums, run custom deep-work timers, and customize their personal flow.

## Features

- **Customizable Focus Flow (Pomodoro Productivity Timer)**:
  - Header indicators for cycle tracking (`Cycle #1`, `Cycle #2`), audio chime mute toggle, and dedicated Settings button.
  - Three session modes: **Focus**, **Short Break**, and **Long Break** with real-time minute tags.
  - Quick standard presets on the card: **25/5** (Classic), **45/10** (Deep Flow), **50/10** (Academic Sprint), and **60/15** (Power Hour).
  - Custom duration configuration:
    - Focus duration: 1 to 180 minutes
    - Short break duration: 1 to 60 minutes
    - Long break duration: 1 to 120 minutes
    - Sessions before long break: 1 to 12 cycles
  - Custom preset creator: Name, save, load, and delete custom timer presets in `localStorage`.
  - Automatic transitions: Optional auto-start for breaks and auto-start for focus sessions.
  - Audible notifications: Synthesized two-tone bell chime via Web Audio API with preview button (zero external audio file dependencies).
  - Tab drift prevention: Wall-clock synchronization ensuring precise timekeeping even when browser tabs are inactive or backgrounded.

- **Profile & Profile Settings System**:
  - Sidebar user profile section with dynamic avatar, display name, role indicator, and quick Settings action.
  - Dedicated Profile page with Hero summary, profile editor, and application settings.
  - Profile customization: Display name, profile photo upload (Base64) or preset avatars, user role (`Student`, `Employee`, `Freelancer`, `Other`), and personal bio.
  - Appearance themes: Functional `Light`, `Dark`, and `System` theme switching.
  - Calendar week preferences: Configurable first day of week (`Monday` vs `Sunday`).
  - Task defaults: Default task category (`Study`, `Work`, `Personal`).
  - Personalization: Daily task target goal and custom dashboard focus quote.

- **Dashboard**:
  - Personalized time-based greetings with user avatar, dynamic date display, and motivational focus quotes.
  - Daily progress ring/bar with real-time percentage completion.
  - Interactive today's schedule with category filters and instant task check-off.
  - 7-day upcoming deadlines radar.

- **Planner**:
  - Full CRUD task management (title, category, date, time, priority, notes, and syllabus linkage).
  - 3 view modes: **List View**, **Schedule View** (chronological time blocks), and **Columns View** (Kanban by category).
  - Multi-attribute filtering (Category, Priority, Status, Date Range) and real-time text search.

- **Progress & Syllabus Tracker**:
  - Weekly activity bar chart (Mon–Sun or Sun–Sat) tracking planned vs completed tasks.
  - Category and urgency distribution analytics.
  - Curriculum and chapter tracking with status management (`Not Started`, `In Progress`, `Completed`), exam countdowns, and revision flagging.

- **Design & Technical Stack**:
  - Built with React, Vite, and Tailwind CSS.
  - Premium light and dark interfaces with royal blue accents and dark navy typography.
  - Responsive design with collapsible sidebar and mobile drawer.
  - Zero external database or backend dependencies — all data persists in `localStorage` with a reset option.

## Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd dayflow

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
