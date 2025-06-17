import { getTotalProjectCount } from "./actions/getTotalProjectCount"
import { Pager } from "./Pager"
import { Toolbar } from "./Toolbar"
import { getProjects } from "@actions/getProjects"
import * as session from "@utils/session"
import { Metadata, NextPage } from "next"
import { Suspense } from "react"
import { z } from "zod"

import ErrorPage from "@components/ErrorPage"
import LoadingPage from "@components/LoadingPage"
import ProjectCard from "@components/ProjectCard"

const pageSchema = z.coerce.number()
const querySchema = z.string().max(64).optional()
const sortOptionsSchema = z
	.enum(["date-desc", "date-asc", "votes-desc", "votes-asc"])
	.default("date-desc")

export type SortOption = z.infer<typeof sortOptionsSchema>

const Dashboard: NextPage<{
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}> = async ({ searchParams }) => {
	const itemsPerPage = 16

	const params = await searchParams

	const sortParamResult = sortOptionsSchema.safeParse(params["sort"])
	const queryParamResult = querySchema.safeParse(params["q"])
	const pageParamResult = pageSchema.safeParse(params["page"])

	const query = queryParamResult.data
	const searchError = queryParamResult.error?.format()._errors.join("\n")

	const sortOption = sortParamResult.data!
	const sortOptionError = sortParamResult.error?.format()._errors.join("\n")

	const page = pageParamResult.data

	const sessionData = await session.get()

	const projectCount = await getTotalProjectCount()

	const projects = await getProjects({
		sort: sortOption,
		query,
		user: sessionData?.user,
		page: page,
		limit: itemsPerPage,
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
					<div className="flex-grow">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
							{projects.map((project) => (
								<ProjectCard
									key={project.id}
									project={project}
								/>
							))}
						</div>
					</div>
				)}
				{projects.length === 0 && (
					<ErrorPage errorText="No projects found" />
				)}
			</Suspense>
			<Pager
				currentPage={page ?? 1}
				pageCount={Math.ceil(projectCount / itemsPerPage)}
			/>
		</div>
	)
}

export const metadata: Metadata = {
	title: "Project Lists",
	description: "Browse through a collection of projects",
}

export default Dashboard
