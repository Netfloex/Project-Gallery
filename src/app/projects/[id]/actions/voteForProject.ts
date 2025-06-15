"use server"

import prisma from "@lib/prisma"
import { userIsAllowedToUseProject } from "@utils/checks"
import { isApprovedProject } from "@utils/db/helpers"
import * as session from "@utils/session"
import { revalidatePath } from "next/cache"

export interface OkResult {
	success: true
	voted: boolean
}

export interface ErrResult {
	success: false
	error: Error
}

export type VoteResult = OkResult | ErrResult

export const voteForProject = async (
	projectId: number,
	remove = false,
): Promise<VoteResult> => {
	const sessionData = await session.get()

	if (sessionData === null)
		return {
			success: false,
			error: new Error("You are not logged in"),
		}

	const isApproved = await isApprovedProject(projectId)

	if (!userIsAllowedToUseProject(sessionData.user, isApproved))
		return {
			success: false,
			error: new Error("You are not allowed to use this project"),
		}

	const votePromise = remove
		? // If remove is true, we delete the vote
			prisma.vote.delete({
				where: {
					voterId_projectId: {
						voterId: sessionData.userId,
						projectId: projectId,
					},
				},
			})
		: // Otherwise we create one
			prisma.vote.create({
				data: {
					voterId: sessionData.userId,
					projectId: projectId,
				},
			})

	return await votePromise
		.then(() => {
			// Revalidate the page for the project to show the user that their vote registered
			revalidatePath(`/projects/${projectId}`)
			revalidatePath(`/projects`)
			revalidatePath(`/`)

			return { success: true, voted: !remove } as OkResult
		})
		.catch(
			(error: Error) =>
				({
					success: false,
					error: error,
				}) as ErrResult,
		)
}
