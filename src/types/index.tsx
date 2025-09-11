// src/types/index.ts
export type CreateShareReq = {
  userId: string;
  itemUrl: string;
  utmSource?: string;
};
export type CreateShareRes = {
  shareId: string;
  shortUrl?: string;
  createdAt?: string;
};
export type SimulateClickReq = { shareId: string; userAgent?: string };

export type RewardEvent = {
  eventId: string;
  shareId: string;
  userId: string;
  rewardId: string;
  amount: number;
  currency: string;
  timestamp?: number;
};

export type RewardsSummary = {
  userId: string;
  totalAmount: number;
  count: number;
  recent: RewardEvent[];
};

export type LeaderboardRow = {
  userId: string;
  totalAmount: number;
  count: number;
};
