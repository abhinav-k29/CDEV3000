# Learning Management System (LMS)

A modern, collaborative learning management system with GitHub-style branching for learning modules, team collaboration features, and AI-powered learning plan generation.

## 🚀 Key Features

### 1. **GitHub-Style Branching System**
- **Create Branches**: Create personalized branches of learning modules to customize content for your learning path
- **Pull Modules**: Pull modules from team members' branches into your personalized pathway
- **Merge Branches**: Merge branches back to the main learning path
- **Auto-Generated Branch Names**: Intelligent branch naming (e.g., `alex-react-patterns-v2`)
- **Branch Validation**: Prevents duplicate branches and pulling modules you already have

### 2. **Team Collaboration**
- **Browse Team Branches**: Explore and discover modules created by team members
- **Activity Feed**: Real-time activity tracking for branch operations (create, pull, merge)
- **Module-Based Chatrooms**: Dedicated chat rooms for each module where team members can discuss and collaborate
- **Team Dashboard**: View team members' learning progress and activities

### 3. **AI-Powered Learning Plan Generator**
- **Smart Recommendations**: AI-powered module suggestions based on:
  - Learning goals and objectives
  - Preferred content types (video, podcast, document, interactive)
  - Difficulty level (beginner, intermediate, advanced)
  - Timeframe preferences
- **Multi-Factor Scoring**: Intelligent scoring algorithm considers title, description, tags, category, content type, and difficulty
- **Selective Addition**: Choose from AI-suggested modules and add them directly to your personalized pathway

### 4. **Interactive Learning Path Graph**
- **Visual Network Graph**: Data-driven visualization of learning paths showing:
  - Main learning path modules
  - Branch connections (push operations)
  - Pull operations from team branches
  - Merge operations
- **Connection Types**: Distinct visual styles for different operation types:
  - Main path (solid lines)
  - Push operations (dashed blue lines)
  - Pull operations (dashed green lines with arrows)
  - Merge operations (dashed purple lines)
- **Interactive Exploration**: Hover over nodes to see module details and owner information

### 5. **Personalized Learning Dashboard**
- **My Learning Path**: Curated personalized pathway including:
  - Original modules with progress
  - User-added modules (from AI generator, search, pulls)
  - User's own branches
- **Progress Tracking**: 
  - Visual progress bars for each module
  - Status categories: Not Started, In Progress, Completed
  - Progress percentage tracking
- **Module Organization**: 
  - Tabbed interface (All, In Progress, Not Started, Completed)
  - Search functionality
  - Filter by category, type, and difficulty

### 6. **Module Player**
- **Multi-Format Support**: 
  - Video modules
  - Podcast modules
  - Document modules
  - Interactive modules
- **Progress Tracking**: Automatic progress updates as you complete modules
- **Activity Logging**: Automatically logs module completion activities

### 7. **Manager Dashboard**
- **Team Analytics**: Overview of team learning progress
- **Compliance Tracking**: Monitor mandatory training completion
- **Progress Metrics**: Visual charts and analytics for team performance
- **Employee Insights**: Individual and team-wide learning statistics

### 8. **Data Persistence**
- **LocalStorage-Based**: All user data stored locally in browser
- **User-Specific Storage**: Each user has their own learning pathway and branches
- **Demo Reset**: Reset demo functionality to clear all stored data and start fresh

### 9. **Modern UI/UX**
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Shadcn UI Components**: Beautiful, accessible UI components
- **Dark Mode Ready**: UI components support theme switching
- **Intuitive Navigation**: Clean, modern interface with clear navigation

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── HeroBanner.tsx
│   │   ├── CarouselSection.tsx
│   │   ├── TrendingPanel.tsx
│   │   ├── BadgeBoard.tsx
│   │   └── recommend.ts    # Recommendation algorithm
│   ├── figma/              # Figma-related components
│   │   └── ImageWithFallback.tsx
│   ├── ui/                 # Shadcn UI components
│   ├── EmployeeDashboard.tsx
│   ├── ManagerDashboard.tsx
│   ├── TeamCollaboration.tsx
│   ├── ModulePlayer.tsx
│   ├── LearningPathGraph.tsx
│   ├── GenerateModuleDialog.tsx
│   ├── LandingPage.tsx
│   ├── Navbar.tsx
│   └── mockData.ts         # Mock data for modules and team members
├── storage.ts              # LocalStorage management and branch operations
├── App.tsx                 # Main application component
└── main.tsx                # Application entry point
```

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn UI** - UI component library
- **Lucide React** - Icon library
- **Recharts** - Data visualization (Manager Dashboard)
- **LocalStorage** - Client-side data persistence

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version) - [Download here](https://nodejs.org)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CDEV3000
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```
   Preview will be available at `http://localhost:3000`

## 📖 Usage Guide

### For Employees

1. **Login**: Click "Login as Employee" on the landing page
2. **Explore Dashboard**: View your personalized learning pathway
3. **Generate Learning Plan**: 
   - Click "Generate Learning Plan" button
   - Enter your learning goals and preferences
   - Select suggested modules and add them to your path
4. **Team Collaboration**:
   - Navigate to "Team Collaboration"
   - Browse team members' branches
   - Pull modules from branches into your pathway
   - Create your own branches
   - Chat with team members about modules
5. **View Learning Path Graph**: Visualize your learning path and branch operations
6. **Complete Modules**: Click on modules to play and track progress

### For Managers

1. **Login**: Click "Login as Manager" on the landing page
2. **View Analytics**: Monitor team learning progress and compliance
3. **Track Metrics**: View charts and statistics for team performance

### Reset Demo

Click the "Reset Demo" button at the bottom of the Employee Dashboard to clear all stored data and reset the application to its initial state.

## 🔧 Key Technical Concepts

### Branch Operations
- **Create Branch**: Creates a personalized copy of a module with auto-generated branch name
- **Pull**: Adds a module from another user's branch to your pathway
- **Merge**: Merges a branch back to the main path (visualized in graph)

### Storage System
- User-specific localStorage keys: `userModules-${userId}`
- Shared chat rooms and activities across all users
- Branch metadata stored separately for team visibility

### Recommendation Algorithm
- Multi-factor scoring based on:
  - Title and description matching
  - Tag relevance
  - Category alignment
  - Content type preference
  - Difficulty matching

## 📝 License

This project uses components from:
- [shadcn/ui](https://ui.shadcn.com/) - MIT License
- [Unsplash](https://unsplash.com) - Unsplash License

## 🤝 Contributing

This is a demo project. For contributions, please follow standard Git workflow:
1. Create a feature branch
2. Make your changes
3. Commit and push to your branch
4. Create a pull request

## 📧 Support

For issues or questions, please refer to the project repository or contact the development team.

---

**Built with ❤️ for collaborative learning**
