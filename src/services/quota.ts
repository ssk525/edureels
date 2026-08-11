import AsyncStorage from '@react-native-async-storage/async-storage';
import { DAILY_QUOTA_LIMIT } from '../config/env';

const QUOTA_KEY = 'edu-reels:quota:v1';

type QuotaRecord = {
  day: string;
  used: number;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getQuotaUsed(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(QUOTA_KEY);
    if (!raw) return 0;
    const record = JSON.parse(raw) as QuotaRecord;
    if (record.day !== todayKey()) return 0;
    return record.used;
  } catch {
    return 0;
  }
}

export async function addQuotaUsage(units: number): Promise<number> {
  const day = todayKey();
  const current = await getQuotaUsed();
  const used = current + units;
  await AsyncStorage.setItem(QUOTA_KEY, JSON.stringify({ day, used }));
  return used;
}

export function remainingQuota(used: number): number {
  return Math.max(0, DAILY_QUOTA_LIMIT - used);
}
