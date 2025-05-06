import { useAtom } from "jotai";
import { useState } from "react";
import { usernameAtom } from "../store/atoms";

export default function UsernameModal() {
	const [, setUsername] = useAtom(usernameAtom);
	const [tempName, setTempName] = useState("");

	const handleSubmit = () => {
		if (tempName.trim()) setUsername(tempName.trim());
	};

	return (
		<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
			<div className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col justify-center">
				<h2 className="text-lg font-semibold mb-4 text-white">
					Enter your username :
				</h2>
				<input
					type="text"
					value={tempName}
					onChange={(e) => setTempName(e.target.value)}
					className="bg-gray-700 text-white p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
				<button
					onClick={handleSubmit}
					className="bg-blue-600 hover:bg-blue-700 text-white mt-4 px-4 py-2 rounded transition-colors"
				>
					Enter
				</button>
			</div>
		</div>
	);
}
