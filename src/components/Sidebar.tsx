// src/components/Sidebar.tsx
import { cn } from '../utils/cn';

export default function Sidebar({
  tab,
  setTab,
  userId,
  setUserId,
  utm,
  setUtm,
}: {
  tab: 'shop' | 'my';
  setTab: (t: 'shop' | 'my') => void;
  userId: string;
  setUserId: (v: string) => void;
  utm: string;
  setUtm: (v: string) => void;
}) {
  return (
    <aside className="sidebar-panel">
      <div className="btn-row">
        <button
          onClick={() => setTab('shop')}
          className={cn(
            'flex-1 rounded-xl px-3 py-2 text-sm border',
            tab === 'shop'
              ? 'bg-black text-white border-black'
              : 'bg-neutral-100'
          )}
        >
          🛒 Shop
        </button>
        <button
          onClick={() => setTab('my')}
          className={cn(
            'flex-1 rounded-xl px-3 py-2 text-sm border',
            tab === 'my' ? 'bg-black text-white border-black' : 'bg-neutral-100'
          )}
        >
          👤 My
        </button>
      </div>

      <div className="form-group">
        <label className="text-xs text-neutral-500">User ID</label>
        <input
          className="form-input"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="text-xs text-neutral-500">UTM Source</label>
        <input
          className="form-input"
          value={utm}
          onChange={(e) => setUtm(e.target.value)}
        />
      </div>
    </aside>
  );
}
