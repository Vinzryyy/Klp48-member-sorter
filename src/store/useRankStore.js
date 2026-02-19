import { create } from "zustand";

export const useRankStore = create((set) => ({
  members: [], // Filtered members for the current session
  ranking: [], // Final ranking after sorting
  
  setMembers: (members) => set({ members }),
  setRanking: (ranking) => set({ ranking }),
  
  resetSession: () => set({ ranking: [], members: [] }),
}));
