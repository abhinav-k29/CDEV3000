import { useState } from 'react';
import { GitBranch, GitMerge, MessageSquare, Users, Star, Eye, Play, User as UserIcon, Send, Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { User, LearningModule } from '../App';
import { teamModules, teamMembers } from './mockData';
import { LearningPathGraph } from './LearningPathGraph';
import { SeniorityBadge } from './SeniorityBadge';

interface TeamCollaborationProps {
  user: User;
  onPlayModule: (module: LearningModule) => void;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
  userYearsAtCompany?: number;
}

export function TeamCollaboration({ user, onPlayModule }: TeamCollaborationProps) {
  const [modules] = useState<LearningModule[]>(teamModules);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [newComment, setNewComment] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      userId: 'emp-002',
      userName: 'Maria Garcia',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      message: 'Hey team! Just finished the React Advanced Patterns module. Really insightful!',
      timestamp: new Date('2024-10-29T09:30:00'),
      userYearsAtCompany: 2,
    },
    {
      id: 'msg-2',
      userId: 'emp-003',
      userName: 'James Chen',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      message: 'Nice! Did you get to the custom hooks section? That part was really helpful for our current project.',
      timestamp: new Date('2024-10-29T09:45:00'),
      userYearsAtCompany: 4,
    },
    {
      id: 'msg-3',
      userId: 'emp-002',
      userName: 'Maria Garcia',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      message: 'Yes! I actually created a branch of that module with some additional examples from our codebase.',
      timestamp: new Date('2024-10-29T10:00:00'),
      userYearsAtCompany: 2,
    },
    {
      id: 'msg-4',
      userId: 'emp-004',
      userName: 'Sarah Kim',
      userAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
      message: 'That sounds great! Can you share that branch? Would love to check it out.',
      timestamp: new Date('2024-10-29T10:15:00'),
      userYearsAtCompany: 5,
    },
    {
      id: 'msg-5',
      userId: 'emp-001',
      userName: 'Alex Rivera',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      message: 'Starting the Microservices Architecture module today. Anyone want to pair up for the exercises?',
      timestamp: new Date('2024-10-30T08:00:00'),
      userYearsAtCompany: 3,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showGraph, setShowGraph] = useState(false);

  const handleBranch = (module: LearningModule) => {
    alert(`Creating a branch of "${module.title}" to customize for your learning path...`);
  };

  const handleMerge = (module: LearningModule) => {
    alert(`Merging "${module.title}" into your learning path...`);
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedModule) {
      alert(`Comment added: "${newComment}"`);
      setNewComment('');
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        message: newMessage,
        timestamp: new Date(),
        userYearsAtCompany: user.yearsAtCompany,
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (showGraph) {
    return (
      <LearningPathGraph 
        user={user}
        onClose={() => setShowGraph(false)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Team Collaboration</h1>
          <p className="text-slate-600">Share learning modules, collaborate with teammates, and learn together</p>
        </div>
        <Button 
          onClick={() => setShowGraph(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Network className="w-4 h-4 mr-2" />
          View Learning Graph
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="team-modules">
            <TabsList>
              <TabsTrigger value="team-modules">Team Modules</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="chat">Team Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="team-modules" className="space-y-4 mt-6">
              {modules.map(module => (
                <Card key={module.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {module.isBranched && (
                            <Badge variant="outline" className="text-purple-600 border-purple-600">
                              <GitBranch className="w-3 h-3 mr-1" />
                              Branched
                            </Badge>
                          )}
                          <Badge variant="secondary">{module.category}</Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                        
                        {module.createdBy && (
                          <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                            <UserIcon className="w-4 h-4" />
                            Created by {teamMembers.find(m => m.id === module.createdBy)?.name}
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedModule(selectedModule?.id === module.id ? null : module)}
                      >
                        <MessageSquare className="w-5 h-5" />
                        {module.comments && module.comments.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {module.comments.length}
                          </span>
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {module.tags.map(tag => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        24 views
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        12 stars
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {module.comments?.length || 0} comments
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleBranch(module)}
                      >
                        <GitBranch className="w-4 h-4 mr-2" />
                        Branch
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleMerge(module)}
                      >
                        <GitMerge className="w-4 h-4 mr-2" />
                        Merge to My Path
                      </Button>
                      <Button
                        onClick={() => onPlayModule(module)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>

                    {/* Comments Section */}
                    {selectedModule?.id === module.id && (
                      <div className="border-t pt-4 space-y-4">
                        <h4 className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Discussion
                        </h4>

                        {module.comments && module.comments.length > 0 ? (
                          <div className="space-y-3">
                            {module.comments.map(comment => (
                              <div key={comment.id} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                  <AvatarFallback>{comment.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm">{comment.userName}</span>
                                    <span className="text-xs text-slate-500">
                                      {new Date(comment.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-700">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
                        )}

                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={2}
                          />
                          <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                            Comment
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <ActivityItem
                      icon={<GitBranch className="w-4 h-4 text-purple-600" />}
                      user="Maria Garcia"
                      action="branched"
                      target="React Advanced Patterns"
                      time="2 hours ago"
                    />
                    <ActivityItem
                      icon={<MessageSquare className="w-4 h-4 text-blue-600" />}
                      user="James Chen"
                      action="commented on"
                      target="React Advanced Patterns"
                      time="5 hours ago"
                    />
                    <ActivityItem
                      icon={<GitMerge className="w-4 h-4 text-green-600" />}
                      user="Sarah Kim"
                      action="merged"
                      target="Microservices Testing Strategies"
                      time="1 day ago"
                    />
                    <ActivityItem
                      icon={<Star className="w-4 h-4 text-yellow-600" />}
                      user="David Johnson"
                      action="starred"
                      target="Design Systems & Component Libraries"
                      time="1 day ago"
                    />
                    <ActivityItem
                      icon={<GitBranch className="w-4 h-4 text-purple-600" />}
                      user="Alex Rivera"
                      action="created"
                      target="TypeScript Best Practices"
                      time="2 days ago"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4 mt-6">
              <Card className="flex flex-col h-[600px]">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Team Chat
                  </CardTitle>
                  <CardDescription>
                    Discuss learning paths, share insights, and ask questions
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatMessages.map((msg) => {
                    const isCurrentUser = msg.userId === user.id;
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src={msg.userAvatar} alt={msg.userName} />
                          <AvatarFallback>
                            {msg.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                          <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? 'justify-end' : ''}`}>
                            <span className={`text-sm ${isCurrentUser ? 'order-2' : ''}`}>
                              {isCurrentUser ? 'You' : msg.userName}
                            </span>
                            {!isCurrentUser && msg.userYearsAtCompany && (
                              <SeniorityBadge years={msg.userYearsAtCompany} variant="inline" />
                            )}
                            <span className="text-xs text-slate-500">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div 
                            className={`inline-block px-4 py-2 rounded-lg max-w-md ${
                              isCurrentUser 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-slate-100 text-slate-900'
                            }`}
                          >
                            <p className="text-sm break-words">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>

                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm truncate">{member.name}</span>
                      {member.yearsAtCompany && (
                        <SeniorityBadge years={member.yearsAtCompany} variant="inline" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{member.position}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm">{member.completionRate}%</div>
                    <div className="text-xs text-slate-500">{member.activeModules} active</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Team Modules</span>
                <span>{modules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Total Branches</span>
                <span>{modules.filter(m => m.isBranched).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Active Members</span>
                <span>{teamMembers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Avg. Completion</span>
                <span>{Math.round(teamMembers.reduce((acc, m) => acc + m.completionRate, 0) / teamMembers.length)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  icon: React.ReactNode;
  user: string;
  action: string;
  target: string;
  time: string;
}

function ActivityItem({ icon, user, action, target, time }: ActivityItemProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span>{user}</span>
          <span className="text-slate-600"> {action} </span>
          <span>{target}</span>
        </p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
}