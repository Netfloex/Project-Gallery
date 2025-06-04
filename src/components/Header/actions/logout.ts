"use server"

import * as session from "@utils/session"

export const logout = async (): Promise<boolean> =>
	await session
		.logout()
		.then(() => true)
		.catch(() => false)
