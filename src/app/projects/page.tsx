import { Toolbar } from "./Toolbar"
import { getProjects } from "@actions/getProjects"
import * as session from "@utils/session"
import { NextPage } from "next"
import { Suspense } from "react"
import { z } from "zod"

import ErrorPage from "@components/ErrorPage"
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

	const sessionData = await session.get()

	const projects = await getProjects({
		sort: sortOption,
		query,
		user: sessionData?.user,
	})

	return (
		<div className="container mx-auto flex flex-grow flex-col gap-4 p-4">
			<Toolbar
				searchError={searchError}
				searchQuery={query}
				sortOption={sortOption}
				sortOptionError={sortOptionError}
			/>
			<Suspense fallback={<LoadingPage />}>
				{projects.length !== 0 && (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
						{projects.map((project) => (
							<ProjectCard key={project.id} project={project} />
						))}
					</div>
				)}
				{projects.length === 0 && (
					<ErrorPage errorText="No projects found" />
				)}
			</Suspense>
		</div>
	)
}

export default Dashboard
