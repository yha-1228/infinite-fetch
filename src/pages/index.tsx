import { css } from '@emotion/css';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { InfiniteTodoProvider } from '../hooks/use-infinite-todo-context';

function Contexts({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <InfiniteTodoProvider {...{ deps: [], enabled: /^\/todos/.test(pathname) }}>
      {children}
    </InfiniteTodoProvider>
  );
}

export function Root() {
  return (
    <Contexts>
      <ul
        className={css({
          display: 'flex',
          '> * + *': {
            marginLeft: 24,
          },
        })}
      >
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? css({ color: '#111' }) : undefined
            }
            to="/"
            end
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? css({ color: '#111' }) : undefined
            }
            to="/todos"
          >
            Todo List
          </NavLink>
        </li>
        <li>
          <button onClick={() => window.location.reload()}>Reload</button>
        </li>
      </ul>

      <Outlet />
    </Contexts>
  );
}
