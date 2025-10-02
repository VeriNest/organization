import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import ErrorMessage from "./ErrorMessage";
import TextInput from "./TextInput";
import { validateEmail } from "../utils/validators";
import { handleEmailSignUp } from "../utils/AuthHandlers";
import GoogleSignInButton from "./GoogleSignInButton";

export default function EmailSignUp({
	toggleEmailSignIn,
	toggleEmailSignUp,
	toggleEmailVerify,
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [fullName, setFullName] = useState("");
	const [userName, setUserName] = useState("");
	const [signUpEmail, setSignUpEmail] = useState("");
	const [signUpPassword, setSignUpPassword] = useState("");
	const [signUpPasswordConfirm, setSignUpPasswordConfirm] = useState("");
	const [referralCode, setReferralCode] = useState("");
	const [signUpEmailError, setSignUpEmailError] = useState("");
	const [signUpPasswordError, setSignUpPasswordError] = useState("");
	const [signUpPasswordConfirmError, setsignUpPasswordConfirmError] =
		useState(false);

	const [errors, setErrors] = useState({});

	// const navigate = useNavigate();
	// const { setUser } = useAuth();

	const handleSignUpEmailChange = (e) => {
		const value = e.target.value;
		setSignUpEmail(value);
		if (value && !validateEmail(value)) {
			setSignUpEmailError("Please enter a valid email address");
		} else {
			setSignUpEmailError("");
		}
	};

	const handleSignUpPasswordChange = (e) => {
		const value = e.target.value;
		setSignUpPassword(value);
		if (value && value.length < 6) {
			setSignUpPasswordError("Password must be at least 6 characters");
		} else {
			setSignUpPasswordError("");
		}
	};

	const handleSignUpPasswordConfirmChange = (e) => {
		const value = e.target.value;
		setSignUpPasswordConfirm(value);
		if (value != signUpPassword) {
			setsignUpPasswordConfirmError("Enter same password as above");
		} else {
			setsignUpPasswordConfirmError("");
		}
	};

	const handleSignInClick = () => {
		if (isLoading) return;

		toggleEmailSignUp();
		toggleEmailSignIn();
	};

	return (
		<>
			<div
				onClick={() => {
					!isLoading && toggleEmailSignUp();
				}}
				className="absolute flex bg-[#d1cfcfc0] w-full h-screen"
			></div>
			<div
				className="absolute inset-0 m-auto bg-white rounded-2xl p-8 w-full max-w-md h-fit max-h-full shadow-2xl overflow-y-scroll no-scrollbar"
				onClick={(e) => e.stopPropagation()}
				style={{ backgroundColor: "#FFFFFF" }}
			>
				{/* Header */}
				<div className="text-center mb-8">
					<h1
						className="text-2xl font-semibold"
						style={{ color: "#2F3431" }}
					>
						Sign up for VeriNest
					</h1>
					<p style={{ color: "#929895" }}>
						You're one step towards getting better!
					</p>
				</div>

				{/* Google sign-in with shared error system */}
				<div className="w-full mb-4 text-center hover:bg-gray-50 transition-colors">
					<GoogleSignInButton
					// setErrors={setErrors}
					// setIsLoading={setIsLoading}
					// setUser={setUser}
					// navigate={navigate}
					/>
					{errors.google && <ErrorMessage message={errors.google} />}
				</div>

				{/* Divider */}
				<div className="flex items-center mb-6">
					<div
						className="flex-1 border-t"
						style={{ borderColor: "#929895" }}
					></div>
					<span className="px-4 text-sm" style={{ color: "#929895" }}>
						or
					</span>
					<div
						className="flex-1 border-t"
						style={{ borderColor: "#929895" }}
					></div>
				</div>

				{/* Sign Up Form */}
				<form
					onSubmit={(e) => {
						handleEmailSignUp({
							e,
							fullName,
							userName,
							signUpEmail,
							signUpPassword,
							signUpPasswordError,
							signUpPasswordConfirm,
							referralCode,
							signUpPasswordConfirmError,
							setSignUpEmailError,
							setIsLoading,
							setErrors,
							toggleEmailVerify,
							toggleEmailSignUp,
						});
					}}
					className="space-y-4"
				>
					<span className="text-center">
						{errors.form && <ErrorMessage message={errors.form} />}
					</span>

					{/* First Name Input */}
					<TextInput
						type="text"
						placeholder="Full Name"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
					/>

					{/* Username Input */}
					<TextInput
						type="text"
						placeholder="Username"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
					/>

					{/* Email Input */}
					<TextInput
						type="email"
						placeholder="Email"
						value={signUpEmail}
						onChange={handleSignUpEmailChange}
						error={signUpEmailError}
					/>

					{/* Password Input */}
					<TextInput
						type="password"
						placeholder="Password"
						value={signUpPassword}
						onChange={handleSignUpPasswordChange}
						error={signUpPasswordError}
					/>

					{/* Confirm Password */}
					<TextInput
						type="password"
						placeholder="Confirm Password"
						value={signUpPasswordConfirm}
						onChange={handleSignUpPasswordConfirmChange}
						error={signUpPasswordConfirmError}
					/>

					{/* Referral Code */}
					<TextInput
						type="text"
						placeholder="Referral Code (Optional)"
						value={referralCode}
						onChange={(e) => setReferralCode(e.target.value)}
					/>

					{/* Terms and Privacy */}
					<div className="text-sm" style={{ color: "#929895" }}>
						By signing up, you agree to the{" "}
						<button
							type="button"
							className="hover:opacity-80"
							style={{ color: "#113C5E" }}
						>
							Terms of Service
						</button>{" "}
						and{" "}
						<button
							type="button"
							className="hover:opacity-80"
							style={{ color: "#113C5E" }}
						>
							Privacy Policy
						</button>
						.
					</div>

					{/* Sign Up Button */}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-3 rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						style={{
							backgroundColor: "#113C5E",
							color: "#FFFFFF",
						}}
					>
						{isLoading ? "Signing up..." : "Sign up"}
					</button>
				</form>

				{/* Sign In Link */}
				<div className="text-center mt-6">
					<span style={{ color: "#929895" }}>
						Already have an account?{" "}
					</span>
					<button
						onClick={handleSignInClick}
						className="blue-text hover:text-blue-700 font-medium"
					>
						Sign in
					</button>
				</div>
			</div>
		</>
	);
}
