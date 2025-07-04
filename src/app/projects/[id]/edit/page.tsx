import { getFilesForProject } from "../actions/getFilesForProject"
import { EditProjectForm } from "./EditProjectForm"
import { getProject } from "@actions/getProject"
import { userIsAllowedToModifyProject } from "@utils/checks"
import * as session from "@utils/session"
import { NextPage } from "next"

import ErrorPage from "@components/ErrorPage"

const ProjectEditPage: NextPage<{
	params: Promise<{ id: string }>
}> = async ({ params }) => {
	const { id } = await params

	const sessionData = await session.get()

	if (sessionData !== null) {
		const result = await getProject(id, sessionData.user)

		// Check if project was found and if the uploader of the project is the same as the currently logged in user
		if (
			result.success &&
			result.project !== null &&
			userIsAllowedToModifyProject(sessionData.user, result.project)
		) {
			const filesResult = await getFilesForProject(result.project.id)

			return (
				<div className="container mx-auto">
					<EditProjectForm
						file={
							filesResult.success
								? filesResult.files.join("\n")
								: ""
						}
						project={result.project}
					/>
				</div>
			)
		}
	}

	return <ErrorPage errorText="Project not found" />
}

export const metadata = {
	title: "Edit Project",
	description: "Edit your project details and files.",
}

export default ProjectEditPage
