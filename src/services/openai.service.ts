import { env } from "@/config/env";
import { CreateTaskInput } from "@/types/task";
import { parseTaskText, validateTaskDraft } from "@/utils/taskParser";

export interface AIProvider {
  splitTasks(transcript: string): Promise<CreateTaskInput[]>;
}
const responseSchema = (value: unknown): CreateTaskInput[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): CreateTaskInput[] => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("title" in item) ||
      typeof item.title !== "string"
    )
      return [];
    const draft = {
      title: item.title,
      description:
        "description" in item && typeof item.description === "string"
          ? item.description
          : undefined,
      source: "ai" as const,
    };
    return validateTaskDraft(draft) ? [] : [draft];
  });
};
export class OpenAIProvider implements AIProvider {
  async splitTasks(transcript: string): Promise<CreateTaskInput[]> {
    if (!env.openAiApiKey) return parseTaskText(transcript);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.openAiApiKey}`,
      },
      body: JSON.stringify({
        model: env.openAiModel,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'Return JSON only in the shape {"tasks":[{"title":"...","description":"..."}]}. Split each actionable intent into one task. Do not invent details.',
          },
          { role: "user", content: transcript },
        ],
      }),
    });
    if (!response.ok) throw new Error("AI request failed");
    const payload: unknown = await response.json();
    const content =
      typeof payload === "object" &&
      payload !== null &&
      "choices" in payload &&
      Array.isArray(payload.choices) &&
      payload.choices[0] &&
      typeof payload.choices[0] === "object" &&
      "message" in payload.choices[0] &&
      payload.choices[0].message &&
      typeof payload.choices[0].message === "object" &&
      "content" in payload.choices[0].message &&
      typeof payload.choices[0].message.content === "string"
        ? payload.choices[0].message.content
        : "{}";
    try {
      const parsed: unknown = JSON.parse(content);
      return responseSchema(
        typeof parsed === "object" && parsed !== null && "tasks" in parsed
          ? parsed.tasks
          : parsed,
      );
    } catch {
      return parseTaskText(transcript);
    }
  }
}
export const aiProvider: AIProvider = new OpenAIProvider();
