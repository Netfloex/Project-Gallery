import { getFilesForProject } from "../actions/getFilesForProject"
import { getProject } from "../actions/getProject"
import { EditProjectForm } from "./EditProjectForm"
import { userIsAllowedToModifyProject } from "@utils/checks"
import * as session from "@utils/session"
import { NextPage } from "next"

import ErrorPage from "@components/ErrorPage"

const ProjectEditPage: NextPage<{
	params: Promise<{ id: string }>
}> = async ({ params }) => {
	const { id } = await params

	const idParsed = parseInt(id)

	if (!isNaN(idParsed)) {
		const sessionData = await session.get()

		if (sessionData !== null) {
			const result = await getProject(idParsed, sessionData.user)

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
	}

	return <ErrorPage errorText="Project not found" />
}

export default ProjectEditPage
