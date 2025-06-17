import Link from "next/link"
import { FC } from "react"

import { Button } from "@heroui/button"
import { ScrollShadow } from "@heroui/scroll-shadow"

import ProjectCard from "@components/ProjectCard"

import { PublicProject } from "@typings/project"

export const ProjectsList: FC<{
	projectName: string
	projectOverviewLink: string
	projectItems: PublicProject[]
}> = ({ projectName, projectItems, projectOverviewLink }) => (
	<div className="flex flex-grow flex-col gap-4" key={projectName}>
		<p className="text-center text-3xl">{projectName}</p>
		{projectItems.length !== 0 && (
			<>
				<ScrollShadow className="max-h-[1000px]">
					<div className="flex flex-col gap-4">
						{projectItems.map((project) => (
							<ProjectCard key={project.id} project={project} />
						))}
					</div>
				</ScrollShadow>
				<Button as={Link} color="primary" href={projectOverviewLink}>
					See all
				</Button>
			</>
		)}
		{projectItems.length === 0 && (
			<h1 className="text-center">No projects yet</h1>
		)}
	</div>
)
