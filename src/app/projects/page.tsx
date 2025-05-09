import { getPublishedProjects } from "./actions"
import { NextPage } from "next"
import { Suspense } from "react"

import LoadingPage from "@components/LoadingPage"
import ProjectCard from "@components/ProjectCard"

export const dynamic = "force-dynamic"

const Dashboard: NextPage = async () => {
	const projects = await getPublishedProjects()

	return (
		<Suspense fallback={<LoadingPage />}>
			<div className="container mx-auto grid grid-cols-4 gap-4 py-4">
				{projects.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
		</Suspense>
	)
}

export default Dashboard
