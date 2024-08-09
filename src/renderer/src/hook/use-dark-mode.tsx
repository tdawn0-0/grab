import { useEffect } from "react";

export function useDarkMode() {
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (event: MediaQueryListEvent) => {
			if (event.matches) {
				document.body.classList.add("dark");
			} else {
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
