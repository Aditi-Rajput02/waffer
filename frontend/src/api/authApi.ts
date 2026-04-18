import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post('/auth/register', { username, email, password });
  return res.data.data;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post('/auth/login', { email, password });
  return res.data.data;
};
