"use server"

import { getFilesForProject } from "./actions/getFilesForProject"
import { getProject } from "./actions/getProject"
import { hasVotedForProject } from "./actions/hasVotedForProject"
import { ProjectDetails } from "./ProjectDetails"
import { userIsOwnerOfProject } from "@utils/checks"
import * as session from "@utils/session"
import { NextPage } from "next"

import ErrorPage from "@components/ErrorPage"

const ProjectPage: NextPage<{
	params: Promise<{ id: string }>
}> = async ({ params }) => {
	const { id } = await params

	const sessionData = await session.get()

	const result = await getProject(id, sessionData?.user)

	if (result.success && result.project !== null) {
		const hasVotedResult = sessionData
			? await hasVotedForProject(result.project.id, sessionData?.userId)
			: { success: true, voted: false }

		const isAllowedToSeeCode = sessionData?.user
			? userIsOwnerOfProject(sessionData.user, result.project)
			: false

		const projectFiles = isAllowedToSeeCode
			? await getFilesForProject(result.project.id)
			: undefined

		return (
			<div className="container mx-auto">
				<ProjectDetails
					hasVoted={hasVotedResult.success && hasVotedResult.voted}
					project={result.project}
					projectFiles={projectFiles}
					user={sessionData?.user}
				/>
			</div>
		)
	}

	if (!result.success)
		return <ErrorPage errorText={result.error.toString()} />

	return <ErrorPage errorText="Project not found" />
}

export default ProjectPage
