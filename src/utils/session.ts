import { cookieName, sessionPassword } from "./config"
import prisma from "@lib/prisma"
import * as dbUtils from "@utils/db"
import { getIronSession, IronSession } from "iron-session"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { cookies } from "next/headers"

import { CacheTags } from "@typings/CacheTags"
import { PublicUser } from "@typings/user"

type StoredSessionData = { userId: string; created: Date }

type SessionData = StoredSessionData & { user: PublicUser }

const getSessionData = async (): Promise<IronSession<StoredSessionData>> =>
	await getIronSession<SessionData>(await cookies(), {
		password: sessionPassword(),
		cookieName: cookieName,
	})

const getUser = async (userId: string): Promise<PublicUser | null> => {
	"use cache"
	cacheTag(CacheTags.users)

	return await prisma.user
		.findUnique({
			where: { id: userId },
			select: dbUtils.publicUserFilter,
		})
		.catch((error: Error) => {
			console.error(
				"Error getting user from db for session: " + error.message,
			)

			return null
		})
}

export const get = async (): Promise<SessionData | null> => {
	const session = await getSessionData()

	// If the session does not define when it is created, it does not exist.
	if (session.created === undefined) return null

	const user = await getUser(session.userId)

	if (user === null) return null

	return { ...session, user }
}

export const logout = async (): Promise<void> => {
	const session = await getSessionData()

	session.destroy()
}

export const login = async (userId: string): Promise<void> => {
	const session = await getSessionData()

	session.userId = userId
	session.created = new Date()

	await session.save()
}
