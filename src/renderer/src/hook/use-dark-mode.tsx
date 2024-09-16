import { useEffect } from "react";
import { store } from "./store";

export function useDarkMode() {
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (event: MediaQueryListEvent) => {
			if (event.matches) {
				store.send({ type: "setDarkMode", newState: true });
				document.body.classList.add("dark");
			} else {
				store.send({ type: "setDarkMode", newState: false });
				document.body.classList.remove("dark");
			}
		};

		// Initial check
		if (mediaQuery.matches) {
			document.body.classList.add("dark");
		} else {
			document.body.classList.remove("dark");
		}

		// Listen for changes
		mediaQuery.addEventListener("change", handleChange);

		// Cleanup listener on component unmount
		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);
}
