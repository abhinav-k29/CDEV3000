import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  totalRatings?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RatingDisplay({ rating, totalRatings, showCount = true, size = 'sm' }: RatingDisplayProps) {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg';
  
  return (
    <div className="flex items-center gap-1">
      <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
      <span className={`${textSize}`}>{rating.toFixed(1)}</span>
      {showCount && totalRatings && (
        <span className={`${textSize} text-slate-500`}>({totalRatings})</span>
      )}
    </div>
  );
}
