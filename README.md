# TODO List App

A full-stack To-Do List application built with **React**, **Node.js**, and **TypeScript**.

## 🚀 Live Demo

- **Frontend:** https://waffer-mu.vercel.app/
- **Backend API:** https://waffer-9hrm.onrender.com

---

## Features

- ✅ **User Authentication** – Register and log in with JWT-based auth
- ✅ **Home Page** – Preview your latest 4 tasks with status indicators
- ✅ **View All Page** – See all tasks in a responsive grid
- ✅ **Add Task Page** – Create new tasks with title, description, and status
- ✅ **Task Detail Page** – Edit or delete individual tasks
- ✅ **Toggle Complete** – Mark tasks complete/incomplete from any page
- ✅ **Filter** – Filter tasks by All / Complete / Incomplete
- ✅ **Sort** – Sort tasks by Date, Name, or Status
- ✅ **Search** – Search tasks by name in real time
- ✅ **Responsive Design** – Works on all screen sizes
- ✅ **Per-user data** – Each user only sees their own tasks

---
## Running Locally

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd TODO
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGO_DATABASE=Todo
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev      # Development (hot reload)
# or
npm start        # Production (builds then runs)
```

The API will be available at `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

### Auth

| Method | Endpoint             | Description          | Auth Required |
|--------|----------------------|----------------------|---------------|
| POST   | `/api/auth/register` | Create a new account | No            |
| POST   | `/api/auth/login`    | Log in               | No            |

### Todos

| Method | Endpoint          | Description              | Auth Required |
|--------|-------------------|--------------------------|---------------|
| GET    | `/api/todos`      | Get all todos (own only) | Yes           |
| GET    | `/api/todos/:id`  | Get a single todo        | Yes           |
| POST   | `/api/todos`      | Create a new todo        | Yes           |
| PUT    | `/api/todos/:id`  | Update a todo            | Yes           |
| DELETE | `/api/todos/:id`  | Delete a todo            | Yes           |

---

## Deployment

## License

MIT
