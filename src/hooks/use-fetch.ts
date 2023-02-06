import { useState, useEffect, useRef } from 'react';

export type UseFetchProps<T> = {
  fetcher: () => Promise<T>;
  deps: React.DependencyList;
  /**
   * @default true
   */
  enabled?: boolean;
};

type FetchDataArg<T> = {
  fetcher: UseFetchProps<T>['fetcher'];
  onIdle: () => void;
  onSuccess: (data: T | undefined) => void;
  onError: (error: Error) => void;
  ignore?: boolean;
};

const fetchData = async <T>(arg: FetchDataArg<T>) => {
  const { fetcher, onIdle, onSuccess, onError, ignore } = arg;
  onIdle();
  try {
    const data = await fetcher();
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

export type UseFetchState<T> = {
  data: T | undefined;
  isFetching: boolean;
  error: Error | null;
};

export type UseFetchReturn<T> = UseFetchState<T> & {
  setData: (data: T | undefined) => void;
};

export function useFetch<T>(props: UseFetchProps<T>): UseFetchReturn<T> {
  const { fetcher, deps, enabled = true } = props;

  const savedFetcher = useRef(fetcher);

  useEffect(() => {
    savedFetcher.current = fetcher;
  }, [fetcher]);

  const [state, setState] = useState<UseFetchState<T>>({
    data: undefined,
    isFetching: false,
    error: null,
  });

  useEffect(() => {
    if (!enabled) return;

    let ignore = false;

    fetchData({
      fetcher: savedFetcher.current,
      onIdle: () => {
        setState((prev) => ({ ...prev, isFetching: true }));
      },
      onSuccess: (data) => {
        setState({ data, isFetching: false, error: null });
      },
      onError: (error) => {
        setState((prev) => ({ ...prev, isFetching: false, error }));
      },
      ignore,
    });

    return () => {
      ignore = true;
    };
  }, [enabled, ...deps]);

  return {
    ...state,
    setData: (data: T | undefined) => setState((prev) => ({ ...prev, data })),
  };
}
