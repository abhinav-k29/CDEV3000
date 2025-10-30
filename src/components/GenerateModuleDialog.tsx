import { useState } from 'react';
import { Sparkles, Loader2, BookOpen, Target, Lightbulb } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { addModuleToUserPath } from '../storage';
import { mockModules } from './mockData';

interface GenerateModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateModuleDialog({ open, onOpenChange }: GenerateModuleDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [learningGoal, setLearningGoal] = useState('');
  const [timeframe, setTimeframe] = useState('4-weeks');
  const [preferredTypes, setPreferredTypes] = useState<string[]>(['video']);
  const [difficulty, setDifficulty] = useState('intermediate');
  const [selectedTitles, setSelectedTitles] = useState<Set<string>>(new Set());

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
    }, 3000);
  };

  const handleClose = () => {
    setShowResults(false);
    onOpenChange(false);
    // Reset form
    setLearningGoal('');
    setTimeframe('4-weeks');
    setPreferredTypes(['video']);
    setDifficulty('intermediate');
    setSelectedTitles(new Set());
  };

  const toggleContentType = (type: string) => {
    setPreferredTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const suggestedModules = [
    { title: 'React Advanced Patterns', duration: 45, type: 'video', match: 95 },
    { title: 'TypeScript Mastery', duration: 120, type: 'video', match: 92 },
    { title: 'Microservices Architecture Deep Dive', duration: 60, type: 'podcast', match: 88 },
    { title: 'Leadership Fundamentals', duration: 90, type: 'video', match: 85 },
    { title: 'Cloud Architecture with AWS', duration: 180, type: 'video', match: 82 },
  ];

  const toggleSelectSuggested = (title: string) => {
    setSelectedTitles(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title); else next.add(title);
      return next;
    });
  };

  const addSelectedToPath = () => {
    if (selectedTitles.size === 0) return handleClose();
    // Try map by title from mockModules; if missing, create minimal entries
    const byTitle = new Map(mockModules.map(m => [m.title, m] as const));
    suggestedModules.forEach(s => {
      if (!selectedTitles.has(s.title)) return;
      const found = byTitle.get(s.title);
      if (found) {
        addModuleToUserPath(found);
      } else {
        // Minimal LearningModule fallback
        addModuleToUserPath({
          id: `gen-${s.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,
          title: s.title,
          description: 'Added from generated learning plan',
          type: (s.type as any) || 'video',
          duration: s.duration,
          difficulty: (difficulty as any) || 'intermediate',
          category: 'Generated',
          mandatory: false,
          progress: 0,
          tags: [],
        } as any);
      }
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Generate AI-Powered Learning Plan
          </DialogTitle>
          <DialogDescription>
            AI will create a personalized learning path from your company's module database based on your goals and preferences
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Learning Goal
              </Label>
              <Textarea
                id="goal"
                placeholder="e.g., I want to become a full-stack developer with expertise in React and Node.js"
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger id="timeframe">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-weeks">2 Weeks</SelectItem>
                    <SelectItem value="4-weeks">4 Weeks</SelectItem>
                    <SelectItem value="8-weeks">8 Weeks</SelectItem>
                    <SelectItem value="12-weeks">12 Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Skill Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferred Content Types</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="video" 
                    checked={preferredTypes.includes('video')}
                    onCheckedChange={() => toggleContentType('video')}
                  />
                  <label htmlFor="video" className="text-sm cursor-pointer">
                    Video Courses
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="podcast" 
                    checked={preferredTypes.includes('podcast')}
                    onCheckedChange={() => toggleContentType('podcast')}
                  />
                  <label htmlFor="podcast" className="text-sm cursor-pointer">
                    Podcasts
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="document" 
                    checked={preferredTypes.includes('document')}
                    onCheckedChange={() => toggleContentType('document')}
                  />
                  <label htmlFor="document" className="text-sm cursor-pointer">
                    Documents
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="interactive" 
                    checked={preferredTypes.includes('interactive')}
                    onCheckedChange={() => toggleContentType('interactive')}
                  />
                  <label htmlFor="interactive" className="text-sm cursor-pointer">
                    Interactive
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <strong>How it works:</strong> AI analyzes your role, current skills, and goals to curate modules from your company's library that best match your learning path.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm mb-1">Learning Plan Generated!</h4>
                  <p className="text-sm text-slate-600">
                    Found {suggestedModules.length} modules from your company database that match your goals
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Recommended Modules (select the ones you want)
              </h4>
              <div className="space-y-2">
                {suggestedModules.map((module, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Checkbox 
                      checked={selectedTitles.has(module.title)} 
                      onCheckedChange={() => toggleSelectSuggested(module.title)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{module.title}</div>
                      <div className="text-xs text-slate-500">
                        {module.duration} min • {module.type}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-xs text-green-600">{module.match}% match</div>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600 rounded-full"
                          style={{ width: `${module.match}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={addSelectedToPath}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={selectedTitles.size === 0}
              >
                Add Selected to My Path
              </Button>
            </div>
          </div>
        )}

        {!showResults && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={!learningGoal.trim() || preferredTypes.length === 0 || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Plan
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
