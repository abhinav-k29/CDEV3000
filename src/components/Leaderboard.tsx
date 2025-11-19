import { useState } from 'react';
import { Trophy, Award, Medal, Crown, Star, Zap, Target, Code2, Server, Cloud, Users as UsersIcon, Shield, TrendingUp, Clock, MessageSquare, Share2, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User } from '../App';

interface LeaderboardProps {
  user: User;
}

interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  points: number;
  category: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  position: string;
  avatar: string;
  score: number;
  badges: string[];
  completedModules: number;
  learningTime: number;
  rank: number;
}

const availableBadges: BadgeType[] = [
  {
    id: 'frontend-master',
    name: 'Frontend Master',
    description: 'Completed all Frontend modules',
    icon: <Code2 className="w-5 h-5" />,
    color: 'bg-blue-500',
    points: 500,
    category: 'Frontend Development'
  },
  {
    id: 'backend-expert',
    name: 'Backend Expert',
    description: 'Completed all Backend modules',
    icon: <Server className="w-5 h-5" />,
    color: 'bg-green-500',
    points: 500,
    category: 'Backend Development'
  },
  {
    id: 'cloud-specialist',
    name: 'Cloud Specialist',
    description: 'Completed all Cloud modules',
    icon: <Cloud className="w-5 h-5" />,
    color: 'bg-sky-500',
    points: 500,
    category: 'Cloud Computing'
  },
  {
    id: 'leadership-pro',
    name: 'Leadership Pro',
    description: 'Completed all Leadership modules',
    icon: <UsersIcon className="w-5 h-5" />,
    color: 'bg-purple-500',
    points: 400,
    category: 'Leadership'
  },
  {
    id: 'compliance-champion',
    name: 'Compliance Champion',
    description: 'Completed all Compliance modules',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-orange-500',
    points: 300,
    category: 'Compliance'
  },
  {
    id: 'speed-learner',
    name: 'Speed Learner',
    description: 'Completed 10 modules in 7 days',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-yellow-500',
    points: 250,
    category: 'Achievement'
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Achieved 100% in 5 modules',
    icon: <Star className="w-5 h-5" />,
    color: 'bg-pink-500',
    points: 300,
    category: 'Achievement'
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: '50+ hours of learning time',
    icon: <Clock className="w-5 h-5" />,
    color: 'bg-indigo-500',
    points: 200,
    category: 'Achievement'
  },
  {
    id: 'full-stack',
    name: 'Full Stack Hero',
    description: 'Completed both Frontend & Backend',
    icon: <Code2 className="w-5 h-5" />,
    color: 'bg-gradient-to-r from-blue-500 to-green-500',
    points: 750,
    category: 'Achievement'
  },
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Among first to complete new modules',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-teal-500',
    points: 150,
    category: 'Achievement'
  },
];

const leaderboardData: LeaderboardEntry[] = [
  {
    id: 'emp-004',
    name: 'Sarah Kim',
    position: 'Backend Engineer',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
    score: 2850,
    badges: ['frontend-master', 'backend-expert', 'cloud-specialist', 'perfect-score', 'dedicated-learner', 'full-stack'],
    completedModules: 28,
    learningTime: 85,
    rank: 1
  },
  {
    id: 'emp-002',
    name: 'Maria Garcia',
    position: 'Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    score: 2450,
    badges: ['frontend-master', 'leadership-pro', 'perfect-score', 'speed-learner', 'dedicated-learner'],
    completedModules: 24,
    learningTime: 72,
    rank: 2
  },
  {
    id: 'emp-001',
    name: 'Alex Rivera',
    position: 'Senior Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    score: 2100,
    badges: ['frontend-master', 'compliance-champion', 'dedicated-learner', 'early-adopter'],
    completedModules: 21,
    learningTime: 63,
    rank: 3
  },
  {
    id: 'emp-003',
    name: 'James Chen',
    position: 'Full Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    score: 1950,
    badges: ['backend-expert', 'cloud-specialist', 'compliance-champion', 'speed-learner'],
    completedModules: 19,
    learningTime: 58,
    rank: 4
  },
  {
    id: 'emp-005',
    name: 'David Johnson',
    position: 'UI/UX Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    score: 1650,
    badges: ['frontend-master', 'compliance-champion', 'early-adopter'],
    completedModules: 17,
    learningTime: 51,
    rank: 5
  },
  {
    id: 'emp-006',
    name: 'Emily Brown',
    position: 'DevOps Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    score: 1500,
    badges: ['cloud-specialist', 'compliance-champion'],
    completedModules: 15,
    learningTime: 45,
    rank: 6
  },
  {
    id: 'emp-007',
    name: 'Michael Lee',
    position: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    score: 1350,
    badges: ['backend-expert', 'compliance-champion'],
    completedModules: 14,
    learningTime: 42,
    rank: 7
  },
];

export function Leaderboard({ user }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState('leaderboard');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-slate-600">#{rank}</div>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-300';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-amber-50 border-amber-300';
      default:
        return 'bg-white';
    }
  };

  const currentUserEntry = leaderboardData.find(entry => entry.id === user.id) || leaderboardData[2];
  const currentUserBadges = availableBadges.filter(badge => currentUserEntry.badges.includes(badge.id));
  const availableToEarn = availableBadges.filter(badge => !currentUserEntry.badges.includes(badge.id));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Leaderboard & Achievements
        </h1>
        <p className="text-slate-600">Compete with your peers and earn badges by completing learning paths</p>
      </div>

      {/* User's Current Standing */}
      <Card className={`mb-8 border-2 ${getRankBg(currentUserEntry.rank)}`}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {getRankIcon(currentUserEntry.rank)}
              </div>
              <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
                <AvatarImage src={currentUserEntry.avatar} alt={currentUserEntry.name} />
                <AvatarFallback>{currentUserEntry.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl">Your Rank: #{currentUserEntry.rank}</h3>
                <p className="text-slate-600">{currentUserEntry.position}</p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:ml-auto">
              <div className="text-center">
                <div className="text-2xl">{currentUserEntry.score}</div>
                <div className="text-sm text-slate-600">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">{currentUserEntry.badges.length}</div>
                <div className="text-sm text-slate-600">Badges Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">{currentUserEntry.completedModules}</div>
                <div className="text-sm text-slate-600">Modules Done</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full sm:w-auto grid-cols-2">
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Badges
          </TabsTrigger>
        </TabsList>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboardData.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    getRankBg(entry.rank)
                  } ${entry.id === user.id ? 'ring-2 ring-blue-500' : ''}`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar & Info */}
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={entry.avatar} alt={entry.name} />
                    <AvatarFallback>{entry.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span>{entry.name}</span>
                      {entry.id === user.id && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">You</Badge>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">{entry.position}</div>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-slate-600">Modules</div>
                      <div>{entry.completedModules}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-600">Hours</div>
                      <div>{entry.learningTime}h</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-600">Badges</div>
                      <div>{entry.badges.length}</div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-xl">{entry.score}</span>
                    </div>
                    <div className="text-xs text-slate-500">points</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* How Points Work */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                How Points Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div>Complete a Module</div>
                    <div className="text-sm text-slate-600">+50 points</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div>Earn a Badge</div>
                    <div className="text-sm text-slate-600">+150-750 points</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div>Perfect Score (100%)</div>
                    <div className="text-sm text-slate-600">+25 bonus points</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div>Learning Time</div>
                    <div className="text-sm text-slate-600">+5 points per hour</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-cyan-50 rounded-lg">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <div>Comment & Help Others</div>
                    <div className="text-sm text-slate-600">+10 points per comment</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <div>Share/Recommend Module</div>
                    <div className="text-sm text-slate-600">+15 points each</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Flame className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div>Daily Streak</div>
                    <div className="text-sm text-slate-600">+20 points per day</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div>Weekly Streak Bonus</div>
                    <div className="text-sm text-slate-600">+100 points per week</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-6">
          {/* Earned Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                Your Badges ({currentUserBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentUserBadges.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentUserBadges.map(badge => (
                    <div 
                      key={badge.id} 
                      className="flex items-start gap-3 p-4 border-2 border-green-200 bg-green-50 rounded-lg"
                    >
                      <div className={`w-12 h-12 ${badge.color} rounded-lg flex items-center justify-center flex-shrink-0 text-white`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{badge.name}</span>
                          <Badge variant="secondary" className="text-xs">+{badge.points}</Badge>
                        </div>
                        <div className="text-sm text-slate-600">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Award className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No badges earned yet. Complete module collections to earn your first badge!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-slate-600" />
                Available to Earn ({availableToEarn.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableToEarn.map(badge => (
                  <div 
                    key={badge.id} 
                    className="flex items-start gap-3 p-4 border-2 border-slate-200 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <div className={`w-12 h-12 ${badge.color} rounded-lg flex items-center justify-center flex-shrink-0 text-white opacity-40`}>
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{badge.name}</span>
                        <Badge variant="outline" className="text-xs">+{badge.points}</Badge>
                      </div>
                      <div className="text-sm text-slate-600">{badge.description}</div>
                      <div className="mt-2">
                        <Progress value={Math.random() * 80} className="h-1" />
                        <div className="text-xs text-slate-500 mt-1">Keep learning to unlock!</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Badge Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Badge Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-blue-600" />
                    <span>Technical Skills</span>
                  </div>
                  <Badge>6 badges</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span>Achievements</span>
                  </div>
                  <Badge>4 badges</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}