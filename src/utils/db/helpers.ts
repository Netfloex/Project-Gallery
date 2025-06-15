"use cache"

import prisma from "@lib/prisma"

// Find whether a project is approved or not
export const isApprovedProject = async (projectId: number): Promise<boolean> =>
	await prisma.project
		.findUnique({ where: { id: projectId, approved: true } })
		.then((project) => project !== null)
		.catch(() => false)
