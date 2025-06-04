"use cache"

import prisma from "@lib/prisma"
import * as dbUtils from "@utils/db"

import { ApprovedProject } from "@typings/project"

interface OkResult {
	success: true
	project: ApprovedProject | null
}

interface ErrResult {
	success: false
	error: Error
}

type ApprovedProjectResult = OkResult | ErrResult

export const getApprovedProject = async (
	id: number,
): Promise<ApprovedProjectResult> =>
	await prisma.project
		.findUnique({
			// Only projects that have been approved should be shown on the dashboard.
			where: { approved: true, id: id },

			// Select only the required properties for a published project.
			select: dbUtils.approvedProjectFilter,
		})
		.then((project) => ({ success: true, project }) as OkResult)
		.catch((error: Error) => ({ success: false, error }) as ErrResult)
