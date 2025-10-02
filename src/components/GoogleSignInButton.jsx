import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "/assets/googleicon.svg";
// import { handleGoogleSignIn } from "../utils/AuthHandlers";

export default function GoogleSignInButton() {
	const login = useGoogleLogin({
		flow: "auth-code",
		onSuccess: () => {
			window.location.href =
				"https://verinest.up.railway.app/api/oauth/google";
		},
		onError: () => {
			console.error("Google Sign-In failed");
		},
	});

	return (
			<button
				className="w-full flex items-center justify-center bg-white text-[#2F3431] border border-gray-300 rounded-full px-4 py-2 shadow hover:bg-gray-100"
				type="button"
				onClick={() => login()}
			>
				<img src={GoogleIcon} alt="Google" className="w-5 h-5 mr-2" />
				Sign in with Google
			</button>
	);
}
