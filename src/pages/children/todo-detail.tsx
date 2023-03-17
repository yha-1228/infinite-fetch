import { useNavigate, useParams } from 'react-router-dom';
import { getTodo } from '../../api/fn';
import { useFetch } from '../../hooks/use-fetch';

export function TodoDetail() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: todo } = useFetch({
    fetcher: () => getTodo(params.id as string),
    deps: [params.id],
  });

  return (
    <div>
      <h1>Detail</h1>

      <button onClick={() => navigate(-1)}>Back</button>

      <p>
        #{todo?.id} {todo?.title} {todo?.completed && '✅'}
      </p>
    </div>
  );
}
