"use server"

import { ErrResult, OkResult, VoteResult } from "./voteForProject"
import prisma from "@lib/prisma"
import * as session from "@utils/session"

const findVote = async (
	projectId: number,
	studentNumber: string,
): Promise<VoteResult> => {
	"use cache"

	return await prisma.vote
		.findUnique({
			where: {
				userStudentNumber_projectId: {
					projectId: projectId,
					userStudentNumber: studentNumber,
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
}

export const hasVotedForProject = async (
	projectId: number,
): Promise<VoteResult> => {
	const sessionData = await session.get()

	if (sessionData === null)
		return {
			success: false,
			error: new Error("You are not logged in"),
		}

	return findVote(projectId, sessionData.studentNumber)
}
