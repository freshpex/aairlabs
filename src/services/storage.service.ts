import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/constants/storage";
import { Task } from "@/types/task";

export interface StorageService {
  loadTasks(): Promise<Task[]>;
  saveTasks(tasks: Task[]): Promise<void>;
  loadTheme(): Promise<"light" | "dark" | "system" | null>;
  saveTheme(theme: "light" | "dark" | "system"): Promise<void>;
}
const parseTasks = (raw: string | null): Task[] => {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? (value as Task[]) : [];
  } catch {
    return [];
  }
};
export const storageService: StorageService = {
  loadTasks: async () =>
    parseTasks(await AsyncStorage.getItem(STORAGE_KEYS.tasks)),
  saveTasks: async (tasks) => {
    await AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
  },
  loadTheme: async () => {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.theme);
    return value === "light" || value === "dark" || value === "system"
      ? value
      : null;
  },
  saveTheme: async (theme) => {
    await AsyncStorage.setItem(STORAGE_KEYS.theme, theme);
  },
};
