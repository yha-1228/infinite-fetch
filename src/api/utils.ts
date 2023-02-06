import produce from 'immer';
import { Todo } from './types';

export const updateTodoCompleted = (data: Todo) => {
  const nextCompleted = !data.completed;
  return { ...data, completed: nextCompleted };
};

export const updateTodos = (
  data: Todo[] | undefined,
  id: number,
  prevCompleted: boolean
) => {
  const newData = produce(data, (draft) => {
    const todo = draft?.find((todo) => todo.id === id);
    if (!todo) throw new Error('not found');
    todo.completed = !prevCompleted;
  });

  return newData;
};
