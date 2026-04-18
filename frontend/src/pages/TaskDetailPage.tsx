import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Todo } from '../types/todo';
import { getTodoById, updateTodo, deleteTodo } from '../api/todoApi';
import { useAuth } from '../context/AuthContext';
import '../styles/TaskDetailPage.css';

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (id) fetchTodo(id);
  }, [id]);

  const fetchTodo = async (todoId: string) => {
    try {
      setLoading(true);
      const data = await getTodoById(todoId);
      setTodo(data);
      setTitle(data.title);
      setDescription(data.description);
      setCompleted(data.completed);
    } catch {
      setError('Failed to load task.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    try {
      setSubmitting(true);
      await updateTodo(id!, { title: title.trim(), description: description.trim(), completed });
      navigate('/');
    } catch {
      setError('Failed to update task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      setDeleting(true);
      await deleteTodo(id!);
      navigate('/');
    } catch {
      setError('Failed to delete task.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="detail-container">
      <div className="user-bar">
        <span className="user-greeting">👋 Hello, <strong>{user?.username}</strong></span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );

  if (!todo) return (
    <div className="detail-container">
      <div className="user-bar">
        <span className="user-greeting">👋 Hello, <strong>{user?.username}</strong></span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <p className="error-text">{error || 'Task not found.'}</p>
    </div>
  );

  return (
    <div className="detail-container">
      <div className="user-bar">
        <span className="user-greeting">👋 Hello, <strong>{user?.username}</strong></span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <h1 className="home-title">
        <span className="title-todo">TODO</span>{' '}
        <span className="title-list">LIST</span>
      </h1>

      <form className="detail-form" onSubmit={handleUpdate}>
        <div className="form-row">
          <div className="finish-col">
            <span className="label">FINISH</span>
            <button
              type="button"
              className={`check-btn large ${completed ? 'completed' : ''}`}
              onClick={() => setCompleted(!completed)}
              title={completed ? 'Mark Incomplete' : 'Mark Complete'}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>

          <div className="fields-col">
            <label className="label">TITLE</label>
            <input
              className="form-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />

            <label className="label">DESCRIPTION</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
            />
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="update-btn" disabled={submitting}>
          {submitting ? 'UPDATING...' : 'UPDATE'}
        </button>
        <button
          type="button"
          className="delete-btn"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'DELETING...' : 'DELETE'}
        </button>
        <button type="button" className="back-link" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </form>
    </div>
  );
};

export default TaskDetailPage;
