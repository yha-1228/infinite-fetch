import 'react-loading-skeleton/dist/skeleton.css';
import './app.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/home';
import { Root } from './pages/root';
import { TodoDetail } from './pages/todo-detail';
import { TodoList } from './pages/todo-list';

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
