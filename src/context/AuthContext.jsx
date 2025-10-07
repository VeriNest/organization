// AuthContext.jsx
import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Fetch current user from backend using httpOnly cookie
	const fetchUser = useCallback(async () => {
		const token = localStorage.getItem("token");

		if (!token) {
			console.log("No token found in localStorage");
			return null;
		}

		try {
			const response = await fetch(
				"https://verinest.up.railway.app/api/users/me",
				{
					credentials: "include",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				console.log("Error is right here", response);
				return null;
			}
			const data = await response.json();
			if (data.status === "success") {
				setUser(data.data.user);
				return data.data.user;
			}
			return null;
		} catch (error) {
			console.error("Error fetching user:", error);
			return null;
		}
	}, [setUser]);

	useEffect(() => {
		(async () => {
			setLoading(true);
			await fetchUser();
			setLoading(false);
		})();
	}, [fetchUser]);

	return (
		<AuthContext.Provider value={{ user, setUser, fetchUser, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
