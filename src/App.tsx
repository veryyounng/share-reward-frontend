// src/App.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import ShopView from '../src/components/ShopView';
import type { Product } from '../src/components/ShopView';
import MyPageView from '../src/components/MyPageView';
import Sidebar from '../src/components/Sidebar';

import type {
  CreateShareReq,
  CreateShareRes,
  SimulateClickReq,
  RewardEvent,
  RewardsSummary,
  LeaderboardRow,
} from '../src/types';

const API_BASE = import.meta.env.VITE_API_BASE as string | undefined;

// Mock products
const PRODUCTS: Product[] = [
  {
    id: 'p-001',
    name: '화이트 블라우스',
    price: 42000,
    image: '/img/blo.webp',
    itemUrl: 'https://shop.example.com/items/white-blouse',
  },
  {
    id: 'p-002',
    name: '블랙 미니백',
    price: 69000,
    image: '/img/bag.webp',
    itemUrl: 'https://shop.example.com/items/black-bag',
  },
  {
    id: 'p-003',
    name: '스니커즈',
    price: 88000,
    image: '/img/snea.webp',
    itemUrl: 'https://shop.example.com/items/sneakers',
  },
];

export default function App() {
  const [tab, setTab] = useState<'shop' | 'my'>('shop');
  const [userId, setUserId] = useState('u-123');
  const [utm, setUtm] = useState('kakao');

  const [shareId, setShareId] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [lastItemUrl, setLastItemUrl] = useState<string>('');

  const [isStreaming, setIsStreaming] = useState(false);
  const [events, setEvents] = useState<RewardEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<RewardsSummary | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const esRef = useRef<EventSource | null>(null);

  const demoMode = !API_BASE;

  const api = useMemo(() => {
    if (!API_BASE) return null;
    const base = API_BASE.replace(/\/$/, '');
    return {
      createShare: async (body: CreateShareReq): Promise<CreateShareRes> => {
        const res = await fetch(`${base}/api/shares`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`createShare failed: ${res.status}`);
        return res.json();
      },
      simulateClick: async (body: SimulateClickReq): Promise<void> => {
        const res = await fetch(`${base}/api/simulate-click`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`simulateClick failed: ${res.status}`);
      },
      getSummary: async (uid: string): Promise<RewardsSummary> => {
        const url = new URL(`${base}/api/rewards/summary`);
        url.searchParams.set('userId', uid);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`summary failed: ${res.status}`);
        return res.json();
      },
      getLeaderboard: async (period = '7d'): Promise<LeaderboardRow[]> => {
        const url = new URL(`${base}/api/leaderboard`);
        url.searchParams.set('period', period);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`leaderboard failed: ${res.status}`);
        return res.json();
      },
      sse: (uid: string) =>
        new EventSource(
          `${base}/api/stream/rewards?userId=${encodeURIComponent(uid)}`
        ),
    };
  }, []);

  function pushDemoReward(targetShareId?: string) {
    const sid = targetShareId || shareId || 's-demo';
    const evt: RewardEvent = {
      eventId: crypto.randomUUID(),
      shareId: sid,
      userId,
      rewardId: crypto.randomUUID(),
      amount: Math.floor(500 + Math.random() * 1500),
      currency: 'KRW',
      timestamp: Date.now(),
    };
    setEvents((p) => [evt, ...p].slice(0, 50));
    setTotal((t) => t + evt.amount);
  }

  async function onCreateShare(itemUrl: string) {
    setLastItemUrl(itemUrl);
    if (demoMode) {
      const sid = `s-${Math.random().toString(36).slice(2, 8)}`;
      setShareId(sid);
      setShortUrl(`https://demo.so/${sid.slice(2)}`);
      return;
    }
    try {
      const res = await api!.createShare({ userId, itemUrl, utmSource: utm });
      setShareId(res.shareId);
      setShortUrl(res.shortUrl || '');
    } catch (e: any) {
      alert(e.message ?? String(e));
    }
  }

  async function onSimulateClick() {
    if (!shareId) return alert('먼저 공유를 생성해 주세요.');
    if (demoMode) {
      setTimeout(() => pushDemoReward(), 600);
      return;
    }
    try {
      await api!.simulateClick({ shareId, userAgent: navigator.userAgent });
    } catch (e: any) {
      alert(e.message ?? String(e));
    }
  }

  function startStream() {
    if (isStreaming) return;
    setIsStreaming(true);
    setEvents([]);
    setTotal(0);
    if (demoMode) {
      const id = setInterval(pushDemoReward, 1800);
      esRef.current = { close: () => clearInterval(id) } as any;
      return;
    }
    const es = api!.sse(userId);
    es.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data) as RewardEvent;
        setEvents((p) => [data, ...p].slice(0, 50));
        setTotal((t) => t + (data?.amount ?? 0));
      } catch {}
    };
    es.onerror = () => {};
    esRef.current = es;
  }
  function stopStream() {
    setIsStreaming(false);
    esRef.current?.close();
    esRef.current = null;
  }

  async function refreshSummary() {
    if (demoMode) {
      setSummary({
        userId,
        totalAmount: total,
        count: events.length,
        recent: events.slice(0, 5),
      });
      return;
    }
    try {
      const s = await api!.getSummary(userId);
      setSummary(s);
    } catch (e: any) {
      alert(e.message ?? String(e));
    }
  }
  async function refreshLeaderboard() {
    if (demoMode) {
      setLeaderboard([
        {
          userId: 'u-123',
          totalAmount: total || 2900,
          count: events.length || 3,
        },
        { userId: 'u-777', totalAmount: 2520, count: 2 },
        { userId: 'u-555', totalAmount: 1990, count: 2 },
      ]);
      return;
    }
    try {
      const lb = await api!.getLeaderboard('7d');
      setLeaderboard(lb);
    } catch (e: any) {
      alert(e.message ?? String(e));
    }
  }

  useEffect(() => {
    refreshSummary();
    refreshLeaderboard();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 w-full app-center">
      {/* Header */}
      <div className="center-page">
        <header className="sticky top-0 z-10 bg-white border-b border-neutral-200/70 w-full">
          <div className="header-center mx-auto max-w-7xl px-4 py-4 w-full">
            <header className="header-center w-full">
              <h1 className="text-2xl font-bold text-center">
                Kafka로 상품 공유 리워드 구현
              </h1>
            </header>

            <div className="text-xs sm:text-sm text-neutral-500">
              {API_BASE ? '🧼' : 'DEMO MODE (no API)'}
            </div>
          </div>
        </header>
      </div>

      {/* Layout: sidebar + main */}
      <div className="layout-center">
        <Sidebar
          tab={tab}
          setTab={setTab}
          userId={userId}
          setUserId={setUserId}
          utm={utm}
          setUtm={setUtm}
        />

        <main className="main-panel">
          {tab === 'shop' ? (
            <ShopView
              products={PRODUCTS}
              onCreateShare={onCreateShare}
              onSimulateClick={onSimulateClick}
              shareId={shareId}
              shortUrl={shortUrl}
              lastItemUrl={lastItemUrl}
            />
          ) : (
            <MyPageView
              userId={userId}
              summary={summary}
              total={total}
              events={events}
              isStreaming={isStreaming}
              startStream={startStream}
              stopStream={stopStream}
              refreshSummary={refreshSummary}
              leaderboard={leaderboard}
              refreshLeaderboard={refreshLeaderboard}
            />
          )}
        </main>
      </div>
      <footer className="mx-auto max-w-7xl px-4 pb-8 text-xs text-neutral-500 w-full flex justify-center">
        <div className="mt-6" />
      </footer>
    </div>
  );
}
