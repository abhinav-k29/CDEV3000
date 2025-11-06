# LearnHub - Complete User Experience Guide

## 🚀 Overview
LearnHub is a GitHub-style learning platform where employees can create personalized learning pathways, branch modules from teammates, and collaborate through shared chat rooms.

---

## 📍 **Entry Point: Landing Page**

### What Users See:
- Hero section with "Transform Your Team's Learning Experience"
- Feature cards showcasing platform capabilities
- Two login buttons

### User Actions:
1. **Click "Employee Login"** → Logs in as Alex Rivera (Employee role) → Navigates to **My Learning Dashboard**
2. **Click "Manager Login"** → Logs in as Sarah Johnson (Manager role) → Navigates to **Analytics Dashboard**
3. **Click "LearnHub Logo"** (top left) → Returns to landing page / Logs out

---

## 👤 **EMPLOYEE EXPERIENCE**

### **Navigation Bar (Top)**
Always visible when logged in:

- **"My Learning"** button → Goes to Employee Dashboard
- **"Team Collaboration"** button → Goes to Team Collaboration page
- **User Avatar** (top right) → Dropdown menu:
  - Shows email and department
  - Mobile navigation items
  - **"Logout"** option

---

## 📚 **1. MY LEARNING DASHBOARD** (`/dashboard`)

### **Top Section: Welcome & Stats**
- Personalized greeting: "Welcome back, [FirstName]!"
- **4 Stat Cards:**
  - Overall Progress (percentage bar)
  - Completed modules count
  - In Progress modules count
  - Mandatory modules remaining

### **AI Learning Plan Generator**
- **Click "Generate Plan" button** → Opens dialog to:
  - Enter learning goals
  - Select timeframe
  - Choose preferred content types (video/podcast/document)
  - Select difficulty level
  - View AI-suggested modules
  - **Click "Add Selected to My Path"** → Adds modules to learning path

### **My Branches Section** (if user has branches)
- Shows cards for each branch created by the user
- Each card shows:
  - Thumbnail image
  - Branch name badge (e.g., "alex-react-patterns-v2")
  - Title and description
  - Progress bar
  - **"Start/Continue/Review" button** → Opens Module Player

### **Carousel Sections:**
- **"Recommended for You"** → Horizontal scrolling carousel of recommended modules
- **"New & Noteworthy"** → Recently added or popular modules
- **Click any module card** → Opens Module Player

### **Right Sidebar (Desktop):**
- **Trending Panel** → Top 10 modules by popularity
- **Badge Board** → Achievement badges

### **Personalized Pathway Section:**
- **Tab Navigation:**
  - **"In Progress"** → Shows modules with 0-99% progress
  - **"Mandatory"** → Shows all mandatory modules
  - **"Completed"** → Shows 100% completed modules

- **Search Bar** (next to tabs):
  - **Type to search** → Filters modules in tabs AND shows search results below
  - Searches: Title, Description, Category, Tags
  - **Search Results Card** (appears below tabs):
    - Shows modules NOT in user's path
    - Each result has: Thumbnail, title, category, tags, duration
    - **Click "Add to My Path"** → Adds module to learning path

- **Module Cards in Tabs:**
  - **Click card/image** → Opens Module Player
  - **"Remove" button** (if not default module) → Removes from path
  - Progress bar shows completion status

### **Bottom of Dashboard:**
- **"Reset Completed" button** → Moves all 100% modules back to 80% (in-progress)

---

## 👥 **2. TEAM COLLABORATION PAGE** (`/collaboration`)

### **Header:**
- **"View Learning Graph" button** → Opens visual graph of all branches/merges

### **Tab Navigation (4 Tabs):**

#### **Tab 1: "Team Modules"**
Lists all available modules (team-created + company modules)

**For each module card:**
- **Branch Badge** (if branched) → Purple badge with branch icon
- **Message Square icon** (top right) → Toggles Discussion/Chat section
- **"Branch" button** → Creates a new branch of this module
  - Auto-generates branch name (e.g., "alex-react-patterns-v2")
  - Creates copy in user's My Branches section
  - Makes it visible to team
- **"Merge to My Path" button** → Adds module to user's learning path
  - For branched modules, this is actually a "Pull" operation
- **"View" button** → Opens Module Player

**Discussion/Chat Section** (when Message icon clicked):
- Shows module-based chat room (shared with all users learning same module)
- **Type message + Enter or click Send** → Posts to shared chat
- All team members see messages in real-time (same chatRoomId)

#### **Tab 2: "Browse Branches"**
Shows all branches created by team members

**For each branch card:**
- Shows: Branch name, owner, source module, tags, duration
- **"Pull to My Path" button** → Creates independent copy in user's path
  - Creates new module instance with same content
  - Preserves chatRoomId (so users can still chat together)
  - Resets progress to 0%
- **"View & Chat" button** → Expands to show branch details + chat
- **"View Module" button** → Opens Module Player

#### **Tab 3: "Recent Activity"**
Shows timeline of:
- Branch creations
- Module merges/pulls
- Comments
- Stars/views

#### **Tab 4: "Team Chat"**
General team chatroom:
- **Type message + Enter or click Send** → Posts to team chat
- Shows all team messages chronologically

### **Right Sidebar:**
- **Team Members Panel** → Shows all team members with:
  - Avatar, name, position
  - Completion rate
  - Active modules count
- **Quick Stats Card** → Team metrics

---

## 🎬 **3. MODULE PLAYER** (`/player?module=id`)

Opened when clicking any module card anywhere in the app.

### **Header:**
- **"← Back" button** → Returns to previous view (Dashboard or Collaboration)

### **Module Content Area:**
- Large hero banner with module thumbnail
- Module info: Title, description, category, difficulty, duration
- Progress bar

### **Content Sections:**
- For **Video** modules: Video player interface
- For **Podcast** modules: Audio player
- For **Document** modules: Scrollable content
- For **Interactive** modules: Step-by-step interactive content

### **Navigation Controls:**
- **"Previous Section" button** (left) → Goes to previous section
- **"Next Section" button** (right) → Advances + marks current as complete
- **"Mark as Complete" button** (when on last section) → Sets progress to 100%

### **Comments/Discussion Tab:**
- Shows all comments on the module
- **Textarea + "Post Comment"** → Adds comment
- **Reply button** → Replies to specific comments
- **Like button** → Likes comments

### **Related Modules Tab:**
- Suggests similar modules

---

## 📊 **4. LEARNING PATH GRAPH**

Opened from Team Collaboration → **"View Learning Graph"** button

### **Visual Graph:**
- **Canvas view** showing nodes and connections
- **Hover over nodes** → Shows tooltip with:
  - Module title
  - Owner name
  - Status (Completed/In Progress/Not Started)
  - Branch/Merge indicators

### **Filter Dropdown:**
- **"All Team Paths"** → Shows everything
- **"My Path Only"** → Shows only user's branches
- **Individual team member names** → Filters to their paths

### **Node Colors:**
- **Green** = Completed
- **Orange** = In Progress
- **Gray** = Not Started

### **Connection Types:**
- **Blue lines** = Main path (company curriculum)
- **Purple dashed lines** = Branches (from main path)
- **Green dashed lines** = Merges (pulled into user paths)

### **Module List Below Graph:**
- Lists all modules visible in current filter
- **Hover over list items** → Highlights corresponding node in graph

### **Back Button:**
- **"← Back to Collaboration"** → Returns to Team Collaboration page

---

## 🔑 **KEY USER FLOWS**

### **Flow 1: Branch a Module**
1. Go to **Team Collaboration** → **Team Modules** tab
2. Find a module you want to customize
3. **Click "Branch" button**
4. Module now appears in:
   - **My Learning** → My Branches section
   - **Team Collaboration** → Browse Branches tab (visible to all)
5. Your branch is now public for team to pull

### **Flow 2: Pull from Teammate's Branch**
1. Go to **Team Collaboration** → **Browse Branches** tab
2. See all team members' branches
3. **Click "Pull to My Path"** on desired branch
4. Module is copied to your learning path (independent copy)
5. You can chat with original branch owner (shared chatRoomId)
6. Module appears in **My Learning** → Personalized Pathway tabs

### **Flow 3: Chat with Team on Same Module**
1. In **Team Collaboration** → **Team Modules**
2. **Click Message Square icon** on any module
3. Discussion panel expands showing chat room
4. **Type message + Enter** → Message appears for all users of that module
5. OR open the module in **Module Player** → Comments tab → Post there

### **Flow 4: Search and Add Module**
1. In **My Learning** dashboard
2. **Type in search bar** (e.g., "React", "DevOps", "testing")
3. Search filters tabs AND shows results below
4. **Click "Add to My Path"** on any result
5. Module added to your pathway tabs

### **Flow 5: Complete a Module**
1. **Click any module card** → Opens Module Player
2. Navigate through sections using **"Next Section"**
3. On final section, **Click "Mark as Complete"**
4. Progress updates to 100%
5. Module moves to **"Completed"** tab
6. Stats update (Overall Progress, Completed count)

### **Flow 6: View Branch Visualization**
1. Go to **Team Collaboration**
2. **Click "View Learning Graph"** button (top right)
3. See visual representation of:
   - Main curriculum path (blue)
   - All branches (purple, connecting to sources)
   - Pulled/merged modules (green)
4. **Use dropdown** to filter by team member
5. **Hover nodes** to see details

---

## 🎯 **KEY INTERACTIVE ELEMENTS SUMMARY**

| **Feature** | **Where to Click** | **What Happens** |
|------------|-------------------|------------------|
| **Login** | Landing page → "Employee Login" | Enters dashboard |
| **Generate AI Plan** | Dashboard → "Generate Plan" button | Opens AI dialog |
| **View Module** | Any module card/image | Opens Module Player |
| **Start Learning** | Module card → "Start/Continue" | Opens Module Player |
| **Branch Module** | Team Collaboration → "Branch" button | Creates new branch |
| **Pull Branch** | Browse Branches → "Pull to My Path" | Adds copy to path |
| **Chat on Module** | Team Modules → Message icon | Opens shared chat |
| **Search Modules** | Dashboard → Search bar | Filters + shows results |
| **Add Module** | Search results → "Add to My Path" | Adds to pathway |
| **View Graph** | Team Collaboration → "View Learning Graph" | Shows branch visualization |
| **Remove Module** | Module card → "Remove" button | Removes from path |
| **Mark Complete** | Module Player → "Mark as Complete" | Sets 100% progress |
| **Reset Completed** | Dashboard bottom → "Reset Completed" | Moves completed back to 80% |

---

## 🏗️ **ARCHITECTURE FLOW**

```
Landing Page
    ↓ (Login)
Employee Dashboard (My Learning)
    ├─→ Module Player (via card click)
    ├─→ Search Results (via search bar)
    └─→ AI Generator Dialog (via Generate Plan)

Team Collaboration
    ├─→ Module Player (via View button)
    ├─→ Branch Creation (via Branch button)
    ├─→ Pull Module (via Pull button)
    ├─→ Module Chat (via Message icon)
    ├─→ Learning Graph (via View Graph button)
    └─→ Team Chat (via Team Chat tab)

Module Player
    └─→ Back to Dashboard/Collaboration

Learning Graph
    └─→ Back to Collaboration
```

---

## 💡 **USER EXPERIENCE HIGHLIGHTS**

1. **Netflix-style Carousels** → Horizontal scrolling, responsive card layouts
2. **Real-time Search** → Instant filtering as you type
3. **GitHub-style Branching** → Visual branching with pull/merge
4. **Shared Chat Rooms** → Users learning same module can chat together
5. **Visual Graph** → Interactive visualization of learning pathways
6. **Personalized Recommendations** → AI-suggested modules based on user profile
7. **Progress Tracking** → Visual progress bars, completion badges
8. **Mobile Responsive** → Works on all screen sizes

---

## 🔄 **Data Persistence**

All user data stored in **localStorage**:
- User's learning path modules
- Branch metadata
- Chat room messages
- Module progress
- User-generated branches

This means everything persists across sessions but is browser-specific.

