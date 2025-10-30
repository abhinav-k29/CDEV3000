import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, GitBranch, GitMerge, Circle, Users, User as UserIcon, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { User } from '../App';
import { teamMembers } from './mockData';

interface LearningPathGraphProps {
  user: User;
  onClose: () => void;
}

interface PathNode {
  id: string;
  title: string;
  type: 'main' | 'branch' | 'merge';
  owner: string;
  ownerAvatar?: string;
  status: 'completed' | 'in-progress' | 'not-started';
  x: number;
  y: number;
  branches?: string[];
  mergedFrom?: string;
}

interface PathConnection {
  from: string;
  to: string;
  type: 'main' | 'branch' | 'merge';
}

export function LearningPathGraph({ user, onClose }: LearningPathGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedView, setSelectedView] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<PathNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Define the learning path structure
  const nodes: PathNode[] = [
    // Main path
    { id: 'n1', title: 'React Basics', type: 'main', owner: 'Company', status: 'completed', x: 150, y: 100 },
    { id: 'n2', title: 'React Advanced', type: 'main', owner: 'Company', status: 'completed', x: 150, y: 200 },
    { id: 'n3', title: 'TypeScript Fundamentals', type: 'main', owner: 'Company', status: 'completed', x: 150, y: 300 },
    { id: 'n4', title: 'Design Patterns', type: 'main', owner: 'Company', status: 'in-progress', x: 150, y: 400 },
    { id: 'n5', title: 'Testing Best Practices', type: 'main', owner: 'Company', status: 'not-started', x: 150, y: 500 },
    
    // Alex's branches
    { id: 'n6', title: 'React Performance', type: 'branch', owner: 'Alex Rivera', ownerAvatar: user.avatar, status: 'in-progress', x: 350, y: 200, branches: ['n2'] },
    { id: 'n7', title: 'Custom Hooks Deep Dive', type: 'branch', owner: 'Alex Rivera', ownerAvatar: user.avatar, status: 'completed', x: 350, y: 280, branches: ['n2'] },
    
    // Maria's branches
    { id: 'n8', title: 'React + TS Patterns', type: 'branch', owner: 'Maria Garcia', ownerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', status: 'completed', x: 550, y: 250, branches: ['n2', 'n3'] },
    
    // James's branch
    { id: 'n9', title: 'Testing React Components', type: 'branch', owner: 'James Chen', ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'in-progress', x: 350, y: 450, branches: ['n4', 'n5'] },
    
    // Merged modules
    { id: 'n10', title: 'Advanced Patterns (Merged)', type: 'merge', owner: 'Alex Rivera', ownerAvatar: user.avatar, status: 'completed', x: 550, y: 400, mergedFrom: 'n8' },
  ];

  const connections: PathConnection[] = [
    // Main path
    { from: 'n1', to: 'n2', type: 'main' },
    { from: 'n2', to: 'n3', type: 'main' },
    { from: 'n3', to: 'n4', type: 'main' },
    { from: 'n4', to: 'n5', type: 'main' },
    
    // Alex's branches
    { from: 'n2', to: 'n6', type: 'branch' },
    { from: 'n2', to: 'n7', type: 'branch' },
    
    // Maria's branch
    { from: 'n2', to: 'n8', type: 'branch' },
    { from: 'n3', to: 'n8', type: 'branch' },
    
    // James's branch
    { from: 'n4', to: 'n9', type: 'branch' },
    { from: 'n5', to: 'n9', type: 'branch' },
    
    // Merge
    { from: 'n8', to: 'n10', type: 'merge' },
    { from: 'n4', to: 'n10', type: 'merge' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Filter nodes based on selected view
    let filteredNodes = nodes;
    if (selectedView !== 'all') {
      const member = teamMembers.find(m => m.id === selectedView);
      if (member) {
        filteredNodes = nodes.filter(n => 
          n.owner === 'Company' || n.owner === member.name
        );
      } else if (selectedView === user.id) {
        filteredNodes = nodes.filter(n => 
          n.owner === 'Company' || n.owner === user.name
        );
      }
    }

    // Draw connections
    connections.forEach(conn => {
      const fromNode = filteredNodes.find(n => n.id === conn.from);
      const toNode = filteredNodes.find(n => n.id === conn.to);
      
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      
      if (conn.type === 'branch') {
        // Draw curved line for branches
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.quadraticCurveTo(midX + 50, midY, toNode.x, toNode.y);
        ctx.strokeStyle = '#a855f7'; // purple
        ctx.setLineDash([5, 5]);
      } else if (conn.type === 'merge') {
        // Draw curved line for merges
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.quadraticCurveTo(midX - 50, midY, toNode.x, toNode.y);
        ctx.strokeStyle = '#22c55e'; // green
        ctx.setLineDash([5, 3]);
      } else {
        // Straight line for main path
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = '#3b82f6'; // blue
        ctx.setLineDash([]);
      }
      
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw nodes
    filteredNodes.forEach(node => {
      const isHovered = hoveredNode?.id === node.id;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, isHovered ? 14 : 12, 0, Math.PI * 2);
      
      // Status-based colors
      if (node.status === 'completed') {
        ctx.fillStyle = '#22c55e';
      } else if (node.status === 'in-progress') {
        ctx.fillStyle = '#f97316';
      } else {
        ctx.fillStyle = '#94a3b8';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Node type indicator
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });

  }, [selectedView, hoveredNode]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x: e.clientX, y: e.clientY });

    // Check if hovering over a node
    const hoveredNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance < 15;
    });

    setHoveredNode(hoveredNode || null);
  };

  const handleCanvasMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onClose} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collaboration
          </Button>
          <h1 className="text-3xl mb-2">Learning Path Graph</h1>
          <p className="text-slate-600">Visualize how learning modules branch, merge, and connect across your team</p>
        </div>

        <Select value={selectedView} onValueChange={setSelectedView}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                All Team Paths
              </div>
            </SelectItem>
            <SelectItem value={user.id}>
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                My Path Only
              </div>
            </SelectItem>
            {teamMembers.map(member => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Graph Canvas */}
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader className="border-b bg-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle>Network Graph</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span>Main Path</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  <span>Branch</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span>Merge</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 relative">
            <canvas
              ref={canvasRef}
              className="w-full h-[600px] bg-white cursor-crosshair"
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={handleCanvasMouseLeave}
            />
            
            {/* Tooltip */}
            {hoveredNode && (
              <div 
                className="absolute pointer-events-none bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm z-10"
                style={{
                  left: mousePos.x - 100,
                  top: mousePos.y - 80,
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    {hoveredNode.ownerAvatar && (
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={hoveredNode.ownerAvatar} />
                        <AvatarFallback className="text-xs">
                          {hoveredNode.owner.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <span className="text-xs text-slate-300">{hoveredNode.owner}</span>
                  </div>
                  <p>{hoveredNode.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        hoveredNode.status === 'completed' ? 'border-green-500 text-green-500' :
                        hoveredNode.status === 'in-progress' ? 'border-orange-500 text-orange-500' :
                        'border-slate-500 text-slate-500'
                      }`}
                    >
                      {hoveredNode.status === 'completed' ? 'Completed' :
                       hoveredNode.status === 'in-progress' ? 'In Progress' :
                       'Not Started'}
                    </Badge>
                    {hoveredNode.type === 'branch' && (
                      <Badge variant="outline" className="text-xs border-purple-500 text-purple-500">
                        <GitBranch className="w-3 h-3 mr-1" />
                        Branch
                      </Badge>
                    )}
                    {hoveredNode.type === 'merge' && (
                      <Badge variant="outline" className="text-xs border-green-500 text-green-500">
                        <GitMerge className="w-3 h-3 mr-1" />
                        Merged
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="w-4 h-4" />
                Node Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-600"></div>
                <div>
                  <div className="text-sm">Completed</div>
                  <div className="text-xs text-slate-500">Module finished</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-600"></div>
                <div>
                  <div className="text-sm">In Progress</div>
                  <div className="text-xs text-slate-500">Currently learning</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-400"></div>
                <div>
                  <div className="text-sm">Not Started</div>
                  <div className="text-xs text-slate-500">Upcoming module</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span>Main Path (Blue)</span>
                </div>
                <p className="text-xs text-slate-500">Company-created learning modules that form the core curriculum</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  <span>Branch (Purple)</span>
                </div>
                <p className="text-xs text-slate-500">Personal or team customizations of existing modules</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  <span>Merge (Green)</span>
                </div>
                <p className="text-xs text-slate-500">Integration of branched content back into your learning path</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Maximize2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm mb-1">Pro Tip</h4>
                  <p className="text-xs text-slate-600">
                    Hover over nodes to see details. Switch between team views using the dropdown to explore different learning paths.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Module List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All Modules in Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes
              .filter(n => {
                if (selectedView === 'all') return true;
                const member = teamMembers.find(m => m.id === selectedView);
                if (member) return n.owner === 'Company' || n.owner === member.name;
                if (selectedView === user.id) return n.owner === 'Company' || n.owner === user.name;
                return true;
              })
              .map(node => (
              <div
                key={node.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  node.status === 'completed' ? 'bg-green-600' :
                  node.status === 'in-progress' ? 'bg-orange-600' :
                  'bg-slate-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{node.title}</div>
                  <div className="text-xs text-slate-500 truncate">{node.owner}</div>
                </div>
                {node.type === 'branch' && (
                  <GitBranch className="w-4 h-4 text-purple-600 flex-shrink-0" />
                )}
                {node.type === 'merge' && (
                  <GitMerge className="w-4 h-4 text-green-600 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
