"use server"

import prisma from "@lib/prisma"
import { unstable_cache } from "next/cache"

import { PublishedProject } from "@typings/project"

export const getPublishedProjects = unstable_cache(
	async (): Promise<PublishedProject[]> =>
		await prisma.project.findMany({
			// Only projects that have been approved should be shown on the dashboard.
			where: { approved: true },

			// Select only the required properties for a published project.
			select: {
				name: true,
				id: true,
				description: true,
				createdAt: true,
				language: true,
			},
		}),
	["published-projects"],
)
