import { sessionPassword } from "./config"
import prisma from "@lib/prisma"
import * as dbUtils from "@utils/db"
import { getIronSession, IronSession } from "iron-session"
import { cookies } from "next/headers"

import { PublicUser } from "@typings/user"

type StoredSessionData = { studentNumber: string; created: Date }

type SessionData = StoredSessionData & { user: PublicUser }

const cookieName = "IRON_SESSION"

const getSessionData = async (): Promise<IronSession<StoredSessionData>> =>
	await getIronSession<SessionData>(await cookies(), {
		password: sessionPassword(),
		cookieName: cookieName,
	})

export const get = async (): Promise<SessionData | null> => {
	const session = await getSessionData()

	// If the session does not define when it is created, it does not exist.
	if (session.created === undefined) return null

	const getUser = async (
		studentNumber: string,
	): Promise<PublicUser | null> => {
		"use cache"

		return await prisma.user
			.findUnique({
				where: { studentNumber: studentNumber },
				select: dbUtils.publicUserFilter,
			})
			.catch(() => null)
	}

	const user = await getUser(session.studentNumber)

	if (user === null) return null

	return { ...session, user }
}

export const logout = async (): Promise<void> => {
	const session = await getSessionData()

	session.destroy()
}

export const login = async (studentNumber: string): Promise<void> => {
	const session = await getSessionData()

	session.studentNumber = studentNumber
	session.created = new Date()

	await session.save()
}
