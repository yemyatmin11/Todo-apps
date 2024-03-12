import './reset.css';
import './App.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import CheckAllAndRemaining from './components/CheckAllAndRemaining';
import TodoFliters from './components/TodoFliters';
import ClearCompletedBtn from './components/ClearCompletedBtn';
import { useCallback, useEffect, useState } from 'react';


function App() {

  let [todos, setTodos] = useState([]);
  let [filteredTodos, setFilteredTodos] = useState(todos);

  useEffect(() => {
    fetch('http://localhost:3001/todos')
    .then((res) => res.json())
    .then((todos) => {
      setTodos(todos);
      setFilteredTodos(todos);
    }); 
  },[])


  let filterBy = useCallback((filter) => {
    if(filter === 'All') {
      setFilteredTodos(todos);
    }
    if(filter === 'Active') {
      setFilteredTodos(todos.filter((t) => !t.completed))
    }
    if(filter === 'Completed') {
      setFilteredTodos(todos.filter((t) => t.completed))
    }
  }, [todos])


  let addTodo = (todo) => {
    fetch('http://localhost:3001/todos', {
      method : "POST",
      headers : {
        'Content-Type': 'application/json' 
      },  
      body : JSON.stringify(todo)
    })
    
    setTodos((prevState) => [...prevState,todo]);
  }


  let deleteTodo = (todoId) => {
    fetch(`http://localhost:3001/todos/${todoId}`,{
      method : "DELETE"
    })
   
    setTodos((prevState) => {
      return prevState.filter((todo) => {
        return todo.id !== todoId
      });
    })
  }


  let updateTodo = (todo) => {
    fetch(`http://localhost:3001/todos/${todo.id}`, {
      method : "PATCH",
      headers : {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(todo)
    })

    setTodos((prevState) => {
      return prevState.map((t) => {
        if(t.id === todo.id) {
          return todo;
        }
        return t;
      });
    })
  }


  let checkAll = () => {
    todos.forEach((t) => {
      t.completed = true;
      updateTodo(t);
    })

    setTodos((prevState) => {
      return prevState.map((t)=> {
        return {...t, completed : true};    
      })
    })
  }


  let remainingCount = todos.filter(t => !t.completed).length;


  let clearCompleted = () => {
    todos.forEach(t => {
      if(t.completed) {
        deleteTodo(t.id);
      }
    })

    setTodos(prevState => {
      return prevState.filter((t) => !t.completed)
    })
  }

  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>

          <TodoForm addTodo={addTodo}/>
          <TodoList todos={filteredTodos} deleteTodo={deleteTodo} updateTodo={updateTodo}/>
          <CheckAllAndRemaining remainingCount={remainingCount} checkAll={checkAll}/>
        
        <div className="other-buttons-container">

          <TodoFliters filterBy={filterBy}/>
          <ClearCompletedBtn clearCompleted={clearCompleted}/>
    
        </div>
      </div>
    </div>
  );
}

export default App;
