import type React from "react";
import "./normalize.css";
import "./global.css";
import { focusManager } from "@tanstack/react-query";
import { VirtualList } from "./component/virtual-list";
import { useDarkMode } from "./hook/use-dark-mode";

focusManager.setEventListener((handleFocus) => {
	// @ts-ignore
	window.addEventListener("focus", handleFocus);
	return () => {
		// @ts-ignore
		window.removeEventListener("focus", handleFocus);
	};
});

function App(): React.JSX.Element {
	useDarkMode();
	return (
		<div className="h-screen w-screen">
			<VirtualList />
		</div>
	);
}

export default App;
