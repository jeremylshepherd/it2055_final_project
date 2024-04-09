import express from "express";
import cors from "cors";
import path, { dirname } from 'path';
import morgan from 'morgan';
import { createTask, getTasks, getTaskById, updateTask, deleteTask, getRecentTasks, getCompletedTasks } from "./mongoHelper.js";
import { Task } from "./types/Task";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// const allowedOrigins = ['*'];
// const corsOptions = {
//     origin: allowedOrigins
// };

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* routes */
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '/../views/home.html'));
});

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await getTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

app.get('/api/tasks/recent', async (req, res) => {
    try {
        const tasks = await getRecentTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

app.get('/api/tasks/completed', async (req, res) => {
    try {
        const tasks = await getCompletedTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const newTask: Task = req.body;
        const createdTask = await createTask(newTask);
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ error: "Failed to create task" });
    }
});

app.get('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task: Task | null = await getTaskById(taskId);
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch task" });
    }
});

app.post('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const updatedTask: Task = req.body;
        const result = await updateTask(taskId, updatedTask);
        if (result !== null) {
            res.json({ message: "Task updated successfully" });
        } else {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update task" });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const result = await deleteTask(taskId);
        if (result) {
            res.json({ message: "Task deleted successfully" });
        } else {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});



/* Listen */
app.listen(process.env.PORT, () => {
    console.log(`%cServer listening on ${process.env.PORT}`, "color:green;font-size:20px;font-weight:bold");
});

function getTaskWithQuery(params: string | import("qs").ParsedQs | string[] | import("qs").ParsedQs[]) {
    throw new Error("Function not implemented.");
}
