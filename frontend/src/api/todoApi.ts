import axios from 'axios';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../types/todo';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllTodos = async (): Promise<Todo[]> => {
  const res = await api.get('/todos');
  return res.data.data;
};

export const getTodoById = async (id: string): Promise<Todo> => {
  const res = await api.get(`/todos/${id}`);
  return res.data.data;
};

export const createTodo = async (data: CreateTodoDto): Promise<Todo> => {
  const res = await api.post('/todos', data);
  return res.data.data;
};

export const updateTodo = async (id: string, data: UpdateTodoDto): Promise<Todo> => {
  const res = await api.put(`/todos/${id}`, data);
  return res.data.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/todos/${id}`);
};
