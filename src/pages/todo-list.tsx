import { css } from '@emotion/css';
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
  const { data: todos, fetchNext, isFetching, perPage } = useTodoListContext();

  return (
    <div>
      <h1>Todo List</h1>

      <ul
        className={css({
          '> * + *': { marginTop: 16 },
        })}
      >
        {!todos ? (
          range(perPage).map((v) => (
            <li key={v}>
              <Link to="" className={todoClass}>
                <Skeleton />
              </Link>
            </li>
          ))
        ) : (
          <>
            {todos?.map((todo) => (
              <li key={todo.id}>
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
            ))}

            <li>
              <button onClick={() => fetchNext()} disabled={isFetching}>
                More...
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
