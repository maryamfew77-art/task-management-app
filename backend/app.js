
import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.send("TaskFlow backend is running!");
});

// Test PostgreSQL connection
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    res.json({
      success: true,
      message: "Database connected successfully!",
      time: result.rows[0].current_time,
    });
  } catch (error) {
    console.error("Database test failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// ==============================
// AUTHENTICATION
// ==============================

// Register a new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

// ==============================
// TASK ROUTES
// ==============================

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        tasks.*,
        projects.name AS project_name,
        users.name AS user_name
      FROM tasks
      LEFT JOIN projects ON tasks.project_id = projects.id
      INNER JOIN users ON tasks.user_id = users.id
      ORDER BY tasks.created_at DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      tasks: result.rows,
    });
  } catch (error) {
    console.error("Get tasks error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
});

// Create a task
app.post("/api/tasks", async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      due_date,
      user_id,
      project_id,
    } = req.body;

    if (!title || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Task title and user_id are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks
       (title, description, status, priority, due_date, user_id, project_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        title,
        description || null,
        status || "pending",
        priority || "medium",
        due_date || null,
        user_id,
        project_id || null,
      ]
    );

    res.status(201).json({
      success: true,
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Create task error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
});

// Update a task
app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      priority,
      due_date,
      project_id,
    } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority),
           due_date = COALESCE($5, due_date),
           project_id = COALESCE($6, project_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [
        title ?? null,
        description ?? null,
        status ?? null,
        priority ?? null,
        due_date ?? null,
        project_id ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Update task error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
});

// ==============================
// PROJECT ROUTES
// ==============================

// Get all projects with task counts
app.get("/api/projects", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.*,
        COUNT(t.id)::int AS task_count
      FROM projects p
      LEFT JOIN tasks t ON t.project_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      projects: result.rows,
    });
  } catch (error) {
    console.error("Get projects error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
});

// Create a project
app.post("/api/projects", async (req, res) => {
  try {
    const { name, description, user_id } = req.body;

    if (!name || typeof name !== "string" || !name.trim() || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Project name and user_id are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO projects (name, description, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name.trim(), description || null, user_id]
    );

    res.status(201).json({
      success: true,
      project: result.rows[0],
    });
  } catch (error) {
    console.error("Create project error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
});

// Update project name, description, or status
app.patch("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const allowedStatuses = [
      "not_started",
      "in_progress",
      "completed",
    ];

    if (
      name !== undefined &&
      (typeof name !== "string" || !name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Project name cannot be empty",
      });
    }

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status",
      });
    }

    const result = await pool.query(
      `UPDATE projects
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           status = COALESCE($3, status)
       WHERE id = $4
       RETURNING *`,
      [
        name === undefined ? null : name.trim(),
        description === undefined ? null : description,
        status === undefined ? null : status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      project: result.rows[0],
    });
  } catch (error) {
    console.error("Update project error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
});

// Delete a project but preserve its tasks
app.delete("/api/projects/:id", async (req, res) => {
  let client;

  try {
    client = await pool.connect();
    const { id } = req.params;

    await client.query("BEGIN");

    // Keep tasks but remove their association with this project.
    await client.query(
      "UPDATE tasks SET project_id = NULL WHERE project_id = $1",
      [id]
    );

    const result = await client.query(
      "DELETE FROM projects WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Project deleted successfully. Its tasks were kept.",
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK").catch(() => {});
    }

    console.error("Delete project error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// ==============================
// START SERVER
// ==============================

app.listen(PORT, () => {
  console.log(`TaskFlow backend running at http://localhost:${PORT}`);
});
