import React from "react";

export default function TextInput({
	type = "text",
	placeholder,
	value,
	onChange,
	error,
}) {
	return (
		<div>
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
					error
						? "focus:ring-1 focus:ring-[#ef4444]"
						: "focus:ring-1 focus:ring-blue-500"
				}`}
				style={{
					borderColor: error ? "#ef4444" : "#929895",
					color: "#2F3431",
				}}
			/>
			{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
		</div>
	);
}
