export const env = {
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  openAiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
} as const;
