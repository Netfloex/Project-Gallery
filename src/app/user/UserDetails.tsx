import { GetUserProjectResult } from "./actions/getUserProjects"
import { ProfileUpdateRequestForm } from "./ProfileUpdateRequestForm"
import { ProjectUploadForm } from "./ProjectUploadForm"
import { FC } from "react"

import { ProjectList } from "@components/ProjectList"

import { PublicUser } from "@typings/user"

export const UserDetails: FC<{
	user: PublicUser
	projectResult: GetUserProjectResult
}> = ({ user, projectResult }) => (
	<div className="container mx-auto p-4">
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<ProfileUpdateRequestForm user={user} />
			<ProjectUploadForm />
			<div className="flex flex-col gap-4">
				<h1 className="text-3xl">Your projects</h1>
				{projectResult.success && (
					<ProjectList projects={projectResult.projects} />
				)}
			</div>
		</div>
	</div>
)
