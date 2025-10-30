import { ReactNode } from 'react';

interface DashboardLayoutProps {
  hero: ReactNode;
  left: ReactNode;
  right?: ReactNode;
}

export function DashboardLayout({ hero, left, right }: DashboardLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {hero}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-8">{left}</div>
        {right && (
          <aside className="lg:col-span-4 space-y-6 hidden lg:block">
            {right}
          </aside>
        )}
      </div>
    </div>
  );
}


