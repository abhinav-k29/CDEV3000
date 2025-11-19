import { Award } from 'lucide-react';
import { Badge } from './ui/badge';

interface SeniorityBadgeProps {
  years: number;
  variant?: 'inline' | 'standalone';
}

export function SeniorityBadge({ years, variant = 'inline' }: SeniorityBadgeProps) {
  if (years < 3) return null; // Only show for 3+ years
  
  const getBadgeColor = () => {
    if (years >= 10) return 'bg-purple-100 text-purple-700 border-purple-300';
    if (years >= 5) return 'bg-blue-100 text-blue-700 border-blue-300';
    return 'bg-green-100 text-green-700 border-green-300';
  };
  
  const getBadgeLabel = () => {
    if (years >= 10) return 'Veteran';
    if (years >= 5) return 'Senior';
    return 'Experienced';
  };

  if (variant === 'standalone') {
    return (
      <Badge className={`${getBadgeColor()} border text-xs`}>
        <Award className="w-3 h-3 mr-1" />
        {getBadgeLabel()} ({years}y)
      </Badge>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${getBadgeColor()}`}>
      <Award className="w-3 h-3" />
      <span>{getBadgeLabel()}</span>
    </div>
  );
}
