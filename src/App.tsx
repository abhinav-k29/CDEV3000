import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';
import { TeamCollaboration } from './components/TeamCollaboration';
import { ModulePlayer } from './components/ModulePlayer';
import { Navbar } from './components/Navbar';

export type UserRole = 'employee' | 'manager' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  position: string;
  avatar?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'podcast' | 'document' | 'interactive';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  mandatory: boolean;
  progress: number; // 0-100
  thumbnail?: string;
  tags: string[];
  createdBy?: string;
  isBranched?: boolean;
  parentModule?: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'collaboration' | 'manager' | 'player'>('landing');
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);

  // Initialize dark mode on mount
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogin = (role: UserRole) => {
    // Mock login
    const mockUser: User = {
      id: role === 'manager' ? 'mgr-001' : 'emp-001',
      name: role === 'manager' ? 'Sarah Johnson' : 'Alex Rivera',
      email: role === 'manager' ? 'sarah.johnson@company.com' : 'alex.rivera@company.com',
      role: role!,
      department: 'Product Development',
      position: role === 'manager' ? 'Engineering Manager' : 'Senior Software Engineer',
      avatar: role === 'manager' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    };
    setCurrentUser(mockUser);
    setCurrentView(role === 'manager' ? 'manager' : 'dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    setSelectedModule(null);
  };

  const handlePlayModule = (module: LearningModule) => {
    setSelectedModule(module);
    setCurrentView('player');
  };

  const handleBackToDashboard = () => {
    setCurrentView(currentUser?.role === 'manager' ? 'manager' : 'dashboard');
    setSelectedModule(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {currentUser && (
        <Navbar 
          user={currentUser} 
          currentView={currentView}
          onNavigate={setCurrentView}
          onLogout={handleLogout}
        />
      )}
      
      {currentView === 'landing' && (
        <LandingPage onLogin={handleLogin} />
      )}
      
      {currentView === 'dashboard' && currentUser && (
        <EmployeeDashboard 
          user={currentUser} 
          onPlayModule={handlePlayModule}
        />
      )}
      
      {currentView === 'collaboration' && currentUser && (
        <TeamCollaboration 
          user={currentUser}
          onPlayModule={handlePlayModule}
        />
      )}
      
      {currentView === 'manager' && currentUser && (
        <ManagerDashboard user={currentUser} />
      )}
      
      {currentView === 'player' && selectedModule && (
        <ModulePlayer 
          module={selectedModule}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
