import { useLocation } from 'react-router-dom';
import { getTodos } from '../api/fn';
import { Todo } from '../api/types';
import { createContext } from '../misc';
import { UseInfiniteFetchReturn, useInfiniteFetch } from './use-infinite-fetch';

type UseTodoListContextParams = {
  perPage: number;
};

type UseTodoListContextReturn = UseInfiniteFetchReturn<Todo> &
  UseTodoListContextParams;

export const [TodoListContext, useTodoListContext] =
  createContext<UseTodoListContextReturn>();

type TodoListProviderProps = React.PropsWithChildren<UseTodoListContextParams>;

export function TodoListProvider(props: TodoListProviderProps) {
  const { pathname } = useLocation();
  const { children, perPage } = props;

  const fetchingState = useInfiniteFetch({
    fetcher: (page) => getTodos({ limit: perPage, page }),
    deps: [],
    enabled: /^\/todos/.test(pathname),
  });

  return (
    <TodoListContext.Provider value={{ ...fetchingState, perPage }}>
      {children}
    </TodoListContext.Provider>
  );
}
