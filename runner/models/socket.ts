export type ServerData = {
	id: number
	content: string
}

export interface ServerToClientEvents {
	data: (message: ServerData) => void
}

export type ClientToServerEvents = {
	sendMessage: (message: string) => void
}

export type InterServerEvents = never

export type SocketData = never
