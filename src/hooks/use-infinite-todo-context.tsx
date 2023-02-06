import { getTodos } from '../api/fn';
import { Todo } from '../api/types';
import { TODO_PER_PAGE } from '../config';
import { createContext } from '../misc';
import {
  UseInfiniteFetchProps,
  UseInfiniteFetchReturn,
  useInfiniteFetch,
} from './use-infinite-fetch';

export const [InfiniteTodoContext, useInfiniteTodoContext] =
  createContext<UseInfiniteFetchReturn<Todo>>();

export type InfiniteTodoProviderProps = React.PropsWithChildren<
  Omit<UseInfiniteFetchProps<Todo>, 'fetcher'>
>;

export function InfiniteTodoProvider(props: InfiniteTodoProviderProps) {
  const { children, ...rest } = props;

  const value = useInfiniteFetch({
    fetcher: (page) => getTodos({ limit: TODO_PER_PAGE, page }),
    ...rest,
  });

  return (
    <InfiniteTodoContext.Provider value={value}>
      {children}
    </InfiniteTodoContext.Provider>
  );
}
