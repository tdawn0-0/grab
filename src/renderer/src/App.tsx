import type React from "react";
import "./normalize.css";
import "./global.css";
import { focusManager } from "@tanstack/react-query";
import { VirtualList } from "./component/virtual-list";
import { useDarkMode } from "./hook/use-dark-mode";

focusManager.setEventListener((handleFocus) => {
	window.addEventListener("focus", handleFocus);
	return () => {
		window.removeEventListener("focus", handleFocus);
	};
});

function App(): React.JSX.Element {
	useDarkMode();
	return (
		<div className="h-screen w-screen p-2 flex items-center">
			<VirtualList />
		</div>
	);
}

export default App;
