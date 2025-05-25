import {
	ClientToServerEvents,
	ServerToClientEvents,
} from "../../../../../runner/models/socket"
import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || undefined

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>

interface UseRunProjectReturn {
	lines: string[]
	sendMessage: (message: string) => void
}

const useValue = <T>(value: () => T): T => useState<T>(value)[0]

export const useRunProject = (projectId: number): UseRunProjectReturn => {
	const [lines, setLines] = useState<string[]>([])

	const socket = useValue<SocketType>(() =>
		io(URL, {
			autoConnect: false,
			transports: ["websocket"],
			query: {
				"project-id": projectId,
			},
		}),
	)

	useEffect(() => {
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
	}, [socket, projectId, setLines])

	const sendMessage = (message: string): void => {
		socket.emit("sendMessage", message)
	}

	return { lines, sendMessage }
}
