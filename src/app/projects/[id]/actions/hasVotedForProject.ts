import { ErrResult, OkResult, VoteResult } from "./voteForProject"
import prisma from "@lib/prisma"
import { unstable_cacheTag as cacheTag } from "next/cache"

import { CacheTags } from "@typings/CacheTags"

export const hasVotedForProject = async (
	projectId: string,
	voterId: string,
): Promise<VoteResult> => {
	"use cache"
	cacheTag(CacheTags.votes)

	return await prisma.vote
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
					error: error.toString(),
				}) as ErrResult,
		)
}
