import Wallet from "./Wallet";
import MetamaskLogo from "/assets/metamask.svg";
import WalletConnectLogo from "/assets/walletconnect.svg";
import CoinbaseLogo from "/assets/coinbase.svg";

export default function ConnectWallet({ toggleConnectWallet }) {
	const wallets = [
		{ name: "MetaMask", icon: MetamaskLogo },
		{ name: "WalletConnect", icon: WalletConnectLogo },
		{ name: "Coinbase Wallet", icon: CoinbaseLogo },
	];

	return (
		<>
			<div
				onClick={toggleConnectWallet}
				className="absolute flex bg-[#d1cfcfc0] w-full h-screen"
			></div>
			<div className="absolute inset-0 m-auto bg-white rounded-2xl p-8 w-sm max-w-sm h-fit shadow-[0_0_20px_#00000020]">
				<h2 className="text-2xl font-semibold text-center mb-2">
					Connect a wallet
				</h2>
				<p className="text-gray-500 text-center mb-6">
					Choose a wallet
				</p>

				<div className="flex flex-col gap-4 mb-6">
					{wallets.map((wallet, idx) => (
						<Wallet wallet={wallet} key={idx} />
					))}
				</div>

				<button
					onClick={toggleConnectWallet}
					className="w-full py-3 rounded-lg blue-bg text-[#FDFBF9]"
				>
					Continue
				</button>
			</div>
		</>
	);
}
