import { getApprovedProject } from "./actions/getApprovedProject"
import { ProjectDetails } from "./ProjectDetails"
import { NextPage } from "next"
import { unstable_cache } from "next/cache"

import ErrorPage from "@components/ErrorPage"

export const dynamic = "force-dynamic"

const ProjectPage: NextPage<{
	params: Promise<{ id: string }>
}> = async ({ params }) => {
	const { id } = await params

	const idParsed = parseInt(id)

	if (!isNaN(idParsed)) {
		const getProjectCached = unstable_cache(
			async (id) => await getApprovedProject(id),
			[idParsed.toString()],
			{ tags: ["approved-project"], revalidate: 60 },
		)

		const project = await getProjectCached(idParsed)

		if (project !== null)
			return (
				<div className="container mx-auto">
					<ProjectDetails project={project} />
				</div>
			)
	}

	return <ErrorPage errorText="Project not found" />
}

export default ProjectPage
