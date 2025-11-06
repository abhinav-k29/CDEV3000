import { GraduationCap, LayoutDashboard, Users, BarChart3, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { User } from '../App';

interface NavbarProps {
  user: User;
  currentView: string;
  onNavigate: (view: 'dashboard' | 'collaboration' | 'manager') => void;
  onLogout: () => void;
}

export function Navbar({ user, currentView, onNavigate, onLogout }: NavbarProps) {
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo (click to go Home) */}
          <button
            type="button"
            onClick={onLogout}
            title="Home"
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl">LearnHub</span>
          </button>

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
                <div className="px-2 py-1.5">
                  <p className="text-sm">{user.email}</p>
                  <p className="text-xs text-slate-500">{user.department}</p>
                </div>
                <DropdownMenuSeparator />
                
                {/* Mobile Navigation */}
                <div className="md:hidden">
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
                    </>
                  )}
                  {user.role === 'manager' && (
                    <DropdownMenuItem onClick={() => onNavigate('manager')}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                </div>
                
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
