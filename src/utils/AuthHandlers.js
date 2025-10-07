// import { jwtDecode } from "jwt-decode";
import { validateEmail } from "./validators.js";
import { googleLogout } from "@react-oauth/google";

export async function handleEmailSignIn({
	e,
	email,
	password,
	setErrors,
	setIsLoading,
	navigate,
}) {
	e.preventDefault();

	if (!email || !password) {
		const errs = {};
		if (!email) errs.email = "Email is required";
		if (!password) errs.password = "Password is required";
		setErrors(errs);
		return;
	}

	if (!validateEmail(email)) {
		setErrors({ email: "Please enter a valid email address" });
		return;
	}

	setIsLoading(true);
	setErrors({});

	try {
		const response = await fetch(
			"https://verinest.up.railway.app/api/auth/login",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
				credentials: "include",
			}
		);

		const data = await response.json();

		if (response.ok && data.status === "success") {
			localStorage.setItem("token", data.token); // backend should be returning this
			navigate("/dashboard");
		} else {
			setErrors({ form: data.message || "Sign in failed" });
		}
	} catch (err) {
		setErrors({
			form: "Network error during sign in",
			details: err.message,
		});
	} finally {
		setIsLoading(false);
	}
}

export async function handleEmailSignUp({
	e,
	fullName,
	userName,
	signUpEmail,
	signUpPassword,
	confirmPassword,
	setErrors,
	referralCode,
	setIsLoading,
	toggleEmailVerify,
	toggleEmailSignUp,
}) {
	e.preventDefault();

	if (!fullName) {
		setErrors({ fullName: "Full name is required" });
		return;
	}
	if (!userName) {
		setErrors({ userName: "Username is required" });
		return;
	}
	if (!signUpEmail) {
		setErrors({ email: "Email is required" });
		return;
	}
	if (!validateEmail(signUpEmail)) {
		setErrors({ email: "Invalid email format" });
		return;
	}
	if (!signUpPassword) {
		setErrors({ password: "Password is required" });
		return;
	}
	if (signUpPassword !== confirmPassword) {
		setErrors({ confirmPassword: "Passwords do not match" });
		return;
	}

	setIsLoading(true);
	setErrors({});

	try {
		const response = await fetch(
			"https://verinest.up.railway.app/api/auth/register",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: fullName,
					username: userName,
					email: signUpEmail,
					password: signUpPassword,
					passwordConfirm: confirmPassword,
					referral_code: referralCode || undefined,
				}),
				credentials: "include", // ensure cookie is included
			}
		);

		const data = await response.json();

		if (response.ok) {
			toggleEmailSignUp();
			toggleEmailVerify();
		} else if (response.status === 409) {
			// Account already exists
			setErrors({
				form: data.message || "Account already exists. Please sign in.",
			});
		} else {
			// Handle sign up error
			setErrors({ form: data.message || "Sign-up failed" });
			return;
		}
	} catch (err) {
		setErrors({
			form: "Network error during sign up",
			details: err.message,
		});
	} finally {
		setIsLoading(false);
	}
}

export async function handleGoogleSignIn({
	setErrors,
	setIsLoading,
	setUser,
	navigate,
	idToken,
}) {
	setIsLoading(true);
	setErrors({});

	try {
		const response = await fetch(
			"https://verinest.up.railway.app/api/oauth/google",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token: idToken,
				}),
			}
		);

		if (!response.ok) {
			setErrors({ googleAuth: data.message || "Google sign-in failed" });
			return;
		}

		const data = await response.json();

		setUser(data.user);
		localStorage.setItem("token", data.token);
		navigate("/dashboard");
	} catch (err) {
		setErrors({ googleAuth: err.message || "Google sign-in failed" });
	} finally {
		setIsLoading(false);
	}
}

export function handleSignOut({ setUser, navigate }) {
	try {
		setUser(null);
		localStorage.removeItem("token");
		googleLogout();
		navigate("/login");
	} catch (err) {
		console.error("Error signing out:", err.message);
	}
}
