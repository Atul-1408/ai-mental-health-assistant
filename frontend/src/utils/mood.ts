export interface MoodCheckIn {
  date: string; // YYYY-MM-DD
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  sleepHours?: number;
  notes?: string;
}

export interface EmotionTrendPoint {
  date: string;
  moodAverage: number;
}

export const MOOD_KEY = 'mindchat_mood_checkins';

export const getTodayKey = () => new Date().toISOString().slice(0, 10);

export const loadMoodCheckIns = (): MoodCheckIn[] => {
  try {
    const raw = localStorage.getItem(MOOD_KEY);
    return raw ? (JSON.parse(raw) as MoodCheckIn[]) : [];
  } catch {
    return [];
  }
};

export const saveMoodCheckIns = (list: MoodCheckIn[]) => {
  localStorage.setItem(MOOD_KEY, JSON.stringify(list));
};

export const upsertMoodCheckIn = (entry: MoodCheckIn) => {
  const list = loadMoodCheckIns();
  const idx = list.findIndex((e) => e.date === entry.date);
  if (idx >= 0) list[idx] = entry; else list.push(entry);
  saveMoodCheckIns(list);
  return list;
};

