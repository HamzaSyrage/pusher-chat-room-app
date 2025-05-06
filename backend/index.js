const express = require("express");
const Pusher = require("pusher");
const cors = require("cors");
require("dotenv").config();

const app = express();
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
app.use(express.json());

const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID,
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: process.env.PUSHER_CLUSTER,
	useTLS: true,
});

// let counter = 0;

// app.post("/increment", (req, res) => {
// 	counter += 1;

// 	pusher.trigger("counter-channel", "counter-update", {
// 		count: counter,
// 	});

// 	res.status(200).json({ count: counter });
// });

app.post("/message", (req, res) => {
	const { username, message, room } = req.body;

	pusher.trigger(`chat-room-${room}`, "new-message", {
		username,
		message,
	});

	res.status(200).send("Message sent");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
