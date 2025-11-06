import { useState, useMemo } from 'react';
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
import { addModuleToUserPath, loadUserModules } from '../storage';
import { mockModules, teamModules } from './mockData';
import { LearningModule } from '../App';

interface GenerateModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModulesAdded?: () => void;
  userId?: string;
}

export function GenerateModuleDialog({ open, onOpenChange, onModulesAdded, userId }: GenerateModuleDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [learningGoal, setLearningGoal] = useState('');
  const [timeframe, setTimeframe] = useState('4-weeks');
  const [preferredTypes, setPreferredTypes] = useState<string[]>(['video']);
  const [difficulty, setDifficulty] = useState('intermediate');
  const [selectedTitles, setSelectedTitles] = useState<Set<string>>(new Set());

  const handleGenerate = () => {
    if (!learningGoal.trim()) return;
    
    // Reset selections when generating new plan
    setSelectedTitles(new Set());
    setIsGenerating(true);
    // Simulate AI generation with actual matching
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
    }, 1500); // Reduced time since we're doing real matching
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

  // Generate relevant module suggestions based on user input (memoized to keep IDs stable)
  const suggestedModulesData = useMemo(() => {
    if (!learningGoal.trim() || !showResults) return [];
    
    // Get all available modules
    const userModules = userId ? (loadUserModules(userId) ?? []) : [];
    const allModules = [...mockModules, ...teamModules, ...userModules];
    
    // Remove duplicates by ID
    const uniqueModules = Array.from(
      new Map(allModules.map(m => [m.id, m])).values()
    );
    
    // Extract keywords from learning goal (lowercase for matching)
    const goalLower = learningGoal.toLowerCase();
    const goalWords = goalLower
      .split(/\s+/)
      .filter(word => word.length > 2) // Filter out short words like "to", "the", etc.
      .filter(word => !['want', 'become', 'learn', 'learned', 'learning', 'get', 'need'].includes(word));
    
    // Score each module
    const scoredModules = uniqueModules.map(module => {
      let matchScore = 0;
      const maxScore = 100;
      
      // 1. Title matching (40 points)
      const titleLower = module.title.toLowerCase();
      const titleMatches = goalWords.filter(word => titleLower.includes(word)).length;
      matchScore += (titleMatches / Math.max(goalWords.length, 1)) * 40;
      
      // 2. Description matching (30 points)
      const descLower = module.description.toLowerCase();
      const descMatches = goalWords.filter(word => descLower.includes(word)).length;
      matchScore += (descMatches / Math.max(goalWords.length, 1)) * 30;
      
      // 3. Tag matching (20 points)
      const tagMatches = module.tags.filter(tag => 
        goalWords.some(word => tag.toLowerCase().includes(word) || word.includes(tag.toLowerCase()))
      ).length;
      matchScore += (tagMatches / Math.max(module.tags.length, 1)) * 20;
      
      // 4. Category matching (10 points)
      const categoryLower = module.category.toLowerCase();
      const categoryMatches = goalWords.filter(word => categoryLower.includes(word)).length;
      matchScore += (categoryMatches / Math.max(goalWords.length, 1)) * 10;
      
      // 5. Content type preference bonus/penalty (max 10 points)
      if (preferredTypes.includes(module.type)) {
        matchScore += 10;
      } else if (preferredTypes.length > 0) {
        matchScore -= 5; // Penalty for not matching preferred type
      }
      
      // 6. Difficulty matching bonus (5 points)
      if (difficulty === module.difficulty) {
        matchScore += 5;
      }
      
      // Ensure score is between 0 and 100
      matchScore = Math.max(0, Math.min(100, matchScore));
      
      // Additional boost for exact phrase matches
      if (titleLower.includes(goalLower) || descLower.includes(goalLower)) {
        matchScore = Math.min(100, matchScore + 15);
      }
      
      return { module, match: Math.round(matchScore) };
    });
    
    // Filter out modules with very low match scores (< 10) and sort by match score
    return scoredModules
      .filter(item => item.match >= 10)
      .sort((a, b) => b.match - a.match)
      .slice(0, 8); // Return top 8 matches
  }, [learningGoal, preferredTypes, difficulty, showResults]);

  const toggleSelectSuggested = (moduleId: string) => {
    setSelectedTitles(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId); else next.add(moduleId);
      return next;
    });
  };

  const addSelectedToPath = () => {
    if (selectedTitles.size === 0) {
      alert('Please select at least one module to add to your path.');
      return;
    }
    
    // Add selected modules to user path
    let addedCount = 0;
    const modulesToAdd: LearningModule[] = [];
    
    suggestedModulesData.forEach(item => {
      if (selectedTitles.has(item.module.id)) {
        // Ensure progress is 0 for newly added modules
        const moduleToAdd = { ...item.module, progress: item.module.progress || 0 };
        if (userId) {
          addModuleToUserPath(moduleToAdd, userId);
        }
        modulesToAdd.push(moduleToAdd);
        addedCount++;
      }
    });
    
    // Show success message first
    if (addedCount > 0) {
      alert(`Successfully added ${addedCount} ${addedCount === 1 ? 'module' : 'modules'} to your learning path!`);
      
      // Notify parent that modules were added (after a small delay to ensure storage is written)
      if (onModulesAdded) {
        setTimeout(() => {
          onModulesAdded();
        }, 100);
      }
    }
    
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
                    Found {suggestedModulesData.length} {suggestedModulesData.length === 1 ? 'module' : 'modules'} from your company database that match your goals
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
                {suggestedModulesData.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p className="text-sm mb-2">No matching modules found.</p>
                    <p className="text-xs">Try adjusting your learning goal or preferences.</p>
                  </div>
                ) : (
                  suggestedModulesData.map((item) => {
                    const { module, match } = item;
                    return (
                      <div 
                        key={module.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Checkbox 
                          checked={selectedTitles.has(module.id)} 
                          onCheckedChange={() => toggleSelectSuggested(module.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{module.title}</div>
                          <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {module.description}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">
                              {module.duration} min • {module.type} • {module.difficulty}
                            </span>
                            {module.category && (
                              <span className="text-xs text-blue-600">{module.category}</span>
                            )}
                          </div>
                          {module.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {module.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-xs px-1.5 py-0.5 bg-slate-100 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className="text-xs font-medium text-green-600">{match}% match</div>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-600 rounded-full transition-all"
                              style={{ width: `${match}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
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
