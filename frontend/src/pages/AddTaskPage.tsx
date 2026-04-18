import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTodo } from '../api/todoApi';
import { useAuth } from '../context/AuthContext';
import '../styles/AddTaskPage.css';

const AddTaskPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    try {
      setSubmitting(true);
      await createTodo({ title: title.trim(), description: description.trim(), completed });
      navigate('/');
    } catch {
      setError('Failed to create task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-container">
      <div className="user-bar">
        <span className="user-greeting">👋 Hello, <strong>{user?.username}</strong></span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <h1 className="home-title">
        <span className="title-todo">TODO</span>{' '}
        <span className="title-list">LIST</span>
      </h1>

      <form className="add-form" onSubmit={handleSubmit}>
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
              placeholder="TODO TITLE"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />

            <label className="label">DESCRIPTION</label>
            <textarea
              className="form-textarea"
              placeholder="Enter task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
            />
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="update-btn" disabled={submitting}>
          {submitting ? 'ADDING...' : 'ADD TASK'}
        </button>
        <button type="button" className="back-btn-form" onClick={() => navigate('/')}>
          CANCEL
        </button>
      </form>
    </div>
  );
};

export default AddTaskPage;
