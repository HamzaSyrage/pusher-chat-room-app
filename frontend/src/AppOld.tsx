// import { useEffect } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import Pusher from "pusher-js";
// import axios from "axios";
// import { useAtom } from "jotai";
// import { countAtom } from "./store/atoms";

// function App() {
// 	const [count, setCount] = useAtom(countAtom);

// 	useEffect(() => {
// 		const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
// 			cluster: import.meta.env.VITE_PUSHER_CLUSTER,
// 		});
// 		pusher.connection.bind("connected", () => {
// 			alert("Connected to Pusher!");
// 		});
// 		const channel = pusher.subscribe("counter-channel");
// 		channel.bind("counter-update", (data: { count: number }) => {
// 			setCount(data.count);
// 		});
// 		channel.bind("pusher:subscription_succeeded", () => {
// 			alert("Subscribed to channel!");
// 		});
// 		return () => {
// 			channel.unbind_all();
// 			channel.unsubscribe();
// 			pusher.disconnect();
// 		};
// 	}, [setCount]);

// 	async function incrementCounter() {
// 		try {
// 			await axios.post("http://localhost:8080/increment");
// 		} catch (error) {
// 			console.error("Failed to increment:", error);
// 		}
// 	}

// 	return (
// 		<>
// 			<div>
// 				<a href="https://vite.dev" target="_blank">
// 					<img src={viteLogo} className="logo" alt="Vite logo" />
// 				</a>
// 				<a href="https://react.dev" target="_blank">
// 					<img src={reactLogo} className="logo react" alt="React logo" />
// 				</a>
// 			</div>
// 			<h1>Vite + React</h1>
// 			<div className="card">
// 				<button onClick={incrementCounter}>count is {count}</button>
// 				<p>
// 					Edit <code>src/App.tsx</code> and save to test HMR
// 				</p>
// 			</div>
// 			<p className="read-the-docs">
// 				Click on the Vite and React logos to learn more
// 			</p>
// 		</>
// 	);
// }

// export default App;
