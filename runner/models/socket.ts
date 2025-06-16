export enum ServerDataType {
	data = "data",
	connectError = "connect_error",
	announcement = "announcement",
}
export type ServerData = {
	id: number
	content: string
	type: ServerDataType
}

export interface ServerToClientEvents {
	data: (message: ServerData) => void
}

export type ClientToServerEvents = {
	sendMessage: (message: string) => void
}

export type InterServerEvents = never

export type SocketData = never
