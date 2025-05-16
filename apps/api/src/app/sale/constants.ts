export const CATEGORIES = ['DeFi', 'AI', 'DePIN', 'Games', 'Others'] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_MAP: Record<string, Category> = {
  defi: 'DeFi',
  ai: 'AI',
  depin: 'DePIN',
  games: 'Games',
  others: 'Others',
};
