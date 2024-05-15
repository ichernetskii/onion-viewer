import { App } from "./src/app/app";
import { createRoot } from "react-dom/client";

const $root = document.getElementById("root")!;
const reactRoot = createRoot($root);
reactRoot.render(<App />);

if (process.env.NODE_ENV === "development") {
	// Auto-reload the page on changes
	new EventSource("/esbuild").addEventListener("change", () => location.reload());
}

const preventDefault = (e: Event) => e.preventDefault();
document.addEventListener("dragover",preventDefault);
document.addEventListener("drop", preventDefault);
window.onbeforeunload = () => {
	document.removeEventListener("dragover", preventDefault);
	document.removeEventListener("drop", preventDefault);
}
