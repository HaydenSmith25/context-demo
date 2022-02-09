import React, { useContext } from "react";
import { TodoContext } from "../context/TodoContext";
import styled from "styled-components";

const Todo = styled.div`
  & {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid black;
    border-radius: 4px;
    margin: 8px;
    padding: 8px;
    width: 300px;
  }
  & h3 {
    margin: 0;
    text-decoration: ${({ completed }) =>
      completed ? "line-through" : "inherit"};
  }
  & label {
    padding: 4px;
  }
`;

function App() {
  const { todos, markTodoAsDone } = useContext(TodoContext);
  return (
    <section>
      {todos.map((todo) => (
        <Todo key={todo.id} completed={todo.completed}>
          <h3>{todo.title}</h3>
          <label htmlFor="completed">
            <input
              type="checkbox"
              name="completed"
              defaultChecked={todo.completed}
              onChange={(e) => {
                markTodoAsDone({ ...todo, completed: e.target.checked });
              }}
            />
          </label>
        </Todo>
      ))}
    </section>
  );
}

export default App;
