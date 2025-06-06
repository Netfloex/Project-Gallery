"use cache"

import prisma from "@lib/prisma"
import * as dbUtils from "@utils/db"

import { PublicProject } from "@typings/project"

interface OkResult {
	success: true
	project: PublicProject | null
}

interface ErrResult {
	success: false
	error: Error
}

type ApprovedProjectResult = OkResult | ErrResult

export const getApprovedProject = async (
	id: number,
	studentNumber?: string,
): Promise<ApprovedProjectResult> => {
	const whereClauses: {
		approved: boolean
		uploaderStudentNumber?: string
	}[] = [{ approved: true }]

	// If there is a logged in user, show the projects that are theirs but unapproved as well.
	if (studentNumber)
		whereClauses.push({
			approved: false,
			uploaderStudentNumber: studentNumber,
		})

	// If there is a logged in user that is a curator, show every project, approved or not.
	// if (user.role === "CURATOR")
	// 	whereClauses.push({
	// 		approved: false,
	// 	})

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
		.catch((error: Error) => ({ success: false, error }) as ErrResult)
}
