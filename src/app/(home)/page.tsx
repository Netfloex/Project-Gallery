import { getProjects } from "@actions/getProjects"
import Link from "next/link"

import { Button } from "@heroui/button"
import { ScrollShadow } from "@heroui/scroll-shadow"

import ProjectCard from "@components/ProjectCard"

import type { FC } from "react"

const Home: FC = async () => {
	const topVotedProjects = await getProjects({
		sort: "votes-desc",
		limit: 5,
	})

	const newlyUploadedProjects = await getProjects({ limit: 5 })

	const lists = [
		{
			name: "Highest voted projects",
			items: topVotedProjects,
			link: "/projects?sort=votes-desc",
		},
		{
			name: "Newly uploaded projects",
			items: newlyUploadedProjects,
			link: "/projects?sort=date-desc",
		},
	]

	return (
		<div className="container mx-auto flex flex-grow flex-col gap-8">
			<h1 className="text-center text-6xl">Project Gallery</h1>

			<div className="grid flex-grow grid-cols-1 gap-8 md:grid-cols-2">
				{lists.map((project) => (
					<div
						className="flex flex-grow flex-col gap-4"
						key={project.name}
					>
						<p className="text-center text-3xl">{project.name}</p>
						{project.items.length !== 0 && (
							<>
								<ScrollShadow className="max-h-[1000px]">
									<div className="flex flex-col gap-4">
										{project.items.map((project) => (
											<ProjectCard
												key={project.id}
												project={project}
											/>
										))}
									</div>
								</ScrollShadow>
								<Button
									as={Link}
									color="primary"
									href={project.link}
								>
									See all
								</Button>
							</>
						)}
						{project.items.length === 0 && (
							<h1 className="text-center">No projects yet</h1>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

export default Home
