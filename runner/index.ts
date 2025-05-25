import { createServer } from "node:http"

import { Server } from "socket.io"

const server = createServer()
const io = new Server(server, {
	cors: {
		origin: "*",
	},
})

io.on("connection", (socket) => {
	console.log("A user connected")
	socket.on("disconnect", () => {
		console.log("A user disconnected")
	})
})

server.listen(3000)
