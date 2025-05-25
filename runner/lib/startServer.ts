import { createServer } from "node:http"

import {
	ClientToServerEvents,
	InterServerEvents,
	ServerToClientEvents,
	SocketData,
} from "../models/socket"
import { Server } from "socket.io"

type ServerType = Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>

export const startServer = (port = 4000): ServerType => {
	const server = createServer()
	const io: ServerType = new Server(server, {
		cors: {
			origin: "*",
		},
	})

	server.listen(port, () => {
		console.log("Server is listening on port 4000")
	})

	return io
}
