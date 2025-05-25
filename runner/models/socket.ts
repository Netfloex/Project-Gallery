export interface ServerToClientEvents {
	newLine: (message: string) => void
}

export type ClientToServerEvents = {
	sendMessage: (message: string) => void
}

export type InterServerEvents = never

export type SocketData = never
