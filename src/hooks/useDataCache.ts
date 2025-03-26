import { useState, useEffect } from 'react';

interface CacheConfig {
  key: string;
  ttl: number; // Time to live in seconds
}

interface CacheData<T> {
  data: T;
  timestamp: number;
}

export function useDataCache<T>(
  fetchFn: () => Promise<T>,
  config: CacheConfig
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(config.key);
        if (cached) {
          const cacheData: CacheData<T> = JSON.parse(cached);
          const now = Date.now();
          if (now - cacheData.timestamp < config.ttl * 1000) {
            setData(cacheData.data);
            setLoading(false);
            return;
          }
        }

        // Fetch fresh data
        const freshData = await fetchFn();
        const cacheData: CacheData<T> = {
          data: freshData,
          timestamp: Date.now(),
        };
        localStorage.setItem(config.key, JSON.stringify(cacheData));
        setData(freshData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [config.key, config.ttl, fetchFn]);

  return { data, loading, error, refetch: () => setData(null) };
}
