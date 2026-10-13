# TaskFlow — Task Management App

TaskFlow is a full-stack task management application that helps users organize tasks, manage projects, track progress, and stay on top of deadlines through a clean and responsive dashboard.

## Features

### Task Management
- Create, view, update, and delete tasks.
- Set task status and priority.
- Add descriptions and due dates.
- Assign tasks to projects.
- Search and filter tasks.
- Sort and paginate task lists.
- Identify overdue tasks.

### Project Management
- Create, edit, and delete projects.
- Update project status.
- View task counts and project progress.
- Track completed tasks within projects.
- Preserve tasks when a project is deleted.

### Dashboard
- View task and project statistics.
- Monitor task completion and project progress.
- Manage work from a centralized dashboard.

### Additional Features
- REST API built with Express.js.
- PostgreSQL database for persistent storage.
- Input validation and error handling.
- Responsive user interface.
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

**Other Tools**
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

*The structure may vary depending on your final implementation.*

## Getting Started

### Prerequisites

Make sure you have installed:
- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd task-management-app
```

### 2. Set Up the Frontend

Install the dependencies:

```bash
npm install
```

### 3. Set Up the Database

Create a PostgreSQL database and configure your database connection in `backend/db.js`.

Run the database setup script from the backend directory if your project uses it:

```bash
cd backend
npm install
node setupDatabase.js
```

Ensure the required database tables and columns exist before starting the application.

### 4. Configure the Backend

Set the required database connection settings in `backend/db.js`. Keep database credentials out of your public repository.

Start the backend:

```bash
node app.js
```

The backend runs on port `5000` by default.

### 5. Start the Frontend

Open a separate terminal in the project root and run:

```bash
npm run dev
```

Open the application at:

http://localhost:3000

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

### Authentication and Testing

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| GET | `/api/db-test` | Check database connectivity |

## Task Status and Priority

**Task statuses:** Pending, In Progress, Completed

**Task priorities:** Low, Medium, High

**Project statuses:** Not Started, In Progress, Completed

## Future Improvements

- Complete user login and authorization if not yet implemented.
- Deploy the application for public access.
- Add automated testing and improve security.
- Introduce notifications and additional productivity features.

## Author

**Maryam Ayub**

Software Engineering Student | Frontend & Full-Stack Development

## License

This project was developed for learning and educational purposes.
