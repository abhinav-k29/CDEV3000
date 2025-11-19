import { useState } from 'react';
import { Users, TrendingUp, Clock, AlertCircle, Award, Target, ChevronDown, Building2, UserCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { User } from '../App';
import { teamMembers } from './mockData';

interface ManagerDashboardProps {
  user: User;
}

const progressData = [
  { month: 'Apr', teamAvg: 45, topPerformer: 65 },
  { month: 'May', teamAvg: 52, topPerformer: 70 },
  { month: 'Jun', teamAvg: 58, topPerformer: 75 },
  { month: 'Jul', teamAvg: 65, topPerformer: 82 },
  { month: 'Aug', teamAvg: 71, topPerformer: 88 },
  { month: 'Sep', teamAvg: 76, topPerformer: 91 },
  { month: 'Oct', teamAvg: 79, topPerformer: 91 },
];

const categoryData = [
  { category: 'Frontend', completed: 24, inProgress: 8 },
  { category: 'Backend', completed: 18, inProgress: 12 },
  { category: 'Cloud', completed: 15, inProgress: 6 },
  { category: 'Leadership', completed: 12, inProgress: 9 },
  { category: 'Compliance', completed: 30, inProgress: 2 },
];

const completionDistribution = [
  { name: '0-25%', value: 2, color: '#ef4444' },
  { name: '26-50%', value: 3, color: '#f97316' },
  { name: '51-75%', value: 8, color: '#eab308' },
  { name: '76-100%', value: 12, color: '#22c55e' },
];

// Company-wide data (simulating multiple teams)
const companyData = {
  totalEmployees: 450,
  totalTeams: 18,
  avgCompanyCompletion: 73,
  totalActiveModules: 850,
  topDepartment: 'Engineering',
  departmentProgress: [
    { month: 'Apr', engineering: 48, sales: 42, marketing: 45, hr: 40 },
    { month: 'May', engineering: 55, sales: 48, marketing: 50, hr: 46 },
    { month: 'Jun', engineering: 62, sales: 54, marketing: 56, hr: 52 },
    { month: 'Jul', engineering: 68, sales: 60, marketing: 62, hr: 58 },
    { month: 'Aug', engineering: 74, sales: 66, marketing: 68, hr: 64 },
    { month: 'Sep', engineering: 79, sales: 71, marketing: 73, hr: 69 },
    { month: 'Oct', engineering: 82, sales: 74, marketing: 76, hr: 72 },
  ],
  companyCategories: [
    { category: 'Frontend', completed: 285, inProgress: 95 },
    { category: 'Backend', completed: 220, inProgress: 130 },
    { category: 'Cloud', completed: 195, inProgress: 85 },
    { category: 'Leadership', completed: 165, inProgress: 110 },
    { category: 'Compliance', completed: 425, inProgress: 25 },
  ],
  departmentDistribution: [
    { name: 'Engineering', value: 180, color: '#3b82f6' },
    { name: 'Sales', value: 120, color: '#22c55e' },
    { name: 'Marketing', value: 80, color: '#f97316' },
    { name: 'HR', value: 70, color: '#a855f7' },
  ],
};

export function ManagerDashboard({ user }: ManagerDashboardProps) {
  const [timeRange, setTimeRange] = useState('7days');
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(teamMembers[0].id);

  const avgCompletion = Math.round(teamMembers.reduce((acc, m) => acc + m.completionRate, 0) / teamMembers.length);
  const totalActiveModules = teamMembers.reduce((acc, m) => acc + m.activeModules, 0);
  const topPerformer = teamMembers.reduce((prev, current) => 
    prev.completionRate > current.completionRate ? prev : current
  );

  const selectedEmployee = teamMembers.find(m => m.id === selectedEmployeeId) || teamMembers[0];

  // Mock individual employee data
  const employeeProgressData = [
    { month: 'Apr', progress: 30 },
    { month: 'May', progress: 42 },
    { month: 'Jun', progress: 50 },
    { month: 'Jul', progress: 58 },
    { month: 'Aug', progress: 65 },
    { month: 'Sep', progress: 72 },
    { month: 'Oct', progress: selectedEmployee.completionRate },
  ];

  const employeeCategoryData = [
    { category: 'Frontend', completed: 5, inProgress: 2 },
    { category: 'Backend', completed: 3, inProgress: 1 },
    { category: 'Cloud', completed: 2, inProgress: 1 },
    { category: 'Leadership', completed: 3, inProgress: 0 },
    { category: 'Compliance', completed: 2, inProgress: 1 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Analytics Dashboard</h1>
        <p className="text-slate-600">Monitor learning progress and outcomes</p>
      </div>

      <Tabs defaultValue="team" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <UserCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Employee</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Company</span>
            </TabsTrigger>
          </TabsList>

          {/* Time Range Selector */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Employee Analytics Tab */}
        <TabsContent value="employee" className="space-y-6">
          {/* Employee Selector */}
          <Card>
            <CardContent className="p-6">
              <label className="text-sm text-slate-600 mb-2 block">Select Employee</label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} - {member.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Employee Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.name} />
                  <AvatarFallback>{selectedEmployee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl mb-1">{selectedEmployee.name}</h2>
                  <p className="text-slate-600">{selectedEmployee.position}</p>
                </div>
                {selectedEmployee.completionRate >= 85 && (
                  <Badge className="bg-yellow-500">Top Performer</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employee Key Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-600">Overall Progress</div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl mb-1">{selectedEmployee.completionRate}%</div>
                <div className="text-sm text-green-600">↑ 7% from last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-600">Active Modules</div>
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-3xl mb-1">{selectedEmployee.activeModules}</div>
                <div className="text-sm text-slate-500">in progress</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-600">Completed</div>
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl mb-1">15</div>
                <div className="text-sm text-slate-500">modules</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-600">Learning Time</div>
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl mb-1">42h</div>
                <div className="text-sm text-slate-500">total time</div>
              </CardContent>
            </Card>
          </div>

          {/* Employee Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={employeeProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="progress" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Progress %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={employeeCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                    <Bar dataKey="inProgress" fill="#f97316" name="In Progress" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Employee Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div>Completed "React Advanced Patterns"</div>
                      <div className="text-sm text-slate-500">Score: 95%</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">2 days ago</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div>In progress: "Microservices Architecture"</div>
                      <div className="text-sm text-slate-500">Progress: 65%</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">Started 5 days ago</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div>Completed "API Security Best Practices"</div>
                      <div className="text-sm text-slate-500">Score: 88%</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">1 week ago</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Actions */}
          <div className="flex gap-3">
            <Button>Assign New Module</Button>
            <Button variant="outline">View Full Learning Path</Button>
            <Button variant="outline">Send Message</Button>
          </div>
        </TabsContent>

        {/* Team Analytics Tab */}
        <TabsContent value="team" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-600">Team Size</div>
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl mb-1">{teamMembers.length}</div>
                <div className="text-sm text-slate-500">active learners</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-600">Avg. Completion</div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl mb-1">{avgCompletion}%</div>
                <div className="text-sm text-green-600">↑ 12% from last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-600">Active Modules</div>
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-3xl mb-1">{totalActiveModules}</div>
                <div className="text-sm text-slate-500">across team</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-600">Top Performer</div>
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-lg mb-1 truncate">{topPerformer.name}</div>
                <div className="text-sm text-slate-500">{topPerformer.completionRate}% complete</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Progress Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="teamAvg" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Team Average"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="topPerformer" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      name="Top Performer"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Completion Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Completion Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={completionDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {completionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Learning by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                    <Bar dataKey="inProgress" fill="#f97316" name="In Progress" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Team Members Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map(member => (
                  <div key={member.id}>
                    <div 
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setExpandedEmployee(expandedEmployee === member.id ? null : member.id)}
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{member.name}</span>
                          {member.completionRate >= 85 && (
                            <Badge className="bg-yellow-500">Top Performer</Badge>
                          )}
                        </div>
                        <div className="text-sm text-slate-500">{member.position}</div>
                      </div>

                      <div className="hidden sm:block text-center flex-shrink-0">
                        <div className="text-sm text-slate-600">Active Modules</div>
                        <div>{member.activeModules}</div>
                      </div>

                      <div className="w-32 lg:w-48 flex-shrink-0">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-600">Progress</span>
                          <span>{member.completionRate}%</span>
                        </div>
                        <Progress value={member.completionRate} className="h-2" />
                      </div>

                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform ${
                            expandedEmployee === member.id ? 'rotate-180' : ''
                          }`}
                        />
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    {expandedEmployee === member.id && (
                      <div className="ml-16 mr-4 mb-4 p-4 bg-slate-50 rounded-lg space-y-4">
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-slate-600 mb-1">Completed Modules</div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-green-600" />
                              <span className="text-lg">15</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-600 mb-1">Learning Time</div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="text-lg">42h 30m</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-600 mb-1">Compliance Status</div>
                            <Badge className="bg-green-600">Up to date</Badge>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-slate-600 mb-2">Recent Activity</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span>Completed "React Advanced Patterns"</span>
                              <span className="text-slate-500">2 days ago</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>In progress: "Microservices Architecture"</span>
                              <span className="text-slate-500">Started 5 days ago</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button variant="outline" size="sm">Assign Module</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Alert */}
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg mb-2">Compliance Training Due</h3>
                  <p className="text-slate-600 mb-4">
                    2 team members need to complete mandatory compliance training by November 15, 2024
                  </p>
                  <Button variant="outline" className="bg-white">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Analytics Tab */}
        <TabsContent value="company" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-600">Total Employees</div>
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl mb-1">{companyData.totalEmployees}</div>
                <div className="text-sm text-slate-500">active learners</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-600">Avg. Completion</div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl mb-1">{companyData.avgCompanyCompletion}%</div>
                <div className="text-sm text-green-600">↑ 5% from last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-600">Active Modules</div>
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-3xl mb-1">{companyData.totalActiveModules}</div>
                <div className="text-sm text-slate-500">across company</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-600">Top Department</div>
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-lg mb-1 truncate">{companyData.topDepartment}</div>
                <div className="text-sm text-slate-500">highest completion rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Progress Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={companyData.departmentProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="engineering" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Engineering"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      name="Sales"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="marketing" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      name="Marketing"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hr" 
                      stroke="#a855f7" 
                      strokeWidth={2}
                      name="HR"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Completion Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Completion Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={companyData.departmentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {companyData.departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Learning by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={companyData.companyCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                    <Bar dataKey="inProgress" fill="#f97316" name="In Progress" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Alert */}
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg mb-2">Compliance Training Due</h3>
                  <p className="text-slate-600 mb-4">
                    2 team members need to complete mandatory compliance training by November 15, 2024
                  </p>
                  <Button variant="outline" className="bg-white">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}