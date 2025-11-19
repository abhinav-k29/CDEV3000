import { useState, useEffect } from 'react';
import { GraduationCap, LayoutDashboard, Users, BarChart3, LogOut, Moon, Sun, Trophy, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User } from '../App';
import { SeniorityBadge } from './SeniorityBadge';

interface NavbarProps {
  user: User;
  currentView: string;
  onNavigate: (view: 'dashboard' | 'collaboration' | 'manager' | 'leaderboard') => void;
  onLogout: () => void;
}

export function Navbar({ user, currentView, onNavigate, onLogout }: NavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is already set
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl">LearnHub</span>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user.role === 'employee' && (
              <>
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('dashboard')}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  My Learning
                </Button>
                <Button
                  variant={currentView === 'collaboration' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('collaboration')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Team Collaboration
                </Button>
                <Button
                  variant={currentView === 'leaderboard' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('leaderboard')}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </Button>
              </>
            )}
            
            {user.role === 'manager' && (
              <Button
                variant={currentView === 'manager' ? 'default' : 'ghost'}
                onClick={() => onNavigate('manager')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.position}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm">{user.name}</span>
                        {user.yearsAtCompany && (
                          <SeniorityBadge years={user.yearsAtCompany} variant="inline" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{user.position}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Navigation Items */}
                {user.role === 'employee' && (
                  <>
                    <DropdownMenuItem onClick={() => onNavigate('dashboard')}>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      My Learning
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('collaboration')}>
                      <Users className="w-4 h-4 mr-2" />
                      Team Collaboration
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('leaderboard')}>
                      <Trophy className="w-4 h-4 mr-2" />
                      Leaderboard
                    </DropdownMenuItem>
                  </>
                )}
                {user.role === 'manager' && (
                  <DropdownMenuItem onClick={() => onNavigate('manager')}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={toggleDarkMode}>
                  {isDarkMode ? (
                    <>
                      <Sun className="w-4 h-4 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 mr-2" />
                      Dark Mode
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}