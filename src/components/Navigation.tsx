import { Link, useLocation } from 'react-router-dom';
import { Button } from "./ui/button";
import { GraduationCap, LayoutDashboard, Users, LogOut, BarChart3 } from "lucide-react";

interface NavigationProps {
  onLogout: () => void;
  userRole: 'employee' | 'manager';
}

export default function Navigation({ onLogout, userRole }: NavigationProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <span className="text-lg text-gray-900">LearnFlow</span>
            </Link>
            
            <div className="hidden md:flex gap-1">
              {userRole === 'employee' ? (
                <>
                  <Link to="/dashboard">
                    <Button 
                      variant={isActive('/dashboard') ? 'default' : 'ghost'}
                      className="gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      My Learning
                    </Button>
                  </Link>
                  <Link to="/collaboration">
                    <Button 
                      variant={isActive('/collaboration') ? 'default' : 'ghost'}
                      className="gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Team Collaboration
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/manager">
                  <Button 
                    variant={isActive('/manager') ? 'default' : 'ghost'}
                    className="gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Analytics Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-sm text-gray-600">
              {userRole === 'employee' ? 'Sarah Johnson' : 'Michael Chen (Manager)'}
            </div>
            <Button variant="outline" onClick={onLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
