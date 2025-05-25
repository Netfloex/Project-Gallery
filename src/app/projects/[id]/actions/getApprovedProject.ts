import prisma from "@lib/prisma"

import { ApprovedProject } from "@typings/project"

export const getApprovedProject = async (
	id: number,
): Promise<ApprovedProject | null> =>
	await prisma.project.findFirst({
		// Only projects that have been approved should be shown on the dashboard.
		where: { approved: true, id: id },

		// Select only the required properties for a published project.
		select: {
			name: true,
			id: true,
			description: true,
			createdAt: true,
			_count: { select: { votes: true } },
		},
	})
