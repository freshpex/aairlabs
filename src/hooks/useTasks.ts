import { useCallback, useEffect, useMemo, useState } from "react";
import { storageService } from "@/services/storage.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  restoreFailed,
  restoreStarted,
  restored,
  taskAdded,
  taskDeleted,
  taskUpdated,
  tasksAdded,
} from "@/store/tasksSlice";
import { CreateTaskInput, Task, TaskSort } from "@/types/task";
import { validateTaskDraft } from "@/utils/taskParser";

export const useTasks = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.tasks);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<TaskSort>("newest");
  const restore = useCallback(() => {
    dispatch(restoreStarted());
    void storageService
      .loadTasks()
      .then((value) => dispatch(restored(value)))
      .catch(() => dispatch(restoreFailed("Could not load your tasks.")));
  }, [dispatch]);
  useEffect(() => {
    restore();
  }, [restore]);
  const persist = useCallback(async (snapshot: typeof items) => {
    try {
      await storageService.saveTasks(snapshot);
    } catch {
      /* best effort; next launch can retry */
    }
  }, []);
  useEffect(() => {
    if (status === "ready") void persist(items);
  }, [items, persist, status]);
  const add = useCallback(
    (input: CreateTaskInput): string | null => {
      const errorMessage = validateTaskDraft(input);
      if (errorMessage) return errorMessage;
      dispatch(taskAdded(input));
      return null;
    },
    [dispatch],
  );
  const addMany = useCallback(
    (inputs: CreateTaskInput[]) => dispatch(tasksAdded(inputs)),
    [dispatch],
  );
  const update = useCallback(
    (id: string, changes: Partial<Task>) =>
      dispatch(taskUpdated({ id, changes })),
    [dispatch],
  );
  const remove = useCallback(
    (id: string) => dispatch(taskDeleted(id)),
    [dispatch],
  );
  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = items.filter(
      (item) =>
        !normalized ||
        `${item.title} ${item.description}`.toLowerCase().includes(normalized),
    );
    return [...result].sort((a, b) => {
      if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
      if (sort === "alphabetical") return a.title.localeCompare(b.title);
      if (sort === "completed")
        return Number(b.completed) - Number(a.completed);
      if (sort === "incomplete")
        return Number(a.completed) - Number(b.completed);
      if (sort === "dueDate")
        return (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [items, query, sort]);
  return {
    items: visibleItems,
    allItems: items,
    status,
    error,
    query,
    setQuery,
    sort,
    setSort,
    add,
    addMany,
    update,
    remove,
    retry: restore,
  };
};
