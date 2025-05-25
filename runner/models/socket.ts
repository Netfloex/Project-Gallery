export type ServerLine = {
	id: number
	content: string
}

export interface ServerToClientEvents {
	newLine: (message: ServerLine) => void
}

export type ClientToServerEvents = {
	sendMessage: (message: string) => void
}

export type InterServerEvents = never

export type SocketData = never
