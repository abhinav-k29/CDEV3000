import { useState, useEffect } from 'react';
import { GitBranch, GitMerge, MessageSquare, Users, Star, Eye, Play, User as UserIcon, Send, Network, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { User, LearningModule } from '../App';
import { teamModules, teamMembers } from './mockData';
import { addModuleToUserPath, pullFromBranch, createBranch, getTeamBranches, getUserBranches, getChatRoomMessages, addChatMessage, ChatMessage as StorageChatMessage, getActivities, logPullActivity, logActivity, ActivityItem } from '../storage';
import { LearningPathGraph } from './LearningPathGraph';
import { mockModules } from './mockData';

interface TeamCollaborationProps {
  user: User;
  onPlayModule: (module: LearningModule) => void;
}

// Using ChatMessage from storage.ts - keeping interface for compatibility

export function TeamCollaboration({ user, onPlayModule }: TeamCollaborationProps) {
  const [modules, setModules] = useState<LearningModule[]>(() => [...teamModules, ...mockModules]);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [newComment, setNewComment] = useState('');
  const [teamBranches, setTeamBranches] = useState<LearningModule[]>(() => getTeamBranches(user.id));
  const [userBranches, setUserBranches] = useState<LearningModule[]>(() => getUserBranches(user.id));
  const [selectedBranch, setSelectedBranch] = useState<LearningModule | null>(null);
  const [moduleChatMessages, setModuleChatMessages] = useState<Record<string, StorageChatMessage[]>>({});
  const [newChatMessage, setNewChatMessage] = useState('');
  const [activities, setActivities] = useState<ActivityItem[]>(() => getActivities(20));
  const [chatMessages, setChatMessages] = useState<StorageChatMessage[]>([
    {
      id: 'msg-1',
      userId: 'emp-002',
      userName: 'Maria Garcia',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      message: 'Hey team! Just finished the React Advanced Patterns module. Really insightful!',
      timestamp: new Date('2024-10-29T09:30:00'),
    },
    {
      id: 'msg-2',
      userId: 'emp-003',
      userName: 'James Chen',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      message: 'Nice! Did you get to the custom hooks section? That part was really helpful for our current project.',
      timestamp: new Date('2024-10-29T09:45:00'),
    },
    {
      id: 'msg-3',
      userId: 'emp-002',
      userName: 'Maria Garcia',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      message: 'Yes! I actually created a branch of that module with some additional examples from our codebase.',
      timestamp: new Date('2024-10-29T10:00:00'),
    },
    {
      id: 'msg-4',
      userId: 'emp-004',
      userName: 'Sarah Kim',
      userAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
      message: 'That sounds great! Can you share that branch? Would love to check it out.',
      timestamp: new Date('2024-10-29T10:15:00'),
    },
    {
      id: 'msg-5',
      userId: 'emp-001',
      userName: 'Alex Rivera',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      message: 'Starting the Microservices Architecture module today. Anyone want to pair up for the exercises?',
      timestamp: new Date('2024-10-30T08:00:00'),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showGraph, setShowGraph] = useState(false);

  // Load chat messages for a module when selected
  useEffect(() => {
    if (selectedModule?.chatRoomId) {
      const messages = getChatRoomMessages(selectedModule.chatRoomId);
      setModuleChatMessages(prev => ({
        ...prev,
        [selectedModule.chatRoomId!]: messages,
      }));
    }
  }, [selectedModule]);

  // Refresh activities periodically and when activities change
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(getActivities(20));
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleBranch = (module: LearningModule) => {
    const branchedModule = createBranch(module, user.id, user.name);
    setUserBranches(prev => [...prev, branchedModule]);
    setTeamBranches(prev => [...prev, branchedModule]);
    setModules(prev => [...prev, branchedModule]);
    // Refresh activities
    setActivities(getActivities(20));
    alert(`Created branch "${branchedModule.branchName}" of "${module.title}"!`);
  };

  const handlePull = (branchModule: LearningModule) => {
    const pulledModule = pullFromBranch(branchModule, user.id);
    addModuleToUserPath(pulledModule);
    // Log activity with proper user name
    logPullActivity(branchModule, user.id, user.name);
    // Refresh activities
    setActivities(getActivities(20));
    alert(`Pulled "${branchModule.title}" from ${teamMembers.find(m => m.id === branchModule.branchOwnerId)?.name || 'team member'}'s branch into your learning path!`);
  };

  const handleMerge = (module: LearningModule) => {
    // For non-branched modules, just add to path
    if (!module.branchId) {
      addModuleToUserPath(module);
      alert(`Added "${module.title}" to your learning path. Check your dashboard.`);
    } else {
      // For branched modules, use pull functionality
      handlePull(module);
    }
  };

  const handleAddModuleChatMessage = () => {
    if (!newChatMessage.trim() || !selectedModule?.chatRoomId) return;
    
    const message: StorageChatMessage = {
      id: `msg-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      message: newChatMessage,
      timestamp: new Date(),
    };
    
    addChatMessage(selectedModule.chatRoomId, message);
    
    // Log comment activity
    logActivity({
      type: 'comment',
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      targetModuleId: selectedModule.id,
      targetModuleTitle: selectedModule.title,
    });
    
    setModuleChatMessages(prev => ({
      ...prev,
      [selectedModule.chatRoomId!]: [
        ...(prev[selectedModule.chatRoomId!] || []),
        message,
      ],
    }));
    
    // Refresh activities
    setActivities(getActivities(20));
    setNewChatMessage('');
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
              <TabsTrigger value="browse-branches">Browse Branches</TabsTrigger>
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

                        {/* Module Chat Room - Shared across all users with same source module */}
                        {selectedModule.chatRoomId && (
                          <>
                            <div className="mb-2 text-xs text-slate-500">
                              💬 Chat room for all users learning this module
                            </div>
                            {moduleChatMessages[selectedModule.chatRoomId] && moduleChatMessages[selectedModule.chatRoomId].length > 0 ? (
                              <div className="space-y-3 max-h-60 overflow-y-auto">
                                {moduleChatMessages[selectedModule.chatRoomId].map(msg => {
                                  const isCurrentUser = msg.userId === user.id;
                                  return (
                                    <div key={msg.id} className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                                      <Avatar className="w-8 h-8 flex-shrink-0">
                                        <AvatarImage src={msg.userAvatar} />
                                        <AvatarFallback>{msg.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                      </Avatar>
                                      <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-sm">{isCurrentUser ? 'You' : msg.userName}</span>
                                          <span className="text-xs text-slate-500">
                                            {new Date(msg.timestamp).toLocaleString()}
                                          </span>
                                        </div>
                                        <div className={`inline-block px-3 py-2 rounded-lg ${
                                          isCurrentUser 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-slate-100 text-slate-900'
                                        }`}>
                                          <p className="text-sm break-words">{msg.message}</p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-slate-500 text-center py-4">No messages yet. Be the first to share your thoughts!</p>
                            )}

                            <div className="flex gap-2">
                              <Input
                                placeholder="Type a message..."
                                value={newChatMessage}
                                onChange={(e) => setNewChatMessage(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddModuleChatMessage();
                                  }
                                }}
                              />
                              <Button onClick={handleAddModuleChatMessage} disabled={!newChatMessage.trim()}>
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="browse-branches" className="space-y-4 mt-6">
              <div className="mb-4">
                <p className="text-sm text-slate-600">
                  Browse and pull modules from your team members' branches. Each pull creates an independent copy in your learning path.
                </p>
              </div>
              
              {teamBranches.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <GitBranch className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-600">No branches available yet. Create one by branching a module!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {teamBranches.map(branch => {
                    const branchOwner = teamMembers.find(m => m.id === branch.branchOwnerId);
                    const isOwnBranch = branch.branchOwnerId === user.id;
                    return (
                      <Card key={branch.branchId} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-purple-600 border-purple-600">
                                  <GitBranch className="w-3 h-3 mr-1" />
                                  {branch.branchName}
                                </Badge>
                                {isOwnBranch && (
                                  <Badge variant="secondary">Your Branch</Badge>
                                )}
                                <Badge variant="secondary">{branch.category}</Badge>
                              </div>
                              <CardTitle className="text-xl mb-2">{branch.title}</CardTitle>
                              <CardDescription>{branch.description}</CardDescription>
                              
                              <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                                {branchOwner && (
                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6">
                                      <AvatarImage src={branchOwner.avatar} />
                                      <AvatarFallback>{branchOwner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <span>Created by {branchOwner.name}</span>
                                  </div>
                                )}
                                {branch.sourceModuleId && (
                                  <div className="text-xs text-slate-500">
                                    Source: {modules.find(m => m.id === branch.sourceModuleId)?.title || 'Unknown module'}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {branch.tags.map(tag => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {branch.duration} min
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {branch.difficulty}
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            {!isOwnBranch && (
                              <Button
                                variant="default"
                                className="flex-1"
                                onClick={() => handlePull(branch)}
                              >
                                <GitMerge className="w-4 h-4 mr-2" />
                                Pull to My Path
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedModule(branch);
                                setSelectedBranch(branch);
                              }}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              View & Chat
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => onPlayModule(branch)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              View Module
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Team activity across all learning modules and branches</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {activities.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <p>No activity yet. Start branching or pulling modules to see activity!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {activities.map(activity => {
                        const getIcon = () => {
                          switch (activity.type) {
                            case 'branch':
                              return <GitBranch className="w-4 h-4 text-purple-600" />;
                            case 'pull':
                              return <GitMerge className="w-4 h-4 text-green-600" />;
                            case 'comment':
                              return <MessageSquare className="w-4 h-4 text-blue-600" />;
                            case 'complete':
                              return <CheckCircle2 className="w-4 h-4 text-green-600" />;
                            default:
                              return <Star className="w-4 h-4 text-yellow-600" />;
                          }
                        };

                        const getAction = () => {
                          switch (activity.type) {
                            case 'branch':
                              return 'branched';
                            case 'pull':
                              return 'pulled';
                            case 'merge':
                              return 'merged';
                            case 'comment':
                              return 'commented on';
                            case 'complete':
                              return 'completed';
                            default:
                              return activity.type;
                          }
                        };

                        const formatTime = (timestamp: Date) => {
                          const now = new Date();
                          const diff = now.getTime() - timestamp.getTime();
                          const minutes = Math.floor(diff / 60000);
                          const hours = Math.floor(minutes / 60);
                          const days = Math.floor(hours / 24);

                          if (minutes < 1) return 'just now';
                          if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
                          if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
                          if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
                          return timestamp.toLocaleDateString();
                        };

                        return (
                          <ActivityItem
                            key={activity.id}
                            icon={getIcon()}
                            user={activity.userName}
                            action={getAction()}
                            target={activity.targetModuleTitle || 'Unknown Module'}
                            time={formatTime(activity.timestamp)}
                          />
                        );
                      })}
                    </div>
                  )}
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
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm ${isCurrentUser ? 'order-2' : ''}`}>
                              {isCurrentUser ? 'You' : msg.userName}
                            </span>
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
                    <div className="text-sm truncate">{member.name}</div>
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
