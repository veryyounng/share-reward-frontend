// src/components/MyPageView.tsx
import type { LeaderboardRow, RewardEvent, RewardsSummary } from '../types';

export default function MyPageView({
  summary,
  total,
  events,
  isStreaming,
  refreshSummary,
  refreshLeaderboard,
}: {
  userId: string;
  summary: RewardsSummary | null;
  total: number;
  events: RewardEvent[];
  isStreaming: boolean;
  startStream: () => void;
  stopStream: () => void;
  refreshSummary: () => void;
  leaderboard: LeaderboardRow[];
  refreshLeaderboard: () => void;
}) {
  return (
    <section className="w-full flex flex-col items-center text-center gap-6">
      {/* Live feed */}
      <div className="panel">
        <div className="panel-header">
          <h2 className="text-lg font-semibold">리워드 실시간 피드</h2>
          {!isStreaming ? (
            <button className="rounded-xl px-3 py-1.5 bg-black text-white text-sm">
              Start
            </button>
          ) : (
            <button className="rounded-xl px-3 py-1.5 bg-neutral-200 text-sm">
              Stop
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-neutral-200/70 p-3">
            <div className="text-sm text-neutral-500">누적 리워드</div>
            <div className="text-2xl font-bold mt-1">
              {(summary?.totalAmount ?? total).toLocaleString()}{' '}
              <span className="text-sm">KRW</span>
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              건수: {summary?.count ?? events.length}
            </div>
            <button
              className="mt-3 rounded-xl px-3 py-1.5 bg-neutral-900 text-white text-sm"
              onClick={refreshSummary}
            >
              요약 새로고침
            </button>
          </div>

          <div className="lg:col-span-2 rounded-xl border border-neutral-200/70 p-3 max-h-64 overflow-auto">
            <div className="text-sm font-medium mb-2">최근 이벤트</div>
            <ul className="recent-list space-y-2">
              {events.map((e) => (
                <li
                  key={e.eventId}
                  className="flex items-center justify-center text-sm gap-3"
                >
                  <span className="font-mono text-xs text-neutral-500">
                    {e.shareId}
                  </span>
                  <span>{e.amount.toLocaleString()} KRW</span>
                  <span className="text-xs text-neutral-400">
                    {e.timestamp
                      ? new Date(e.timestamp).toLocaleTimeString()
                      : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="panel">
        <div className="panel-header">
          <h2 className="text-lg font-semibold">리더보드 (7일)</h2>
          <button
            className="rounded-xl px-3 py-1.5 bg-neutral-900 text-white text-sm"
            onClick={refreshLeaderboard}
          >
            새로고침
          </button>
        </div>

        <div className="rounded-xl overflow-hidden">
          <table
            className="w-full text-sm border border-gray-400"
            style={{ borderCollapse: 'collapse' }}
          >
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Rank
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  User
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right">
                  Amount (KRW)
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="border border-gray-300 px-4 py-2">1</td>
                <td className="border border-gray-300 px-4 py-2">u-123</td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  23,244
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  20
                </td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-300 px-4 py-2">2</td>
                <td className="border border-gray-300 px-4 py-2">u-1234</td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  6,962
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  7
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
