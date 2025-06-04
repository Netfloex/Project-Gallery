"use client"

import ProjectCard from "./ProjectCard"
import { FC } from "react"

import { ScrollShadow } from "@heroui/react"

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
			<h1 className="text-center">No projects yet</h1>
		)}
	</>
)
