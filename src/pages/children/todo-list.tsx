import { css } from '@emotion/css';
import { useInView } from 'react-intersection-observer';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { getTodos } from '../../api/fn';
import { TODO_PER_PAGE } from '../../config';
import { useInfiniteFetch } from '../../hooks/use-infinite-fetch';
import { range } from '../../misc';

const todoListClass = css({
  '> * + *': { marginTop: 16 },
});

const todoClass = css({
  display: 'block',
  padding: 16,
  border: '1px solid lightgray',
  borderRadius: '4px',
});

function SkeletonTodoList() {
  return (
    <ul className={todoListClass}>
      {range(TODO_PER_PAGE).map((v) => (
        <li key={v}>
          <Link to="" className={todoClass}>
            <Skeleton />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function TodoList() {
  const {
    data: todos,
    isLoading,
    isFetching,
    fetchNext,
  } = useInfiniteFetch({
    fetcher: (page) => getTodos({ limit: TODO_PER_PAGE, page }),
    deps: [],
  });

  const { ref: triggerRef } = useInView({
    threshold: 0.8,
    onChange: (inView) => {
      if (inView) fetchNext();
    },
  });

  return (
    <div>
      <h1>Todo List </h1>

      {isLoading ? (
        <SkeletonTodoList />
      ) : (
        <ul className={todoListClass}>
          {todos?.map((todo, index, thisArray) => {
            const lastIndex = thisArray.length - 1;

            return (
              <li
                key={todo.id}
                ref={index === lastIndex ? triggerRef : undefined}
                className={todoClass}
              >
                #{todo.id} {todo.title} {todo?.completed && '✅'}
              </li>
            );
          })}
        </ul>
      )}

      {isFetching && <SkeletonTodoList />}
    </div>
  );
}
