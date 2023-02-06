import axios from 'axios';
import { Todo } from './types';

type GetTodosParams = {
  limit: number;
  page: number;
};

export const getTodos = async (params: GetTodosParams) => {
  const { limit, page } = params;

  // loading
  await new Promise((r) => setTimeout(r, 600));

  const res = await axios.get<Todo[]>(
    'https://jsonplaceholder.typicode.com/todos',
    {
      params: {
        _limit: limit,
        _start: page * limit, // offset
      },
    }
  );
  return res.data;
};

export const getTodo = async (id: string) => {
  // loading
  await new Promise((r) => setTimeout(r, 600));

  const res = await axios.get<Todo>(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  );
  return res.data;
};
