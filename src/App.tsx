import { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './components/LandingPage';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';
import { TeamCollaboration } from './components/TeamCollaboration';
import { ModulePlayer } from './components/ModulePlayer';
import { Navbar } from './components/Navbar';
import { mockModules, teamModules } from './components/mockData';
import { loadUserModules } from './storage';

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
  popularityScore?: number;
  recommendedFor?: string[];
  // Branch-related properties
  branchId?: string; // Unique branch identifier
  branchOwnerId?: string; // User who created this branch
  branchName?: string; // Auto-generated branch name (e.g., "alex-react-patterns-v2")
  sourceModuleId?: string; // Original module ID this was branched from
  isPublic?: boolean; // Visibility (default: true - all branches visible)
  pulledFrom?: string; // Branch ID this module was pulled from (for tracking)
  chatRoomId?: string; // Shared chat room for all users with same sourceModuleId
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

  const findModuleById = useCallback((id: string): LearningModule | null => {
    const personal = loadUserModules() ?? [];
    const all = [...personal, ...mockModules, ...teamModules];
    const seen = new Set<string>();
    for (const m of all) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      if (m.id === id) return m;
    }
    return null;
  }, []);

  // Hydrate view from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as typeof currentView | null;
    const moduleId = params.get('module');

    // Only honor non-landing views if a user is present; otherwise default to landing
    if (viewParam === 'landing' || !viewParam) {
      setCurrentView('landing');
    } else if (currentUser) {
      setCurrentView(viewParam);
      if (viewParam === 'player' && moduleId) {
        const module = findModuleById(moduleId);
        if (module) setSelectedModule(module);
      }
    } else {
      setCurrentView('landing');
      setSelectedModule(null);
    }

    const onPopState = () => {
      const ps = new URLSearchParams(window.location.search);
      const v = ps.get('view') as typeof currentView | null;
      const mid = ps.get('module');
      if (v) {
        setCurrentView(v);
      } else {
        setCurrentView('landing');
      }
      if (v === 'player' && mid) {
        const m = findModuleById(mid);
        setSelectedModule(m || null);
      } else {
        setSelectedModule(null);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [currentUser, findModuleById]);

  const pushView = (view: typeof currentView, mod?: LearningModule | null) => {
    const params = new URLSearchParams();
    params.set('view', view);
    if (view === 'player' && mod) {
      params.set('module', mod.id);
    }
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', url);
  };

  const handleLogin = (role: UserRole) => {
    // Default login (Alex Rivera for employee, Sarah Johnson for manager)
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
    const nextView = role === 'manager' ? 'manager' : 'dashboard';
    setCurrentView(nextView);
    pushView(nextView);
  };
  

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    pushView('landing');
    setSelectedModule(null);
  };

  const handlePlayModule = (module: LearningModule) => {
    setSelectedModule(module);
    setCurrentView('player');
    pushView('player', module);
  };

  const handleBackToDashboard = () => {
    const nextView = currentUser?.role === 'manager' ? 'manager' : 'dashboard';
    setCurrentView(nextView);
    pushView(nextView);
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
          user={currentUser || undefined}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
