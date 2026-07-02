import type { Category } from './types';

// Shared category icons + colours so the form, map and dashboard stay consistent.
export const CATS: Record<Category, { icon: string; color: string; hi: string }> = {
  Water: { icon: '💧', color: '#0ea5e9', hi: 'पानी' },
  Roads: { icon: '🛣️', color: '#64748b', hi: 'सड़क' },
  Electricity: { icon: '💡', color: '#f59e0b', hi: 'बिजली' },
  Health: { icon: '🏥', color: '#ef4444', hi: 'स्वास्थ्य' },
  Education: { icon: '🏫', color: '#8b5cf6', hi: 'शिक्षा' },
  Sanitation: { icon: '🧹', color: '#14b8a6', hi: 'सफाई' },
  Employment: { icon: '💼', color: '#ec4899', hi: 'रोज़गार' },
  Agriculture: { icon: '🌾', color: '#22c55e', hi: 'खेती' },
  Other: { icon: '📌', color: '#94a3b8', hi: 'अन्य' },
};

export const SENT_COLOR: Record<string, string> = {
  angry: 'bg-red-100 text-red-700',
  frustrated: 'bg-orange-100 text-orange-700',
  concerned: 'bg-amber-100 text-amber-700',
  hopeful: 'bg-green-100 text-green-700',
};
