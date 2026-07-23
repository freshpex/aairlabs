import reducer, { restored, taskAdded, taskUpdated } from "@/store/tasksSlice";

describe("tasks reducer", () => {
  it("adds and completes a task", () => {
    let state = reducer(undefined, restored([]));
    state = reducer(state, taskAdded({ title: "Read", source: "manual" }));
    const id = state.items[0]?.id ?? "";
    expect(state.items[0]?.title).toBe("Read");
    state = reducer(state, taskUpdated({ id, changes: { completed: true } }));
    expect(state.items[0]?.completed).toBe(true);
  });
});
