import { ProjectsList } from "./ProjectsList"
import { getProjects } from "@actions/getProjects"

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
		<div className="container mx-auto flex flex-grow flex-col gap-8 p-8">
			<h1 className="text-center text-6xl">Project Gallery</h1>

			<div className="grid flex-grow grid-cols-1 gap-8 md:grid-cols-2">
				{lists.map((project) => (
					<ProjectsList
						key={project.name}
						projectItems={project.items}
						projectName={project.name}
						projectOverviewLink={project.link}
					/>
				))}
			</div>
		</div>
	)
}

export default Home
