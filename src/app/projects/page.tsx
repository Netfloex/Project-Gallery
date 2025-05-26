import { getApprovedProjects } from "./actions/getApprovedProjects"
import { Toolbar } from "./Toolbar"
import { NextPage } from "next"
import { unstable_cache } from "next/cache"
import { Suspense } from "react"
import { z } from "zod"

import LoadingPage from "@components/LoadingPage"
import ProjectCard from "@components/ProjectCard"

const querySchema = z.string().max(64).optional()
const sortOptionsSchema = z
	.enum(["date-desc", "date-asc", "votes-desc", "votes-asc"])
	.default("date-desc")

export type SortOption = z.infer<typeof sortOptionsSchema>

const Dashboard: NextPage<{
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}> = async ({ searchParams }) => {
	const params = await searchParams

	const sortParamResult = sortOptionsSchema.safeParse(params["sort"])
	const queryParamResult = querySchema.safeParse(params["q"])

	const query = queryParamResult.data
	const searchError = queryParamResult.error?.format()._errors.join("\n")

	const sortOption = sortParamResult.data!
	const sortOptionError = sortParamResult.error?.format()._errors.join("\n")

	const getProjectsCached = unstable_cache(
		async (query) => await getApprovedProjects(query, sortOption),
		["approved-projects", query ?? "", sortOption],
		{ revalidate: 5 },
	)

	const projects = await getProjectsCached(query)

	return (
		<Suspense fallback={<LoadingPage />}>
			<div className="container mx-auto flex flex-col gap-4 p-4">
				<Toolbar
					searchError={searchError}
					searchQuery={query}
					sortOption={sortOption}
					sortOptionError={sortOptionError}
				/>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
					{projects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			</div>
		</Suspense>
	)
}

export default Dashboard
