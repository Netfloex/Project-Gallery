import prisma from "@lib/prisma"
import { unstable_cacheTag as cacheTag } from "next/cache"

import { CacheTags } from "@typings/CacheTags"

// Find whether a project is approved or not
export const isApprovedProject = async (
	projectId: number,
): Promise<boolean> => {
	"use cache"
	cacheTag(CacheTags.projects)

	return await prisma.project
		.findUnique({ where: { id: projectId, approved: true } })
		.then((project) => project !== null)
		.catch(() => false)
}
