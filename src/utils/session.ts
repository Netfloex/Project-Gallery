import { sessionPassword } from "./config"
import { getIronSession, IronSession } from "iron-session"
import { cookies } from "next/headers"

import { PublicUser } from "@typings/user"

type SessionData = { studentNumber: string; created: Date; user: PublicUser }

const cookieName = "IRON_SESSION"

const getSessionData = async (): Promise<IronSession<SessionData>> =>
	await getIronSession<SessionData>(await cookies(), {
		password: sessionPassword(),
		cookieName: cookieName,
	})

export const get = async (): Promise<SessionData> => await getSessionData()

export const logout = async (): Promise<void> => {
	const session = await getSessionData()

	session.destroy()
}

export const login = async (
	studentNumber: string,
	user: PublicUser,
): Promise<void> => {
	const session = await getSessionData()

	session.studentNumber = studentNumber
	session.created = new Date()
	session.user = user

	await session.save()
}
