import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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
      completed ? 'line-through' : 'inherit'};
  }
  & label {
    padding: 4px;
  }
`;

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await fetch('http://localhost:5500/todos');
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        console.error(err);
      }
    };

    getTodos();
  }, []);

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
            />
          </label>
        </Todo>
      ))}
    </section>
  );
}

export default App;
