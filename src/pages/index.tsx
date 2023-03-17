import { css } from '@emotion/css';
import { NavLink, Outlet } from 'react-router-dom';

export function Root() {
  return (
    <>
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
    </>
  );
}
