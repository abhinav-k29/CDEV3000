import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { LearningModule } from '../../App';

interface HeroBannerProps {
  module: LearningModule;
  onStart: (m: LearningModule) => void;
}

export function HeroBanner({ module, onStart }: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/20 z-10" />
      {module.thumbnail && (
        <img src={module.thumbnail} alt={module.title} className="w-full h-56 sm:h-72 lg:h-80 object-cover" />
      )}
      {!module.thumbnail && <div className="w-full h-56 sm:h-72 lg:h-80 bg-slate-200" />}
      <div className="absolute inset-0 z-20 p-6 sm:p-8 flex flex-col justify-end text-white">
        <div className="max-w-xl space-y-2">
          <div className="text-xs opacity-90 capitalize">{module.category}</div>
          <h2 className="text-2xl sm:text-3xl font-semibold">{module.title}</h2>
          <div className="flex items-center gap-3">
            <Progress className="h-2 w-48" value={module.progress} />
            <span className="text-sm">{module.progress}%</span>
          </div>
          <Button onClick={() => onStart(module)} className="mt-2 w-fit">Start Learning</Button>
        </div>
      </div>
    </div>
  );
}


