import { LearningModule } from '../../App';
import { ModuleCard } from './ModuleCard';
import { useEffect, useMemo, useRef, useState } from 'react';

interface CarouselSectionProps {
  title: string;
  modules: LearningModule[];
  onOpen: (m: LearningModule) => void;
  canRemove?: (id: string) => boolean;
  onRemove?: (id: string) => void;
}

export function CarouselSection({ title, modules, onOpen, canRemove, onRemove }: CarouselSectionProps) {
  // Fixed card sizing to keep layout consistent with Tailwind w-56 (224px) + gap-3 (12px)
  const CARD_PX = 224;
  const GAP_PX = 12;

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    const calc = () => {
      const vp = viewportRef.current;
      if (!vp) return;
      const per = Math.max(1, Math.floor((vp.clientWidth + GAP_PX) / (CARD_PX + GAP_PX)));
      setItemsPerPage(per);
      setPage(0);
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  const maxPage = useMemo(() => {
    if (!modules) return 0;
    const total = modules.length;
    return Math.max(0, Math.ceil(total / itemsPerPage) - 1);
  }, [modules, itemsPerPage]);

  const goLeft = () => setPage(p => Math.max(0, p - 1));
  const goRight = () => setPage(p => Math.min(maxPage, p + 1));
  const startIdx = useMemo(() => page * itemsPerPage, [page, itemsPerPage]);
  const visible = useMemo(() => modules.slice(startIdx, startIdx + itemsPerPage), [modules, startIdx, itemsPerPage]);

  if (!modules || modules.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg">{title}</h3>
      </div>
      <div className="relative group">
        {/* Edge gradient masks like Netflix */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent" />
        {/* Padding gutters */}
        <div className="px-8">
          <div ref={viewportRef} className="overflow-hidden w-full" style={{ touchAction: 'pan-y' }}>
          <div
            ref={trackRef}
            className="flex gap-3"
            style={{ transform: `translateX(0px)`, transition: 'transform 200ms ease' }}
          >
            {visible.map(m => (
              <div key={m.id} className="shrink-0 w-56">
                <ModuleCard 
                  module={m} 
                  onOpen={onOpen}
                  canRemove={canRemove ? canRemove(m.id) : false}
                  onRemove={onRemove}
                />
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* Arrows removed as requested */}
      </div>
    </section>
  );
}


