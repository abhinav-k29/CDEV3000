import { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, Sparkles, TrendingUp, Play, FileText, Headphones, Video, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { User, LearningModule } from '../App';
import { mockModules } from './mockData';
import { addModuleToUserPath, loadUserModules, removeModuleFromUserPath, resetCompletedToInProgress } from '../storage';
import { GenerateModuleDialog } from './GenerateModuleDialog';
import { HeroBanner } from './dashboard/HeroBanner';
import { CarouselSection } from './dashboard/CarouselSection';
import { TrendingPanel } from './dashboard/TrendingPanel';
import { BadgeBoard } from './dashboard/BadgeBoard';
import { recommendModules } from './dashboard/recommend';

interface EmployeeDashboardProps {
  user: User;
  onPlayModule: (module: LearningModule) => void;
}

export function EmployeeDashboard({ user, onPlayModule }: EmployeeDashboardProps) {
  const defaultIds = new Set(mockModules.map(m => m.id));
  const [modules, setModules] = useState<LearningModule[]>(() => {
    const stored = loadUserModules() ?? [];
    // Merge stored (user-added) modules with default mock modules, deduped by id
    const seen = new Set<string>();
    const merged = [...stored, ...mockModules].filter(m => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
    // Normalize problematic thumbnails to fixed crop to avoid tall carousels
    const needsCrop = new Set([
      'Design Systems & Component Libraries',
      'Leadership Fundamentals',
    ]);
    const normalizeThumb = (url?: string) => {
      if (!url) return url;
      if (url.includes('fit=crop')) return url;
      const hasQuery = url.includes('?');
      const suffix = `${hasQuery ? '&' : '?'}h=250&fit=crop&crop=entropy`;
      return url + suffix;
    };
    return merged.map(m => needsCrop.has(m.title) ? { ...m, thumbnail: normalizeThumb(m.thumbnail) } : m);
  });
  const handleRemove = (moduleId: string) => {
    // Only remove from user path (ignore defaults)
    if (defaultIds.has(moduleId)) return;
    removeModuleFromUserPath(moduleId);
    setModules(prev => prev.filter(m => m.id !== moduleId));
  };
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  const featured = modules.find(m => m.progress > 0 && m.progress < 100) || modules[0];
  const buckets = recommendModules(user, modules);
  const [query, setQuery] = useState('');
  const moduleIds = new Set(modules.map(m => m.id));
  const searchResults = query.trim().length > 1
    ? mockModules.filter(m =>
        !moduleIds.has(m.id) && (
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.description.toLowerCase().includes(query.toLowerCase()) ||
          m.category.toLowerCase().includes(query.toLowerCase())
        )
      )
    : [];

  const handleAddFromSearch = (m: LearningModule) => {
    addModuleToUserPath(m);
    setModules(prev => {
      if (prev.find(x => x.id === m.id)) return prev;
      return [...prev, m];
    });
    setQuery('');
  };

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
      {/* Hero */}
      {featured && (
        <div className="mb-8">
          <HeroBanner module={featured} onStart={onPlayModule} />
        </div>
      )}

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
        <p className="text-slate-600">Continue your learning journey or explore new courses</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Overall Progress</div>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl mb-2">{totalProgress}%</div>
            <Progress value={totalProgress} className="h-2" />
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

      {/* Netflix-style Carousels with right-side panels */}
      <div className="grid lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-8 space-y-6">
          <CarouselSection title="Recommended for You" modules={buckets.recommended} onOpen={onPlayModule} canRemove={(id) => !defaultIds.has(id)} onRemove={handleRemove} />
          <CarouselSection title="New & Noteworthy" modules={buckets.newAndNoteworthy} onOpen={onPlayModule} canRemove={(id) => !defaultIds.has(id)} onRemove={handleRemove} />
        </div>
        <div className="lg:col-span-4 space-y-6 hidden lg:block">
          <TrendingPanel modules={[...modules].sort((a,b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0)).slice(0, 10)} onOpen={onPlayModule} />
          <BadgeBoard />
        </div>
      </div>

      {/* Learning Modules (filtered) + Search */}
      <Tabs defaultValue="in-progress" className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="in-progress">In Progress ({inProgressModules})</TabsTrigger>
            <TabsTrigger value="mandatory">Mandatory ({mandatoryModules.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedModules})</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 w-full sm:w-80">
            <Input
              placeholder="Search catalog..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => {
                resetCompletedToInProgress();
                setModules(prev => prev.map(m => (m.progress === 100 ? { ...m, progress: 80 } : m)));
              }}
              title="Move all completed to in progress"
            >
              Reset Completed
            </Button>
          </div>
        </div>

        <TabsContent value="in-progress" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {modules.filter(m => m.progress > 0 && m.progress < 100).map(module => (
              <ModuleCard 
                key={module.id} 
                module={module} 
                onPlay={onPlayModule}
                canDelete={!defaultIds.has(module.id)}
                onDelete={handleRemove}
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
                canDelete={!defaultIds.has(module.id)}
                onDelete={handleRemove}
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
                canDelete={!defaultIds.has(module.id)}
                onDelete={handleRemove}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Search Results */}
      {query.trim().length > 1 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Search results</CardTitle>
            <CardDescription>Matching courses from the catalog</CardDescription>
          </CardHeader>
          <CardContent>
            {searchResults.length === 0 ? (
              <div className="text-sm text-slate-500">No matches found.</div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-4">
                {searchResults.map(m => (
                  <div key={m.id} className="flex items-center justify-between gap-3 border rounded-lg p-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{m.title}</div>
                      <div className="text-xs text-slate-500 truncate">{m.category}</div>
                    </div>
                    <Button size="sm" onClick={() => handleAddFromSearch(m)}>Add</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      

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
  onDelete: (id: string) => void;
  canDelete: boolean;
  getTypeIcon: (type: string) => React.ReactNode;
}

function ModuleCard({ module, onPlay, onDelete, canDelete, getTypeIcon }: ModuleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
        {module.thumbnail ? (
          <img 
            src={module.thumbnail} 
            alt={module.title}
            className="w-full h-full object-cover object-center"
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
        {canDelete && (
          <button
            onClick={() => onDelete(module.id)}
            className="absolute bottom-2 right-2 inline-flex items-center gap-1 text-xs px-2 py-1 bg-white/90 border rounded-md hover:bg-white"
            title="Remove from My Path"
          >
            <Trash2 className="w-3 h-3 text-red-600" />
            <span className="text-red-700">Remove</span>
          </button>
        )}
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-xl line-clamp-2">{module.title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1 flex-shrink-0">
            {getTypeIcon(module.type)}
            <span className="capitalize">{module.type}</span>
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{module.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {module.tags.slice(0, 2).map(tag => (
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
