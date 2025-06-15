"use server"

import prisma from "@lib/prisma"
import * as session from "@utils/session"

export interface OkResult {
	success: true
	files: string[]
}

export interface ErrResult {
	success: false
	error: Error
}

export type VoteResult = OkResult | ErrResult

const getFiles = async (
	projectId: number,
	authorUserId: number,
): Promise<VoteResult> => {
	"use cache"

	return await prisma.project
		.findUnique({
			where: {
				id: projectId,
				uploaderId: authorUserId,
			},
			select: { files: true },
		})
		.then(
			(project) =>
				({
					success: true,
					files: project?.files.map((file) => file.contents),
				}) as OkResult,
		)
		.catch(
			(error: Error) =>
				({
					success: false,
					error: error,
				}) as ErrResult,
		)
}

export const getFilesForProject = async (
	projectId: number,
): Promise<VoteResult> => {
	const sessionData = await session.get()

	if (sessionData === null)
		return { success: false, error: new Error("You are not logged in") }

	return getFiles(projectId, sessionData.userId)
}
