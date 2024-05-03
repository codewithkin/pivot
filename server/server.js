const express = require("express");
const app = express();
const routes = require("./routes/main.routes.js");
const setupMiddleware = require("./middleware/setupMiddleware.middleware.js");
const server = app.listen(8000, () => console.log("Listening on port 8000"));
const { Server } = require("socket.io");

// Setup middleware
setupMiddleware(server);

// Create a new socket server
	const io = new Server(server, {
		cors: {
			// ALlow connections from the mobile app and web app
			origin: "*"
		}
	});

	// When a connection is received
	io.on("connection", socket => {
		console.log(socket.id);
		socket.on("online", name => {
			console.log(name)
			socket.broadcast.emit("connected", name || socket.id.substring(0, 5));
		})

		// When a message is received
		socket.on("message", message => {
			socket.broadcast.emit("broadcast", `${socket.id}: ${message}`)
		});

		socket.on("typing", user => {
			socket.broadcast.emit("typingAlert", `${user} is typing`);
		})

		socket.on("disconnect", user => {
			console.log(`${user} just disconnected`)
			socket.broadcast.emit("leftchat", `${user} just disconnected`);
		})
	});