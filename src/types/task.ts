export type TaskPriority = "low" | "medium" | "high";
export type TaskSource = "manual" | "voice" | "ai";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority: TaskPriority;
  source: TaskSource;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  source?: TaskSource;
}

export type TaskSort =
  "newest" | "oldest" | "dueDate" | "alphabetical" | "completed" | "incomplete";
