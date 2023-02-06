import 'react-loading-skeleton/dist/skeleton.css';
import './app.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './pages';
import { Home } from './pages/children';
import { TodoDetail } from './pages/children/todo-detail';
import { TodoList } from './pages/children/todo-list';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'todos', element: <TodoList /> },
      { path: 'todos/:id', element: <TodoDetail /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
