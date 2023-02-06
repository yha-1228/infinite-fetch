import { useState, useEffect, useRef } from 'react';

export type UseFetchProps<T> = {
  fetcher: () => Promise<T>;
  deps: React.DependencyList;
  /**
   * @default true
   */
  enabled?: boolean;
};

export type UseFetchReturn<T> = {
  data: T | undefined;
  setData: React.Dispatch<React.SetStateAction<T | undefined>>;
  isFetching: boolean;
  error: Error | null;
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

export function useFetch<T>(props: UseFetchProps<T>): UseFetchReturn<T> {
  const { fetcher, deps, enabled = true } = props;

  const savedFetcher = useRef(fetcher);

  useEffect(() => {
    savedFetcher.current = fetcher;
  }, [fetcher]);

  const [data, setData] = useState<T | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let ignore = false;

    fetchData({
      fetcher: savedFetcher.current,
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
    };
  }, [enabled, ...deps]);

  return { data, setData, isFetching, error };
}
