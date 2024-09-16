import { createStore } from "@xstate/store";

export const store = createStore(
	{ darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches },
	{
		setDarkMode: {
			darkMode: (_, event: { newState: boolean }) => event.newState,
		},
	},
);
