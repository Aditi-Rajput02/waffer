# TODO List App

A full-stack To-Do List application built with **React**, **Node.js**, and **TypeScript**.

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

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, TypeScript, Vite, Axios |
| Backend   | Node.js, Express, TypeScript      |
| Database  | MongoDB Atlas                     |
| Auth      | JWT (jsonwebtoken) + bcryptjs     |

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

## Environment Variables

### Backend (`backend/.env`)

| Variable         | Description                       | Required |
|------------------|-----------------------------------|----------|
| `PORT`           | Server port                       | No (5000)|
| `MONGO_URI`      | MongoDB Atlas connection string   | Yes      |
| `MONGO_DATABASE` | Database name                     | No (Todo)|
| `JWT_SECRET`     | Secret key for signing JWT tokens | Yes      |
| `CLIENT_URL`     | Frontend URL (for CORS)           | Yes      |

### Frontend (`frontend/.env`)

| Variable       | Description          | Default                     |
|----------------|----------------------|-----------------------------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## Deployment

### Backend on Render

1. Connect your GitHub repo to Render
2. Set **Root Directory** to `backend`
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `npm start`
5. Add environment variables in Render dashboard:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong random secret
   - `MONGO_DATABASE` — `Todo`
   - `CLIENT_URL` — your deployed frontend URL
   - `NODE_ENV` — `production`

> **Note:** If your local DNS doesn't support SRV lookups, the app uses Google DNS (8.8.8.8) automatically to resolve MongoDB Atlas — no extra config needed.

### Frontend on Netlify / Vercel

1. Set **Root Directory** to `frontend`
2. Set **Build Command**: `npm run build`
3. Set **Publish Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL` — your Render backend URL + `/api` (e.g. `https://todo-backend.onrender.com/api`)
5. Add a redirect rule for SPA routing: `/* → /index.html` (status 200)

---

## License

MIT
