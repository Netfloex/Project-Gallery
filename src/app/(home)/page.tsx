import { getApprovedProjects } from "../projects/actions/getApprovedProjects"
import { unstable_cache } from "next/cache"
import Link from "next/link"

import { Button, ScrollShadow } from "@heroui/react"

import ProjectCard from "@components/ProjectCard"

import type { FC } from "react"

export const dynamic = "force-dynamic"

const Home: FC = async () => {
	const getTopVotedProjectsCached = unstable_cache(
		async () => await getApprovedProjects("votes-desc", undefined, 5),
		["approved-projects", "votes-desc"],
		{ revalidate: 60 },
	)

	const topVotedProjects = await getTopVotedProjectsCached()

	const getNewlyUploadedProjectsCached = unstable_cache(
		async () => await getApprovedProjects("date-desc", undefined, 5),
		["approved-projects", "date-desc"],
		{ revalidate: 60 },
	)

	const newlyUploadedProjects = await getNewlyUploadedProjectsCached()

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
		<div className="container mx-auto flex flex-col gap-8">
			<h1 className="text-center text-6xl">Project Gallery</h1>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				{lists.map((project) => (
					<div
						className="flex grow-1 flex-col gap-4"
						key={project.name}
					>
						<p className="text-center text-3xl">{project.name}</p>
						{project.items.length !== 0 && (
							<>
								<ScrollShadow className="h-[600px]">
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
