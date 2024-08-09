import type React from "react";
import "./normalize.css";
import "./global.css";
import { VirtualList } from "./component/virtual-list";
import { useDarkMode } from "./hook/use-dark-mode";

function App(): React.JSX.Element {
	useDarkMode();
	// const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
	return (
		<div className="h-screen w-screen p-2 flex items-center">
			<VirtualList />
		</div>
	);
}

export default App;
