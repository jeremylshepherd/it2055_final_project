import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import { Task } from './types/Task';
import { ObjectId } from 'mongodb';

dotenv.config();

const uri: string = process.env.DB_URL ?? '';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let connection;

try {
    connection = await client.connect();
    console.log("Connected to MongoDB");
} catch (error) {
    console.error("Failed to connect to MongoDB", error);
}

const db = connection?.db("it2055_final_project");

const taskCollection = db?.collection("todos");

async function createTask(task: Task): Promise<Task | null> {
    if (!taskCollection) {
        throw new Error("taskCollection is undefined");
    }

    const result = await taskCollection.insertOne(task);
    return taskCollection.findOne({ _id: result.insertedId }) as Promise<Task | null>;
}

async function getTaskById(id: string): Promise<Task | null> {
    if (!taskCollection) {
        throw new Error("taskCollection is undefined");
    }
    const result = await taskCollection.findOne({ _id: new ObjectId(id) });
    return result as Task | null;
}

async function updateTask(id: string, updatedTask: Task): Promise<Task | null> {
    if (!taskCollection) {
        throw new Error("taskCollection is undefined");
    }
    const result = await taskCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedTask }
    );
    return result?.value as Task | null;
}

async function deleteTask(id: string): Promise<boolean> {
    if (!taskCollection) {
        throw new Error("taskCollection is undefined");
    }
    const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
}

async function getTasks(): Promise<Task[]> {
    if (!taskCollection) {
        throw new Error("taskCollection is undefined");
    }
    const result = await taskCollection.find().toArray();
    return result.map((task) => task as unknown as Task);
}

async function getRecentTasks(): Promise<Task[]> {
    if (!taskCollection) {
        throw new Error("taskCollection is undefined");
    }
    const query = { created: { $gte: new Date("2024-01-01T05:00:01.103Z").toISOString() }};
    const result = await taskCollection.find(query).toArray();
    return result.map((task) => task as unknown as Task);
}

async function getCompletedTasks(): Promise<Task[]> {
    if (!taskCollection) {
        throw new Error("taskCollection is undefined");
    }
    const query = { completed: { $eq: true }};
    const result = await taskCollection.find(query).toArray();
    return result.map((task) => task as unknown as Task);
}

export { createTask, getTaskById, updateTask, deleteTask, getTasks, getRecentTasks, getCompletedTasks};