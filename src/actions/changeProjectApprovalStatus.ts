"use server"

import prisma from "@lib/prisma"
import * as session from "@utils/session"
import { revalidateTag } from "next/cache"

import { CacheTags } from "@typings/CacheTags"

export interface OkResult {
	success: true
	approved: boolean
}

export interface ErrResult {
	success: false
	error: Error
}

export type ChangeStatusResult = OkResult | ErrResult

export const changeProjectApprovalStatus = async (
	projectId: string,
	approved: boolean,
): Promise<ChangeStatusResult> => {
	const sessionData = await session.get()

	if (sessionData === null)
		return {
			success: false,
			error: new Error("You are not logged in"),
		}

	if (sessionData.user.role !== "CURATOR")
		return { success: false, error: new Error("You are not a curator") }

	return await prisma.project
		.update({
			where: { id: projectId },
			data: { approved: approved },
		})
		.then(({ approved }) => {
			revalidateTag(CacheTags.projects)

			return { success: true, approved: approved } as OkResult
		})
		.catch(
			(error: Error) =>
				({
					success: false,
					error: error,
				}) as ErrResult,
		)
}
