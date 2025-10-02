import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { handleEmailSignIn } from "../utils/AuthHandlers.js";
import ErrorMessage from "./ErrorMessage";
import GoogleSignInButton from "./GoogleSignInButton.jsx";

export default function EmailSignIn({ toggleEmailSignIn, toggleEmailSignUp }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const { setUser } = useAuth();
	const navigate = useNavigate();

	const handleSignUpClick = () => {
		if (isLoading) return;

		toggleEmailSignIn();
		toggleEmailSignUp();
	};

	return (
		<>
			<div
				onClick={() => {
					!isLoading && toggleEmailSignIn();
				}}
				className="absolute flex bg-[#d1cfcfc0] w-full h-full"
			></div>

			<div className="absolute inset-0 bg-white rounded-2xl p-8 w-sm max-w-sm m-auto h-fit max-h-full shadow-[0_0_20px_#00000020] overflow-y-scroll no-scrollbar">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-2xl font-semibold blue-text mb-2">
						Sign into VeriNest
					</h1>
					<p className="text-gray-600">
						You're one step towards getting better!
					</p>
				</div>

				{/* Google sign-in with shared error system */}
				<div className="w-full mb-4 text-center hover:bg-gray-50 transition-colors flex-col items-center space-y-1">
					<GoogleSignInButton
					// setErrors={setErrors}
					// setIsLoading={setIsLoading}
					// setUser={setUser}
					// navigate={navigate}
					/>

					{errors.googleAuth && (
						<ErrorMessage message={errors.googleAuth} />
					)}
				</div>

				{/* Divider */}
				<div className="flex items-center mb-4">
					<div className="flex-1 border-t border-gray-300"></div>
					<span className="px-4 text-gray-500 text-sm">or</span>
					<div className="flex-1 border-t border-gray-300"></div>
				</div>

				{/* Sign In Form */}
				<form
					onSubmit={(e) =>
						handleEmailSignIn({
							e,
							email,
							password,
							setErrors,
							setIsLoading,
							navigate,
							setUser,
						})
					}
					className="space-y-4"
				>
					<span className="text-center">
						<ErrorMessage message={errors.form} />
					</span>

					{/* Email Input */}
					<div>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-blue-500 ${
								errors.email
									? "border-red-600"
									: "border-gray-300 focus:ring-1"
							}`}
						/>
						<ErrorMessage message={errors.email} />
					</div>

					{/* Password Input */}
					<div>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
						<ErrorMessage message={errors.password} />
					</div>

					{/* Forgot Password Link */}
					<div className="text-left">
						<button
							type="button"
							className="text-gray-500 text-sm hover:text-gray-700"
						>
							Forgot Password ?
						</button>
					</div>

					{/* Sign In Button */}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full blue-bg text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? "Signing in..." : "Sign in"}
					</button>
				</form>

				{/* Sign Up Link */}
				<div className="text-center mt-6">
					<span className="text-[#929895]">
						Don't have an account?{" "}
					</span>
					<button
						onClick={handleSignUpClick}
						className="blue-text hover:text-blue-700 font-medium"
					>
						Sign up
					</button>
				</div>
			</div>
		</>
	);
}
