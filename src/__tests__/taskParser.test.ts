import { parseTaskText, validateTaskDraft } from "@/utils/taskParser";

describe("task parser", () => {
  it("splits natural task lists deterministically", () =>
    expect(parseTaskText("Buy milk and eggs, call Mom")).toHaveLength(3));
  it("rejects blank titles", () =>
    expect(validateTaskDraft({ title: "   " })).toBeTruthy());
  it("preserves emoji and trims whitespace", () =>
    expect(parseTaskText("  Ship package 📦  ")[0]?.title).toBe(
      "Ship package 📦",
    ));
});
