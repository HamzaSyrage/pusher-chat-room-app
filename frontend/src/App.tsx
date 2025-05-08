import { useEffect } from "react";
import Pusher from "pusher-js";
import { useAtomValue, useSetAtom } from "jotai";
import MessagesList from "./components/MessagesList";
import Input from "./components/Input";
import {
	messagesAtom,
	onlineAtom,
	showUsernameModalAtom,
	usernameAtom,
} from "./store/atoms";
import type { MessageType } from "./util/types";
import UsernameModal from "./components/UsernameModal";
import Header from "./components/Header";

function App() {
	const setMessages = useSetAtom(messagesAtom);
	const setOnline = useSetAtom(onlineAtom);
	const showModal = useAtomValue(showUsernameModalAtom);
	const username = useAtomValue(usernameAtom);

	useEffect(() => {
		if (!username) return;

		const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
			cluster: import.meta.env.VITE_PUSHER_CLUSTER,
			authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/pusher/auth`,
			auth: {
				params: { username },
			},
		});

		const channel = pusher.subscribe("presence-chat-room-main");

		channel.bind("new-message", (data: MessageType) => {
			setMessages((prev) => [...prev, data]);
		});

		channel.bind(
			"pusher:subscription_succeeded",
			(members: { count: number }) => {
				setOnline(members.count);
			}
		);

		channel.bind("pusher:member_added", () => {
			setOnline((prev) => prev + 1);
		});

		channel.bind("pusher:member_removed", () => {
			setOnline((prev) => prev - 1);
		});

		return () => {
			channel.unbind_all();
			channel.unsubscribe();
			pusher.disconnect();
		};
	}, [setMessages, setOnline, username]);

	return (
		<div className="flex flex-col h-[100svh] bg-gray-900 overflow-hidden pb-5">
			{showModal && <UsernameModal />}
			<Header />
			<MessagesList />
			<Input />
		</div>
	);
}

export default App;
