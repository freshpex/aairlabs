import { CreateTaskInput } from "@/types/task";

const SPLIT_PATTERN =
  /\s*(?:,|\band then\b|\bthen\b|\bafter that\b|\band\b)\s*/gi;
const clean = (value: string): string => value.replace(/\s+/g, " ").trim();

/** Deterministic offline parser used when AI is unavailable or returns invalid data. */
export const parseTaskText = (text: string): CreateTaskInput[] =>
  clean(text)
    .split(SPLIT_PATTERN)
    .map(clean)
    .filter(Boolean)
    .map((title) => ({ title, source: "voice" as const }));

export const validateTaskDraft = (draft: CreateTaskInput): string | null => {
  const title = draft.title.trim();
  if (!title) return "Add a title before saving.";
  if (title.length > 160) return "Titles must be 160 characters or fewer.";
  if ((draft.description ?? "").length > 2000)
    return "Descriptions must be 2,000 characters or fewer.";
  return null;
};
