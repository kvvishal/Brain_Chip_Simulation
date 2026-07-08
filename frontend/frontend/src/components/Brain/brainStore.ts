import { create } from "zustand";

interface BrainState {
  selected: number | null;
  setSelected: (id: number | null) => void;
}

export const useBrainStore = create<BrainState>((set) => ({
  selected: null,
  setSelected: (id) => set({ selected: id }),
}));