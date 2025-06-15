"use server"

import { getApprovedProject } from "./actions/getApprovedProject"
import { hasVotedForProject } from "./actions/hasVotedForProject"
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

		const result = await getApprovedProject(idParsed, sessionData?.userId)

		if (result.success && result.project !== null) {
			const hasVotedResult = sessionData
				? await hasVotedForProject(
						result.project.id,
						sessionData?.userId,
					)
				: { success: true, voted: false }

			return (
				<div className="container mx-auto">
					<ProjectDetails
						hasVoted={
							hasVotedResult.success && hasVotedResult.voted
						}
						project={result.project}
						user={sessionData?.user}
					/>
				</div>
			)
		}

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
