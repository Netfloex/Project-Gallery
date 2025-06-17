import {
	ClientToServerEvents,
	ServerData,
	ServerToClientEvents,
} from "../../../../../runner/models/socket"
import { runnerSocketUrl } from "@utils/config"
import { useCallback, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>

interface ClientData {
	id: number
	content: string
	isMe: true
}

type Line = ClientData | ServerData

export enum SocketStatus {
	Connected,
	Disconnected,
	Connecting,
}

interface UseRunProjectReturn {
	lines: Line[]
	sendMessage: (message: string) => void
	socketStatus: SocketStatus
	connectSocket: () => void
	disconnectSocket: () => void
}

const useValue = <T>(value: () => T): T => useState<T>(value)[0]

export const useRunProject = (projectId: string): UseRunProjectReturn => {
	const [lines, setLines] = useState<Line[]>([])

	const [socketStatus, setSocketStatus] = useState<SocketStatus>(
		SocketStatus.Disconnected,
	)

	const socket = useValue<SocketType>(() =>
		io(runnerSocketUrl, {
			autoConnect: false,
			transports: ["websocket"],
			query: {
				"project-id": projectId,
			},
		}),
	)

	const connectSocket = useCallback((): void => {
		socket.connect()
		setSocketStatus(SocketStatus.Connecting)
	}, [socket, setSocketStatus])

	const disconnectSocket = useCallback((): void => {
		socket.disconnect()
		setSocketStatus(SocketStatus.Disconnected)
	}, [socket, setSocketStatus])

	useEffect(() => {
		socket.on("connect", () => {
			console.log("Connected to the server")
			setSocketStatus(SocketStatus.Connected)
			setLines([])
		})

		socket.on("disconnect", () => {
			console.log("Disconnected from the server")
			setSocketStatus(SocketStatus.Disconnected)
		})

		socket.on("data", (message) => {
			setLines((prevLines) => [...prevLines, message])
		})

		return (): void => {
			socket.off("connect")
			socket.off("disconnect")
			socket.off("data")

			socket.disconnect()
			setSocketStatus(SocketStatus.Disconnected)
		}
	}, [socket])

	const sendMessage = (message: string): void => {
		if (socket) {
			const msg = message + "\n"

			socket.emit("sendMessage", msg)

			setLines((prevLines) => [
				...prevLines,
				{
					content: msg,
					id: Date.now(),
					isMe: true,
				},
			])
		}
	}

	return { lines, sendMessage, socketStatus, connectSocket, disconnectSocket }
}
