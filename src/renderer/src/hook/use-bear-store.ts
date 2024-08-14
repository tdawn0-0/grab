import { create } from "zustand";

interface BearState {
	darkMode: boolean;
	setDarkMode: (v: boolean) => void;
}

export const useBearStore = create<BearState>((set) => ({
	darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
	setDarkMode: (v) => set({ darkMode: v }),
}));
