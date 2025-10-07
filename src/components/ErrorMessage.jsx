export default function ErrorMessage({ message }) {
	if (!message) return null;
	return <p className="text-red-500 italic text-sm">{message}</p>;
}
