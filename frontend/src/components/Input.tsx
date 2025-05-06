import { useState } from "react";
import { useAtom } from "jotai";
import axios from "axios";
import { usernameAtom } from "../store/atoms";

export default function Input() {
	const [text, setText] = useState("");
	const [username] = useAtom(usernameAtom);

	const sendMessage = async () => {
		if (text.trim()) {
			await axios.post(import.meta.env.VITE_API_BASE_URL, {
				username,
				message: text,
				room: "main",
			});
			setText("");
		}
	};

	return (
		<div className="p-4 border-t border-gray-700 bg-gray-900 flex gap-2">
			<input
				className="flex-1 bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				value={text}
				onChange={(e) => setText(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && sendMessage()}
				placeholder="type here"
			/>
			<button
				onClick={sendMessage}
				className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
			>
				Send
			</button>
		</div>
	);
}
