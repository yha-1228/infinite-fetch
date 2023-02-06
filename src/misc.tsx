import React from 'react';

export const createContext = <T,>() => {
  const Context = React.createContext<T | undefined>(undefined);

  function useContext(): T {
    const c = React.useContext(Context);
    if (c === undefined) throw new Error('err');
    return c;
  }

  return [Context, useContext] as const;
};

/**
 * generate array: `[0, 1, ..., count - 1]`
 */
export const range = (count: number) => {
  return Array.from(new Array(count)).map((_, i) => i);
};
