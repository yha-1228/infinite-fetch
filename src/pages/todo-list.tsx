import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { useTodoListContext } from '../hooks/use-todo-list-context';
import { range } from '../misc';

export function TodoList() {
  const { data: todos, fetchNext, isFetching, perPage } = useTodoListContext();

  return (
    <div>
      <h1>Todo List</h1>

      <ul>
        {!todos ? (
          range(perPage).map((v) => (
            <li key={v}>
              <Skeleton width="15rem" />
            </li>
          ))
        ) : (
          <>
            {todos?.map((todo) => (
              <li key={todo.id}>
                <Link
                  to={`/todos/${todo.id}`}
                  className={todo.completed ? 'done' : ''}
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
