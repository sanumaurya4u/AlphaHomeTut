import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for Supabase data fetching with search, filter, sort, and pagination
 */
export function useSupabaseQuery(fetchFn, { deps = [], initialPage = 1, pageSize = 10 } = {}) {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);

  const totalPages = Math.ceil(count / pageSize);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(page, pageSize);
      setData(result.data || []);
      setCount(result.count || 0);
    } catch (err) {
      console.error('useSupabaseQuery error:', err);
      setError(err.message || 'Failed to fetch data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, pageSize]);

  useEffect(() => {
    fetch();
  }, [fetch, ...deps]);

  const refetch = useCallback(() => {
    fetch();
  }, [fetch]);

  const goToPage = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages]
  );

  const nextPage = useCallback(() => goToPage(page + 1), [goToPage, page]);
  const prevPage = useCallback(() => goToPage(page - 1), [goToPage, page]);

  return {
    data,
    count,
    loading,
    error,
    page,
    totalPages,
    setPage,
    goToPage,
    nextPage,
    prevPage,
    refetch,
  };
}
