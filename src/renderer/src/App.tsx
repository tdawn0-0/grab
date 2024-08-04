import type React from "react";
import "./normalize.css";
import "./global.css";

function App(): React.JSX.Element {
	// const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

	return (
		<>
			<div className="creator">Powered by electron-vite</div>
		</>
	);
}

export default App;
