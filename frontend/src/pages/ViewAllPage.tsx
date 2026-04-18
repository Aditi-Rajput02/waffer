import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Todo } from '../types/todo';
import { getAllTodos, updateTodo } from '../api/todoApi';
import { useAuth } from '../context/AuthContext';
import '../styles/ViewAllPage.css';

const ViewAllPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'date'>('date');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getAllTodos();
      setTodos(data);
    } catch {
      setError('Failed to load tasks.');
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

  const filtered = todos
    .filter((t) => {
      if (filter === 'complete') return t.completed;
      if (filter === 'incomplete') return !t.completed;
      return true;
    })
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'status') return Number(b.completed) - Number(a.completed);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="viewall-container">
      <div className="user-bar">
        <span className="user-greeting">👋 Hello, <strong>{user?.username}</strong></span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <h1 className="home-title">
        <span className="title-todo">TODO</span>{' '}
        <span className="title-list">LIST</span>
      </h1>

      <div className="controls">
        <input
          className="search-input"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-sort">
          <select
            className="select-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'complete' | 'incomplete')}
          >
            <option value="all">All</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
          </select>
          <select
            className="select-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'status' | 'date')}
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {loading && <p className="loading-text">Loading tasks...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="grid">
          {filtered.length === 0 ? (
            <p className="empty-text">No tasks found.</p>
          ) : (
            filtered.map((todo) => (
              <div key={todo._id} className="grid-card">
                <button
                  className={`check-btn ${todo.completed ? 'completed' : ''}`}
                  onClick={() => handleToggleComplete(todo)}
                  title={todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
                <h3 className="grid-title">{todo.title}</h3>
                <p className="grid-desc">{todo.description}</p>
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
      )}

      <div className="back-row">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <button className="add-todo-btn" onClick={() => navigate('/add')}>
          Add Todo{' '}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ViewAllPage;
