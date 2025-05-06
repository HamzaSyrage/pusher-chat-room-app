import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import Message from "./Message";
import { messagesAtom } from "../store/atoms";

export default function MessagesList() {
	const [messages] = useAtom(messagesAtom);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: containerRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages]);

	return (
		<div
			ref={containerRef}
			className="flex-1 p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scroll-smooth overflow-y-auto scrollbar-hide"
		>
			<div className="min-h-full flex flex-col justify-end">
				{messages.map((msg, i) => (
					<Message key={i} username={msg.username} message={msg.message} />
				))}
			</div>
		</div>
	);
}
