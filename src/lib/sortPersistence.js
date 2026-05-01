import { members as ALL_MEMBERS } from "../data/members";

const KEY = "klp48.sortSession.v1";

let warnedSaveFailed = false;

const idsOf = (arr) => arr.map((m) => m.id);

const hydrate = (() => {
  let map;
  return (ids) => {
    if (!map) map = new Map(ALL_MEMBERS.map((m) => [m.id, m]));
    return ids.map((id) => map.get(id)).filter(Boolean);
  };
})();

const compactSnapshot = (h) => ({
  stack: h.stack.map(idsOf),
  left: idsOf(h.left),
  right: idsOf(h.right),
  merged: idsOf(h.merged),
  comparisons: h.comparisons,
});

const rehydrateSnapshot = (h) => ({
  stack: h.stack.map(hydrate),
  left: hydrate(h.left),
  right: hydrate(h.right),
  merged: hydrate(h.merged),
  comparisons: h.comparisons,
});

export function saveSession(state, sessionMembers) {
  if (state.done) return;
  if (state.comparisons === 0) return;

  const data = {
    v: 1,
    savedAt: Date.now(),
    sessionMemberIds: idsOf(sessionMembers),
    state: {
      ...compactSnapshot(state),
      history: state.history.map(compactSnapshot),
    },
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (err) {
    if (!warnedSaveFailed) {
      warnedSaveFailed = true;
      console.warn(
        "[sortPersistence] Could not save session — resume will not be available. " +
        "Likely cause: localStorage unavailable (private mode) or quota exceeded.",
        err
      );
    }
  }
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.v !== 1 || !data.state) return null;

    const sessionMembers = hydrate(data.sessionMemberIds);
    if (sessionMembers.length < 2 ||
        sessionMembers.length !== data.sessionMemberIds.length) {
      // Member list shape changed (renamed/removed) — abandon the session.
      return null;
    }

    const state = {
      ...rehydrateSnapshot(data.state),
      history: (data.state.history || []).map(rehydrateSnapshot),
      done: false,
      ranking: null,
    };
    return { state, sessionMembers, savedAt: data.savedAt };
  } catch {
    return null;
  }
}

export function clearSession() {
  try { localStorage.removeItem(KEY); } catch {}
}

/** Lightweight read for Home — metadata only, no member rehydration. */
export function peekSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.v !== 1) return null;
    const total = data.sessionMemberIds.length;
    if (total < 2) return null;
    const estimated = Math.ceil(total * Math.log2(total));
    const comparisons = data.state.comparisons;
    const progress = Math.min(100, Math.round((comparisons / estimated) * 100));
    return { total, comparisons, progress, savedAt: data.savedAt };
  } catch {
    return null;
  }
}

/** Compare two member arrays by id, order-independent. */
export function memberIdsMatch(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  const aIds = new Set(a.map((m) => m.id));
  for (const m of b) if (!aIds.has(m.id)) return false;
  return true;
}
