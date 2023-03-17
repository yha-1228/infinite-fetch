import React from 'react';
import { mergeData } from './misc';

export type UseInfiniteFetchOptions<T> = {
  /**
   * Fetch function
   */
  fetcher: (page: number) => Promise<T[]>;
  /**
   * Dependency array
   */
  deps: React.DependencyList;
  /**
   * Has next page?
   */
  hasNext: (lastData: T[]) => boolean;
  /**
   * @default 0
   */
  initialPage?: number;
  /**
   * @default true
   */
  enabled?: boolean;
};

type UseInfiniteFetchState<T> = {
  page: number;
  data: T[] | undefined;
  isFetching: boolean;
  error: Error | null;
};

export type UseInfiniteFetchResult<T> = UseInfiniteFetchState<T> & {
  isLoading: boolean;
  isError: boolean;
  setData: (data: T[] | undefined) => void;
  fetchNext: () => void;
};

export function useInfiniteFetch<T>(
  options: UseInfiniteFetchOptions<T>
): UseInfiniteFetchResult<T> {
  const { fetcher, deps, hasNext, initialPage = 0, enabled = true } = options;

  const savedFetcher = React.useRef(fetcher);

  React.useEffect(() => {
    savedFetcher.current = fetcher;
  }, [fetcher]);

  const savedHasNext = React.useRef(hasNext);

  React.useEffect(() => {
    savedHasNext.current = hasNext;
  }, [hasNext]);

  const [state, setState] = React.useState<UseInfiniteFetchState<T>>({
    page: initialPage,
    data: undefined,
    isFetching: false,
    error: null,
  });

  const [isFinished, setIsFinished] = React.useState(false);

  const fetchNext = async () => {
    if (isFinished) return;

    const nextPage = state.page + 1;

    setState((prev) => ({ ...prev, isFetching: true }));

    try {
      const data = await savedFetcher.current(nextPage);

      const isFinished = savedHasNext.current(data);
      setIsFinished(isFinished);

      setState((prev) => ({
        ...prev,
        page: nextPage,
        data: mergeData(prev.data, data),
        isFetching: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isFetching: false,
        error: error as Error,
      }));
    }
  };

  React.useEffect(() => {
    if (!enabled) return;

    let ignore = false;

    const fetchData = async () => {
      setState((prev) => ({ ...prev, isFetching: true }));

      try {
        const data = await savedFetcher.current(initialPage);
        if (!ignore) {
          setState((prev) => ({
            ...prev,
            data,
            isFetching: false,
            error: null,
          }));
        }
      } catch (error) {
        if (error instanceof Error) {
          setState((prev) => ({
            ...prev,
            isFetching: false,
            error: error as Error,
          }));
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [enabled, initialPage, ...deps]);

  return {
    ...state,
    isLoading: !state.data && !state.error,
    isError: !!state.error,
    setData: (data: T[] | undefined) => setState((prev) => ({ ...prev, data })),
    fetchNext,
  };
}
