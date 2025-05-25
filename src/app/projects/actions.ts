"use server"

import prisma from "@lib/prisma"
import { unstable_cache } from "next/cache"

import { ApprovedProject } from "@typings/project"

export const getApprovedProjects = unstable_cache(
	async (): Promise<ApprovedProject[]> =>
		await prisma.project.findMany({
			// Only projects that have been approved should be shown on the dashboard.
			where: { approved: true },

			// Select only the required properties for a published project.
			select: {
				name: true,
				id: true,
				description: true,
				createdAt: true,
				publicVotes: true,
				_count: {
					select: { votes: true },
				},
			},
		}),
	["published-projects"],
)
