import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TodoProvider from './context/TodoContext';
import { App } from './components';

ReactDOM.render(
  <React.StrictMode>
    {/* hey react, we want to supply any children that our provider wraps with the data that we placed on our provider component */}
    <TodoProvider>
      <App />
    </TodoProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
