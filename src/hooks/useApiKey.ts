import { useCallback, useEffect, useState } from 'react';
import {
  BUILTIN_YOUTUBE_API_KEY,
  clearUserYoutubeKey,
  isValidYoutubeKey,
  readUserYoutubeKey,
  resolveYoutubeApiKey,
  writeUserYoutubeKey,
} from '../services/apiKey';

export function useApiKey() {
  const [apiKey, setApiKey] = useState('');
  const [hasUserKey, setHasUserKey] = useState(false);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const user = await readUserYoutubeKey();
    const resolved = await resolveYoutubeApiKey();
    setHasUserKey(Boolean(user));
    setApiKey(resolved);
    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveKey = useCallback(async (value: string) => {
    if (!isValidYoutubeKey(value)) {
      throw new Error('API key looks too short. Paste the full YouTube Data API key.');
    }
    await writeUserYoutubeKey(value);
    await refresh();
  }, [refresh]);

  const clearKey = useCallback(async () => {
    await clearUserYoutubeKey();
    await refresh();
  }, [refresh]);

  return {
    ready,
    apiKey,
    hasApiKey: isValidYoutubeKey(apiKey),
    hasUserKey,
    hasBuiltinKey: isValidYoutubeKey(BUILTIN_YOUTUBE_API_KEY),
    saveKey,
    clearKey,
    refresh,
  };
}
