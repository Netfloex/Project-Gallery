"use cache"

import { ErrResult, OkResult, VoteResult } from "./voteForProject"
import prisma from "@lib/prisma"

export const hasVotedForProject = async (
	projectId: number,
	voterId: number,
): Promise<VoteResult> =>
	await prisma.vote
		.findUnique({
			where: {
				voterId_projectId: {
					projectId: projectId,
					voterId: voterId,
				},
			},
		})
		.then((vote) => ({ success: true, voted: vote !== null }) as OkResult)
		.catch(
			(error: Error) =>
				({
					success: false,
					error: error,
				}) as ErrResult,
		)
