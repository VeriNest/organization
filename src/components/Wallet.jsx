export default function Wallet({ wallet}) {
	return (
		<button
			className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 hover:border-gray-400 transition"
		>
			<img src={wallet.icon} alt={wallet.name} className="w-6 h-6" />
			<span>{wallet.name}</span>
		</button>
	);
}
