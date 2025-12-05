  # LearnHub ✨

A GitHub-style Learning Management System prototype for TPG-style teams.

LearnHub combines:

- 👤 **Employee learning** – personalised paths, branches, module player  
- 🤝 **Collaboration** – shared modules, branches, and chats  
- 🏆 **Gamification** – leaderboard, points, streaks, badges  
- 📊 **Manager analytics** – team & company learning insights  
- 🕸 **Learning graph** – visual view of paths and branches


---

## 🚀 Getting Started (Dev)

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

---

## 🧭 Roles & Main Views

**Roles**

- **Employee**
  - My Learning dashboard
  - Team Collaboration
  - Leaderboard & badges
  - Module playback
- **Manager**
  - Analytics dashboard (team & company level)

**Core views**

- `LandingPage` – marketing entry + role selection  
- `EmployeeDashboard` – My Learning, AI plan, carousels, path tabs  
- `TeamCollaboration` – GitHub-style branching + shared chats  
- `Leaderboard` – scores, streaks, badges, “how points work”  
- `ModulePlayer` – module/course playback  
- `ManagerDashboard` – analytics & risk view  
- `LearningPathGraph` – visual learning path graph  

Navbar (`Navbar.tsx`) shows the right buttons per role and provides:

- Dark/light mode toggle (stored in `localStorage`)  
- User menu with name, role and **Seniority Badge**:
  - 3–4 years → *Rising Star*  
  - 5–9 years → *Experienced*  
  - 10+ years → *Veteran*  

---

## 🚪 Landing Page & Login

**Component:** `LandingPage.tsx`

- Hero section + feature cards (personalised learning, collaboration, analytics).
- Two main actions:
  - **Employee Login** → sets role `employee` → opens Employee Dashboard  
  - **Manager Login** → sets role `manager` → opens Manager Analytics  
- Clicking the **LearnHub logo** returns to the landing page (acts like home/logout).

---

## 👤 Employee Experience

### 1. My Learning Dashboard (`EmployeeDashboard.tsx`)

- Welcome message & **4 stat cards**:
  - Overall progress (%)
  - Completed modules
  - In-progress modules
  - Mandatory modules remaining

#### AI Learning Plan (mocked)

- Button opens **GenerateModuleDialog**:
  - User sets goal, timeframe, content types, difficulty.
  - Shows **suggested modules** (mock “AI”).
  - **Add Selected to My Path** → adds modules into the user’s path.

#### Carousels & My Branches

- Netflix-style carousels:
  - *Recommended for you*
  - *New & popular*
- **My Branches**:
  - Shows modules the user branched from team modules.
  - Each branch card:
    - Branch name (e.g. `alex-react-patterns-v2`)
    - Progress + “Start / Continue / Review” → opens `ModulePlayer`.

#### Personalised Path Tabs

- Tabs:
  - **In Progress**
  - **Mandatory**
  - **Completed**
- Search bar:
  - Filters modules in tabs and shows extra results below.
  - Search by title, description, category, tags.
- Search results:
  - **Add to My Path** → adds new modules to the path.
- Module cards:
  - Progress bar
  - Start/Continue/Review button
  - **Remove** (for non-default modules).
- **Reset Completed**:
  - Button to reset 100% modules back to in-progress (for refreshers).

---

### 2. Leaderboard & Gamification (`Leaderboard.tsx`)

- **Your Rank** card:
  - Rank, points, badges, completed modules, learning hours.
- **Team Leaderboard**:
  - List of peers with:
    - Rank
    - Points
    - Completed modules
    - Learning hours
    - Badges count

#### Points Model (displayed in UI)

- ✅ Complete a module → **+50**  
- ⏱ Learning time → **+5 per hour**  
- 💬 Comment & help others → **+10 per comment**  
- 📤 Share / recommend modules → **+15 each**  
- 🔥 Daily streak → **+20 per day**  
- 📆 Weekly streak bonus → **+100 per week**

> In this prototype, scores are seeded/mock data but represent the intended model.

#### Badges

- **Unlocked badges**:
  - e.g. *Frontend Master*, *Compliance Champion*, *Dedicated Learner*, *Early Adopter*.
- **Available badges**:
  - Show requirements and reward points (e.g. “Complete all Cloud modules”).
- Badge categories:
  - Technical Skills, Achievements, Engagement.

`SeniorityBadge.tsx` and `BadgeBoard.tsx` surface tenure and key badges across the app.

---

## 🤝 Team Collaboration & Branching (`TeamCollaboration.tsx`)

Tabs:

1. **Team Modules**
2. **Browse Branches**
3. **Recent Activity**
4. **Team Chat**

### Team Modules

- Shows base company modules and team modules.
- Each card:
  - Title, description, tags, difficulty.
  - **Branch** → creates a personal branch:
    - Appears under *My Branches* and *Browse Branches*.
  - **Merge to My Path** → pulls module into user’s path.
  - **View** → `ModulePlayer`.
  - **Message icon** → toggles module chat.

**Module chat**:

- Shared per-module discussion.
- Messages store:
  - Avatar, name, seniority badge, timestamp, message.
- Persisted in `localStorage` via `storage.ts`.

### Browse Branches

- Shows all branches created by the team.
- Each branch card:
  - Owner, source module, tags, duration.
- Actions:
  - **Pull to My Path** → copy branch into the user’s path (progress reset).
  - **View & Chat** → detailed branch view + chat.
  - **View Module** → open in `ModulePlayer`.

### Recent Activity

- Timeline of:
  - Branch creations
  - Pull/merge events
  - New comments

### Team Chat

- General (non-module) team chatroom for announcements and coordination.

---

## 🕸 Learning Path Graph (`LearningPathGraph.tsx`)

- Visual graph of:
  - Main company learning path
  - Individual branches
  - Merges (pulled branches)
- Nodes show:
  - Module title
  - Owner (Company / user)
  - Status (`completed`, `in-progress`, `not-started`).
- Filters:
  - All members
  - My path
  - Individual team members.
- Hover displays details tooltip.
- Back button → returns to **Team Collaboration**.

---

## 🎬 Module Player (`ModulePlayer.tsx`)

- Opened from any module/branch card.
- Shows:
  - Title, description
  - Category, difficulty, duration
  - Progress bar
- Supports module types:
  - `video`, `podcast`, `document`, `interactive`
  - Content is mocked for the demo.
- Controls:
  - Next/previous section
  - **Mark as Complete** → sets 100% progress and updates stats/leaderboard conceptually.

---

## 📊 Manager Analytics (`ManagerDashboard.tsx`)

Accessible via **Manager Login** or Navbar → **Analytics** (manager role).

Tabs:

1. **Team Analytics**
2. **Company Analytics**

### Team Analytics

- Overview cards:
  - Avg team completion
  - Active modules
  - Top performer
- Charts:
  - Team progress over time
  - Completion distribution (0–25, 26–50, 51–75, 76–100%)
- **Employee drill-down**:
  - Select a team member to see:
    - Completion rate
    - Active modules
    - Learning hours (mock)
    - Category breakdown (Frontend/Backend/Cloud/Leadership/Compliance)
    - Recent activity feed
- **Team list**:
  - Name, position, progress, active modules.
- **Compliance alert** card:
  - e.g. how many people are behind on mandatory training.

### Company Analytics (Simulated)

- Organisation-level cards:
  - Total employees, teams, avg completion, active modules.
- Department charts:
  - Completion trends by department.
- Category coverage:
  - Completion vs in-progress across major learning categories.
- Risk callouts for lagging departments.


---

## 💾 Data & Architecture

- **Front-end only** React + TypeScript app.
- State is stored in **`localStorage`**:
  - User modules (`userModules-<userId>`)
  - User branches (`userBranches-<userId>`)
  - Module chat rooms (`moduleChatRooms`)
  - Team activities (`teamActivities`)
  - Theme (`darkMode`)

---


  