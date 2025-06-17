"use server"

import { getFilesForProject } from "./actions/getFilesForProject"
import { hasVotedForProject } from "./actions/hasVotedForProject"
import { ProjectDetails } from "./ProjectDetails"
import { getProject } from "@actions/getProject"
import { userIsOwnerOfProject } from "@utils/checks"
import * as session from "@utils/session"
import { Metadata, NextPage } from "next"
import { cache } from "react"

import ErrorPage from "@components/ErrorPage"

const getProjectAndSessionCached = cache(async (id: string) => {
	const sessionData = await session.get()
	const result = await getProject(id, sessionData?.user)

	return { result, sessionData }
})

interface Props {
	params: Promise<{ id: string }>
}

const ProjectPage: NextPage<Props> = async ({ params }) => {
	const { id } = await params

	const { result, sessionData } = await getProjectAndSessionCached(id)

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

export const generateMetadata = async ({
	params,
}: Props): Promise<Metadata> => {
	const { id } = await params

	const { result } = await getProjectAndSessionCached(id)

	if (result.success && result.project !== null) {
		return {
			title: result.project.name,
			description: result.project.description,
		}
	}

	return {
		title: "Project not found",
		description: "The requested project could not be found.",
	}
}

export default ProjectPage
