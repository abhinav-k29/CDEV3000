import { LearningModule } from '../../App';

interface TrendingPanelProps {
  modules: LearningModule[];
  onOpen: (m: LearningModule) => void;
}

export function TrendingPanel({ modules, onOpen }: TrendingPanelProps) {
  return (
    <div className="border rounded-xl p-4">
      <h4 className="text-sm mb-3">Trending Now</h4>
      <div className="space-y-3">
        {modules.slice(0, 6).map(m => (
          <button key={m.id} onClick={() => onOpen(m)} className="w-full flex items-center gap-3 text-left hover:bg-slate-50 rounded p-2">
            {m.thumbnail ? (
              <img src={m.thumbnail} className="w-12 h-8 rounded object-cover" />
            ) : (
              <div className="w-12 h-8 rounded bg-slate-200" />
            )}
            <div className="min-w-0">
              <div className="text-sm truncate">{m.title}</div>
              <div className="text-xs text-slate-500 capitalize">{m.category}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}


