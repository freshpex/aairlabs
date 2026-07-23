import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateTaskInput, Task } from "@/types/task";

export interface TasksState {
  items: Task[];
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
}
const initialState: TasksState = { items: [], status: "idle", error: null };
const makeTask = (input: CreateTaskInput): Task => {
  const now = new Date().toISOString();
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    completed: false,
    createdAt: now,
    updatedAt: now,
    dueDate: input.dueDate,
    priority: input.priority ?? "medium",
    source: input.source ?? "manual",
  };
};
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    restoreStarted: (state) => {
      state.status = "loading";
      state.error = null;
    },
    restored: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
      state.status = "ready";
    },
    restoreFailed: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
    },
    taskAdded: (state, action: PayloadAction<CreateTaskInput>) => {
      state.items.unshift(makeTask(action.payload));
    },
    taskUpdated: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Task> }>,
    ) => {
      const task = state.items.find((item) => item.id === action.payload.id);
      if (task)
        Object.assign(task, action.payload.changes, {
          updatedAt: new Date().toISOString(),
        });
    },
    taskDeleted: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    tasksAdded: (state, action: PayloadAction<CreateTaskInput[]>) => {
      state.items.unshift(...action.payload.map(makeTask));
    },
  },
});
export const {
  restoreStarted,
  restored,
  restoreFailed,
  taskAdded,
  taskUpdated,
  taskDeleted,
  tasksAdded,
} = tasksSlice.actions;
export default tasksSlice.reducer;
