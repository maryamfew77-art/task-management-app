# TaskFlow — Task Management Application

TaskFlow is a full-stack task and project management application designed to help users organize their work, manage projects, track progress, and monitor deadlines through a clean, responsive dashboard.

## Live Demo

- **Live Website:** `YOUR_DEPLOYED_FRONTEND_URL`


## Features

### Task Management
- Create, view, update, and delete tasks.
- Set task status and priority.
- Add task descriptions and due dates.
- Assign tasks to projects.
- Search, filter, sort, and paginate tasks.
- Identify overdue tasks.

### Project Management
- Create, edit, and delete projects.
- Update project status.
- Track task counts and completion progress.
- Preserve tasks when deleting a project.

### Dashboard
- View task and project statistics.
- Monitor task completion and progress.
- Manage tasks and projects from one place.

### Backend and Database
- RESTful API built with Express.js.
- PostgreSQL database for persistent data storage.
- Input validation and error handling.
- User registration and authentication features, where implemented.

## Technologies Used

**Frontend**
- Next.js
- React
- TypeScript
- CSS

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- PostgreSQL

**Development Tools**
- Git and GitHub
- Postman
- pgAdmin

## Project Structure

```text
task-management-app/
├── app/
│   ├── page.tsx
│   ├── projects/
│   │   └── page.tsx
│   └── globals.css
├── lib/
│   └── api.ts
├── backend/
│   ├── app.js
│   ├── db.js
│   └── setupDatabase.js
├── public/
├── package.json
└── README.md
```

## Run Locally

### Prerequisites
- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd task-management-app
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the database

Create a PostgreSQL database and configure the database connection in `backend/db.js`.

Keep database credentials in environment variables and never commit secrets to GitHub.

### 4. Install and initialize the backend

```bash
cd backend
npm install
node setupDatabase.js
```

Run the setup script only if it matches your database initialization process.

### 5. Start the backend

```bash
node app.js
```

The backend uses port `5000` by default.

### 6. Configure the frontend API URL

For local development, the API URL is:

```ts
const API_URL = "http://localhost:5000";
```

For production, configure the frontend to use your deployed backend URL, preferably through a Next.js public environment variable such as `NEXT_PUBLIC_API_URL`.

### 7. Start the frontend

Open a separate terminal in the project root:

```bash
npm run dev
```

Visit `http://localhost:3000` to use TaskFlow locally.

## API Endpoints

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | Retrieve projects |
| POST | `/api/projects` | Create a project |
| PATCH | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

### Other Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check backend status |
| GET | `/api/db-test` | Check database connectivity |
| POST | `/api/auth/register` | Register a user |

## Deployment

TaskFlow requires separate deployment configuration for the frontend, backend, and PostgreSQL database.

1. Deploy the Next.js frontend to a hosting platform that supports Next.js.
2. Deploy the Express.js backend to a Node.js-compatible hosting platform.
3. Configure a hosted PostgreSQL database.
4. Add the required database credentials as backend environment variables.
5. Set the frontend API URL to the deployed backend address.
6. Configure CORS to allow requests from the deployed frontend domain.
7. Test all features on the live website.

**Important:** `localhost` refers to the user's own computer. A deployed website cannot use your local backend, so update the API URL before launch.

## Author

**Maryam Ayub**

Software Engineering Student | Frontend & Full-Stack Development

## License

This project was developed for educational and learning purposes.
