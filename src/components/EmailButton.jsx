export default function EmailButton({ toggleEmailSignIn }) {
	return (
		<button
			onClick={toggleEmailSignIn}
			className="w-full bg-white px-6 py-3 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors duration-200 shadow-[0_0_9px_#113C5E40]"
		>
			<span className="blue-text font-medium">Login with Email</span>
		</button>
	);
}
