import { GraduationCap, Users, TrendingUp, Smartphone, Sparkles, Shield, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { UserRole } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI-Powered Learning Platform</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl">
                Transform Your Team's Learning Experience
              </h1>
              
              <p className="text-xl text-blue-100">
                Personalized learning paths, collaborative team development, and intelligent progress tracking - all in one enterprise-grade platform.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => onLogin('employee')}
                  className="bg-white text-blue-700 hover:bg-blue-50"
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Employee Login
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => onLogin('manager')}
                  className="border-white text-white hover:bg-white/10"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Manager Login
                </Button>
              </div>
              
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl">500+</div>
                  <div className="text-blue-200 text-sm">Companies</div>
                </div>
                <div>
                  <div className="text-3xl">50K+</div>
                  <div className="text-blue-200 text-sm">Active Learners</div>
                </div>
                <div>
                  <div className="text-3xl">95%</div>
                  <div className="text-blue-200 text-sm">Completion Rate</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1563457012475-13cf086fd600?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBsZWFybmluZ3xlbnwxfHx8fDE3NjE3OTI2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Team learning together"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Everything Your Team Needs to Grow</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A comprehensive learning platform designed for modern enterprises
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl">Personalized Learning Paths</h3>
              <p className="text-slate-600">
                AI-powered customization based on role, skills, and career goals. Choose from videos, podcasts, or documents.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl">GitHub-Style Collaboration</h3>
              <p className="text-slate-600">
                Branch, merge, and comment on learning modules. Share insights and learn together as a team.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl">Advanced Analytics</h3>
              <p className="text-slate-600">
                Track progress, completion rates, and team performance with comprehensive dashboards.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl">Mobile-First Design</h3>
              <p className="text-slate-600">
                Learn on-the-go with our fully responsive mobile experience. Resume anywhere, anytime.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl">Compliance Tracking</h3>
              <p className="text-slate-600">
                Enforce mandatory training modules and track completion for regulatory requirements.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl">AI Module Generation</h3>
              <p className="text-slate-600">
                Generate customized learning modules with AI based on specific topics and skill requirements.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl lg:text-4xl mb-4">Ready to Transform Your Team's Learning?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies using our platform to upskill their workforce
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => onLogin('employee')}
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              Start Learning Today
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => onLogin('manager')}
              className="border-white text-white hover:bg-white/10"
            >
              View Manager Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
