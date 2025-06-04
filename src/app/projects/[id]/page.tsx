"use server"

import { getApprovedProject } from "./actions/getApprovedProject"
import { ProjectDetails } from "./ProjectDetails"
import * as session from "@utils/session"
import { NextPage } from "next"

import ErrorPage from "@components/ErrorPage"

const ProjectPage: NextPage<{
	params: Promise<{ id: string }>
}> = async ({ params }) => {
	const { id } = await params

	const idParsed = parseInt(id)

	if (!isNaN(idParsed)) {
		const sessionData = await session.get()

		const result = await getApprovedProject(
			idParsed,
			sessionData?.studentNumber,
		)

		if (result.success && result.project !== null)
			return (
				<div className="container mx-auto">
					<ProjectDetails project={result.project} />
				</div>
			)

		if (!result.success)
			return (
				<ErrorPage
					description={result.error.message}
					errorText={result.error.name}
				/>
			)
	}

	return <ErrorPage errorText="Project not found" />
}

export default ProjectPage
