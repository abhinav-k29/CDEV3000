import { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, Sparkles, TrendingUp, Play, FileText, Headphones, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, LearningModule } from '../App';
import { mockModules } from './mockData';
import { GenerateModuleDialog } from './GenerateModuleDialog';
import { RatingDisplay } from './RatingDisplay';

interface EmployeeDashboardProps {
  user: User;
  onPlayModule: (module: LearningModule) => void;
  onViewLeaderboard: () => void;
}

export function EmployeeDashboard({ user, onPlayModule, onViewLeaderboard }: EmployeeDashboardProps) {
  const [modules] = useState<LearningModule[]>(mockModules);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  const completedModules = modules.filter(m => m.progress === 100).length;
  const inProgressModules = modules.filter(m => m.progress > 0 && m.progress < 100).length;
  const mandatoryModules = modules.filter(m => m.mandatory);
  const totalProgress = Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'podcast': return <Headphones className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
        <p className="text-slate-600">Continue your learning journey or explore new courses</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
          onClick={onViewLeaderboard}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Overall Progress</div>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl mb-2">{totalProgress}%</div>
            <Progress value={totalProgress} className="h-2" />
            <div className="text-xs text-blue-600 mt-2">Click to view leaderboard →</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Completed</div>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl">{completedModules}</div>
            <div className="text-sm text-slate-500">of {modules.length} modules</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">In Progress</div>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl">{inProgressModules}</div>
            <div className="text-sm text-slate-500">active courses</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Mandatory</div>
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl">{mandatoryModules.filter(m => m.progress < 100).length}</div>
            <div className="text-sm text-slate-500">required courses</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Generate Module */}
      <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl mb-1">AI-Powered Learning Plan Generator</h3>
                <p className="text-slate-600">
                  Get a personalized learning plan curated from your company's module database based on your goals
                </p>
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={() => setIsGenerateOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Modules */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Courses ({modules.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressModules})</TabsTrigger>
          <TabsTrigger value="mandatory">Mandatory ({mandatoryModules.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedModules})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {modules.map(module => (
              <ModuleCard 
                key={module.id} 
                module={module} 
                onPlay={onPlayModule}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {modules.filter(m => m.progress > 0 && m.progress < 100).map(module => (
              <ModuleCard 
                key={module.id} 
                module={module} 
                onPlay={onPlayModule}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mandatory" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {mandatoryModules.map(module => (
              <ModuleCard 
                key={module.id} 
                module={module} 
                onPlay={onPlayModule}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {modules.filter(m => m.progress === 100).map(module => (
              <ModuleCard 
                key={module.id} 
                module={module} 
                onPlay={onPlayModule}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <GenerateModuleDialog 
        open={isGenerateOpen}
        onOpenChange={setIsGenerateOpen}
      />
    </div>
  );
}

interface ModuleCardProps {
  module: LearningModule;
  onPlay: (module: LearningModule) => void;
  getTypeIcon: (type: string) => React.ReactNode;
}

function ModuleCard({ module, onPlay, getTypeIcon }: ModuleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden bg-slate-100">
        {module.thumbnail ? (
          <img 
            src={module.thumbnail} 
            alt={module.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            {getTypeIcon(module.type)}
          </div>
        )}
        {module.mandatory && (
          <Badge className="absolute top-2 right-2 bg-red-600">
            Required
          </Badge>
        )}
        {module.progress === 100 && (
          <div className="absolute top-2 left-2 bg-green-600 text-white rounded-full p-1">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-xl">{module.title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1 flex-shrink-0">
            {getTypeIcon(module.type)}
            <span className="capitalize">{module.type}</span>
          </Badge>
        </div>
        <CardDescription>{module.description}</CardDescription>
        {module.rating && (
          <div className="mt-2">
            <RatingDisplay rating={module.rating} totalRatings={module.totalRatings} />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {module.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {module.duration} min
            </div>
            <Badge 
              variant="outline"
              className={
                module.difficulty === 'beginner' ? 'text-green-600 border-green-600' :
                module.difficulty === 'intermediate' ? 'text-orange-600 border-orange-600' :
                'text-red-600 border-red-600'
              }
            >
              {module.difficulty}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Progress</span>
            <span>{module.progress}%</span>
          </div>
          <Progress value={module.progress} className="h-2" />
        </div>

        <Button 
          className="w-full" 
          onClick={() => onPlay(module)}
          variant={module.progress === 0 ? 'default' : 'outline'}
        >
          <Play className="w-4 h-4 mr-2" />
          {module.progress === 0 ? 'Start Course' : 
           module.progress === 100 ? 'Review' : 'Continue'}
        </Button>
      </CardContent>
    </Card>
  );
}