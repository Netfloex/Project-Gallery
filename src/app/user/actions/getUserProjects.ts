"use cache"

import prisma from "@lib/prisma"
import * as dbUtils from "@utils/db"

import { PublicProject } from "@typings/project"

interface OkResult {
	success: true
	projects: PublicProject[]
}

interface ErrResult {
	success: false
	error: Error
}

export type GetUserProjectResult = OkResult | ErrResult

export const getUserProjects = async (
	userId: number,
): Promise<GetUserProjectResult> =>
	await prisma.project
		.findMany({
			// Only projects that belong to the user should be shown
			where: { uploaderId: userId },

			orderBy: { createdAt: "desc" },

			take: 5,

			// Select only the required properties for a published project.
			select: dbUtils.approvedProjectFilter,
		})
		.then((projects) => ({ success: true, projects }) as OkResult)
		.catch((error: Error) => ({ success: false, error }) as ErrResult)
