import { GetUserProjectResult } from "./actions/getUserProjects"
import { ProfileUpdateRequestForm } from "./ProfileUpdateRequestForm"
import { ProjectUploadForm } from "./ProjectUploadForm"
import NextLink from "next/link"
import { FC } from "react"

import { Alert } from "@heroui/alert"
import { Link } from "@heroui/link"

import ProjectCard from "@components/ProjectCard"

import { PublicUser } from "@typings/user"

export const UserDetails: FC<{
	user: PublicUser
	projectResult: GetUserProjectResult
}> = ({ user, projectResult }) => (
	<div className="container mx-auto p-4">
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<ProfileUpdateRequestForm user={user} />
			<ProjectUploadForm />
		</div>
		<div className="my-4">
			<h1 className="mb-2 text-3xl">Your projects </h1>
			<Link as={NextLink} href="/projects">
				See all projects
			</Link>
		</div>
		{projectResult.success && (
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{projectResult.projects.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
				{projectResult.projects.length === 0 && (
					<Alert color="primary">No projects</Alert>
				)}
			</div>
		)}
	</div>
)
