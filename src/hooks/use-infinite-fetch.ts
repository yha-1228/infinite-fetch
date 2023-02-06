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

type FetchDataArg<T> = {
  fetcher?: UseInfiniteFetchProps<T>['fetcher'];
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
    const data = await fetcher?.(page);
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

type UseInfiniteFetchState<T> = {
  page: number;
  data: T[] | undefined;
  isFetching: boolean;
  error: Error | null;
};

export type UseInfiniteFetchReturn<T> = UseInfiniteFetchState<T> & {
  isLoading: boolean;
  setData: (data: T[] | undefined) => void;
  fetchNext: () => void;
};

/**
 * Infinite loading of `useFetch`
 *
 * @example
 * ```tsx
 * const { data, setData, isFetching, error, fetchNext } = useInfiniteFetch({
 *    // returns Todo[]
 *   fetcher: (page) => getRequest(`/todos?limit=${PER_PAGE}&page=${page}`),
 *   deps: [],
 * }});
 * ```
 */
export function useInfiniteFetch<T>(
  props: UseInfiniteFetchProps<T>
): UseInfiniteFetchReturn<T> {
  const { fetcher, deps, initialPage = 0, enabled = true } = props;

  const savedFetcher = useRef<UseInfiniteFetchProps<T>['fetcher']>();

  useEffect(() => {
    savedFetcher.current = fetcher;
  }, [fetcher]);

  const [state, setState] = useState<UseInfiniteFetchState<T>>({
    page: initialPage,
    data: undefined,
    isFetching: false,
    error: null,
  });

  const fetchNext = () => {
    const nextPage = state.page + 1;

    setState((prev) => ({ ...prev, page: nextPage }));

    fetchData({
      fetcher: savedFetcher.current,
      page: nextPage,
      onIdle: () => setState((prev) => ({ ...prev, isFetching: true })),
      onSuccess: (data) => {
        setState((prev) => ({
          ...prev,
          data: [...prev.data!, ...data!],
          isFetching: false,
          error: null,
        }));
      },
      onError: (error) => {
        setState((prev) => ({ ...prev, isFetching: false, error }));
      },
    });
  };

  useEffect(() => {
    if (!enabled) return;

    let ignore = false;

    fetchData({
      fetcher: savedFetcher.current,
      page: initialPage,
      onIdle: () => {
        setState((prev) => ({ ...prev, isFetching: true }));
      },
      onSuccess: (data) => {
        setState((prev) => ({ ...prev, data, isFetching: false, error: null }));
      },
      onError: (error) => {
        setState((prev) => ({ ...prev, isFetching: false, error }));
      },
      ignore,
    });

    return () => {
      ignore = true;

      // Reset all state (for using context)
      setState({
        page: initialPage,
        data: undefined,
        isFetching: false,
        error: null,
      });
      return;
    };
  }, [enabled, initialPage, ...deps]);

  return {
    ...state,
    isLoading: !state.data && !state.error,
    setData: (data: T[] | undefined) => setState((prev) => ({ ...prev, data })),
    fetchNext,
  };
}
