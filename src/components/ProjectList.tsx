import ProjectCard from "./ProjectCard"

import { Alert } from "@heroui/alert"
import { ScrollShadow } from "@heroui/scroll-shadow"

import type { FC } from "react"

import { PublicProject } from "@typings/project"

export const ProjectList: FC<{ projects: PublicProject[] }> = ({
	projects,
}) => (
	<>
		{projects.length !== 0 && (
			<ScrollShadow className="max-h-[1000px]">
				<div className="flex flex-col gap-4">
					{projects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			</ScrollShadow>
		)}
		{projects.length === 0 && (
			<Alert color="primary">No projects found</Alert>
		)}
	</>
)
