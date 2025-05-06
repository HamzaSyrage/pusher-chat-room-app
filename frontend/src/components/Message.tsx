import { useAtom } from "jotai";
import { usernameAtom } from "../store/atoms";
import type { MessageType } from "../util/types";

export default function Message({ username, message }: MessageType) {
	const [currentUser] = useAtom(usernameAtom);
	const isOwnMessage = username === currentUser;

	return (
		<div
			className={`flex m-0.5 ${isOwnMessage ? "justify-end" : "justify-start"}`}
		>
			<div
				className={`max-w-[70%] rounded-lg p-3 ${
					isOwnMessage
						? "bg-blue-600 text-white rounded-br-none"
						: "bg-gray-800 text-gray-100 rounded-bl-none"
				}`}
			>
				<div className="text-sm font-medium text-blue-300 mb-1">
					{!isOwnMessage && username}
				</div>
				<div className="text-gray-100 leading-relaxed break-words">
					{message}
				</div>
			</div>
		</div>
	);
}
