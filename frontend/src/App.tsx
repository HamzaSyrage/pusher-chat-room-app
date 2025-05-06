import { useEffect } from "react";
import Pusher from "pusher-js";
import { useAtom } from "jotai";
import MessagesList from "./components/MessagesList";
import Input from "./components/Input";
import UsernameModal from "./components/UserNameModal";
import { messagesAtom, showUsernameModalAtom } from "./store/atoms";
import type { MessageType } from "./util/types";

function App() {
	const [, setMessages] = useAtom(messagesAtom);
	const [showModal] = useAtom(showUsernameModalAtom);

	useEffect(() => {
		const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
			cluster: import.meta.env.VITE_PUSHER_CLUSTER,
		});

		const channel = pusher.subscribe("chat-room-main");
		channel.bind("new-message", (data: MessageType) => {
			setMessages((prev: MessageType[]) => [...prev, data]);
		});

		return () => {
			channel.unbind_all();
			channel.unsubscribe();
			pusher.disconnect();
		};
	}, [setMessages]);

	return (
		<div className="flex flex-col h-screen bg-gray-900 overflow-hidden pb-5">
			{showModal && <UsernameModal />}
			<MessagesList />
			<Input />
		</div>
	);
}

export default App;
