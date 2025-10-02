"use client";

function WalletButton({ toggleConnectWallet }) {
	return (
		<button
			onClick={toggleConnectWallet}
			className="w-full bg-[#113C5E]  text-white rounded-lg px-6 py-3 font-medium hover:bg-slate-700 transition-colors duration-200 shadow-sm"
		>
			Connect Wallet
		</button>
	);
}

export default WalletButton;
