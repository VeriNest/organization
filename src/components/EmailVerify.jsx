import EmailIcon from "/assets/emailicon.svg";

export default function VerifyEmail({
	signUpEmail,
	toggleEmailSignIn,
	toggleEmailVerify,
}) {
	// OTP send/resend handlers
	// const [showOtp, setShowOtp] = useState(false);
	// const [otp, setOtp] = useState(["", "", "", ""]);
	// const [message, setMessage] = useState("");
	// const [resendMessage, setResendMessage] = useState("");
	// const [resendLoading, setResendLoading] = useState(false);

	// const handleOtpChange = (value, index) => {
	// 	if (/^[0-9]?$/.test(value)) {
	// 		const newOtp = [...otp];
	// 		newOtp[index] = value;
	// 		setOtp(newOtp);
	// 		if (value && index < 3) {
	// 			document.getElementById(`otp-${index + 1}`).focus();
	// 		}
	// 	}
	// };

	// const handleVerify = async () => {
	// 	const code = otp.join("");
	// 	if (code.length !== 4) {
	// 		setMessage("Enter the full 4-digit code");
	// 		return;
	// 	}

	// 	setIsLoading(true);
	// 	setMessage("");

	// 	try {
	// 		const res = await fetch(
	// 			"https://verinest.up.railway.app/api/auth/verify",
	// 			{
	// 				method: "POST",
	// 				headers: { "Content-Type": "application/json" },
	// 				body: JSON.stringify({ otp: code }),
	// 			}
	// 		);

	// 		const data = await res.json();

	// 		if (res.ok) {
	// 			setMessage("Verification successful");
	// 		} else {
	// 			setMessage(data?.message || "Verification failed");
	// 		}
	// 	} catch (err) {
	// 		console.error("OTP verification error:", err);
	// 		setMessage("Network error");
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	// const handleResendOTP = async () => {
	// 	try {
	// 		setResendLoading(true);
	// 		setResendMessage("");
	// 		const res = await fetch(
	// 			"https://verinest.up.railway.app/api/auth/register",
	// 			{
	// 				method: "POST",
	// 				headers: { "Content-Type": "application/json" },
	// 				body: JSON.stringify({ signUpEmail }), // only email
	// 			}
	// 		);

	// 		if (!res.ok) throw new Error("Failed to resend OTP");

	// 		setResendMessage("OTP resent successfully");
	// 		console.error(resendMessage);
	// 	} catch (err) {
	// 		console.error("OTP verification error:", err);
	// 		setResendMessage("Error resending OTP");
	// 	} finally {
	// 		setResendLoading(false);
	// 	}
	// };

	const handleReturnSignIn = () => {
		toggleEmailVerify();
		toggleEmailSignIn();
	};

	return (
		<>
			<div
				onClick={() => {
					toggleEmailVerify();
				}}
				className="absolute flex bg-[#d1cfcfc0] w-full h-screen"
			></div>
			<div className="absolute inset-0 bg-white rounded-2xl p-8 w-sm max-w-sm m-auto h-fit shadow-[0_0_20px_#00000020] text-center">
				<div className="flex justify-center mb-4">
					<img src={EmailIcon} alt="Email icon" />
				</div>
				<h2 className="text-xl font-semibold mb-2">Check your email</h2>
				<p className="text-gray-500 mb-4">
					We sent a verification mail to <br />
					<span className="font-medium text-gray-900">
						{signUpEmail}
					</span>
				</p>

				{/* ====In case of OTP, uncomment code below==== */}

				{/* {!showOtp ? (
					<>
						<button
							onClick={() => setShowOtp(true)}
							className="w-full py-3 bg-blue-900 text-white rounded-md font-medium"
						>
							Enter code manually
						</button>
					</>
				) : (
					<>
						<div className="flex justify-center gap-2 mb-4">
							{otp.map((digit, index) => (
								<input
									key={index}
									id={`otp-${index}`}
									type="text"
									value={digit}
									maxLength="1"
									onChange={(e) =>
										handleOtpChange(e.target.value, index)
									}
									className="w-12 h-12 rounded-lg text-center text-lg outline-none ring-1 focus:ring-2 ring-blue-500"
								/>
							))}
						</div>
						<button
							onClick={handleVerify}
							disabled={isLoading}
							className="w-full py-3 bg-blue-900 text-white rounded-md font-medium disabled:opacity-50"
						>
							{isLoading ? "Verifying..." : "Verify email"}
						</button>
						{message && (
							<p className="mt-3 text-sm text-gray-700">
								{message}
							</p>
						)}
						<p className="text-sm text-gray-500 mt-3">
							Didn't receive the email?{" "}
							<button
								onClick={handleResendOTP}
								disabled={resendLoading}
								className="text-blue-600 font-medium"
							>
								{resendLoading
									? "Resending..."
									: "Click to resend"}
							</button>
						</p>
					</>
				)} */}
				{/* ==============End of OTP============== */}
				<button
					onClick={handleReturnSignIn}
					className="mt-4 text-gray-500 text-sm"
				>
					Back to log in
				</button>
			</div>
		</>
	);
}
