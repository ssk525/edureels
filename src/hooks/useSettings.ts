import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_SETTINGS,
  readSettings,
  writeSettings,
  type AppSettings,
} from '../services/preferences';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const value = await readSettings();
      if (!cancelled) {
        setSettings(value);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(async (patch: Partial<AppSettings>) => {
    const next = await writeSettings(patch);
    setSettings(next);
    return next;
  }, []);

  return { settings, ready, update };
}
