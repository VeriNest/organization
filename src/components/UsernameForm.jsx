import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import TextInput from "./TextInput";
import ErrorMessage from "./ErrorMessage";

export default function UsernameForm() {
	const { setUser } = useAuth();
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [accepted, setAccepted] = useState(false);
	const navigate = useNavigate();

	async function handleUsernameSubmit(e) {
		e.preventDefault();

		setError("");
		setIsLoading(true);

		if (!username.trim()) {
			setError("Username is required");
			setIsLoading(false);
			return;
		}

		if (!accepted) {
			setError("Tick the box to accept terms of service");
			setIsLoading(false);
			return;
		}

		try {
			// 1. Get token from URL
			const params = new URLSearchParams(window.location.search);
			const token = params.get("token");
			if (!token) {
				setError("Verification token missing");
				setIsLoading(false);
				return;
			}

			// 2. Verify user
			const verifyRes = await fetch(
				`https://verinest.up.railway.app/api/auth/verify?token=${token}`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			const verifyData = await verifyRes.json();

			if (!verifyRes.ok || !verifyData?.data?.user) {
				setError(verifyData?.message || "Email verification failed");
				setIsLoading(false);
				return;
			}

			const verifiedUser = verifyData.data.user;
			setUser({ ...verifiedUser });

			// 3. Skip if username already set
			if (verifiedUser.name) {
				navigate("/Dashboard");
				return;
			}

			// 4. Set username
			const res = await fetch(
				"https://verinest.up.railway.app/api/users/name",
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ name: username }),
				}
			);
			const data = await res.json();

			if (res.ok && data?.data?.user) {
				setUser({ ...data.data.user });
				navigate("/Dashboard");
			} else {
				setError(data?.message || "Failed to set username");
			}
		} catch (err) {
			setError("Network error");
			console.log(err);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<div className="absolute flex bg-[#d1cfcfc0] w-full h-screen"></div>
			<div className="absolute inset-0 m-auto bg-white rounded-2xl p-8 w-full max-w-md h-fit max-h-full shadow-2xl overflow-y-scroll no-scrollbar">
				<Logo />
				<form
					onSubmit={handleUsernameSubmit}
					className="space-y-4 mt-6"
				>
					<div>
						<span className="text-center">
							{error && <ErrorMessage message={error} />}
						</span>

						<TextInput
							id="username"
							type="text"
							placeholder="Enter a username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="tos"
							checked={accepted}
							onChange={(e) => setAccepted(e.target.checked)}
							className="w-4 h-4"
						/>
						<label
							htmlFor="tos"
							className={`text-sm font-normal ${
								!accepted && error
									? "text-red-500"
									: "text-gray-500"
							}`}
						>
							I agree to VeriNest's{" "}
							<a href="/terms" className="underline">
								Terms of Service
							</a>{" "}
							&{" "}
							<a href="/privacy" className="underline">
								Privacy Policy
							</a>
						</label>
					</div>

					<button
						onClick={handleUsernameSubmit}
						className="w-full blue-bg text-white py-3 rounded-lg font-medium "
						disabled={isLoading}
						type="submit"
					>
						{isLoading ? "Processing..." : "LOG IN"}
					</button>
				</form>
			</div>
		</>
	);
}
