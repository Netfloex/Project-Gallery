"use cache"

import { SortOption } from "../page"
import prisma from "@lib/prisma"
import * as dbUtils from "@utils/db"

import { PublicProject } from "@typings/project"

const isVotesSortOption = (sort: SortOption): boolean =>
	sort === "votes-asc" || sort === "votes-desc"

export const getApprovedProjects = async (
	sort: SortOption,
	query?: string,
	studentNumber?: string,
	limit = 50,
): Promise<PublicProject[]> => {
	const whereClauses: {
		approved: boolean
		uploaderStudentNumber?: string
	}[] = [{ approved: true }]

	if (studentNumber)
		whereClauses.push({
			approved: false,
			uploaderStudentNumber: studentNumber,
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
