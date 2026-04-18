import { Router, Response } from 'express';
import mongoose from 'mongoose';
import Todo from '../models/Todo';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(protect);

const isValidId = (id: string | string[]): boolean =>
  mongoose.Types.ObjectId.isValid(String(id));

// GET /api/todos — Get all todos for the logged-in user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: todos });
  } catch (err) {
    console.error('[GET /todos]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/todos/:id — Get a single todo
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  if (!isValidId(req.params.id)) {
    res.status(400).json({ success: false, message: 'Invalid todo ID' });
    return;
  }

  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
    if (!todo) {
      res.status(404).json({ success: false, message: 'Todo not found' });
      return;
    }
    res.json({ success: true, data: todo });
  } catch (err) {
    console.error('[GET /todos/:id]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/todos — Create a new todo
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, completed } = req.body;

  if (!title || String(title).trim() === '') {
    res.status(400).json({ success: false, message: 'Title is required' });
    return;
  }

  if (String(title).trim().length > 100) {
    res.status(400).json({ success: false, message: 'Title must be 100 characters or fewer' });
    return;
  }

  try {
    const todo = await Todo.create({
      title: String(title).trim(),
      description: description ? String(description).trim() : '',
      completed: Boolean(completed) ?? false,
      userId: req.userId,
    });

    res.status(201).json({ success: true, data: todo });
  } catch (err) {
    console.error('[POST /todos]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/todos/:id — Update a todo
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  if (!isValidId(req.params.id)) {
    res.status(400).json({ success: false, message: 'Invalid todo ID' });
    return;
  }

  const { title, description, completed } = req.body;
  const updates: Record<string, unknown> = {};

  if (title !== undefined) {
    if (String(title).trim() === '') {
      res.status(400).json({ success: false, message: 'Title cannot be empty' });
      return;
    }
    updates.title = String(title).trim();
  }
  if (description !== undefined) updates.description = String(description).trim();
  if (completed !== undefined) updates.completed = Boolean(completed);

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ success: false, message: 'No valid fields to update' });
    return;
  }

  try {
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Todo not found' });
      return;
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('[PUT /todos/:id]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/todos/:id — Delete a todo
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  if (!isValidId(req.params.id)) {
    res.status(400).json({ success: false, message: 'Invalid todo ID' });
    return;
  }

  try {
    const deleted = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Todo not found' });
      return;
    }
    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('[DELETE /todos/:id]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
