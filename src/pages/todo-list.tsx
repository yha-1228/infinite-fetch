import { css } from '@emotion/css';
import { useInView } from 'react-intersection-observer';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { useTodoListContext } from '../hooks/use-todo-list-context';
import { range } from '../misc';

const todoClass = css({
  display: 'block',
  padding: 16,
  border: '1px solid lightgray',
  borderRadius: '4px',
});

export function TodoList() {
  const {
    data: todos,
    isLoading,
    isFetching,
    fetchNext,
    perPage,
  } = useTodoListContext();

  const { ref: triggerRef } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView) fetchNext();
    },
  });

  return (
    <div>
      <h1>Todo List </h1>

      <ul
        className={css({
          '> * + *': { marginTop: 16 },
        })}
      >
        {isLoading
          ? range(perPage).map((v) => (
              <li key={v}>
                <Link to="" className={todoClass}>
                  <Skeleton />
                </Link>
              </li>
            ))
          : todos?.map((todo, index, thisArray) => {
              const lastIndex = thisArray.length - 1;
              const indexOfFetchNext = lastIndex - 1;

              return (
                <li
                  key={todo.id}
                  ref={index === indexOfFetchNext ? triggerRef : undefined}
                >
                  <Link
                    to={`/todos/${todo.id}`}
                    className={css(todoClass, {
                      ...(todo.completed && {
                        textDecoration: 'line-through',
                      }),
                    })}
                  >
                    #{todo.id} {todo.title}
                  </Link>
                </li>
              );
            })}
      </ul>

      {isFetching && <div>Loading next...</div>}
    </div>
  );
}
