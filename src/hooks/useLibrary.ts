import { useCallback, useEffect, useState } from 'react';
import type { EduVideo } from '../types';
import {
  clearLibrary,
  pushHistory,
  readHistory,
  readLikedIds,
  readSaved,
  toggleLiked,
  toggleSaved,
  type HistoryEntry,
} from '../services/library';
import {
  clearNotesAndStreak,
  readNotes,
  readStreak,
  recordLearningDay,
  writeNote,
  type NotesMap,
  type StreakState,
} from '../services/learning';

export function useLibrary() {
  const [saved, setSaved] = useState<EduVideo[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [notes, setNotes] = useState<NotesMap>({});
  const [streak, setStreak] = useState<StreakState>({ days: [], current: 0, best: 0 });
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const [savedList, liked, hist, noteMap, streakState] = await Promise.all([
      readSaved(),
      readLikedIds(),
      readHistory(),
      readNotes(),
      readStreak(),
    ]);
    setSaved(savedList);
    setLikedIds(liked);
    setHistory(hist);
    setNotes(noteMap);
    setStreak(streakState);
    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onToggleSave = useCallback(async (video: EduVideo) => {
    const next = await toggleSaved(video);
    setSaved(next);
    return next.some((item) => item.id === video.id);
  }, []);

  const onToggleLike = useCallback(async (videoId: string) => {
    const next = await toggleLiked(videoId);
    setLikedIds(next);
    return next.includes(videoId);
  }, []);

  const onWatch = useCallback(async (video: EduVideo) => {
    const [nextHistory, nextStreak] = await Promise.all([
      pushHistory(video),
      recordLearningDay(),
    ]);
    setHistory(nextHistory);
    setStreak(nextStreak);
  }, []);

  const onSaveNote = useCallback(async (videoId: string, note: string) => {
    const next = await writeNote(videoId, note);
    setNotes(next);
  }, []);

  const onClear = useCallback(async () => {
    await clearLibrary();
    await clearNotesAndStreak();
    setSaved([]);
    setLikedIds([]);
    setHistory([]);
    setNotes({});
    setStreak({ days: [], current: 0, best: 0 });
  }, []);

  return {
    ready,
    saved,
    likedIds,
    history,
    notes,
    streak,
    onToggleSave,
    onToggleLike,
    onWatch,
    onSaveNote,
    onClear,
    refresh,
  };
}
