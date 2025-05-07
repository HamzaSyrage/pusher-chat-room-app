const express = require("express");
const Pusher = require("pusher");
const cors = require("cors");
require("dotenv").config();

const app = express();

// allow CORS & parse both urlencoded (Pusher) and JSON
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://ng12dff5-5173.euw.devtunnels.ms",
			"http://ng12dff5-5173.euw.devtunnels.ms",
		],
		methods: ["GET", "POST"],
		credentials: true,
	})
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID,
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: process.env.PUSHER_CLUSTER,
	useTLS: true,
});

/**
 * Presence‑channel auth endpoint.
 * Pusher will POST { socket_id, channel_name } (form data) + your extra params.
 */
app.post("/pusher/auth", (req, res) => {
	const { socket_id, channel_name, username } = req.body;
	if (!socket_id || !channel_name || !username) {
		return res
			.status(400)
			.send("socket_id, channel_name and username required");
	}

	// Build the presenceData
	const presenceData = {
		user_id: username,
		user_info: { name: username },
	};

	// Authorize the subscription
	const auth = pusher.authenticate(socket_id, channel_name, presenceData);
	res.send(auth);
});

/**
 * Broadcast a chat message.
 * Clients all subscribe to the same presence channel, so they'll all get this.
 */
app.post("/message", (req, res) => {
	const { username, message, room } = req.body;
	if (!username || !message || !room) {
		return res.status(400).send("username, message and room required");
	}

	pusher.trigger(`presence-chat-room-${room}`, "new-message", {
		username,
		message,
	});

	res.status(200).send("Message sent");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
