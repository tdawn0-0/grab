import { createStore } from "@xstate/store";

export const useBearStore = createStore(
	{ darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches },
	{
		setDarkMode: {
			darkMode: (_, event: { newState: boolean }) => event.newState,
		},
	},
);
