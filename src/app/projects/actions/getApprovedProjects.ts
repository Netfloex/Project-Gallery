import { SortOption } from "../page"
import prisma from "@lib/prisma"

import { ApprovedProject } from "@typings/project"

const isVotesSortOption = (sort: SortOption): boolean =>
	sort === "votes-asc" || sort === "votes-desc"

export const getApprovedProjects = async (
	sort: SortOption,
	query?: string,
	limit = 50,
): Promise<ApprovedProject[]> =>
	await prisma.project.findMany({
		// Only projects that have been approved should be shown on the dashboard.
		where: {
			approved: true,
			name:
				query !== undefined
					? { contains: query, mode: "insensitive" }
					: undefined,
		},

		orderBy: {
			createdAt:
				sort === "date-asc"
					? "asc"
					: sort === "date-desc"
						? "desc"
						: undefined,

			votes: isVotesSortOption(sort)
				? {
						_count:
							sort === "votes-asc"
								? "asc"
								: sort === "votes-desc"
									? "desc"
									: undefined,
					}
				: undefined,
		},

		take: limit,

		// Select only the required properties for a published project.
		select: {
			name: true,
			id: true,
			description: true,
			createdAt: true,
			uploader: {
				select: {
					name: true,
					createdAt: true,
					profilePicture: true,
					role: true,
				},
			},
			_count: {
				select: { votes: true },
			},
		},
	})
