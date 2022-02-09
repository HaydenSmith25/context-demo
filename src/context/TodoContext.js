// create the context, which is really an object
// create special component that renders context data
// and makes it availabe to the children of that context
import React, { useReducer, useEffect } from "react";

export const TodoContext = React.createContext();

// let's set up actions for reducer to trigger
// like completing a todo which will be a checkbox check / selection
// users can also uncheck a todo

// variables fail loudly.. makes it more obvious to catch errors
const UPDATE_TODO = "UPDATE_TODO";
const SET_TODO = "SET_TODO";

//status in this case is checked or unchecked
const updateTodo = (todo) => ({
  type: UPDATE_TODO,
  payload: todo,
});

const setTodo = (todos) => ({
  type: SET_TODO,
  payload: todos,
});

//reducer = function with no side effects that listens to incoming actions and switches on their type to modify stateful obj
function todoReducer(state, { type, payload }) {
  //matches cases based on the value provided to param
  switch (type) {
    case SET_TODO:
      return payload;

    case UPDATE_TODO:
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
        const response = await fetch("http://localhost:5500/todos");
        const data = await response.json();
        //updates state by sending action obj through reducer
        dispatch(setTodo(data));
      } catch (err) {
        console.error(err);
      }
    };

    getTodos();
  }, []);

  const markTodoAsDone = async (todo) => {
    try {
      const response = await fetch(`http://localhost:5500/todos${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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

  // allows us to render any reat sub tree inside of TodoContextProvider
  // this will give those downstream components access to the data
  // we place 'on' this provider

  return (
    <TodoContext.Provider value={providerValue}>
      {children}
    </TodoContext.Provider>
  );
}
