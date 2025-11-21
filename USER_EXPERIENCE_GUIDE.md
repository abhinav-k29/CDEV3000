# LearnHub – User Experience Guide ✨

> A GitHub-style learning platform for TPG-style teams, combining personalised learning paths, branching, collaboration, gamification, and manager analytics.

---

## 🧭 Roles & Main Views

LearnHub supports **two primary roles**:

- **Employee**
  - Focus on *My Learning*, *Team Collaboration*, *Leaderboard* and module playback.
- **Manager**
  - Focus on *Analytics* – team and company-level learning insights.

Core views in the app:

- `LandingPage` – marketing-style entry + role selection  
- `EmployeeDashboard` – My Learning  
- `TeamCollaboration` – GitHub-style branches + shared chats  
- `Leaderboard` – points, ranks, badges, streaks  
- `ModulePlayer` – course playback  
- `ManagerDashboard` – analytics & risk view for managers  
- `LearningPathGraph` – visual learning path graph

---

## 🚪 Landing Page & Login

**Component:** `LandingPage.tsx`  

### 👀 What Users See

- Hero section with headline (e.g. _“Transform Your Team’s Learning Experience”_)
- Feature cards describing key capabilities:
  - Personalised paths
  - Collaborative learning
  - Analytics & governance
  - Mobile-friendly
- Two main buttons:
  - **Employee Login**
  - **Manager Login**
- **LearnHub logo** in the top-left

### 🧭 User Actions

- **Employee Login**  
  → Sets role to `employee` → opens **Employee Dashboard**

- **Manager Login**  
  → Sets role to `manager` → opens **Manager Analytics**

- **Click LearnHub Logo**  
  → Returns to landing page (acts like “home / logout” behaviour)

---

## 🧱 Global UI: Navbar & Layout

**Component:** `Navbar.tsx`

When logged in:

- **Logo + title:** LearnHub
- **Dark / light mode toggle**
  - Uses `localStorage('darkMode')` to remember theme

- **Navigation buttons (role-aware):**
  - For **employees**:
    - `My Learning` → Employee Dashboard
    - `Team Collaboration` → Collaboration workspace
    - `Leaderboard` → Gamification view
  - For **managers**:
    - `Analytics` → Manager dashboard

- **User menu (right side):**
  - Avatar, name, role/position
  - **Seniority badge** if `yearsAtCompany >= 3`:
    - 3–4 years → “Rising Star”
    - 5–9 years → “Experienced”
    - 10+ years → “Veteran”
  - Dropdown options:
    - View profile summary
    - Toggle dark/light mode (also exposed on mobile)
    - **Logout**

---

## 👤 Employee Experience

### 1️⃣ My Learning Dashboard (`EmployeeDashboard.tsx`)

#### 🎉 Top Section: Welcome & Stats

- Greeting: _“Welcome back, [Name]!”_
- Subtext encouraging continued learning.

**4 key stat cards:**

1. **Overall Progress**  
   - Big % + mini trend arrow (e.g. `↑ 12% from last month`)  
   - Clicking this card → opens **Leaderboard**.

2. **Completed Modules**

3. **In-Progress Modules**

4. **Mandatory Modules Remaining**

All cards are animated (hover-scale/shadow) to feel interactive.

---

#### 🤖 AI Learning Plan Generator

**Component:** `GenerateModuleDialog.tsx`

- Trigger button on dashboard: **“Generate AI-powered plan”**
- When clicked:
  - Opens dialog where user can:
    - Describe a learning **goal**
    - Select **timeframe** (e.g. 2 / 4 / 8 weeks)
    - Choose **content types** (Video / Podcast / Document)
    - Choose **difficulty** (Beginner / Intermediate / Advanced)

- The dialog displays **AI-suggested modules**, each with:
  - Title
  - Duration
  - Content type
  - Match %
  - Rating + total ratings

- User clicks **“Add Selected to My Path”**  
  → Modules are added to their personal learning path.

*(In this prototype, the “AI” is mocked with curated module suggestions.)*

---

#### 🌱 My Branches Section

Shown when user has created any branches.

Each **branch card** includes:

- Thumbnail image  
- Branch name badge (e.g. `alex-react-patterns-v2`)  
- Title & description  
- Progress bar  
- **Start / Continue / Review** button → opens **ModulePlayer**

This highlights GitHub-style branching applied to learning content.

---

#### 🎠 Recommended & New Modules

The dashboard includes carousel-like rows (like Netflix):

- **Recommended for You** – modules picked based on category/tags
- **New & Popular** – trending or newly added modules

**Click any module card** → opens **ModulePlayer**.

---

#### 📂 Personalised Pathway

**Tabs:**

- **In Progress** – modules where `0% < progress < 100%`
- **Mandatory** – all mandatory modules (e.g. compliance)
- **Completed** – modules at `100%`

**Search bar** (to the right of tabs):

- Filters modules within tabs
- Also shows **extra search results** below
- Searches by:
  - Title
  - Description
  - Category
  - Tags

**Search result cards** (below tabs):

- Show modules **not already** in the user’s path
- Each card includes:
  - Thumbnail
  - Title
  - Category
  - Tags
  - Duration
  - **Add to My Path** button

**Module cards in tabs:**

- Clicking card/image → opens **ModulePlayer**
- Button label varies:
  - `Start Course` / `Continue` / `Review` based on progress
- **Remove** button (for non-default modules) → removes from path
- Progress bar shows completion percentage

---

#### 🔁 Reset Completed

Bottom of dashboard:

- **Reset Completed** button
  - Moves all 100% modules back to 80% (In Progress)
  - Encourages revisiting content (“refreshers”)

---

### 2️⃣ Leaderboard & Gamification (`Leaderboard.tsx`) 🏆

Access:

- Navbar → **Leaderboard**
- OR from dashboard → click **Overall Progress** card

#### 🥇 Your Rank Card

At the top:

- Highlight card for **current user**:
  - Large avatar + rank icon (Crown/Trophy)
  - Text: **“Your Rank: #X”**
  - Position (e.g. _Senior Software Engineer_)
  - Quick stats:
    - Total **points**
    - Number of **badges**
    - Completed modules
    - Total learning hours
  - Progress bar towards **next rank**

This highlights long-term engagement, not just one-off completions.

---

#### 📊 Team Leaderboard Tab

List of **top performers**:

Each row in the leaderboard shows:

- Rank number (#1, #2, #3…)
- Avatar + name
- Position
- Completed modules
- Learning hours
- Number of badges
- Total points (with a star icon)

Top ranks visually stand out with stronger styling.

---

#### ⭐ Points System (Gamification Model)

Within the leaderboard view, a card explains **how to earn points**:

- ✅ **Complete a module** → **+50 points**
- ⏱ **Learning time** → **+5 points per hour**
- 💬 **Comment & help others** (module chat/discussion) → **+10 points per comment**
- 📤 **Share / recommend a module** → **+15 points each**
- 🔥 **Daily streak** → **+20 points per active day**
- 📆 **Weekly streak bonus** → **+100 points per week** of consistent learning

These increments are defined in the leaderboard logic and used for explaining **retention & engagement**.

---

#### 🎖 Badges & Achievements Tab

The second tab in `Leaderboard` focuses on **badges**.

Two sections:

1. **Unlocked Badges**
   - For the current user:
     - Display badges like:
       - “Frontend Master”
       - “Compliance Champion”
       - “Dedicated Learner”
       - “Early Adopter”
     - Each badge tile includes:
       - Icon/colour
       - Name
       - Short description
       - Points value

2. **Available to Earn**
   - Badges not yet unlocked:
     - Each shows:
       - Name
       - Requirements (e.g. “Complete all Cloud modules”)
       - Reward points (e.g. `+400`)
       - A small progress indicator when applicable

**Badge categories** (shown in a summary card):

- **Technical Skills** – skill-based badges
- **Achievements** – completion, streaks, special milestones
- **Engagement** – comments, shares, collaboration

---

### 3️⃣ Seniority & Badge Board

**Components:** `SeniorityBadge.tsx`, `BadgeBoard.tsx`

- **SeniorityBadge**
  - Appears next to user’s name in navbar and lists
  - Indicates tenure with the company:
    - 3–4 years → “Rising Star”
    - 5–9 years → “Experienced”
    - 10+ years → “Veteran”

- **BadgeBoard** (dashboard sidebar)
  - Compact view of a user’s notable badges:
    - e.g. “7-day Streak”, “Compliance Champion”
  - Provides a quick “brag board” for recent achievements.

---

## 👥 Team Collaboration & Branching (`TeamCollaboration.tsx`)

Access via Navbar → **Team Collaboration**.

### Tab Layout

1. **Team Modules**
2. **Browse Branches**
3. **Recent Activity**
4. **Team Chat**

---

### 1️⃣ Team Modules

Shows baseline company modules + team-created modules.

Each **module card** includes:

- Title, short description
- Tags
- Difficulty
- Whether it’s a **branch** (purple badge with a branch icon)
- Action buttons:
  - **Branch**
    - Creates a personal branch from this base module
    - New branch appears under:
      - **My Learning → My Branches**
      - **Team Collaboration → Browse Branches**
  - **Merge to My Path**
    - Pulls that module into user’s learning path
    - For a branch, this is effectively “Pull from branch”
  - **View**
    - Opens **ModulePlayer**
  - **Message icon** (`MessageSquare`)
    - Toggles the module-specific **chat** panel

#### Module Chat

- Each module is wired to a **shared chat room** (conceptually via `chatRoomId`).
- Users can:
  - Type messages & send
  - View prior conversation (all teammates learning that module)
- Displays:
  - Avatar
  - Name
  - Seniority badge (if applicable)
  - Timestamp
  - Message text

---

### 2️⃣ Browse Branches

Shows **all branches** created by any user in the team.

Each **branch card** shows:

- Branch name
- Owner
- Source module
- Tags
- Duration / difficulty

Buttons:

- **Pull to My Path**
  - Copies branch into user’s path with progress reset to 0%
  - Still uses the same `chatRoomId` to keep conversations shared.
- **View & Chat**
  - Opens detailed view + chat stream for that branch.
- **View Module**
  - Opens the branch in **ModulePlayer**.

---

### 3️⃣ Recent Activity

Timeline of key collaboration events, such as:

- New branch creation (who branched what from where)
- Pull/merge events (who pulled whose branch)
- New comments on modules
- Stars or highlights

This acts as a lightweight audit trail for learning collaboration.

---

### 4️⃣ Team Chat

General chatroom for the whole team, not tied to a module:

- Suitable for:
  - Announcements (“I created a branch for Cloud Compliance v2”)
  - Informal Q&A
  - Coordination (“Let’s all complete Module X this week”)

---

### Team Collaboration Sidebar

- **Team Members panel**
  - Avatar, name, position
  - Completion rate
  - Active modules

- **Quick stats**
  - Average team completion
  - Number of branches
  - Active learners

---

## 🌐 Learning Path Graph (`LearningPathGraph.tsx`)

Access from Team Collaboration via **“View Learning Graph”**.

### What It Shows

- Canvas-based graph layout of modules as nodes with edges representing:
  - The main **company path**
  - Individual **branches**
  - **Merges** (modules pulled into people’s paths)

Data example:

- Core path:
  - React Basics → React Advanced → TypeScript Fundamentals → Design Patterns → Testing Best Practices
- Branches for:
  - Alex (e.g. “React Performance Tuning”)
  - Other teammates with their own optional paths.

### Node UI

Each node shows:

- Module title
- Owner (e.g. “Company”, “Alex Rivera”)
- Status:
  - `completed` (green)
  - `in-progress` (orange)
  - `not-started` (grey)
- Additional style differences for:
  - Main (company) modules
  - Branch modules
  - Pulled/merged modules

### Filters

Dropdown to choose:

- **All Members** – show whole team
- **My Path** – only current user’s path
- **Individual teammate** – filter to that user’s path

### Hover Behaviour

Hovering a node pops a tooltip with:

- Module title
- Owner
- Status
- Branch information (e.g. “Branched from: React Advanced”)

**Back button** at top-left returns to **Team Collaboration**.

---

## ▶️ Module Player (`ModulePlayer.tsx`)

Triggered by “Start / Continue / View” actions on any module/branch.

### Layout

- **Header:**
  - `← Back` button returns to previous page (Dashboard, Collaboration, Leaderboard)

- **Main content:**
  - Module title
  - Long description
  - Category, difficulty, duration
  - Progress bar

### Content Types

Based on `module.type`:

- **Video** – large “video” region
- **Podcast** – audio-style layout
- **Document** – text / scroll layout
- **Interactive** – step-based content

*(Content is mocked for prototype purposes.)*

### Controls

- “Next section” (or similar) moves forward and marks current sub-section as done.
- “Mark as complete” (on final section) sets module progress to 100%.
- Automatically feeds back into:
  - Dashboard stats
  - Leaderboard points model (conceptually)
  - Completed vs In-progress split

There may also be hypothetical comments/notes sections depending on module metadata.

---

## 📊 Manager Experience – Analytics (`ManagerDashboard.tsx`)

Access:

- From landing page → **Manager Login**
- Or Navbar → **Analytics** (when logged in as manager)

### Structure

- Header explaining this is the **Manager / Analytics** view.
- Tabs:
  - **Team** – analytics for the manager’s direct team.
  - **Company** – wider organisation view (simulated).
- Time-range selector:
  - Last 7 days / 30 days / 90 days.

---

### 1️⃣ Team Analytics Tab

#### a. Overview Cards

Stats across the manager’s team:

- Average completion rate
- Total active modules
- Top performer (by completion)
- Trend indicators (e.g. up/down vs previous period)

#### b. Team Progress Over Time

Line chart showing:

- Team average completion % by month
- Top performer’s progression

Useful for talking about **improvement over time**, not just current snapshot.

#### c. Completion Distribution

Buckets team members by progress:

- 0–25%
- 26–50%
- 51–75%
- 76–100%

Visualised in a bar/segmented chart, highlighting where learners are clustered.

#### d. Employee Drill-Down

Manager can select a specific team member:

- Detailed card:
  - Avatar
  - Name
  - Position
  - Completion rate
  - Active modules
  - Total learning hours (mock)
- Category breakdown:
  - Frontend, Backend, Cloud, Leadership, Compliance
  - For each:
    - Completed modules
    - In-progress modules
- Recent activity feed for that person.

Buttons for manager actions:

- **Assign Module**
- **View Full Profile** (conceptual)

#### e. Team Member List

Tabular list of team members:

- Name, position, progress bar, active modules.
- Expandable rows:
  - Show what each member recently completed or is working on.

#### f. Compliance Alert

A dedicated **Compliance Alert** card:

- E.g. “2 team members must complete mandatory compliance training by Nov 15, 2024.”
- Visual risk indicator (warning icon + contrasting colour).
- **“View Details”** CTA.

This aligns with **risk management and governance**.

---

### 2️⃣ Company Analytics Tab

High-level organisation view (simulated):

- Cards showing:
  - Total employees
  - Total teams
  - Company-wide average completion
  - Total active modules

- Department charts:
  - Engineering, Sales, Marketing, HR, etc.
  - Completion trends by department over time.

- Category coverage:
  - Summaries of completion vs in-progress in:
    - Frontend
    - Backend
    - Cloud
    - Leadership
    - Compliance

- Risk indicators:
  - Which departments are behind on mandatory learning.

This supports discussion about **scaling LearnHub beyond a single team** into full TPG context.

---

## 🔁 Data & Demo Nature

- All **data is mocked**:
  - Employees, roles, avatars, modules, scores, analytics.
- No backend integration:
  - No live Totara/Kineo, WalkMe, Salesforce, Genesys, or HRIS hooks.
- No real AI backend:
  - AI planner is **front-end only** with pre-curated module suggestions.

All state is currently client-side and resettable.

---

## 🧵 Key UX Flows – Quick View

### Flow 1 – Branch a Module

1. Go to **Team Collaboration → Team Modules**.
2. Find a module.
3. Click **Branch**.
4. Branch appears in:
   - **My Learning → My Branches**  
   - **Team Collaboration → Browse Branches**
5. Teammates can now pull it.

---

### Flow 2 – Pull a Branch

1. Go to **Team Collaboration → Browse Branches**.
2. Locate a teammate’s branch.
3. Click **Pull to My Path**.
4. Branch is added to user’s path (progress reset).
5. Shared chat remains linked via `chatRoomId`.

---

### Flow 3 – Chat on a Module

1. Team Collaboration → **Team Modules**.
2. Click **Message icon** on a module.
3. Chat panel opens with all previous messages.
4. Type and send messages; all learners see them.

---

### Flow 4 – Search & Add Module

1. On **Employee Dashboard**, use the search bar.
2. See filtered tabs + extra results.
3. Click **Add to My Path** on any module.
4. The module joins the user’s learning path.

---

### Flow 5 – Complete a Module

1. Click a module card to open **ModulePlayer**.
2. Navigate sections; click **Mark as Complete** at end.
3. Progress → 100%, stats & leaderboard updated.

---

### Flow 6 – Visualise Team Learning

1. Team Collaboration → **View Learning Graph**.
2. Adjust filter: All, Myself, or specific teammate.
3. Hover nodes for status + details.

---

## 🧩 Key Interactive Elements (Summary Table)

| Feature                     | Where to Click                                   | Result                                      |
|----------------------------|--------------------------------------------------|---------------------------------------------|
| Login                      | Landing → **Employee / Manager Login**          | Opens respective dashboard                  |
| Generate AI Plan           | Dashboard → **Generate Plan**                   | Opens AI plan dialog                        |
| View Module                | Any module card                                  | Opens **ModulePlayer**                      |
| Start / Continue Module    | Module card main button                          | Starts or resumes course                    |
| Branch Module              | Team Modules → **Branch**                       | Creates new branch                          |
| Pull Branch                | Browse Branches → **Pull to My Path**           | Adds branch copy to path                    |
| Module Chat                | Team Modules → **Message icon**                 | Opens module discussion                     |
| Search Modules             | Dashboard → **Search bar**                      | Filters and shows search results            |
| Add Module from Search     | Search results → **Add to My Path**             | Adds to pathway                             |
| View Learning Graph        | Collaboration → **View Learning Graph**         | Opens visual graph                          |
| Remove Module from Path    | Module card → **Remove**                        | Removes from path                           |
| Mark Module Complete       | ModulePlayer → **Mark as Complete**             | Sets 100% progress                          |
| Reset Completed Modules    | Dashboard → **Reset Completed**                 | Moves 100% modules to 80% In Progress       |
| View Leaderboard           | Navbar → **Leaderboard** or progress card click | Opens leaderboard & badges view             |
| View Analytics             | Navbar → **Analytics** (manager)                | Opens manager dashboard                     |

---

## 🏗 Architecture Flow (High-Level)

```text
Landing Page
    ↓ (Employee Login)
Employee Dashboard (My Learning)
    ├─→ Module Player (via module cards)
    ├─→ Search results (via search bar)
    └─→ AI Plan dialog (via "Generate Plan")

Landing Page
    ↓ (Manager Login)
Manager Dashboard (Analytics)
    ├─→ Team analytics
    └─→ Company analytics

Team Collaboration
    ├─→ Module Player (via "View")
    ├─→ Branch creation (via "Branch")
    ├─→ Pull to path (via "Pull")
    ├─→ Module chat (via message icon)
    ├─→ Learning Path Graph (via "View Learning Graph")
    └─→ Team Chat

Module Player
    └─→ Back to previous view (Dashboard/Collaboration/Leaderboard)

Learning Path Graph
    └─→ Back to Team Collaboration
