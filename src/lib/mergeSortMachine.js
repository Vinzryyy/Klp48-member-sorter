import { shuffle } from "./shuffle";

/**
 * Interactive merge-sort state machine.
 *
 * State shape:
 *   stack       — queue of sorted runs awaiting merge (each run is an array)
 *   left, right — the two runs currently being merged
 *   merged      — accumulator for the in-progress merge
 *   comparisons — number of user choices made
 *   history     — snapshots for undo (pre-action state)
 *   done        — true when only one run remains in stack
 *   ranking     — final sorted array, populated when done
 *
 * Actions: PICK_LEFT, PICK_RIGHT, PICK_TIE, UNDO, RESET.
 *
 * After every action the reducer auto-advances: drains exhausted sides,
 * pushes completed merges back to the stack, and loads the next pair.
 * Components only render the current pair and dispatch user choices.
 */

function snapshot(state) {
  return {
    stack: state.stack,
    left: state.left,
    right: state.right,
    merged: state.merged,
    comparisons: state.comparisons,
  };
}

function autoAdvance(state) {
  let { stack, left, right, merged } = state;

  // Drain remainder when one side is exhausted.
  if (left.length === 0 && right.length > 0) {
    merged = [...merged, ...right];
    right = [];
  } else if (right.length === 0 && left.length > 0) {
    merged = [...merged, ...left];
    left = [];
  }

  // Push completed merge back into the stack.
  if (left.length === 0 && right.length === 0 && merged.length > 0) {
    stack = [...stack, merged];
    merged = [];
  }

  // Load the next pair, or finish.
  if (left.length === 0 && right.length === 0 && merged.length === 0) {
    if (stack.length === 1) {
      return {
        ...state,
        stack,
        left,
        right,
        merged,
        done: true,
        ranking: stack[0],
      };
    }
    if (stack.length >= 2) {
      const [a, b, ...rest] = stack;
      return { ...state, stack: rest, left: a, right: b, merged: [] };
    }
  }

  return { ...state, stack, left, right, merged };
}

export function init(members) {
  if (!members || members.length < 2) {
    return {
      stack: [],
      left: [],
      right: [],
      merged: [],
      comparisons: 0,
      history: [],
      done: false,
      ranking: null,
    };
  }
  const shuffled = shuffle(members);
  const initial = {
    stack: shuffled.map((m) => [m]),
    left: [],
    right: [],
    merged: [],
    comparisons: 0,
    history: [],
    done: false,
    ranking: null,
  };
  return autoAdvance(initial);
}

export function reducer(state, action) {
  switch (action.type) {
    case "PICK_LEFT": {
      if (state.done || state.left.length === 0) return state;
      const after = {
        ...state,
        history: [...state.history, snapshot(state)],
        merged: [...state.merged, state.left[0]],
        left: state.left.slice(1),
        comparisons: state.comparisons + 1,
      };
      return autoAdvance(after);
    }
    case "PICK_RIGHT": {
      if (state.done || state.right.length === 0) return state;
      const after = {
        ...state,
        history: [...state.history, snapshot(state)],
        merged: [...state.merged, state.right[0]],
        right: state.right.slice(1),
        comparisons: state.comparisons + 1,
      };
      return autoAdvance(after);
    }
    case "PICK_TIE": {
      if (state.done || state.left.length === 0 || state.right.length === 0) {
        return state;
      }
      const after = {
        ...state,
        history: [...state.history, snapshot(state)],
        merged: [...state.merged, state.left[0], state.right[0]],
        left: state.left.slice(1),
        right: state.right.slice(1),
        comparisons: state.comparisons + 1,
      };
      return autoAdvance(after);
    }
    case "UNDO": {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return {
        ...state,
        ...prev,
        history: state.history.slice(0, -1),
        done: false,
        ranking: null,
      };
    }
    case "RESET":
      return init(action.members);
    default:
      return state;
  }
}
