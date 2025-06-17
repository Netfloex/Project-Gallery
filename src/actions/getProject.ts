import prisma from "@lib/prisma"
import * as dbUtils from "@utils/db"
import { unstable_cacheTag as cacheTag } from "next/cache"

import { CacheTags } from "@typings/CacheTags"
import { PublicProject } from "@typings/project"
import { PublicUser } from "@typings/user"

interface OkResult {
	success: true
	project: PublicProject | null
}

interface ErrResult {
	success: false
	error: string
}

type ProjectResult = OkResult | ErrResult

export const getProject = async (
	id: string,
	user?: PublicUser,
): Promise<ProjectResult> => {
	"use cache"

	cacheTag(CacheTags.projects)

	const whereClauses: {
		approved: boolean
		uploaderId?: string
	}[] = [{ approved: true }]

	// If there is a logged in user, show the projects that are theirs but unapproved as well.
	if (user)
		whereClauses.push({
			approved: false,
			uploaderId: user.id,
		})

	// If there is a logged in user that is a curator, show every project, approved or not.
	if (user?.role === "CURATOR")
		whereClauses.push({
			approved: false,
		})

	return await prisma.project
		.findUnique({
			// Only projects that have been approved should be shown on the dashboard.
			where: {
				OR: whereClauses,
				id: id,
			},

			// Select only the required properties for a published project.
			select: dbUtils.approvedProjectFilter,
		})
		.then((project) => ({ success: true, project }) as OkResult)
		.catch(
			(error: Error) =>
				({ success: false, error: error.toString() }) as ErrResult,
		)
}
