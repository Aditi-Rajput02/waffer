import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'todo_jwt_secret_key_2024';
const JWT_EXPIRES_IN = '7d';

const generateToken = (userId: string): string =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ success: false, message: 'All fields are required' });
    return;
  }

  if (String(password).length < 6) {
    res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email))) {
    res.status(400).json({ success: false, message: 'Invalid email address' });
    return;
  }

  try {
    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      res.status(409).json({ success: false, message: 'Email already registered' });
      return;
    }

    const user = await User.create({
      username: String(username).trim(),
      email: String(email).toLowerCase().trim(),
      password: String(password),
    });

    const token = generateToken(String(user._id));

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { _id: user._id, username: user.username, email: user.email },
      },
    });
  } catch (err) {
    console.error('[Register]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required' });
    return;
  }

  try {
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(String(password));
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(String(user._id));

    res.json({
      success: true,
      data: {
        token,
        user: { _id: user._id, username: user.username, email: user.email },
      },
    });
  } catch (err) {
    console.error('[Login]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
