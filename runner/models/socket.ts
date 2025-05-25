export interface ServerToClientEvents {
	newLine: (message: string) => void
}

export type ClientToServerEvents = never

export type InterServerEvents = never

export type SocketData = never
