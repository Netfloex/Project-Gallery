import prisma from "@lib/prisma"
import * as dbUtils from "@utils/db"

import { ApprovedProject } from "@typings/project"

export const getApprovedProject = async (
	id: number,
): Promise<ApprovedProject | null> =>
	await prisma.project.findUnique({
		// Only projects that have been approved should be shown on the dashboard.
		where: { approved: true, id: id },

		// Select only the required properties for a published project.
		select: dbUtils.approvedProjectFilter,
	})
