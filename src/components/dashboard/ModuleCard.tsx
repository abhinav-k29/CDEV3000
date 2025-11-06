import { LearningModule } from '../../App';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Play, Trash2 } from 'lucide-react';

interface ModuleCardProps {
  module: LearningModule;
  onOpen: (m: LearningModule) => void;
  onRemove?: (id: string) => void;
  canRemove?: boolean;
}

export function ModuleCard({ module, onOpen, onRemove, canRemove }: ModuleCardProps) {
  return (
    <div className="text-left w-full group rounded-xl overflow-hidden border hover:shadow-md transition relative h-full flex flex-col text-sm">
      <button onClick={() => onOpen(module)} className="w-full">
        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
          {module.thumbnail && (
            <img 
              src={module.thumbnail} 
              alt={module.title} 
              className="w-full h-full object-cover object-center transform transition-transform duration-300 group-hover:scale-[1.04]" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <Badge variant="secondary" className="capitalize">{module.category}</Badge>
            <div className="inline-flex items-center gap-1 bg-white/90 px-3 rounded text-xs h-7 leading-7">
              <Play className="w-3 h-3" /> View
            </div>
          </div>
        </div>
      </button>
      <div className="p-2 space-y-2 flex-1 min-h-[72px]">
        <div className="font-medium line-clamp-2">{module.title}</div>
        <div className="flex items-center gap-2">
          <Progress className="h-1.5 flex-1" value={module.progress} />
          <span className="text-xs text-slate-600">{module.progress}%</span>
        </div>
      </div>
      {canRemove && onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(module.id); }}
          className="absolute bottom-2 right-2 inline-flex items-center gap-1 text-xs px-2 py-1 bg-white/90 border rounded-md hover:bg-white"
          title="Remove from My Path"
        >
          <Trash2 className="w-3 h-3 text-red-600" />
          <span className="text-red-700">Remove</span>
        </button>
      )}
    </div>
  );
}

