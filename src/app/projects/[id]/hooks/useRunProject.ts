import {
	ClientToServerEvents,
	ServerToClientEvents,
} from "../../../../../runner/models/socket"
import { Dispatch, SetStateAction, useEffect } from "react"
import { io, Socket } from "socket.io-client"

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || undefined

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>

export const useRunProject = (
	projectId: number,
	setLines: Dispatch<SetStateAction<string[]>>,
): void => {
	useEffect(() => {
		const socket: SocketType = io(URL, {
			autoConnect: false,
			transports: ["websocket"],
			query: {
				"project-id": projectId,
			},
		})

		socket.connect()
		socket.on("connect", () => {
			console.log("Connected to the server")
		})
		socket.on("disconnect", () => {
			console.log("Disconnected from the server")
		})
		socket.on("newLine", (message: string) => {
			setLines((prevLines) => [...prevLines, message])
		})

		return (): void => {
			console.log("Disconnect")

			socket.off("connect")
			socket.off("disconnect")
			socket.disconnect()
		}
	}, [projectId, setLines])
}
