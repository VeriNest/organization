import { useState } from "react";
import Logo from "./Logo";
import EmailButton from "./EmailButton";
import WalletButton from "./WalletButton";
import ConnectWallet from "./ConnectWallet";
import EmailSignIn from "./EmailSignIn";
import EmailSignUp from "./EmailSignUp";
import EmailVerify from "./EmailVerify";

export default function LoginPage() {
	const [showVerify, setShowVerify] = useState(false);
	function toggleEmailVerify() {
		setShowVerify((prev) => !prev);
	}
	const [showSignIn, setShowSignIn] = useState(false);
	function toggleEmailSignIn() {
		setShowSignIn((prev) => !prev);
	}
	const [showSignUp, setShowSignUp] = useState(false);
	function toggleEmailSignUp() {
		setShowSignUp((prev) => !prev);
	}

	const [showWallet, setShowWallet] = useState(false);
	function toggleConnectWallet() {
		setShowWallet((prev) => !prev);
	}

	return (
		<>
			{showSignUp && (
				<EmailSignUp
					toggleEmailSignIn={toggleEmailSignIn}
					toggleEmailSignUp={toggleEmailSignUp}
					toggleEmailVerify={toggleEmailVerify}
				/>
			)}

			{showVerify && (
				<EmailVerify
					toggleEmailSignIn={toggleEmailSignIn}
					toggleEmailVerify={toggleEmailVerify}
				/>
			)}

			{showSignIn && (
				<EmailSignIn
					toggleEmailSignIn={toggleEmailSignIn}
					toggleEmailSignUp={toggleEmailSignUp}
				/>
			)}

			{showWallet && (
				<ConnectWallet toggleConnectWallet={toggleConnectWallet} />
			)}

			<div className="min-h-screen flex items-center justify-center px-4">
				<div className="w-full  max-w-2xl">
					<div className="space-y-8">
						<div className="text-center space-y-4">
							<Logo />
							<p className="text-[36px] text-black">
								Real estate verified by blockchain
							</p>
						</div>
						<div className="flex-col justify-center w-sm space-y-4 m-auto">
							<EmailButton
								toggleEmailSignIn={toggleEmailSignIn}
							/>
							<WalletButton
								toggleConnectWallet={toggleConnectWallet}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
