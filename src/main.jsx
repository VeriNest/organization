import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App.jsx";

const root = createRoot(document.getElementById("root"));

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then((reg) => console.log("Service worker registered:", reg))
			.catch((err) =>
				console.error("Service worker registration failed:", err)
			);
	});
}

root.render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<GoogleOAuthProvider clientId={clientId}>
					<App />
				</GoogleOAuthProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
);
