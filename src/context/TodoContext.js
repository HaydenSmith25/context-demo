// we'll create the context, which is really an object
// we'll create a special component that renders the context data
// and makes it available to the children of that component
import React, { useReducer, useEffect } from 'react';
export const TodoContext = React.createContext();

// let's setup some actions that the user will trigger in our todo app
// one such action is completing a todo, which will be a checkbox check / selection
// users can also uncheck a todo
const UPDATE_TODO = 'UPDATE_TODO';
const SET_TODOS = 'SET_TODOS';

// status in this case is checked or unchecked, ie true | false
const updateTodo = (todo) => ({
  type: UPDATE_TODO,
  payload: todo,
});
const setTodos = (todos) => ({
  type: SET_TODOS,
  payload: todos,
});

// reducer means a function with no side effects that
// listens to incoming actions, ie OBJECTS,
// and SWITCHES on their type, to modify a stateful object
function todoReducer(state, { type, payload }) {
  // switch matches cases based on the value supplied to the param block
  switch (type) {
    case SET_TODOS:
      // replace our initial state with the data received from our api call
      return payload;
    case UPDATE_TODO:
      // modify and return state
      // but, i'd like to do so in an immutable fashion
      // meaning, i don't modify the state object directly
      // rather, i'll make a copy of the full state
      return state.map((todo) => (todo.id === payload.id ? payload : todo));
    default:
      return state;
  }
}

export default function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, []);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await fetch('http://localhost:5500/todos');
        const data = await response.json();
        // dispatch is a special function that updates our state
        // by sending an action ie OBJECT "through" our reducer
        // meaning that dispatch({type: SET_TODOS, payload: data})
        // will actually invoke our todoReducer, passing in the action ie OBJECT
        // as well as the current state, which is being managed behind the scenes
        // by useReducer, and is available to us as the state parameter
        // defined above
        dispatch(setTodos(data));
      } catch (err) {
        console.error(err);
      }
    };

    getTodos();
  }, []);

  const markTodoAsDone = async (todo) => {
    try {
      // first, we have to modify the todo status in our database
      const response = await fetch(`http://localhost:5500/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      const updatedTodo = await response.json();
      dispatch(updateTodo(updatedTodo));
    } catch (err) {
      console.error(err);
    }
  };

  const providerValue = {
    todos: state,
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
