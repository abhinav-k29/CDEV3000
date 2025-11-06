export function BadgeBoard() {
  const badges = [
    { id: 'b1', label: '7-day Streak' },
    { id: 'b2', label: 'Compliance Champion' },
    { id: 'b3', label: 'Frontend Pro' },
  ];
  return (
    <div className="border rounded-xl p-4">
      <h4 className="text-sm mb-3">Badges</h4>
      <div className="flex flex-wrap gap-2">
        {badges.map(b => (
          <span key={b.id} className="text-xs bg-slate-100 rounded px-2 py-1">{b.label}</span>
        ))}
      </div>
    </div>
  );
}


