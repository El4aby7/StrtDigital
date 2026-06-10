import type { AppData } from "../types";
import { seedData } from "../data/seed";

// Single persistence boundary. Today: localStorage. Later: a `supabaseRepo`
// implementing the same shape (load -> async fetch, persist -> upserts).
// No component touches storage directly — they go through AppDataProvider,
// which goes through this repository. Swapping backends is a one-file change.

export interface DataRepository {
  load(): AppData;
  persist(data: AppData): void;
  reset(): AppData;
}

const STORAGE_KEY = "strtdigital.appdata.v1";

function deepClone<T>(value: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : (JSON.parse(JSON.stringify(value)) as T);
}

export const localStorageRepo: DataRepository = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as AppData;
    } catch {
      // ignore corrupt/unavailable storage and fall back to seed
    }
    const fresh = deepClone(seedData);
    this.persist(fresh);
    return fresh;
  },
  persist(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // storage may be full (e.g. large base64 receipts) or disabled — non-fatal
    }
  },
  reset() {
    const fresh = deepClone(seedData);
    this.persist(fresh);
    return fresh;
  },
};

export const repository: DataRepository = localStorageRepo;
