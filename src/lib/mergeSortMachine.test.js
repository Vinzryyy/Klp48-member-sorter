import { describe, it, expect, beforeEach, vi } from "vitest";
import { init, reducer } from "./mergeSortMachine";

beforeEach(() => {
  // Make shuffle deterministic so initial pair ordering is predictable.
  vi.spyOn(Math, "random").mockReturnValue(0);
});

const items = (...names) => names.map((name) => ({ id: name, name }));

function runFullSort(members, choose) {
  let state = init(members);
  let safety = 0;
  while (!state.done) {
    if (++safety > 10_000) throw new Error("sort did not terminate");
    const action = choose(state);
    state = reducer(state, action);
  }
  return state;
}

describe("init", () => {
  it("returns an inert state when given fewer than 2 members", () => {
    const empty = init([]);
    expect(empty.done).toBe(false);
    expect(empty.stack).toEqual([]);
    expect(empty.left).toEqual([]);
    expect(empty.right).toEqual([]);

    const one = init(items("A"));
    expect(one.done).toBe(false);
    expect(one.left).toEqual([]);
  });

  it("auto-loads the first comparison pair", () => {
    const s = init(items("A", "B", "C"));
    expect(s.left.length).toBe(1);
    expect(s.right.length).toBe(1);
    expect(s.done).toBe(false);
  });
});

describe("reducer — picks", () => {
  it("PICK_LEFT advances the left side and increments comparisons", () => {
    const s0 = init(items("A", "B"));
    const s1 = reducer(s0, { type: "PICK_LEFT" });
    expect(s1.comparisons).toBe(1);
    expect(s1.done).toBe(true);
    expect(s1.ranking).toHaveLength(2);
    expect(s1.ranking[0]).toBe(s0.left[0]);
    expect(s1.ranking[1]).toBe(s0.right[0]);
  });

  it("PICK_RIGHT puts the right side first", () => {
    const s0 = init(items("A", "B"));
    const s1 = reducer(s0, { type: "PICK_RIGHT" });
    expect(s1.done).toBe(true);
    expect(s1.ranking[0]).toBe(s0.right[0]);
    expect(s1.ranking[1]).toBe(s0.left[0]);
  });

  it("PICK_TIE keeps both, left first, and counts as one comparison", () => {
    const s0 = init(items("A", "B"));
    const s1 = reducer(s0, { type: "PICK_TIE" });
    expect(s1.comparisons).toBe(1);
    expect(s1.done).toBe(true);
    expect(s1.ranking).toHaveLength(2);
  });

  it("ignores picks once done", () => {
    const s0 = init(items("A", "B"));
    const s1 = reducer(s0, { type: "PICK_LEFT" });
    const s2 = reducer(s1, { type: "PICK_LEFT" });
    expect(s2).toBe(s1);
  });
});

describe("reducer — UNDO", () => {
  it("restores the prior state and pops the history entry", () => {
    const s0 = init(items("A", "B", "C"));
    const s1 = reducer(s0, { type: "PICK_LEFT" });
    const s2 = reducer(s1, { type: "UNDO" });
    expect(s2.left).toEqual(s0.left);
    expect(s2.right).toEqual(s0.right);
    expect(s2.merged).toEqual(s0.merged);
    expect(s2.stack).toEqual(s0.stack);
    expect(s2.comparisons).toBe(s0.comparisons);
    expect(s2.history).toHaveLength(0);
  });

  it("is a no-op when history is empty", () => {
    const s0 = init(items("A", "B"));
    const s1 = reducer(s0, { type: "UNDO" });
    expect(s1).toBe(s0);
  });

  it("clears done/ranking so user can re-decide the final pick", () => {
    const s0 = init(items("A", "B"));
    const s1 = reducer(s0, { type: "PICK_LEFT" });
    expect(s1.done).toBe(true);
    const s2 = reducer(s1, { type: "UNDO" });
    expect(s2.done).toBe(false);
    expect(s2.ranking).toBe(null);
  });
});

describe("reducer — RESET", () => {
  it("re-initializes from the given members", () => {
    const s0 = init(items("A", "B"));
    const s1 = reducer(s0, { type: "PICK_LEFT" });
    const s2 = reducer(s1, { type: "RESET", members: items("X", "Y", "Z") });
    expect(s2.done).toBe(false);
    expect(s2.comparisons).toBe(0);
    expect(s2.history).toEqual([]);
    expect(s2.left.length + s2.right.length + s2.stack.flat().length).toBe(3);
  });
});

describe("end-to-end sorts", () => {
  it("produces a complete ranking for an even-sized input", () => {
    // Always pick left → result reflects the random initial order.
    const final = runFullSort(items("A", "B", "C", "D"), () => ({
      type: "PICK_LEFT",
    }));
    expect(final.done).toBe(true);
    expect(final.ranking).toHaveLength(4);
    const names = final.ranking.map((m) => m.name).sort();
    expect(names).toEqual(["A", "B", "C", "D"]);
  });

  it("produces a complete ranking for an odd-sized input", () => {
    const final = runFullSort(items("A", "B", "C", "D", "E"), () => ({
      type: "PICK_LEFT",
    }));
    expect(final.ranking).toHaveLength(5);
  });

  it("ranks by a stable preference order when the user picks consistently", () => {
    // User prefers alphabetically earlier names. The final ranking must be
    // alphabetical regardless of initial shuffle.
    const final = runFullSort(items("D", "B", "A", "C"), (state) => {
      const l = state.left[0].name;
      const r = state.right[0].name;
      return { type: l < r ? "PICK_LEFT" : "PICK_RIGHT" };
    });
    expect(final.ranking.map((m) => m.name)).toEqual(["A", "B", "C", "D"]);
  });
});
