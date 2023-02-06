import { useNavigate, useParams } from 'react-router-dom';
import { getTodo } from '../api/fn';
import { updateTodos } from '../api/utils';
import { useFetch } from '../hooks/use-fetch';
import { useTodoListContext } from '../hooks/use-todo-list-context';

export function TodoDetail() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: todos, setData: setTodos } = useTodoListContext();

  const { data: todo, setData: setTodo } = useFetch({
    fetcher: () => getTodo(params.id as string),
    deps: [params.id],
  });

  const handleToggleState = () => {
    if (!todo) return;
    setTodo({ ...todo, completed: !todo.completed });

    const newTodos = updateTodos(todos, todo.id, todo.completed);
    setTodos(newTodos);
  };

  return (
    <div>
      <h1>Detail</h1>

      <button onClick={() => navigate(-1)}>Back</button>

      <p className={todo?.completed ? 'done' : ''}>
        #{todo?.id} {todo?.title}
      </p>

      <button onClick={handleToggleState}>Toggle State</button>
    </div>
  );
}
