import { useEffect } from "react";
import { useBearStore } from "./use-bear-store";

export function useDarkMode() {
	const setDarkMode = useBearStore((state) => state.setDarkMode);
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (event: MediaQueryListEvent) => {
			if (event.matches) {
				setDarkMode(true);
				document.body.classList.add("dark");
			} else {
				setDarkMode(false);
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
	}, [setDarkMode]);
}
