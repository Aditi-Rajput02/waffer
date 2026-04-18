import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Todo } from '../types/todo';
import { getAllTodos, updateTodo } from '../api/todoApi';
import { useAuth } from '../context/AuthContext';
import '../styles/HomePage.css';

const HomePage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getAllTodos();
      setTodos(data);
    } catch {
      setError('Failed to load tasks. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const updated = await updateTodo(todo._id, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch {
      setError('Failed to update task.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const previewTodos = todos.slice(0, 4);

  return (
    <div className="home-container">
      {/* User bar */}
      <div className="user-bar">
        <span className="user-greeting">👋 Hello, <strong>{user?.username}</strong></span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <h1 className="home-title">
        <span className="title-todo">TODO</span>{' '}
        <span className="title-list">LIST</span>
      </h1>

      {loading && <p className="loading-text">Loading tasks...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          <div className="todo-list">
            {previewTodos.length === 0 ? (
              <p className="empty-text">No tasks yet. Add one!</p>
            ) : (
              previewTodos.map((todo) => (
                <div key={todo._id} className="todo-card">
                  <button
                    className={`check-btn ${todo.completed ? 'completed' : ''}`}
                    onClick={() => handleToggleComplete(todo)}
                    title={todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                  <div className="todo-info">
                    <h3 className="todo-title">{todo.title}</h3>
                    <p className="todo-desc">
                      {todo.description.length > 80
                        ? todo.description.slice(0, 80) + ' ...'
                        : todo.description}
                    </p>
                  </div>
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/task/${todo._id}`)}
                  >
                    VIEW
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="home-actions">
            <button className="view-all-link" onClick={() => navigate('/all')}>
              View All
            </button>
            <button className="add-todo-btn" onClick={() => navigate('/add')}>
              Add Todo{' '}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
