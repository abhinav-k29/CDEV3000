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
import { RatingDisplay } from './RatingDisplay';

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
  };

  const toggleContentType = (type: string) => {
    setPreferredTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const suggestedModules = [
    { title: 'React Advanced Patterns', duration: 45, type: 'video', match: 95, rating: 4.7, totalRatings: 128 },
    { title: 'TypeScript Mastery', duration: 120, type: 'video', match: 92, rating: 4.9, totalRatings: 163 },
    { title: 'Microservices Architecture Deep Dive', duration: 60, type: 'podcast', match: 88, rating: 4.5, totalRatings: 94 },
    { title: 'Leadership Fundamentals', duration: 90, type: 'video', match: 85, rating: 4.8, totalRatings: 215 },
    { title: 'Cloud Architecture with AWS', duration: 180, type: 'video', match: 82, rating: 4.6, totalRatings: 201 },
  ];

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
                Recommended Modules (in order)
              </h4>
              <div className="space-y-2">
                {suggestedModules.map((module, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{module.title}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{module.duration} min • {module.type}</span>
                        <span>•</span>
                        <RatingDisplay rating={module.rating} totalRatings={module.totalRatings} size="sm" />
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
                onClick={handleClose}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Add to My Learning Path
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