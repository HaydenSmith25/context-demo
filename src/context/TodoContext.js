import React from 'react';
import { useTodos } from '../custom-hooks/useTodos';

// we'll create the context, which is really an object
// we'll create a special component that renders the context data
// and makes it available to the children of that component
export const TodoContext = React.createContext();

export default function TodoProvider({ children }) {
  const { todos, markTodoAsDone } = useTodos();

  const providerValue = {
    todos,
    markTodoAsDone,
  };

  // allows us to render any react subtree inside of our todo context provider
  // this will give those downstream components access to the data
  // we place 'on' this provider
  return (
    <TodoContext.Provider value={providerValue}>
      {children}
    </TodoContext.Provider>
  );
}
