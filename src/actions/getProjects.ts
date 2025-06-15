import { SortOption } from "../app/projects/page"
import prisma from "@lib/prisma"
import * as dbUtils from "@utils/db"
import { unstable_cacheTag as cacheTag } from "next/cache"

import { PublicProject } from "@typings/project"
import { PublicUser } from "@typings/user"

const isVotesSortOption = (sort: SortOption): boolean =>
	sort === "votes-asc" || sort === "votes-desc"

interface ProjectsFilter {
	sort?: SortOption
	query?: string
	user?: PublicUser
	limit?: number
	includeApproved?: boolean
}

export const getProjects = async ({
	sort = "date-desc",
	query,
	user,
	limit = 50,
	includeApproved = true,
}: ProjectsFilter): Promise<PublicProject[]> => {
	"use cache"
	cacheTag("projects")

	const whereClauses: {
		approved: boolean
		uploaderId?: number
	}[] = []

	if (includeApproved) {
		whereClauses.push({
			approved: true,
		})
	}

	// If there is a logged in user, show the projects that are theirs but unapproved as well.
	if (user !== undefined)
		whereClauses.push({
			approved: false,
			uploaderId: user?.id,
		})

	// If there is a logged in user that is a curator, show every project, approved or not.
	if (user?.role === "CURATOR")
		whereClauses.push({
			approved: false,
		})

	return await prisma.project
		.findMany({
			// Only projects that have been approved should be shown on the dashboard.
			where: {
				OR: whereClauses,
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
			select: dbUtils.approvedProjectFilter,
		})
		.catch(() => [])
}
