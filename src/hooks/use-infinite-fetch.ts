import { useState, useEffect, useRef } from 'react';

export type UseInfiniteFetchProps<T> = {
  fetcher: (page: number) => Promise<T[]>;
  deps: React.DependencyList;
  /**
   * @default 0
   */
  initialPage?: number;
  /**
   * @default true
   */
  enabled?: boolean;
};

export type UseInfiniteFetchReturn<T> = {
  data: T[] | undefined;
  setData: React.Dispatch<React.SetStateAction<T[] | undefined>>;
  isFetching: boolean;
  error: Error | null;
  page: number;
  fetchNext: () => void;
};

type FetchDataArg<T> = {
  fetcher: UseInfiniteFetchProps<T>['fetcher'];
  page: number;
  onIdle: () => void;
  onSuccess: (data: T[] | undefined) => void;
  onError: (error: Error) => void;
  ignore?: boolean;
};

const fetchData = async <T>(arg: FetchDataArg<T>) => {
  const { fetcher, page, onIdle, onSuccess, onError, ignore = false } = arg;
  onIdle();
  try {
    const data = await fetcher(page);
    if (!ignore) {
      onSuccess(data);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (!ignore) {
        onError(error);
      }
    }
  }
};

export function useInfiniteFetch<T>(
  props: UseInfiniteFetchProps<T>
): UseInfiniteFetchReturn<T> {
  const { fetcher, deps, initialPage = 0, enabled = true } = props;

  const savedFetcher = useRef(fetcher);

  useEffect(() => {
    savedFetcher.current = fetcher;
  }, [fetcher]);

  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<T[] | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNext = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData({
      fetcher: savedFetcher.current,
      page: nextPage,
      onIdle: () => setIsFetching(true),
      onSuccess: (data) => {
        setData((prev) => [...prev!, ...data!]);
        setIsFetching(false);
        setError(null);
      },
      onError: (error) => {
        setIsFetching(false);
        setError(error);
      },
    });
  };

  useEffect(() => {
    if (!enabled) return;

    let ignore = false;

    fetchData({
      fetcher: savedFetcher.current,
      page: initialPage,
      onIdle: () => setIsFetching(true),
      onSuccess: (data) => {
        setData(data);
        setIsFetching(false);
        setError(null);
      },
      onError: (error) => {
        setIsFetching(false);
        setError(error);
      },
      ignore,
    });

    return () => {
      ignore = true;

      // Reset all state (for using context)
      setPage(initialPage);
      setData(undefined);
      setIsFetching(false);
      setError(null);
      return;
    };
  }, [enabled, initialPage, ...deps]);

  return {
    data,
    setData,
    isFetching,
    error,
    page,
    fetchNext,
  };
}
