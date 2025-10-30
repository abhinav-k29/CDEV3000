import { useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, Clock, FileText, Headphones, Video, BookOpen, MessageSquare, ThumbsUp, Reply } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LearningModule } from '../App';

interface ModulePlayerProps {
  module: LearningModule;
  onBack: () => void;
}

interface ModuleComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: string;
  comment: string;
  timestamp: Date;
  likes: number;
  isResolved?: boolean;
  replies?: ModuleComment[];
}

export function ModulePlayer({ module, onBack }: ModulePlayerProps) {
  const [currentProgress, setCurrentProgress] = useState(module.progress);
  const [currentSection, setCurrentSection] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const [moduleComments, setModuleComments] = useState<ModuleComment[]>([
    {
      id: 'c1',
      userId: 'emp-002',
      userName: 'Maria Garcia',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      userRole: 'Frontend Developer',
      comment: 'The section on custom hooks is really helpful! I was struggling with understanding when to use them vs regular functions. This cleared it up perfectly.',
      timestamp: new Date('2024-10-25T14:30:00'),
      likes: 12,
      isResolved: false,
      replies: [
        {
          id: 'c1-r1',
          userId: 'emp-003',
          userName: 'James Chen',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          userRole: 'Full Stack Developer',
          comment: 'Totally agree! I also recommend checking out the official React docs on hooks - they complement this module really well.',
          timestamp: new Date('2024-10-25T15:45:00'),
          likes: 5,
        },
      ],
    },
    {
      id: 'c2',
      userId: 'emp-004',
      userName: 'Sarah Kim',
      userAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
      userRole: 'Backend Engineer',
      comment: 'Quick question: At 23:45 in the video, the instructor mentions "memoization" - can someone explain this concept in simpler terms?',
      timestamp: new Date('2024-10-27T10:15:00'),
      likes: 8,
      isResolved: true,
      replies: [
        {
          id: 'c2-r1',
          userId: 'emp-005',
          userName: 'David Johnson',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          userRole: 'UI/UX Engineer',
          comment: 'Great question! Memoization is basically caching - React remembers the result of expensive calculations so it doesn\'t have to repeat them every time. Think of it like saving your work so you don\'t have to start from scratch.',
          timestamp: new Date('2024-10-27T11:00:00'),
          likes: 15,
        },
        {
          id: 'c2-r2',
          userId: 'emp-004',
          userName: 'Sarah Kim',
          userAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
          userRole: 'Backend Engineer',
          comment: 'That makes so much sense! Thanks David! ✅',
          timestamp: new Date('2024-10-27T11:30:00'),
          likes: 3,
        },
      ],
    },
    {
      id: 'c3',
      userId: 'emp-001',
      userName: 'Alex Rivera',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      userRole: 'Senior Software Engineer',
      comment: 'Pro tip: I\'ve found that combining this with the TypeScript module gives you even better type safety for your custom hooks. Highly recommend doing them back-to-back!',
      timestamp: new Date('2024-10-28T09:00:00'),
      likes: 20,
      isResolved: false,
    },
  ]);

  const sections = [
    { id: 1, title: 'Introduction', duration: 5, completed: currentProgress >= 20 },
    { id: 2, title: 'Core Concepts', duration: 15, completed: currentProgress >= 40 },
    { id: 3, title: 'Practical Examples', duration: 20, completed: currentProgress >= 70 },
    { id: 4, title: 'Advanced Techniques', duration: 10, completed: currentProgress >= 90 },
    { id: 5, title: 'Summary & Assessment', duration: 5, completed: currentProgress === 100 },
  ];

  const handleMarkComplete = () => {
    if (currentProgress < 100) {
      const newProgress = Math.min(100, currentProgress + 20);
      setCurrentProgress(newProgress);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: ModuleComment = {
        id: `c${Date.now()}`,
        userId: 'emp-001',
        userName: 'Alex Rivera',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        userRole: 'Senior Software Engineer',
        comment: newComment,
        timestamp: new Date(),
        likes: 0,
        isResolved: false,
        replies: [],
      };
      setModuleComments([comment, ...moduleComments]);
      setNewComment('');
    }
  };

  const handleAddReply = (commentId: string) => {
    if (replyText.trim()) {
      const reply: ModuleComment = {
        id: `r${Date.now()}`,
        userId: 'emp-001',
        userName: 'Alex Rivera',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        userRole: 'Senior Software Engineer',
        comment: replyText,
        timestamp: new Date(),
        likes: 0,
      };
      
      setModuleComments(moduleComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          };
        }
        return comment;
      }));
      
      setReplyText('');
      setReplyTo(null);
    }
  };

  const handleLike = (commentId: string) => {
    setModuleComments(moduleComments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      // Check replies
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId ? { ...reply, likes: reply.likes + 1 } : reply
          ),
        };
      }
      return comment;
    }));
  };

  const handleToggleResolved = (commentId: string) => {
    setModuleComments(moduleComments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, isResolved: !comment.isResolved };
      }
      return comment;
    }));
  };

  const getContentIcon = () => {
    switch (module.type) {
      case 'video': return <Video className="w-6 h-6" />;
      case 'podcast': return <Headphones className="w-6 h-6" />;
      case 'document': return <FileText className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                {module.duration} minutes
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
          
          <div className="mt-4">
            <h1 className="text-2xl mb-2">{module.title}</h1>
            <div className="flex items-center gap-3">
              <Progress value={currentProgress} className="flex-1 h-2" />
              <span className="text-sm">{currentProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Player */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
                  {module.type === 'video' && (
                    <div className="absolute inset-0">
                      {module.thumbnail && (
                        <img 
                          src={module.thumbnail} 
                          alt={module.title}
                          className="w-full h-full object-cover opacity-30"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white space-y-4">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                            <Video className="w-10 h-10" />
                          </div>
                          <p>Video Player</p>
                          <p className="text-sm text-slate-300">Section {currentSection + 1}: {sections[currentSection]?.title}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {module.type === 'podcast' && (
                    <div className="text-white text-center space-y-6 p-8">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                        <Headphones className="w-12 h-12" />
                      </div>
                      <div>
                        <h3 className="text-xl mb-2">Audio Player</h3>
                        <p className="text-slate-300">Section {currentSection + 1}: {sections[currentSection]?.title}</p>
                      </div>
                      <div className="w-full max-w-md mx-auto">
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {module.type === 'document' && (
                    <div className="text-white text-center space-y-4 p-8">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                        <FileText className="w-10 h-10" />
                      </div>
                      <p>Document Viewer</p>
                      <p className="text-sm text-slate-300">Page {currentSection + 1} of {sections.length}</p>
                    </div>
                  )}
                  
                  {module.type === 'interactive' && (
                    <div className="text-white text-center space-y-4 p-8">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                        <BookOpen className="w-10 h-10" />
                      </div>
                      <p>Interactive Module</p>
                      <p className="text-sm text-slate-300">Section {currentSection + 1}: {sections[currentSection]?.title}</p>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white border-t">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      disabled={currentSection === 0}
                      onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                    >
                      Previous Section
                    </Button>
                    
                    {currentSection < sections.length - 1 ? (
                      <Button
                        onClick={() => {
                          setCurrentSection(currentSection + 1);
                          handleMarkComplete();
                        }}
                      >
                        Next Section
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleMarkComplete}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={currentProgress === 100}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {currentProgress === 100 ? 'Completed' : 'Mark as Complete'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="comments">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Discussion ({moduleComments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg mb-2">About this module</h3>
                      <p className="text-slate-600">{module.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg mb-2">What you'll learn</h3>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Core concepts and fundamental principles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Practical examples and real-world applications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Advanced techniques and best practices</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Assessment to validate your understanding</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {module.tags.map(tag => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-slate-600 text-center py-8">
                      Your personal notes will appear here. Start taking notes while learning!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="mt-4">
                <Card>
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-lg mb-3">Additional Resources</h3>
                    <div className="space-y-2">
                      <a href="#" className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Course slides (PDF)</span>
                        </div>
                      </a>
                      <a href="#" className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Exercise files</span>
                        </div>
                      </a>
                      <a href="#" className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Further reading materials</span>
                        </div>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="mt-4">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg mb-2">Discussion & Questions</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Ask questions, share insights, and help your colleagues learn from this module
                      </p>
                      
                      {/* Add Comment */}
                      <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                        <Textarea
                          placeholder="Ask a question or share your thoughts about this module..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-6">
                      {moduleComments.map((comment) => (
                        <div key={comment.id} className="space-y-3">
                          <div className="flex gap-4">
                            <Avatar className="w-10 h-10 flex-shrink-0">
                              <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                              <AvatarFallback>
                                {comment.userName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span>{comment.userName}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {comment.userRole}
                                    </Badge>
                                    {comment.isResolved && (
                                      <Badge className="text-xs bg-green-600">
                                        ✓ Resolved
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {comment.timestamp.toLocaleString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-slate-700 mb-3">{comment.comment}</p>
                              
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleLike(comment.id)}
                                  className="h-8"
                                >
                                  <ThumbsUp className="w-4 h-4 mr-1" />
                                  {comment.likes > 0 && comment.likes}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                                  className="h-8"
                                >
                                  <Reply className="w-4 h-4 mr-1" />
                                  Reply
                                </Button>
                                {!comment.isResolved && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleToggleResolved(comment.id)}
                                    className="h-8 text-green-600"
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Mark Resolved
                                  </Button>
                                )}
                              </div>

                              {/* Reply Form */}
                              {replyTo === comment.id && (
                                <div className="mt-3 space-y-2">
                                  <Textarea
                                    placeholder="Write your reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    rows={2}
                                  />
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm"
                                      onClick={() => handleAddReply(comment.id)}
                                      disabled={!replyText.trim()}
                                    >
                                      Post Reply
                                    </Button>
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setReplyTo(null);
                                        setReplyText('');
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* Replies */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-4 space-y-4 pl-6 border-l-2 border-slate-200">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-3">
                                      <Avatar className="w-8 h-8 flex-shrink-0">
                                        <AvatarImage src={reply.userAvatar} alt={reply.userName} />
                                        <AvatarFallback>
                                          {reply.userName.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                      </Avatar>
                                      
                                      <div className="flex-1 min-w-0">
                                        <div className="mb-1">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm">{reply.userName}</span>
                                            <Badge variant="outline" className="text-xs">
                                              {reply.userRole}
                                            </Badge>
                                          </div>
                                          <div className="text-xs text-slate-500">
                                            {reply.timestamp.toLocaleString('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </div>
                                        </div>
                                        
                                        <p className="text-sm text-slate-700 mb-2">{reply.comment}</p>
                                        
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => handleLike(reply.id)}
                                          className="h-7 text-xs"
                                        >
                                          <ThumbsUp className="w-3 h-3 mr-1" />
                                          {reply.likes > 0 && reply.likes}
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {getContentIcon()}
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Content Type</div>
                    <div className="capitalize">{module.type}</div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration</span>
                    <span>{module.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Difficulty</span>
                    <span className="capitalize">{module.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Category</span>
                    <span>{module.category}</span>
                  </div>
                  {module.mandatory && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status</span>
                      <Badge className="bg-red-600">Required</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">Module Sections</h3>
                <div className="space-y-2">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentSection === index 
                          ? 'bg-blue-50 border-2 border-blue-500' 
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {section.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                              currentSection === index ? 'border-blue-600' : 'border-slate-300'
                            }`} />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm truncate">{section.title}</div>
                            <div className="text-xs text-slate-500">{section.duration} min</div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
